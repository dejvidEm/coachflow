/**
 * Onboarding types and interfaces
 * 
 * @module lib/onboarding/types
 */

export type OnboardingStepId = 
  | 'welcome'
  | 'dashboard-overview'
  | 'create-client'
  | 'create-meal'
  | 'create-exercise'
  | 'generate-pdf'
  | 'team-settings'
  | 'complete';

export interface OnboardingStep {
  id: OnboardingStepId;
  title: string;
  description: string;
  target?: string; // CSS selector for element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: {
    label: string;
    onClick: () => void;
  };
  skipable?: boolean;
}

export interface OnboardingProgress {
  completedSteps: OnboardingStepId[];
  currentStep: OnboardingStepId | null;
  isCompleted: boolean;
  startedAt: Date | null;
  completedAt: Date | null;
}

export interface OnboardingContextValue {
  progress: OnboardingProgress;
  startTour: () => void;
  completeStep: (stepId: OnboardingStepId) => void;
  skipStep: (stepId: OnboardingStepId) => void;
  skipTour: () => void;
  resetOnboarding: () => void;
  isStepCompleted: (stepId: OnboardingStepId) => boolean;
  getCurrentStep: () => OnboardingStep | null;
  nextStep: () => void;
  previousStep: () => void;
}

