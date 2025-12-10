'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/Hero';
import { HowItWorksSection } from '@/components/how-it-works-section';
import { PricingSection } from '@/components/pricing-section';
import { FeaturesSection } from '@/components/features-section';
import { TestimonialsSection } from '@/components/testimonials-section';
import { CTASection } from '@/components/cta-section';
import { Footer } from '@/components/footer';
import { Preloader } from '@/components/preloader';

export default function HomePage() {
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true);
  const [isSliding, setIsSliding] = useState(false);

  const handlePreloaderComplete = () => {
    setIsPreloaderVisible(false);
  };

  const handlePreloaderSliding = () => {
    setIsSliding(true);
  };

  return (
    <>
      <main className="relative">
        <div id="home">
          <HeroSection />
        </div>
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection/>
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
