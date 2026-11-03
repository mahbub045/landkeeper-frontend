'use client';

import AppFooter from '@/components/layout/AppFooter';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { FOOTER_LINKS } from '@/data/common/LegalPages/LegalPagesData';
import { cn } from '@/lib/utils';
import { PublicPageShellProps } from '@/types/common/LegalPages/LegalPagesTypes';
import { LayoutDashboard, LogIn } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PublicPageShell: React.FC<PublicPageShellProps> = ({ children }) => {
  const { status } = useSession();
  const pathname = usePathname();
  const isAuthenticated = status === 'authenticated';

  return (
    <div className='bg-background flex min-h-screen flex-col'>
      <header className='bg-background/80 sticky top-0 z-40 border-b backdrop-blur'>
        <div className='flex h-16 items-center justify-between gap-4 px-4 md:px-6'>
          <Link href='/' aria-label='Landkeeper home' className='shrink-0'>
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

          {/* Page navigation */}
          <nav className='bg-muted/60 hidden items-center gap-1 rounded-full border p-1 md:flex'>
            {FOOTER_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className='flex items-center gap-2'>
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

      <main className='w-full flex-1'>{children}</main>

      <AppFooter />
    </div>
  );
};

export default PublicPageShell;
