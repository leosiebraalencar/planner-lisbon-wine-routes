export type AffiliateProvider = 'winalist' | 'getyourguide' | 'booking' | 'discovercars';

interface AffiliateUrlParams {
  provider: AffiliateProvider;
  url: string;
  clickref?: string;
}

export function addWinalistParams(url: string): string {
  const urlObj = new URL(url);
  urlObj.searchParams.set('utm_source', 'lisbonwineroutes');
  urlObj.searchParams.set('utm_medium', 'affiliate');
  urlObj.searchParams.set('utm_campaign', 'lisbonwineroutes');
  return urlObj.toString();
}

export function addGetYourGuideParams(url: string): string {
  const urlObj = new URL(url);
  urlObj.searchParams.set('partner_id', 'FZRKIIT');
  urlObj.searchParams.set('utm_medium', 'online_publisher');
  urlObj.searchParams.set('cmp', 'lisbonwineroutes');
  return urlObj.toString();
}

export function addDiscoverCarsParams(url: string): string {
  const urlObj = new URL(url);
  urlObj.searchParams.set('a_aid', 'lisbonwineroutes');
  return urlObj.toString();
}

export function buildBookingAwinUrl(destinationUrl: string, clickref?: string): string {
  const baseUrl = 'https://www.awin1.com/cread.php';
  const params = new URLSearchParams();
  
  params.set('awinmid', '18120');
  params.set('awinaffid', '1914530');
  
  if (clickref) {
    params.set('clickref', clickref);
  }
  
  params.set('ued', destinationUrl);
  
  return `${baseUrl}?${params.toString()}`;
}

export function toAffiliateUrl({ provider, url, clickref }: AffiliateUrlParams): string {
  try {
    switch (provider) {
      case 'winalist':
        return addWinalistParams(url);
      case 'getyourguide':
        return addGetYourGuideParams(url);
      case 'discovercars':
        return addDiscoverCarsParams(url);
      case 'booking':
        return buildBookingAwinUrl(url, clickref);
      default:
        return url;
    }
  } catch (error) {
    console.error(`Error generating affiliate URL for ${provider}:`, error);
    return url;
  }
}

export function detectProvider(url: string): AffiliateProvider | null {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('winalist.')) {
    return 'winalist';
  }
  if (urlLower.includes('getyourguide.')) {
    return 'getyourguide';
  }
  if (urlLower.includes('booking.com')) {
    return 'booking';
  }
  if (urlLower.includes('discovercars.')) {
    return 'discovercars';
  }
  
  return null;
}

export function autoAffiliateUrl(url: string, clickref?: string): string {
  const provider = detectProvider(url);
  if (!provider) {
    return url;
  }
  return toAffiliateUrl({ provider, url, clickref });
}

export const DEFAULT_PARTNER_URLS = {
  winalist: 'https://www.winalist.pt/',
  getyourguide: 'https://www.getyourguide.com/',
  booking: 'https://www.booking.com/',
  discovercars: 'https://www.discovercars.com/pt',
};

export function getDefaultAffiliateUrl(provider: AffiliateProvider, clickref?: string): string {
  const baseUrl = DEFAULT_PARTNER_URLS[provider];
  return toAffiliateUrl({ provider, url: baseUrl, clickref });
}
