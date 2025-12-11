/**
 * Changelog entry component
 * 
 * @module changelog/components/changelog-entry
 */

import { CheckCircle2, Calendar, Tag } from 'lucide-react';
import { ChangelogEntry, ChangelogTypeConfig } from '../types';

interface ChangelogEntryProps {
  entry: ChangelogEntry;
  config: ChangelogTypeConfig;
  isLast: boolean;
}

/**
 * Renders a single changelog entry card
 * 
 * @param props - Component props
 * @returns Changelog entry card component
 */
export function ChangelogEntryCard({ entry, config, isLast }: ChangelogEntryProps) {
  const Icon = config.icon;

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Version Badge */}
      <div className={`absolute top-0 right-0 ${config.badgeColor} text-white px-4 py-1.5 rounded-bl-lg`}>
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <Tag className="h-3 w-3" />
          v{entry.version}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bgColor} ${config.color}`}>
                <Icon className="h-4 w-4" />
                <span className="text-sm font-semibold">{config.label}</span>
              </div>
              <time className="text-sm text-gray-500 flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {entry.date}
              </time>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {entry.title}
            </h2>
            {entry.description && (
              <p className="text-gray-600 leading-relaxed mb-4">
                {entry.description}
              </p>
            )}
          </div>
        </div>

        {/* Highlights */}
        {entry.highlights && entry.highlights.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {entry.highlights.map((highlight, idx) => (
              <span
                key={`${entry.version}-highlight-${idx}`}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
              >
                {highlight}
              </span>
            ))}
          </div>
        )}

        {/* Items List */}
        <div className="space-y-3">
          {entry.items.map((item, itemIndex) => (
            <div key={`${entry.version}-item-${itemIndex}`} className="flex items-start gap-3">
              <div className={`mt-1.5 flex-shrink-0 ${config.color}`}>
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-gray-700 leading-relaxed flex-1">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline connector (except for last item) */}
      {!isLast && (
        <div className="absolute left-8 bottom-0 w-0.5 h-8 bg-gray-200" />
      )}
    </div>
  );
}
