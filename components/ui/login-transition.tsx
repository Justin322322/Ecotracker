'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2Icon, ArrowRightIcon } from 'lucide-react';
// Removed PixelBlast to prevent hydration issues

interface LoginTransitionProps {
  isVisible: boolean;
  onComplete?: () => void;
}

const transitionSteps = [
  { text: 'Verifying credentials...', duration: 1000 },
  { text: 'Setting up your profile...', duration: 800 },
  { text: 'Loading your data...', duration: 900 },
  { text: 'Welcome back!', duration: 600 },
];

export function LoginTransition({
  isVisible,
  onComplete,
}: LoginTransitionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      // Reset state when not visible
      setCurrentStep(0);
      setIsComplete(false);
      return;
    }

    let stepIndex = 0;
    let timeoutId: NodeJS.Timeout;
    
    const updateStep = () => {
      if (stepIndex < transitionSteps.length) {
        setCurrentStep(stepIndex);
        
        timeoutId = setTimeout(() => {
          stepIndex++;
          if (stepIndex < transitionSteps.length) {
            updateStep();
          } else {
            setIsComplete(true);
            setTimeout(() => {
              onComplete?.();
            }, 800); // Reduced delay for smoother transition
          }
        }, transitionSteps[stepIndex]?.duration || 500);
      }
    };

    updateStep();

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isVisible, onComplete]);

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ 
            duration: 0.4, 
            ease: "easeOut",
            opacity: { duration: 0.3 },
            scale: { duration: 0.4 }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
          {/* Simple background gradient instead of PixelBlast */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-900/20 to-green-600/10" />
          
          {/* Light overlay with subtle blur for better text readability */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

          <div className="relative z-10 text-center max-w-md mx-auto px-6">
            {!isComplete ? (
              <>
                {/* Current step animation */}
                <div className="mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {transitionSteps[currentStep]?.text}
                  </h2>
                </div>

                {/* Progress indicator */}
                <div className="flex justify-center space-x-2 mb-8">
                  {transitionSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index <= currentStep ? 'bg-green-500' : 'bg-neutral-600'
                      }`}
                    />
                  ))}
                </div>
              </>
            ) : (
              /* Success state */
              <div className="text-center">
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-full inline-block">
                    <CheckCircle2Icon className="w-16 h-16 text-white" />
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-white mb-2">
                  Success!
                </h1>

                <div className="flex items-center justify-center space-x-2 text-green-400">
                  <span>Redirecting to dashboard</span>
                  <div className="animate-pulse">
                    <ArrowRightIcon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
