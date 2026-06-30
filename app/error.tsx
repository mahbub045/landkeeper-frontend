'use client';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-6'>
      <div className='fixed top-4 right-4 z-50'>
        <ThemeToggle />
      </div>
      {/* Background Pattern */}{' '}
      <div className='absolute inset-0 opacity-5'>
        <div
          className='h-full w-full'
          style={{
            backgroundImage:
              'radial-gradient(circle at 25px 25px, currentColor 2px, transparent 0)',
            backgroundSize: '50px 50px',
          }}
        />{' '}
      </div>
      {/* Decorative Blurs */}
      <div className='bg-destructive/10 absolute top-24 left-24 h-72 w-72 rounded-full blur-3xl' />
      <div className='bg-primary/10 absolute right-24 bottom-24 h-72 w-72 rounded-full blur-3xl' />
      <div className='relative mx-auto max-w-2xl text-center'>
        {/* Error Icon */}
        <div className='bg-destructive/10 text-destructive mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full'>
          <AlertTriangle className='h-12 w-12' />
        </div>

        {/* Error Code */}
        <p className='text-destructive text-lg font-semibold tracking-wide uppercase'>
          Application Error
        </p>

        {/* Heading */}
        <h1 className='mt-3 text-4xl font-bold tracking-tight md:text-5xl'>
          Something went wrong
        </h1>

        {/* Description */}
        <p className='text-muted-foreground mx-auto mt-4 max-w-xl text-lg'>
          We encountered an unexpected problem while processing your request.
          Our team has been notified and is working to resolve the issue.
        </p>

        {/* Actions */}
        <div className='mt-10 flex flex-col justify-center gap-4 sm:flex-row'>
          <Button size='lg' onClick={() => reset()}>
            <RefreshCw />
            Try Again
          </Button>

          <Button variant='outline' size='lg' asChild>
            <Link href='/'>
              <Home />
              Go to Dashboard
            </Link>
          </Button>
        </div>

        {/* Support Message */}
        <div className='bg-card mt-12 rounded-xl border p-4 text-left'>
          <p className='font-medium'>Need help?</p>
          <p className='text-muted-foreground mt-1 text-sm'>
            If this problem continues, contact support and include the time the
            error occurred along with the actions you were performing.
          </p>
        </div>

        {/* Error Digest (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className='bg-muted mt-6 overflow-auto rounded-lg p-4 text-left text-sm'>
            <p className='font-semibold'>Debug Information</p>
            <p className='mt-2 break-all text-red-500'>{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
