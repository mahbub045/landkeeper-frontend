import { cn } from '@/lib/utils';
import {
  PricingPlansSkeletonBarProps,
  PricingPlansCardSkeletonProps,
  PricingPlansSkeletonHeaderProps,
} from '@/types/common/PricingPlans/PricingPlansType';

const FEATURE_ROWS = 10;
const nameWidths = ['55%', '40%', '62%', '48%', '70%', '44%', '58%', '36%'];

const Bar = ({ className, ...props }: PricingPlansSkeletonBarProps) => (
  <div className={cn('bg-muted animate-pulse rounded', className)} {...props} />
);

// The plan header block: eyebrow, name, price.
const HeaderBlock = ({ isPopular }: PricingPlansSkeletonHeaderProps) => (
  <div
    className={cn(
      'relative flex flex-col items-center rounded-t-2xl px-4 pt-6 pb-5',
      isPopular
        ? 'bg-violet-100 dark:bg-violet-400/10'
        : 'bg-muted/60 dark:bg-white/4',
    )}
  >
    {isPopular && (
      <Bar className='absolute -top-3 h-6 w-24 rounded-full bg-violet-200 dark:bg-violet-400/20' />
    )}
    <Bar className='h-2.5 w-24' />
    <Bar className='mt-2.5 h-6 w-28' />
    <Bar className='mt-3 h-8 w-32' />
  </div>
);

// The Properties / Users card.
const LimitsBlock = () => (
  <div className='border-border/70 divide-border/70 divide-y rounded-xl border'>
    {[0, 1].map((row) => (
      <div
        key={row}
        className='flex items-center justify-between gap-3 px-3 py-2'
      >
        <div className='flex items-center gap-2.5'>
          <Bar className='size-8 rounded-lg' />
          <Bar className='h-3.5 w-16' />
        </div>
        <Bar className='h-4 w-12' />
      </div>
    ))}
  </div>
);

export default function PricingPlansCardSkeleton({
  withActions = true,
}: PricingPlansCardSkeletonProps) {
  return (
    <>
      {/* Mobile / tablet: tabs + one plan */}
      <div className='mx-auto w-full max-w-2xl lg:hidden'>
        <div className='bg-muted/70 flex gap-1 rounded-xl p-1'>
          {[0, 1, 2].map((tab) => (
            <div
              key={tab}
              className={cn(
                'flex flex-1 flex-col items-center gap-1.5 rounded-lg py-2',
                tab === 1 && 'bg-background shadow-sm',
              )}
            >
              <Bar className='h-3.5 w-16' />
              <Bar className='h-2.5 w-10' />
            </div>
          ))}
        </div>

        <div className='pt-5'>
          <HeaderBlock isPopular />
          <div className='rounded-b-2xl border-x border-b border-violet-200 px-4 pt-4 pb-5 dark:border-violet-400/20'>
            <LimitsBlock />
            <ul className='divide-border/60 mt-4 divide-y'>
              {Array.from({ length: FEATURE_ROWS }).map((_, i) => (
                <li
                  key={i}
                  className='flex items-center justify-between gap-4 py-3.5'
                >
                  <Bar
                    className='h-3.5'
                    style={{ width: nameWidths[i % nameWidths.length] }}
                  />
                  <Bar className='size-5 shrink-0 rounded-full' />
                </li>
              ))}
            </ul>
            {withActions && <Bar className='mt-4 h-10 w-full rounded-md' />}
          </div>
        </div>
      </div>

      {/* Desktop: comparison table */}
      <div className='bg-card/80 hidden rounded-3xl border p-5 pt-9 shadow-sm lg:block'>
        <div className='grid grid-cols-[28%_1fr_1fr_1fr] gap-x-3'>
          <div className='flex flex-col justify-end px-3 pb-4'>
            <Bar className='h-2.5 w-28' />
            <Bar className='mt-2.5 h-5 w-24' />
          </div>
          {[0, 1, 2].map((col) => (
            <HeaderBlock key={col} isPopular={col === 1} />
          ))}

          <div />
          {[0, 1, 2].map((col) => (
            <div
              key={col}
              className={cn(
                'border-x px-3 pt-3 pb-4',
                col === 1 &&
                  'border-violet-200 bg-violet-50/50 dark:border-violet-400/20 dark:bg-violet-400/5',
              )}
            >
              <LimitsBlock />
            </div>
          ))}

          {Array.from({ length: FEATURE_ROWS }).flatMap((_, i) => [
            <div
              key={`name-${i}`}
              className='border-border/60 flex items-center border-t px-3 py-3.5'
            >
              <Bar
                className='h-3.5'
                style={{ width: nameWidths[i % nameWidths.length] }}
              />
            </div>,
            ...[0, 1, 2].map((col) => (
              <div
                key={`cell-${i}-${col}`}
                className={cn(
                  'border-t-border/60 flex items-center justify-center border-x border-t py-3.5',
                  col === 1 &&
                    'border-x-violet-200 bg-violet-50/50 dark:border-x-violet-400/20 dark:bg-violet-400/5',
                )}
              >
                <Bar className='size-5 rounded-full' />
              </div>
            )),
          ])}

          <div />
          {[0, 1, 2].map((col) => (
            <div
              key={col}
              className={cn(
                'border-t-border/60 rounded-b-2xl border-x border-t border-b px-4 pt-4 pb-5',
                col === 1 &&
                  'border-x-violet-200 border-b-violet-200 bg-violet-50/50 dark:border-x-violet-400/20 dark:border-b-violet-400/20 dark:bg-violet-400/5',
              )}
            >
              {withActions && <Bar className='h-10 w-full rounded-md' />}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
