/**
 * Utility functions for changelog feature
 * 
 * @module changelog/utils
 */

import { ChangelogEntry, ChangelogFilter } from './types';

/**
 * Filters changelog entries by type
 * 
 * @param entries - Array of changelog entries to filter
 * @param filter - Filter type to apply ('all' returns all entries)
 * @returns Filtered array of changelog entries
 * 
 * @example
 * ```ts
 * const features = filterChangelogEntries(entries, 'feature');
 * const all = filterChangelogEntries(entries, 'all');
 * ```
 */
export function filterChangelogEntries(
  entries: readonly ChangelogEntry[],
  filter: ChangelogFilter
): readonly ChangelogEntry[] {
  if (filter === 'all') {
    return entries;
  }
  
  return entries.filter((entry) => entry.type === filter);
}

/**
 * Gets the total count of changelog entries
 * 
 * @param entries - Array of changelog entries
 * @returns Total count
 */
export function getChangelogEntryCount(entries: readonly ChangelogEntry[]): number {
  return entries.length;
}

/**
 * Gets the count of entries for a specific type
 * 
 * @param entries - Array of changelog entries
 * @param type - Entry type to count
 * @returns Count of entries for the specified type
 */
export function getChangelogEntryCountByType(
  entries: readonly ChangelogEntry[],
  type: ChangelogFilter
): number {
  return filterChangelogEntries(entries, type).length;
}
