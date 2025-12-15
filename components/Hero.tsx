"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Safari } from "@/components/ui/safari"
import { DashboardPreview } from "@/components/dashboard/dashboard-preview"

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-32">
      {/* Background gradient orbs */}
      <div className="absolute top-20 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-200/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-1/4 w-56 sm:w-80 h-56 sm:h-80 bg-sky-200/30 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white border border-neutral-200 shadow-sm mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-xs sm:text-sm text-neutral-600">{t.hero.badge}</span>
            <ArrowRight className="w-3 h-3 text-neutral-400" />
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-semibold text-neutral-900 tracking-tight leading-[1.1] mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 text-balance">
            {t.hero.headline}{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              {t.hero.headlineHighlight}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg lg:text-xl text-neutral-500 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 text-pretty px-4 sm:px-0">
            {t.hero.subheadline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 px-4 sm:px-0">
            <Button className="w-full sm:w-auto bg-neutral-900 text-white hover:bg-neutral-800 rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-medium shadow-lg shadow-neutral-900/20 hover:shadow-xl hover:shadow-neutral-900/25 transition-all hover:scale-105">
              {t.hero.ctaPrimary}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="ghost"
              className="w-full sm:w-auto text-neutral-600 hover:text-neutral-900 rounded-full px-6 py-5 sm:py-6 text-sm sm:text-base font-medium group"
            >
              <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center mr-2 group-hover:bg-neutral-200 transition-colors">
                <Play className="w-3 h-3 fill-neutral-600" />
              </div>
              {t.hero.ctaSecondary}
            </Button>
          </div>

          {/* Social proof */}
          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500">
            <div className="flex -space-x-3">
              {['05', '07', '10', '11', '13'].map((imgNum) => (
                <img
                  key={imgNum}
                  src={`/imgs/${imgNum}.png`}
                  alt={`Trainer ${imgNum}`}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-neutral-500">{t.hero.socialProof}</p>
            </div>
          </div>

          {/* Safari Browser Mockup */}
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-700 max-w-5xl mx-auto mt-16 sm:mt-20 lg:mt-24">
            <Safari 
              url="coachflow.app/dashboard"
              mode="default"
            >
              <DashboardPreview />
            </Safari>
          </div>
        </div>
      </div>
    </section>
  )
}
