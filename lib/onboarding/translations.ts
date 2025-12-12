/**
 * Onboarding translations helper
 * 
 * @module lib/onboarding/translations
 */

import { OnboardingStep } from './types';
import { useLanguage } from '@/lib/language-context';

/**
 * Get translated onboarding steps
 */
export function useOnboardingSteps(): OnboardingStep[] {
  const { t } = useLanguage();

  return [
    {
      id: 'welcome',
      title: t.onboarding.steps.welcome.title,
      description: t.onboarding.steps.welcome.description,
      position: 'center',
      skipable: true,
    },
    {
      id: 'dashboard-overview',
      title: t.onboarding.steps.dashboardOverview.title,
      description: t.onboarding.steps.dashboardOverview.description,
      target: '[data-onboarding="dashboard"]',
      position: 'bottom',
      skipable: true,
    },
    {
      id: 'create-client',
      title: t.onboarding.steps.createClient.title,
      description: t.onboarding.steps.createClient.description,
      target: '[data-onboarding="clients-section"]',
      position: 'right',
      action: {
        label: t.onboarding.steps.createClient.actionLabel,
        onClick: () => {
          window.location.href = '/dashboard/clients';
        },
      },
      skipable: true,
    },
    {
      id: 'create-meal',
      title: t.onboarding.steps.createMeal.title,
      description: t.onboarding.steps.createMeal.description,
      target: '[data-onboarding="meals-section"]',
      position: 'right',
      action: {
        label: t.onboarding.steps.createMeal.actionLabel,
        onClick: () => {
          window.location.href = '/dashboard/meals';
        },
      },
      skipable: true,
    },
    {
      id: 'create-exercise',
      title: t.onboarding.steps.createExercise.title,
      description: t.onboarding.steps.createExercise.description,
      target: '[data-onboarding="exercises-section"]',
      position: 'right',
      action: {
        label: t.onboarding.steps.createExercise.actionLabel,
        onClick: () => {
          window.location.href = '/dashboard/exercises';
        },
      },
      skipable: true,
    },
    {
      id: 'generate-pdf',
      title: t.onboarding.steps.generatePdf.title,
      description: t.onboarding.steps.generatePdf.description,
      target: '[data-onboarding="pdf-feature"]',
      position: 'top',
      skipable: true,
    },
    {
      id: 'team-settings',
      title: t.onboarding.steps.teamSettings.title,
      description: t.onboarding.steps.teamSettings.description,
      target: '[data-onboarding="settings-section"]',
      position: 'left',
      skipable: true,
    },
    {
      id: 'complete',
      title: t.onboarding.steps.complete.title,
      description: t.onboarding.steps.complete.description,
      position: 'center',
      skipable: false,
    },
  ];
}

