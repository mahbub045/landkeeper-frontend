'use client';

import {
  getCertStatus,
  getCertStatusTone,
  getDaysUntilExpiry,
} from '@/data/client/Common/Compliance/ComplianceData';
import { ComplianceExpiryTimelineProps } from '@/types/client/Common/Compliance/ComplianceTypes';
import { formatDate } from '@/utils/formatters';
import { CalendarCheck, CalendarX } from 'lucide-react';

const DAY_MS = 1000 * 60 * 60 * 24;
// Matches the "Expiring Soon" threshold in getCertStatus
const EXPIRING_SOON_DAYS = 30;

const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

// Keeps the "Today" label inside the card near either end of the bar
const getMarkerAlignment = (percent: number) => {
  if (percent < 8) return 'items-start';
  if (percent > 92) return '-translate-x-full items-end';
  return '-translate-x-1/2 items-center';
};

// Centres the dot on the line (the line sits on the column's edge at either end)
const getDotOffset = (percent: number) => {
  if (percent < 8) return '-ml-[5.5px]';
  if (percent > 92) return '-mr-[5.5px]';
  return '';
};

const pluralizeDays = (days: number) => `${days} day${days === 1 ? '' : 's'}`;

const ComplianceExpiryTimeline: React.FC<ComplianceExpiryTimelineProps> = ({
  issueDate,
  expiryDate,
}) => {
  const issueTime = new Date(issueDate).getTime();
  const expiryTime = new Date(expiryDate).getTime();

  if (Number.isNaN(issueTime) || Number.isNaN(expiryTime)) {
    return (
      <section className='rounded-xl border p-5 sm:p-6'>
        <h2 className='mb-3 text-sm font-semibold'>Validity Timeline</h2>
        <p className='text-muted-foreground text-sm'>
          Issue or expiry date is not available.
        </p>
      </section>
    );
  }

  const status = getCertStatus(expiryDate);
  const totalDays = Math.max(1, Math.round((expiryTime - issueTime) / DAY_MS));
  const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
  const tone = getCertStatusTone(expiryDate);
  const daysElapsed = Math.max(0, totalDays - daysUntilExpiry);
  const elapsedPercent = clampPercent((daysElapsed / totalDays) * 100);
  const warningPercent = clampPercent((EXPIRING_SOON_DAYS / totalDays) * 100);
  const showWarningWindow = totalDays > EXPIRING_SOON_DAYS;
  const isExpired = daysUntilExpiry < 0;

  const stats = [
    { label: 'Validity period', value: pluralizeDays(totalDays) },
    {
      label: 'Elapsed',
      value: `${pluralizeDays(Math.min(daysElapsed, totalDays))} (${Math.round(elapsedPercent)}%)`,
    },
    isExpired
      ? {
          label: 'Overdue by',
          value: pluralizeDays(Math.abs(daysUntilExpiry)),
          className: tone.text,
        }
      : {
          label: 'Remaining',
          value: pluralizeDays(daysUntilExpiry),
          className: tone.text,
        },
  ];

  return (
    <section className='rounded-xl border p-5 sm:p-6'>
      <div className='mb-6 flex items-center justify-between gap-2'>
        <h2 className='text-sm font-semibold'>Validity Timeline</h2>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone.color}`}
        >
          <span className={`size-1.5 rounded-full ${tone.dot}`} />
          {status}
        </span>
      </div>

      {/* Bar */}
      <div className='relative pt-8'>
        <div className='relative h-2 w-full overflow-hidden rounded-full bg-blue-100 dark:bg-blue-900/30'>
          {/* Valid window — the track's expiring-soon tint shows through for the
              last EXPIRING_SOON_DAYS, or the whole bar when the validity
              period is shorter than that window */}
          {showWarningWindow && (
            <div
              className='bg-success/25 absolute inset-y-0 left-0'
              style={{ width: `${100 - warningPercent}%` }}
            />
          )}
          <div
            className='absolute inset-y-0 right-0'
            style={{ width: showWarningWindow ? `${warningPercent}%` : '100%' }}
            title={`Expiring soon window (last ${EXPIRING_SOON_DAYS} days)`}
          />
          {/* Elapsed */}
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all ${tone.dot}`}
            style={{ width: `${elapsedPercent}%` }}
          />
        </div>

        {/* Today marker */}
        <div
          className={`absolute inset-y-0 flex flex-col ${getMarkerAlignment(elapsedPercent)}`}
          style={{ left: `${elapsedPercent}%` }}
        >
          <span className='bg-foreground text-background rounded px-1.5 py-0.5 text-[10px] leading-none font-medium whitespace-nowrap'>
            Today
          </span>
          <span className='bg-foreground w-px flex-1' />
          {/* Sits centred on the 8px bar: 12px dot, 2px below its bottom */}
          <span
            className={`border-background -mb-0.5 size-3 shrink-0 rounded-full border-2 shadow-sm ${tone.dot} ${getDotOffset(elapsedPercent)}`}
          />
        </div>
      </div>

      {/* Endpoints */}
      <div className='mt-3 flex items-start justify-between gap-4'>
        <div className='flex items-start gap-2'>
          <CalendarCheck className='text-success mt-0.5 size-4 shrink-0' />
          <div>
            <p className='text-muted-foreground text-xs'>Issued</p>
            <p className='text-sm font-medium'>{formatDate(issueDate)}</p>
          </div>
        </div>
        <div className='flex items-start gap-2 text-right'>
          <div>
            <p className='text-muted-foreground text-xs'>
              {isExpired ? 'Expired' : 'Expires'}
            </p>
            <p className='text-sm font-medium'>{formatDate(expiryDate)}</p>
          </div>
          <CalendarX className='mt-0.5 size-4 shrink-0 text-red-500' />
        </div>
      </div>

      {/* Stats */}
      <dl className='mt-5 grid grid-cols-1 gap-3 border-t pt-4 sm:grid-cols-3'>
        {stats.map(({ label, value, className }) => (
          <div key={label}>
            <dt className='text-muted-foreground text-xs'>{label}</dt>
            <dd className={`text-sm font-semibold ${className ?? ''}`}>
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default ComplianceExpiryTimeline;
