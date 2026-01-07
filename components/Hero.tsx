"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

export function HeroSection() {
  const { t } = useLanguage()
  const mockupRef = useRef<HTMLDivElement>(null)
  const [bubble1Visible, setBubble1Visible] = useState(false)
  const [bubble2Visible, setBubble2Visible] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)

  useEffect(() => {
    let initialScrollY = window.scrollY
    let hasScrolled = false

    const handleScroll = () => {
      // Only trigger after user has actually scrolled (not on initial load)
      if (Math.abs(window.scrollY - initialScrollY) > 50) {
        hasScrolled = true
      }

      if (!hasTriggered && hasScrolled && mockupRef.current) {
        const rect = mockupRef.current.getBoundingClientRect()
        // Trigger when mockup is scrolled past (top is above middle of viewport)
        if (rect.top < window.innerHeight * 0.6) {
          setHasTriggered(true)
          // Trigger first bubble after scrolling
          setTimeout(() => {
            setBubble1Visible(true)
          }, 300)
          // Trigger second bubble after another delay
          setTimeout(() => {
            setBubble2Visible(true)
          }, 800)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [hasTriggered])

  return (
    <section className="relative pt-8 pb-16 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-32">
      {/* Background gradient orbs */}
      <div className="absolute top-20 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-200/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-1/4 w-56 sm:w-80 h-56 sm:h-80 bg-sky-200/30 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Social proof */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 mb-4 sm:mb-6 sm:gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500">
            <div className="flex -space-x-3">
              {['05', '07', '10', '11', '13'].map((imgNum) => (
                <img
                  key={imgNum}
                  src={`/imgs/${imgNum}.png`}
                  alt={`Trainer ${imgNum}`}
                  className="w-7 h-7 sm:w-10 sm:h-10 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm text-neutral-500">{t.hero.socialProof}</p>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold text-neutral-900 tracking-tight leading-[1.1] mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 text-balance">
            {t.hero.headline}{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              {t.hero.headlineHighlight}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg lg:text-xl text-neutral-500 max-w-2xl mx-auto mb-8 sm:mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 text-pretty px-2 sm:px-0">
            {t.hero.subheadline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 px-2 sm:px-0">
            <Button className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-full py-5 sm:py-6 text-sm sm:text-base font-medium shadow-lg shadow-neutral-900/20 hover:shadow-xl hover:shadow-neutral-900/25 transition-all hover:scale-105">
              <span className="ml-4">{t.hero.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4 ml-1 mr-2" />
            </Button>
          </div>

          {/* Hero Mockup */}
          <div 
            ref={mockupRef}
            className="relative animate-in fade-in slide-in-from-bottom-6 duration-700 delay-700 max-w-7xl mx-auto mt-24 sm:mt-28 lg:mt-32 flex justify-center items-center translate-x-4 sm:translate-x-6"
          >
            <Image
              src="/brand/mockup_hero.png"
              alt="CoachFlow Dashboard Mockup"
              width={1200}
              height={800}
              className="w-full h-auto relative z-10 scale-125 sm:scale-100 lg:scale-100"
              priority
            />
            
            {/* Chat Bubble 1 - Left side */}
            <div
              className={`hidden md:block absolute left-2 -top-5 z-20 transition-all duration-700 ease-out ${
                bubble1Visible
                  ? 'opacity-100 translate-x-[-20px] sm:translate-x-[-40px] scale-100'
                  : 'opacity-0 translate-x-0 scale-75'
              }`}
              style={{
                transform: bubble1Visible 
                  ? 'translateX(-20px) scale(1)' 
                  : 'translateX(0) scale(0.75)',
                transition: 'opacity 0.5s ease-out, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <div className="bg-white rounded-2xl px-4 py-3 shadow-xl border border-gray-200 max-w-[200px] sm:max-w-[250px]">
                <p className="text-sm sm:text-base text-gray-800 font-medium">
                  Spravuj všetkých svojích klientov na jednom mieste
                </p>
                <div className="absolute bottom-[-8px] right-6 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-white"></div>
              </div>
            </div>

            {/* Chat Bubble 2 - Right side */}
            <div
              className={`hidden md:block absolute right-12 top-1/7 z-20 transition-all duration-700 ease-out ${
                bubble2Visible
                  ? 'opacity-100 translate-x-[20px] sm:translate-x-[40px] scale-100'
                  : 'opacity-0 translate-x-0 scale-75'
              }`}
              style={{
                transform: bubble2Visible 
                  ? 'translateX(20px) scale(1)' 
                  : 'translateX(0) scale(0.75)',
                transition: 'opacity 0.5s ease-out, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <div className="bg-white rounded-2xl px-4 py-3 shadow-xl border max-w-[200px] sm:max-w-[250px]">
                <p className="text-sm sm:text-base text-gray-800 font-medium">
                  Ulož všetky svoje jedlá a cviky a generuj PDF plány jedným klikom
                </p>
                <div className="absolute bottom-[-8px] left-6 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-white"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
