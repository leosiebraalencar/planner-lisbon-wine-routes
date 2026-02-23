export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function extractCoordsFromGoogleMapsUrl(url: string): { lat: number; lng: number } | null {
  const match = url.match(/destination=([0-9.-]+),([0-9.-]+)/);
  if (match) {
    return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  }
  return null;
}

export function buildGoogleMapsRouteUrl(
  origin: string,
  destination: string,
  waypoints?: string[]
): string {
  const base = 'https://www.google.com/maps/dir/?api=1';
  const params = new URLSearchParams();
  params.set('api', '1');
  params.set('origin', origin);
  params.set('destination', destination);
  params.set('travelmode', 'driving');
  if (waypoints && waypoints.length > 0) {
    params.set('waypoints', waypoints.join('|'));
  }
  return `${base}&${params.toString().replace('api=1&', '')}`;
}

export function buildDayRouteUrl(
  stops: { name: string; address?: string }[]
): string | null {
  if (stops.length < 2) return null;
  const addresses = stops
    .map(s => s.address || s.name)
    .filter(Boolean);
  if (addresses.length < 2) return null;
  const origin = addresses[0];
  const destination = addresses[addresses.length - 1];
  const waypoints = addresses.slice(1, -1);
  return buildGoogleMapsRouteUrl(origin, destination, waypoints);
}
