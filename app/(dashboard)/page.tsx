'use client';

import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/Hero';
import { HowItWorksSection } from '@/components/how-it-works-section';
import { PricingSection } from '@/components/pricing-section';
import { FeaturesSection } from '@/components/features-section';
import { AISection } from '@/components/ai-section';
import { TestimonialsSection } from '@/components/testimonials-section';
import { CTASection } from '@/components/cta-section';
import { NewsletterSection } from '@/components/newsletter-section';
import { Footer } from '@/components/footer';
import { Preloader } from '@/components/preloader';

const PRELOADER_SEEN_KEY = 'coachflow_preloader_seen';

export default function HomePage() {
  // Start with true to show preloader immediately (prevents flash of content)
  // Then check sessionStorage after component mounts (client-side only)
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true);
  const [isSliding, setIsSliding] = useState(false);
  const [shouldShowContent, setShouldShowContent] = useState(false);

  // Check sessionStorage after component mounts (client-side only)
  useEffect(() => {
    // Check if preloader has been seen in this session
    const hasSeenPreloader = sessionStorage.getItem(PRELOADER_SEEN_KEY);
    if (hasSeenPreloader) {
      setIsPreloaderVisible(false);
      setShouldShowContent(true);
    }
  }, []);

  // Disable horizontal scrolling on mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 768; // md breakpoint
    
    if (isMobile) {
      // Disable horizontal scrolling on body and html
      document.body.style.overflowX = 'hidden';
      document.documentElement.style.overflowX = 'hidden';
      
      return () => {
        // Re-enable scrolling on unmount
        document.body.style.overflowX = '';
        document.documentElement.style.overflowX = '';
      };
    }
  }, []);

  const handlePreloaderComplete = () => {
    setIsPreloaderVisible(false);
    // Mark preloader as seen for this session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(PRELOADER_SEEN_KEY, 'true');
    }
  };

  const handlePreloaderSliding = () => {
    setIsSliding(true);
    // Show content when preloader starts sliding
    setShouldShowContent(true);
  };

  return (
    <>
      <main 
        className="relative"
        style={{
          opacity: shouldShowContent ? 1 : 0,
          pointerEvents: shouldShowContent ? 'auto' : 'none',
          transition: 'opacity 0.5s ease-in-out',
        }}
      >
        <div id="home">
          <HeroSection />
        </div>
        <FeaturesSection />
        <AISection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection/>
        <NewsletterSection />
        <Footer />
      </main>
      {isPreloaderVisible && (
        <Preloader 
          onComplete={handlePreloaderComplete}
          onSliding={handlePreloaderSliding}
        />
      )}
    </>
  );
}
