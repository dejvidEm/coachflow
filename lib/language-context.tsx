"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "sk" | "en"

interface Translations {
  nav: {
    features: string
    howItWorks: string
    pricing: string
    testimonials: string
    login: string
    startTrial: string
  }
  hero: {
    badge: string
    headline: string
    headlineHighlight: string
    subheadline: string
    ctaPrimary: string
    ctaSecondary: string
    socialProof: string
  }
  logoCloud: {
    title: string
  }
  features: {
    label: string
    title: string
    subtitle: string
    items: {
      clientManagement: { title: string; description: string }
      workoutPlans: { title: string; description: string }
      mealPlanning: { title: string; description: string }
      pdfExports: { title: string; description: string }
      scheduling: { title: string; description: string }
      analytics: { title: string; description: string }
    }
  }
  howItWorks: {
    label: string
    title: string
    subtitle: string
    steps: {
      step1: { title: string; description: string; features: string[] }
      step2: { title: string; description: string; features: string[] }
      step3: { title: string; description: string; features: string[] }
    }
  }
  testimonials: {
    label: string
    title: string
    subtitle: string
  }
  pricing: {
    label: string
    title: string
    subtitle: string
    monthly: string
    yearly: string
    discount: string
    startTrial: string
    mostPopular: string
    perMonth: string
    plans: {
      starter: { name: string; description: string; features: string[] }
      pro: { name: string; description: string; features: string[] }
      business: { name: string; description: string; features: string[] }
    }
  }
  cta: {
    badge: string
    title: string
    subtitle: string
    ctaPrimary: string
    ctaSecondary: string
    contactButton: string
    backButton: string
  }
  contact: {
    title: string
    subtitle: string
    name: string
    namePlaceholder: string
    email: string
    emailPlaceholder: string
    message: string
    messagePlaceholder: string
    send: string
    sending: string
    success: string
    successMessage: string
  }
  footer: {
    tagline: string
    copyright: string
    categories: {
      product: { title: string; links: string[] }
      company: { title: string; links: string[] }
      resources: { title: string; links: string[] }
      legal: { title: string; links: string[] }
    }
  }
}

const translations: Record<Language, Translations> = {
  sk: {
    nav: {
      features: "Funkcie",
      howItWorks: "Ako to funguje",
      pricing: "Cenník",
      testimonials: "Referencie",
      login: "Prihlásiť sa",
      startTrial: "Vyskúšať zadarmo",
    },
    hero: {
      badge: "Novinka: AI generovanie jedálničkov",
      headline: "Moderná platforma pre",
      headlineHighlight: "osobných trénerov",
      subheadline:
        "Spravujte klientov, vytvárajte tréningové plány, generujte jedálničky a exportujte profesionálne PDF — všetko na jednom mieste.",
      ctaPrimary: "Vyskúšať zadarmo",
      ctaSecondary: "Pozrieť demo",
      socialProof: "Obľúbené u 2 000+ trénerov",
    },
    logoCloud: {
      title: "Dôverujú nám tréneri z popredných fitness značiek",
    },
    features: {
      label: "Funkcie",
      title: "Všetko, čo potrebujete na rozvoj vášho trénerského biznisu",
      subtitle: "Od správy klientov po profesionálne materiály — CoachFlow vám dáva nástroje na efektívnejšiu prácu.",
      items: {
        clientManagement: {
          title: "Správa klientov",
          description:
            "Organizujte všetkých klientov na jednom mieste. Sledujte pokrok, poznámky a históriu komunikácie.",
        },
        workoutPlans: {
          title: "Tréningové plány",
          description: "Vytvárajte personalizované tréningové programy s naším intuitívnym drag-and-drop nástrojom.",
        },
        mealPlanning: {
          title: "AI jedálničky",
          description: "Generujte jedálničky na mieru podľa cieľov, preferencií a diétnych obmedzení klientov.",
        },
        pdfExports: {
          title: "Profesionálne PDF",
          description: "Vytvárajte elegantné, brandované PDF, ktoré vaši klienti budú s radosťou používať.",
        },
        scheduling: {
          title: "Inteligentné plánovanie",
          description: "Synchronizujte kalendáre, posielajte pripomienky a spravujte rezervácie bez komplikácií.",
        },
        analytics: {
          title: "Analytika pokroku",
          description: "Vizualizujte pokrok klientov pomocou prehľadných grafov a štatistík.",
        },
      },
    },
    howItWorks: {
      label: "Ako to funguje",
      title: "Začnite za pár minút, nie hodín",
      subtitle: "CoachFlow je navrhnutý tak, aby sa bezproblémovo integroval do vášho existujúceho workflow.",
      steps: {
        step1: {
          title: "Importujte klientov",
          description:
            "Jednoducho importujte existujúci zoznam klientov alebo ich pridajte jednotlivo. CoachFlow sa postará o zvyšok.",
          features: ["CSV import", "Manuálne pridanie", "Auto-sync kontaktov"],
        },
        step2: {
          title: "Vytvorte personalizované plány",
          description:
            "Použite náš intuitívny nástroj na tvorbu tréningových a stravovacích plánov na mieru každému klientovi.",
          features: ["Drag-and-drop nástroj", "Knižnica šablón", "AI návrhy"],
        },
        step3: {
          title: "Doručte a sledujte pokrok",
          description: "Zdieľajte profesionálne PDF a sledujte cestu vašich klientov v reálnom čase.",
          features: ["Zdieľanie jedným klikom", "Fotky pokroku", "Analytický dashboard"],
        },
      },
    },
    testimonials: {
      label: "Referencie",
      title: "Obľúbené trénermi po celom svete",
      subtitle: "Neverte len nám. Tu je, čo hovoria fitness profesionáli.",
    },
    pricing: {
      label: "Cenník",
      title: "Jednoduchý, transparentný cenník",
      subtitle: "14 dní zadarmo. Bez zadávania karty. Zrušte kedykoľvek.",
      monthly: "Mesačne",
      yearly: "Ročne",
      discount: "(-20%)",
      startTrial: "Vyskúšať zadarmo",
      mostPopular: "Najpopulárnejší",
      perMonth: "/mesiac",
      plans: {
        starter: {
          name: "Štart",
          description: "Ideálne pre trénerov, ktorí začínajú",
          features: [
            "Až 10 aktívnych klientov",
            "Tvorba tréningových plánov",
            "Základné šablóny jedálničkov",
            "PDF exporty",
            "E-mailová podpora",
          ],
        },
        pro: {
          name: "Pro",
          description: "Pre rastúce fitness biznisy",
          features: [
            "Až 50 aktívnych klientov",
            "AI generovanie jedálničkov",
            "Vlastný branding na PDF",
            "Sledovanie pokroku a analytika",
            "Mobilná aplikácia pre klientov",
            "Prioritná podpora",
          ],
        },
        business: {
          name: "Business",
          description: "Pre tímy a majiteľov fitnescentier",
          features: [
            "Neobmedzený počet klientov",
            "Tímová spolupráca",
            "White-label riešenie",
            "API prístup",
            "Pokročilá analytika",
            "Dedikovaný account manager",
          ],
        },
      },
    },
    cta: {
      badge: "14 dní zadarmo • Bez zadávania karty",
      title: "Ste pripravení transformovať váš trénerský biznis?",
      subtitle:
        "Pridajte sa k tisícom fitness profesionálov, ktorí dôverujú CoachFlow pri poskytovaní výnimočných služieb klientom.",
      ctaPrimary: "Vyskúšať zadarmo",
      ctaSecondary: "Naplánovať demo",
      contactButton: "Kontaktujte nás",
      backButton: "Späť",
    },
    contact: {
      title: "Napíšte nám",
      subtitle: "Máte otázky? Radi vám pomôžeme.",
      name: "Meno",
      namePlaceholder: "Vaše meno",
      email: "E-mail",
      emailPlaceholder: "vas@email.sk",
      message: "Správa",
      messagePlaceholder: "Ako vám môžeme pomôcť?",
      send: "Odoslať správu",
      sending: "Odosiela sa...",
      success: "Správa odoslaná!",
      successMessage: "Ďakujeme za vašu správu. Ozveme sa vám čo najskôr.",
    },
    footer: {
      tagline: "Moderná platforma pre osobných trénerov.",
      copyright: "© 2025 CoachFlow. Všetky práva vyhradené.",
      categories: {
        product: {
          title: "Produkt",
          links: ["Funkcie", "Cenník", "Integrácie", "Zmeny", "Plány"],
        },
        company: {
          title: "Spoločnosť",
          links: ["O nás", "Blog", "Kariéra", "Tlač", "Partneri"],
        },
        resources: {
          title: "Zdroje",
          links: ["Dokumentácia", "Centrum pomoci", "Komunita", "Šablóny", "Webináre"],
        },
        legal: {
          title: "Právne",
          links: ["Súkromie", "Podmienky", "Bezpečnosť", "Cookies"],
        },
      },
    },
  },
  en: {
    nav: {
      features: "Features",
      howItWorks: "How it works",
      pricing: "Pricing",
      testimonials: "Testimonials",
      login: "Log in",
      startTrial: "Start free trial",
    },
    hero: {
      badge: "New: AI-powered meal plan generation",
      headline: "The modern platform for",
      headlineHighlight: "personal trainers",
      subheadline:
        "Manage clients, create custom workout plans, generate meal plans, and export beautiful PDFs — all in one seamless workflow.",
      ctaPrimary: "Start your free trial",
      ctaSecondary: "Watch demo",
      socialProof: "Loved by 2,000+ trainers",
    },
    logoCloud: {
      title: "Trusted by trainers at leading fitness brands",
    },
    features: {
      label: "Features",
      title: "Everything you need to scale your coaching business",
      subtitle:
        "From client management to beautiful deliverables, CoachFlow gives you the tools to work smarter, not harder.",
      items: {
        clientManagement: {
          title: "Client Management",
          description:
            "Organize all your clients in one place. Track progress, notes, and communication history effortlessly.",
        },
        workoutPlans: {
          title: "Custom Workout Plans",
          description: "Build personalized training programs with our intuitive drag-and-drop workout builder.",
        },
        mealPlanning: {
          title: "AI Meal Planning",
          description: "Generate tailored meal plans based on client goals, preferences, and dietary restrictions.",
        },
        pdfExports: {
          title: "Beautiful PDF Exports",
          description: "Create stunning, branded PDFs that your clients will love to follow and share.",
        },
        scheduling: {
          title: "Smart Scheduling",
          description: "Sync calendars, send reminders, and manage bookings without the back-and-forth.",
        },
        analytics: {
          title: "Progress Analytics",
          description: "Visualize client progress with beautiful charts and insights that drive results.",
        },
      },
    },
    howItWorks: {
      label: "How it works",
      title: "Get started in minutes, not hours",
      subtitle: "CoachFlow is designed to fit seamlessly into your existing workflow. Here's how simple it is.",
      steps: {
        step1: {
          title: "Import your clients",
          description: "Easily import your existing client list or add them one by one. CoachFlow handles the rest.",
          features: ["CSV import", "Manual entry", "Auto-sync contacts"],
        },
        step2: {
          title: "Create personalized plans",
          description: "Use our intuitive builder to craft custom workout and meal plans tailored to each client.",
          features: ["Drag-and-drop builder", "Template library", "AI suggestions"],
        },
        step3: {
          title: "Deliver & track progress",
          description: "Share beautiful PDFs and track your clients' journey with real-time progress updates.",
          features: ["One-click sharing", "Progress photos", "Analytics dashboard"],
        },
      },
    },
    testimonials: {
      label: "Testimonials",
      title: "Loved by trainers worldwide",
      subtitle: "Don't just take our word for it. Here's what fitness professionals are saying.",
    },
    pricing: {
      label: "Pricing",
      title: "Simple, transparent pricing",
      subtitle: "Start free for 14 days. No credit card required. Cancel anytime.",
      monthly: "Monthly",
      yearly: "Yearly",
      discount: "(-20%)",
      startTrial: "Start free trial",
      mostPopular: "Most popular",
      perMonth: "/month",
      plans: {
        starter: {
          name: "Starter",
          description: "Perfect for trainers just getting started",
          features: [
            "Up to 10 active clients",
            "Workout plan builder",
            "Basic meal plan templates",
            "PDF exports",
            "Email support",
          ],
        },
        pro: {
          name: "Pro",
          description: "For growing fitness businesses",
          features: [
            "Up to 50 active clients",
            "AI meal plan generation",
            "Custom branding on PDFs",
            "Progress tracking & analytics",
            "Client mobile app",
            "Priority support",
          ],
        },
        business: {
          name: "Business",
          description: "For teams and gym owners",
          features: [
            "Unlimited clients",
            "Team collaboration",
            "White-label solution",
            "API access",
            "Advanced analytics",
            "Dedicated account manager",
          ],
        },
      },
    },
    cta: {
      badge: "14-day free trial • No credit card required",
      title: "Ready to transform your coaching business?",
      subtitle:
        "Join thousands of fitness professionals who trust CoachFlow to deliver exceptional client experiences.",
      ctaPrimary: "Start your free trial",
      ctaSecondary: "Schedule a demo",
      contactButton: "Contact us",
      backButton: "Go back",
    },
    contact: {
      title: "Get in touch",
      subtitle: "Have questions? We'd love to hear from you.",
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@example.com",
      message: "Message",
      messagePlaceholder: "How can we help you?",
      send: "Send message",
      sending: "Sending...",
      success: "Message sent!",
      successMessage: "Thanks for reaching out. We'll get back to you soon.",
    },
    footer: {
      tagline: "The modern platform for personal trainers.",
      copyright: "© 2025 CoachFlow. All rights reserved.",
      categories: {
        product: {
          title: "Product",
          links: ["Features", "Pricing", "Integrations", "Changelog", "Roadmap"],
        },
        company: {
          title: "Company",
          links: ["About", "Blog", "Careers", "Press", "Partners"],
        },
        resources: {
          title: "Resources",
          links: ["Documentation", "Help Center", "Community", "Templates", "Webinars"],
        },
        legal: {
          title: "Legal",
          links: ["Privacy", "Terms", "Security", "Cookies"],
        },
      },
    },
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("sk")

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
