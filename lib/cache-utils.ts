import { mutate } from 'swr';

/**
 * Clear all SWR cache entries
 */
export function clearAllCache() {
  // Clear all cache using the global clear function
  mutate(() => true, undefined, { revalidate: false });
}

/**
 * Clear specific cache keys
 */
export function clearCacheKeys(keys: string[]) {
  keys.forEach(key => {
    mutate(key, undefined, { revalidate: false });
  });
}

/**
 * Clear all user-specific cache (meals, exercises, clients, etc.)
 */
export function clearUserDataCache() {
  const userDataKeys = [
    '/api/meals',
    '/api/exercises',
    '/api/clients',
    '/api/dashboard/stats',
    '/api/team',
  ];
  clearCacheKeys(userDataKeys);
}

