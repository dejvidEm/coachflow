"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowRight, CheckCircle2, Calendar } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function CTASection() {
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    company: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error("Request failed")
      }

      setIsSuccess(true)
      setFormData({ name: "", email: "", phone: "", message: "", company: "" })
    } catch {
      setError(t.contact.error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-8 sm:p-12 lg:p-16">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-56 sm:w-80 h-56 sm:h-80 bg-teal-500/10 rounded-full blur-3xl" />

          <div className="relative grid gap-10 lg:gap-16 lg:grid-cols-2 items-center">
            {/* Left side - Heading + subheading + call button */}
            <div className="text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-semibold leading-normal text-white mb-4 sm:mb-6 text-balance">
                {t.cta.title}
              </h2>
              <p className="text-base sm:text-lg text-neutral-400 mb-8 sm:mb-10 text-pretty">{t.cta.subtitle}</p>

              <div className="flex justify-center lg:justify-start">
                <Button
                  asChild
                  className="w-full sm:w-auto bg-white text-neutral-900 hover:bg-neutral-100 rounded-full px-16 sm:px-16 py-5 sm:py-6 text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <a href="https://calendly.com/mikulasdejvid/30min" target="_blank" rel="noopener noreferrer">
                    <span className="mr-2">{t.cta.ctaPrimary}</span>
                    <Calendar className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Right side - Contact form */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 sm:p-8">
              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">{t.contact.success}</h4>
                  <p className="text-neutral-400 mb-6">{t.contact.successMessage}</p>
                  <Button
                    onClick={() => setIsSuccess(false)}
                    variant="outline"
                    className="rounded-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    {t.contact.send}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot field for spam bots - hidden from real users */}
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="hidden"
                    aria-hidden="true"
                  />
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
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-neutral-300 text-sm">
                      {t.contact.phone}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={t.contact.phonePlaceholder}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl"
                    />
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
                  {error && <p className="text-sm text-red-400">{error}</p>}
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
    </section>
  )
}
