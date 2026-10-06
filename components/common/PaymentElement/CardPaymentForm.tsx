'use client';

import { Button } from '@/components/ui/button';
import { getCurrencySign } from '@/utils/formatters';
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
  // Called once Stripe has created a PaymentMethod. Must resolve with the
  // client_secret returned by your backend so this component can confirm
  // it. `mode` tells us whether that secret belongs to a PaymentIntent
  // ("payment") or a SetupIntent ("setup", e.g. trials / $0 due now).
  onSuccess: (
    paymentMethodId: string,
  ) => Promise<{ clientSecret: string; mode?: 'payment' | 'setup' }>;
  // Called once the PaymentIntent has actually been confirmed as
  // succeeded/processing. This is the real "payment is done" signal.
  onConfirmed: () => Promise<void> | void;
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
  onConfirmed,
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

    // Step 1: create a PaymentMethod from the card details.
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
      // Step 2: tell the backend which plan + payment method to use.
      // It creates the subscription and returns a client_secret for either
      // a PaymentIntent ("payment") or a SetupIntent ("setup").
      const { clientSecret, mode = 'payment' } = await onSuccess(
        paymentMethod.id,
      );

      // Step 3: confirm with Stripe using that secret. Which method we call
      // must match what the secret was issued for, or Stripe rejects it.
      // This is also what triggers any 3D Secure / SCA challenge if needed.
      let confirmError: import('@stripe/stripe-js').StripeError | undefined;
      let isOk = false;

      if (mode === 'setup') {
        const result = await stripe.confirmCardSetup(clientSecret, {
          payment_method: paymentMethod.id,
        });
        confirmError = result.error;
        isOk = result.setupIntent?.status === 'succeeded';
      } else {
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });
        confirmError = result.error;
        isOk =
          result.paymentIntent?.status === 'succeeded' ||
          result.paymentIntent?.status === 'processing';
      }

      if (confirmError) {
        setCardError(
          confirmError.message ??
            'Payment could not be confirmed. Please try again.',
        );
        setSubmitting(false);
        return;
      }

      if (!isOk) {
        setCardError('Payment was not completed. Please try again.');
        setSubmitting(false);
        return;
      }

      // Step 4: only now is the payment actually done.
      await onConfirmed();
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
          {isBusy ? 'Processing…' : `Pay ${getCurrencySign()}${amount}`}
        </Button>
      </div>
    </form>
  );
}