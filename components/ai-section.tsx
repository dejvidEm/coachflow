'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import Image from 'next/image';

export function AISection() {
  const { t } = useLanguage();

  return (
    <section
      id="ai-assistant"
      className="relative py-16 sm:py-24 lg:py-32 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left side - Image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
            <Image
              src="/brand/Mockup 4.png"
              alt="CoachFlow Mockup"
              width={600}
              height={800}
              className="w-full max-w-md h-auto rounded-2xl"
              priority
            />
          </div>

          {/* Right side - Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-neutral-900 tracking-tight mb-4 sm:mb-6">
             Transformujte svoj coachingový biznis.
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed mb-6 sm:mb-8">
            Spravujte všetkých klientov na jednom mieste, vytvárajte tréningové a jedálničkové plány a exportujte prehľadné, profesionálne PDF — všetko v jednom plynulom pracovnom procese.
            </p>
            
            {/* CTA Button from Hero */}
            <div className="flex justify-start">
              <Button 
                asChild
                className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-full py-5 sm:py-6 text-sm sm:text-base font-medium shadow-lg shadow-neutral-900/20 hover:shadow-xl hover:shadow-neutral-900/25 transition-all hover:scale-105"
              >
                <a href="#newsletter">
                  <span className="ml-4">{t.hero.ctaPrimary}</span>
                  <ArrowRight className="w-4 h-4 ml-1 mr-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

