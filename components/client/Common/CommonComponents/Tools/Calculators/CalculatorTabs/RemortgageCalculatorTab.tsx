'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  RemortgageCalculationResults,
  RemortgageCalculatorState,
} from '@/types/client/Common/Tools/Calculators/CalculatorsTypes';
import { formatPrice, getCurrencySign } from '@/utils/formatters';
import { Calculator } from 'lucide-react';
import React, { useState } from 'react';

const RemortgageCalculatorTab: React.FC = () => {
  const [state, setState] = useState<RemortgageCalculatorState>({
    mortgageAmount: '',
    arrangementFee: '',
    mortgageType: '',
    interestRate: '',
    years: '',
    months: '',
  });

  const [results, setResults] = useState<RemortgageCalculationResults>({
    monthlyPayment: 0,
    totalPaid: 0,
    totalInterest: 0,
    totalRepayments: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [calculated, setCalculated] = useState(false);

  const toNumber = (value: number | string): number => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  };

  const toRawNumeric = (value: string) => value.replace(/[^0-9.]/g, '');

  const validate = () => {
    const e: Record<string, string> = {};
    const mortgageAmountNum = toNumber(state.mortgageAmount);
    if (
      !state.mortgageAmount ||
      isNaN(mortgageAmountNum) ||
      mortgageAmountNum <= 0
    ) {
      e.mortgageAmount = 'Enter a mortgage amount greater than 0';
    }
    const interestRateNum = toNumber(state.interestRate);
    if (
      state.interestRate === '' ||
      isNaN(interestRateNum) ||
      interestRateNum < 0
    ) {
      e.interestRate = 'Enter a valid interest rate';
    }
    const yearsNum = Number(state.years);
    const monthsNum = Number(state.months);
    if (isNaN(yearsNum) || yearsNum < 0 || isNaN(monthsNum) || monthsNum < 0) {
      e.term = 'Enter a valid mortgage term';
    } else if (yearsNum === 0 && monthsNum === 0) {
      e.term = 'Term must be greater than 0';
    }
    if (!state.mortgageType) {
      e.mortgageType = 'Select a mortgage type';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const calculatePayment = () => {
    const mortgageAmount = toNumber(state.mortgageAmount) || 0;
    const arrangementFee = toNumber(state.arrangementFee) || 0;
    const mortgageType = state.mortgageType as 'interest-only' | 'repayment';
    const interestRate = Number(state.interestRate) || 0;
    const years = Number(state.years) || 0;
    const months = Number(state.months) || 0;

    const principal = mortgageAmount + arrangementFee;
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = years * 12 + months;

    let monthlyPayment = 0;
    let totalInterest = 0;
    let totalRepayments = 0;

    if (mortgageType === 'interest-only') {
      monthlyPayment = principal * monthlyRate;
      totalInterest = monthlyPayment * totalMonths;
      totalRepayments = 0;
    } else {
      if (monthlyRate === 0) {
        monthlyPayment = principal / totalMonths;
        totalInterest = 0;
      } else {
        monthlyPayment =
          (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1);
        totalInterest = monthlyPayment * totalMonths - principal;
        totalRepayments = principal;
      }
    }

    const totalPaid = monthlyPayment * totalMonths;

    setResults({
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPaid: Math.round(totalPaid * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalRepayments: Math.round(totalRepayments * 100) / 100,
    });
    setCalculated(true);
  };

  const handleCalculate = () => {
    if (!validate()) {
      setCalculated(false);
      return;
    }
    calculatePayment();
  };

  const handleInputChange = (
    field: keyof RemortgageCalculatorState,
    value: string,
  ) => {
    setState((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const resultRows: { label: string; value: number }[] = [
    { label: 'Monthly payment', value: results.monthlyPayment },
    { label: 'Total paid', value: results.totalPaid },
    { label: 'Total interest', value: results.totalInterest },
    { label: 'Total repayments', value: results.totalRepayments },
  ];

  return (
    <Card className='overflow-hidden p-0'>
      {/* Header — flush to the card edges; overflow-hidden on Card clips
          its square corners to the card's own rounded corners. */}
      <div className='from-primary to-secondary flex items-center gap-3 bg-linear-to-r px-6 py-5 text-white'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20'>
          <Calculator className='h-5 w-5' />
        </div>
        <div>
          <h2 className='text-lg leading-tight font-semibold'>
            Remortgage Calculator
          </h2>
          <p className='text-sm text-white/80'>
            Calculate your monthly payments, total paid, total interest, and
            total repayments for your remortgage based on the mortgage amount,
            arrangement fee, mortgage type, interest rate, and mortgage term.
          </p>
        </div>
      </div>

      {/* Body — padding lives here instead of on the Card, so it doesn't
          eat into the header. */}
      <div className='grid gap-6 p-4 sm:p-6 lg:grid-cols-2'>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='mortgageAmount'>
              Mortgage amount<span className='text-destructive'>*</span>
            </Label>
            <div className='relative'>
              <span className='text-muted-foreground pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm'>
                {getCurrencySign()}
              </span>
              <Input
                id='mortgageAmount'
                type='text'
                inputMode='decimal'
                value={formatPrice(String(state.mortgageAmount))}
                onChange={(e) =>
                  handleInputChange(
                    'mortgageAmount',
                    toRawNumeric(e.target.value),
                  )
                }
                className={cn(
                  'pl-6!',
                  errors.mortgageAmount &&
                    'border-destructive focus-visible:ring-destructive',
                )}
              />
            </div>
            {errors.mortgageAmount && (
              <p className='text-destructive text-sm'>
                {errors.mortgageAmount}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='arrangementFee'>Arrangement fee</Label>
            <div className='relative'>
              <span className='text-muted-foreground pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm'>
                {getCurrencySign()}
              </span>
              <Input
                id='arrangementFee'
                type='text'
                inputMode='decimal'
                value={formatPrice(String(state.arrangementFee))}
                onChange={(e) =>
                  handleInputChange(
                    'arrangementFee',
                    toRawNumeric(e.target.value),
                  )
                }
                className='pl-6!'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='mortgageType'>
              Mortgage type<span className='text-destructive'>*</span>
            </Label>
            <Select
              value={state.mortgageType}
              onValueChange={(value) =>
                handleInputChange('mortgageType', value)
              }
            >
              <SelectTrigger
                id='mortgageType'
                className={cn(
                  errors.mortgageType &&
                    'border-destructive focus-visible:ring-destructive',
                )}
              >
                <SelectValue placeholder='Choose...' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='interest-only'>Interest only</SelectItem>
                <SelectItem value='repayment'>Repayment</SelectItem>
              </SelectContent>
            </Select>
            {errors.mortgageType && (
              <p className='text-destructive text-sm'>{errors.mortgageType}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='interestRate'>
              Interest rate<span className='text-destructive'>*</span>
            </Label>
            <div className='relative'>
              <Input
                id='interestRate'
                type='number'
                min={0}
                step={0.01}
                value={state.interestRate}
                onChange={(e) =>
                  handleInputChange('interestRate', e.target.value)
                }
                className={cn(
                  'pr-7',
                  errors.interestRate &&
                    'border-destructive focus-visible:ring-destructive',
                )}
              />
              <span className='text-muted-foreground pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm'>
                %
              </span>
            </div>
            {errors.interestRate && (
              <p className='text-destructive text-sm'>{errors.interestRate}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label>
              Mortgage term<span className='text-destructive'>*</span>
            </Label>
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-1'>
                <Input
                  type='number'
                  min={0}
                  value={state.years}
                  onChange={(e) => handleInputChange('years', e.target.value)}
                />
                <p className='text-muted-foreground text-xs'>years</p>
              </div>
              <div className='space-y-1'>
                <Input
                  type='number'
                  min={0}
                  max={11}
                  value={state.months}
                  onChange={(e) => handleInputChange('months', e.target.value)}
                />
                <p className='text-muted-foreground text-xs'>months</p>
              </div>
            </div>
            {errors.term && (
              <p className='text-destructive text-sm'>{errors.term}</p>
            )}
          </div>

          <Button
            onClick={handleCalculate}
            size='lg'
            className='w-full cursor-pointer'
          >
            Calculate
          </Button>
        </div>

        <div className='bg-background rounded-lg border p-4 sm:p-6'>
          <dl className='divide-y'>
            {resultRows.map(({ label, value }) => (
              <div
                key={label}
                className='flex items-center justify-between py-3 first:pt-0 last:pb-0'
              >
                <dt className='text-muted-foreground text-sm'>{label}</dt>
                <dd className='bg-muted min-w-37.5 rounded-md px-2 py-1 text-right text-lg font-semibold'>
                  {calculated ? `${getCurrencySign()}${value.toFixed(2)}` : '—'}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Card>
  );
};

export default RemortgageCalculatorTab;
