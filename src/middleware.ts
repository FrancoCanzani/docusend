import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from './lib/supabase/middleware';
import { geolocation, ipAddress } from '@vercel/functions';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'development') {
    // Mock data for development
    const mockGeo = {
      city: 'MockCity',
      country: 'MockCountry',
      countryRegion: 'MockRegion',
      flag: '🏳️',
      latitude: '0',
      longitude: '0',
      region: 'MockRegion',
      ip: '127.0.0.1',
    };
    response.cookies.set('userGeoData', JSON.stringify(mockGeo), {
      httpOnly: false,
    });
  } else {
    const { city, country, countryRegion, flag, latitude, longitude, region } =
      geolocation(request);
    const ip = ipAddress(request);
    const geo = {
      city,
      country,
      countryRegion,
      flag,
      latitude,
      longitude,
      region,
      ip,
    };

    console.log(geo);

    response.cookies.set('userGeoData', JSON.stringify(geo), {
      httpOnly: false,
    });
  }

  await updateSession(request);
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
