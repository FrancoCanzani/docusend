import { useEffect, useCallback, useState } from 'react';
import { usePostHog } from 'posthog-js/react';
import { useUser } from './use-user';
import getEmailFromCookie from '../helpers/get-email-from-cookie';

export function useDocumentAnalytics(documentId: string) {
  const posthog = usePostHog();
  const { user } = useUser();
  const [hasTracked, setHasTracked] = useState(false);

  const trackPageView = useCallback(() => {
    const email = user?.email ?? getEmailFromCookie();
    console.log('Tracking with email:', email);
    posthog.capture('document_view', {
      document_id: documentId,
      email: email,
    });
    setHasTracked(true);
  }, [documentId, user, posthog]);

  useEffect(() => {
    if (user !== null && !hasTracked) {
      trackPageView();
    }
  }, [user, hasTracked, trackPageView]);

  return null;
}
