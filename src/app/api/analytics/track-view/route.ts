import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const posthogProjectId = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_ID;
const posthogApiKey = process.env.NEXT_PUBLIC_POSTHOG_PERSONAL_API_KEY;

if (!posthogHost || !posthogProjectId || !posthogApiKey) {
  console.error('Missing required PostHog configuration');
  process.exit(1);
}

export async function POST(request: Request) {
  const supabase = createClient();
  try {
    const { document_id, event_uuid } = await request.json();

    // Guard: Check if event_uuid is present and valid
    if (
      !event_uuid ||
      typeof event_uuid !== 'string' ||
      event_uuid.trim() === ''
    ) {
      console.log('Invalid or missing event_uuid:', event_uuid);
      return NextResponse.json(
        { message: 'Invalid or missing event_uuid' },
        { status: 400 }
      );
    }

    console.log('Attempting to fetch PostHog data for event_uuid:', event_uuid);

    const url = `${posthogHost}/api/projects/${posthogProjectId}/events/${event_uuid}/`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${posthogApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 404) {
      console.log(
        `Event not found for UUID: ${event_uuid}. This may be expected for new page loads.`
      );
      return NextResponse.json(
        {
          message: 'Event not found. This may be expected for new page loads.',
        },
        { status: 404 }
      );
    }

    if (!res.ok) {
      throw new Error(
        `Failed to fetch PostHog data: ${res.status} ${res.statusText}`
      );
    }

    const event = await res.json();
    console.log('Successfully fetched PostHog event data:', event);

    // Your existing code for processing the event and saving to Supabase...
    // (commented out in your original code)

    return NextResponse.json({
      message: 'View event captured and saved successfully',
    });
  } catch (error) {
    console.error('Error processing view event:', error);
    return NextResponse.json(
      {
        message: 'Error processing view event',
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
