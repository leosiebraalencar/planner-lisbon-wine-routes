const DOMAIN = 'https://tours.lisbonwineroutes.com';

interface SeoMeta {
  lang: 'pt' | 'en' | 'es';
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  pagePath: string;
}

type PageKey = 'home' | 'quiz' | 'itinerary' | 'pro';

const PAGE_PATHS: Record<PageKey, string> = {
  home: '',
  quiz: 'quiz',
  itinerary: 'itinerary',
  pro: 'pro',
};

const seoData: Record<PageKey, Record<string, SeoMeta>> = {
  home: {
    PT: {
      lang: 'pt',
      title: 'Roteiro Personalizado de Enoturismo em Lisboa | Lisbon Wine Routes',
      description: 'Crie o seu roteiro personalizado de enoturismo em Lisboa. Responda a um quiz e receba um guia de vinícolas, degustações e experiências únicas.',
      keywords: 'roteiro personalizado de enoturismo, roteiro de enoturismo, enoturismo lisboa, vinhos lisboa',
      canonicalUrl: `${DOMAIN}/`,
      pagePath: '',
    },
    EN: {
      lang: 'en',
      title: 'Personalized Wine Tourism Itinerary in Lisbon | Lisbon Wine Routes',
      description: 'Create your personalized wine tourism itinerary in Lisbon. Take a quiz and get a guide to unique wineries, tastings, and experiences.',
      keywords: 'wine tourism itinerary, wine tourism itinerary in lisbon, lisbon wine tours, portugal wine',
      canonicalUrl: `${DOMAIN}/en/`,
      pagePath: '',
    },
    ES: {
      lang: 'es',
      title: 'Ruta Enoturística Personalizada en Lisboa | Lisbon Wine Routes',
      description: 'Crea tu ruta enoturística personalizada en Lisboa. Responde a un cuestionario y recibe una guía de bodegas, catas y experiencias únicas.',
      keywords: 'ruta enoturística en lisboa, ruta enoturística, enoturismo lisboa, vinos de lisboa',
      canonicalUrl: `${DOMAIN}/es/`,
      pagePath: '',
    },
    DE: {
      lang: 'en',
      title: 'Personalized Wine Tourism Itinerary in Lisbon | Lisbon Wine Routes',
      description: 'Create your personalized wine tourism itinerary in Lisbon. Take a quiz and get a guide to unique wineries, tastings, and experiences.',
      keywords: 'wine tourism itinerary, wine tourism lisbon, lisbon wine tours, portugal wine',
      canonicalUrl: `${DOMAIN}/en/`,
      pagePath: '',
    },
  },
  quiz: {
    PT: {
      lang: 'pt',
      title: 'Quiz de Enoturismo - Crie o Seu Roteiro | Lisbon Wine Routes',
      description: 'Responda ao nosso quiz interativo e receba um roteiro personalizado de enoturismo na região de Lisboa.',
      keywords: 'quiz enoturismo, roteiro vinícola personalizado, enoturismo lisboa quiz',
      canonicalUrl: `${DOMAIN}/quiz`,
      pagePath: 'quiz',
    },
    EN: {
      lang: 'en',
      title: 'Wine Tourism Quiz - Create Your Itinerary | Lisbon Wine Routes',
      description: 'Answer our interactive quiz and get a personalized wine tourism itinerary for the Lisbon region.',
      keywords: 'wine tourism quiz, personalized wine itinerary, lisbon wine quiz',
      canonicalUrl: `${DOMAIN}/en/quiz`,
      pagePath: 'quiz',
    },
    ES: {
      lang: 'es',
      title: 'Quiz de Enoturismo - Crea tu Ruta | Lisbon Wine Routes',
      description: 'Responde a nuestro cuestionario interactivo y recibe una ruta enoturística personalizada en la región de Lisboa.',
      keywords: 'quiz enoturismo, ruta vinícola personalizada, enoturismo lisboa cuestionario',
      canonicalUrl: `${DOMAIN}/es/quiz`,
      pagePath: 'quiz',
    },
    DE: {
      lang: 'en',
      title: 'Wine Tourism Quiz - Create Your Itinerary | Lisbon Wine Routes',
      description: 'Answer our interactive quiz and get a personalized wine tourism itinerary for the Lisbon region.',
      keywords: 'wine tourism quiz, personalized wine itinerary, lisbon wine quiz',
      canonicalUrl: `${DOMAIN}/en/quiz`,
      pagePath: 'quiz',
    },
  },
  itinerary: {
    PT: {
      lang: 'pt',
      title: 'O Seu Roteiro de Enoturismo | Lisbon Wine Routes',
      description: 'Veja o seu roteiro personalizado de enoturismo em Lisboa com vinícolas, restaurantes e experiências selecionadas.',
      keywords: 'roteiro enoturismo lisboa, itinerário vinícola personalizado',
      canonicalUrl: `${DOMAIN}/itinerary`,
      pagePath: 'itinerary',
    },
    EN: {
      lang: 'en',
      title: 'Your Wine Tourism Itinerary | Lisbon Wine Routes',
      description: 'View your personalized wine tourism itinerary in Lisbon with curated wineries, restaurants, and experiences.',
      keywords: 'wine tourism itinerary lisbon, personalized wine itinerary',
      canonicalUrl: `${DOMAIN}/en/itinerary`,
      pagePath: 'itinerary',
    },
    ES: {
      lang: 'es',
      title: 'Tu Ruta Enoturística | Lisbon Wine Routes',
      description: 'Consulta tu ruta enoturística personalizada en Lisboa con bodegas, restaurantes y experiencias seleccionadas.',
      keywords: 'ruta enoturismo lisboa, itinerario vinícola personalizado',
      canonicalUrl: `${DOMAIN}/es/itinerary`,
      pagePath: 'itinerary',
    },
    DE: {
      lang: 'en',
      title: 'Your Wine Tourism Itinerary | Lisbon Wine Routes',
      description: 'View your personalized wine tourism itinerary in Lisbon with curated wineries, restaurants, and experiences.',
      keywords: 'wine tourism itinerary lisbon, personalized wine itinerary',
      canonicalUrl: `${DOMAIN}/en/itinerary`,
      pagePath: 'itinerary',
    },
  },
  pro: {
    PT: {
      lang: 'pt',
      title: 'Roteiro Pro - Enoturismo Detalhado | Lisbon Wine Routes',
      description: 'Obtenha um roteiro profissional com mapas interativos, horários otimizados, dicas exclusivas e contactos diretos.',
      keywords: 'roteiro pro enoturismo, enoturismo lisboa premium, guia vinícola profissional',
      canonicalUrl: `${DOMAIN}/pro`,
      pagePath: 'pro',
    },
    EN: {
      lang: 'en',
      title: 'Pro Itinerary - Detailed Wine Tourism | Lisbon Wine Routes',
      description: 'Get a professional itinerary with interactive maps, optimized schedules, insider tips, and direct contacts.',
      keywords: 'pro wine itinerary, lisbon wine tourism premium, professional wine guide',
      canonicalUrl: `${DOMAIN}/en/pro`,
      pagePath: 'pro',
    },
    ES: {
      lang: 'es',
      title: 'Ruta Pro - Enoturismo Detallado | Lisbon Wine Routes',
      description: 'Obtén una ruta profesional con mapas interactivos, horarios optimizados, consejos exclusivos y contactos directos.',
      keywords: 'ruta pro enoturismo, enoturismo lisboa premium, guía vinícola profesional',
      canonicalUrl: `${DOMAIN}/es/pro`,
      pagePath: 'pro',
    },
    DE: {
      lang: 'en',
      title: 'Pro Itinerary - Detailed Wine Tourism | Lisbon Wine Routes',
      description: 'Get a professional itinerary with interactive maps, optimized schedules, insider tips, and direct contacts.',
      keywords: 'pro wine itinerary, lisbon wine tourism premium, professional wine guide',
      canonicalUrl: `${DOMAIN}/en/pro`,
      pagePath: 'pro',
    },
  },
};

export function getSeoData(page: PageKey, language: string): SeoMeta {
  return seoData[page][language] || seoData[page]['EN'];
}
