'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { getCurrencySign } from '@/utils/formatters';
import { ChevronDown, Home, PoundSterling, TriangleAlert } from 'lucide-react';
import React, { useMemo, useState } from 'react';

const MIN_PROPERTY_VALUE = 25000;

// ---------- Component ----------

const RentalYieldCalculatorTab: React.FC = () => {
  const [propertyValue, setPropertyValue] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [monthlyMortgage, setMonthlyMortgage] = useState('');
  const [monthlyCosts, setMonthlyCosts] = useState('');
  const [showCostsInfo, setShowCostsInfo] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  const result = useMemo(() => {
    const value = parseFloat(propertyValue) || 0;
    const rent = parseFloat(monthlyRent) || 0;
    const mortgage = parseFloat(monthlyMortgage) || 0;
    const costs = parseFloat(monthlyCosts) || 0;

    const annualRent = rent * 12;
    const annualMortgage = mortgage * 12;
    const annualCosts = costs * 12;

    const netAnnualReturn = annualRent - annualCosts - annualMortgage;

    const grossYield = value > 0 ? (annualRent / value) * 100 : 0;
    const netYield = value > 0 ? (netAnnualReturn / value) * 100 : 0;

    return {
      grossYield,
      netYield,
      netAnnualReturn,
    };
  }, [propertyValue, monthlyRent, monthlyMortgage, monthlyCosts]);

  const propertyValueError = useMemo(() => {
    if (!propertyValue) return undefined;
    const value = parseFloat(propertyValue);
    if (value < MIN_PROPERTY_VALUE) {
      return `The min value is ${getCurrencySign()}${MIN_PROPERTY_VALUE.toLocaleString('en-GB')}`;
    }
    return undefined;
  }, [propertyValue]);

  const currencyInput = (
    id: string,
    value: string,
    onChange: (v: string) => void,
    error?: string,
  ) => (
    <div className='space-y-1.5'>
      <div className='relative'>
        <span
          className={cn(
            'pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm',
            error ? 'text-destructive' : 'text-muted-foreground',
          )}
        >
          {getCurrencySign()}
        </span>
        <Input
          id={id}
          type='text'
          inputMode='decimal'
          placeholder='0'
          value={value}
          onChange={(e) => {
            onChange(e.target.value.replace(/[^0-9.]/g, ''));
            setHasCalculated(false);
          }}
          className={cn(
            'pl-6!',
            error && 'border-destructive focus-visible:ring-destructive/40',
          )}
        />
      </div>
      {error && (
        <p className='text-destructive flex items-center gap-1.5 text-sm'>
          <TriangleAlert className='h-3.5 w-3.5 shrink-0' />
          {error}
        </p>
      )}
    </div>
  );

  return (
    <div className='overflow-hidden rounded-xl border'>
      {/* Header */}
      <div className='from-primary to-secondary flex items-center gap-3 bg-linear-to-r px-6 py-5 text-white'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20'>
          <Home className='h-5 w-5' />
        </div>
        <div>
          <h2 className='text-lg leading-tight font-semibold'>
            Rental Yield Calculator
          </h2>
          <p className='text-sm text-white/80'>
            Work out how much money your rental property could bring in each
            year.
          </p>
        </div>
      </div>

      <div className='bg-card grid gap-0 lg:grid-cols-2'>
        {/* Left column - inputs */}
        <div className='space-y-5 p-6'>
          <div className='space-y-1.5'>
            <Label htmlFor='propertyValue'>Current value of property</Label>
            {currencyInput(
              'propertyValue',
              propertyValue,
              setPropertyValue,
              propertyValueError,
            )}
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='monthlyRent'>Monthly rent</Label>
            {currencyInput('monthlyRent', monthlyRent, setMonthlyRent)}
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='monthlyMortgage'>
              Monthly mortgage payments (optional)
            </Label>
            {currencyInput(
              'monthlyMortgage',
              monthlyMortgage,
              setMonthlyMortgage,
            )}
          </div>

          <div className='space-y-1.5'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='monthlyCosts'>Monthly costs (optional)</Label>
              <button
                type='button'
                onClick={() => setShowCostsInfo((prev) => !prev)}
                className='text-primary flex cursor-pointer items-center gap-1 text-xs font-medium underline underline-offset-2'
              >
                What does this include?
                <ChevronDown
                  className={cn(
                    'h-3 w-3 transition-transform',
                    showCostsInfo && 'rotate-180',
                  )}
                />
              </button>
            </div>
            {showCostsInfo && (
              <p className='text-muted-foreground bg-muted rounded-md p-3 text-xs'>
                This covers costs like building insurance, boiler insurance,
                property maintenance, agent management fees, etc.
              </p>
            )}
            {currencyInput('monthlyCosts', monthlyCosts, setMonthlyCosts)}
          </div>

          <Button
            type='button'
            size='lg'
            onClick={() => setHasCalculated(true)}
            disabled={!propertyValue || !monthlyRent}
            className='w-full cursor-pointer'
          >
            Calculate rental yield
          </Button>
        </div>

        {/* Right column - results */}
        <div className='bg-muted/30 space-y-5 border-t p-6 lg:border-t-0 lg:border-l'>
          <div>
            <p className='text-muted-foreground text-xs font-semibold tracking-wide uppercase'>
              Rental yield breakdown
            </p>
          </div>

          <div className='divide-y rounded-lg border'>
            <div className='flex items-center justify-between px-4 py-3'>
              <span className='text-muted-foreground text-sm'>
                Gross rental yield
              </span>
              <span className='text-primary font-serif text-xl font-bold'>
                {hasCalculated ? `${result.grossYield.toFixed(2)}%` : '—'}
              </span>
            </div>
            <div className='flex items-center justify-between px-4 py-3'>
              <span className='text-muted-foreground text-sm'>
                Net rental yield
              </span>
              <span className='text-primary font-serif text-xl font-bold'>
                {hasCalculated ? `${result.netYield.toFixed(2)}%` : '—'}
              </span>
            </div>
            <div className='flex items-center justify-between px-4 py-3'>
              <span className='text-muted-foreground text-sm'>
                Net annual return
              </span>
              <span className='text-primary font-serif text-xl font-bold'>
                {hasCalculated
                  ? `${getCurrencySign()}${result.netAnnualReturn.toLocaleString(
                      'en-GB',
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                    )}`
                  : '—'}
              </span>
            </div>
          </div>

          <ul className='text-muted-foreground space-y-3 text-sm'>
            <li className='flex gap-2'>
              <PoundSterling className='text-primary mt-0.5 h-3.5 w-3.5 shrink-0' />
              <span>
                Gross yield is your annual rent as a percentage of the
                property&apos;s current value, before any costs are taken into
                account.
              </span>
            </li>
            <li className='flex gap-2'>
              <PoundSterling className='text-primary mt-0.5 h-3.5 w-3.5 shrink-0' />
              <span>
                Net yield deducts your annual running costs and mortgage
                payments from the rent before comparing it to the
                property&apos;s value, giving a more realistic picture of
                returns.
              </span>
            </li>
            <li className='flex gap-2'>
              <PoundSterling className='text-primary mt-0.5 h-3.5 w-3.5 shrink-0' />
              <span>
                Net annual return is the same figure expressed in pounds rather
                than as a percentage &mdash; the cash profit you could expect to
                keep each year.
              </span>
            </li>
          </ul>

          <div className='flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900'>
            <TriangleAlert className='mt-0.5 h-4 w-4 shrink-0' />
            <p>
              <strong>
                This tool provides general information only and is not financial
                advice.
              </strong>{' '}
              Actual returns depend on factors such as void periods, taxation
              and changes in property value. Seek professional advice before
              making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalYieldCalculatorTab;
