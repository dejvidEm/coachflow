"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowRight, Sparkles, Mail, RotateCcw, CheckCircle2, Calendar } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function CTASection() {
  const { t } = useLanguage()
  const [isFlipped, setIsFlipped] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSuccess(true)
    setFormData({ name: "", email: "", message: "" })
  }

  const handleFlipBack = () => {
    setIsFlipped(false)
    setIsSuccess(false)
  }

  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative [perspective:2000px]">
          <div
            className={`relative transition-all duration-700 [transform-style:preserve-3d] ${
              isFlipped ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            {/* Front side - CTA */}
            <div className="[backface-visibility:hidden]">
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-8 sm:p-12 lg:p-20">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-56 sm:w-80 h-56 sm:h-80 bg-teal-500/10 rounded-full blur-3xl" />

                <div className="relative text-center max-w-3xl mx-auto">
                  <h2 className="text-2xl sm:text-3xl lg:text-5xl font-semibold leading-normal text-white mb-4 sm:mb-6 text-balance">
                    {t.cta.title}
                  </h2>
                  <p className="text-base sm:text-lg text-neutral-400 mb-8 sm:mb-10 text-pretty">{t.cta.subtitle}</p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                    <Button 
                      asChild
                      className="w-full sm:w-auto bg-white text-neutral-900 hover:bg-neutral-100 rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    >
                      <a href="https://calendly.com/mikulasdejvid/30min" target="_blank" rel="noopener noreferrer">
                        <span className="ml-2">{t.cta.ctaPrimary}</span>
                        <Calendar className="w-4 h-4 ml-2 mr-2" />
                      </a>
                    </Button>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/10">
                    <button
                      onClick={() => setIsFlipped(true)}
                      className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{t.cta.contactButton}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Back side - Contact Form */}
            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-8 sm:p-12 lg:p-20 h-full">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-teal-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-56 sm:w-80 h-56 sm:h-80 bg-emerald-500/10 rounded-full blur-3xl" />

                <div className="relative max-w-xl mx-auto">
                  {/* Back button */}
                  <button
                    onClick={handleFlipBack}
                    className="absolute top-0 left-0 inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-sm">{t.cta.backButton}</span>
                  </button>

                  <div className="text-center mb-8 pt-8 sm:pt-0">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 mb-4">
                      <Mail className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-2">{t.contact.title}</h3>
                    <p className="text-neutral-400">{t.contact.subtitle}</p>
                  </div>

                  {isSuccess ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h4 className="text-xl font-semibold text-white mb-2">{t.contact.success}</h4>
                      <p className="text-neutral-400 mb-6">{t.contact.successMessage}</p>
                      <Button
                        onClick={handleFlipBack}
                        variant="outline"
                        className="rounded-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                      >
                        {t.cta.backButton}
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-neutral-300 text-sm">
                            {t.contact.name}
                          </Label>
                          <Input
                            id="name"
                            type="text"
                            placeholder={t.contact.namePlaceholder}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-neutral-300 text-sm">
                            {t.contact.email}
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder={t.contact.emailPlaceholder}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-neutral-300 text-sm">
                          {t.contact.message}
                        </Label>
                        <Textarea
                          id="message"
                          placeholder={t.contact.messagePlaceholder}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                          rows={4}
                          className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl resize-none"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-full py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {isSubmitting ? t.contact.sending : t.contact.send}
                        {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
