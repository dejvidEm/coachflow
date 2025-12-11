/**
 * Changelog page header component
 * 
 * @module changelog/components/changelog-header
 */

import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';

interface ChangelogHeaderProps {
  totalEntries: number;
}

/**
 * Renders the changelog page header
 * 
 * @param props - Component props
 * @returns Header component
 */
export function ChangelogHeader({ totalEntries }: ChangelogHeaderProps) {
  return (
    <div className="mb-12">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
            Changelog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Stay up to date with the latest features, improvements, and updates to CoachFlow
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">
            {totalEntries} Update{totalEntries !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
