'use client';

import {
  ChevronRight,
  CircleCheck,
  Info,
  LucideIcon,
  Pencil,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
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
  trend?: number;
  caption?: string;
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
              {stat.trend != null ? (
                <p className='text-muted-foreground mt-1 text-xs'>
                  <span className='font-semibold text-emerald-600 dark:text-emerald-400'>
                    ▲ {stat.trend}%
                  </span>{' '}
                  vs previous quarter
                </p>
              ) : (
                stat.caption && (
                  <p className='text-muted-foreground mt-1 text-xs'>
                    {stat.caption}
                  </p>
                )
              )}
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
            <div className='flex flex-wrap items-center gap-2'>{action}</div>
          )}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

// Shaded strip of labelled totals shown under tables
export function TotalsBar({
  icon: Icon,
  title,
  description,
  items,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  items: { label: string; value: string; highlight?: boolean }[];
}) {
  return (
    <div className='flex flex-col gap-4 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 md:flex-row md:items-center md:justify-between dark:border-blue-900/40 dark:bg-blue-950/20'>
      <div className='flex items-start gap-3'>
        <Icon className='mt-0.5 size-5 shrink-0 text-blue-600 dark:text-blue-400' />
        <div>
          <p className='text-foreground text-sm font-semibold'>{title}</p>
          {description && (
            <p className='text-muted-foreground text-xs'>{description}</p>
          )}
        </div>
      </div>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-8'>
        {items.map((item) => (
          <div key={item.label}>
            <p
              className={cn(
                'text-base font-bold tabular-nums',
                item.highlight
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-foreground',
              )}
            >
              {item.value}
            </p>
            <p className='text-muted-foreground text-xs'>{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className='border-border overflow-hidden rounded-xl border [&_th]:text-xs [&_th]:font-semibold [&_thead]:bg-blue-50/60 dark:[&_thead]:bg-blue-950/20'>
      {children}
    </div>
  );
}

export function RowActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className='flex items-center gap-1.5'>
      <Button
        variant='ghost'
        size='icon-sm'
        aria-label='Edit'
        onClick={onEdit}
        className='bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400'
      >
        <Pencil />
      </Button>
      <Button
        variant='ghost'
        size='icon-sm'
        aria-label='Delete'
        onClick={onDelete}
        className='bg-blue-50 text-blue-600 hover:bg-red-100 hover:text-red-600 dark:bg-blue-950/30 dark:text-blue-400'
      >
        <Trash2 />
      </Button>
    </div>
  );
}

export function InfoNote({ children }: { children: React.ReactNode }) {
  return (
    <div className='text-muted-foreground flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-xs dark:border-blue-900/40 dark:bg-blue-950/20'>
      <Info className='mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400' />
      <p>{children}</p>
    </div>
  );
}

export interface QuickAction {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}

export function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <Card className='border-border rounded-2xl shadow-md'>
      <CardContent className='px-5 py-4'>
        <h2 className='text-foreground mb-2 text-base font-semibold'>
          Quick actions
        </h2>
        <div className='divide-border divide-y'>
          {actions.map((action) => (
            <button
              key={action.title}
              type='button'
              onClick={action.onClick}
              className='hover:bg-accent/50 group flex w-full cursor-pointer items-center gap-3 rounded-lg px-1 py-3 text-left transition-colors'
            >
              <IconBadge icon={action.icon} className='size-9' />
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium text-blue-700 dark:text-blue-400'>
                  {action.title}
                </p>
                <p className='text-muted-foreground text-xs'>
                  {action.description}
                </p>
              </div>
              <ChevronRight className='text-muted-foreground size-4 opacity-0 transition-opacity group-hover:opacity-100' />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
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
