import { useState, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import LandingPage from "@/pages/LandingPage";
import QuizPage from "@/pages/QuizPage";
import ItineraryPage from "@/pages/ItineraryPage";
import SuccessPage from "@/pages/SuccessPage";
import ProPage from "@/pages/ProPage";
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

function ItineraryPageWrapper({ itinerary }: { itinerary: Itinerary | null }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!itinerary) {
      setLocation('/');
    }
  }, [itinerary, setLocation]);

  if (!itinerary) {
    return null;
  }

  return <ItineraryPage itinerary={itinerary} />;
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

const generateHighlights = (quizData: QuizResponse, days: Array<{ region: string }>): string[] => {
  const highlights: string[] = [];
  const prefs = quizData.preferences || [];

  const regions = Array.from(new Set(days.map(d => d.region)));
  if (regions.length > 0) {
    highlights.push(`Vinícolas selecionadas: ${regions.join(', ')}`);
  }

  if (prefs.includes('Degustações e vinhos exclusivos')) {
    highlights.push('Degustações e vinhos exclusivos da região');
  }
  if (prefs.includes('Gastronomia portuguesa tradicional')) {
    highlights.push('Gastronomia portuguesa tradicional e autêntica');
  }
  if (prefs.includes('Gastronomia internacional e fusion')) {
    highlights.push('Restaurantes de gastronomia internacional e fusion');
  }
  if (prefs.includes('Experiências em vinícolas históricas')) {
    highlights.push('Visita a adegas históricas e familiares');
  }
  if (prefs.includes('Paisagens, natureza e fotografia')) {
    highlights.push('Paisagens deslumbrantes e oportunidades fotográficas');
  }
  if (prefs.includes('Experiências em família com crianças')) {
    highlights.push('Atividades pensadas para toda a família');
  }
  if (prefs.includes('Vinhos biodinâmicos e sustentáveis')) {
    highlights.push('Vinhos biodinâmicos e produção sustentável');
  }
  if (prefs.includes('Tours guiados com sommelier')) {
    highlights.push('Tours guiados com sommelier especializado');
  }

  const budgetLabels: Record<string, string> = {
    economico: 'Experiências acessíveis com excelente custo-benefício',
    moderado: 'Experiências equilibradas de qualidade e valor',
    premium: 'Experiências premium e exclusivas',
  };
  if (budgetLabels[quizData.budget]) {
    highlights.push(budgetLabels[quizData.budget]);
  }

  const travelerLabels: Record<string, string> = {
    sozinho: 'Roteiro ideal para viajante solo',
    casal: 'Roteiro romântico para casal',
    familia: 'Roteiro pensado para família',
    grupo: `Roteiro para grupo de ${quizData.groupSize || ''} pessoas`.trim(),
  };
  if (travelerLabels[quizData.travelers]) {
    highlights.push(travelerLabels[quizData.travelers]);
  }

  if (quizData.wantsPrivateGuide) {
    highlights.push('Guia privado recomendado para acompanhar a viagem');
  }

  if (quizData.needsCarRental) {
    highlights.push('Aluguer de carro incluído no planeamento');
  }

  if (quizData.accommodationPreference === 'central_lisboa') {
    highlights.push('Alojamento central em Lisboa');
  } else if (quizData.accommodationPreference === 'vinicolas_proximas') {
    highlights.push('Alojamento junto às vinícolas');
  }

  if (highlights.length < 3) {
    highlights.push('Vinhos premiados da região de Lisboa');
  }

  return highlights.slice(0, 6);
};

const generateMockItinerary = (quizData: QuizResponse): Itinerary => {
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

  const getUnusedRestaurant = (region: string, forDinner: boolean): RestaurantData | undefined => {
    const candidates = ALL_RESTAURANTS.filter(r => {
      if (usedRestaurants.has(r.name)) return false;
      const regionMatch = r.region === region || r.region === 'Lisboa';
      if (!regionMatch) return false;
      if (forDinner) {
        return Object.values(r.openingHours).some(h => h !== 'Encerrado' && /19:|20:|21:|18:/.test(h));
      }
      return Object.values(r.openingHours).some(h => h !== 'Encerrado' && /1[0-2]:|09:|10:|11:/.test(h));
    });

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
    const afternoonExp = getExperienceByBudget(afternoonWinery, quizData.budget);
    const actualRegion = morningWinery.region;

    const dinnerRestaurant = getUnusedRestaurant(actualRegion, true);
    if (dinnerRestaurant) usedRestaurants.add(dinnerRestaurant.name);

    const eveningActivity = dinnerRestaurant ? {
      time: '19:30+',
      activity: 'Jantar',
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
      activity: 'Jantar',
      location: 'Restaurante local recomendado',
      description: 'Jantar tradicional português com harmonização de vinhos locais',
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
        activity: morningExp?.name || 'Visita e Degustação',
        location: morningWinery.name,
        description: `Visita guiada com degustação de vinhos`,
        duration: morningExp?.duration || '2h',
        address: morningWinery.address,
        price: morningExp?.price || 0,
        affiliateUrl: morningExp?.url || morningWinery.hostUrl || buildGoogleMapsUrl(morningWinery.name, morningWinery.address),
        affiliateProvider: (morningExp?.url || morningWinery.hostUrl) ? 'winalist' as const : 'googlemaps' as const
      },
      afternoon: {
        time: '14:00-18:00',
        activity: afternoonExp?.name || 'Tour pela Adega',
        location: afternoonWinery.name,
        description: `Explore a produção e participe de uma prova comentada`,
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
  const recommendedRestaurants = ALL_RESTAURANTS
    .filter(r => !usedRestaurants.has(r.name))
    .filter(r => usedRegions.includes(r.region) || r.region === 'Lisboa')
    .filter(r => r.budgetCategory === budgetCat || budgetCat === 'moderado')
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
      { name: 'Restaurante local na região', address: '', description: 'Cozinha tradicional com excelente carta de vinhos regionais' },
    ],
    tips: [
      'Reserve as visitas com antecedência',
      'Leve protetor solar e chapéu',
      'Câmera para registrar as paisagens',
      'Considere contratar motorista particular'
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
    highlights: generateHighlights(quizData, days),
    recommendations
  };
};

function App() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(() => {
    const stored = sessionStorage.getItem('currentItinerary');
    return stored ? JSON.parse(stored) : null;
  });

  const handleQuizComplete = (data: QuizResponse) => {
    const generatedItinerary = generateMockItinerary(data);
    setItinerary(generatedItinerary);
    sessionStorage.setItem('currentItinerary', JSON.stringify(generatedItinerary));
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
                <ItineraryPageWrapper itinerary={itinerary} />
              </Route>
              <Route path="/success">
                <SuccessPage />
              </Route>
              <Route path="/pro">
                <ProPage />
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
