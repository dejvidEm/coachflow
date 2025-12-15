"use client"

import Link from "next/link"
import { Instagram } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function Footer() {
  const { t } = useLanguage()

  const footerCategories = [
    { key: "product" as const, data: t.footer.categories.product },
    { key: "company" as const, data: t.footer.categories.company },
    { key: "resources" as const, data: t.footer.categories.resources },
    { key: "legal" as const, data: t.footer.categories.legal },
  ]

  return (
    <footer className="bg-neutral-900 text-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">CF</span>
              </div>
              <span className="font-semibold text-lg">CoachFlow</span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed">{t.footer.tagline}</p>
          </div>

          {/* Links */}
          {footerCategories.map((category) => (
            <div key={category.key}>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm">{category.data.title}</h4>
              <ul className="space-y-2 sm:space-y-3">
                {category.data.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-neutral-400 hover:text-white text-xs sm:text-sm transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-6 sm:pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-400 text-xs sm:text-sm text-center sm:text-left">{t.footer.copyright}</p>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="#"
              className="text-neutral-400 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
