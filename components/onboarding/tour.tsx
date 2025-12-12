/**
 * Onboarding tour component
 * 
 * @module components/onboarding/tour
 */

'use client';

import { useEffect } from 'react';
import { useOnboarding } from '@/lib/onboarding/context';
import { OnboardingTooltip } from './tooltip';
import { useOnboardingSteps } from '@/lib/onboarding/translations';

export function OnboardingTour() {
  const {
    progress,
    getCurrentStep,
    nextStep,
    previousStep,
    skipStep,
    skipTour,
    completeStep,
  } = useOnboarding();

  const onboardingSteps = useOnboardingSteps();
  const currentStep = getCurrentStep();

  useEffect(() => {
    if (currentStep?.target) {
      // Scroll target into view
      const element = document.querySelector(currentStep.target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStep]);

  if (!currentStep || progress.isCompleted) {
    return null;
  }

  const currentIndex = onboardingSteps.findIndex(step => step.id === progress.currentStep);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === onboardingSteps.length - 1;

  const handleNext = () => {
    if (isLast) {
      completeStep(currentStep.id);
      skipTour();
    } else {
      nextStep();
    }
  };

  const handlePrevious = () => {
    previousStep();
  };

  const handleClose = () => {
    skipTour();
  };

  return (
    <OnboardingTooltip
      step={currentStep}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onClose={handleClose}
      isFirst={isFirst}
      isLast={isLast}
    />
  );
}

