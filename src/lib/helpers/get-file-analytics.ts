export default async function getFileAnalytics(fileId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_POSTHOG_HOST}/api/projects/${process.env.NEXT_PUBLIC_POSTHOG_PROJECT_ID}/events/?event=file_view&properties=[{"key":"file_id","value":"${fileId}","operator":"exact"}]`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_POSTHOG_PERSONAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch PostHog data');
  }

  const data = await res.json();

  return data;
}
