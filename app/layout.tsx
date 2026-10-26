import ReduxProvider from '@/components/providers/ReduxProvider';
import NextAuthProvider from '@/components/providers/SessionProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import SessionExpiryHandler from '@/components/SessionExpiryHandler';
import { SessionSync } from '@/components/SessionSync';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Landkeeper',
  description: 'Property Management Portal',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className='flex min-h-full flex-col'>
        {/* beforeInteractive scripts are still injected into <head> by Next */}
        <Script
          src='https://cdn.affonso.io/js/pixel.min.js'
          data-affonso={process.env.NEXT_PUBLIC_AFFONSO_PROGRAM_ID}
          data-cookie-duration={process.env.NEXT_PUBLIC_AFFONSO_COOKIE_DURATION}
          strategy='beforeInteractive'
        />
        <NextTopLoader color='var(--primary)' height={5} showSpinner={false} />
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <NextAuthProvider>
            <SessionSync />
            <SessionExpiryHandler />
            <ReduxProvider>
              {children}
              <Toaster />
            </ReduxProvider>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
