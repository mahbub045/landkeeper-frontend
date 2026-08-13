export interface RemortgageCalculatorState {
  mortgageAmount: string;
  arrangementFee: string;
  mortgageType: string;
  interestRate: string;
  years: string;
  months: string;
}

export interface RemortgageCalculationResults {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  totalRepayments: number;
}

export interface StampDutyCalculationBreakdown {
  band: string;
  amount: number;
  rate: number;
  tax: number;
  npv?: number;
}
export interface StampDutyLeaseTerm {
  years: number;
  days: number;
  totalDays: number;
  totalYears: number;
  calendarYearsSpanned?: number;
}
export interface StampDutyFormData {
  propertyType: string;
  propertyUse: string;
  effectiveDay: string;
  effectiveMonth: string;
  effectiveYear: string;
  isNonUKResident: boolean | null;
  isPurchasingAsIndividual: boolean | null;
  willOwnMultipleProperties: boolean | null;
  isReplacingMainResidence: boolean | null;
  hasEverOwnedProperty: boolean | null;
  willThisBeMainResidence: boolean | null;
  isSharedOwnership: boolean | null;
  sharedMarketValueOption: string;
  sharedMarketValueElection: string;
  sharedOwnershipMarketValue: string;
  sharedOwnershipInitialShare: string;
  leaseStartDay: string;
  leaseStartMonth: string;
  leaseStartYear: string;
  leaseEndDay: string;
  leaseEndMonth: string;
  leaseEndYear: string;
  purchasePrice: string;
  yearlyRents: string[];
}

export type StampDutyOption = { value: string; label: string };

export type RentIncreaseFrequency = 'week' | 'month';
