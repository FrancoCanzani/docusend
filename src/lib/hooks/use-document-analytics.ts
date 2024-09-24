'use client';
import { useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from './use-user';
import getEmailFromCookie from '../helpers/get-email-from-cookie';

export default function useDocumentAnalytics(document_id: string) {
  const pathname = usePathname();
  const startTimeRef = useRef(Date.now());
  const accumulatedTimeRef = useRef(0);
  const { user } = useUser();

  const sendAnalyticsData = useCallback(() => {
    const cookieData = document.cookie
      .split('; ')
      .find((row) => row.startsWith('userGeoData='));
    let geoData = null;
    if (cookieData) {
      const geoDataJson = cookieData.split('=')[1];
      geoData = JSON.parse(decodeURIComponent(geoDataJson));
    }

    const currentTime = Date.now();
    const sessionTime = Math.floor((currentTime - startTimeRef.current) / 1000);
    accumulatedTimeRef.current += sessionTime;

    // Only send if time has been accumulated
    if (accumulatedTimeRef.current > 0) {
      const data = {
        email: user?.email ?? getEmailFromCookie(),
        document_id,
        pathname,
        browser: getBrowser(),
        device_type: getDeviceType(),
        timestamp: new Date().toISOString(),
        duration: accumulatedTimeRef.current,
        ip: geoData?.ip || null,
        city: geoData?.city || null,
        country: geoData?.country || null,
        country_code: geoData?.countryRegion || null,
        latitude: geoData?.latitude || null,
        longitude: geoData?.longitude || null,
      };

      const blob = new Blob([JSON.stringify(data)], {
        type: 'application/json',
      });

      const beaconSent = navigator.sendBeacon(
        '/api/analytics/track-view',
        blob
      );

      if (!beaconSent) {
        fetch('/api/analytics/track-view', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' },
        });
      }

      accumulatedTimeRef.current = 0;
    }

    startTimeRef.current = currentTime;
  }, [document_id, user?.email, pathname]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendAnalyticsData();
      } else {
        startTimeRef.current = Date.now();
      }
    };

    const handleBeforeUnload = () => {
      sendAnalyticsData();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    sendAnalyticsData();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      sendAnalyticsData();
    };
  }, [sendAnalyticsData]);

  return null;
}

function getBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung Internet';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('Trident')) return 'Internet Explorer';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Unknown';
}
function getDeviceType() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return 'Mobile';
  }
  return 'Desktop';
}
