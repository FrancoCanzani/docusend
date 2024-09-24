import { type NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';
import { geolocation, ipAddress, Geo } from '@vercel/functions';

export async function middleware(request: NextRequest) {
  const { city, country, countryRegion, flag, latitude, longitude, region } =
    geolocation(request);
  const requestHeaders = new Headers(request.headers);

  const geo = {
    city: city,
    country: country,
    countryRegion: countryRegion,
    flag: flag,
    latitude: latitude,
    longitude: longitude,
    region: region,
  };
  console.log(geo);

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
