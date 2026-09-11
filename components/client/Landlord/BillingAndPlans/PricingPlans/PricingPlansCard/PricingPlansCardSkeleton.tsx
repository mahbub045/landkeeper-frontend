import { cn } from '@/lib/utils';

export default function PricingPlansCardSkeleton() {
  return (
    <div className='grid items-start gap-5 lg:grid-cols-3'>
      {[0, 1, 2].map((item) => {
        const isPopular = item === 1;
        return (
          <div
            key={item}
            className={cn(
              'border-border/70 relative flex min-h-140 flex-col overflow-hidden rounded-2xl border bg-white p-6 dark:bg-white/4',
              isPopular && 'lg:-mt-3 lg:min-h-146 lg:p-7',
            )}
          >
            {isPopular && (
              <div className='bg-muted absolute inset-x-0 top-0 h-1 animate-pulse' />
            )}

            {/* icon + eyebrow + title */}
            <div className='flex items-start justify-between gap-4'>
              <div className='w-full'>
                <div className='bg-muted mb-4 size-10 animate-pulse rounded-xl' />
                <div className='bg-muted h-3 w-24 animate-pulse rounded' />
                <div className='bg-muted mt-3 h-7 w-32 animate-pulse rounded' />
              </div>
              {isPopular && (
                <div className='bg-muted h-6 w-24 shrink-0 animate-pulse rounded-full' />
              )}
            </div>

            {/* price */}
            <div className='mt-7 flex items-end gap-2'>
              <div className='bg-muted h-11 w-28 animate-pulse rounded' />
              <div className='bg-muted mb-2 h-4 w-12 animate-pulse rounded' />
            </div>

            {/* stats row */}
            <div className='border-border/70 mt-5 grid grid-cols-2 gap-2 border-y py-4 text-sm'>
              <div>
                <div className='bg-muted h-3 w-20 animate-pulse rounded' />
                <div className='bg-muted mt-2 h-4 w-24 animate-pulse rounded' />
              </div>
              <div>
                <div className='bg-muted h-3 w-20 animate-pulse rounded' />
                <div className='bg-muted mt-2 h-4 w-16 animate-pulse rounded' />
              </div>
            </div>

            {/* features */}
            <div className='mt-5 flex-1'>
              <div className='bg-muted h-4 w-36 animate-pulse rounded' />
              <ul className='mt-3 space-y-3'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <li key={i} className='flex items-center gap-2.5'>
                    <div className='bg-muted size-4 shrink-0 animate-pulse rounded-full' />
                    <div
                      className='bg-muted h-3.5 animate-pulse rounded'
                      style={{ width: `${70 - i * 6}%` }}
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/* button */}
            <div className='bg-muted mt-9 h-11 w-full animate-pulse rounded-md' />
          </div>
        );
      })}
    </div>
  );
}
