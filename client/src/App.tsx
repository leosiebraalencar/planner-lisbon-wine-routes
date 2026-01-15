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

interface WineryInfo {
  location: string;
  address: string;
  winalistKey?: string;
  getyourguideUrl?: string;
}

interface RestaurantInfo {
  location: string;
  address: string;
}

interface RegionData {
  region: string;
  wineries: WineryInfo[];
  restaurants: RestaurantInfo[];
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
  
  // All regions with multiple wineries each (no repetition possible)
  const regionData: RegionData[] = [
    {
      region: 'Região Oeste',
      wineries: [
        { location: 'Quinta do Gradil', address: 'Estrada do Gradil, 2580-081 Alenquer', winalistKey: 'quinta_do_gradil' },
        { location: 'Adega Mãe', address: 'Quinta da Folgorosa, 2565-641 Torres Vedras', winalistKey: 'adega_mae' },
        { location: 'Quinta da Lapa', address: 'Rua da Lapa, 2580-341 Alenquer' },
        { location: 'Quinta do Monte d\'Oiro', address: 'Estrada Nacional 1, 2580-081 Alenquer' }
      ],
      restaurants: [
        { location: 'Restaurante O Celeiro', address: 'Estrada Nacional 8, Alenquer' },
        { location: 'Tasca da Vinha', address: 'Largo Central, Torres Vedras' }
      ]
    },
    {
      region: 'Sintra e Colares',
      wineries: [
        { location: 'Adega Regional de Colares', address: 'Alameda do Coronel Linhares de Lima, 2705-189 Colares', getyourguideUrl: 'https://www.getyourguide.com/sintra-l170/wine-tour-colares-t123456' },
        { location: 'Casal Santa Maria', address: 'Estrada de Colares, 2710-453 Sintra', winalistKey: 'casal_santa_maria' },
        { location: 'Quinta da Folgorosa', address: 'Estrada de Colares, 2710-405 Sintra' },
        { location: 'Adega Viúva Gomes', address: 'Rua de Colares, 2710-421 Colares' }
      ],
      restaurants: [
        { location: 'Restaurante Monserrate', address: 'Parque de Monserrate, Sintra' },
        { location: 'Incomum by Luis Santos', address: 'Rua Dr. Alfredo Costa, Sintra' }
      ]
    },
    {
      region: 'Bucelas e Arruda',
      wineries: [
        { location: 'Quinta da Murta', address: 'Rua da Murta, 2670-701 Bucelas', winalistKey: 'quinta_da_murta' },
        { location: 'Quinta de Chocapalha', address: 'Aldeia Galega, 2615-128 Aldeia Galega da Merceana', winalistKey: 'quinta_de_chocapalha' },
        { location: 'Quinta da Romeira', address: 'Estrada de Bucelas, 2670-575 Bucelas' },
        { location: 'Casa Santos Lima', address: 'Quinta da Boavista, 2070-043 Cartaxo' }
      ],
      restaurants: [
        { location: 'Adega das Gravatas', address: 'Rua do Vinho, 15, Torres Vedras' },
        { location: 'Restaurante Típico Bucelas', address: 'Praça Miguel Bombarda, Bucelas' }
      ]
    },
    {
      region: 'Setúbal e Azeitão',
      wineries: [
        { location: 'José Maria da Fonseca', address: 'Rua José Augusto Coelho, 2925-901 Azeitão' },
        { location: 'Bacalhôa Vinhos', address: 'Estrada Nacional 10, 2925-901 Azeitão' },
        { location: 'Quinta de Alcube', address: 'Estrada de Palmela, 2950-805 Palmela' },
        { location: 'Casa Ermelinda Freitas', address: 'Estrada Nacional 379, 2965-575 Fernando Pó' }
      ],
      restaurants: [
        { location: 'O Velho e o Mar', address: 'Largo da Ribeira, Setúbal' },
        { location: 'Ribamar', address: 'Av. Luísa Todi, 2900-461 Setúbal' }
      ]
    },
    {
      region: 'Palmela',
      wineries: [
        { location: 'Venâncio da Costa Lima', address: 'Rua das Vinhas, 2950-703 Palmela' },
        { location: 'Cooperativa de Palmela', address: 'Rua da Adega, 2950-217 Palmela' },
        { location: 'Quinta do Piloto', address: 'Estrada Nacional 252, 2950-421 Palmela' },
        { location: 'Adega de Pegões', address: 'Herdade do Monte Novo, 2985-117 Pegões' }
      ],
      restaurants: [
        { location: 'Pousada de Palmela', address: 'Castelo de Palmela, 2950-317 Palmela' },
        { location: 'Taberna Ideal', address: 'Praça de Palmela, 2950-203 Palmela' }
      ]
    }
  ];

  // Track used wineries to avoid repetition
  const usedWineries = new Set<string>();
  
  // For 4+ days, stay 2 days in same region before moving on
  // For 1-3 days, change region each day
  const daysPerRegion = quizData.duration >= 4 ? 2 : 1;
  let currentRegionIndex = 0;
  let daysInCurrentRegion = 0;
  
  for (let i = 1; i <= quizData.duration; i++) {
    const region = regionData[currentRegionIndex];
    
    // Get two wineries from current region that haven't been used
    let morningWinery: WineryInfo | undefined;
    let afternoonWinery: WineryInfo | undefined;
    
    for (const winery of region.wineries) {
      if (!usedWineries.has(winery.location)) {
        if (!morningWinery) {
          morningWinery = winery;
          usedWineries.add(winery.location);
        } else if (!afternoonWinery) {
          afternoonWinery = winery;
          usedWineries.add(winery.location);
          break;
        }
      }
    }
    
    // If we couldn't find unused wineries in this region, move to next region
    if (!morningWinery || !afternoonWinery) {
      currentRegionIndex = (currentRegionIndex + 1) % regionData.length;
      const nextRegion = regionData[currentRegionIndex];
      for (const winery of nextRegion.wineries) {
        if (!usedWineries.has(winery.location)) {
          if (!morningWinery) {
            morningWinery = winery;
            usedWineries.add(winery.location);
          } else if (!afternoonWinery) {
            afternoonWinery = winery;
            usedWineries.add(winery.location);
            break;
          }
        }
      }
    }
    
    // Final fallback (should never happen with 20 wineries and max 5 days)
    if (!morningWinery) morningWinery = region.wineries[0];
    if (!afternoonWinery) afternoonWinery = region.wineries[1];
    
    const restaurant = region.restaurants[daysInCurrentRegion % region.restaurants.length];
    
    const morningResolved = resolveActivityUrl(
      morningWinery.winalistKey,
      morningWinery.getyourguideUrl,
      morningWinery.location,
      morningWinery.address
    );
    
    const afternoonResolved = resolveActivityUrl(
      afternoonWinery.winalistKey,
      undefined,
      afternoonWinery.location,
      afternoonWinery.address
    );
    
    days.push({
      day: i,
      region: region.region,
      morning: {
        time: '09:00-12:00',
        activity: 'Visita e Degustação',
        location: morningWinery.location,
        description: 'Visita guiada às vinhas e caves com degustação de vinhos premiados',
        duration: '3 horas',
        address: morningWinery.address,
        affiliateUrl: morningResolved.affiliateUrl,
        affiliateProvider: morningResolved.affiliateProvider
      },
      afternoon: {
        time: '14:00-18:00',
        activity: 'Tour pela Adega',
        location: afternoonWinery.location,
        description: 'Explore a produção e participe de uma prova comentada',
        duration: '4 horas',
        address: afternoonWinery.address,
        affiliateUrl: afternoonResolved.affiliateUrl,
        affiliateProvider: afternoonResolved.affiliateProvider
      },
      evening: {
        time: '19:30+',
        activity: 'Jantar',
        location: restaurant.location,
        description: 'Jantar tradicional português com harmonização de vinhos locais',
        duration: '2 horas',
        address: restaurant.address,
        affiliateUrl: buildGoogleMapsUrl(restaurant.location, restaurant.address),
        affiliateProvider: 'googlemaps' as const
      }
    });
    
    // Track days in current region and move to next when needed
    daysInCurrentRegion++;
    if (daysInCurrentRegion >= daysPerRegion) {
      currentRegionIndex = (currentRegionIndex + 1) % regionData.length;
      daysInCurrentRegion = 0;
    }
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
