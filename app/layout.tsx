import ReduxProvider from '@/components/providers/ReduxProvider';
import NextAuthProvider from '@/components/providers/SessionProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SessionSync } from '@/components/SessionSync';
import { Toaster } from '@/components/ui/sonner';
import { PaymentProvider } from '@/context/PaymentContext';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
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
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <PaymentProvider>
            <NextAuthProvider>
              <SessionSync />
              <ReduxProvider>
                {children}
                <Toaster />
              </ReduxProvider>
            </NextAuthProvider>
          </PaymentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
