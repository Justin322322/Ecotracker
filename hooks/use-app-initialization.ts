'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface InitializationState {
  isInitializing: boolean;
  isComplete: boolean;
  currentStep: string;
  progress: number;
  error?: string;
}

interface UseAppInitializationOptions {
  minLoadingTime?: number; // Minimum time to show loading (for UX)
  onceKey?: string; // When provided, loading runs once per browser (localStorage)
  autoStart?: boolean; // If false, mark complete unless triggered later
}

const initializationSteps = [
  { key: 'auth', name: 'Verifying authentication...', weight: 30 },
  { key: 'profile', name: 'Loading user profile...', weight: 25 },
  { key: 'carbon-data', name: 'Fetching carbon emission data...', weight: 25 },
  { key: 'analytics', name: 'Calculating analytics...', weight: 20 },
];

function useAppInitialization(options: UseAppInitializationOptions = {}) {
  const { minLoadingTime = 2000, onceKey, autoStart = true } = options;
  
  const [state, setState] = useState<InitializationState>({
    isInitializing: true,
    isComplete: false,
    currentStep: '',
    progress: 0,
  });

  const simulateDataLoading = useCallback(async (): Promise<void> => {
    // Simulate network request
    const delay = 300 + Math.random() * 700; // 300-1000ms
    await new Promise(resolve => setTimeout(resolve, delay));
  }, []);

  const onceKeyRef = useRef(onceKey);
  const initialize = useCallback(async () => {
    const startTime = Date.now();
    let currentProgress = 0;

    try {
      setState(prev => ({ 
        ...prev, 
        isInitializing: true, 
        isComplete: false, 
        error: undefined 
      }));

      for (let i = 0; i < initializationSteps.length; i++) {
        const step = initializationSteps[i];
        
        if (!step) continue;
        
        setState(prev => ({
          ...prev,
          currentStep: step.name,
          progress: currentProgress,
        }));

        // Simulate loading for this step
        await simulateDataLoading();

        // Update progress
        currentProgress += step.weight;
        setState(prev => ({
          ...prev,
          progress: Math.min(currentProgress, 100),
        }));
      }

      // Ensure minimum loading time for better UX
      const elapsed = Date.now() - startTime;
      if (elapsed < minLoadingTime) {
        await new Promise(resolve => 
          setTimeout(resolve, minLoadingTime - elapsed)
        );
      }

      // Set to 100% and complete
      setState(prev => ({
        ...prev,
        progress: 100,
        currentStep: 'Initialization complete!',
      }));

      // Small delay before marking as complete
      await new Promise(resolve => setTimeout(resolve, 300));

      setState(prev => ({
        ...prev,
        isInitializing: false,
        isComplete: true,
      }));

      // Persist once flag if configured
      if (onceKeyRef.current && typeof window !== 'undefined') {
        try { localStorage.setItem(onceKeyRef.current, '1'); } catch {}
      }

    } catch (error) {
      setState(prev => ({
        ...prev,
        isInitializing: false,
        error: error instanceof Error ? error.message : 'Initialization failed',
      }));
    }
  }, [minLoadingTime, simulateDataLoading]);

  const resetInitialization = useCallback(() => {
    setState({
      isInitializing: true,
      isComplete: false,
      currentStep: '',
      progress: 0,
    });
  }, []);

  // Keep refs in sync without affecting effects order/size
  useEffect(() => { onceKeyRef.current = onceKey; }, [onceKey]);
  const initializeRef = useRef(initialize);
  useEffect(() => { initializeRef.current = initialize; }, [initialize]);

  useEffect(() => {
    // Decide whether to start initialization now
    if (typeof window === 'undefined') return;

    // If not set to auto start, immediately mark complete
    if (!autoStart) {
      setState({
        isInitializing: false,
        isComplete: true,
        currentStep: 'Initialization complete!',
        progress: 100,
      });
      return;
    }

    try {
      const force = localStorage.getItem('forceDashboardLoaderOnce') === '1';
      if (force) {
        // Consume the force flag and run initialization
        localStorage.removeItem('forceDashboardLoaderOnce');
        initializeRef.current();
        return;
      }
      if (onceKeyRef.current) {
        const done = localStorage.getItem(onceKeyRef.current) === '1';
        if (done) {
          setState({
            isInitializing: false,
            isComplete: true,
            currentStep: 'Initialization complete!',
            progress: 100,
          });
          return;
        }
      }
    } catch {}

    initializeRef.current();
  }, [autoStart]);

  return {
    ...state,
    initialize,
    resetInitialization,
  };
}


// Hook for dashboard loading state
export function useDashboardLoading() {
  // Only show loader right after successful login (when flag is present)
  const [shouldRun, setShouldRun] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const force = localStorage.getItem('forceDashboardLoaderOnce') === '1';
      if (force) {
        setShouldRun(true);
      } else {
        setShouldRun(false);
      }
    } catch {
      setShouldRun(false);
    }
  }, []);

  // Match the FullScreenLoading login steps total (~3000ms) + completion buffer (~300ms)
  const initialization = useAppInitialization({ minLoadingTime: 3300, autoStart: shouldRun });

  return {
    isLoading: shouldRun ? initialization.isInitializing : false,
    isComplete: shouldRun ? initialization.isComplete : true,
    progress: shouldRun ? initialization.progress : 100,
    currentStep: shouldRun ? initialization.currentStep : 'Initialization complete!',
    error: initialization.error,
    retry: initialization.initialize,
  };
}
