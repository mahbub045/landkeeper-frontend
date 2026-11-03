'use client';

import AppFooter from '@/components/layout/AppFooter';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { PublicPageShellProps } from '@/types/common/LegalPages/LegalPagesTypes';
import { ArrowLeft, LayoutDashboard, LogIn } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

const PublicPageShell: React.FC<PublicPageShellProps> = ({ children }) => {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <div className='bg-background flex min-h-screen flex-col'>
      <header className='bg-background/80 sticky top-0 z-40 border-b backdrop-blur'>
        <div className='mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 md:px-6'>
          <Link href='/' aria-label='Landkeeper home'>
            <Image
              src='/images/logo-black.png'
              alt='Landkeeper'
              width={400}
              height={150}
              className='h-9 w-auto dark:hidden'
              loading='eager'
            />
            <Image
              src='/images/logo-white.png'
              alt='Landkeeper'
              width={400}
              height={150}
              className='hidden h-9 w-auto dark:block'
              loading='eager'
            />
          </Link>

          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='sm'
              className='hidden sm:inline-flex'
              onClick={() => window.history.back()}
            >
              <ArrowLeft />
              Back
            </Button>
            {status !== 'loading' && (
              <Button asChild size='sm'>
                {isAuthenticated ? (
                  <Link href='/'>
                    <LayoutDashboard />
                    Dashboard
                  </Link>
                ) : (
                  <Link href='/auth/signin'>
                    <LogIn />
                    Sign in
                  </Link>
                )}
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className='mx-auto w-full max-w-5xl flex-1 px-4 py-10 md:px-6 md:py-14'>
        {children}
      </main>

      <AppFooter />
    </div>
  );
};

export default PublicPageShell;
