import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to handle initial browser geolocation permission prompt,
 * re-prompting on form interactions, and graceful fallback to null coordinates.
 */
export function useLocationPermission() {
  const [coords, setCoords] = useState({ latitude: null, longitude: null });
  const [status, setStatus] = useState('prompt'); // 'prompt' | 'granted' | 'denied' | 'error'
  const [showBanner, setShowBanner] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      console.warn('Geolocation is not supported by this browser.');
      setStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setStatus('granted');
        setShowBanner(false);
        console.log('📍 Geolocation captured:', position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.warn('Geolocation permission denied or unretrievable:', error.message);
        setStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  // 1. Initial Permission Prompt on site load
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // 2. Trigger banner prompt if status is denied or prompt when interacting with forms
  const promptFormLocation = useCallback(() => {
    if (status !== 'granted' && !bannerDismissed) {
      setShowBanner(true);
      requestLocation();
    }
  }, [status, bannerDismissed, requestLocation]);

  const dismissBanner = useCallback(() => {
    setShowBanner(false);
    setBannerDismissed(true);
  }, []);

  return {
    coords,
    status,
    showBanner,
    requestLocation,
    promptFormLocation,
    dismissBanner,
  };
}
