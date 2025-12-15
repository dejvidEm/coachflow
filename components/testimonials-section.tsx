"use client"

import { Quote } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { Marquee } from "@/components/ui/marquee"

const testimonials = [
  {
    quote: {
      sk: "CoachFlow úplne zmenil spôsob, akým vediem svoj biznis. Ušetrím viac ako 10 hodín týždenne len na administratíve.",
      en: "CoachFlow completely transformed how I run my business. I save 10+ hours every week on admin tasks alone.",
    },
    author: "Miroslav Kováč",
    role: { sk: "Online fitness tréner", en: "Online Fitness Coach" },
    avatar: "/landing/landing4.jpg",
    rating: 5,
  },
  {
    quote: {
      sk: "PDF exporty sú nádherné. Moji klienti sa teraz skutočne tešia na ich plány!",
      en: "The PDF exports are gorgeous. My clients actually look forward to receiving their plans now!",
    },
    author: "Jana Novotná",
    role: { sk: "Osobná trénerka, Bratislava", en: "Personal Trainer, Bratislava" },
    avatar: "/landing/landing5.jpg",
    rating: 5,
  },
  {
    quote: {
      sk: "Vyskúšal som každú trénersku platformu. CoachFlow je jediná, ktorú je radosť používať.",
      en: "I've tried every coaching platform out there. CoachFlow is the only one that doesn't feel like a chore to use.",
    },
    author: "Peter Horváth",
    role: { sk: "Silový a kondičný tréner", en: "Strength & Conditioning Coach" },
    avatar: "/landing/landing6.jpg",
    rating: 5,
  },
]

export function TestimonialsSection() {
  const { t, language } = useLanguage()

  return (
    <section id="testimonials" className="py-16 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm font-medium text-emerald-600 mb-3 sm:mb-4 tracking-wide uppercase">
            {t.testimonials.label}
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-neutral-900 tracking-tight mb-4 sm:mb-6 text-balance">
            {t.testimonials.title}
          </h2>
          <p className="text-base sm:text-lg text-neutral-500 text-pretty">{t.testimonials.subtitle}</p>
        </div>
      </div>

      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden space-y-4">
        <Marquee pauseOnHover className="[--duration:30s]">
          {testimonials.map((testimonial) => (
            <div
              key={`row1-${testimonial.author}`}
              className="relative bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm hover:shadow-lg transition-shadow duration-300 w-[350px] sm:w-[400px] shrink-0"
            >
              <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-100 absolute top-4 sm:top-6 right-4 sm:right-6" />
              <div className="flex gap-1 mb-4 sm:mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-6 sm:mb-8">
                "{testimonial.quote[language]}"
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.author}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm sm:text-base text-neutral-900">{testimonial.author}</p>
                  <p className="text-xs sm:text-sm text-neutral-500">{testimonial.role[language]}</p>
                </div>
              </div>
            </div>
          ))}
        </Marquee>
        
        <Marquee pauseOnHover reverse className="[--duration:30s]">
          {testimonials.map((testimonial) => (
            <div
              key={`row2-${testimonial.author}`}
              className="relative bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm hover:shadow-lg transition-shadow duration-300 w-[350px] sm:w-[400px] shrink-0"
            >
              <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-100 absolute top-4 sm:top-6 right-4 sm:right-6" />
              <div className="flex gap-1 mb-4 sm:mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-6 sm:mb-8">
                "{testimonial.quote[language]}"
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.author}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm sm:text-base text-neutral-900">{testimonial.author}</p>
                  <p className="text-xs sm:text-sm text-neutral-500">{testimonial.role[language]}</p>
                </div>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
