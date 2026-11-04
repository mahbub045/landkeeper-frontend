'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DetailsPageHeaderProps } from '@/types/common/DetailsPage/DetailsPageTypes';
import { ArrowLeft } from 'lucide-react';

const DetailsPageHeader: React.FC<DetailsPageHeaderProps> = ({
  eyebrow,
  title,
  description,
  meta,
  actions,
  tone = 'default',
  showBack = true,
  className,
}) => {
  return (
    <header
      className={cn(
        'bg-card relative overflow-hidden rounded-2xl border shadow-xs',
        tone === 'danger' && 'border-rose-200 dark:border-rose-900',
        className,
      )}
    >
      <div
        className={cn(
          'pointer-events-none absolute inset-0 bg-linear-to-br via-transparent to-transparent',
          tone === 'danger' ? 'from-rose-500/10' : 'from-primary/10',
        )}
      />
      <div className='relative flex flex-col gap-4 p-5 sm:p-6 md:flex-row md:items-start md:justify-between'>
        <div className='flex min-w-0 items-start gap-3 sm:gap-4'>
          {showBack && (
            <Button
              variant='outline'
              size='icon'
              onClick={() => window.history.back()}
              className='bg-background/80 shrink-0 rounded-full'
              aria-label='Go back'
              title='Go back'
            >
              <ArrowLeft className='size-4' />
            </Button>
          )}
          <div className='min-w-0 space-y-1.5'>
            {eyebrow && (
              <p className='text-primary text-xs font-semibold tracking-widest uppercase'>
                {eyebrow}
              </p>
            )}
            <h1 className='text-foreground text-xl leading-tight font-bold tracking-tight wrap-break-word sm:text-2xl'>
              {title}
            </h1>
            {description && (
              <div className='text-muted-foreground text-sm'>{description}</div>
            )}
            {meta && (
              <div className='flex flex-wrap items-center gap-2 pt-1'>
                {meta}
              </div>
            )}
          </div>
        </div>
        {actions && (
          <div className='flex shrink-0 flex-wrap gap-2 md:justify-end'>
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};

export default DetailsPageHeader;
