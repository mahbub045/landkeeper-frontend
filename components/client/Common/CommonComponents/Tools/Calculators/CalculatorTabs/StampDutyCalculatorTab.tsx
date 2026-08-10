'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  StampDutyCalculationBreakdown,
  StampDutyFormData,
  StampDutyLeaseTerm,
  StampDutyOption,
} from '@/types/client/Common/Tools/Calculators/CalculatorsTypes';
import { formatPrice, getCurrencySign } from '@/utils/formatters';
import { RotateCw } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

const RadioQuestion: React.FC<{
  name: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  options: StampDutyOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}> = ({ name, title, description, options, value, onChange, error }) => (
  <div>
    <h3 className='mb-1 text-base font-semibold'>{title}</h3>
    {description}
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className='my-3 space-y-3'
    >
      {options.map((opt) => (
        <div key={opt.value} className='mx-3 flex items-center gap-2'>
          <RadioGroupItem value={opt.value} id={`${name}-${opt.value}`} />
          <Label
            htmlFor={`${name}-${opt.value}`}
            className='cursor-pointer font-normal'
          >
            {opt.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
    {error && (
      <Alert variant='destructive'>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )}
  </div>
);

const YesNoQuestion: React.FC<{
  name: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  value: boolean | null;
  onChange: (value: boolean) => void;
  error?: string;
}> = ({ name, title, description, value, onChange, error }) => (
  <RadioQuestion
    name={name}
    title={title}
    description={description}
    options={[
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ]}
    value={value === true ? 'yes' : value === false ? 'no' : ''}
    onChange={(v) => onChange(v === 'yes')}
    error={error}
  />
);

const DateFields: React.FC<{
  idPrefix: string;
  day: string;
  month: string;
  year: string;
  onDayChange: (v: string) => void;
  onMonthChange: (v: string) => void;
  onYearChange: (v: string) => void;
}> = ({
  idPrefix,
  day,
  month,
  year,
  onDayChange,
  onMonthChange,
  onYearChange,
}) => (
  <div className='grid grid-cols-3 gap-3'>
    <div className='space-y-1.5'>
      <Label htmlFor={`${idPrefix}Day`}>Day</Label>
      <Input
        id={`${idPrefix}Day`}
        placeholder='DD'
        maxLength={2}
        value={day}
        onChange={(e) => onDayChange(e.target.value.replace(/[^0-9]/g, ''))}
      />
    </div>
    <div className='space-y-1.5'>
      <Label htmlFor={`${idPrefix}Month`}>Month</Label>
      <Input
        id={`${idPrefix}Month`}
        placeholder='MM'
        maxLength={2}
        value={month}
        onChange={(e) => onMonthChange(e.target.value.replace(/[^0-9]/g, ''))}
      />
    </div>
    <div className='space-y-1.5'>
      <Label htmlFor={`${idPrefix}Year`}>Year</Label>
      <Input
        id={`${idPrefix}Year`}
        placeholder='YYYY'
        maxLength={4}
        value={year}
        onChange={(e) => onYearChange(e.target.value.replace(/[^0-9]/g, ''))}
      />
    </div>
  </div>
);

const CurrencyInput: React.FC<{
  id?: string;
  value: string;
  onChange: (formatted: string) => void;
  placeholder?: string;
}> = ({ id, value, onChange, placeholder }) => (
  <div className='relative'>
    <span className='text-muted-foreground pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm'>
      {getCurrencySign()}
    </span>
    <Input
      id={id}
      type='text'
      value={value}
      onChange={(e) => onChange(formatPrice(e.target.value))}
      placeholder={placeholder}
      className='pl-6!'
    />
  </div>
);

// ---------- Main component ----------

const StampDutyCalculatorTab: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<StampDutyFormData>({
    propertyType: '',
    propertyUse: '',
    effectiveDay: '',
    effectiveMonth: '',
    effectiveYear: '',
    isNonUKResident: null,
    isPurchasingAsIndividual: null,
    willOwnMultipleProperties: null,
    isReplacingMainResidence: null,
    hasEverOwnedProperty: null,
    willThisBeMainResidence: null,
    isSharedOwnership: null,
    sharedMarketValueOption: '',
    sharedMarketValueElection: '',
    sharedOwnershipMarketValue: '',
    sharedOwnershipInitialShare: '',
    leaseStartDay: '',
    leaseStartMonth: '',
    leaseStartYear: '',
    leaseEndDay: '',
    leaseEndMonth: '',
    leaseEndYear: '',
    purchasePrice: '',
    yearlyRents: [],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [calculationResult, setCalculationResult] = useState<{
    totalTax: number;
    premiumBreakdown: StampDutyCalculationBreakdown[];
    rentBreakdown: StampDutyCalculationBreakdown[];
    rentNPV: number;
    premiumTax: number;
    rentTax: number;
  } | null>(null);

  const calculateLeaseTerm = useCallback((): StampDutyLeaseTerm => {
    const startDate = new Date(
      parseInt(formData.leaseStartYear),
      parseInt(formData.leaseStartMonth) - 1,
      parseInt(formData.leaseStartDay),
    );
    const endDate = new Date(
      parseInt(formData.leaseEndYear),
      parseInt(formData.leaseEndMonth) - 1,
      parseInt(formData.leaseEndDay),
    );

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return { years: 0, days: 0, totalDays: 0, totalYears: 0 };
    }

    if (endDate <= startDate) {
      return { years: 0, days: 0, totalDays: 0, totalYears: 0 };
    }

    const diffTime = endDate.getTime() - startDate.getTime();
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(totalDays / 365);
    const remainingDays = totalDays - years * 365;

    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const calendarYearsSpanned = endYear - startYear + 1;

    return {
      years,
      days: remainingDays,
      totalDays,
      totalYears: totalDays / 365.25,
      calendarYearsSpanned,
    };
  }, [
    formData.leaseStartDay,
    formData.leaseStartMonth,
    formData.leaseStartYear,
    formData.leaseEndDay,
    formData.leaseEndMonth,
    formData.leaseEndYear,
  ]);

  // Derived value, not state: lease term is a pure function of the lease
  // dates, so it's computed during render instead of synced via an effect.
  const leaseTerm = useMemo<StampDutyLeaseTerm | null>(() => {
    if (
      formData.propertyType !== 'leasehold' ||
      !formData.leaseStartDay ||
      !formData.leaseStartMonth ||
      !formData.leaseStartYear ||
      !formData.leaseEndDay ||
      !formData.leaseEndMonth ||
      !formData.leaseEndYear
    ) {
      return null;
    }

    const startDay = parseInt(formData.leaseStartDay);
    const startMonth = parseInt(formData.leaseStartMonth);
    const startYear = parseInt(formData.leaseStartYear);
    const endDay = parseInt(formData.leaseEndDay);
    const endMonth = parseInt(formData.leaseEndMonth);
    const endYear = parseInt(formData.leaseEndYear);

    if (
      isNaN(startDay) ||
      isNaN(startMonth) ||
      isNaN(startYear) ||
      isNaN(endDay) ||
      isNaN(endMonth) ||
      isNaN(endYear)
    ) {
      return null;
    }

    try {
      const term = calculateLeaseTerm();

      if (
        !term ||
        isNaN(term.totalYears) ||
        term.totalYears <= 0 ||
        !isFinite(term.totalYears)
      ) {
        return null;
      }

      return term;
    } catch (error) {
      console.error('Error calculating lease term:', error);
      return null;
    }
  }, [
    formData.propertyType,
    formData.leaseStartDay,
    formData.leaseStartMonth,
    formData.leaseStartYear,
    formData.leaseEndDay,
    formData.leaseEndMonth,
    formData.leaseEndYear,
    calculateLeaseTerm,
  ]);

  const rentYearsToCollect = useMemo(() => {
    if (!leaseTerm) return 0;

    const yearsToCollect = Math.min(
      leaseTerm.calendarYearsSpanned || Math.ceil(leaseTerm.totalYears),
      5,
    );

    if (isNaN(yearsToCollect) || yearsToCollect < 1 || yearsToCollect > 100) {
      return 0;
    }

    return yearsToCollect;
  }, [leaseTerm]);

  const calculateNPV = (
    yearlyRents: number[],
    totalYears: number,
    calendarYearsSpanned?: number,
  ): number => {
    if (
      !yearlyRents ||
      yearlyRents.length === 0 ||
      isNaN(totalYears) ||
      totalYears <= 0 ||
      !isFinite(totalYears)
    ) {
      return 0;
    }

    const discountRate = 0.035;
    let npv = 0;

    const yearsToCalculate =
      calendarYearsSpanned || Math.min(Math.ceil(totalYears), 5);

    if (isNaN(yearsToCalculate) || yearsToCalculate < 1) {
      return 0;
    }

    const yearsToUse = Math.min(yearsToCalculate, 5);

    for (let i = 0; i < yearsToUse && i < yearlyRents.length; i++) {
      const rent = yearlyRents[i] || 0;
      if (isFinite(rent) && rent >= 0) {
        npv += rent / Math.pow(1 + discountRate, i + 1);
      }
    }

    if (yearsToCalculate > 5) {
      const validRents = yearlyRents
        .slice(0, yearsToUse)
        .filter((r) => isFinite(r) && r >= 0);
      if (validRents.length > 0) {
        const highestRent = Math.max(...validRents);
        const remainingYears = yearsToCalculate - yearsToUse;

        for (let i = yearsToUse; i < yearsToUse + remainingYears; i++) {
          npv += highestRent / Math.pow(1 + discountRate, i + 1);
        }
      }
    }

    return npv;
  };

  const calculateSDLT = () => {
    let price;

    if (
      formData.isSharedOwnership === true &&
      formData.sharedMarketValueOption === 'lte500k'
    ) {
      if (formData.sharedMarketValueElection === 'market') {
        price = parseFloat(
          formData.sharedOwnershipMarketValue.replace(/,/g, ''),
        );
      } else if (formData.sharedMarketValueElection === 'stages') {
        price = parseFloat(
          formData.sharedOwnershipInitialShare.replace(/,/g, ''),
        );
      } else {
        price = parseFloat(formData.purchasePrice.replace(/,/g, ''));
      }
    } else {
      price = parseFloat(formData.purchasePrice.replace(/,/g, ''));
    }

    const {
      propertyUse,
      propertyType,
      isNonUKResident,
      isPurchasingAsIndividual,
      willOwnMultipleProperties,
      isReplacingMainResidence,
    } = formData;

    let premiumTax = 0;
    let rentTax = 0;
    const premiumBreakdown: StampDutyCalculationBreakdown[] = [];
    const rentBreakdown: StampDutyCalculationBreakdown[] = [];
    let rentNPV = 0;

    let purchasePriceSurcharge = 0;
    let rentSurcharge = 0;

    if (propertyUse === 'residential') {
      if (isPurchasingAsIndividual === true) {
        if (
          willOwnMultipleProperties === true &&
          isReplacingMainResidence !== true
        ) {
          if (propertyType === 'freehold') {
            purchasePriceSurcharge += 5;
          } else if (propertyType === 'leasehold') {
            purchasePriceSurcharge += 5;
            rentSurcharge += 5;
          }
        }

        if (isNonUKResident === true) {
          if (propertyType === 'freehold') {
            if (
              willOwnMultipleProperties === true ||
              isReplacingMainResidence === true
            ) {
              purchasePriceSurcharge += 2;
            }
          } else if (propertyType === 'leasehold') {
            if (
              willOwnMultipleProperties === true &&
              isReplacingMainResidence !== true
            ) {
              purchasePriceSurcharge += 2;
              rentSurcharge += 2;
            }
          }
        }
      } else if (isPurchasingAsIndividual === false) {
        if (propertyType === 'freehold') {
          if (isNonUKResident === true) {
            purchasePriceSurcharge = 7;
          } else {
            purchasePriceSurcharge = 5;
          }
        }
      }
    }

    if (propertyUse === 'residential') {
      const qualifiesForFTBRelief =
        formData.hasEverOwnedProperty === false &&
        formData.willThisBeMainResidence === true &&
        formData.isSharedOwnership === true &&
        formData.sharedMarketValueOption === 'lte500k';

      let rates;

      if (qualifiesForFTBRelief) {
        rates = [
          { min: 0, max: 300000, rate: 0 },
          { min: 300001, max: 500000, rate: 5 },
          { min: 500001, max: Infinity, rate: 5 },
        ];
      } else {
        rates = [
          { min: 0, max: 125000, rate: 0 },
          { min: 125001, max: 250000, rate: 2 },
          { min: 250001, max: 925000, rate: 5 },
          { min: 925001, max: 1500000, rate: 10 },
          { min: 1500001, max: Infinity, rate: 12 },
        ];
      }

      for (const band of rates) {
        if (price > band.min) {
          const taxableAmount =
            Math.min(price, band.max) - Math.max(band.min - 1, 0);
          if (taxableAmount > 0) {
            const effectiveRate = band.rate + purchasePriceSurcharge;
            const bandTax = (taxableAmount * effectiveRate) / 100;
            premiumTax += bandTax;

            let bandDescription;
            if (qualifiesForFTBRelief) {
              if (band.min === 0) {
                bandDescription = `Up to ${band.max.toLocaleString()}`;
              } else if (band.max === Infinity) {
                bandDescription = `Above ${(band.min - 1).toLocaleString()}+`;
              } else {
                bandDescription = `Above ${(band.min - 1).toLocaleString()} and up to ${band.max.toLocaleString()}`;
              }
            } else {
              bandDescription =
                band.min === 0
                  ? `Up to ${band.max.toLocaleString()}`
                  : band.max === Infinity
                    ? `Above ${(band.min - 1).toLocaleString()}+`
                    : `Above ${(band.min - 1).toLocaleString()} and up to ${band.max.toLocaleString()}`;
            }

            premiumBreakdown.push({
              band: bandDescription,
              amount: taxableAmount,
              rate: effectiveRate,
              tax: bandTax,
            });
          }
        }
      }
    } else {
      const rates = [
        { min: 0, max: 150000, rate: 0 },
        { min: 150001, max: 250000, rate: 2 },
        { min: 250001, max: Infinity, rate: 5 },
      ];

      for (const band of rates) {
        if (price > band.min) {
          const taxableAmount =
            Math.min(price, band.max) - Math.max(band.min - 1, 0);
          if (taxableAmount > 0) {
            const bandTax = (taxableAmount * band.rate) / 100;
            premiumTax += bandTax;

            premiumBreakdown.push({
              band:
                band.min === 0
                  ? `Up to ${band.max.toLocaleString()}`
                  : band.max === Infinity
                    ? `Above ${(band.min - 1).toLocaleString()}+`
                    : `Above ${(band.min - 1).toLocaleString()} and up to ${band.max.toLocaleString()}`,
              amount: taxableAmount,
              rate: band.rate,
              tax: bandTax,
            });
          }
        }
      }
    }

    if (propertyType === 'leasehold' && leaseTerm && leaseTerm.totalYears > 0) {
      const yearlyRentValues = formData.yearlyRents
        .slice(0, rentYearsToCollect)
        .map((r) => parseFloat(r.replace(/,/g, '')) || 0);
      rentNPV = calculateNPV(
        yearlyRentValues,
        leaseTerm.totalYears,
        leaseTerm.calendarYearsSpanned,
      );

      if (propertyUse === 'residential') {
        if (rentNPV > 125000) {
          const taxableRent = rentNPV - 125000;
          const rentRate = 1 + rentSurcharge;
          rentTax = (taxableRent * rentRate) / 100;

          rentBreakdown.push({
            band: 'Up to 125,000',
            amount: 125000,
            rate: 0,
            tax: 0,
          });
          rentBreakdown.push({
            band: 'Above 125,000+',
            amount: taxableRent,
            rate: rentRate,
            tax: rentTax,
          });
        } else {
          rentBreakdown.push({
            band: 'Up to 125,000',
            amount: rentNPV,
            rate: 0,
            tax: 0,
          });
        }
      } else {
        if (rentNPV > 150000) {
          const firstBandAmount = Math.min(rentNPV - 150000, 5000000 - 150000);
          const secondBandAmount = Math.max(0, rentNPV - 5000000);

          rentBreakdown.push({
            band: 'Up to 150,000',
            amount: 150000,
            rate: 0,
            tax: 0,
          });

          if (firstBandAmount > 0) {
            const firstBandTax = (firstBandAmount * 1) / 100;
            rentTax += firstBandTax;
            rentBreakdown.push({
              band: 'Above 150,000 and up to 5,000,000',
              amount: firstBandAmount,
              rate: 1,
              tax: firstBandTax,
            });
          }

          if (secondBandAmount > 0) {
            const secondBandTax = (secondBandAmount * 2) / 100;
            rentTax += secondBandTax;
            rentBreakdown.push({
              band: 'Above 5,000,000+',
              amount: secondBandAmount,
              rate: 2,
              tax: secondBandTax,
            });
          }
        } else {
          rentBreakdown.push({
            band: 'Up to 150,000',
            amount: rentNPV,
            rate: 0,
            tax: 0,
          });
        }
      }
    }

    setCalculationResult({
      totalTax: premiumTax + rentTax,
      premiumBreakdown,
      rentBreakdown,
      rentNPV,
      premiumTax,
      rentTax,
    });
  };

  const getTotalSteps = (): number => {
    let steps = 3;

    if (formData.propertyUse === 'residential') {
      steps++;

      if (formData.isNonUKResident !== null) {
        steps++;

        if (formData.isPurchasingAsIndividual === true) {
          steps++;

          if (formData.willOwnMultipleProperties === true) {
            steps++;
          } else if (formData.willOwnMultipleProperties === false) {
            steps++;

            if (formData.hasEverOwnedProperty === true) {
              // no additional questions
            } else if (formData.hasEverOwnedProperty === false) {
              steps++;

              if (
                formData.propertyType === 'leasehold' &&
                formData.willThisBeMainResidence === true
              ) {
                steps++;
                if (formData.isSharedOwnership === true) {
                  steps++;
                  if (formData.sharedMarketValueOption === 'lte500k') {
                    steps++;

                    if (
                      formData.sharedMarketValueElection === 'market' ||
                      formData.sharedMarketValueElection === 'stages'
                    ) {
                      steps++;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    if (formData.propertyType === 'leasehold') {
      steps += 2;
    }

    const skipPurchasePrice =
      formData.isSharedOwnership === true &&
      formData.sharedMarketValueOption === 'lte500k' &&
      (formData.sharedMarketValueElection === 'market' ||
        formData.sharedMarketValueElection === 'stages');

    if (!skipPurchasePrice) {
      steps++;
    }

    if (formData.propertyType === 'leasehold') {
      steps++;
    }

    return steps;
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let stepCounter = 1;

    if (currentStep === stepCounter) {
      if (!formData.propertyType) {
        newErrors.propertyType = 'Please select property type';
      }
    }
    stepCounter++;

    if (currentStep === stepCounter) {
      if (!formData.propertyUse) {
        newErrors.propertyUse = 'Please select property use';
      }
    }
    stepCounter++;

    if (currentStep === stepCounter) {
      if (
        !formData.effectiveDay ||
        !formData.effectiveMonth ||
        !formData.effectiveYear
      ) {
        newErrors.effectiveDate = 'Please enter complete date';
      } else {
        const day = parseInt(formData.effectiveDay);
        const month = parseInt(formData.effectiveMonth);
        const year = parseInt(formData.effectiveYear);

        if (
          day < 1 ||
          day > 31 ||
          month < 1 ||
          month > 12 ||
          year < 1900 ||
          year > 2100
        ) {
          newErrors.effectiveDate = 'Please enter a valid date';
        }
      }
    }
    stepCounter++;

    if (formData.propertyUse === 'residential') {
      if (currentStep === stepCounter) {
        if (formData.isNonUKResident === null) {
          newErrors.isNonUKResident = 'Please select yes or no';
        }
      }
      stepCounter++;

      if (formData.isNonUKResident !== null) {
        if (currentStep === stepCounter) {
          if (formData.isPurchasingAsIndividual === null) {
            newErrors.isPurchasingAsIndividual = 'Please select yes or no';
          }
        }
        stepCounter++;

        if (formData.isPurchasingAsIndividual === true) {
          if (currentStep === stepCounter) {
            if (formData.willOwnMultipleProperties === null) {
              newErrors.willOwnMultipleProperties = 'Please select yes or no';
            }
          }
          stepCounter++;

          if (formData.willOwnMultipleProperties === true) {
            if (currentStep === stepCounter) {
              if (formData.isReplacingMainResidence === null) {
                newErrors.isReplacingMainResidence = 'Please select yes or no';
              }
            }
            stepCounter++;
          } else if (formData.willOwnMultipleProperties === false) {
            if (currentStep === stepCounter) {
              if (formData.hasEverOwnedProperty === null) {
                newErrors.hasEverOwnedProperty = 'Please select yes or no';
              }
            }
            stepCounter++;

            if (formData.hasEverOwnedProperty === false) {
              if (currentStep === stepCounter) {
                if (formData.willThisBeMainResidence === null) {
                  newErrors.willThisBeMainResidence = 'Please select yes or no';
                }
              }
              stepCounter++;

              if (
                formData.propertyType === 'leasehold' &&
                formData.willThisBeMainResidence === true
              ) {
                if (currentStep === stepCounter) {
                  if (formData.isSharedOwnership === null) {
                    newErrors.isSharedOwnership = 'Please select yes or no';
                  }
                }
                stepCounter++;

                if (formData.isSharedOwnership === true) {
                  if (currentStep === stepCounter) {
                    if (!formData.sharedMarketValueOption) {
                      newErrors.sharedMarketValueOption =
                        'Please select market value option';
                    }
                  }
                  stepCounter++;

                  if (formData.sharedMarketValueOption === 'lte500k') {
                    if (currentStep === stepCounter) {
                      if (!formData.sharedMarketValueElection) {
                        newErrors.sharedMarketValueElection =
                          'Please select an election';
                      }
                    }
                    stepCounter++;

                    if (
                      formData.sharedMarketValueElection === 'market' ||
                      formData.sharedMarketValueElection === 'stages'
                    ) {
                      if (currentStep === stepCounter) {
                        if (formData.sharedMarketValueElection === 'market') {
                          if (!formData.sharedOwnershipMarketValue) {
                            newErrors.sharedOwnershipMarketValue =
                              'Please enter market value';
                          } else {
                            const value = parseFloat(
                              formData.sharedOwnershipMarketValue.replace(
                                /,/g,
                                '',
                              ),
                            );
                            if (isNaN(value) || value <= 0) {
                              newErrors.sharedOwnershipMarketValue =
                                'Please enter a valid price';
                            } else if (value > 500000) {
                              newErrors.sharedOwnershipMarketValue = `Market value cannot exceed ${getCurrencySign()}500,000 for this option`;
                            }
                          }
                        } else if (
                          formData.sharedMarketValueElection === 'stages'
                        ) {
                          if (!formData.sharedOwnershipInitialShare) {
                            newErrors.sharedOwnershipInitialShare =
                              'Please enter initial share price';
                          } else {
                            const value = parseFloat(
                              formData.sharedOwnershipInitialShare.replace(
                                /,/g,
                                '',
                              ),
                            );
                            if (isNaN(value) || value <= 0) {
                              newErrors.sharedOwnershipInitialShare =
                                'Please enter a valid price';
                            } else if (value > 500000) {
                              newErrors.sharedOwnershipInitialShare = `Initial share price cannot exceed ${getCurrencySign()}500,000 for this option`;
                            }
                          }
                        }
                      }
                      stepCounter++;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    if (formData.propertyType === 'leasehold') {
      if (currentStep === stepCounter) {
        if (
          !formData.leaseStartDay ||
          !formData.leaseStartMonth ||
          !formData.leaseStartYear
        ) {
          newErrors.leaseStartDate = 'Please enter complete lease start date';
        } else {
          const day = parseInt(formData.leaseStartDay);
          const month = parseInt(formData.leaseStartMonth);
          const year = parseInt(formData.leaseStartYear);

          if (
            day < 1 ||
            day > 31 ||
            month < 1 ||
            month > 12 ||
            year < 1900 ||
            year > 2100
          ) {
            newErrors.leaseStartDate = 'Please enter a valid date';
          }
        }
      }
      stepCounter++;

      if (currentStep === stepCounter) {
        if (
          !formData.leaseEndDay ||
          !formData.leaseEndMonth ||
          !formData.leaseEndYear
        ) {
          newErrors.leaseEndDate = 'Please enter complete lease end date';
        } else {
          const startDay = parseInt(formData.leaseStartDay);
          const startMonth = parseInt(formData.leaseStartMonth);
          const startYear = parseInt(formData.leaseStartYear);
          const endDay = parseInt(formData.leaseEndDay);
          const endMonth = parseInt(formData.leaseEndMonth);
          const endYear = parseInt(formData.leaseEndYear);

          if (
            endDay < 1 ||
            endDay > 31 ||
            endMonth < 1 ||
            endMonth > 12 ||
            endYear < 1900 ||
            endYear > 2100
          ) {
            newErrors.leaseEndDate = 'Please enter a valid date';
          } else {
            const startDate = new Date(startYear, startMonth - 1, startDay);
            const endDate = new Date(endYear, endMonth - 1, endDay);

            if (endDate <= startDate) {
              newErrors.leaseEndDate = 'End date must be after start date';
            }
          }
        }
      }
      stepCounter++;
    }

    const skipPurchasePrice =
      formData.isSharedOwnership === true &&
      formData.sharedMarketValueOption === 'lte500k' &&
      (formData.sharedMarketValueElection === 'market' ||
        formData.sharedMarketValueElection === 'stages');

    if (!skipPurchasePrice && currentStep === stepCounter) {
      if (!formData.purchasePrice) {
        newErrors.purchasePrice = 'Please enter purchase price';
      } else {
        const price = parseFloat(formData.purchasePrice.replace(/,/g, ''));
        if (isNaN(price) || price <= 0) {
          newErrors.purchasePrice = 'Please enter a valid price';
        }
      }
    }

    if (!skipPurchasePrice) {
      stepCounter++;
    }

    if (formData.propertyType === 'leasehold' && currentStep === stepCounter) {
      if (!leaseTerm || !leaseTerm.totalYears || leaseTerm.totalYears <= 0) {
        newErrors.yearlyRents =
          'Please ensure you have entered valid lease dates';
      } else {
        const hasAnyRent = formData.yearlyRents
          .slice(0, rentYearsToCollect)
          .some((rent) => {
            const rentValue = parseFloat(rent.replace(/,/g, ''));
            return !isNaN(rentValue) && rentValue > 0;
          });

        if (!hasAnyRent) {
          newErrors.yearlyRents = 'Please enter at least one year of rent';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleCalculate = () => {
    calculateSDLT();
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const resetCalculator = () => {
    setCurrentStep(1);
    setFormData({
      propertyType: '',
      propertyUse: '',
      effectiveDay: '',
      effectiveMonth: '',
      effectiveYear: '',
      isNonUKResident: null,
      isPurchasingAsIndividual: null,
      willOwnMultipleProperties: null,
      isReplacingMainResidence: null,
      hasEverOwnedProperty: null,
      willThisBeMainResidence: null,
      isSharedOwnership: null,
      sharedMarketValueOption: '',
      sharedMarketValueElection: '',
      sharedOwnershipMarketValue: '',
      sharedOwnershipInitialShare: '',
      leaseStartDay: '',
      leaseStartMonth: '',
      leaseStartYear: '',
      leaseEndDay: '',
      leaseEndMonth: '',
      leaseEndYear: '',
      purchasePrice: '',
      yearlyRents: [],
    });
    setErrors({});
    setCalculationResult(null);
  };

  // ---------- Step rendering ----------
  const renderStep = () => {
    let stepCounter = 1;

    if (currentStep === stepCounter) {
      return (
        <RadioQuestion
          name='propertyType'
          title='Is your transaction freehold or leasehold?'
          options={[
            { value: 'freehold', label: 'Freehold' },
            { value: 'leasehold', label: 'Leasehold' },
          ]}
          value={formData.propertyType}
          onChange={(v) => setFormData({ ...formData, propertyType: v })}
          error={errors.propertyType}
        />
      );
    }
    stepCounter++;

    if (currentStep === stepCounter) {
      return (
        <RadioQuestion
          name='propertyUse'
          title='Is the transaction residential or non-residential?'
          description={
            <p className='text-muted-foreground mb-3 text-sm'>
              If it&apos;s a mixed transaction, choose
              &apos;Non-residential&apos;.
            </p>
          }
          options={[
            { value: 'residential', label: 'Residential' },
            { value: 'non-residential', label: 'Non-residential' },
          ]}
          value={formData.propertyUse}
          onChange={(v) => setFormData({ ...formData, propertyUse: v })}
          error={errors.propertyUse}
        />
      );
    }
    stepCounter++;

    if (currentStep === stepCounter) {
      return (
        <div>
          <h3 className='mb-1 text-base font-semibold'>
            Effective date of your transaction
          </h3>
          <p className='text-muted-foreground mb-1 text-sm'>
            This is usually the completion date.
          </p>
          <p className='text-muted-foreground mb-3 text-sm'>
            For example, 31 3 2014.
          </p>
          <DateFields
            idPrefix='effective'
            day={formData.effectiveDay}
            month={formData.effectiveMonth}
            year={formData.effectiveYear}
            onDayChange={(v) => setFormData({ ...formData, effectiveDay: v })}
            onMonthChange={(v) =>
              setFormData({ ...formData, effectiveMonth: v })
            }
            onYearChange={(v) => setFormData({ ...formData, effectiveYear: v })}
          />
          {errors.effectiveDate && (
            <Alert variant='destructive' className='mt-3'>
              <AlertDescription>{errors.effectiveDate}</AlertDescription>
            </Alert>
          )}
        </div>
      );
    }
    stepCounter++;

    if (formData.propertyUse === 'residential') {
      if (currentStep === stepCounter) {
        return (
          <YesNoQuestion
            name='isNonUKResident'
            title='Are any of the purchasers non-UK resident?'
            value={formData.isNonUKResident}
            onChange={(v) => setFormData({ ...formData, isNonUKResident: v })}
            error={errors.isNonUKResident}
          />
        );
      }
      stepCounter++;

      if (currentStep === stepCounter) {
        return (
          <YesNoQuestion
            name='isPurchasingAsIndividual'
            title='Are you purchasing the property as an individual?'
            description={
              <p className='text-muted-foreground mb-3 text-sm'>
                Choose &apos;Yes&apos; if you&apos;re buying on your own, or
                you&apos;re married or in a civil partnership. Choose
                &apos;No&apos; if you&apos;re a company or trust.
              </p>
            }
            value={formData.isPurchasingAsIndividual}
            onChange={(v) =>
              setFormData({ ...formData, isPurchasingAsIndividual: v })
            }
            error={errors.isPurchasingAsIndividual}
          />
        );
      }
      stepCounter++;

      if (formData.isPurchasingAsIndividual === true) {
        if (currentStep === stepCounter) {
          return (
            <YesNoQuestion
              name='willOwnMultipleProperties'
              title='Will the purchase of the property result in owning two or more properties?'
              value={formData.willOwnMultipleProperties}
              onChange={(v) =>
                setFormData({ ...formData, willOwnMultipleProperties: v })
              }
              error={errors.willOwnMultipleProperties}
            />
          );
        }
        stepCounter++;

        if (formData.willOwnMultipleProperties === true) {
          if (currentStep === stepCounter) {
            return (
              <YesNoQuestion
                name='isReplacingMainResidence'
                title='Is the property being purchased replacing your main residence?'
                description={
                  <p className='text-muted-foreground mb-3 text-sm'>
                    If your previous main residence has not yet been sold choose
                    &quot;No&quot;. A refund may be available if the previous
                    main residence is sold within 3 years.
                  </p>
                }
                value={formData.isReplacingMainResidence}
                onChange={(v) =>
                  setFormData({ ...formData, isReplacingMainResidence: v })
                }
                error={errors.isReplacingMainResidence}
              />
            );
          }
          stepCounter++;
        } else if (formData.willOwnMultipleProperties === false) {
          if (currentStep === stepCounter) {
            return (
              <div>
                <h3 className='mb-1 text-base font-semibold'>
                  Have you ever owned or part owned another property?
                </h3>
                <p className='text-muted-foreground mb-2 text-sm'>
                  We only need to know about residential property, or property
                  that has both residential and non-residential use. This
                  includes freehold property, or leasehold property of at least
                  21 years. Select yes if you either:
                </p>
                <ul className='text-muted-foreground mb-3 list-disc pl-5 text-sm'>
                  <li>bought a property</li>
                  <li>inherited a property</li>
                  <li>are a beneficiary of a trust that owns a property</li>
                </ul>
                <RadioGroup
                  value={
                    formData.hasEverOwnedProperty === true
                      ? 'yes'
                      : formData.hasEverOwnedProperty === false
                        ? 'no'
                        : ''
                  }
                  onValueChange={(v) =>
                    setFormData({
                      ...formData,
                      hasEverOwnedProperty: v === 'yes',
                    })
                  }
                  className='my-3 space-y-3'
                >
                  <div className='mx-3 flex items-center gap-2'>
                    <RadioGroupItem value='yes' id='hasEverOwnedProperty-yes' />
                    <Label
                      htmlFor='hasEverOwnedProperty-yes'
                      className='cursor-pointer font-normal'
                    >
                      Yes
                    </Label>
                  </div>
                  <div className='mx-3 flex items-center gap-2'>
                    <RadioGroupItem value='no' id='hasEverOwnedProperty-no' />
                    <Label
                      htmlFor='hasEverOwnedProperty-no'
                      className='cursor-pointer font-normal'
                    >
                      No
                    </Label>
                  </div>
                </RadioGroup>
                {errors.hasEverOwnedProperty && (
                  <Alert variant='destructive'>
                    <AlertDescription>
                      {errors.hasEverOwnedProperty}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            );
          }
          stepCounter++;

          if (formData.hasEverOwnedProperty === false) {
            if (currentStep === stepCounter) {
              return (
                <YesNoQuestion
                  name='willThisBeMainResidence'
                  title='Will this property be your main residence?'
                  value={formData.willThisBeMainResidence}
                  onChange={(v) =>
                    setFormData({ ...formData, willThisBeMainResidence: v })
                  }
                  error={errors.willThisBeMainResidence}
                />
              );
            }
            stepCounter++;

            if (
              formData.propertyType === 'leasehold' &&
              formData.willThisBeMainResidence === true
            ) {
              if (currentStep === stepCounter) {
                return (
                  <YesNoQuestion
                    name='isSharedOwnership'
                    title='Are you buying the property through a shared ownership scheme?'
                    value={formData.isSharedOwnership}
                    onChange={(v) =>
                      setFormData({ ...formData, isSharedOwnership: v })
                    }
                    error={errors.isSharedOwnership}
                  />
                );
              }
              stepCounter++;

              if (formData.isSharedOwnership === true) {
                if (currentStep === stepCounter) {
                  return (
                    <RadioQuestion
                      name='sharedMarketValueOption'
                      title='What is the market value of the property?'
                      options={[
                        {
                          value: 'lte500k',
                          label: `${getCurrencySign()}500,000 or less`,
                        },
                        {
                          value: 'gt500k',
                          label: `More than ${getCurrencySign()}500,000`,
                        },
                      ]}
                      value={formData.sharedMarketValueOption}
                      onChange={(v) =>
                        setFormData({ ...formData, sharedMarketValueOption: v })
                      }
                      error={errors.sharedMarketValueOption}
                    />
                  );
                }
                stepCounter++;

                if (formData.sharedMarketValueOption === 'lte500k') {
                  if (currentStep === stepCounter) {
                    return (
                      <RadioQuestion
                        name='sharedMarketValueElection'
                        title='Do you want to pay SDLT on the market value or only on the percentage of the property you are buying?'
                        options={[
                          {
                            value: 'market',
                            label:
                              'Pay SDLT up front by making a market value election',
                          },
                          { value: 'stages', label: 'Pay SDLT in stages' },
                        ]}
                        value={formData.sharedMarketValueElection}
                        onChange={(v) =>
                          setFormData({
                            ...formData,
                            sharedMarketValueElection: v,
                          })
                        }
                        error={errors.sharedMarketValueElection}
                      />
                    );
                  }
                  stepCounter++;

                  if (
                    formData.sharedMarketValueElection === 'market' ||
                    formData.sharedMarketValueElection === 'stages'
                  ) {
                    if (currentStep === stepCounter) {
                      const isMarket =
                        formData.sharedMarketValueElection === 'market';
                      return (
                        <div>
                          <h3 className='mb-3 text-base font-semibold'>
                            {isMarket
                              ? 'Market value of the property you are buying'
                              : 'Price of initial share of the property'}
                          </h3>
                          <CurrencyInput
                            value={
                              isMarket
                                ? formData.sharedOwnershipMarketValue
                                : formData.sharedOwnershipInitialShare
                            }
                            onChange={(formatted) =>
                              setFormData(
                                isMarket
                                  ? {
                                      ...formData,
                                      sharedOwnershipMarketValue: formatted,
                                    }
                                  : {
                                      ...formData,
                                      sharedOwnershipInitialShare: formatted,
                                    },
                              )
                            }
                            placeholder='e.g., 500,000'
                          />
                          {isMarket && errors.sharedOwnershipMarketValue && (
                            <Alert variant='destructive' className='mt-3'>
                              <AlertDescription>
                                {errors.sharedOwnershipMarketValue}
                              </AlertDescription>
                            </Alert>
                          )}
                          {!isMarket && errors.sharedOwnershipInitialShare && (
                            <Alert variant='destructive' className='mt-3'>
                              <AlertDescription>
                                {errors.sharedOwnershipInitialShare}
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      );
                    }
                    stepCounter++;
                  }
                }
              }
            }
          }
        }
      }
    }

    if (formData.propertyType === 'leasehold') {
      if (currentStep === stepCounter) {
        return (
          <div>
            <h3 className='mb-1 text-base font-semibold'>
              Start date shown in your lease
            </h3>
            <p className='text-muted-foreground mb-1 text-sm'>
              This is the date your term starts.
            </p>
            <p className='text-muted-foreground mb-3 text-sm'>
              For example, 31 3 2014.
            </p>
            <DateFields
              idPrefix='leaseStart'
              day={formData.leaseStartDay}
              month={formData.leaseStartMonth}
              year={formData.leaseStartYear}
              onDayChange={(v) =>
                setFormData({ ...formData, leaseStartDay: v })
              }
              onMonthChange={(v) =>
                setFormData({ ...formData, leaseStartMonth: v })
              }
              onYearChange={(v) =>
                setFormData({ ...formData, leaseStartYear: v })
              }
            />
            {errors.leaseStartDate && (
              <Alert variant='destructive' className='mt-3'>
                <AlertDescription>{errors.leaseStartDate}</AlertDescription>
              </Alert>
            )}
          </div>
        );
      }
      stepCounter++;

      if (currentStep === stepCounter) {
        return (
          <div>
            <h3 className='mb-1 text-base font-semibold'>
              End date shown in your lease
            </h3>
            <p className='text-muted-foreground mb-1 text-sm'>
              This is the date your term ends.
            </p>
            <p className='text-muted-foreground mb-3 text-sm'>
              For example, 31 3 2017.
            </p>
            <DateFields
              idPrefix='leaseEnd'
              day={formData.leaseEndDay}
              month={formData.leaseEndMonth}
              year={formData.leaseEndYear}
              onDayChange={(v) => setFormData({ ...formData, leaseEndDay: v })}
              onMonthChange={(v) =>
                setFormData({ ...formData, leaseEndMonth: v })
              }
              onYearChange={(v) =>
                setFormData({ ...formData, leaseEndYear: v })
              }
            />
            {leaseTerm && (
              <Alert className='mt-3'>
                <AlertDescription>
                  <strong>Term of lease:</strong> {leaseTerm.years} years{' '}
                  {leaseTerm.days} days
                </AlertDescription>
              </Alert>
            )}
            {errors.leaseEndDate && (
              <Alert variant='destructive' className='mt-3'>
                <AlertDescription>{errors.leaseEndDate}</AlertDescription>
              </Alert>
            )}
          </div>
        );
      }
      stepCounter++;
    }

    const skipPurchasePrice =
      formData.isSharedOwnership === true &&
      formData.sharedMarketValueOption === 'lte500k' &&
      (formData.sharedMarketValueElection === 'market' ||
        formData.sharedMarketValueElection === 'stages');

    if (!skipPurchasePrice && currentStep === stepCounter) {
      return (
        <div>
          <h3 className='mb-1 text-base font-semibold'>
            Enter the purchase price
          </h3>
          <p className='text-muted-foreground mb-3 text-sm'>
            This is the chargeable consideration.
          </p>
          <CurrencyInput
            value={formData.purchasePrice}
            onChange={(formatted) =>
              setFormData({ ...formData, purchasePrice: formatted })
            }
            placeholder='e.g., 500,000'
          />
          {errors.purchasePrice && (
            <Alert variant='destructive' className='mt-3'>
              <AlertDescription>{errors.purchasePrice}</AlertDescription>
            </Alert>
          )}
        </div>
      );
    }

    if (!skipPurchasePrice) {
      stepCounter++;
    }

    if (formData.propertyType === 'leasehold' && currentStep === stepCounter) {
      if (!leaseTerm || !leaseTerm.totalYears || leaseTerm.totalYears <= 0) {
        return (
          <Alert>
            <AlertDescription>
              Please ensure you have entered valid lease start and end dates in
              the previous steps.
            </AlertDescription>
          </Alert>
        );
      }

      if (!rentYearsToCollect || rentYearsToCollect < 1) {
        return (
          <Alert variant='destructive'>
            <AlertDescription>
              Invalid lease term calculated. Please check your lease dates.
            </AlertDescription>
          </Alert>
        );
      }

      return (
        <div>
          <h3 className='mb-4 text-base font-semibold'>
            Enter the annual rent due
          </h3>

          <Alert className='mb-4'>
            <AlertDescription className='text-sm'>
              <strong>Note:</strong> Enter the rent for each calendar year of
              the lease (up to 5 years).
              {leaseTerm.totalYears > 5 &&
                ' The highest rent from the first 5 years will be used for remaining years.'}
            </AlertDescription>
          </Alert>

          <div className='space-y-3'>
            {Array.from({ length: rentYearsToCollect }).map((_, index) => (
              <div key={index} className='space-y-1.5'>
                <Label htmlFor={`year${index + 1}Rent`}>
                  Year {index + 1} rent
                </Label>
                <CurrencyInput
                  id={`year${index + 1}Rent`}
                  value={formData.yearlyRents[index] || ''}
                  onChange={(formatted) => {
                    const newRents = [...formData.yearlyRents];
                    newRents[index] = formatted;
                    setFormData({ ...formData, yearlyRents: newRents });
                  }}
                  placeholder={`e.g., ${getCurrencySign()}5,000`}
                />
              </div>
            ))}
          </div>

          {leaseTerm.totalYears > 5 && (
            <Alert className='mt-4'>
              <AlertDescription className='text-sm'>
                <strong>
                  Highest rent from years 1-5 will be used for years 6-
                  {Math.ceil(leaseTerm.totalYears)}
                </strong>
              </AlertDescription>
            </Alert>
          )}
          {errors.yearlyRents && (
            <Alert variant='destructive' className='mt-3'>
              <AlertDescription>{errors.yearlyRents}</AlertDescription>
            </Alert>
          )}
        </div>
      );
    }

    return null;
  };

  const totalSteps = getTotalSteps();
  const progressPercentage = ((currentStep - 1) / totalSteps) * 100;

  // ---------- Results page ----------
  if (calculationResult) {
    return (
      <div className='mx-auto'>
        <Card className='gap-0 overflow-hidden py-0'>
          <CardHeader className='from-primary to-secondary text-primary-foreground rounded-t-lg bg-linear-to-r px-6 py-4'>
            <CardTitle className='text-xl font-semibold'>
              SDLT Calculation Result
            </CardTitle>
          </CardHeader>
          <CardContent className='pt-6'>
            <div className='mb-6'>
              <h3 className='mb-3 text-lg font-semibold'>
                Results of calculation based on SDLT rules for the effective
                date entered
              </h3>
              <Card className='border-emerald-500'>
                <CardContent className='pt-6'>
                  <h4 className='mb-3 font-semibold'>
                    Result of SDLT calculation
                  </h4>

                  <div className='mb-4 border-b pb-3'>
                    <div className='text-muted-foreground mb-1 text-sm'>
                      Total amount of tax for this transaction
                    </div>
                    <p className='text-3xl font-bold text-emerald-600'>
                      {formatCurrency(calculationResult.totalTax)}
                    </p>
                  </div>

                  {formData.propertyType === 'leasehold' && (
                    <>
                      <div className='mb-2 flex justify-between'>
                        <span className='font-semibold'>Net present value</span>
                        <span>{formatCurrency(calculationResult.rentNPV)}</span>
                      </div>
                      <div className='mb-2 flex justify-between'>
                        <span className='font-semibold'>SDLT on rent</span>
                        <span>{formatCurrency(calculationResult.rentTax)}</span>
                      </div>
                      <div className='mb-2 flex justify-between'>
                        <span className='font-semibold'>SDLT on premium</span>
                        <span>
                          {formatCurrency(calculationResult.premiumTax)}
                        </span>
                      </div>
                    </>
                  )}

                  {formData.propertyType === 'freehold' && (
                    <div className='flex justify-between'>
                      <span className='font-semibold'>Purchase Price:</span>
                      <span>
                        {formatCurrency(
                          parseFloat(formData.purchasePrice.replace(/,/g, '')),
                        )}
                      </span>
                    </div>
                  )}

                  {formData.propertyType === 'leasehold' &&
                    formData.isSharedOwnership === true && (
                      <div className='mb-2 flex justify-between'>
                        <span className='font-semibold'>
                          {formData.sharedMarketValueElection === 'market'
                            ? 'Market Value:'
                            : 'Initial Share Price:'}
                        </span>
                        <span>
                          {formatCurrency(
                            parseFloat(
                              (formData.sharedMarketValueElection === 'market'
                                ? formData.sharedOwnershipMarketValue
                                : formData.sharedOwnershipInitialShare
                              ).replace(/,/g, ''),
                            ),
                          )}
                        </span>
                      </div>
                    )}
                </CardContent>
              </Card>
            </div>

            <div className='mb-6'>
              <h4 className='mb-2 font-semibold'>Transaction Details:</h4>
              <div className='mb-2 flex flex-wrap gap-2'>
                <Badge>
                  {formData.propertyType === 'freehold'
                    ? 'Freehold'
                    : 'Leasehold'}
                </Badge>
                <Badge>
                  {formData.propertyUse === 'residential'
                    ? 'Residential'
                    : 'Non-Residential'}
                </Badge>
                {formData.isNonUKResident &&
                  !formData.isReplacingMainResidence && (
                    <Badge variant='secondary'>Non-UK Resident (+2%)</Badge>
                  )}
                {formData.isPurchasingAsIndividual === true &&
                  formData.willOwnMultipleProperties === true &&
                  formData.isReplacingMainResidence !== true && (
                    <Badge variant='destructive'>
                      Additional Property (+5%)
                    </Badge>
                  )}
                {formData.isReplacingMainResidence === true && (
                  <Badge variant='outline'>
                    Replacing Main Residence (No Surcharges)
                  </Badge>
                )}
                {formData.isSharedOwnership === true && (
                  <Badge variant='outline'>Shared Ownership</Badge>
                )}
              </div>

              {formData.propertyType === 'leasehold' && leaseTerm && (
                <div className='text-muted-foreground mt-2 text-sm'>
                  <strong>Term of lease:</strong> {leaseTerm.years} years{' '}
                  {leaseTerm.days} days
                </div>
              )}
            </div>

            <h4 className='mb-3 font-semibold'>
              SDLT on{' '}
              {formData.propertyType === 'leasehold'
                ? 'premium'
                : 'purchase price'}
            </h4>
            <Table className='mb-6'>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {formData.propertyType === 'leasehold'
                      ? 'Premium'
                      : 'Purchase price'}{' '}
                    bands ({getCurrencySign()})
                  </TableHead>
                  <TableHead className='text-center'>
                    Percentage rate (%)
                  </TableHead>
                  <TableHead className='text-right'>
                    SDLT due ({getCurrencySign()})
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculationResult.premiumBreakdown.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.band}</TableCell>
                    <TableCell className='text-center'>{item.rate}</TableCell>
                    <TableCell className='text-right'>
                      {formatCurrency(item.tax)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className='bg-muted font-semibold'>
                  <TableCell colSpan={2}>
                    SDLT due on the{' '}
                    {formData.propertyType === 'leasehold'
                      ? 'premium'
                      : 'purchase price'}
                  </TableCell>
                  <TableCell className='text-right'>
                    {formatCurrency(calculationResult.premiumTax)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {formData.propertyType === 'leasehold' &&
              calculationResult.rentBreakdown.length > 0 && (
                <>
                  <h4 className='mb-3 font-semibold'>SDLT on rent</h4>
                  <Alert className='mb-3'>
                    <AlertDescription>
                      <strong>Net present value:</strong>{' '}
                      {formatCurrency(calculationResult.rentNPV)}
                    </AlertDescription>
                  </Alert>
                  <Table className='mb-6'>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rent bands ({getCurrencySign()})</TableHead>
                        <TableHead className='text-center'>
                          Percentage rate (%)
                        </TableHead>
                        <TableHead className='text-right'>
                          SDLT due ({getCurrencySign()})
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {calculationResult.rentBreakdown.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.band}</TableCell>
                          <TableCell className='text-center'>
                            {item.rate}
                          </TableCell>
                          <TableCell className='text-right'>
                            {formatCurrency(item.tax)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className='bg-muted font-semibold'>
                        <TableCell colSpan={2}>SDLT due on the rent</TableCell>
                        <TableCell className='text-right'>
                          {formatCurrency(calculationResult.rentTax)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </>
              )}

            <Button onClick={resetCalculator} className='mb-3 cursor-pointer'>
              Start New Calculation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---------- Wizard page ----------
  return (
    <div className='mx-auto space-y-4'>
      <Card className='gap-0 overflow-hidden py-0'>
        <CardHeader className='from-primary to-secondary bg-linear-to-r text-primary-foreground rounded-t-lg px-6 py-4'>
          <CardTitle className='text-primary-foreground text-xl'>
            Stamp Duty Land Tax Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='mb-6'>
            <div className='mb-2 flex justify-between text-sm'>
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className='h-2.5' />
          </div>

          <div>{renderStep()}</div>

          <div className='mt-6 flex justify-between'>
            {currentStep > 1 ? (
              <Button
                variant='outline'
                onClick={handleBack}
                className='cursor-pointer'
              >
                ← Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < totalSteps ? (
              <Button onClick={handleNext} className='cursor-pointer'>
                Continue →
              </Button>
            ) : (
              <Button
                onClick={handleCalculate}
                className='cursor-pointer bg-emerald-600 hover:bg-emerald-700'
              >
                Calculate SDLT
              </Button>
            )}
          </div>

          <div className='my-4 text-center'>
            <Button
              variant='outline'
              size='sm'
              onClick={resetCalculator}
              className='cursor-pointer border-amber-500 text-amber-600 hover:bg-amber-50'
            >
              <RotateCw className='mr-1 h-4 w-4' />
              Start Over
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className='border-0 shadow-none'>
        <CardContent className='pt-6 text-sm'>
          <h5 className='mb-1 font-semibold'>About SDLT</h5>
          <p className='text-muted-foreground mb-0'>
            Stamp Duty Land Tax (SDLT) is a tax paid when purchasing property in
            England and Northern Ireland. The amount depends on the property
            price, type, and your circumstances.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StampDutyCalculatorTab;
