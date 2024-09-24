'use client';

import React, { useEffect, useState } from 'react';

interface TimeMetrics {
  averageTimeSpent: number;
  totalViewTime: number;
  totalViews: number;
}

interface EventData {
  event: string;
  properties: {
    document_id: string;
    distinct_id: string;
  };
  timestamp: string;
}

async function getDocumentEvents(
  documentId: string,
  eventName: string
): Promise<EventData[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_POSTHOG_HOST}/api/projects/${process.env.NEXT_PUBLIC_POSTHOG_PROJECT_ID}/events/?event=${eventName}&properties=[{"key":"document_id","value":"${documentId}","operator":"exact"}]`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_POSTHOG_PERSONAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch PostHog data for ${eventName}`);
  }
  const data = await res.json();
  return data.results;
}

const DocumentTimeMetrics: React.FC<{ documentId: string }> = ({
  documentId,
}) => {
  const [metrics, setMetrics] = useState<TimeMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const openEvents = await getDocumentEvents(
          documentId,
          'document_opened'
        );
        // console.log(openEvents);

        const closeEvents = await getDocumentEvents(
          documentId,
          'document_leave'
        );

        console.log(closeEvents);

        const totalViews = openEvents.length;
        let totalViewTime = 0;

        openEvents.forEach((openEvent) => {
          const closeEvent = closeEvents.find(
            (closeEvent) =>
              closeEvent.properties.distinct_id ===
                openEvent.properties.distinct_id &&
              new Date(closeEvent.timestamp) > new Date(openEvent.timestamp)
          );

          if (closeEvent) {
            const viewTime =
              new Date(closeEvent.timestamp).getTime() -
              new Date(openEvent.timestamp).getTime();
            totalViewTime += viewTime;
          }
        });

        // Convert totalViewTime from milliseconds to seconds
        totalViewTime = totalViewTime / 1000;
        const averageTimeSpent =
          totalViews > 0 ? totalViewTime / totalViews : 0;

        setMetrics({
          averageTimeSpent,
          totalViewTime,
          totalViews,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [documentId]);

  if (loading) return <div>Loading metrics...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!metrics) return <div>No metrics available for this document.</div>;

  return (
    <div>
      <h3>Document Time Metrics</h3>
      <p>
        <strong>Total Views:</strong> {metrics.totalViews}
      </p>
      <p>
        <strong>Total View Time:</strong> {metrics.totalViewTime.toFixed(2)}{' '}
        seconds
      </p>
      <p>
        <strong>Average Time Spent:</strong>{' '}
        {metrics.averageTimeSpent.toFixed(2)} seconds
      </p>
    </div>
  );
};

export default DocumentTimeMetrics;
