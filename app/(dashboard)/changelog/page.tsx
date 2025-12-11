/**
 * Changelog page
 * 
 * Displays a filtered list of changelog entries with filtering capabilities.
 * 
 * @module changelog/page
 */

'use client';

import { useState, useMemo } from 'react';
import { Footer } from '@/components/footer';
import { CHANGELOG_ENTRIES } from './data';
import { CHANGELOG_TYPE_CONFIG, DEFAULT_FILTER } from './config';
import { filterChangelogEntries, getChangelogEntryCount } from './utils';
import { ChangelogFilter } from './types';
import { ChangelogHeader } from './components/changelog-header';
import { ChangelogFilters } from './components/changelog-filters';
import { ChangelogEntryCard } from './components/changelog-entry';
import { ChangelogEmptyState } from './components/empty-state';

/**
 * Main changelog page component
 * 
 * @returns Changelog page component
 */
export default function ChangelogPage() {
  const [selectedFilter, setSelectedFilter] = useState<ChangelogFilter>(DEFAULT_FILTER);

  // Memoize filtered entries to avoid unnecessary recalculations
  const filteredEntries = useMemo(
    () => filterChangelogEntries(CHANGELOG_ENTRIES, selectedFilter),
    [selectedFilter]
  );

  const totalEntries = useMemo(
    () => getChangelogEntryCount(CHANGELOG_ENTRIES),
    []
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <ChangelogHeader totalEntries={totalEntries} />

        <div className="mb-12">
          <ChangelogFilters
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </div>

        {/* Changelog Entries */}
        <div className="space-y-8">
          {filteredEntries.map((entry, index) => {
            const config = CHANGELOG_TYPE_CONFIG[entry.type];
            const isLast = index === filteredEntries.length - 1;

            return (
              <ChangelogEntryCard
                key={`${entry.version}-${entry.date}`}
                entry={entry}
                config={config}
                isLast={isLast}
              />
            );
          })}
        </div>

        {/* Empty State */}
        {filteredEntries.length === 0 && <ChangelogEmptyState />}

        {/* Footer Note */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            Want to stay updated? Check back regularly or follow us for the latest news.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
