/**
 * Button to restart onboarding tour
 * 
 * @module components/onboarding/restart-tour-button
 */

'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/lib/onboarding/context';
import { useLanguage } from '@/lib/language-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function RestartTourButton() {
  const { t } = useLanguage();
  const { resetOnboarding, startTour, progress } = useOnboarding();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRestart = () => {
    resetOnboarding();
    setTimeout(() => {
      startTour();
    }, 100);
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  // Don't show if onboarding is in progress
  if (progress.currentStep) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900"
          title="Help & Onboarding"
        >
          <Sparkles className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleRestart} className="cursor-pointer">
          <Sparkles className="h-4 w-4 mr-2" />
          {t.onboarding.restart.restartTour}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href="/changelog"
            className="flex items-center cursor-pointer"
          >
            <span className="mr-2">📋</span>
            {t.onboarding.restart.viewChangelog}
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

