/**
 * Onboarding context provider
 * 
 * @module lib/onboarding/context
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { OnboardingStepId, OnboardingProgress, OnboardingContextValue, OnboardingStep } from './types';
import { ONBOARDING_STEPS, getStepById, getNextStep, getPreviousStep } from './steps';
import { useOnboardingSteps } from './translations';

const STORAGE_KEY = 'coachflow_onboarding_progress';

const defaultProgress: OnboardingProgress = {
  completedSteps: [],
  currentStep: null,
  isCompleted: false,
  startedAt: null,
  completedAt: null,
};

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

interface OnboardingProviderProps {
  children: React.ReactNode;
  initialProgress?: OnboardingProgress;
}

export function OnboardingProvider({ children, initialProgress }: OnboardingProviderProps) {
  const onboardingSteps = useOnboardingSteps();
  const [progress, setProgress] = useState<OnboardingProgress>(
    initialProgress || defaultProgress
  );

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProgress({
            ...parsed,
            startedAt: parsed.startedAt ? new Date(parsed.startedAt) : null,
            completedAt: parsed.completedAt ? new Date(parsed.completedAt) : null,
          });
        } catch (e) {
          console.error('Failed to parse onboarding progress:', e);
        }
      }
    }
  }, []);

  // Save to localStorage whenever progress changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress]);

  const startTour = useCallback(() => {
    setProgress({
      completedSteps: [],
      currentStep: 'welcome',
      isCompleted: false,
      startedAt: new Date(),
      completedAt: null,
    });
  }, []);

  const completeStep = useCallback((stepId: OnboardingStepId) => {
    setProgress(prev => {
      const newCompletedSteps = prev.completedSteps.includes(stepId)
        ? prev.completedSteps
        : [...prev.completedSteps, stepId];

      const currentIndex = onboardingSteps.findIndex(s => s.id === stepId);
      const nextStep = currentIndex < onboardingSteps.length - 1 ? onboardingSteps[currentIndex + 1] : null;
      const isCompleted = !nextStep || stepId === 'complete';

      return {
        ...prev,
        completedSteps: newCompletedSteps,
        currentStep: isCompleted ? null : nextStep?.id || null,
        isCompleted,
        completedAt: isCompleted ? new Date() : prev.completedAt,
      };
    });
  }, [onboardingSteps]);

  const skipStep = useCallback((stepId: OnboardingStepId) => {
    completeStep(stepId);
  }, [completeStep]);

  const skipTour = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      currentStep: null,
      isCompleted: true,
      completedAt: new Date(),
    }));
  }, []);

  const resetOnboarding = useCallback(() => {
    setProgress(defaultProgress);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const isStepCompleted = useCallback((stepId: OnboardingStepId) => {
    return progress.completedSteps.includes(stepId);
  }, [progress.completedSteps]);

  const getCurrentStep = useCallback((): OnboardingStep | null => {
    if (!progress.currentStep) return null;
    return onboardingSteps.find(s => s.id === progress.currentStep) || null;
  }, [progress.currentStep, onboardingSteps]);

  const nextStep = useCallback(() => {
    if (!progress.currentStep) return;
    const currentIndex = onboardingSteps.findIndex(s => s.id === progress.currentStep);
    const next = currentIndex < onboardingSteps.length - 1 ? onboardingSteps[currentIndex + 1] : null;
    if (next) {
      completeStep(progress.currentStep);
    }
  }, [progress.currentStep, completeStep, onboardingSteps]);

  const previousStep = useCallback(() => {
    if (!progress.currentStep) return;
    const currentIndex = onboardingSteps.findIndex(s => s.id === progress.currentStep);
    const previous = currentIndex > 0 ? onboardingSteps[currentIndex - 1] : null;
    if (previous) {
      setProgress(prev => ({
        ...prev,
        currentStep: previous.id,
      }));
    }
  }, [progress.currentStep, onboardingSteps]);

  const value: OnboardingContextValue = {
    progress,
    startTour,
    completeStep,
    skipStep,
    skipTour,
    resetOnboarding,
    isStepCompleted,
    getCurrentStep,
    nextStep,
    previousStep,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

