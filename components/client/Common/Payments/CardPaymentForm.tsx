'use client';

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useState } from 'react';

interface CardPaymentFormProps {
  clientSecret: string; // from POST /tenant/rent-payments/pay-with-card
  amount: string; // display only, e.g. "500.00"
  onSuccess: () => void;
  onCancel?: () => void;
}

let stripePromise: Promise<Stripe | null>;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
}

// Elements is initialized with the REAL clientSecret from the backend —
// Stripe reads amount/currency/allowed methods from the PaymentIntent
// itself, so we don't (and shouldn't) pass mode/amount/currency here.
export function CardPaymentForm(props: CardPaymentFormProps) {
  return (
    <Elements
      stripe={getStripe()}
      options={{
        clientSecret: props.clientSecret,
        appearance: { theme: 'stripe' },
      }}
    >
      <CardPaymentFormInner {...props} />
    </Elements>
  );
}

function CardPaymentFormInner({
  clientSecret,
  amount,
  onSuccess,
  onCancel,
}: CardPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [cardError, setCardError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setCardError(null);

    // Validates the PaymentElement fields before confirming.
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setCardError(submitError.message ?? 'Please check your card details.');
      setSubmitting(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        // Stripe requires this even when redirect: 'if_required' — it's
        // only used if the card needs an off-page 3DS challenge.
        return_url: `${window.location.origin}/client/tenant/rent-and-payments`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setCardError(error.message ?? 'Payment failed. Please try again.');
      setSubmitting(false);
      return;
    }

    if (
      paymentIntent?.status === 'succeeded' ||
      paymentIntent?.status === 'processing'
    ) {
      onSuccess();
    } else {
      setCardError('Payment could not be completed. Please try a different card.');
    }

    setSubmitting(false);
  };

  const isBusy = submitting;

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
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