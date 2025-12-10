"use client"

import { Check } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import Image from "next/image"

export function HowItWorksSection() {
  const { t } = useLanguage()

  const steps = [
    {
      number: "01",
      key: "step1" as const,
      image: "/landing/landing1.jpg",
    },
    {
      number: "02",
      key: "step2" as const,
      image: "/landing/landing2.jpg",
    },
    {
      number: "03",
      key: "step3" as const,
      image: "/landing/landing3.jpg",
    },
  ]

  return (
    <section id="how-it-works" className="py-16 sm:py-24 lg:py-32 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-24">
          <p className="text-xs sm:text-sm font-medium text-emerald-600 mb-3 sm:mb-4 tracking-wide uppercase">
            {t.howItWorks.label}
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-neutral-900 tracking-tight mb-4 sm:mb-6 text-balance">
            {t.howItWorks.title}
          </h2>
          <p className="text-base sm:text-lg text-neutral-500 text-pretty">{t.howItWorks.subtitle}</p>
        </div>

        <div className="space-y-16 sm:space-y-24 lg:space-y-32">
          {steps.map((step, index) => {
            const stepData = t.howItWorks.steps[step.key]
            return (
              <div
                key={step.number}
                className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-8 sm:gap-12 lg:gap-20`}
              >
                <div className="flex-1 space-y-4 sm:space-y-6 text-center lg:text-left">
                  <div className="inline-flex items-center gap-3">
                    <span className="text-4xl sm:text-5xl font-bold text-neutral-200">{step.number}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-neutral-900">{stepData.title}</h3>
                  <p className="text-base sm:text-lg text-neutral-500 leading-relaxed">{stepData.description}</p>
                  <ul className="space-y-2 sm:space-y-3 inline-block lg:block">
                    {stepData.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                          <Check className="w-3 h-3 text-emerald-600" />
                        </div>
                        <span className="text-sm sm:text-base text-neutral-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 w-full">
                  <div className="relative">
                    <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl sm:rounded-3xl blur-xl" />
                    <div className="relative bg-white rounded-xl sm:rounded-2xl border border-neutral-200 shadow-xl overflow-hidden">
                      <Image
                        src={step.image || "/placeholder.svg"}
                        alt={stepData.title}
                        width={800}
                        height={533}
                        className="w-full aspect-[3/2] object-cover"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
