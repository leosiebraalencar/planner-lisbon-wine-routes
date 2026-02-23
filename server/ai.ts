import OpenAI from 'openai';
import type { Itinerary, RoadTripGuide } from '@shared/schema';
import { buildGoogleMapsRouteUrl } from '@shared/geoUtils';

let _openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!_openai) {
    const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
    if (baseURL) {
      _openai = new OpenAI({
        baseURL: baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL,
        apiKey: 'replit',
        defaultHeaders: {
          'Authorization': 'Bearer replit',
        },
      });
    } else if (process.env.OPENAI_API_KEY) {
      _openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } else {
      throw new Error('No AI service configured. Set AI_INTEGRATIONS_OPENAI_BASE_URL or OPENAI_API_KEY.');
    }
  }
  return _openai;
}

const LANG_LABELS: Record<string, string> = {
  PT: 'Portuguese',
  EN: 'English',
  ES: 'Spanish',
  DE: 'German',
};

function extractDayStops(itinerary: Itinerary) {
  return itinerary.days.map(day => {
    const stops: { name: string; address?: string; time: string; type: string }[] = [];

    if (day.carRentalPickup) {
      stops.push({
        name: day.carRentalPickup.provider,
        address: 'Lisbon Airport area',
        time: '08:00',
        type: 'car_rental',
      });
    }

    if (day.hotel) {
      stops.push({
        name: day.hotel.name,
        address: undefined,
        time: '08:30',
        type: 'hotel_departure',
      });
    }

    stops.push({
      name: day.morning.location,
      address: day.morning.address,
      time: day.morning.time,
      type: 'winery',
    });

    if (day.afternoon.location !== day.morning.location) {
      stops.push({
        name: day.afternoon.location,
        address: day.afternoon.address,
        time: day.afternoon.time,
        type: day.afternoon.affiliateProvider === 'thefork' ? 'restaurant' : 'winery',
      });
    }

    stops.push({
      name: day.evening.location,
      address: day.evening.address,
      time: day.evening.time,
      type: 'restaurant',
    });

    if (day.hotel) {
      stops.push({
        name: day.hotel.name,
        address: undefined,
        time: '22:00',
        type: 'hotel_return',
      });
    }

    return { dayNumber: day.day, region: day.region, stops };
  });
}

function buildGoogleMapsLinks(itinerary: Itinerary) {
  const links: { dayNumber: number; label: string; url: string }[] = [];

  for (const day of itinerary.days) {
    const addresses: string[] = [];

    if (day.carRentalPickup) {
      addresses.push('Lisbon Airport, Portugal');
    } else if (day.hotel) {
      addresses.push(day.hotel.name + ', Portugal');
    }

    if (day.morning.address) addresses.push(day.morning.address);
    else addresses.push(day.morning.location + ', Portugal');

    if (day.afternoon.address && day.afternoon.location !== day.morning.location) {
      addresses.push(day.afternoon.address);
    } else if (day.afternoon.location !== day.morning.location) {
      addresses.push(day.afternoon.location + ', Portugal');
    }

    if (day.evening.address) addresses.push(day.evening.address);
    else addresses.push(day.evening.location + ', Portugal');

    if (addresses.length >= 2) {
      const origin = addresses[0];
      const destination = addresses[addresses.length - 1];
      const waypoints = addresses.slice(1, -1);
      const url = buildGoogleMapsRouteUrl(origin, destination, waypoints);
      links.push({
        dayNumber: day.day,
        label: `Day ${day.day}: ${day.region}`,
        url,
      });
    }
  }

  return links;
}

function buildPrompt(itinerary: Itinerary, lang: string): string {
  const langLabel = LANG_LABELS[lang] || 'English';
  const dayStops = extractDayStops(itinerary);
  const quiz = itinerary.quizData;

  const travelerProfile = [
    `Budget: ${quiz.budget}`,
    `Travelers: ${quiz.travelers}${quiz.groupSize ? ` (${quiz.groupSize} people)` : ''}`,
    `Duration: ${quiz.duration} days`,
    quiz.preferences.length > 0 ? `Preferences: ${quiz.preferences.join(', ')}` : '',
    quiz.specialRequests ? `Special requests: ${quiz.specialRequests}` : '',
    quiz.arrival ? `Arrival: ${quiz.arrival}` : '',
    quiz.needsCarRental ? 'Has car rental booked via DiscoverCars' : 'No car rental',
  ].filter(Boolean).join('\n');

  const routeDetails = dayStops.map(day => {
    const stopList = day.stops.map((s, i) =>
      `  ${i + 1}. [${s.type}] ${s.name}${s.address ? ` - ${s.address}` : ''} (${s.time})`
    ).join('\n');
    return `Day ${day.dayNumber} (${day.region}):\n${stopList}`;
  }).join('\n\n');

  return `You are a "Premium Road Trip Guide Generator" for wine tourism in the Lisbon region of Portugal.
Write as an experienced human narrator-guide with actionable instructions. Avoid generic phrases and AI-sounding text.
Do NOT sound like a blog or an automated list. Use travel rhythm: departure, first stop, small milestones, real alerts.
Use practical details, micro-decisions, and checklists. Be concise but thorough.

LANGUAGE: Write everything in ${langLabel}.

TRAVELER PROFILE:
${travelerProfile}

ITINERARY ROUTE (all stops with addresses):
${routeDetails}

CAR RENTAL: ${quiz.needsCarRental ? 'Yes, via DiscoverCars (pickup at Lisbon Airport area)' : 'No car rental needed'}

RULES:
- Include micro-decisions: "if hungry, stop at X", "if fuel below 1/2, refuel before leaving urban area"
- Include 2-3 narrative moments per day (without exaggeration)
- Use realistic navigation language: "exit parking", "look for the sign", "stay in right lane", but do NOT invent street names
- Include safety: documents, car inspection, damage photos, fuel policy, speed cameras
- Focus on wine tourism, luxury tourism, gastronomy, culture, and authentic Portuguese experiences
- The audience avoids mass tourism, values quality, culture, sustainability, and authenticity

You MUST respond with a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "carPickupChecklist": ["item1", "item2", ...],
  "narratedBlocks": [
    {
      "title": "block title",
      "content": "narrated paragraph",
      "tip": "optional practical tip",
      "alert": "optional safety alert",
      "suggestion": "optional suggestion for a stop or detour"
    }
  ],
  "whatToBring": {
    "documents": ["item1", ...],
    "comfort": ["item1", ...],
    "safety": ["item1", ...],
    "technology": ["item1", ...],
    "climate": ["item1", ...]
  },
  "drivingTips": ["tip1", "tip2", ...],
  "planB": [
    { "scenario": "if it rains", "solution": "what to do" },
    { "scenario": "traffic jam", "solution": "alternative" },
    { "scenario": "delay at car pickup", "solution": "adjustment" }
  ],
  "googleMapsLinks": [],
  "summary": "5-line max summary of the entire road trip"
}

For narratedBlocks, create blocks for:
- "Before departure (2-4 min)" with pre-trip prep
- For each day: "Day X departure", "Day X main stretch", "Day X arrival and approach" covering the connections between stops
- Include specific references to the wineries, restaurants, and hotels in the itinerary

For carPickupChecklist: 5-9 items about inspecting the rental car, documents needed, fuel policy check, etc.
${!quiz.needsCarRental ? 'Since no car rental, make the checklist about general driving preparation instead.' : ''}

Leave googleMapsLinks as an empty array (these will be generated separately).

IMPORTANT: Respond ONLY with the JSON object. No explanations, no markdown formatting.`;
}

export async function generateRoadTripGuide(
  itinerary: Itinerary,
  lang: string
): Promise<RoadTripGuide> {
  const prompt = buildPrompt(itinerary, lang);
  const googleMapsLinks = buildGoogleMapsLinks(itinerary);

  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a premium wine tourism road trip guide generator for Portugal. Always respond with valid JSON only.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from AI');
  }

  const parsed = JSON.parse(content);

  parsed.googleMapsLinks = googleMapsLinks;

  if (!parsed.carPickupChecklist || !Array.isArray(parsed.carPickupChecklist)) {
    parsed.carPickupChecklist = [];
  }
  if (!parsed.narratedBlocks || !Array.isArray(parsed.narratedBlocks)) {
    parsed.narratedBlocks = [];
  }
  if (!parsed.whatToBring) {
    parsed.whatToBring = { documents: [], comfort: [], safety: [], technology: [], climate: [] };
  }
  if (!parsed.drivingTips || !Array.isArray(parsed.drivingTips)) {
    parsed.drivingTips = [];
  }
  if (!parsed.planB || !Array.isArray(parsed.planB)) {
    parsed.planB = [];
  }
  if (!parsed.summary) {
    parsed.summary = '';
  }

  return parsed as RoadTripGuide;
}
