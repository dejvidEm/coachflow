/**
 * Dashboard wrapper with onboarding integration
 * 
 * @module components/onboarding/dashboard-wrapper
 */

'use client';

import { useEffect, useMemo } from 'react';
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

  // Check if user account is new (created within last 24 hours)
  const isNewAccount = useMemo(() => {
    if (!user?.createdAt) return false;
    const accountCreatedAt = new Date(user.createdAt);
    const now = new Date();
    const hoursSinceCreation = (now.getTime() - accountCreatedAt.getTime()) / (1000 * 60 * 60);
    return hoursSinceCreation < 24; // Account created within last 24 hours
  }, [user?.createdAt]);

  // Check if user has already seen the welcome modal (stored in localStorage)
  const hasSeenWelcome = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('hasSeenWelcomeModal') === 'true';
  }, []);

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

  // Only show welcome modal if:
  // 1. Account is new (created within 24 hours) AND
  // 2. User hasn't seen the welcome modal before AND
  // 3. Onboarding hasn't been started or completed
  const shouldShowWelcome = 
    isNewAccount && 
    !hasSeenWelcome && 
    !progress.startedAt && 
    !progress.isCompleted;

  // Mark welcome modal as seen when it's shown
  useEffect(() => {
    if (shouldShowWelcome && typeof window !== 'undefined') {
      // This will be set when the user closes the modal
    }
  }, [shouldShowWelcome]);

  return (
    <>
      {children}
      {shouldShowWelcome && (
        <WelcomeModal 
          userName={user?.name || undefined}
          onClose={() => {
            if (typeof window !== 'undefined') {
              localStorage.setItem('hasSeenWelcomeModal', 'true');
            }
          }}
        />
      )}
    </>
  );
}

