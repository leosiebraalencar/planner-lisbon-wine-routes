export interface HotelData {
  name: string;
  budgetCategory: 'low' | 'medium' | 'high';
  affiliateUrl: string;
  description: string;
  region: string;
  isGenericListing: boolean;
}

export const ALL_HOTELS: HotelData[] = [
  {
    name: 'Low Budget Options on Center',
    budgetCategory: 'low',
    affiliateUrl: 'https://tidd.ly/3OjfvoB',
    description: 'Opções no centro',
    region: 'Lisboa',
    isGenericListing: true,
  },
  {
    name: 'Medium Budget Options on Center',
    budgetCategory: 'medium',
    affiliateUrl: 'https://tidd.ly/4kBQUHE',
    description: 'Opções no centro',
    region: 'Lisboa',
    isGenericListing: true,
  },
  {
    name: 'High Budget Options on Center',
    budgetCategory: 'high',
    affiliateUrl: 'https://tidd.ly/4bZb4t0',
    description: 'Opções no centro',
    region: 'Lisboa',
    isGenericListing: true,
  },
  {
    name: 'Palácio Ludovice Wine Experience Hotel',
    budgetCategory: 'high',
    affiliateUrl: 'https://tidd.ly/4aofiJm',
    description: 'Centro de Lisboa, Experiência 5 estrelas, Michelin Guide',
    region: 'Lisboa',
    isGenericListing: false,
  },
  {
    name: 'Bagos do Vilar',
    budgetCategory: 'medium',
    affiliateUrl: 'https://tidd.ly/45qqHXd',
    description: 'Mais próximo das vinícolas',
    region: 'Região Oeste',
    isGenericListing: false,
  },
  {
    name: 'Quinta de Santana',
    budgetCategory: 'high',
    affiliateUrl: 'https://www.quintadesantana.com/pt-pt/alojamento-rural/',
    description: 'Região de Mafra, experiência de dormir em propriedade vinícola',
    region: 'Região Oeste',
    isGenericListing: false,
  },
  {
    name: 'Terra Luso',
    budgetCategory: 'medium',
    affiliateUrl: 'https://tidd.ly/3OxA00R',
    description: '',
    region: 'Região Oeste',
    isGenericListing: false,
  },
  {
    name: 'Stay Hotel',
    budgetCategory: 'medium',
    affiliateUrl: 'https://tidd.ly/4aZ0LDd',
    description: 'Região de Torres Vedras',
    region: 'Região Oeste',
    isGenericListing: false,
  },
  {
    name: 'Quinta da Carlota',
    budgetCategory: 'high',
    affiliateUrl: 'https://tidd.ly/4tGQYKl',
    description: 'Região de Torres Vedras, Alojamento muito confortável',
    region: 'Região Oeste',
    isGenericListing: false,
  },
  {
    name: 'Casal dos Mochos',
    budgetCategory: 'high',
    affiliateUrl: 'https://tidd.ly/4kCEIX4',
    description: 'Região de Sobral de Monte Agraço, excepcional',
    region: 'Região Oeste',
    isGenericListing: false,
  },
  {
    name: 'Quinta do Covanco',
    budgetCategory: 'high',
    affiliateUrl: 'https://tidd.ly/3OMXCyw',
    description: 'Região de Alenquer, confortável e de época com história',
    region: 'Região Oeste',
    isGenericListing: false,
  },
  {
    name: 'Monte da Casa do João',
    budgetCategory: 'high',
    affiliateUrl: 'https://tidd.ly/40cVzpY',
    description: 'Região de Grândola',
    region: 'Setúbal',
    isGenericListing: false,
  },
  {
    name: 'A Serenada',
    budgetCategory: 'high',
    affiliateUrl: 'https://tidd.ly/4rmypcI',
    description: 'Região de Grândola',
    region: 'Setúbal',
    isGenericListing: false,
  },
  {
    name: 'Penha Long Resort',
    budgetCategory: 'high',
    affiliateUrl: 'https://tidd.ly/4qGYhir',
    description: 'Região de Sintra',
    region: 'Sintra',
    isGenericListing: false,
  },
  {
    name: 'Quinta da Bella Vista',
    budgetCategory: 'high',
    affiliateUrl: 'https://tidd.ly/4twmcDQ',
    description: 'Região de Sintra, Private Historic Estate',
    region: 'Sintra',
    isGenericListing: false,
  },
  {
    name: 'Eighteen21 Houses',
    budgetCategory: 'medium',
    affiliateUrl: 'https://tidd.ly/4kCIFel',
    description: 'Região de Sintra',
    region: 'Sintra',
    isGenericListing: false,
  },
  {
    name: 'Live Sintra Boutique Guest House',
    budgetCategory: 'low',
    affiliateUrl: 'https://tidd.ly/4rlEOoB',
    description: 'Região de Sintra',
    region: 'Sintra',
    isGenericListing: false,
  },
  {
    name: 'Sintra Marmoris Palace',
    budgetCategory: 'high',
    affiliateUrl: 'https://tidd.ly/40aJ2U6',
    description: 'Região de Sintra, Impressionante e histórico',
    region: 'Sintra',
    isGenericListing: false,
  },
  {
    name: 'Hotel Casa Palmela - Small Luxury Hotels',
    budgetCategory: 'high',
    affiliateUrl: 'https://tidd.ly/46dVDtf',
    description: 'Região de Setúbal',
    region: 'Setúbal',
    isGenericListing: false,
  },
  {
    name: 'Rio Art Hotel',
    budgetCategory: 'medium',
    affiliateUrl: 'https://tidd.ly/4aQvaVb',
    description: 'Região de Setúbal',
    region: 'Setúbal',
    isGenericListing: false,
  },
  {
    name: 'RM The Experience',
    budgetCategory: 'medium',
    affiliateUrl: 'https://tidd.ly/3OiCJLC',
    description: 'Região de Setúbal',
    region: 'Setúbal',
    isGenericListing: false,
  },
  {
    name: 'Quinta das Murgas',
    budgetCategory: 'high',
    affiliateUrl: 'https://tidd.ly/3Ftregd',
    description: 'Região de Bucelas, dentro de propriedade vinícola',
    region: 'Região Oeste',
    isGenericListing: false,
  },
  {
    name: 'Quinta do Boição',
    budgetCategory: 'high',
    affiliateUrl: 'https://tidd.ly/4kPAQlJ',
    description: 'Região de Bucelas, dentro de propriedade vinícola',
    region: 'Região Oeste',
    isGenericListing: false,
  },
  {
    name: 'Lisbon Wine Hotel',
    budgetCategory: 'high',
    affiliateUrl: 'https://tidd.ly/4aDB36W',
    description: 'Arroios',
    region: 'Lisboa',
    isGenericListing: false,
  },
  {
    name: '1904 Benfica Hotel FLH Hotels',
    budgetCategory: 'high',
    affiliateUrl: 'https://tidd.ly/4cwHnPZ',
    description: 'Próximo a Avenida da Liberdade',
    region: 'Lisboa',
    isGenericListing: false,
  },
  {
    name: 'Lisbon Cheese & Wine Suites',
    budgetCategory: 'high',
    affiliateUrl: 'https://tidd.ly/4bY8SSz',
    description: 'Estrela Lisboa',
    region: 'Lisboa',
    isGenericListing: false,
  },
  {
    name: 'Casa Holstein Quinta de Sao Sebastiao Sintra',
    budgetCategory: 'high',
    affiliateUrl: 'https://tidd.ly/3OLpHGt',
    description: 'Região de Sintra',
    region: 'Sintra',
    isGenericListing: false,
  },
  {
    name: 'Art Legacy Hotel Baixa-Chiado',
    budgetCategory: 'high',
    affiliateUrl: 'https://tidd.ly/40j2JJi',
    description: 'Região de Chiado, Lisboa',
    region: 'Lisboa',
    isGenericListing: false,
  },
  {
    name: 'Wine & Books Lisboa Hotel',
    budgetCategory: 'high',
    affiliateUrl: 'https://tidd.ly/4tBhkxr',
    description: 'Região de Ajuda, Lisboa',
    region: 'Lisboa',
    isGenericListing: false,
  },
  {
    name: 'Valverde Sintra Palácio de Seteais',
    budgetCategory: 'high',
    affiliateUrl: 'https://tidd.ly/4alJzsf',
    description: 'Região de Sintra, Sinta-se em Palácio',
    region: 'Sintra',
    isGenericListing: false,
  },
  {
    name: 'Immerso Hotel',
    budgetCategory: 'high',
    affiliateUrl: 'https://tidd.ly/3MrAg0T',
    description: 'Região de Ericeira',
    region: 'Região Oeste',
    isGenericListing: false,
  },
  {
    name: 'Sheraton Cascais Resort',
    budgetCategory: 'high',
    affiliateUrl: 'https://tidd.ly/3OkmL3K',
    description: 'Região de Cascais, Quinta da Marinha',
    region: 'Sintra',
    isGenericListing: false,
  },
];

export function getHotelsByBudget(budget: 'economico' | 'moderado' | 'premium'): HotelData[] {
  const budgetMap: Record<string, string[]> = {
    'economico': ['low', 'medium'],
    'moderado': ['medium', 'high'],
    'premium': ['high'],
  };
  const allowed = budgetMap[budget] || ['medium'];
  return ALL_HOTELS.filter(h => allowed.includes(h.budgetCategory));
}

export function getHotelsByRegion(region: string): HotelData[] {
  return ALL_HOTELS.filter(h => h.region === region || h.region === 'Lisboa');
}

export function getHotelsByBudgetAndRegion(budget: 'economico' | 'moderado' | 'premium', region: string): HotelData[] {
  const byBudget = getHotelsByBudget(budget);
  const regional = byBudget.filter(h => h.region === region);
  if (regional.length > 0) return regional;
  return byBudget.filter(h => h.region === 'Lisboa');
}
