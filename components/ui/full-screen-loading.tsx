'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LeafIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FullScreenLoadingProps {
  isVisible: boolean;
  onComplete?: () => void;
  className?: string;
  showSteps?: boolean;
  duration?: number;
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
  fadeIn: {
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    // Prevent scrolling and layout shifts
    const previousOverflow = document.documentElement.style.overflow;
    const previousOverflowY = document.documentElement.style.overflowY;
    const previousHeight = document.documentElement.style.height;
    const previousWidth = document.documentElement.style.width;
    
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';
    document.documentElement.style.width = '100vw';
    
    // Also prevent body scrolling
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.width = '100vw';
    
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      document.documentElement.style.overflowY = previousOverflowY;
      document.documentElement.style.height = previousHeight;
      document.documentElement.style.width = previousWidth;
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.width = '';
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      setProgress(0);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isMounted || !isVisible) return;

    let currentProgress = 0;
    let progressInterval: NodeJS.Timeout;
    let completeTimeout: NodeJS.Timeout;

    if (showSteps) {
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

        progressInterval = setInterval(() => {
          currentProgress = Math.min(currentProgress + increment, targetProgress);
          setProgress(currentProgress);
        }, 100);

        stepTimeout = setTimeout(() => {
          clearInterval(progressInterval);
          setProgress(targetProgress);
          stepIndex++;
          
          if (stepIndex < totalSteps) {
            advanceStep();
          } else {
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
            'h-screen w-screen bg-black overflow-hidden',
            className
          )}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            overflow: 'hidden'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-green-600/10" />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

          {/* Fixed container to prevent any layout shifts */}
          <div className="relative z-10 flex flex-col items-center justify-center w-80 sm:w-96 px-4 sm:px-6">
            
            <LeafIcon 
              className="mb-4 h-8 w-8 text-green-400 flex-shrink-0" 
              aria-label="EcoTracker logo" 
            />

            {/* Header - fixed height */}
            <motion.div
              initial={ANIMATION_VARIANTS.fadeIn.initial}
              animate={ANIMATION_VARIANTS.fadeIn.animate}
              transition={ANIMATION_VARIANTS.fadeIn.transition}
              className="mb-8 flex flex-col items-center space-y-2 h-[4.5rem] justify-center"
            >
              <motion.h1
                initial={ANIMATION_VARIANTS.title.initial}
                animate={ANIMATION_VARIANTS.title.animate}
                transition={ANIMATION_VARIANTS.title.transition}
                className="text-2xl font-bold text-white leading-tight"
              >
                EcoTracker
              </motion.h1>
              <motion.p
                initial={ANIMATION_VARIANTS.subtitle.initial}
                animate={ANIMATION_VARIANTS.subtitle.animate}
                transition={ANIMATION_VARIANTS.subtitle.transition}
                className="text-sm text-neutral-400 leading-tight"
              >
                {showSteps ? 'Welcome back!' : 'Logging out...'}
              </motion.p>
            </motion.div>

            {/* Progress bar - fixed width */}
            <motion.div
              initial={ANIMATION_VARIANTS.progress.initial}
              animate={ANIMATION_VARIANTS.progress.animate}
              transition={ANIMATION_VARIANTS.progress.transition}
              className="w-full mb-6 flex-shrink-0"
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
              
              <div className="flex items-center justify-between mt-3 text-xs text-neutral-400 select-none">
                <span className="tabular-nums font-mono w-8 text-left">0%</span>
                <span className="tabular-nums font-mono w-8 text-center text-green-400 font-medium">
                  {clampedProgress}%
                </span>
                <span className="tabular-nums font-mono w-8 text-right">100%</span>
              </div>
            </motion.div>

            {/* Step text - ALWAYS rendered with fixed height to prevent layout shift */}
            <div className="h-12 flex items-center justify-center w-full flex-shrink-0">
              {showSteps ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={ANIMATION_VARIANTS.stepText.initial}
                    animate={ANIMATION_VARIANTS.stepText.animate}
                    exit={ANIMATION_VARIANTS.stepText.exit}
                    transition={ANIMATION_VARIANTS.stepText.transition}
                    className="flex items-center justify-center text-neutral-300 w-full"
                  >
                    <span className="text-base font-medium text-center leading-tight">
                      {LOADING_STEPS[currentStep]?.text || 'Loading...'}
                    </span>
                  </motion.div>
                </AnimatePresence>
              ) : (
                // Invisible placeholder to maintain exact same height
                <div className="flex items-center justify-center text-neutral-300 w-full opacity-0 pointer-events-none">
                  <span className="text-base font-medium text-center leading-tight">
                    Placeholder text
                  </span>
                </div>
              )}
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}