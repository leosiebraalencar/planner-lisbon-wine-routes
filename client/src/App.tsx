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

const generateMockItinerary = (quizData: QuizResponse): Itinerary => {
  const days = [];

  const regionWineries: Record<string, WineryData[]> = {};
  REGIONS.forEach(r => {
    regionWineries[r] = ALL_WINERIES.filter(w => w.region === r);
  });

  const usedWineries = new Set<string>();

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

    if (!morningWinery) morningWinery = regionWineries[regionName][0] || ALL_WINERIES[0];
    if (!afternoonWinery) afternoonWinery = regionWineries[regionName][1] || ALL_WINERIES[1];

    const morningExp = getExperienceByBudget(morningWinery, quizData.budget);
    const afternoonExp = getExperienceByBudget(afternoonWinery, quizData.budget);

    const actualRegion = morningWinery.region;

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
      evening: {
        time: '19:30+',
        activity: 'Jantar',
        location: 'Restaurante local recomendado',
        description: 'Jantar tradicional português com harmonização de vinhos locais',
        duration: '2h',
        address: '',
        affiliateUrl: '',
        affiliateProvider: 'googlemaps' as const
      }
    });

    daysInCurrentRegion++;
    if (daysInCurrentRegion >= daysPerRegion) {
      currentRegionIndex = (currentRegionIndex + 1) % REGIONS.length;
      daysInCurrentRegion = 0;
    }
  }

  const recommendations: Itinerary['recommendations'] = {
    restaurants: [
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
    const isNearWineries = quizData.accommodationPreference === 'vinicolas_proximas';
    const bookingUrl = isNearWineries 
      ? 'https://www.booking.com/hotel/pt/areias-do-seixo.pt-pt.html'
      : 'https://www.booking.com/hotel/pt/memmo-alfama.pt-pt.html';
    
    recommendations.accommodation = isNearWineries ? {
      name: 'Areias do Seixo - Charm Hotel & Residences',
      address: 'Praia de Santa Cruz, A dos Cunhados',
      affiliateUrl: buildBookingAwinUrl(bookingUrl)
    } : {
      name: 'Hotel Memmo Alfama',
      address: 'Travessa das Merceeiras, 27, Lisboa',
      affiliateUrl: buildBookingAwinUrl(bookingUrl)
    };
  }

  return {
    id: Math.random().toString(36).substring(7),
    quizData,
    days,
    highlights: [
      'Vinhos premiados da região de Lisboa',
      'Adegas históricas e familiares',
      'Gastronomia portuguesa autêntica',
      'Paisagens deslumbrantes das vinhas'
    ],
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
