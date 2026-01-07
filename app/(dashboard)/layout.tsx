'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { use, useState, Suspense, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, LogOut, ArrowRight, Menu, X } from 'lucide-react';
import { GlobalSearch } from '@/components/dashboard/global-search';
import { RestartTourButton } from '@/components/onboarding/restart-tour-button';
import { OnboardingProvider } from '@/lib/onboarding/context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from '@/app/(login)/actions';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@/lib/db/schema';
import useSWR, { mutate } from 'swr';
import { clearAllCache } from '@/lib/cache-utils';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const router = useRouter();

  // Prevent hydration mismatch by only rendering dropdown after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  async function handleSignOut() {
    // Clear all SWR cache before logging out
    clearAllCache();
    
    await signOut();
    router.push('/');
  }

  if (!user) {
    return (
      <>
        <Link
          href="/pricing"
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Pricing
        </Link>
        <Button asChild className="rounded-full">
          <Link href="/sign-in">Sign-In</Link>
        </Button>
      </>
    );
  }

  // Render a placeholder during SSR to prevent hydration mismatch
  if (!isMounted) {
    return (
      <Avatar className="cursor-pointer size-9">
        <AvatarImage alt={user.name || ''} />
        <AvatarFallback>
          {user.name
            ? user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)
            : user.email && user.email.length > 0
            ? user.email[0].toUpperCase()
            : 'U'}
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer size-9">
          <AvatarImage alt={user.name || ''} />
          <AvatarFallback>
            {user.name
              ? user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
              : user.email && user.email.length > 0
              ? user.email[0].toUpperCase()
              : 'U'}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col gap-1">
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/dashboard" className="flex w-full items-center">
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <form action={handleSignOut} className="w-full">
          <button type="submit" className="flex w-full">
            <DropdownMenuItem className="w-full flex-1 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


// Landing page header - can be customized independently
function LandingHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: user } = useSWR<User>('/api/user', fetcher);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleScrollTo = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    // If we're not on the home page, navigate there first
    if (pathname !== '/') {
      router.push(`/#${sectionId}`);
      return;
    }

    // If we're already on the home page, just scroll
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 md:py-8">
          <div className="bg-white rounded-full px-2 sm:px-8 py-3 sm:py-6 flex justify-between items-center shadow-sm overflow-visible">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0" onClick={handleLinkClick}>
                <Image
                  src="/brand/logo.svg"
                  alt="CoachFlow"
                  width={20}
                  height={20}
                  className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
                  priority
                />
              <span className="font-semibold text-base sm:text-xl text-black truncate">CoachFlow</span>
            </Link>

            {/* Desktop Navigation and Buttons */}
            <div className="hidden md:flex items-center gap-12">
              {/* Navigation Links */}
              <nav className="flex items-center gap-8">
                <button
                  onClick={() => handleScrollTo('features')}
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Features
                </button>
                <button
                  onClick={() => handleScrollTo('how-it-works')}
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  How it works
                </button>
                <Link
                  href="/pricing"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Pricing
                </Link>
              </nav>

              {/* UserMenu or Sign-In/Create account buttons */}
              {!isMounted ? (
                <div className="h-10 w-32" />
              ) : user ? (
                <Suspense fallback={<div className="h-10" />}>
                  <UserMenu />
                </Suspense>
              ) : (
                <div className="flex items-center gap-3">
                  <Button asChild className="rounded-full group">
                    <Link href="/sign-in" className="flex items-center">
                      <span className="group-hover:-translate-x-1 transition-transform duration-300 ease-in-out">Sign-In</span>
                      <span className="max-w-0 overflow-hidden group-hover:max-w-8 group-hover:ml-1 transition-all duration-300 ease-in-out">
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 ease-in-out" />
                      </span>
                    </Link>
                  </Button>
                  <Button asChild className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white group">
                    <Link href="/sign-up" className="flex items-center">
                      <span className="transition-transform duration-300 ease-in-out">Create account</span>
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2 flex-shrink-0">
              {!isMounted ? (
                <div className="h-10 w-10" />
              ) : user ? (
                <Suspense fallback={<div className="h-10 w-10" />}>
                  <UserMenu />
                </Suspense>
              ) : null}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden flex-shrink-0"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-7 w-7" />
                ) : (
                  <Menu className="h-7 w-7" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Side Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-20 px-6">
          {/* Close button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-3 items-center">
            <button
              onClick={() => handleScrollTo('features')}
              className="text-center text-base font-medium text-gray-700 hover:text-gray-900 transition-colors py-2"
            >
              Features
            </button>
            <button
              onClick={() => handleScrollTo('how-it-works')}
              className="text-center text-base font-medium text-gray-700 hover:text-gray-900 transition-colors py-2"
            >
              How it works
            </button>
            <Link
              href="/pricing"
              onClick={handleLinkClick}
              className="text-center text-base font-medium text-gray-700 hover:text-gray-900 transition-colors py-2"
            >
              Pricing
            </Link>
          </nav>

          {/* Mobile Auth Buttons */}
          {!user && (
            <div className="mt-6 flex flex-col gap-3">
              <Button asChild className="rounded-full group w-full">
                <Link href="/sign-in" onClick={handleLinkClick} className="flex items-center justify-center">
                  <span className="group-hover:-translate-x-1 transition-transform duration-300 ease-in-out">Sign-In</span>
                  <span className="max-w-0 overflow-hidden group-hover:max-w-8 group-hover:ml-1 transition-all duration-300 ease-in-out">
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 ease-in-out" />
                  </span>
                </Link>
              </Button>
              <Button asChild className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white group w-full">
                <Link href="/sign-up" onClick={handleLinkClick} className="flex items-center justify-center">
                  <span className="transition-transform duration-300 ease-in-out">Create account</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Dashboard header - stays the same
function DashboardHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/brand/logo.svg"
            alt="CoachFlow"
            width={120}
            height={88}
            className="h-8 w-auto"
            priority
          />
        </Link>
        <GlobalSearch />
        <div className="flex items-center space-x-4">
          <Suspense fallback={<div className="h-9" />}>
            <RestartTourButton />
          </Suspense>
          <Suspense fallback={<div className="h-9" />}>
            <UserMenu />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

// Header wrapper that chooses which header to render
function Header() {
  const pathname = usePathname();
  const isInsideApp = pathname.startsWith('/dashboard');

  if (isInsideApp) {
    return <DashboardHeader />;
  }

  return <LandingHeader />;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingProvider>
    <section className="flex flex-col min-h-screen">
      <Header />
      <div className="pt-20">
        {children}
      </div>
    </section>
    </OnboardingProvider>
  );
}
