'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { getStripe } from '@/components/common/PaymentElement/CardPaymentForm';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAddPaymentMethodMutation } from '@/store/api/endpoints/client/Landlord/BillingAndPlans/Billing/BillingApi';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useTheme } from 'next-themes';
import { useState, useSyncExternalStore } from 'react';
import { toast } from 'sonner';

interface AddPaymentMethodDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
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

export default function AddPaymentMethodDialog({
  open,
  onClose,
  onSuccess,
}: AddPaymentMethodDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add payment method</DialogTitle>
        </DialogHeader>
        <Elements stripe={getStripe()}>
          <AddPaymentMethodForm onClose={onClose} onSuccess={onSuccess} />
        </Elements>
      </DialogContent>
    </Dialog>
  );
}

function AddPaymentMethodForm({
  onClose,
  onSuccess,
}: Omit<AddPaymentMethodDialogProps, 'open'>) {
  const resolvedTheme = useResolvedTheme();
  const stripe = useStripe();
  const elements = useElements();
  const [addPaymentMethod, { isLoading }] = useAddPaymentMethodMutation();

  const [cardError, setCardError] = useState<string | null>(null);
  const [isDefault, setIsDefault] = useState(false);
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

    setCardError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setCardError('Card details are not ready yet. Please try again.');
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setCardError(error.message ?? 'Card could not be added.');
      return;
    }

    try {
      await addPaymentMethod({
        payment_method_id: paymentMethod.id,
        is_default: isDefault,
      }).unwrap();
      toast.success('Card added.');
      onSuccess?.();
    } catch (err: unknown) {
      const errorData =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: unknown }).data
          : null;
      const errorMessage =
        errorData && typeof errorData === 'object'
          ? (errorData as { detail?: string; message?: string }).detail ||
            (errorData as { detail?: string; message?: string }).message
          : null;
      setCardError(errorMessage || 'Could not add card. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='bg-background border-border dark:bg-background/80 rounded-md border px-3 py-3 shadow-sm'>
        <CardElement options={cardElementOptions} />
      </div>

      <div className='flex items-center gap-2'>
        <Checkbox
          id='set-default-card'
          checked={isDefault}
          onCheckedChange={(checked) => setIsDefault(checked === true)}
        />
        <Label htmlFor='set-default-card' className='text-sm font-normal'>
          Set as default payment method
        </Label>
      </div>

      {cardError && (
        <p
          className='bg-destructive/20 text-danger rounded-md p-2 text-center text-xs'
          role='alert'
        >
          {cardError}
        </p>
      )}

      <DialogFooter>
        <Button
          type='button'
          variant='outline'
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type='submit' disabled={!stripe || !elements || isLoading}>
          {isLoading ? <Loading className='size-4 text-white!' /> : ''}Add card
        </Button>
      </DialogFooter>
    </form>
  );
}
