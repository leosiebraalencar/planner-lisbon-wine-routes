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
  resolveWinalistUrl, 
  addGetYourGuideParams, 
  buildBookingAwinUrl, 
  DISCOVERCARS_AFFILIATE_URL,
  buildGoogleMapsUrl
} from "@shared/affiliateLinks";

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

interface WineryData {
  region: string;
  morning: {
    location: string;
    address: string;
    winalistKey?: string;
    getyourguideUrl?: string;
  };
  afternoon: {
    location: string;
    address: string;
    winalistKey?: string;
  };
  evening: {
    location: string;
    address: string;
  };
}

function resolveActivityUrl(
  winalistKey: string | undefined,
  getyourguideUrl: string | undefined,
  locationName: string,
  address: string
): { affiliateUrl: string; affiliateProvider: 'winalist' | 'getyourguide' | 'googlemaps' } {
  if (getyourguideUrl) {
    return {
      affiliateUrl: addGetYourGuideParams(getyourguideUrl),
      affiliateProvider: 'getyourguide'
    };
  }
  
  if (winalistKey) {
    const result = resolveWinalistUrl(winalistKey, locationName, address);
    return {
      affiliateUrl: result.url,
      affiliateProvider: result.isFallback ? 'googlemaps' : 'winalist'
    };
  }
  
  return {
    affiliateUrl: buildGoogleMapsUrl(locationName, address),
    affiliateProvider: 'googlemaps'
  };
}

const generateMockItinerary = (quizData: QuizResponse): Itinerary => {
  const days = [];
  
  const wineryData: WineryData[] = [
    {
      region: 'Região Oeste',
      morning: {
        location: 'Quinta do Gradil',
        address: 'Estrada do Gradil, 2580-081 Alenquer',
        winalistKey: 'quinta_do_gradil'
      },
      afternoon: {
        location: 'Adega Mãe',
        address: 'Quinta da Folgorosa, 2565-641 Torres Vedras',
        winalistKey: 'adega_mae'
      },
      evening: {
        location: 'Restaurante O Celeiro',
        address: 'Estrada Nacional 8, Alenquer'
      }
    },
    {
      region: 'Sintra e Colares',
      morning: {
        location: 'Adega Regional de Colares',
        address: 'Alameda do Coronel Linhares de Lima, 2705-189 Colares',
        getyourguideUrl: 'https://www.getyourguide.com/sintra-l170/wine-tour-colares-t123456'
      },
      afternoon: {
        location: 'Casal Santa Maria',
        address: 'Estrada de Colares, 2710-453 Sintra',
        winalistKey: 'casal_santa_maria'
      },
      evening: {
        location: 'Restaurante Monserrate',
        address: 'Parque de Monserrate, Sintra'
      }
    },
    {
      region: 'Bucelas e Arruda dos Vinhos',
      morning: {
        location: 'Quinta da Murta',
        address: 'Rua da Murta, 2670-701 Bucelas',
        winalistKey: 'quinta_da_murta'
      },
      afternoon: {
        location: 'Quinta de Chocapalha',
        address: 'Aldeia Galega, 2615-128 Aldeia Galega da Merceana',
        winalistKey: 'quinta_de_chocapalha'
      },
      evening: {
        location: 'Adega das Gravatas',
        address: 'Rua do Vinho, 15, Torres Vedras'
      }
    }
  ];

  for (let i = 1; i <= quizData.duration; i++) {
    const dataIndex = (i - 1) % wineryData.length;
    const data = wineryData[dataIndex];
    
    const morningResolved = resolveActivityUrl(
      data.morning.winalistKey,
      data.morning.getyourguideUrl,
      data.morning.location,
      data.morning.address
    );
    
    const afternoonResolved = resolveActivityUrl(
      data.afternoon.winalistKey,
      undefined,
      data.afternoon.location,
      data.afternoon.address
    );
    
    days.push({
      day: i,
      region: data.region,
      morning: {
        time: '09:00-12:00',
        activity: 'Visita e Degustação',
        location: data.morning.location,
        description: 'Visita guiada às vinhas e caves com degustação de vinhos premiados',
        duration: '3 horas',
        address: data.morning.address,
        affiliateUrl: morningResolved.affiliateUrl,
        affiliateProvider: morningResolved.affiliateProvider
      },
      afternoon: {
        time: '14:00-18:00',
        activity: 'Tour pela Adega',
        location: data.afternoon.location,
        description: 'Explore a produção e participe de uma prova comentada',
        duration: '4 horas',
        address: data.afternoon.address,
        affiliateUrl: afternoonResolved.affiliateUrl,
        affiliateProvider: afternoonResolved.affiliateProvider
      },
      evening: {
        time: '19:30+',
        activity: 'Jantar',
        location: data.evening.location,
        description: 'Jantar tradicional português com harmonização de vinhos locais',
        duration: '2 horas',
        address: data.evening.address,
        affiliateUrl: buildGoogleMapsUrl(data.evening.location, data.evening.address),
        affiliateProvider: 'googlemaps' as const
      }
    });
  }

  const recommendations: Itinerary['recommendations'] = {
    restaurants: [
      { name: 'Adega das Gravatas', address: 'Rua do Vinho, 15, Torres Vedras', description: 'Cozinha tradicional com excelente carta de vinhos regionais' },
      { name: 'Tasca do Celso', address: 'Praça Central, Bucelas', description: 'Petiscos portugueses autênticos' },
      { name: 'O Celeiro', address: 'Estrada Nacional 8, Alenquer', description: 'Restaurante rústico com pratos regionais' }
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
      'Vinhos premiados da região',
      'Adegas históricas centenárias',
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
