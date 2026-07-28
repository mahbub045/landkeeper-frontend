import { PaymentMethodOption, PaymentRecord, RentSummary } from '@/types/client/Tenant/TenantTypes';


export const dummyRentSummary: RentSummary = {
  currentRentAmount: 1450,
  rentFrequencyLabel: "Per calendar month",
  nextDueDate: "2026-08-01",
  daysUntilDue: 16,
  outstandingBalance: 0,
  isAccountUpToDate: true,
};

export const dummyPaymentMethods: PaymentMethodOption[] = [
  {
    id: "gocardless",
    provider: "gocardless",
    title: "Set up Direct Debit",
    description:
      "Set up hassle-free, recurring monthly transfers directly from your bank account.",
    ctaLabel: "Set Up Direct Debit",
    action: "setup",
  },
  {
    id: "stripe",
    provider: "stripe",
    title: "Pay with Card",
    description: "Pay instantly using a credit or debit card.",
    ctaLabel: "Pay with Card",
    action: "setup",
  },
];

export const dummyPaymentHistory: PaymentRecord[] = [
  {
    id: "1",
    date: "2026-07-01",
    reference: "Rent Payment (July 2026)",
    amount: 1450,
    status: "cleared",
    receiptUrl: "#",
  },
  {
    id: "2",
    date: "2026-06-01",
    reference: "Rent Payment (June 2026)",
    amount: 1450,
    status: "cleared",
    receiptUrl: "#",
  },
];