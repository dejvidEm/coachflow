/**
 * Welcome modal for new users
 * 
 * @module components/onboarding/welcome-modal
 */

'use client';

import { useState } from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/lib/onboarding/context';
import { useLanguage } from '@/lib/language-context';

interface WelcomeModalProps {
  userName?: string;
  onClose?: () => void;
}

export function WelcomeModal({ userName, onClose }: WelcomeModalProps) {
  const { t } = useLanguage();
  const { startTour, skipTour } = useOnboarding();
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  const handleStartTour = () => {
    setIsOpen(false);
    startTour();
    onClose?.();
  };

  const handleSkip = () => {
    setIsOpen(false);
    skipTour();
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-[90%] mx-4 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-[#44B080] to-[#3a9a6d] p-8 text-center relative">
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {t.onboarding.welcome.title}{userName ? `, ${userName}` : ''}! 🎉
          </h2>
          <p className="text-white/90 text-sm">
            {t.onboarding.welcome.subtitle}
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#44B080]/10 flex items-center justify-center">
                <span className="text-[#44B080] font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{t.onboarding.welcome.step1Title}</h3>
                <p className="text-sm text-gray-600">
                  {t.onboarding.welcome.step1Description}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#44B080]/10 flex items-center justify-center">
                <span className="text-[#44B080] font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{t.onboarding.welcome.step2Title}</h3>
                <p className="text-sm text-gray-600">
                  {t.onboarding.welcome.step2Description}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#44B080]/10 flex items-center justify-center">
                <span className="text-[#44B080] font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{t.onboarding.welcome.step3Title}</h3>
                <p className="text-sm text-gray-600">
                  {t.onboarding.welcome.step3Description}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleStartTour}
              className="w-full"
              style={{ backgroundColor: '#44B080' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a9a6d'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#44B080'}
            >
              {t.onboarding.welcome.startTour}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="w-full text-gray-600"
            >
              {t.onboarding.welcome.skipTour}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

