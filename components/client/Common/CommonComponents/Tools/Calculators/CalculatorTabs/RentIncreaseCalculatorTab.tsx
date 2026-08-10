'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { RentIncreaseFrequency } from '@/types/client/Common/Tools/Calculators/CalculatorsTypes';
import { getCurrencySign } from '@/utils/formatters';
import {
  Calculator,
  PoundSterling,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

// ---------- Date helpers ----------
const parseDateInput = (value: string): Date | null => {
  if (!value) return null;
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? null : date;
};

// Adds calendar months, clamping to the last valid day of the target month
// (e.g. 31 Jan + 1 month -> 28/29 Feb, not 3 Mar).
const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDayOfTargetMonth = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0,
  ).getDate();
  result.setDate(Math.min(date.getDate(), lastDayOfTargetMonth));
  return result;
};

const formatDateLong = (date: Date): string =>
  date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const toDateInputValue = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const todayInputValue = toDateInputValue(new Date());

// ---------- Component ----------

const RentIncreaseCalculatorTab: React.FC = () => {
  const [currentRent, setCurrentRent] = useState('');
  const [proposedRent, setProposedRent] = useState('');
  const [frequency, setFrequency] = useState<RentIncreaseFrequency>('month');
  const [tenancyStartDate, setTenancyStartDate] = useState('');
  const [neverIncreased, setNeverIncreased] = useState(true);
  const [lastIncreaseDate, setLastIncreaseDate] = useState('');
  const [noticeServedDate, setNoticeServedDate] = useState(todayInputValue);
  const [desiredStartDate, setDesiredStartDate] = useState('');

  const result = useMemo(() => {
    const notice = parseDateInput(noticeServedDate) ?? new Date();
    const twoMonthsAfterNotice = addMonths(notice, 2);

    let twelveMonthConstraint: Date | null = null;
    let twelveMonthReason: string | null = null;

    if (neverIncreased) {
      const tenancyStart = parseDateInput(tenancyStartDate);
      if (tenancyStart) {
        twelveMonthConstraint = addMonths(tenancyStart, 12);
        twelveMonthReason = 'Set by the 12-month new-tenancy rule.';
      }
    } else {
      const lastIncrease = parseDateInput(lastIncreaseDate);
      if (lastIncrease) {
        twelveMonthConstraint = addMonths(lastIncrease, 12);
        twelveMonthReason =
          'Set by the 12-month rule since rent was last increased.';
      }
    }

    let earliestDate = twoMonthsAfterNotice;
    let reason = "Set by the two months' notice rule.";

    if (twelveMonthConstraint && twelveMonthConstraint > twoMonthsAfterNotice) {
      earliestDate = twelveMonthConstraint;
      reason = twelveMonthReason as string;
    }

    const current = parseFloat(currentRent) || 0;
    const proposed = parseFloat(proposedRent) || 0;
    const increasePct =
      current > 0 ? ((proposed - current) / current) * 100 : 0;

    let desiredDateVerdict: { lawful: boolean; date: Date } | null = null;
    const desired = parseDateInput(desiredStartDate);
    if (desired) {
      desiredDateVerdict = { lawful: desired >= earliestDate, date: desired };
    }

    return {
      earliestDate,
      reason,
      current,
      proposed,
      increasePct,
      desiredDateVerdict,
    };
  }, [
    currentRent,
    proposedRent,
    tenancyStartDate,
    neverIncreased,
    lastIncreaseDate,
    noticeServedDate,
    desiredStartDate,
  ]);

  const freqLabel = frequency === 'week' ? 'per week' : 'per month';

  return (
    <div className='overflow-hidden rounded-xl border'>
      {/* Header */}
      <div className='from-primary to-secondary flex items-center gap-3 bg-linear-to-r px-6 py-5 text-white'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20'>
          <Calculator className='h-5 w-5' />
        </div>
        <div>
          <h2 className='text-lg leading-tight font-semibold'>
            Rent Increase Calculator
          </h2>
          <p className='text-sm text-white/80'>
            Section 13 timing checker for England
          </p>
        </div>
      </div>

      <div className='bg-card grid gap-0 lg:grid-cols-2'>
        {/* Left column - inputs */}
        <div className='space-y-5 p-6'>
          <div className='grid grid-cols-[1fr_auto] gap-4'>
            <div className='space-y-1.5'>
              <Label htmlFor='currentRent'>Current rent</Label>
              <div className='relative'>
                <span className='text-muted-foreground pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm'>
                  {getCurrencySign()}
                </span>
                <Input
                  id='currentRent'
                  type='text'
                  inputMode='decimal'
                  value={currentRent}
                  onChange={(e) =>
                    setCurrentRent(e.target.value.replace(/[^0-9.]/g, ''))
                  }
                  className='pl-6!'
                />
              </div>
            </div>

            <div className='space-y-1.5'>
              <Label>Frequency</Label>
              <div className='bg-muted flex rounded-full p-1'>
                <button
                  type='button'
                  onClick={() => setFrequency('week')}
                  className={cn(
                    'cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                    frequency === 'week'
                      ? 'bg-primary text-white'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  Per week
                </button>
                <button
                  type='button'
                  onClick={() => setFrequency('month')}
                  className={cn(
                    'cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                    frequency === 'month'
                      ? 'bg-primary text-white'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  Per month
                </button>
              </div>
            </div>
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='proposedRent'>Proposed new rent</Label>
            <div className='relative'>
              <span className='text-muted-foreground pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm'>
                {getCurrencySign()}
              </span>
              <Input
                id='proposedRent'
                type='text'
                inputMode='decimal'
                value={proposedRent}
                onChange={(e) =>
                  setProposedRent(e.target.value.replace(/[^0-9.]/g, ''))
                }
                className='pl-6!'
              />
            </div>
            <p className='text-muted-foreground text-xs'>
              Same frequency as current rent ({freqLabel}).
            </p>
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='tenancyStartDate'>Tenancy start date</Label>
            <Input
              id='tenancyStartDate'
              type='date'
              value={tenancyStartDate}
              onChange={(e) => setTenancyStartDate(e.target.value)}
            />
            <p className='text-muted-foreground text-xs'>
              Rent cannot be increased in the first 12 months of the tenancy.
            </p>
          </div>

          <div className='flex items-center gap-3'>
            <Switch
              checked={neverIncreased}
              onCheckedChange={setNeverIncreased}
            />
            <Label className='cursor-pointer font-normal'>
              The rent has never been increased
            </Label>
          </div>

          {!neverIncreased && (
            <div className='space-y-1.5'>
              <Label htmlFor='lastIncreaseDate'>
                Date rent was last increased
              </Label>
              <Input
                id='lastIncreaseDate'
                type='date'
                value={lastIncreaseDate}
                onChange={(e) => setLastIncreaseDate(e.target.value)}
              />
              <p className='text-muted-foreground text-xs'>
                Rent can be increased at most once in any 12-month period.
              </p>
            </div>
          )}

          <div className='space-y-1.5'>
            <Label htmlFor='noticeServedDate'>Date the notice is served</Label>
            <Input
              id='noticeServedDate'
              type='date'
              value={noticeServedDate}
              onChange={(e) => setNoticeServedDate(e.target.value)}
            />
            <p className='text-muted-foreground text-xs'>
              Defaults to today. At least two months&apos; notice is required.
            </p>
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='desiredStartDate'>
              Date you want the increase to start (optional)
            </Label>
            <Input
              id='desiredStartDate'
              type='date'
              value={desiredStartDate}
              onChange={(e) => setDesiredStartDate(e.target.value)}
            />
            <p className='text-muted-foreground text-xs'>
              We will check whether this date is lawful.
            </p>
            {result.desiredDateVerdict && (
              <p
                className={cn(
                  'text-xs font-medium',
                  result.desiredDateVerdict.lawful
                    ? 'text-emerald-600'
                    : 'text-amber-600',
                )}
              >
                {result.desiredDateVerdict.lawful
                  ? 'This date is lawful.'
                  : `Too early — the earliest lawful date is ${formatDateLong(result.earliestDate)}.`}
              </p>
            )}
          </div>
        </div>

        {/* Right column - results */}
        <div className='bg-muted/30 space-y-5 border-t p-6 lg:border-t-0 lg:border-l'>
          <div className='text-center'>
            <p className='text-muted-foreground text-xs font-semibold tracking-wide uppercase'>
              Earliest lawful effective date
            </p>
            <p className='text-primary mt-1 font-serif text-3xl font-bold'>
              {formatDateLong(result.earliestDate)}
            </p>
            <p className='text-muted-foreground mt-1 text-sm'>
              {result.reason}
            </p>
          </div>

          <div className='border-primary bg-primary/10 text-primary flex items-start gap-2 rounded-lg border p-4 text-sm'>
            <ShieldCheck className='mt-0.5 h-4 w-4 shrink-0' />
            <p>
              A Section 13 notice must give at least two months before the new
              rent takes effect, so the earliest effective date is two months
              after the notice is served.
            </p>
          </div>

          <div className='divide-y rounded-lg border'>
            <div className='flex items-center justify-between px-4 py-3'>
              <span className='text-muted-foreground text-sm'>
                Current rent
              </span>
              <span className='font-semibold'>
                {getCurrencySign()}
                {result.current.toLocaleString('en-GB')} {freqLabel}
              </span>
            </div>
            <div className='flex items-center justify-between px-4 py-3'>
              <span className='text-muted-foreground text-sm'>
                Proposed rent
              </span>
              <span className='font-semibold'>
                {getCurrencySign()}
                {result.proposed.toLocaleString('en-GB')} {freqLabel}
              </span>
            </div>
            <div className='flex items-center justify-between px-4 py-3'>
              <span className='text-muted-foreground text-sm'>Increase</span>
              <span className='text-primary font-semibold'>
                {result.increasePct >= 0 ? '+' : ''}
                {result.increasePct.toFixed(1)}%
              </span>
            </div>
          </div>

          <ul className='text-muted-foreground space-y-3 text-sm'>
            <li className='flex gap-2'>
              <PoundSterling className='text-primary mt-0.5 h-3.5 w-3.5 shrink-0' />
              <span>
                In England, rent on an assured periodic tenancy can only be
                increased by serving a Section 13 notice on the prescribed form,
                Form 4A. See{' '}
                <a
                  href='https://www.gov.uk/private-renting/rent-increases'
                  target='_blank'
                  rel='noreferrer'
                  className='text-primary underline underline-offset-2'
                >
                  the government&apos;s guidance on rent increases
                </a>
                .
              </span>
            </li>
            <li className='flex gap-2'>
              <PoundSterling className='text-primary mt-0.5 h-3.5 w-3.5 shrink-0' />
              <span>
                Rent review clauses in a tenancy agreement are not a valid way
                to raise rent. A Section 13 notice is the only route.
              </span>
            </li>
            <li className='flex gap-2'>
              <PoundSterling className='text-primary mt-0.5 h-3.5 w-3.5 shrink-0' />
              <span>
                Before the effective date, the tenant can refer the proposed
                rent to the First-tier Tribunal. The tribunal can confirm or
                lower the rent but cannot set it higher than you proposed.
              </span>
            </li>
          </ul>

          <div className='flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900'>
            <TriangleAlert className='mt-0.5 h-4 w-4 shrink-0' />
            <p>
              <strong>
                This tool provides general information only and is not legal or
                financial advice.
              </strong>{' '}
              Rules can change and individual circumstances vary. Check the
              current government guidance or seek professional advice before
              acting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentIncreaseCalculatorTab;
