'use client';

import { useState, useEffect } from 'react';
import { WordRotate } from '@/components/flipper';

interface PreloaderProps {
  onComplete: () => void;
  onSliding?: () => void;
}

export function Preloader({ onComplete, onSliding }: PreloaderProps) {
  const [isFinalStage, setIsFinalStage] = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  const texts = ['Ready?', 'Preparing..', 'Coach!'];
  const duration = 1500; // Duration for each word

  useEffect(() => {
    // Calculate when "Coach" appears (index 2)
    // "Ready?" at 0s, "Preparing.." at 1.5s, "Coach" at 3s
    const coachAppearsAt = duration * 2; // 3000ms (3 seconds)
    
    // Wait a bit after "Coach" appears to show it in black/white first
    const showCoachInBlackWhite = 800; // Show "Coach" in black/white for 0.8s

    // Color change: after "Coach" has been shown in black/white, change to green background and white text
    const timer1 = setTimeout(() => {
      setIsFinalStage(true);
    }, coachAppearsAt + showCoachInBlackWhite);

    // Slide up and reveal (1 second after color change)
    const timer2 = setTimeout(() => {
      setIsSliding(true);
      onSliding?.();
    }, coachAppearsAt + showCoachInBlackWhite + 1300);

    // Complete and remove preloader (1.5 seconds after slide starts)
    const timer3 = setTimeout(() => {
      onComplete();
    }, coachAppearsAt + showCoachInBlackWhite + 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete, onSliding, duration]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: isFinalStage ? '#44B080' : '#FFFFFF',
        transform: isSliding ? 'translateY(-100%)' : 'translateY(0%)',
        transition: 'transform .8s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 0.5s ease-in-out',
        willChange: 'transform',
      }}
    >
      <div
        className="text-center"
        style={{
          color: isFinalStage ? '#FFFFFF' : '#000000',
          transition: 'color 0.5s ease-in-out',
        }}
      >
        <WordRotate
          words={texts}
          duration={duration}
          className="text-md md:text-2xl font-bold"
          motionProps={{
            initial: { opacity: 0, y: -50 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 50 },
            transition: { duration: 0.2, ease: 'easeOut' },
          }}
        />
      </div>
    </div>
  );
}

