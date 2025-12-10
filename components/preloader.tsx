'use client';

import { useState, useEffect } from 'react';

interface PreloaderProps {
  onComplete: () => void;
  onSliding?: () => void;
}

export function Preloader({ onComplete, onSliding }: PreloaderProps) {
  const [currentText, setCurrentText] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isFinalStage, setIsFinalStage] = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  const texts = ['Ready?', 'Preparing..', 'Coach!'];
  const currentWord = texts[currentText];

  useEffect(() => {
    // First transition: Ready? -> Preparing.. (after 1.5s)
    const timer1 = setTimeout(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentText(1);
        setIsFlipping(false);
      }, 400); // Half of flip duration
    }, 1500);

    // Second transition: Preparing.. -> Coach! (after 3s total)
    const timer2 = setTimeout(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentText(2);
        setIsFlipping(false);
      }, 400);
    }, 3000);

    // Color change: black/white -> green/white (after Coach! appears, at 4.5s)
    const timer3 = setTimeout(() => {
      setIsFinalStage(true);
    }, 4500);

    // Slide up and reveal (at 5.5s)
    const timer4 = setTimeout(() => {
      setIsSliding(true);
      onSliding?.();
    }, 5500);

    // Complete and remove preloader (at 6.5s)
    const timer5 = setTimeout(() => {
      onComplete();
    }, 6500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete, onSliding]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: isFinalStage ? '#44B080' : '#FFFFFF',
        transform: isSliding ? 'translateY(-100%)' : 'translateY(0%)',
        transition: 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 0.5s ease-in-out',
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
        <h1
          className={`text-6xl md:text-8xl font-bold ${
            isFlipping 
              ? 'scale-y-0 opacity-0' 
              : 'scale-y-100 opacity-100'
          }`}
          style={{
            transformOrigin: 'center',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease-in-out',
          }}
        >
          {currentWord}
        </h1>
      </div>
    </div>
  );
}

