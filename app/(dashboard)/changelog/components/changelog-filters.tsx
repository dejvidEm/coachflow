/**
 * Changelog filter buttons component
 * 
 * @module changelog/components/changelog-filters
 */

import { ChangelogFilter, ChangelogTypeConfig } from '../types';
import { CHANGELOG_TYPE_CONFIG } from '../config';

interface ChangelogFiltersProps {
  selectedFilter: ChangelogFilter;
  onFilterChange: (filter: ChangelogFilter) => void;
}

/**
 * Renders filter buttons for changelog entries
 * 
 * @param props - Component props
 * @returns Filter buttons component
 */
export function ChangelogFilters({ selectedFilter, onFilterChange }: ChangelogFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => onFilterChange('all')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          selectedFilter === 'all'
            ? 'bg-[#44B080] text-white shadow-md'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
        }`}
        aria-pressed={selectedFilter === 'all'}
      >
        All Updates
      </button>
      {Object.entries(CHANGELOG_TYPE_CONFIG).map(([type, config]) => {
        const Icon = config.icon;
        const isSelected = selectedFilter === type;
        
        return (
          <button
            key={type}
            onClick={() => onFilterChange(type as ChangelogFilter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              isSelected
                ? `${config.bgColor} ${config.color} border-2 ${config.borderColor}`
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
            aria-pressed={isSelected}
          >
            <Icon className="h-4 w-4" />
            {config.label}
          </button>
        );
      })}
    </div>
  );
}
