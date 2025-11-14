import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import LandingPage from "@/pages/LandingPage";
import QuizPage from "@/pages/QuizPage";
import ItineraryPage from "@/pages/ItineraryPage";
import type { QuizResponse, Itinerary } from "@shared/schema";

type AppState = 'landing' | 'quiz' | 'itinerary';

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
      restaurants: ['Adega das Gravatas', 'Tasca do Celso', 'O Celeiro'],
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
  const [state, setState] = useState<AppState>('landing');
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  const handleStartQuiz = () => {
    setState('quiz');
  };

  const handleQuizComplete = (data: QuizResponse) => {
    //todo: replace with actual API call to generate itinerary
    const generatedItinerary = generateMockItinerary(data);
    setItinerary(generatedItinerary);
    setState('itinerary');
  };

  const handleDownload = () => {
    //todo: implement Stripe payment and PDF generation
    console.log('Download itinerary');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <div className="min-h-screen">
            {state === 'landing' && <LandingPage onStartQuiz={handleStartQuiz} />}
            {state === 'quiz' && <QuizPage onComplete={handleQuizComplete} />}
            {state === 'itinerary' && itinerary && (
              <ItineraryPage itinerary={itinerary} onDownload={handleDownload} />
            )}
          </div>
          <Toaster />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
