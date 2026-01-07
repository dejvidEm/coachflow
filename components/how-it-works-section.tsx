"use client"

import { useEffect, useRef, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import Image from "next/image"

export function HowItWorksSection() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(0)
  const autoCycleIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  const steps = [
    {
      number: "01",
      title: "Zaregistrujte sa a vytvorte si účet",
      description: "Začnite za minúty jednoduchým procesom registrácie. Pre bezplatnú skúšobnú verziu nie je potrebná kreditná karta.",
    },
    {
      number: "02",
      title: "Pridajte svojich klientov",
      description: "Importujte svoj existujúci zoznam klientov alebo ich pridajte manuálne. Organizujte všetkých svojich klientov na jednom mieste.",
    },
    {
      number: "03",
      title: "Vytvárajte jedálničkové a tréningové plány",
      description: "Vytvárajte vlastné plány pomocou našich intuitívnych nástrojov. Uložte si svoje jedlá a cviky pre rýchle opätovné použitie.",
    },
    {
      number: "04",
      title: "Generujte a zdieľajte PDF",
      description: "Exportujte krásne, značkové PDF jedným klikom. Zdieľajte profesionálne plány so svojimi klientmi okamžite.",
    },
  ]

  // Auto-cycle through steps
  useEffect(() => {
    if (isPaused) return

    autoCycleIntervalRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
    }, 3000) // Change step every 3 seconds

    return () => {
      if (autoCycleIntervalRef.current) {
        clearInterval(autoCycleIntervalRef.current)
      }
    }
  }, [isPaused, steps.length])

  const handleStepClick = (index: number) => {
    setActiveStep(index)
    setIsPaused(true)
    // Resume auto-cycling after 5 seconds of inactivity
    setTimeout(() => {
      setIsPaused(false)
    }, 5000)
  }

  return (
    <section 
      ref={sectionRef}
      id="how-it-works" 
      className="py-16 sm:py-24 lg:py-32 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <p className="text-xs sm:text-sm font-medium text-emerald-600 mb-3 sm:mb-4 tracking-wide uppercase">
            {t.howItWorks.label}
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-neutral-900 tracking-tight mb-4 sm:mb-6 text-balance">
            {t.howItWorks.title}
          </h2>
          <p className="text-base sm:text-lg text-neutral-500 text-pretty">{t.howItWorks.subtitle}</p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left side - Steps */}
          <div className="w-full lg:w-1/2 space-y-8">
            {steps.map((step, index) => {
              const isActive = index === activeStep
              return (
                <div
                  key={step.number}
                  onClick={() => handleStepClick(index)}
                  className={`transition-all duration-700 ease-out cursor-pointer ${
                    isActive
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-30 translate-x-[-10px] hover:opacity-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className={`text-3xl sm:text-4xl font-bold transition-colors duration-700 ${
                      isActive ? 'text-emerald-500' : 'text-neutral-300'
                    }`}>
                      {step.number}
                    </span>
                    <div className="flex-1">
                      <h3 className={`text-xl sm:text-2xl font-semibold mb-2 transition-colors duration-700 ${
                        isActive ? 'text-neutral-900' : 'text-neutral-400'
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`text-base sm:text-lg leading-relaxed transition-colors duration-700 ${
                        isActive ? 'text-neutral-600' : 'text-neutral-400'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right side - Image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <Image
              src="/brand/Mockup 4.png"
              alt="CoachFlow How It Works"
              width={600}
              height={800}
              className="w-full max-w-md h-auto rounded-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
