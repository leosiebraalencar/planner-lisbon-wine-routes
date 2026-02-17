import { useState, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { t as translate, type Language } from "@/lib/i18n";
import LandingPage from "@/pages/LandingPage";
import QuizPage from "@/pages/QuizPage";
import ItineraryPage from "@/pages/ItineraryPage";
import SuccessPage from "@/pages/SuccessPage";
import ProPage from "@/pages/ProPage";
import AdminPage from "@/pages/AdminPage";
import type { QuizResponse, Itinerary } from "@shared/schema";
import { 
  buildBookingAwinUrl, 
  DISCOVERCARS_AFFILIATE_URL,
  buildGoogleMapsUrl
} from "@shared/affiliateLinks";
import { 
  ALL_WINERIES, 
  REGIONS, 
  getExperienceByBudget,
  type WineryData 
} from "@shared/wineryData";
import { ALL_RESTAURANTS, type RestaurantData } from "@shared/restaurantData";
import { getHotelsByBudgetAndRegion } from "@shared/hotelData";

function ItineraryPageWrapper({ itinerary, submissionId }: { itinerary: Itinerary | null; submissionId: string | null }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!itinerary) {
      setLocation('/');
    }
  }, [itinerary, setLocation]);

  if (!itinerary) {
    return null;
  }

  return <ItineraryPage itinerary={itinerary} submissionId={submissionId} />;
}

const LANGUAGE_MAP: Record<string, string[]> = {
  'portugues': ['Português', 'Portuguese'],
  'ingles': ['Inglês', 'English'],
  'espanhol': ['Espanhol', 'Spanish'],
  'frances': ['Francês', 'French'],
  'alemao': ['Alemão', 'German'],
};

const filterWineriesByLanguage = (wineries: WineryData[], langPref?: string): WineryData[] => {
  if (!langPref) return wineries;
  const langTerms = LANGUAGE_MAP[langPref] || [];
  const matching = wineries.filter(w =>
    langTerms.some(term => w.languages.toLowerCase().includes(term.toLowerCase()))
  );
  return matching.length > 0 ? matching : wineries;
};

const getBudgetForRestaurant = (budget: string): 'economico' | 'moderado' | 'premium' => {
  if (budget === 'economico') return 'economico';
  if (budget === 'moderado') return 'moderado';
  return 'premium';
};

const generateHighlights = (quizData: QuizResponse, days: Array<{ region: string }>, lang: Language): string[] => {
  const tt = (key: string, replacements?: Record<string, string>) => translate(key, lang, replacements);
  const highlights: string[] = [];
  const prefs = quizData.preferences || [];

  const regions = Array.from(new Set(days.map(d => d.region)));
  if (regions.length > 0) {
    highlights.push(`${tt('itinerary.gen.selectedWineries')}: ${regions.join(', ')}`);
  }

  if (prefs.includes('tastings')) {
    highlights.push(tt('itinerary.gen.exclusiveTastings'));
  }
  if (prefs.includes('traditionalGastronomy')) {
    highlights.push(tt('itinerary.gen.traditionalGastronomy'));
  }
  if (prefs.includes('internationalGastronomy')) {
    highlights.push(tt('itinerary.gen.internationalGastronomy'));
  }
  if (prefs.includes('historic')) {
    highlights.push(tt('itinerary.gen.historicWineries'));
  }
  if (prefs.includes('landscapes')) {
    highlights.push(tt('itinerary.gen.landscapes'));
  }
  if (prefs.includes('family')) {
    highlights.push(tt('itinerary.gen.familyActivities'));
  }
  if (prefs.includes('biodynamic')) {
    highlights.push(tt('itinerary.gen.biodynamicWines'));
  }
  if (prefs.includes('tours')) {
    highlights.push(tt('itinerary.gen.sommelierTours'));
  }

  const budgetKeys: Record<string, string> = {
    economico: 'itinerary.gen.budgetEconomico',
    moderado: 'itinerary.gen.budgetModerado',
    premium: 'itinerary.gen.budgetPremium',
  };
  if (budgetKeys[quizData.budget]) {
    highlights.push(tt(budgetKeys[quizData.budget]));
  }

  const travelerKeys: Record<string, string> = {
    sozinho: 'itinerary.gen.travelerSolo',
    casal: 'itinerary.gen.travelerCouple',
    familia: 'itinerary.gen.travelerFamily',
    grupo: 'itinerary.gen.travelerGroup',
  };
  if (travelerKeys[quizData.travelers]) {
    if (quizData.travelers === 'grupo') {
      highlights.push(tt(travelerKeys[quizData.travelers], { size: String(quizData.groupSize || '') }));
    } else {
      highlights.push(tt(travelerKeys[quizData.travelers]));
    }
  }

  if (quizData.wantsPrivateGuide) {
    highlights.push(tt('itinerary.gen.privateGuide'));
  }

  if (quizData.needsCarRental) {
    highlights.push(tt('itinerary.gen.carRentalIncluded'));
  }

  if (quizData.accommodationPreference === 'central_lisboa') {
    highlights.push(tt('itinerary.gen.centralAccommodation'));
  } else if (quizData.accommodationPreference === 'vinicolas_proximas') {
    highlights.push(tt('itinerary.gen.wineryAccommodation'));
  }

  if (highlights.length < 3) {
    highlights.push(tt('itinerary.gen.awardWines'));
  }

  return highlights.slice(0, 6);
};

const generateMockItinerary = (quizData: QuizResponse, lang: Language): Itinerary => {
  const tt = (key: string, replacements?: Record<string, string>) => translate(key, lang, replacements);
  const days = [];
  const usedWineries = new Set<string>();
  const usedRestaurants = new Set<string>();

  const filteredWineries = filterWineriesByLanguage(ALL_WINERIES, quizData.languagePreference);

  const regionWineries: Record<string, WineryData[]> = {};
  REGIONS.forEach(r => {
    regionWineries[r] = filteredWineries.filter(w => w.region === r);
  });

  const budgetCat = getBudgetForRestaurant(quizData.budget);

  const daysPerRegion = quizData.duration >= 4 ? 2 : 1;
  let currentRegionIndex = 0;
  let daysInCurrentRegion = 0;

  const getUnusedWinery = (region: string): WineryData | undefined => {
    const wineries = regionWineries[region] || [];
    return wineries.find(w => !usedWineries.has(w.name));
  };

  const findWineryAnyRegion = (): WineryData | undefined => {
    for (const r of REGIONS) {
      const w = getUnusedWinery(r);
      if (w) return w;
    }
    return undefined;
  };

  const preferredCuisines: string[] = [];
  if (quizData.preferences.includes('Gastronomia internacional e fusion')) {
    preferredCuisines.push('internacional');
  }
  if (quizData.preferences.includes('Gastronomia portuguesa tradicional')) {
    preferredCuisines.push('tradicional');
  }

  const getUnusedRestaurant = (region: string, forDinner: boolean): RestaurantData | undefined => {
    const candidates = ALL_RESTAURANTS.filter(r => {
      if (usedRestaurants.has(r.name)) return false;
      const regionMatch = r.region === region || r.region === 'Lisboa';
      if (!regionMatch) return false;
      if (r.cuisineType === 'brunch' && forDinner) return false;
      if (forDinner) {
        return Object.values(r.openingHours).some(h => h !== 'Encerrado' && /19:|20:|21:|18:/.test(h));
      }
      return Object.values(r.openingHours).some(h => h !== 'Encerrado' && /1[0-2]:|09:|10:|11:/.test(h));
    });

    if (preferredCuisines.length > 0) {
      const cuisineMatched = candidates.filter(r => preferredCuisines.includes(r.cuisineType));
      const cuisineBudget = cuisineMatched.filter(r => r.budgetCategory === budgetCat);
      if (cuisineBudget.length > 0) return cuisineBudget[0];
      if (cuisineMatched.length > 0) return cuisineMatched[0];
    }

    const budgetMatched = candidates.filter(r => r.budgetCategory === budgetCat);
    if (budgetMatched.length > 0) return budgetMatched[0];
    if (budgetCat === 'moderado') {
      const fallback = candidates.filter(r => r.budgetCategory === 'economico' || r.budgetCategory === 'moderado');
      if (fallback.length > 0) return fallback[0];
    }
    return candidates[0];
  };

  for (let i = 1; i <= quizData.duration; i++) {
    const regionName = REGIONS[currentRegionIndex];

    let morningWinery = getUnusedWinery(regionName);
    if (morningWinery) usedWineries.add(morningWinery.name);
    else {
      morningWinery = findWineryAnyRegion();
      if (morningWinery) usedWineries.add(morningWinery.name);
    }

    let afternoonWinery = getUnusedWinery(regionName);
    if (afternoonWinery) usedWineries.add(afternoonWinery.name);
    else {
      afternoonWinery = findWineryAnyRegion();
      if (afternoonWinery) usedWineries.add(afternoonWinery.name);
    }

    if (!morningWinery) morningWinery = regionWineries[regionName]?.[0] || ALL_WINERIES[0];
    if (!afternoonWinery) afternoonWinery = regionWineries[regionName]?.[1] || ALL_WINERIES[1];

    const morningExp = getExperienceByBudget(morningWinery, quizData.budget);
    let afternoonExp = getExperienceByBudget(afternoonWinery, quizData.budget);
    if (afternoonExp && /brunch/i.test(afternoonExp.name)) {
      const alt = afternoonWinery.experiences.find(e => !/brunch/i.test(e.name));
      afternoonExp = alt || afternoonExp;
    }
    const actualRegion = morningWinery.region;

    const dinnerRestaurant = getUnusedRestaurant(actualRegion, true);
    if (dinnerRestaurant) usedRestaurants.add(dinnerRestaurant.name);

    const eveningActivity = dinnerRestaurant ? {
      time: '19:30+',
      activity: tt('itinerary.gen.dinner'),
      location: dinnerRestaurant.name,
      description: dinnerRestaurant.description,
      duration: '2h',
      address: dinnerRestaurant.address,
      price: dinnerRestaurant.averagePrice,
      affiliateUrl: dinnerRestaurant.link,
      affiliateProvider: dinnerRestaurant.isTheFork ? 'thefork' as const : 'direct' as const,
      isTheFork: dinnerRestaurant.isTheFork,
      theForkPromoCode: dinnerRestaurant.theForkPromoCode || undefined,
    } : {
      time: '19:30+',
      activity: tt('itinerary.gen.dinner'),
      location: tt('itinerary.gen.localRestaurant'),
      description: tt('itinerary.gen.traditionalDinner'),
      duration: '2h',
      address: '',
      affiliateUrl: '',
      affiliateProvider: 'googlemaps' as const,
    };

    days.push({
      day: i,
      region: actualRegion,
      morning: {
        time: '09:00-12:00',
        activity: morningExp?.name || tt('itinerary.gen.visitAndTasting'),
        location: morningWinery.name,
        description: tt('itinerary.gen.guidedVisitWithTasting'),
        duration: morningExp?.duration || '2h',
        address: morningWinery.address,
        price: morningExp?.price || 0,
        affiliateUrl: morningExp?.url || morningWinery.hostUrl || buildGoogleMapsUrl(morningWinery.name, morningWinery.address),
        affiliateProvider: (morningExp?.url || morningWinery.hostUrl) ? 'winalist' as const : 'googlemaps' as const
      },
      afternoon: {
        time: '14:00-18:00',
        activity: afternoonExp?.name || tt('itinerary.gen.cellarTour'),
        location: afternoonWinery.name,
        description: tt('itinerary.gen.exploreAndTaste'),
        duration: afternoonExp?.duration || '2h',
        address: afternoonWinery.address,
        price: afternoonExp?.price || 0,
        affiliateUrl: afternoonExp?.url || afternoonWinery.hostUrl || buildGoogleMapsUrl(afternoonWinery.name, afternoonWinery.address),
        affiliateProvider: (afternoonExp?.url || afternoonWinery.hostUrl) ? 'winalist' as const : 'googlemaps' as const
      },
      evening: eveningActivity
    });

    daysInCurrentRegion++;
    if (daysInCurrentRegion >= daysPerRegion) {
      currentRegionIndex = (currentRegionIndex + 1) % REGIONS.length;
      daysInCurrentRegion = 0;
    }
  }

  const usedRegions = Array.from(new Set(days.map(d => d.region)));
  const filteredForRec = ALL_RESTAURANTS
    .filter(r => !usedRestaurants.has(r.name))
    .filter(r => usedRegions.includes(r.region) || r.region === 'Lisboa')
    .filter(r => r.budgetCategory === budgetCat || budgetCat === 'moderado');

  let recommendedList = filteredForRec;
  if (preferredCuisines.length > 0) {
    const cuisineFirst = filteredForRec.filter(r => preferredCuisines.includes(r.cuisineType));
    const rest = filteredForRec.filter(r => !preferredCuisines.includes(r.cuisineType));
    recommendedList = [...cuisineFirst, ...rest];
  }

  const recommendedRestaurants = recommendedList
    .slice(0, 3)
    .map(r => ({
      name: r.name,
      address: r.address,
      description: r.description,
      price: r.averagePrice,
      affiliateUrl: r.link,
      isTheFork: r.isTheFork,
      theForkPromoCode: r.theForkPromoCode || undefined,
    }));

  const recommendations: Itinerary['recommendations'] = {
    restaurants: recommendedRestaurants.length > 0 ? recommendedRestaurants : [
      { name: tt('itinerary.gen.localRestaurantRegion'), address: '', description: tt('itinerary.gen.fallbackRestaurant') },
    ],
    tips: [
      tt('itinerary.gen.tipReserve'),
      tt('itinerary.gen.tipSunscreen'),
      tt('itinerary.gen.tipCamera'),
      tt('itinerary.gen.tipDriver'),
    ]
  };

  if (quizData.needsCarRental) {
    recommendations.carRental = {
      provider: 'DiscoverCars',
      affiliateUrl: DISCOVERCARS_AFFILIATE_URL
    };
  }

  if (!quizData.hasAccommodation) {
    const wantsCenter = quizData.accommodationPreference === 'central_lisboa';
    const hotelRegion = wantsCenter ? 'Lisboa' : (days[0]?.region || 'Lisboa');
    const matchedHotels = getHotelsByBudgetAndRegion(quizData.budget, hotelRegion);

    const nonGenericHotels = matchedHotels.filter(h => !h.isGenericListing);
    const genericHotels = matchedHotels.filter(h => h.isGenericListing);

    const diverseHotels: typeof matchedHotels = [];
    const seenRegions = new Set<string>();
    for (const h of nonGenericHotels) {
      if (!seenRegions.has(h.region) || diverseHotels.length < 3) {
        diverseHotels.push(h);
        seenRegions.add(h.region);
      }
    }
    for (const h of genericHotels) {
      if (diverseHotels.length < 4) {
        diverseHotels.push(h);
      }
    }

    if (!wantsCenter && diverseHotels.length < 4) {
      const extraLisboa = getHotelsByBudgetAndRegion(quizData.budget, 'Lisboa')
        .filter(h => !diverseHotels.some(d => d.name === h.name))
        .slice(0, 4 - diverseHotels.length);
      diverseHotels.push(...extraLisboa);
    }

    if (diverseHotels.length > 0) {
      const topHotel = diverseHotels.find(h => !h.isGenericListing) || diverseHotels[0];
      recommendations.accommodation = {
        name: topHotel.name,
        address: topHotel.region,
        affiliateUrl: topHotel.affiliateUrl,
      };
    }

    recommendations.hotels = diverseHotels.slice(0, 4).map(h => ({
      name: h.name,
      description: h.description,
      budgetCategory: h.budgetCategory,
      affiliateUrl: h.affiliateUrl,
    }));
  }

  return {
    id: Math.random().toString(36).substring(7),
    quizData,
    days,
    highlights: generateHighlights(quizData, days, lang),
    recommendations
  };
};

function App() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(() => {
    const stored = sessionStorage.getItem('currentItinerary');
    return stored ? JSON.parse(stored) : null;
  });
  const [submissionId, setSubmissionId] = useState<string | null>(() => {
    return sessionStorage.getItem('currentSubmissionId');
  });

  const handleQuizComplete = async (data: QuizResponse) => {
    const currentLang = (sessionStorage.getItem('selectedLanguage') || 'PT') as Language;
    const generatedItinerary = generateMockItinerary(data, currentLang);
    setItinerary(generatedItinerary);
    sessionStorage.setItem('currentItinerary', JSON.stringify(generatedItinerary));

    try {
      const res = await fetch('/api/quiz-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: data.customerName || 'Anonymous',
          quizData: data,
          language: currentLang,
        }),
      });
      const result = await res.json();
      if (result.id) {
        setSubmissionId(result.id);
        sessionStorage.setItem('currentSubmissionId', result.id);
      }
    } catch (err) {
      console.error('Failed to save quiz submission:', err);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <div className="min-h-screen">
            <Switch>
              <Route path="/quiz">
                <QuizPage onComplete={handleQuizComplete} />
              </Route>
              <Route path="/itinerary">
                <ItineraryPageWrapper itinerary={itinerary} submissionId={submissionId} />
              </Route>
              <Route path="/success">
                <SuccessPage />
              </Route>
              <Route path="/pro">
                <ProPage />
              </Route>
              <Route path="/data-admin">
                <AdminPage />
              </Route>
              <Route path="/">
                <LandingPage />
              </Route>
            </Switch>
          </div>
          <Toaster />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
