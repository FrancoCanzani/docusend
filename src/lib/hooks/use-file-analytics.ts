import { useEffect, useCallback, useState } from 'react';
import { usePostHog } from 'posthog-js/react';
import { useUser } from './use-user';
import getEmailFromCookie from '../helpers/get-email-from-cookie';

export function useFileAnalytics(fileId: string) {
  const posthog = usePostHog();
  const { user } = useUser();
  const [hasTracked, setHasTracked] = useState(false);

  const trackPageView = useCallback(() => {
    const email = user?.email ?? getEmailFromCookie();
    console.log('Tracking with email:', email);
    posthog.capture('file_view', {
      file_id: fileId,
      email: email,
    });
    setHasTracked(true);
  }, [fileId, user, posthog]);

  useEffect(() => {
    if (user !== null && !hasTracked) {
      trackPageView();
    }
  }, [user, hasTracked, trackPageView]);

  return null;
}
