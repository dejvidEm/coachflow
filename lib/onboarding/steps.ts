/**
 * Onboarding tour steps configuration
 * 
 * @module lib/onboarding/steps
 */

import { OnboardingStep } from './types';

/**
 * All onboarding steps in order (English fallback)
 * Note: Use useOnboardingSteps() hook for translated steps
 */
export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to CoachFlow! 🎉',
    description: 'Let\'s take a quick tour to help you get started. We\'ll show you the key features in just a few steps.',
    position: 'center',
    skipable: true,
  },
  {
    id: 'dashboard-overview',
    title: 'Your Dashboard',
    description: 'This is your main dashboard where you can see an overview of your clients and quick stats. Navigate to different sections using the sidebar.',
    target: '[data-onboarding="dashboard"]',
    position: 'bottom',
    skipable: true,
  },
  {
    id: 'create-client',
    title: 'Manage Your Clients',
    description: 'Click here to add your first client. You can add their information, fitness goals, and track their progress.',
    target: '[data-onboarding="clients-section"]',
    position: 'right',
    action: {
      label: 'Go to Clients',
      onClick: () => {
        window.location.href = '/dashboard/clients';
      },
    },
    skipable: true,
  },
  {
    id: 'create-meal',
    title: 'Create Meal Plans',
    description: 'Build your meal database and create custom meal plans for your clients. Each meal includes macros and nutritional information.',
    target: '[data-onboarding="meals-section"]',
    position: 'right',
    action: {
      label: 'Go to Meals',
      onClick: () => {
        window.location.href = '/dashboard/meals';
      },
    },
    skipable: true,
  },
  {
    id: 'create-exercise',
    title: 'Build Exercise Library',
    description: 'Add exercises to your library with instructions, muscle groups, and images. Use them to create training plans.',
    target: '[data-onboarding="exercises-section"]',
    position: 'right',
    action: {
      label: 'Go to Exercises',
      onClick: () => {
        window.location.href = '/dashboard/exercises';
      },
    },
    skipable: true,
  },
  {
    id: 'generate-pdf',
    title: 'Generate Professional PDFs',
    description: 'Create beautiful, branded PDFs for meal plans and training programs. Send them directly to your clients via email.',
    target: '[data-onboarding="pdf-feature"]',
    position: 'top',
    skipable: true,
  },
  {
    id: 'team-settings',
    title: 'Team & Settings',
    description: 'Invite team members, manage your subscription, and customize your settings. Everything is organized here.',
    target: '[data-onboarding="settings-section"]',
    position: 'left',
    skipable: true,
  },
  {
    id: 'complete',
    title: 'You\'re All Set! 🚀',
    description: 'You\'ve completed the tour! Start by adding your first client and creating a meal plan. Need help? Check our documentation or contact support.',
    position: 'center',
    skipable: false,
  },
];

/**
 * Get step by ID
 */
export function getStepById(stepId: string): OnboardingStep | undefined {
  return ONBOARDING_STEPS.find(step => step.id === stepId);
}

/**
 * Get step index
 */
export function getStepIndex(stepId: string): number {
  return ONBOARDING_STEPS.findIndex(step => step.id === stepId);
}

/**
 * Get next step
 */
export function getNextStep(currentStepId: string): OnboardingStep | null {
  const currentIndex = getStepIndex(currentStepId);
  if (currentIndex === -1 || currentIndex === ONBOARDING_STEPS.length - 1) {
    return null;
  }
  return ONBOARDING_STEPS[currentIndex + 1];
}

/**
 * Get previous step
 */
export function getPreviousStep(currentStepId: string): OnboardingStep | null {
  const currentIndex = getStepIndex(currentStepId);
  if (currentIndex <= 0) {
    return null;
  }
  return ONBOARDING_STEPS[currentIndex - 1];
}

