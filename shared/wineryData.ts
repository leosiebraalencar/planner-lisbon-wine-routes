export interface WineryExperience {
  name: string;
  url: string;
  price: number;
  duration: string;
}

export interface WineryData {
  name: string;
  region: string;
  address: string;
  googleMapsUrl: string;
  hostUrl: string;
  rating: number | null;
  languages: string;
  experiences: WineryExperience[];
}

export const REGIONS = ['Região Oeste', 'Sintra', 'Setúbal', 'Oeiras'] as const;
export type Region = typeof REGIONS[number];

export const PLANNED_REGIONS = ['Grandola'] as const;

export const ALL_WINERIES: WineryData[] = [
  {
    name: 'Manzwine',
    region: 'Região Oeste',
    address: 'R Borrija 6, 2640-161 Cheleiros, Lisbon, Portugal',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=38.889173,-9.328828',
    hostUrl: 'https://www.winalist.pt/hosts/1551/manzwine?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 4.9,
    languages: 'Inglês, Português',
    experiences: [
      {
        name: 'A verdadeira Essência',
        url: 'https://www.winalist.pt/experiences/2990/a-verdadeira-essencia?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 25,
        duration: '2h',
      },
      {
        name: 'Manzwine & Tapas',
        url: 'https://www.winalist.pt/experiences/2993/manzwine-tapas?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 35,
        duration: '2h',
      },
    ],
  },
  {
    name: 'Quinta De San Michel',
    region: 'Sintra',
    address: 'Sintra',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=38.826132,-9.420433',
    hostUrl: 'https://www.winalist.pt/hosts/1966/quinta-de-san-michel?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 4.8,
    languages: 'Inglês, Português, Espanhol',
    experiences: [
      {
        name: 'Visita e Prova de Vinhos Trilogia San Michel',
        url: 'https://www.winalist.pt/experiences/4010/visita-e-prova-de-vinhos-trilogia-san-michel?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 30,
        duration: '1h30',
      },
      {
        name: 'Visita e Prova de Vinhos Os Quatro Ventos de Janas',
        url: 'https://www.winalist.pt/experiences/6775/visita-e-prova-de-vinhos-os-quatro-ventos-de-janas?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 38,
        duration: '1h30',
      },
    ],
  },
  {
    name: 'Caves Velhas & Quinta Do Boição',
    region: 'Região Oeste',
    address: 'R. D. Afonso Henrriques, Bucelas, Portugal',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=38.902673,-9.121221',
    hostUrl: 'https://www.winalist.pt/hosts/1596/caves-velhas-quinta-do-boicao?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 4.9,
    languages: 'Inglês, Português',
    experiences: [
      {
        name: 'Degustação e Passeio Pela História',
        url: 'https://www.winalist.pt/experiences/3134/degustacao-e-passeio-pela-historia?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 45,
        duration: '2h30',
      },
      {
        name: 'Um Dia na Vindima',
        url: 'https://www.winalist.pt/experiences/3142/um-dia-na-vindima?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 75,
        duration: '4h',
      },
      {
        name: 'Almoço Enogastronómico com Fado',
        url: 'https://www.winalist.pt/experiences/4426/almoco-enogastronomico-com-fado?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 105,
        duration: '3h',
      },
    ],
  },
  {
    name: 'Quinta Da Boa Esperança',
    region: 'Região Oeste',
    address: 'rEn 9, 2565-134 Carvoeira, Lisboa, Portugal',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=39.077856,-9.191171',
    hostUrl: 'https://www.winalist.pt/hosts/996/quinta-da-boa-esperanca?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 4.9,
    languages: 'Português, Inglês, Francês, Alemão',
    experiences: [
      {
        name: 'Tour e Prova de Aventureiros de Vinho',
        url: 'https://www.winalist.pt/experiences/2088/tour-e-prova-de-aventureiros-de-vinho?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 26,
        duration: '1h30',
      },
      {
        name: 'Lunch in the Heart of Wine Country',
        url: 'https://www.winalist.pt/experiences/3161/lunch-in-the-heart-of-wine-country?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 63,
        duration: '2h30',
      },
      {
        name: 'Experiência Premium Sabores na vinha',
        url: 'https://www.winalist.pt/experiences/7025/experiencia-premium-sabores-na-vinha?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 80,
        duration: '2h30',
      },
    ],
  },
  {
    name: 'Quinta Do Sanguinhal',
    region: 'Região Oeste',
    address: 'Quinta do Sanguinhal, Bombarral, Portugal',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=39.255147,-9.143906',
    hostUrl: 'https://www.winalist.pt/hosts/949/quinta-do-sanguinhal?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 4.9,
    languages: 'Português, Inglês, Francês, Alemão',
    experiences: [
      {
        name: 'Visita Guiada',
        url: 'https://www.winalist.pt/experiences/3253/visita-guiada?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 40,
        duration: '1h30',
      },
      {
        name: 'Visita guiada+refeição',
        url: 'https://www.winalist.pt/experiences/3324/visita-guiada-refeicao?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 80,
        duration: '3h',
      },
    ],
  },
  {
    name: 'Quinta Do Gradil',
    region: 'Região Oeste',
    address: 'Estrada Nacional 115, Vilar',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=39.20479,-9.115475',
    hostUrl: 'https://www.winalist.pt/hosts/1641/quinta-do-gradil?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 4.6,
    languages: 'Português, Inglês',
    experiences: [
      {
        name: 'Visita Guiada e Prova de 3 vinhos',
        url: 'https://www.winalist.pt/experiences/3289/visita-guiada-e-prova-de-3-vinhos?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 20,
        duration: '1h30',
      },
      {
        name: 'Visita e Brunch',
        url: 'https://www.winalist.pt/experiences/5024/visita-e-brunch?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 45,
        duration: '2h30',
      },
      {
        name: 'Visita e Piquenique nas Vinhas',
        url: 'https://www.winalist.pt/experiences/5025/visita-e-piquenique-nas-vinhas?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 42.5,
        duration: '2h30',
      },
    ],
  },
  {
    name: 'Adega Regional De Colares',
    region: 'Sintra',
    address: 'Adega Regional de Colares, Alameda Coronel Linhares de Lima, 32, Colares, Portugal',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=38.805862,-9.449969',
    hostUrl: 'https://www.winalist.pt/hosts/2735/adega-regional-de-colares?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 5.0,
    languages: 'Português, Inglês, Francês',
    experiences: [
      {
        name: 'Standard Tour',
        url: 'https://www.winalist.pt/experiences/5680/standard-tour?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 27,
        duration: '1h',
      },
      {
        name: 'Deluxe Tour',
        url: 'https://www.winalist.pt/experiences/5688/deluxe-tour?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 33,
        duration: '1h',
      },
      {
        name: 'Royal Tour',
        url: 'https://www.winalist.pt/experiences/5689/royal-tour?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 67,
        duration: '1h',
      },
      {
        name: 'Tapas Tour',
        url: 'https://www.winalist.pt/experiences/5691/tapas-tour?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 45.5,
        duration: '1h',
      },
      {
        name: 'Cheese Moment Tour',
        url: 'https://www.winalist.pt/experiences/5692/cheese-moment-tour?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 36,
        duration: '1h',
      },
      {
        name: 'Sweet Moment Tour',
        url: 'https://www.winalist.pt/experiences/5695/sweet-moment-tour?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 34,
        duration: '1h',
      },
    ],
  },
  {
    name: 'Cas\'amaro',
    region: 'Região Oeste',
    address: '2580-081 Aldeia Galega da Merceana, Lisbon, Portugal',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=39.080829,-9.112398',
    hostUrl: 'https://www.winalist.pt/hosts/1968/cas-amaro?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 5.0,
    languages: 'Português, Inglês, Espanhol',
    experiences: [
      {
        name: 'Visita à Adega Cas\'Amaro e Prova de Vinhos',
        url: 'https://www.winalist.pt/experiences/4024/visita-a-adega-cas-amaro-e-prova-de-vinhos?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 20,
        duration: '1h',
      },
      {
        name: 'Visita à Adega Cas\'Amaro e Prova de Vinhos Premium',
        url: 'https://www.winalist.pt/experiences/4329/visita-a-adega-cas-amaro-e-prova-de-vinhos-premium?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 30,
        duration: '1h30',
      },
      {
        name: 'Visita à Adega e Prova de Vinhos e Gastronomia',
        url: 'https://www.winalist.pt/experiences/4330/visita-a-adega-e-prova-de-vinhos-e-gastronomia?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 40,
        duration: '1h30',
      },
      {
        name: 'Visita às Vinhas, Cas\'Amaro e Prova de Vinhos',
        url: 'https://www.winalist.pt/experiences/4331/visita-as-vinhas-cas-amaro-e-prova-de-vinhos?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 40,
        duration: '1h30',
      },
      {
        name: 'Programa Trilhos e Vinhos',
        url: 'https://www.winalist.pt/experiences/4332/programa-trilhos-e-vinhos?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 40,
        duration: '4h',
      },
      {
        name: 'Programa Património e Vinhos',
        url: 'https://www.winalist.pt/experiences/4334/programa-patrimonio-e-vinhos?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 40,
        duration: '2h30',
      },
      {
        name: 'Piquenique nas Vinhas',
        url: 'https://www.winalist.pt/experiences/4335/piquenique-nas-vinhas?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 40,
        duration: '2h',
      },
    ],
  },
  {
    name: 'Quinta Da Almiara',
    region: 'Região Oeste',
    address: '555, 2565-828 Ventosa, Lisboa, Portugal',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=39.054113,-9.289981',
    hostUrl: 'https://www.winalist.pt/hosts/864/quinta-da-almiara?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 4.9,
    languages: 'Português, Inglês, Espanhol',
    experiences: [
      {
        name: 'Almiara Standard Tasting',
        url: 'https://www.winalist.pt/experiences/1597/almiara-standard-tasting?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 21,
        duration: '2h',
      },
      {
        name: 'Almiara raízes e tradição',
        url: 'https://www.winalist.pt/experiences/1598/almiara-raizes-e-tradicao?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 39,
        duration: '2h',
      },
      {
        name: 'Almiara Premium com Aperitivos Locais',
        url: 'https://www.winalist.pt/experiences/3799/almiara-premium-com-aperitivos-locais?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 29,
        duration: '1h30',
      },
      {
        name: 'Picnic nas vinhas',
        url: 'https://www.winalist.pt/experiences/3803/picnic-nas-vinhas?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 39,
        duration: '3h',
      },
    ],
  },
  {
    name: 'Quinta Da Folgorosa',
    region: 'Região Oeste',
    address: 'Quinta da Folgorosa, Rua Principal 16, Portugal',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=39.041388,-9.154034',
    hostUrl: 'https://www.winalist.pt/hosts/2197/quinta-da-folgorosa?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 5.0,
    languages: 'Português, Inglês, Espanhol',
    experiences: [
      {
        name: 'Enólogo por um dia com prova de 6 vinhos',
        url: 'https://www.winalist.pt/experiences/4566/enologo-por-um-dia-com-prova-de-6-vinhos?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 75,
        duration: '4h',
      },
      {
        name: 'Picnic nas Vinhas',
        url: 'https://www.winalist.pt/experiences/4577/picnic-nas-vinhas?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 45,
        duration: '2h',
      },
      {
        name: 'Prova Palette Quinta da Folgorosa',
        url: 'https://www.winalist.pt/experiences/4581/prova-palette-quinta-da-folgorosa?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 45,
        duration: '3h',
      },
    ],
  },
  {
    name: 'Quinta Do Olival Da Murta',
    region: 'Região Oeste',
    address: 'Quinta do Olival da Murta, Cadaval, Portugal',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=39.240694,-9.086607',
    hostUrl: 'https://www.winalist.pt/hosts/2386/quinta-do-olival-da-murta?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 4.8,
    languages: 'Português, Inglês, Espanhol',
    experiences: [
      {
        name: 'Prova de Honestos',
        url: 'https://www.winalist.pt/experiences/4936/prova-de-honestos?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 37,
        duration: '2h',
      },
    ],
  },
  {
    name: 'Viuva Gomes',
    region: 'Sintra',
    address: 'Largo Comendador Gomes Da Silva 3, 2705-076 Colares, Lisbon, Portugal',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=38.795826,-9.470295',
    hostUrl: 'https://www.winalist.pt/hosts/913/viuva-gomes?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 5.0,
    languages: 'Português, Inglês, Francês, Espanhol',
    experiences: [
      {
        name: 'Prova "Open Day"',
        url: 'https://www.winalist.pt/experiences/3904/prova-open-day?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 35,
        duration: '1h30',
      },
      {
        name: 'Os Terroirs de Colares - Prova Privada',
        url: 'https://www.winalist.pt/experiences/3913/os-terroirs-de-colares-prova-privada?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 33,
        duration: '1h30',
      },
      {
        name: 'Lisboa e Colares - Prova Privada',
        url: 'https://www.winalist.pt/experiences/5916/lisboa-e-colares-prova-privada?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 42,
        duration: '2h',
      },
    ],
  },
  {
    name: 'Casa Santos Lima',
    region: 'Região Oeste',
    address: 'En 115, 2580-081 Aldeia Galega da Merceana, Lisbon, Portugal',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=39.069947,-9.118017',
    hostUrl: 'https://www.winalist.pt/hosts/2302/casa-santos-lima?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 5.0,
    languages: 'Português, Inglês, Espanhol',
    experiences: [
      {
        name: 'Prova Lisboa',
        url: 'https://www.winalist.pt/experiences/4753/prova-lisboa?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 25,
        duration: '1h',
      },
      {
        name: 'Prova Terroir',
        url: 'https://www.winalist.pt/experiences/4754/prova-terroir?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 29,
        duration: '1h',
      },
    ],
  },
  {
    name: 'Quinta do Cerrado da Porta',
    region: 'Região Oeste',
    address: 'Quinta do Cerrado da Porta, Patameira',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=39.009819,-9.190689',
    hostUrl: 'https://www.winalist.pt/hosts/882/quinta-do-cerrado-da-porta?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 4.5,
    languages: 'Português, Inglês, Francês, Espanhol',
    experiences: [
      {
        name: 'Prova de vinhos sedutores',
        url: 'https://www.winalist.pt/experiences/1808/prova-de-vinhos-sedutores?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 35,
        duration: '2h',
      },
    ],
  },
  {
    name: 'Lisbon Winery',
    region: 'Oeiras',
    address: 'Rua Rodrigues Sampaio 18 A, Lisboa, Portugal',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=38.721351,-9.145032',
    hostUrl: 'https://www.winalist.pt/hosts/2522/lisbon-winery?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 5.0,
    languages: 'Português, Inglês, Espanhol',
    experiences: [
      {
        name: 'Prova de Vinhos Portugueses com Queijos',
        url: 'https://www.winalist.pt/experiences/5335/prova-de-vinhos-portugueses-com-queijos?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 85,
        duration: '1h30',
      },
    ],
  },
  {
    name: 'AdegaMãe',
    region: 'Região Oeste',
    address: 'AdegaMãe Sociedade Agrícola, Portugal',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=39.048783,-9.29563',
    hostUrl: 'https://www.winalist.pt/hosts/3134/adegamae?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 5.0,
    languages: 'Português, Inglês',
    experiences: [
      {
        name: 'Bronze',
        url: 'https://www.winalist.pt/experiences/6757/bronze?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 18,
        duration: '1h30',
      },
      {
        name: 'Silver',
        url: 'https://www.winalist.pt/experiences/6763/silver?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 25,
        duration: '1h30',
      },
      {
        name: 'Gold',
        url: 'https://www.winalist.pt/experiences/6764/gold?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 45,
        duration: '2h30',
      },
      {
        name: 'Special Editions',
        url: 'https://www.winalist.pt/experiences/6765/special-editions?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 65,
        duration: '1h30',
      },
      {
        name: 'Harmonização Petiscos',
        url: 'https://www.winalist.pt/experiences/6766/harmonizacao-petiscos?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 70,
        duration: '2h',
      },
      {
        name: 'Gastronomic tasting Sal na Adega',
        url: 'https://www.winalist.pt/experiences/6767/gastronomic-tasting-sal-na-adega?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 96,
        duration: '2h',
      },
      {
        name: 'Wine Brunch',
        url: 'https://www.winalist.pt/experiences/6769/wine-brunch?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 60,
        duration: '1h30',
      },
    ],
  },
  {
    name: 'Quinta Das Cerejeiras',
    region: 'Região Oeste',
    address: 'Quinta das Cerejeiras - Wine Shop - Museum - Wine Tourism, Largo dos Aviadores, Bombarral, Portugal',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=39.267243,-9.153814',
    hostUrl: 'https://www.winalist.pt/hosts/2423/quinta-das-cerejeiras?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 5.0,
    languages: 'Português, Inglês',
    experiences: [
      {
        name: 'Visita Guiada',
        url: 'https://www.winalist.pt/experiences/5014/visita-guiada?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 40,
        duration: '1h30',
      },
    ],
  },
  {
    name: 'Casa Romana Vini',
    region: 'Região Oeste',
    address: 'Quinta do Porto Nogueira, Cadaval, Portugal',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=39.273312,-9.019613',
    hostUrl: 'https://www.winalist.pt/hosts/1723/casa-romana-vini?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 5.0,
    languages: 'Português, Inglês',
    experiences: [
      {
        name: 'Visita à Quinta do Porto Nogueira + Prova 3 Vinhos',
        url: 'https://www.winalist.pt/experiences/4431/visita-a-quinta-do-porto-nogueira-prova-3-vinhos?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 45,
        duration: '1h30',
      },
      {
        name: 'Visita à Quinta do Porto Nogueira + Prova 5 Vinhos',
        url: 'https://www.winalist.pt/experiences/4432/visita-a-quinta-do-porto-nogueira-prova-5-vinhos?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 60,
        duration: '2h',
      },
    ],
  },
  {
    name: 'Quinta de S. Sebastião',
    region: 'Região Oeste',
    address: 'Estrada De São Sebastião, 2630-330 Arruda dos Vinhos, Lisbon, Portugal',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=38.96903,-9.078434',
    hostUrl: 'https://www.winalist.pt/hosts/3103/quinta-de-s-sebastiao?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 5.0,
    languages: 'Português, Inglês, Espanhol',
    experiences: [
      {
        name: 'Wine Slow Pace - Gold',
        url: 'https://www.winalist.pt/experiences/6651/wine-slow-pace-gold?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 50,
        duration: '2h',
      },
      {
        name: 'Wine Slow Pace - Platinum',
        url: 'https://www.winalist.pt/experiences/6662/wine-slow-pace-platinum?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 60,
        duration: '2h',
      },
      {
        name: 'Wine 4x4 - Platinum',
        url: 'https://www.winalist.pt/experiences/6664/wine-4x4-platinum?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 70,
        duration: '2h30',
      },
    ],
  },
  {
    name: 'Quinta de Chocapalha',
    region: 'Região Oeste',
    address: 'Rua Carles Duff, Aldeia Galega da Merceana, Portugal',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=39.081273,-9.111709',
    hostUrl: 'https://www.winalist.pt/hosts/863/quinta-de-chocapalha?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 5.0,
    languages: 'Português, Inglês, Francês, Alemão,Espanhol',
    experiences: [
      {
        name: 'Wine Lover Chocapalha',
        url: 'https://www.winalist.pt/experiences/3676/wine-lover-chocapalha?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 45,
        duration: '1h30',
      },
      {
        name: 'Terroir of Chocapalha',
        url: 'https://www.winalist.pt/experiences/3678/terroir-of-chocapalha?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 56,
        duration: '2h',
      },
      {
        name: 'Wine Tasting & Lunch Experience em Chocapalha',
        url: 'https://www.winalist.pt/experiences/3697/wine-tasting-lunch-experience-em-chocapalha?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 141,
        duration: '3h',
      },
    ],
  },
  {
    name: 'Adega Major - Vinhos Ti\' Nuno',
    region: 'Região Oeste',
    address: 'Rua Francisca de Meira 4, 2580-081 Aldeia Galega da Merceana',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=39.082808,-9.112716',
    hostUrl: 'https://www.winalist.pt/hosts/3085/adega-major-vinhos-ti-nuno?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 5.0,
    languages: 'Português, Inglês',
    experiences: [
      {
        name: 'Degustação Standard',
        url: 'https://www.winalist.pt/experiences/6831/degustacao-standard?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 20,
        duration: '1h30',
      },
      {
        name: 'Degustação Premium',
        url: 'https://www.winalist.pt/experiences/6833/degustacao-premium?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 25,
        duration: '1h30',
      },
    ],
  },
  {
    name: 'Quinta Da Cidadoura',
    region: 'Região Oeste',
    address: 'Quinta da Cidadoura, Feliteira',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=39.024659,-9.195171',
    hostUrl: 'https://www.winalist.pt/hosts/2825/quinta-da-cidadoura?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 5.0,
    languages: 'Português, Inglês, Espanhol',
    experiences: [
      {
        name: 'Notas Frescas',
        url: 'https://www.winalist.pt/experiences/5931/notas-frescas?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 15,
        duration: '1h',
      },
    ],
  },
  {
    name: 'Quinta Da Casaboa',
    region: 'Região Oeste',
    address: 'Sociedade Agricola Da Quinta Da Casaboa, Lda., Quinta da Granja, Runa, Portugal',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=39.062591,-9.202579',
    hostUrl: 'https://www.winalist.pt/hosts/2388/quinta-da-casaboa?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 5.0,
    languages: 'Português, Inglês',
    experiences: [
      {
        name: 'Prova Vinhos da Quinta',
        url: 'https://www.winalist.pt/experiences/4937/prova-vinhos-da-quinta?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 36,
        duration: '2h',
      },
      {
        name: 'Prova Vinhos Únicos',
        url: 'https://www.winalist.pt/experiences/4939/prova-vinhos-unicos?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 60,
        duration: '2h',
      },
    ],
  },
  {
    name: 'Infinitude',
    region: 'Sintra',
    address: 'Infinitude, Rua Quinta do Cosme, Sintra, Portugal',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=38.803097,-9.428925',
    hostUrl: 'https://www.winalist.pt/hosts/3267/infinitude?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 5.0,
    languages: 'Português, Inglês',
    experiences: [
      {
        name: 'Prova Clássico',
        url: 'https://www.winalist.pt/experiences/7090/prova-classico?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 20,
        duration: '1h30',
      },
      {
        name: 'Prova Quatro Vinhas',
        url: 'https://www.winalist.pt/experiences/7190/prova-quatro-vinhas?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 25,
        duration: '1h30',
      },
      {
        name: 'Prova Terroir',
        url: 'https://www.winalist.pt/experiences/7251/prova-terroir?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 35,
        duration: '1h30',
      },
    ],
  },
  {
    name: 'José Maria Da Fonseca',
    region: 'Setúbal',
    address: 'Rua José Augusto Coelho, Azeitão, Portugal',
    googleMapsUrl: 'https://www.google.com/maps/dir/38.9784048,-9.1074443/Casa+-+Museu+Jos%C3%A9+Maria+da+Fonseca,+R.+Jos%C3%A9+Augusto+Coelho+12a,+2925-538+Azeit%C3%A3o/@38.7507055,-9.3922418,10z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0xd194f7e5a4e7539:0x290d0597600c683!2m2!1d-9.0154294!2d38.5181228?entry=ttu&g_ep=EgoyMDI2MDIwNC4wIKXMDSoASAFQAw%3D%3D',
    hostUrl: 'https://www.winalist.pt/hosts/2852/casa-museu-jose-maria-da-fonseca?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 5.0,
    languages: 'Português, Inglês, Espanhol',
    experiences: [
      {
        name: 'Prova Moscatéis de Setúbal Especiais',
        url: 'https://www.winalist.pt/experiences/6028/prova-moscateis-de-setubal-especiais?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 120,
        duration: '1h30',
      },
      {
        name: 'Prova de 4 vinhos premium seguida de almoço/jantar',
        url: 'https://www.winalist.pt/experiences/6085/prova-de-4-vinhos-premium-seguida-de-almoco-jantar?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 58.5,
        duration: '2h30',
      },
      {
        name: 'Workshop de Pintura com Vinho - Winepainting',
        url: 'https://www.winalist.pt/experiences/6086/workshop-de-pintura-com-vinho-winepainting?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 40,
        duration: '2h',
      },
    ],
  },
  {
    name: 'Quinta do Piloto',
    region: 'Setúbal',
    address: 'Rua Helena Cardoso, Palmela, Portugal',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=38.566592,-8.914612',
    hostUrl: 'https://www.winalist.pt/hosts/949/quinta-do-sanguinhal?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 46238,
    languages: 'Português, Inglês',
    experiences: [
      {
        name: 'Programa Piloto',
        url: 'https://www.winalist.pt/experiences/1606/programa-piloto?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 15,
        duration: '1h',
      },
      {
        name: 'Programa Paladares',
        url: 'https://www.winalist.pt/experiences/1610/programa-paladares?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 30,
        duration: '1h30',
      },
    ],
  },
  {
    name: 'Casa Ermelinda Freitas',
    region: 'Setúbal',
    address: 'Casa Ermelinda Freitas - Vinhos, Portugal',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=38.635364,-8.694502',
    hostUrl: 'https://www.winalist.pt/hosts/3318/casa-ermelinda-freitas-vinhos?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 5.0,
    languages: 'Português, Inglês',
    experiences: [
      {
        name: 'Visita e Prova Monocastas',
        url: 'https://www.winalist.pt/experiences/7314/visita-e-prova-monocastas?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 15,
        duration: '1h30',
      },
      {
        name: 'Visita e Prova 3 Regiões',
        url: 'https://www.winalist.pt/experiences/7362/visita-e-prova-3-regioes?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 10,
        duration: '1h30',
      },
    ],
  },
  {
    name: 'Herdade do Peru',
    region: 'Setúbal',
    address: 'R. do Perú, 2925-206 São Lourenço, Portugal',
    googleMapsUrl: 'google.com/maps/dir/?api=1&destination=38.538622,-9.029353',
    hostUrl: 'https://www.winalist.pt/hosts/2494/herdade-do-peru?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 5.0,
    languages: 'Português, Inglês, Francês, Espanhol',
    experiences: [
      {
        name: 'Prova de Vinhos Clássica',
        url: 'https://www.winalist.pt/experiences/5157/prova-de-vinhos-classica?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 45,
        duration: '1h',
      },
      {
        name: 'Prova de Vinhos Premium',
        url: 'https://www.winalist.pt/experiences/5158/prova-de-vinhos-premium?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 60,
        duration: '1h',
      },
    ],
  },
  {
    name: 'Club House Picadeiro D\'Arrábida',
    region: 'Setúbal',
    address: 'Club House Picadeiro d\'Arrábida, Rua 25 de Abril, Azeitão, Portugal',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=38.508817,-9.032513',
    hostUrl: 'https://www.winalist.pt/hosts/2469/club-house-picadeiro-d-arrabida?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 5.0,
    languages: 'Português, Inglês, Espanhol',
    experiences: [
      {
        name: 'Pairing Exclusivo Vinhos & Azeite',
        url: 'https://www.winalist.pt/experiences/5109/pairing-exclusivo-vinhos-azeite?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 40,
        duration: '1h',
      },
      {
        name: 'Prova de Vinhos e Produtos Regionais',
        url: 'https://www.winalist.pt/experiences/5241/prova-de-vinhos-e-produtos-regionais?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 49,
        duration: '1h',
      },
    ],
  },
  {
    name: 'Palácio Da Bacalhôa',
    region: 'Setúbal',
    address: 'Palácio da Bacalhôa, São Simão, Portugal',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=38.525355,-8.992119',
    hostUrl: 'https://www.winalist.pt/hosts/2696/palacio-da-bacalhoa?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 5.0,
    languages: 'Português, Inglês, Espanhol',
    experiences: [
      {
        name: 'Visita Guiada + Prova Catarina de Bragança',
        url: 'https://www.winalist.pt/experiences/5584/visita-guiada-prova-catarina-de-braganca?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 75,
        duration: '2h30',
      },
    ],
  },
  {
    name: 'Adega Palacio Marques do Pombal',
    region: 'Oeiras',
    address: 'Largo Marquês Pombal 21, 2780-289 Oeiras',
    googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=38.9783902,-9.1074953',
    hostUrl: 'https://www.villaoeiras.com/PT/wine-tourism?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
    rating: 4.6,
    languages: 'Português, Inglês, Espanhol',
    experiences: [
      {
        name: 'Prova de 4 Vinhos, Prova de Azeite e Visita Guiada a Adega',
        url: 'https://www.villaoeiras.com/PT/wine-tourism?utm_source=lisbonwineroutes&utm_medium=affiliate&utm_campaign=lisbonwineroutes',
        price: 24,
        duration: '1h',
      },
    ],
  },
];

export const PRIORITY_WINERIES = new Set([
  'Quinta De San Michel',
  'AdegaMãe',
  'Palácio Da Bacalhôa',
  'Quinta Do Gradil',
  'Adega Regional De Colares',
  'Casa Santos Lima',
  "Cas'amaro",
  'Quinta Da Folgorosa',
  'Quinta de S. Sebastião',
  'José Maria Da Fonseca',
  'Casa Ermelinda Freitas',
  'Manzwine',
]);

export type ExperienceTag =
  | 'romantic'
  | 'technical'
  | 'informal'
  | 'gastronomic'
  | 'outdoor'
  | 'historical'
  | 'family'
  | 'exclusive';

const TAG_KEYWORDS: Record<ExperienceTag, RegExp[]> = {
  romantic: [/privad/i, /sunset/i, /piquenique|picnic/i, /exclusiv/i],
  technical: [/enólog/i, /terroir/i, /monocasta/i, /premium/i, /4x4/i],
  informal: [/tapas/i, /brunch/i, /open day/i, /standard/i, /bronze/i],
  gastronomic: [/almoço|lunch|jantar|dinner|refeição|gastronomic/i, /harmonização|pairing/i, /petiscos/i, /queijos|cheese/i],
  outdoor: [/vinha|vinhas|vineyard/i, /trilho/i, /piquenique|picnic/i, /vindima/i, /4x4/i],
  historical: [/história|histor/i, /museu|museum/i, /palácio|palacio/i, /património/i, /romano|romana/i],
  family: [/standard/i, /visita guiada/i, /bronze/i, /clássic/i],
  exclusive: [/exclusiv|privad/i, /premium/i, /special/i, /gold|platinum|royal/i],
};

export function getExperienceTags(winery: WineryData): ExperienceTag[] {
  const tags = new Set<ExperienceTag>();
  const allNames = winery.experiences.map(e => e.name).join(' ');
  for (const [tag, patterns] of Object.entries(TAG_KEYWORDS) as [ExperienceTag, RegExp[]][]) {
    if (patterns.some(p => p.test(allNames))) {
      tags.add(tag);
    }
  }
  return Array.from(tags);
}

export type BudgetTier = 'low' | 'mid' | 'high';

export function getWineryBudgetTier(winery: WineryData): BudgetTier {
  if (winery.experiences.length === 0) return 'mid';
  const avg = winery.experiences.reduce((s, e) => s + e.price, 0) / winery.experiences.length;
  if (avg <= 30) return 'low';
  if (avg <= 55) return 'mid';
  return 'high';
}

export function budgetMatchScore(winery: WineryData, quizBudget: string): number {
  const tier = getWineryBudgetTier(winery);
  const tierMap: Record<string, BudgetTier> = {
    economico: 'low',
    moderado: 'mid',
    premium: 'high',
    budget: 'low',
    moderate: 'mid',
    luxury: 'high',
  };
  const desired = tierMap[quizBudget] || 'mid';
  if (tier === desired) return 30;
  const order: BudgetTier[] = ['low', 'mid', 'high'];
  if (Math.abs(order.indexOf(tier) - order.indexOf(desired)) === 1) return 10;
  return 0;
}

const QUIZ_PREF_TO_TAGS: Record<string, ExperienceTag[]> = {
  traditionalGastronomy: ['gastronomic', 'historical'],
  internationalGastronomy: ['gastronomic'],
  historic: ['historical'],
  modernWineries: ['technical'],
  production: ['technical', 'outdoor'],
  wineFood: ['gastronomic'],
  tastings: ['technical', 'informal'],
  biodynamic: ['outdoor', 'technical'],
};

export function preferenceMatchScore(winery: WineryData, quizPreferences: string[]): number {
  const wineryTags = getExperienceTags(winery);
  if (wineryTags.length === 0 || quizPreferences.length === 0) return 0;
  let score = 0;
  for (const pref of quizPreferences) {
    const desiredTags = QUIZ_PREF_TO_TAGS[pref];
    if (!desiredTags) continue;
    for (const dt of desiredTags) {
      if (wineryTags.includes(dt)) {
        score += 10;
        break;
      }
    }
  }
  return Math.min(score, 20);
}

export function scoreWinery(
  winery: WineryData,
  quizBudget: string,
  quizPreferences: string[],
): number {
  let score = 0;
  if (PRIORITY_WINERIES.has(winery.name)) score += 40;
  score += budgetMatchScore(winery, quizBudget);
  score += preferenceMatchScore(winery, quizPreferences);
  score += (winery.rating || 0) * 2;
  return score;
}

export function getWineriesByRegion(region: Region): WineryData[] {
  return ALL_WINERIES.filter(w => w.region === region);
}

export function getRegionWineryMap(): Record<Region, WineryData[]> {
  const map: Record<string, WineryData[]> = {};
  REGIONS.forEach(r => {
    map[r] = getWineriesByRegion(r);
  });
  return map as Record<Region, WineryData[]>;
}

export function getCheapestExperience(winery: WineryData): WineryExperience | null {
  if (winery.experiences.length === 0) return null;
  return winery.experiences.reduce((min, exp) => exp.price < min.price ? exp : min);
}

export function getExperienceByBudget(winery: WineryData, budget: string): WineryExperience | null {
  if (winery.experiences.length === 0) return null;
  const sorted = [...winery.experiences].sort((a, b) => a.price - b.price);
  
  switch (budget) {
    case 'budget':
      return sorted[0];
    case 'moderate':
      return sorted[Math.floor(sorted.length / 2)];
    case 'luxury':
    case 'premium':
      return sorted[sorted.length - 1];
    default:
      return sorted[0];
  }
}
