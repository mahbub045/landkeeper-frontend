'use client';

import { Button } from '@/components/ui/button';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useTheme } from 'next-themes';
import { useState, useSyncExternalStore } from 'react';

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

function useResolvedTheme() {
  const { resolvedTheme } = useTheme();
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return isMounted ? resolvedTheme : 'light';
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
  const resolvedTheme = useResolvedTheme();
  const stripe = useStripe();
  const elements = useElements();

  const [cardError, setCardError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isDark = resolvedTheme === 'dark';

  const cardElementOptions = {
    hidePostalCode: true,
    style: {
      base: {
        color: isDark ? '#f9fafb' : '#111827',
        fontFamily:
          'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: isDark ? '#9ca3af' : '#6b7280',
        },
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
  };

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
      <div className='bg-background border-border dark:bg-background/80 rounded-md border px-3 py-3 shadow-sm'>
        <CardElement options={cardElementOptions} />
      </div>

      {cardError && (
        <p
          className='bg-destructive/20 text-danger rounded-md p-2 text-center text-xs'
          role='alert'
        >
          {cardError}
        </p>
      )}

      <div className='flex justify-end gap-2'>
        {onCancel && (
          <Button
            variant='outline'
            onClick={onCancel}
            disabled={isBusy}
            className='rounded-md border px-4 py-2 text-sm'
          >
            Cancel
          </Button>
        )}
        <Button
          type='submit'
          disabled={!stripe || !elements || isBusy}
          className='bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm disabled:opacity-50'
        >
          {isBusy ? 'Processing…' : `Pay $${amount}`}
        </Button>
      </div>
    </form>
  );
}
