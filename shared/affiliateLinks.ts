export type AffiliateProvider = 'winalist' | 'getyourguide' | 'booking' | 'discovercars';

interface AffiliateUrlParams {
  provider: AffiliateProvider;
  url: string;
  clickref?: string;
}

// Fixed DiscoverCars affiliate link - always use this
export const DISCOVERCARS_AFFILIATE_URL = 'https://www.discovercars.com/pt?a_aid=lisbonwineroutes';

// Fixed Stripe donation checkout link
export const STRIPE_DONATION_URL = 'https://checkout.stripe.com/c/pay/cs_live_a1Nr3hEkaSsI0wcLrAznkPts6pq3waZpuTYuHxJQhD03FEDnvqj8hMsCDQ#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdkdWxOYHwnPyd1blppbHNgWjA0VlFXT3VVQlVEXE1tQEtPQVNxd2ZBSGtfUzMxYXZQSXJHbTBXNVd%2FblJjYDMwaDUySn9%2FdmBvMVZBU3c9PVNzaG1Rf0JRVDJJNV99cH1KVjBJMjVnf2M8NTUzTzducjB9RCcpJ2N3amhWYHdzYHcnP3F3cGApJ2dkZm5id2pwa2FGamlqdyc%2FJyZjY2NjY2MnKSdpZHxqcHFRfHVgJz8ndmxrYmlgWmxxYGgnKSdga2RnaWBVaWRmYG1qaWFgd3YnP3F3cGB4JSUl';

// Winalist URL mapping - real URLs from Winalist
// When URL is not known, use null and system will fallback to Google Maps
export const WINALIST_URL_MAP: Record<string, string | null> = {
  // Região de Lisboa
  'adega_mae': 'https://www.winalist.pt/hosts/3134/adegamae',
  'quinta_do_gradil': 'https://www.winalist.pt/hosts/3108/quinta-do-gradil',
  'casal_santa_maria': 'https://www.winalist.pt/hosts/3067/casal-sta-maria',
  'quinta_da_murta': null, // TODO: Need real URL
  'quinta_de_chocapalha': 'https://www.winalist.pt/hosts/3127/quinta-de-chocapalha',
  'quinta_da_regaleira': null, // Not a winery, historic site
  
  // Região de Setúbal/Azeitão
  'jose_maria_da_fonseca': 'https://www.winalist.pt/hosts/3089/jose-maria-da-fonseca',
  'bacalhoa_vinhos': 'https://www.winalist.pt/hosts/3042/bacalhoa-vinhos-de-portugal',
  'quinta_da_bassaqueira': null, // TODO: Need real URL
  'casa_ermelinda_freitas': null, // TODO: Need real URL
  
  // Arrábida
  'adega_de_palmela': null, // TODO: Need real URL
  'quinta_do_piloto': 'https://www.winalist.pt/hosts/3123/quinta-do-piloto',
  
  // Sintra/Colares
  'adega_regional_colares': null, // TODO: Need real URL
  'casal_de_santa_maria_colares': null, // TODO: Need real URL
};

// Track missing Winalist URLs for reporting
export const missingWinalistUrls: string[] = [];

export function logMissingWinalistUrl(key: string, name: string, address?: string): void {
  const entry = `${key}: ${name}${address ? ` (${address})` : ''}`;
  if (!missingWinalistUrls.includes(entry)) {
    missingWinalistUrls.push(entry);
    console.warn(`[Winalist] Missing URL mapping for: ${entry}`);
  }
}

export function getWinalistRealUrl(key: string): string | null {
  const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return WINALIST_URL_MAP[normalizedKey] || null;
}

export function buildWinalistAffiliateUrl(realUrl: string): string {
  try {
    const urlObj = new URL(realUrl);
    
    // Validate domain is winalist.pt or winalist.com
    if (!urlObj.hostname.includes('winalist.pt') && !urlObj.hostname.includes('winalist.com')) {
      console.error(`[Winalist] Invalid domain for affiliate URL: ${urlObj.hostname}`);
      return realUrl;
    }
    
    // Add/merge UTM parameters
    urlObj.searchParams.set('utm_source', 'lisbonwineroutes');
    urlObj.searchParams.set('utm_medium', 'affiliate');
    urlObj.searchParams.set('utm_campaign', 'lisbonwineroutes');
    
    return urlObj.toString();
  } catch (error) {
    console.error('[Winalist] Error building affiliate URL:', error);
    return realUrl;
  }
}

export function addGetYourGuideParams(url: string): string {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('partner_id', 'FZRKIIT');
    urlObj.searchParams.set('utm_medium', 'online_publisher');
    urlObj.searchParams.set('cmp', 'lisbonwineroutes');
    return urlObj.toString();
  } catch (error) {
    console.error('[GetYourGuide] Error adding params:', error);
    return url;
  }
}

export function buildBookingAwinUrl(destinationUrl: string, clickref?: string): string {
  const baseUrl = 'https://www.awin1.com/cread.php';
  
  // Build params manually to ensure proper encoding
  let params = `awinmid=18120&awinaffid=1914530`;
  
  if (clickref) {
    params += `&clickref=${encodeURIComponent(clickref)}`;
  }
  
  // ued must be fully URL-encoded
  params += `&ued=${encodeURIComponent(destinationUrl)}`;
  
  return `${baseUrl}?${params}`;
}

export function buildGoogleMapsUrl(name: string, address?: string): string {
  const query = address ? `${name}, ${address}` : name;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function toAffiliateUrl({ provider, url, clickref }: AffiliateUrlParams): string {
  try {
    switch (provider) {
      case 'winalist':
        return buildWinalistAffiliateUrl(url);
      case 'getyourguide':
        return addGetYourGuideParams(url);
      case 'discovercars':
        // Always return fixed URL
        return DISCOVERCARS_AFFILIATE_URL;
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
  discovercars: DISCOVERCARS_AFFILIATE_URL,
};

export function getDefaultAffiliateUrl(provider: AffiliateProvider, clickref?: string): string {
  const baseUrl = DEFAULT_PARTNER_URLS[provider];
  return toAffiliateUrl({ provider, url: baseUrl, clickref });
}

// Helper to resolve affiliate URL for an activity
// Returns real affiliate URL if available, or Google Maps fallback
export interface ActivityAffiliateResult {
  url: string;
  provider: 'winalist' | 'getyourguide' | 'booking' | 'discovercars' | 'googlemaps' | null;
  isFallback: boolean;
}

export function resolveWinalistUrl(
  winalistKey: string,
  locationName: string,
  address?: string
): ActivityAffiliateResult {
  const realUrl = getWinalistRealUrl(winalistKey);
  
  if (realUrl) {
    return {
      url: buildWinalistAffiliateUrl(realUrl),
      provider: 'winalist',
      isFallback: false,
    };
  }
  
  // Log missing URL and return Google Maps fallback
  logMissingWinalistUrl(winalistKey, locationName, address);
  
  return {
    url: buildGoogleMapsUrl(locationName, address),
    provider: 'googlemaps',
    isFallback: true,
  };
}
