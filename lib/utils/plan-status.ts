/**
 * Utility functions for determining plan status based on update timestamps
 */

export type PlanStatus = 'none' | 'up-to-date' | 'expiring-soon' | 'outdated';

export interface PlanStatusInfo {
  status: PlanStatus;
  color: string;
  daysUntilExpiry?: number;
  daysSinceUpdate?: number;
}

/**
 * Determines the status of a plan based on its last update timestamp and PDF existence
 * 
 * @param updatedAt - The timestamp when the plan was last updated (null if never generated or before tracking was added)
 * @param pdfUrl - The URL of the PDF file (null if no PDF exists)
 * @param fallbackDate - Optional fallback date to use if updatedAt is null but PDF exists (e.g., client.updatedAt)
 * @returns PlanStatusInfo with status, color, and metadata
 */
export function getPlanStatus(
  updatedAt: Date | null, 
  pdfUrl?: string | null,
  fallbackDate?: Date | null
): PlanStatusInfo {
  // If no PDF exists, show as gray (no plan)
  // pdfUrl can be null, undefined, or the string 'exists' (from API)
  const hasPdf = pdfUrl && pdfUrl !== 'null' && pdfUrl !== '';
  if (!hasPdf) {
    return {
      status: 'none',
      color: '#9CA3AF', // gray-400
    };
  }

  // If PDF exists but no timestamp, use fallback date or treat as recently updated
  let dateToUse = updatedAt;
  if (!dateToUse && hasPdf) {
    // If we have a fallback date (like client.updatedAt), use it
    // Otherwise, treat it as if it was updated today (since we don't know the exact date)
    dateToUse = fallbackDate || new Date();
  }

  // If still no date, treat as recently updated
  if (!dateToUse) {
    return {
      status: 'up-to-date',
      color: '#10B981', // emerald-500
    };
  }

  const now = new Date();
  const updateDate = new Date(dateToUse);
  const daysSinceUpdate = Math.floor((now.getTime() - updateDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Plans are considered outdated after 30 days
  const EXPIRY_DAYS = 30;
  const WARNING_DAYS = 3; // Show yellow when 3 days before expiry
  
  const daysUntilExpiry = EXPIRY_DAYS - daysSinceUpdate;

  // Red/Orange: Outdated (more than 30 days old)
  if (daysSinceUpdate >= EXPIRY_DAYS) {
    return {
      status: 'outdated',
      color: '#EF4444', // red-500
      daysSinceUpdate,
    };
  }

  // Yellow: Expiring soon (within 3 days of expiry)
  if (daysUntilExpiry <= WARNING_DAYS) {
    return {
      status: 'expiring-soon',
      color: '#F59E0B', // amber-500
      daysUntilExpiry,
      daysSinceUpdate,
    };
  }

  // Green: Up to date
  return {
    status: 'up-to-date',
    color: '#10B981', // emerald-500
    daysUntilExpiry,
    daysSinceUpdate,
  };
}




