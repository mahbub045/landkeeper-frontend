'use client';

import { Button } from '@/components/ui/button';
import { UnderDevelopmentProps } from '@/types/common/UnderDevelopment/UnderDevelopmentTypes';
import {
  ArrowLeft,
  Bell,
  Construction,
  Hammer,
  Sparkles,
  Wrench,
} from 'lucide-react';

const HIGHLIGHTS = [
  { icon: Sparkles, label: 'Thoughtfully designed' },
  { icon: Wrench, label: 'Built and tested' },
  { icon: Bell, label: 'Live soon' },
];

const UnderDevelopment: React.FC<UnderDevelopmentProps> = ({
  title,
  description = "We're putting the finishing touches on this feature. It'll be ready for you soon.",
}) => {
  return (
    // Fill the visible area: viewport − navbar (3.5rem) − footer − page padding
    <div className='flex min-h-[calc(100svh-10rem)] w-full items-center justify-center md:min-h-[calc(100svh-9.5rem)]'>
      <div className='bg-card relative w-full max-w-2xl overflow-hidden rounded-3xl border px-6 py-12 text-center shadow-sm sm:px-12'>
        {/* Background decoration */}
        <div className='bg-primary/15 pointer-events-none absolute -top-24 -left-24 size-72 rounded-full blur-3xl' />
        <div className='pointer-events-none absolute -right-24 -bottom-24 size-72 rounded-full bg-amber-400/15 blur-3xl' />
        <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)] bg-size-[20px_20px] opacity-60' />

        <div className='relative flex flex-col items-center'>
          {/* Icon with glowing rings */}
          <div className='relative mb-8 flex size-28 items-center justify-center'>
            <span className='bg-primary/10 animation-duration-[2.5s] absolute inset-0 animate-ping rounded-full' />
            <span className='bg-primary/10 absolute inset-3 rounded-full' />
            <div className='from-primary relative flex size-16 items-center justify-center rounded-2xl bg-linear-to-br to-amber-500 text-white shadow-lg shadow-amber-500/20'>
              <Construction className='size-8' />
            </div>
            <div className='bg-card absolute -top-1 -right-1 flex size-9 items-center justify-center rounded-xl border shadow-sm'>
              <Hammer className='size-4 text-amber-500' />
            </div>
          </div>

          <span className='mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-amber-600 uppercase dark:text-amber-400'>
            <span className='relative flex size-2'>
              <span className='absolute inline-flex size-full animate-ping rounded-full bg-amber-500 opacity-75' />
              <span className='relative inline-flex size-2 rounded-full bg-amber-500' />
            </span>
            Under development
          </span>

          <h1 className='text-foreground text-2xl font-bold tracking-tight sm:text-3xl'>
            {title ? (
              <>
                <span className='from-primary bg-linear-to-r to-amber-500 bg-clip-text text-transparent'>
                  {title}
                </span>{' '}
                is on its way
              </>
            ) : (
              'Something great is on its way'
            )}
          </h1>

          <p className='text-muted-foreground mt-3 max-w-md text-sm leading-relaxed sm:text-base'>
            {description}
          </p>

          {/* Progress */}
          <div className='mt-8 w-full max-w-sm'>
            <div className='text-muted-foreground mb-2 flex justify-between text-xs font-medium'>
              <span>Building</span>
              <span>Almost there</span>
            </div>
            <div className='bg-muted relative h-2 overflow-hidden rounded-full'>
              <div className='from-primary relative h-full w-3/4 overflow-hidden rounded-full bg-linear-to-r to-amber-500'>
                <span className='animate-shimmer absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-white/40 to-transparent' />
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className='mt-8 grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-3'>
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className='bg-background/60 flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium backdrop-blur-sm sm:flex-col sm:gap-1.5'
              >
                <Icon className='text-primary size-4' />
                <span className='text-muted-foreground'>{label}</span>
              </div>
            ))}
          </div>

          <Button
            variant='outline'
            size='lg'
            className='mt-8 px-4'
            onClick={() => window.history.back()}
          >
            <ArrowLeft />
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnderDevelopment;
