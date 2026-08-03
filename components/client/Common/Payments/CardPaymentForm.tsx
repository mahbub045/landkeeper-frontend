'use client';

import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useState } from 'react';

interface CardPaymentFormProps {
  amount: string; // display only, e.g. "500.00"
  onSuccess: (paymentMethodId: string) => Promise<void> | void;
  onCancel?: () => void;
}

let stripePromise: Promise<Stripe | null>;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
}

export function CardPaymentForm(props: CardPaymentFormProps) {
  return (
    <Elements stripe={getStripe()}>
      <CardPaymentFormInner {...props} />
    </Elements>
  );
}

function CardPaymentFormInner({
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

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setCardError('Card details are not ready yet. Please try again.');
      setSubmitting(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setCardError(error.message ?? 'Payment failed. Please try again.');
      setSubmitting(false);
      return;
    }

    try {
      await onSuccess(paymentMethod.id);
    } catch (callbackError) {
      const message =
        callbackError instanceof Error
          ? callbackError.message
          : 'Payment could not be completed. Please try a different card.';

      setCardError(message);
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
  };

  const isBusy = submitting;

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='bg-background rounded-md border p-3'>
        <CardElement options={{ hidePostalCode: true }} />
      </div>

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
