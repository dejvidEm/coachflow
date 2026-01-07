import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { SWRConfig } from 'swr';
import { LanguageProvider } from '@/lib/language-context';

export const metadata: Metadata = {
  title: 'CoachFlow — Run Your Coaching',
  description: 'Manage clients, build training and meal plans, and deliver clean PDFs. Coaching, without the chaos.'
};

export const viewport: Viewport = {
  maximumScale: 1
};

const manrope = Manrope({ subsets: ['latin'] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
    >
      <body className="min-h-[100dvh] bg-gray-50">
        <LanguageProvider>
          <SWRConfig
            value={{
              fallback: {
                '/api/user': getUser(),
                '/api/team': getTeamForUser()
              }
            }}
          >
            {children}
          </SWRConfig>
        </LanguageProvider>
      </body>
    </html>
  );
}
