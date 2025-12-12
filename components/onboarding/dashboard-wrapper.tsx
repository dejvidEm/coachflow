/**
 * Dashboard wrapper with onboarding integration
 * 
 * @module components/onboarding/dashboard-wrapper
 */

'use client';

import { useEffect } from 'react';
import { useOnboarding } from '@/lib/onboarding/context';
import { WelcomeModal } from './welcome-modal';
import useSWR from 'swr';
import { User } from '@/lib/db/schema';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export function DashboardWrapper({ children }: DashboardWrapperProps) {
  const { progress, startTour } = useOnboarding();
  const { data: user } = useSWR<User>('/api/user', fetcher);

  // Show welcome modal for new users who haven't started onboarding
  useEffect(() => {
    // Check if user is new (no onboarding progress) and hasn't completed it
    const isNewUser = !progress.startedAt && !progress.isCompleted;
    
    // Auto-start tour for new users after a short delay (optional)
    // You can remove this if you want users to manually start the tour
    if (isNewUser && typeof window !== 'undefined') {
      // Don't auto-start, let them click the welcome modal button
    }
  }, [progress, startTour]);

  const shouldShowWelcome = !progress.startedAt && !progress.isCompleted;

  return (
    <>
      {children}
      {shouldShowWelcome && (
        <WelcomeModal userName={user?.name || undefined} />
      )}
    </>
  );
}

