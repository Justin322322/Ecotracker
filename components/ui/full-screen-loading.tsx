'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { LeafIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
// Removed PixelBlast to prevent hydration issues

interface FullScreenLoadingProps {
  isVisible: boolean;
  onComplete?: () => void;
  loadingTime?: number; // in milliseconds
  className?: string;
  variant?: 'login' | 'logout';
}

const loginSteps = [
  { text: 'Initializing EcoTracker...', duration: 1000 },
  { text: 'Loading carbon data...', duration: 1000 },
  { text: 'Preparing your dashboard...', duration: 1000 },
];

const logoutSteps = [
  { text: 'Signing you out...', duration: 600 },
  { text: 'Clearing session data...', duration: 600 },
  { text: 'Redirecting...', duration: 600 },
];

export function FullScreenLoading({
  isVisible,
  onComplete,
  className,
  variant = 'login',
}: FullScreenLoadingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const steps = useMemo(() => (variant === 'logout' ? logoutSteps : loginSteps), [variant]);

  const onCompleteRef = useRef<(() => void) | undefined>(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Ensure component is mounted on client side to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent background interaction/scroll while loader is visible
  useEffect(() => {
    if (!isVisible) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isMounted) return;
    if (!isVisible) {
      // Reset state when not visible
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    // Step-based progression for both login and logout variants
    let stepIndex = 0;
    let progressValue = 0;
    const totalSteps = steps.length;
    let progressInterval: NodeJS.Timeout | undefined;
    let stepTimeoutId: NodeJS.Timeout | undefined;
    let completeTimeoutId: NodeJS.Timeout | undefined;

    const updateStep = () => {
      if (stepIndex < totalSteps) {
        setCurrentStep(stepIndex);

        const stepDuration = steps[stepIndex]?.duration || 1000;
        const stepProgress = 100 / totalSteps;
        const targetProgress = (stepIndex + 1) * stepProgress;

        // Animate progress for this step smoothly
        progressInterval = setInterval(() => {
          const increment = (stepProgress / (stepDuration / 100));
          progressValue = Math.min(progressValue + increment, targetProgress);
          setProgress(progressValue);
        }, 100);

        stepTimeoutId = setTimeout(() => {
          clearInterval(progressInterval);
          setProgress(targetProgress);
          stepIndex++;
          if (stepIndex < totalSteps) {
            updateStep();
          } else {
            // Complete loading
            setProgress(100);
            completeTimeoutId = setTimeout(() => {
              onCompleteRef.current?.();
            }, 300);
          }
        }, stepDuration);
      }
    };

    updateStep();

    // Cleanup function
    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (stepTimeoutId) clearTimeout(stepTimeoutId);
      if (completeTimeoutId) clearTimeout(completeTimeoutId);
    };
  }, [isVisible, isMounted, steps]);

  // Avoid hydration issues
  if (!isMounted) {
    return null;
  }

  const content = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, ...(variant === 'logout' ? { scale: 1 } : {}) }}
          animate={{ opacity: 1, ...(variant === 'logout' ? {} : { scale: 1 }) }}
          exit={{ opacity: 0, ...(variant === 'logout' ? { scale: 1 } : { scale: 1.02 }) }}
          transition={{
            duration: 0.35,
            ease: "easeOut",
          }}
          className={cn(
            'fixed inset-0 flex items-center justify-center bg-black',
            variant === 'logout' ? 'z-[2147483647]' : 'z-50',
            className
          )}
        >
          {/* Simple background gradient instead of PixelBlast */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-900/20 to-green-600/10" />
          
          {/* Light overlay with subtle blur for better text readability */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center justify-center max-w-lg mx-auto px-6 text-center">
            {/* Static leaf icon logo (no animation) */}
            <LeafIcon className="mb-4 h-8 w-8 text-green-400" aria-label="EcoTracker logo" />
            <motion.div
              initial={{ opacity: 0, ...(variant === 'logout' ? {} : { y: -20, scale: 0.98 }) }}
              animate={{ opacity: 1, ...(variant === 'logout' ? {} : { y: 0, scale: 1 }) }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mb-8 flex flex-col items-center space-y-2"
            >
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-2xl font-bold text-white"
              >
                EcoTracker
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="text-sm text-neutral-400"
              >
                {variant === 'login' ? 'Welcome back!' : 'Thank you for using EcoTracker'}
              </motion.p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, ...(variant === 'logout' ? {} : { y: 20 }) }}
              animate={{ opacity: 1, ...(variant === 'logout' ? {} : { y: 0 }) }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="w-full mx-auto mb-6 shrink-0"
            >
              <div
                className="relative h-3 bg-neutral-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-neutral-700/50 mx-auto"
                style={{ width: 320 }}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.max(0, Math.min(100, Math.round(progress)))}
              >
                <motion.div
                  className={cn(
                    'h-full bg-gradient-to-r from-green-500 via-green-400 to-green-300 rounded-full shadow-lg shadow-green-500/25',
                    variant === 'logout' ? 'transition-[width] duration-[280ms] ease-linear' : ''
                  )}
                  style={{
                    width: `${Math.max(0, Math.min(100, progress))}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between mt-3 text-xs text-neutral-400 select-none">
                <span className="tabular-nums font-mono w-8 text-left">0%</span>
                <span className="tabular-nums font-mono w-10 text-center text-green-400 font-medium">
                  {Math.max(0, Math.min(100, Math.round(progress)))}%
                </span>
                <span className="tabular-nums font-mono w-12 text-right">100%</span>
              </div>
            </motion.div>

            {/* Loading steps */}
            <motion.div
              initial={{ opacity: 0, ...(variant === 'logout' ? {} : { y: 20 }) }}
              animate={{ opacity: 1, ...(variant === 'logout' ? {} : { y: 0 }) }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="text-center min-h-[3rem] flex items-center justify-center"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, ...(variant === 'logout' ? {} : { y: 10 }) }}
                  animate={{ opacity: 1, ...(variant === 'logout' ? {} : { y: 0 }) }}
                  exit={{ opacity: 0, ...(variant === 'logout' ? {} : { y: -10 }) }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex items-center justify-center space-x-3 text-neutral-300"
                >
                  <span className="text-base font-medium">
                    {steps[currentStep]?.text || 'Loading...'}
                  </span>
                </motion.div>
              </AnimatePresence>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render logout loader at top layer using a portal
  if (variant === 'logout' && typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }

  return content;
}
