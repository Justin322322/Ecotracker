'use client';

import { useEffect } from 'react';

export default function UnregisterServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().catch(() => {});
        });
      }).catch(() => {});
    }
  }, []);

  return null;
}


