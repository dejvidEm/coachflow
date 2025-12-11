/**
 * Empty state component for changelog
 * 
 * @module changelog/components/empty-state
 */

import { Tag } from 'lucide-react';

/**
 * Renders empty state when no changelog entries match the filter
 * 
 * @returns Empty state component
 */
export function ChangelogEmptyState() {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <Tag className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No updates found
      </h3>
      <p className="text-gray-600">
        Try selecting a different filter to see more updates.
      </p>
    </div>
  );
}
