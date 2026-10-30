'use client';

import { CircleCheck, Info, LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';

export const toAmount = (value: number) => formatCurrency(value) || '£0.00';

export function IconBadge({
  icon: Icon,
  className,
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
        className,
      )}
    >
      <Icon className='size-5' />
    </div>
  );
}

export interface MtdStat {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: 'positive' | 'neutral';
}

export function MtdStatCards({ stats }: { stats: MtdStat[] }) {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {stats.map((stat) => (
        <Card key={stat.label} className='border-border rounded-2xl shadow-md'>
          <CardContent className='flex items-start gap-4 px-5 py-4'>
            <IconBadge icon={stat.icon} />
            <div className='min-w-0'>
              <p className='text-foreground text-sm font-semibold'>
                {stat.label}
              </p>
              <p
                className={cn(
                  'mt-1 text-2xl font-bold tabular-nums',
                  stat.tone === 'neutral'
                    ? 'text-foreground'
                    : 'text-emerald-600 dark:text-emerald-400',
                )}
              >
                {stat.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function SectionCard({
  icon,
  title,
  description,
  action,
  children,
  className,
}: {
  icon: LucideIcon;
  title: React.ReactNode;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn('border-border rounded-2xl shadow-md', className)}>
      <CardContent className='space-y-4 px-5 py-4'>
        <div className='flex flex-wrap items-start justify-between gap-3'>
          <div className='flex items-start gap-3'>
            <IconBadge icon={icon} className='size-10' />
            <div>
              <h2 className='text-foreground text-base font-semibold'>
                {title}
              </h2>
              {description && (
                <p className='text-muted-foreground text-xs'>{description}</p>
              )}
            </div>
          </div>
          {action && (
            <div className='flex w-full flex-wrap items-center gap-2 sm:w-auto'>
              {action}
            </div>
          )}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

// Shaded strip of labelled totals shown under tables

export function TableFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className='border-border overflow-hidden rounded-xl border [&_th]:text-xs [&_th]:font-semibold [&_thead]:bg-blue-50/60 dark:[&_thead]:bg-blue-950/20'>
      {children}
    </div>
  );
}

export function HelpfulInfo({
  title = 'Helpful information',
  items,
  footer,
}: {
  title?: string;
  items: React.ReactNode[];
  footer?: React.ReactNode;
}) {
  return (
    <Card className='rounded-2xl border-blue-100 bg-blue-50/40 shadow-md dark:border-blue-900/40 dark:bg-blue-950/20'>
      <CardContent className='space-y-3 px-5 py-4'>
        <div className='flex items-center gap-2'>
          <Info className='size-5 text-blue-600 dark:text-blue-400' />
          <h2 className='text-foreground text-base font-semibold'>{title}</h2>
        </div>
        <ul className='space-y-2.5'>
          {items.map((item, index) => (
            <li
              key={index}
              className='text-muted-foreground flex items-start gap-2 text-xs leading-relaxed'
            >
              <CircleCheck className='mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400' />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        {footer}
      </CardContent>
    </Card>
  );
}
