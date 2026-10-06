'use client';

import AuthPageLeftPanel from '@/components/common/AuthPageLeftPanel/AuthPageLeftPanel';
import AuthPageMobileLogo from '@/components/common/AuthPageMobileLogo/AuthPageMobileLogo';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function PasswordErrorPage() {
  return (
    <div className='flex min-h-screen'>
      <div className='fixed top-4 right-4 z-50'>
        <ThemeToggle />
      </div>

      <AuthPageLeftPanel />

      <div className='flex w-full items-center justify-center bg-white p-8 lg:w-1/2 dark:bg-gray-900'>
        <div className='w-full max-w-md'>
          {/* Mobile logo */}
          <AuthPageMobileLogo />

          {/* Error icon */}
          <div className='mb-6 flex justify-center'>
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950'>
              <AlertTriangle className='h-8 w-8 text-red-500 dark:text-red-400' />
            </div>
          </div>

          {/* Heading */}
          <div className='mb-3 text-center'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-50'>
              Password link expired
            </h2>
          </div>

          {/* Description */}
          <p className='mb-4 text-center text-sm text-gray-500 dark:text-gray-400'>
            This password reset link is invalid or has expired.
            <br />
            Reset links are only valid for 24 hours.
          </p>

          {/* Primary CTA */}
          <Link href='/auth/forgot-password' className='flex justify-center'>
            <Button className='w-fit'>
              <AlertTriangle className='h-4 w-4 shrink-0' />
              <span>Request a new link</span>
            </Button>
          </Link>

          {/* Secondary link */}
          <p className='text-center text-sm text-gray-500 dark:text-gray-400'>
            Remember your password?{' '}
            <Link href='/auth/signin' className='text-primary font-medium'>
              Back to sign in
            </Link>
          </p>

          {/* Footer */}
          <p className='mt-12 text-center text-xs text-gray-400 dark:text-gray-500'>
            © {new Date().getFullYear()} Landkeeper. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
