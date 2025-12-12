/**
 * Onboarding tooltip component
 * 
 * @module components/onboarding/tooltip
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OnboardingStep } from '@/lib/onboarding/types';
import { useOnboardingSteps } from '@/lib/onboarding/translations';
import { useLanguage } from '@/lib/language-context';

interface TooltipProps {
  step: OnboardingStep;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function OnboardingTooltip({
  step,
  onNext,
  onPrevious,
  onClose,
  isFirst,
  isLast,
}: TooltipProps) {
  const { t } = useLanguage();
  const onboardingSteps = useOnboardingSteps();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const targetElement = step.target ? document.querySelector(step.target) : null;

  useEffect(() => {
    if (!step.target || !targetElement) {
      // Center position for modal-style steps
      setPosition({
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
      });
      setIsVisible(true);
      return;
    }

    // Wait for element to be in viewport
    const checkAndUpdate = () => {
      const rect = targetElement.getBoundingClientRect();
      const isInViewport = rect.top >= 0 && rect.left >= 0 && 
                          rect.bottom <= window.innerHeight && 
                          rect.right <= window.innerWidth;

      if (!isInViewport) {
        // Scroll element into view first
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Wait a bit for scroll to complete
        setTimeout(() => {
          updatePosition();
        }, 500);
      } else {
        updatePosition();
      }
    };

    const updatePosition = () => {
      const rect = targetElement.getBoundingClientRect();
      const tooltipRect = tooltipRef.current?.getBoundingClientRect();
      const tooltipWidth = tooltipRect?.width || 320;
      const tooltipHeight = tooltipRect?.height || 200;

      let top = 0;
      let left = 0;

      switch (step.position) {
        case 'top':
          top = rect.top - tooltipHeight - 16;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case 'bottom':
          top = rect.bottom + 16;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.left - tooltipWidth - 16;
          break;
        case 'right':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.right + 16;
          break;
        default:
          top = rect.bottom + 16;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
      }

      // Keep tooltip within viewport
      const padding = 16;
      top = Math.max(padding, Math.min(top, window.innerHeight - tooltipHeight - padding));
      left = Math.max(padding, Math.min(left, window.innerWidth - tooltipWidth - padding));

      setPosition({ top, left });
      setIsVisible(true);
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(checkAndUpdate, 100);
    
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [step.target, step.position, targetElement]);

  if (!isVisible) return null;

  const isModal = step.position === 'center' || !step.target;

  return (
    <>
      {/* Backdrop overlay */}
      {!isModal && (
        <div
          className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm transition-opacity"
          style={{ opacity: isVisible ? 1 : 0 }}
        />
      )}

      {/* Highlight overlay for target element */}
      {targetElement && !isModal && (
        <div
          className="fixed z-[9997] rounded-lg pointer-events-none border-2 border-[#44B080] shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] transition-all"
          style={{
            top: targetElement.getBoundingClientRect().top - 4,
            left: targetElement.getBoundingClientRect().left - 4,
            width: targetElement.getBoundingClientRect().width + 8,
            height: targetElement.getBoundingClientRect().height + 8,
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={`fixed z-[9999] bg-white rounded-xl shadow-2xl border border-gray-200 ${
          isModal ? 'w-[90%] max-w-md' : 'w-80'
        } transition-all duration-300 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{
          top: isModal ? '50%' : `${position.top}px`,
          left: isModal ? '50%' : `${position.left}px`,
          transform: isModal ? 'translate(-50%, -50%)' : 'none',
        }}
      >
        {/* Arrow pointing to target */}
        {!isModal && targetElement && (
          <div
            className="absolute w-0 h-0 border-8 border-transparent"
            style={{
              [step.position === 'top' ? 'bottom' : step.position === 'bottom' ? 'top' : step.position === 'left' ? 'right' : 'left']: '-16px',
              [`border${step.position === 'top' ? 'Bottom' : step.position === 'bottom' ? 'Top' : step.position === 'left' ? 'Right' : 'Left'}Color`]: '#fff',
              [step.position === 'top' || step.position === 'bottom' ? 'left' : 'top']: '50%',
              transform: step.position === 'top' || step.position === 'bottom' ? 'translateX(-50%)' : 'translateY(-50%)',
            }}
          />
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
            </div>
            {step.skipable && (
              <button
                onClick={onClose}
                className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Progress indicator */}
          <div className="mb-4">
            <div className="flex items-center gap-1">
              {onboardingSteps.map((s, index) => {
                const currentIndex = onboardingSteps.findIndex(st => st.id === step.id);
                const isActive = index <= currentIndex;
                return (
                  <div
                    key={s.id}
                    className="h-1 flex-1 rounded-full bg-gray-200"
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: isActive ? '100%' : '0%',
                        backgroundColor: isActive ? '#44B080' : 'transparent',
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              {t.onboarding.tooltip.stepOf
                .replace('{current}', String(onboardingSteps.findIndex(s => s.id === step.id) + 1))
                .replace('{total}', String(onboardingSteps.length))}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {!isFirst && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPrevious}
                  className="text-sm"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {t.onboarding.tooltip.previous}
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={isLast ? onClose : onNext}
                className="text-sm"
                style={{ backgroundColor: '#44B080' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a9a6d'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#44B080'}
              >
                {isLast ? t.onboarding.tooltip.getStarted : t.onboarding.tooltip.next}
                {!isLast && <ChevronRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
