/**
 * Type definitions for the changelog feature
 * 
 * @module changelog/types
 */

import { LucideIcon } from 'lucide-react';

/**
 * Represents the type of changelog entry
 */
export type ChangelogEntryType = 'feature' | 'improvement' | 'bugfix' | 'security';

/**
 * Filter type for changelog entries
 */
export type ChangelogFilter = 'all' | ChangelogEntryType;

/**
 * Configuration for a changelog entry type
 */
export interface ChangelogTypeConfig {
  icon: LucideIcon;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeColor: string;
}

/**
 * Represents a single changelog entry
 */
export interface ChangelogEntry {
  /** Semantic version number (e.g., "2.1.0") */
  version: string;
  /** Human-readable date string */
  date: string;
  /** Type of changelog entry */
  type: ChangelogEntryType;
  /** Title of the update */
  title: string;
  /** Optional detailed description */
  description?: string;
  /** List of changes/items in this update */
  items: readonly string[];
  /** Optional highlight tags for quick scanning */
  highlights?: readonly string[];
}

/**
 * Props for changelog components
 */
export interface ChangelogPageProps {
  /** Optional initial filter */
  initialFilter?: ChangelogFilter;
}
