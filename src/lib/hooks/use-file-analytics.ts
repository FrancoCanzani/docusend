import { useEffect, useRef, useCallback } from 'react';
import { recordDocumentView } from '../actions';

interface AnalyticsData {
  documentId: string;
  userId?: string;
  authEmail?: string;
}

export function useFileAnalytics({
  documentId,
  userId,
  authEmail,
}: AnalyticsData) {
  const startTimeRef = useRef(Date.now());

  const getEmailFromCookie = useCallback((): string | null => {
    if (typeof document === 'undefined') return null; // Check for server-side rendering
    const cookies = document.cookie.split(';');
    const emailCookie = cookies.find((cookie) =>
      cookie.trim().startsWith('user_email=')
    );
    if (emailCookie) {
      const [, value] = emailCookie.split('=');
      return decodeURIComponent(value.trim());
    }
    return null;
  }, []);

  const trackTimeSpent = useCallback(() => {
    const endTime = Date.now();
    const timeSpent = Math.round((endTime - startTimeRef.current) / 1000); // Time in seconds
    const email = authEmail ?? getEmailFromCookie() ?? undefined;

    const formData = new FormData();
    formData.append('documentId', documentId);
    formData.append('userId', userId || '');
    if (email) formData.append('email', email);
    formData.append('timeSpent', timeSpent.toString());

    recordDocumentView(formData);
  }, [documentId, userId, authEmail, getEmailFromCookie]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      trackTimeSpent();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      trackTimeSpent();
    };
  }, [trackTimeSpent]);

  return { trackTimeSpent };
}
