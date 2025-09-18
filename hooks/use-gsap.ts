'use client';

import React, { useState, useEffect } from 'react';

// GSAP type definition
interface GSAPTimeline {
  to: (targets: string | Element | Element[], vars: Record<string, unknown>, position?: number | string) => GSAPTimeline;
  from: (targets: string | Element | Element[], vars: Record<string, unknown>, position?: number | string) => GSAPTimeline;
  fromTo: (targets: string | Element | Element[], fromVars: Record<string, unknown>, toVars: Record<string, unknown>, position?: number | string) => GSAPTimeline;
  set: (targets: string | Element | Element[], vars: Record<string, unknown>, position?: number | string) => GSAPTimeline;
  play: () => void;
  reverse: () => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
}

interface GSAPContext {
  revert: () => void;
  add: (func: () => void) => void;
}

interface GSAPCore {
  to: (targets: string | Element | Element[], vars: Record<string, unknown>) => unknown;
  from: (targets: string | Element | Element[], vars: Record<string, unknown>) => unknown;
  fromTo: (targets: string | Element | Element[], fromVars: Record<string, unknown>, toVars: Record<string, unknown>) => unknown;
  set: (targets: string | Element | Element[], vars: Record<string, unknown>) => unknown;
  timeline: (vars?: Record<string, unknown>) => GSAPTimeline;
  context: (func: () => void, scope?: string | Element | Element[] | React.RefObject<HTMLElement | null>) => GSAPContext;
  // Add other GSAP methods as needed
}

// Extend Window interface for GSAP
declare global {
  interface Window {
    gsap: GSAPCore;
  }
}

export function useGSAP() {
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const [gsap, setGsap] = useState<GSAPCore | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !gsapLoaded) {
      // Check if GSAP is already loaded
      if (window.gsap) {
        setGsap(window.gsap);
        setGsapLoaded(true);
        return;
      }

      // Dynamic import to prevent HMR issues
      import('gsap')
        .then((module) => {
          window.gsap = module.gsap;
          setGsap(module.gsap);
          setGsapLoaded(true);
        })
        .catch((error) => {
          console.warn('Failed to load GSAP:', error);
          setGsapLoaded(true); // Continue without animations
        });
    }
  }, [gsapLoaded]);

  return { gsap, gsapLoaded };
}
