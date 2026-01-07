"use client"

import { Users, Dumbbell, UtensilsCrossed, FileText, Calendar, BarChart3 } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function FeaturesSection() {
  const { t } = useLanguage()

  const features = [
    {
      icon: Users,
      titleKey: "clientManagement" as const,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: Dumbbell,
      titleKey: "workoutPlans" as const,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: UtensilsCrossed,
      titleKey: "mealPlanning" as const,
      gradient: "from-emerald-500 to-teal-500",
    }
  ]

  return (
    <section id="features" className="py-16 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <p className="text-xs sm:text-sm font-medium text-emerald-600 mb-3 sm:mb-4 tracking-wide uppercase">
            {t.features.label}
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-neutral-900 tracking-tight mb-4 sm:mb-6 text-balance">
            {t.features.title}
          </h2>
          <p className="text-base sm:text-lg text-neutral-500 text-pretty">{t.features.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const featureData = t.features.items[feature.titleKey]
            return (
              <div
                key={feature.titleKey}
                className="group relative bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-neutral-200/80 hover:border-neutral-300 transition-all duration-300 hover:shadow-xl hover:shadow-neutral-900/5 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-2 sm:mb-3">{featureData.title}</h3>
                <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">{featureData.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
