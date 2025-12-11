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
    version: '2.1.0',
    date: 'January 15, 2024',
    type: 'feature',
    title: 'Enhanced PDF Generation',
    description: 'Major improvements to PDF generation with better templates, custom branding, and enhanced layouts.',
    items: [
      'Improved PDF templates with better formatting and typography',
      'Added support for custom branding and logos',
      'Enhanced meal plan PDF generation with better nutrition display',
      'Better training plan layouts with exercise illustrations',
      'New PDF preview functionality before download',
    ] as const,
    highlights: ['Custom Branding', 'Better Templates', 'Preview Mode'] as const,
  },
  {
    version: '2.0.5',
    date: 'January 10, 2024',
    type: 'improvement',
    title: 'Performance Optimizations',
    description: 'Significant performance improvements across the platform for faster load times and smoother interactions.',
    items: [
      'Reduced page load times by 40% through code splitting',
      'Improved database query performance with optimized indexes',
      'Optimized image loading with lazy loading and WebP support',
      'Enhanced caching strategies for better responsiveness',
      'Reduced bundle size by 25%',
    ] as const,
    highlights: ['40% Faster', 'Better Caching', 'Optimized Queries'] as const,
  },
  {
    version: '2.0.4',
    date: 'January 5, 2024',
    type: 'security',
    title: 'Security Enhancements',
    description: 'Important security updates to protect user data and improve authentication.',
    items: [
      'Fixed PDF URL security vulnerabilities with proxy routes',
      'Improved authentication flow with better session management',
      'Enhanced data protection measures and encryption',
      'Added rate limiting to prevent abuse',
      'Improved input validation and sanitization',
    ] as const,
    highlights: ['PDF Security', 'Better Auth', 'Rate Limiting'] as const,
  },
  {
    version: '2.0.3',
    date: 'December 28, 2023',
    type: 'bugfix',
    title: 'Bug Fixes & Stability',
    description: 'Various bug fixes and stability improvements.',
    items: [
      'Fixed issue with client data not saving correctly',
      'Resolved PDF generation errors for large meal plans',
      'Fixed navigation issues on mobile devices',
      'Corrected date formatting in training plans',
      'Fixed issue with exercise images not displaying',
    ] as const,
    highlights: ['Data Saving', 'PDF Fixes', 'Mobile Fixes'] as const,
  },
  {
    version: '2.0.2',
    date: 'December 20, 2023',
    type: 'feature',
    title: 'New Client Management Features',
    description: 'Enhanced client management with new tools and improved workflows.',
    items: [
      'Added bulk client import functionality',
      'New client search and filtering options',
      'Enhanced client profile pages with more details',
      'Added client notes and communication history',
      'Improved client assignment workflow',
    ] as const,
    highlights: ['Bulk Import', 'Better Search', 'Notes System'] as const,
  },
  {
    version: '2.0.1',
    date: 'December 15, 2023',
    type: 'improvement',
    title: 'UI/UX Improvements',
    description: 'Various interface improvements for better user experience.',
    items: [
      'Redesigned dashboard with better data visualization',
      'Improved form layouts and validation feedback',
      'Enhanced mobile responsiveness across all pages',
      'Better error messages and user feedback',
      'Improved accessibility with better keyboard navigation',
    ] as const,
    highlights: ['Better UX', 'Mobile First', 'Accessibility'] as const,
  },
] as const;
