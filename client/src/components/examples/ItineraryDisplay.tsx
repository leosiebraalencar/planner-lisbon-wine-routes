import ItineraryDisplay from '../ItineraryDisplay';
import type { Itinerary } from '@shared/schema';

//todo: remove mock functionality
const mockItinerary: Itinerary = {
  id: '123',
  quizData: {
    duration: 3,
    budget: 'moderado',
    travelers: 'casal',
    preferences: ['Vinícolas históricas', 'Degustações', 'Gastronomia']
  },
  days: [
    {
      day: 1,
      region: 'Região Oeste',
      morning: {
        time: '09:00-12:00',
        activity: 'Visita e Degustação',
        location: 'Quinta do Gradil',
        description: 'Visita guiada às vinhas e caves históricas com degustação de 3 vinhos premiados e azeite artesanal',
        duration: '3 horas'
      },
      afternoon: {
        time: '14:00-18:00',
        activity: 'Tour pela Adega',
        location: 'Adega Mãe',
        description: 'Explore a adega moderna e participe de uma prova comentada de vinhos biodinâmicos',
        duration: '4 horas'
      },
      evening: {
        time: '19:30+',
        activity: 'Jantar',
        location: 'Restaurante O Celeiro',
        description: 'Jantar tradicional português com harmonização de vinhos locais',
        duration: '2 horas'
      }
    },
    {
      day: 2,
      region: 'Sintra e Colares',
      morning: {
        time: '10:00-13:00',
        activity: 'Visita Histórica',
        location: 'Adega Regional de Colares',
        description: 'Degustação exclusiva do raro vinho de Ramisco em adega centenária',
        duration: '3 horas'
      },
      afternoon: {
        time: '15:00-18:00',
        activity: 'Experiência Gastronômica',
        location: 'Quinta da Regaleira',
        description: 'Piquenique premium nos jardins com vinhos da região',
        duration: '3 horas'
      },
      evening: {
        time: '20:00+',
        activity: 'Jantar',
        location: 'Restaurante Monserrate',
        description: 'Cozinha contemporânea com vista para a serra',
        duration: '2 horas'
      }
    }
  ],
  highlights: [
    'Vinhos premiados',
    'Adegas históricas',
    'Gastronomia local',
    'Paisagens deslumbrantes'
  ],
  recommendations: {
    restaurants: [{ name: 'Adega das Gravatas' }, { name: 'Tasca do Celso' }],
    tips: ['Reserve com antecedência', 'Leve protetor solar', 'Câmera obrigatória']
  }
};

export default function ItineraryDisplayExample() {
  return (
    <div className="p-8 bg-background">
      <ItineraryDisplay 
        itinerary={mockItinerary}
        onDownload={() => console.log('Download clicked')}
      />
    </div>
  );
}
