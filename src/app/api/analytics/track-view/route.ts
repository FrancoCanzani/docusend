import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { decodeCityName } from '@/lib/helpers/decode-city-name';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const data = await req.json();

    if (!data.document_id) {
      throw new Error('Missing required fields');
    }

    const analyticsEntry = {
      email: data.email,
      document_id: data.document_id,
      pathname: data.pathname,
      browser: data.browser,
      device_type: data.device_type,
      timestamp: new Date(data.timestamp),
      duration: data.duration,
      ip: data.ip,
      city: decodeCityName(data.city),
      country: data.country,
      country_region: data.country_region,
      latitude: data.latitude,
      longitude: data.longitude,
    };

    const { error } = await supabase
      .from('document_analytics')
      .insert(analyticsEntry);

    if (error) {
      throw error;
    }

    revalidatePath(`/document/[documentId]`, 'page');

    return NextResponse.json(
      { message: 'Analytics data processed successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: 'Failed to process analytics data', error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: 'An unknown error occurred' },
        { status: 500 }
      );
    }
  }
}
