"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const planPrices = {
  starter: { monthly: 29, yearly: 24 },
  pro: { monthly: 79, yearly: 66 },
  business: { monthly: 199, yearly: 166 },
}

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(true)
  const { t } = useLanguage()

  const plans = [
    { key: "starter" as const, popular: false },
    { key: "pro" as const, popular: true },
    { key: "business" as const, popular: false },
  ]

  return (
    <section id="pricing" className="py-16 sm:py-24 lg:py-32 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <p className="text-xs sm:text-sm font-medium text-emerald-600 mb-3 sm:mb-4 tracking-wide uppercase">
            {t.pricing.label}
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-neutral-900 tracking-tight mb-4 sm:mb-6 text-balance">
            {t.pricing.title}
          </h2>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-12">
          <span className={`text-xs sm:text-sm ${!isYearly ? "text-neutral-900" : "text-neutral-500"}`}>
            {t.pricing.monthly}
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-12 sm:w-14 h-6 sm:h-7 rounded-full transition-colors ${isYearly ? "bg-emerald-500" : "bg-neutral-300"}`}
          >
            <div
              className={`absolute top-1 w-4 sm:w-5 h-4 sm:h-5 bg-white rounded-full shadow transition-transform ${isYearly ? "translate-x-6 sm:translate-x-8" : "translate-x-1"}`}
            />
          </button>
          <span className={`text-xs sm:text-sm ${isYearly ? "text-neutral-900" : "text-neutral-500"}`}>
            {t.pricing.yearly} <span className="text-emerald-600 font-medium">{t.pricing.discount}</span>
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {plans.map((plan) => {
            const planData = t.pricing.plans[plan.key]
            const prices = planPrices[plan.key]
            return (
              <div
                key={plan.key}
                className={`relative bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border ${plan.popular ? "border-emerald-500 shadow-xl shadow-emerald-500/10" : "border-neutral-200"} transition-all hover:shadow-lg`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 sm:py-1.5 rounded-full whitespace-nowrap">
                      {t.pricing.mostPopular}
                    </span>
                  </div>
                )}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-1 sm:mb-2">{planData.name}</h3>
                  <p className="text-neutral-500 text-xs sm:text-sm">{planData.description}</p>
                </div>
                <div className="mb-4 sm:mb-6">
                  <span className="text-3xl sm:text-5xl font-bold text-neutral-900">
                    ${isYearly ? prices.yearly : prices.monthly}
                  </span>
                  <span className="text-neutral-500 text-sm sm:text-base">{t.pricing.perMonth}</span>
                </div>
                <Button
                  className={`w-full rounded-full py-5 sm:py-6 mb-6 sm:mb-8 text-sm sm:text-base ${plan.popular ? "bg-neutral-900 text-white hover:bg-neutral-800" : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"}`}
                >
                  {t.pricing.startTrial}
                </Button>
                <ul className="space-y-3 sm:space-y-4">
                  {planData.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 sm:gap-3">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600" />
                      </div>
                      <span className="text-neutral-600 text-xs sm:text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
