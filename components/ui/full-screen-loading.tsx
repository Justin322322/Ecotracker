'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LeafIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FullScreenLoadingProps {
  isVisible: boolean;
  onComplete?: () => void;
  className?: string;
  showSteps?: boolean; // Control whether to show loading steps
  duration?: number; // Total duration in milliseconds
}

interface LoadingStep {
  text: string;
  duration: number;
}

const LOADING_STEPS: LoadingStep[] = [
  { text: 'Initializing EcoTracker...', duration: 1000 },
  { text: 'Loading carbon data...', duration: 1000 },
  { text: 'Preparing your dashboard...', duration: 1000 },
];

const DEFAULT_DURATION = LOADING_STEPS.reduce((acc, step) => acc + step.duration, 0);
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const ANIMATION_VARIANTS = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: EASE_OUT },
  },
  content: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3, ease: EASE_OUT },
  },
  title: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { delay: 0.2, duration: 0.4 },
  },
  subtitle: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { delay: 0.35, duration: 0.4 },
  },
  progress: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { delay: 0.2, duration: 0.3 },
  },
  stepText: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: EASE_OUT },
  },
};

export function FullScreenLoading({
  isVisible,
  onComplete,
  className,
  showSteps = true,
  duration = DEFAULT_DURATION,
}: FullScreenLoadingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Client-side mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lock scroll when visible
  useEffect(() => {
    if (!isVisible) return;
    
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [isVisible]);

  // Reset state when hidden
  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      setProgress(0);
    }
  }, [isVisible]);

  // Progress and step management
  useEffect(() => {
    if (!isMounted || !isVisible) return;

    let currentProgress = 0;
    let progressInterval: NodeJS.Timeout;
    let completeTimeout: NodeJS.Timeout;

    if (showSteps) {
      // Login mode: Step-based progression with text
      let stepIndex = 0;
      const totalSteps = LOADING_STEPS.length;
      const progressPerStep = 100 / totalSteps;
      let stepTimeout: NodeJS.Timeout;

      const advanceStep = () => {
        if (stepIndex >= totalSteps) return;

        const step = LOADING_STEPS[stepIndex];
        if (!step) return;

        setCurrentStep(stepIndex);

        const targetProgress = (stepIndex + 1) * progressPerStep;
        const increment = progressPerStep / (step.duration / 100);

        // Smooth progress animation
        progressInterval = setInterval(() => {
          currentProgress = Math.min(currentProgress + increment, targetProgress);
          setProgress(currentProgress);
        }, 100);

        // Move to next step
        stepTimeout = setTimeout(() => {
          clearInterval(progressInterval);
          setProgress(targetProgress);
          stepIndex++;
          
          if (stepIndex < totalSteps) {
            advanceStep();
          } else {
            // Complete
            setProgress(100);
            completeTimeout = setTimeout(() => {
              onComplete?.();
            }, 300);
          }
        }, step.duration);
      };

      advanceStep();

      return () => {
        clearInterval(progressInterval);
        clearTimeout(stepTimeout);
        clearTimeout(completeTimeout);
      };
    } else {
      // Logout mode: Smooth continuous progression
      const increment = 100 / (duration / 100);

      progressInterval = setInterval(() => {
        currentProgress = Math.min(currentProgress + increment, 100);
        setProgress(currentProgress);

        if (currentProgress >= 100) {
          clearInterval(progressInterval);
          completeTimeout = setTimeout(() => {
            onComplete?.();
          }, 300);
        }
      }, 100);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(completeTimeout);
      };
    }
  }, [isVisible, isMounted, onComplete, showSteps, duration]);

  if (!isMounted) return null;

  const clampedProgress = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={ANIMATION_VARIANTS.overlay.initial}
          animate={ANIMATION_VARIANTS.overlay.animate}
          exit={ANIMATION_VARIANTS.overlay.exit}
          transition={ANIMATION_VARIANTS.overlay.transition}
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center',
            'min-h-screen w-full bg-black',
            className
          )}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-green-600/10" />
          
          {/* Overlay for text contrast */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center justify-center w-80 sm:w-96 px-4 sm:px-6 text-center">
            
            {/* Logo */}
            <LeafIcon 
              className="mb-4 h-8 w-8 text-green-400" 
              aria-label="EcoTracker logo" 
            />

            {/* Header */}
            <motion.div
              initial={ANIMATION_VARIANTS.content.initial}
              animate={ANIMATION_VARIANTS.content.animate}
              transition={ANIMATION_VARIANTS.content.transition}
              className="mb-8 flex flex-col items-center space-y-2 min-h-[4rem]"
            >
              <motion.h1
                initial={ANIMATION_VARIANTS.title.initial}
                animate={ANIMATION_VARIANTS.title.animate}
                transition={ANIMATION_VARIANTS.title.transition}
                className="text-2xl font-bold text-white"
              >
                EcoTracker
              </motion.h1>
              <motion.p
                initial={ANIMATION_VARIANTS.subtitle.initial}
                animate={ANIMATION_VARIANTS.subtitle.animate}
                transition={ANIMATION_VARIANTS.subtitle.transition}
                className="text-sm text-neutral-400"
              >
                {showSteps ? 'Welcome back!' : 'Logging out...'}
              </motion.p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={ANIMATION_VARIANTS.progress.initial}
              animate={ANIMATION_VARIANTS.progress.animate}
              transition={ANIMATION_VARIANTS.progress.transition}
              className="w-full mb-6"
            >
              <div
                className="relative h-3 bg-neutral-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-neutral-700/50 w-64 sm:w-80 mx-auto"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={clampedProgress}
                aria-label="Loading progress"
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 via-green-400 to-green-300 rounded-full shadow-lg shadow-green-500/25"
                  style={{ width: `${clampedProgress}%` }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                />
              </div>
              
              {/* Progress labels */}
              <div className="flex items-center justify-between mt-3 text-xs text-neutral-400 select-none">
                <span className="tabular-nums font-mono w-8 text-left">0%</span>
                <span className="tabular-nums font-mono w-10 text-center text-green-400 font-medium">
                  {clampedProgress}%
                </span>
                <span className="tabular-nums font-mono w-12 text-right">100%</span>
              </div>
            </motion.div>

            {/* Loading step text - always reserve space to prevent layout shift */}
            <div className="h-12 flex items-center justify-center">
              {showSteps && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={ANIMATION_VARIANTS.stepText.initial}
                    animate={ANIMATION_VARIANTS.stepText.animate}
                    exit={ANIMATION_VARIANTS.stepText.exit}
                    transition={ANIMATION_VARIANTS.stepText.transition}
                    className="flex items-center justify-center text-neutral-300 w-full"
                  >
                    <span className="text-base font-medium">
                      {LOADING_STEPS[currentStep]?.text || 'Loading...'}
                    </span>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}