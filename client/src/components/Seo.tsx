import { Helmet } from 'react-helmet-async';

interface SeoProps {
  lang: 'pt' | 'en' | 'es';
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  pagePath?: string;
}

const DOMAIN = 'https://tours.lisbonwineroutes.com';
const FAVICON_URL = 'https://lisbonwineroutes.com/wp-content/uploads/2021/02/favicon-lisbon-wine-routes-150x150.png';

const localeMap: Record<string, string> = {
  pt: 'pt_PT',
  en: 'en_US',
  es: 'es_ES',
};

export default function Seo({ lang, title, description, keywords, canonicalUrl, pagePath = '' }: SeoProps) {
  const ptUrl = pagePath ? `${DOMAIN}/${pagePath}` : `${DOMAIN}/`;
  const enUrl = pagePath ? `${DOMAIN}/en/${pagePath}` : `${DOMAIN}/en/`;
  const esUrl = pagePath ? `${DOMAIN}/es/${pagePath}` : `${DOMAIN}/es/`;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="icon" type="image/png" href={FAVICON_URL} />
      <link rel="apple-touch-icon" href={FAVICON_URL} />

      <link rel="alternate" hrefLang="pt" href={ptUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="es" href={esUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${DOMAIN}/og-image.jpg`} />
      <meta property="og:locale" content={localeMap[lang] || 'en_US'} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${DOMAIN}/twitter-card.jpg`} />

      <script type="application/ld+json">{`
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Lisbon Wine Routes - Personalized Wine Itineraries",
          "description": "Create your personalized wine tourism itinerary in Lisbon with AI-powered curation.",
          "url": "${DOMAIN}",
          "provider": {
            "@type": "Organization",
            "name": "Lisbon Wine Routes",
            "url": "https://www.lisbonwineroutes.com"
          },
          "areaServed": {
            "@type": "City",
            "name": "Lisboa"
          },
          "serviceType": "Wine Tourism Planning"
        }
      `}</script>
    </Helmet>
  );
}
