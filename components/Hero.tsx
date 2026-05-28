"use client"

import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import Image from "next/image"
import { useEffect, useRef, useState, type FormEvent } from "react"

export function HeroSection() {
  const { t } = useLanguage()
  const mockupRef = useRef<HTMLDivElement>(null)
  const [bubble1Visible, setBubble1Visible] = useState(false)
  const [bubble2Visible, setBubble2Visible] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const [email, setEmail] = useState("")
  const [website, setWebsite] = useState("")
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false)
  const [waitlistLoading, setWaitlistLoading] = useState(false)
  const [waitlistError, setWaitlistError] = useState("")

  const handleWaitlistSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || waitlistLoading) return

    setWaitlistLoading(true)
    setWaitlistError("")

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company: website }),
      })

      if (!res.ok) {
        throw new Error("Request failed")
      }

      setWaitlistSubmitted(true)
      setEmail("")
    } catch {
      setWaitlistError(t.hero.waitlistError)
    } finally {
      setWaitlistLoading(false)
    }
  }

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

          {/* Waitlist input */}
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 px-2 sm:px-0">
            {waitlistSubmitted ? (
              <div className="mx-auto max-w-xl flex items-center justify-center gap-2 rounded-full bg-emerald-500/15 text-emerald-700 px-6 py-4 text-sm sm:text-base font-medium">
                {t.hero.waitlistSuccess}
              </div>
            ) : (
              <>
                <div className="mx-auto max-w-xl rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 p-[2px] shadow-lg shadow-emerald-500/20">
                  <form
                    onSubmit={handleWaitlistSubmit}
                    className="flex items-center gap-2 rounded-full bg-white p-2"
                  >
                    {/* Honeypot field for spam bots - hidden from real users */}
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="hidden"
                      aria-hidden="true"
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.hero.waitlistPlaceholder}
                      className="flex-1 min-w-0 bg-transparent border-0 outline-none px-4 sm:px-6 py-2 text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 focus:ring-0"
                    />
                    <button
                      type="submit"
                      disabled={waitlistLoading}
                      className="group flex-shrink-0 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-wide shadow-sm cursor-pointer hover:from-emerald-600 hover:to-teal-600 transition-all hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <span>{waitlistLoading ? t.hero.waitlistSending : t.hero.waitlistButton}</span>
                      {!waitlistLoading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />}
                    </button>
                  </form>
                </div>
                {waitlistError && (
                  <p className="mt-3 text-sm text-red-500">{waitlistError}</p>
                )}
              </>
            )}
          </div>

          {/* Hero Mockup */}
          <div 
            ref={mockupRef}
            className="relative animate-in fade-in slide-in-from-bottom-6 duration-700 delay-700 max-w-7xl mx-auto mt-32 sm:mt-28 lg:mt-32 flex justify-center items-center translate-x-4 sm:translate-x-6"
          >
            <Image
              src="/brand/mockup_hero.png"
              alt="CoachFlow Dashboard Mockup"
              width={1200}
              height={800}
              className="w-full h-auto relative z-10 scale-150 sm:scale-100"
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
