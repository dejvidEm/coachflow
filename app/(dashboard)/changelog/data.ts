/**
 * Changelog entries data
 * 
 * This file contains all changelog entries. Add new entries here following
 * the ChangelogEntry interface structure.
 * 
 * @module changelog/data
 */

import { ChangelogEntry } from './types';

/**
 * All changelog entries, ordered from newest to oldest
 * 
 * @remarks
 * Entries should follow semantic versioning (semver.org)
 * Format: MAJOR.MINOR.PATCH (e.g., 2.1.0)
 */
export const CHANGELOG_ENTRIES: readonly ChangelogEntry[] = [
  {
    version: '2.2.0',
    date: 'December 12, 2025',
    type: 'feature',
    title: 'Comprehensive Onboarding System & Email Integration',
    description: 'Major release introducing a complete onboarding experience, email functionality for PDF delivery, and significant UI/UX enhancements across the platform.',
    items: [
      'Implemented comprehensive onboarding system with welcome modal, interactive tour, and contextual tooltips',
      'Added 8-step guided tour covering dashboard, client management, meal planning, exercises, PDF generation, and settings',
      'Integrated Resend API for email delivery of meal plans and training plans directly to clients',
      'Created email API routes with PDF attachment support and professional HTML email templates',
      'Added session-based preloader that displays once per browser session for improved landing page experience',
      'Enhanced client cards with fixed height layout, gender-specific profile icons (male/female/other), and content truncation',
      'Implemented Slovak language translations for entire onboarding system (welcome modal, tooltips, tour steps)',
      'Added restart tour functionality accessible from dashboard header with sparkle icon',
      'Improved onboarding tooltip positioning with automatic viewport detection and smooth scrolling',
      'Fixed hydration errors by ensuring consistent server/client rendering for onboarding components',
      'Enhanced preloader animation with WordRotate component and refined timing for color transitions',
      'Added progress tracking and persistence for onboarding state using localStorage',
      'Improved client detail view with streamlined navigation and better PDF management',
    ] as const,
    highlights: ['Onboarding System', 'Email Integration', 'UI Enhancements', 'i18n Support'] as const,
  },
] as const;
