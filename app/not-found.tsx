'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, MapPinned } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-6'>
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
      {/* Decorative Blur */}
      <div className='bg-primary/10 absolute top-20 left-20 h-72 w-72 rounded-full blur-3xl' />
      <div className='bg-secondary/10 absolute right-20 bottom-20 h-72 w-72 rounded-full blur-3xl' />
      <div className='relative mx-auto max-w-2xl text-center'>
        {/* Icon */}
        <div className='bg-primary/10 text-primary mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full'>
          <MapPinned className='h-12 w-12' />
        </div>

        {/* 404 */}
        <h1 className='text-primary text-8xl font-extrabold tracking-tight md:text-9xl'>
          404
        </h1>

        {/* Heading */}
        <h2 className='mt-4 text-3xl font-bold tracking-tight'>
          This Page Is Not Found
        </h2>

        {/* Description */}
        <p className='text-muted-foreground mx-auto mt-4 max-w-lg text-lg'>
          The page you&rsquo;re looking for may have been moved, deleted, or
          never existed. Let&rsquo;s help you get back on track.
        </p>

        {/* Actions */}
        <div className='mt-10 flex flex-col justify-center gap-4 sm:flex-row'>
          <Button asChild size='lg'>
            <Link href='/'>
              <Home />
              Back to Dashboard
            </Link>
          </Button>

          <Button
            variant='outline'
            size='lg'
            onClick={() => window.history.back()}
          >
            <ArrowLeft />
            Go Back
          </Button>
        </div>

        {/* Footer Text */}
        <div className='mt-12 border-t pt-6'>
          <p className='text-muted-foreground text-sm'>
            Lost in the map? Try navigating from the dashboard or contact
            support if the issue persists.
          </p>
        </div>
      </div>
    </div>
  );
}
