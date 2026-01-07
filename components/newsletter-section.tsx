"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || isSubmitting) return

    setIsSubmitting(true)
    // TODO: Add newsletter subscription API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setEmail("")
      setTimeout(() => setIsSubmitted(false), 3000)
    }, 500)
  }

  return (
    <section id="newsletter" className="py-8 sm:py-12 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          {/* Left side - Heading */}
          <div className="w-full lg:w-auto lg:flex-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 text-center lg:text-left">
              Chcete získať skorší prístup do aplikácie CoachFlow?
            </h2>
          </div>

          {/* Right side - Email Form */}
          <div className="w-full lg:w-auto lg:flex-1">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative flex items-center">
                <Input
                  type="email"
                  placeholder="Zadajte e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-full px-6 py-6 pr-32 text-base border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className="absolute right-0 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-8 py-6 text-sm font-medium transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                >
                  <span className="ml-2">{isSubmitted ? "Subscribed!" : isSubmitting ? "Odosielam..." : "Požiadať"}</span>
                  {!isSubmitted && !isSubmitting && <ArrowRight className="w-4 h-4 mr-2" />}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
