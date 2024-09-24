import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = createClient();
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
      city: data.city,
      country: data.country,
      country_code: data.country_code,
      latitude: data.latitude,
      longitude: data.longitude,
    };

    const { error } = await supabase
      .from('document_analytics')
      .insert(analyticsEntry);

    if (error) {
      throw error;
    }

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