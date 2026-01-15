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

//todo: remove mock functionality
const generateMockItinerary = (quizData: QuizResponse): Itinerary => {
  const days = [];
  for (let i = 1; i <= quizData.duration; i++) {
    days.push({
      day: i,
      region: i === 1 ? 'Região Oeste' : i === 2 ? 'Sintra e Colares' : 'Bucelas e Arruda dos Vinhos',
      morning: {
        time: '09:00-12:00',
        activity: 'Visita e Degustação',
        location: i === 1 ? 'Quinta do Gradil' : i === 2 ? 'Adega Regional de Colares' : 'Quinta da Murta',
        description: 'Visita guiada às vinhas e caves com degustação de vinhos premiados',
        duration: '3 horas'
      },
      afternoon: {
        time: '14:00-18:00',
        activity: 'Tour pela Adega',
        location: i === 1 ? 'Adega Mãe' : i === 2 ? 'Casal Santa Maria' : 'Quinta de Chocapalha',
        description: 'Explore a produção e participe de uma prova comentada',
        duration: '4 horas'
      },
      evening: {
        time: '19:30+',
        activity: 'Jantar',
        location: i === 1 ? 'Restaurante O Celeiro' : i === 2 ? 'Restaurante Monserrate' : 'Adega das Gravatas',
        description: 'Jantar tradicional português com harmonização de vinhos locais',
        duration: '2 horas'
      }
    });
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
    recommendations: {
      restaurants: [
        { name: 'Adega das Gravatas', address: 'Rua do Vinho, 15, Torres Vedras' },
        { name: 'Tasca do Celso', address: 'Praça Central, Bucelas' },
        { name: 'O Celeiro', address: 'Estrada Nacional 8, Alenquer' }
      ],
      tips: [
        'Reserve as visitas com antecedência',
        'Leve protetor solar e chapéu',
        'Câmera para registrar as paisagens',
        'Considere contratar motorista particular'
      ]
    }
  };
};

function App() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(() => {
    const stored = sessionStorage.getItem('currentItinerary');
    return stored ? JSON.parse(stored) : null;
  });

  const handleQuizComplete = (data: QuizResponse) => {
    //todo: replace with actual API call to generate itinerary
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
