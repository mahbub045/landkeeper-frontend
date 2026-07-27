'use client';

// import { getStripe } from '@/lib/stripeClient';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useState } from 'react';

interface CardPaymentFormProps {
  rentPaymentAlias: string;
  amount: string; // e.g. "850.00" — must match the RentPayment amount
  currency?: string; // defaults to "usd" — adjust to your actual billing currency
  onSuccess: () => void;
  onCancel?: () => void;
}

// loadStripe() is memoized internally by Stripe, but we still only want to
// call it once and reuse the same promise across the whole app.
let stripePromise: Promise<Stripe | null>;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
}

// PaymentElement needs Elements configured with either a real clientSecret,
// or mode + amount + currency up front. Since amount differs per rent
// payment, this form owns its own Elements instance rather than relying on
// the app-wide one in Providers.tsx (which has no options set).
export function CardPaymentForm(props: CardPaymentFormProps) {
  const amountInMinorUnits = Math.round(Number(props.amount) * 100);

  return (
    <Elements
      stripe={getStripe()}
      options={{
        mode: 'payment',
        amount: amountInMinorUnits,
        currency: props.currency ?? 'usd',
        // Restricts to card only — this is what actually removes Amazon
        // Pay, Cash App Pay, Link, wallets, etc. Without this, PaymentElement
        // shows every method enabled in the Stripe Dashboard by default.
        paymentMethodTypes: ['card'],
      }}
    >
      <CardPaymentFormInner {...props} />
    </Elements>
  );
}

function CardPaymentFormInner({
  rentPaymentAlias,
  amount,
  onSuccess,
  onCancel,
}: CardPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [cardError, setCardError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {};

  const isBusy = submitting;

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {/* With only "card" allowed at the Elements level above, this renders
          as a plain card form — no method selector, no accordion. */}
      <PaymentElement />

      {cardError && (
        <p className='text-sm text-red-600' role='alert'>
          {cardError}
        </p>
      )}

      <div className='flex justify-end gap-2'>
        {onCancel && (
          <button
            type='button'
            onClick={onCancel}
            disabled={isBusy}
            className='rounded-md border px-4 py-2 text-sm'
          >
            Cancel
          </button>
        )}
        <button
          type='submit'
          disabled={!stripe || !elements || isBusy}
          className='bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm disabled:opacity-50'
        >
          {isBusy ? 'Processing…' : `Pay $${amount}`}
        </button>
      </div>
    </form>
  );
}
