/**
 * Configuration constants for changelog types
 * 
 * @module changelog/config
 */

import { Sparkles, Zap, Bug, Shield } from 'lucide-react';
import { ChangelogTypeConfig, ChangelogFilter } from './types';

/**
 * Configuration mapping for each changelog entry type
 * Defines visual styling, icons, and labels
 */
export const CHANGELOG_TYPE_CONFIG: Record<string, ChangelogTypeConfig> = {
  feature: {
    icon: Sparkles,
    label: 'New Feature',
    color: 'text-[#44B080]',
    bgColor: 'bg-[#44B080]/10',
    borderColor: 'border-[#44B080]',
    badgeColor: 'bg-[#44B080]',
  },
  improvement: {
    icon: Zap,
    label: 'Improvement',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    badgeColor: 'bg-blue-600',
  },
  bugfix: {
    icon: Bug,
    label: 'Bug Fix',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-500',
    badgeColor: 'bg-purple-600',
  },
  security: {
    icon: Shield,
    label: 'Security',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    badgeColor: 'bg-red-600',
  },
} as const;

/**
 * Default filter value
 */
export const DEFAULT_FILTER: ChangelogFilter = 'all';
