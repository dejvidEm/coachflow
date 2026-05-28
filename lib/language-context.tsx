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
    waitlistPlaceholder: string
    waitlistButton: string
    waitlistSending: string
    waitlistSuccess: string
    waitlistError: string
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
    phone: string
    phonePlaceholder: string
    message: string
    messagePlaceholder: string
    send: string
    sending: string
    success: string
    successMessage: string
    error: string
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
  onboarding: {
    welcome: {
      title: string
      subtitle: string
      step1Title: string
      step1Description: string
      step2Title: string
      step2Description: string
      step3Title: string
      step3Description: string
      startTour: string
      skipTour: string
    }
    steps: {
      welcome: { title: string; description: string }
      dashboardOverview: { title: string; description: string }
      createClient: { title: string; description: string; actionLabel: string }
      createMeal: { title: string; description: string; actionLabel: string }
      createExercise: { title: string; description: string; actionLabel: string }
      generatePdf: { title: string; description: string }
      teamSettings: { title: string; description: string }
      complete: { title: string; description: string }
    }
    tooltip: {
      previous: string
      next: string
      skip: string
      getStarted: string
      stepOf: string
    }
    restart: {
      restartTour: string
      viewChangelog: string
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
        "Trávte menej času chaosom okolo coachingu a viac tým, na čom záleží. Spravujte klientov a vytvárajte tréningové aj jedálničkové plány v jednej aplikácii.",
      ctaPrimary: "Získať skorší prístup",
      ctaSecondary: "Watch demo",
      socialProof: "Obľúbené u trénerov po celom Slovensku",
      waitlistPlaceholder: "Vaša e-mailová adresa",
      waitlistButton: "Skorší prístup",
      waitlistSending: "Odosielam...",
      waitlistSuccess: "Ďakujeme! Ozveme sa vám.",
      waitlistError: "Niečo sa pokazilo. Skúste to znova.",
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
      ctaPrimary: "Naplánovať hovor",
      ctaSecondary: "Naplánovať demo",
      contactButton: "Kontaktujte nás",
      backButton: "Späť",
    },
    contact: {
      title: "Napíšte nám",
      subtitle: "Máte otázky? Radi vám pomôžeme.",
      name: "Meno alebo firma",
      namePlaceholder: "Vaše meno alebo firma",
      email: "E-mail",
      emailPlaceholder: "vas@email.sk",
      phone: "Telefónne číslo",
      phonePlaceholder: "+421 900 000 000",
      message: "Otázka alebo text",
      messagePlaceholder: "Ako vám môžeme pomôcť?",
      send: "Odoslať správu",
      sending: "Odosiela sa...",
      success: "Správa odoslaná!",
      successMessage: "Ďakujeme za vašu správu. Ozveme sa vám čo najskôr.",
      error: "Správu sa nepodarilo odoslať. Skúste to znova.",
    },
    footer: {
      tagline: "Moderná platforma pre osobných trénerov.",
      copyright: "© 2026 CoachFlow. Všetky práva vyhradené.",
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
    onboarding: {
      welcome: {
        title: "Vitajte v CoachFlow",
        subtitle: "Začnime za 2 minúty",
        step1Title: "Spravujte svojich klientov",
        step1Description: "Pridajte klientov, sledujte ich pokrok a organizujte všetko na jednom mieste.",
        step2Title: "Vytvárajte plány",
        step2Description: "Vytvárajte jedálničky a tréningové programy šité na mieru každému klientovi.",
        step3Title: "Generujte a zdieľajte",
        step3Description: "Vytvárajte profesionálne PDF a posielajte ich priamo svojim klientom.",
        startTour: "Spustiť prehliadku",
        skipTour: "Preskúmam sám",
      },
      steps: {
        welcome: {
          title: "Vitajte v CoachFlow! 🎉",
          description: "Urobme si rýchlu prehliadku, aby sme vám pomohli začať. Ukážeme vám kľúčové funkcie v niekoľkých krokoch.",
        },
        dashboardOverview: {
          title: "Váš Dashboard",
          description: "Toto je váš hlavný dashboard, kde môžete vidieť prehľad vašich klientov a rýchle štatistiky. Navigujte medzi rôznymi sekciami pomocou bočného menu.",
        },
        createClient: {
          title: "Spravujte svojich klientov",
          description: "Kliknite sem a pridajte svojho prvého klienta. Môžete pridať ich informácie, fitness ciele a sledovať ich pokrok.",
          actionLabel: "Prejsť na Klientov",
        },
        createMeal: {
          title: "Vytvárajte jedálničky",
          description: "Vytvorte si databázu jedál a vytvárajte vlastné jedálničky pre svojich klientov. Každé jedlo obsahuje makroživiny a nutričné informácie.",
          actionLabel: "Prejsť na Jedlá",
        },
        createExercise: {
          title: "Vytvorte knižnicu cvičení",
          description: "Pridajte cvičenia do svojej knižnice s inštrukciami, svalovými skupinami a obrázkami. Použite ich na vytvorenie tréningových plánov.",
          actionLabel: "Prejsť na Cvičenia",
        },
        generatePdf: {
          title: "Generujte profesionálne PDF",
          description: "Vytvárajte krásne, brandované PDF pre jedálničky a tréningové programy. Posielajte ich priamo svojim klientom cez e-mail.",
        },
        teamSettings: {
          title: "Tím a Nastavenia",
          description: "Pozvite členov tímu, spravujte svoje predplatné a prispôsobte si nastavenia. Všetko je tu zorganizované.",
        },
        complete: {
          title: "Všetko je pripravené! 🚀",
          description: "Dokončili ste prehliadku! Začnite pridaním svojho prvého klienta a vytvorením jedálnička. Potrebujete pomoc? Pozrite si našu dokumentáciu alebo kontaktujte podporu.",
        },
      },
      tooltip: {
        previous: "Predchádzajúce",
        next: "Ďalšie",
        skip: "Preskočiť",
        getStarted: "Začať",
        stepOf: "Krok {current} z {total}",
      },
      restart: {
        restartTour: "Spustiť prehliadku znova",
        viewChangelog: "Zobraziť zmeny",
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
      socialProof: "Loved by trainers across Slovakia",
      waitlistPlaceholder: "Your email address",
      waitlistButton: "Join waitlist",
      waitlistSending: "Sending...",
      waitlistSuccess: "Thanks! We'll be in touch.",
      waitlistError: "Something went wrong. Please try again.",
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
      name: "Name or company",
      namePlaceholder: "Your name or company",
      email: "Email",
      emailPlaceholder: "you@example.com",
      phone: "Phone number",
      phonePlaceholder: "+421 900 000 000",
      message: "Question or message",
      messagePlaceholder: "How can we help you?",
      send: "Send message",
      sending: "Sending...",
      success: "Message sent!",
      successMessage: "Thanks for reaching out. We'll get back to you soon.",
      error: "Failed to send message. Please try again.",
    },
    footer: {
      tagline: "The modern platform for personal trainers.",
      copyright: "© 2026 CoachFlow. All rights reserved.",
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
    onboarding: {
      welcome: {
        title: "Welcome to CoachFlow",
        subtitle: "Let's get you started in just 2 minutes",
        step1Title: "Manage Your Clients",
        step1Description: "Add clients, track their progress, and organize everything in one place.",
        step2Title: "Create Plans",
        step2Description: "Build meal plans and training programs tailored to each client's goals.",
        step3Title: "Generate & Share",
        step3Description: "Create professional PDFs and send them directly to your clients.",
        startTour: "Start Guided Tour",
        skipTour: "I'll explore on my own",
      },
      steps: {
        welcome: {
          title: "Welcome to CoachFlow! 🎉",
          description: "Let's take a quick tour to help you get started. We'll show you the key features in just a few steps.",
        },
        dashboardOverview: {
          title: "Your Dashboard",
          description: "This is your main dashboard where you can see an overview of your clients and quick stats. Navigate to different sections using the sidebar.",
        },
        createClient: {
          title: "Manage Your Clients",
          description: "Click here to add your first client. You can add their information, fitness goals, and track their progress.",
          actionLabel: "Go to Clients",
        },
        createMeal: {
          title: "Create Meal Plans",
          description: "Build your meal database and create custom meal plans for your clients. Each meal includes macros and nutritional information.",
          actionLabel: "Go to Meals",
        },
        createExercise: {
          title: "Build Exercise Library",
          description: "Add exercises to your library with instructions, muscle groups, and images. Use them to create training plans.",
          actionLabel: "Go to Exercises",
        },
        generatePdf: {
          title: "Generate Professional PDFs",
          description: "Create beautiful, branded PDFs for meal plans and training programs. Send them directly to your clients via email.",
        },
        teamSettings: {
          title: "Team & Settings",
          description: "Invite team members, manage your subscription, and customize your settings. Everything is organized here.",
        },
        complete: {
          title: "You're All Set! 🚀",
          description: "You've completed the tour! Start by adding your first client and creating a meal plan. Need help? Check our documentation or contact support.",
        },
      },
      tooltip: {
        previous: "Previous",
        next: "Next",
        skip: "Skip",
        getStarted: "Get Started",
        stepOf: "Step {current} of {total}",
      },
      restart: {
        restartTour: "Restart Tour",
        viewChangelog: "View Changelog",
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
