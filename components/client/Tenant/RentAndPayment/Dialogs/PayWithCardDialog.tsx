'use client';

import { CardPaymentForm } from '@/components/client/Common/Payments/CardPaymentForm';
import Loading from '@/components/common/CustomLoader/Loading';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePayWithCardMutation } from '@/store/api/endpoints/client/Tenant/PaymentsApi/RentPaymentsApi';
import { PayWithCardDialogProps } from '@/types/client/Tenant/RentAndPayments/RentAndPaymentsType';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { PaymentDialogSteps } from './PaymentDialogSteps';

function getApiErrorMessages(error: unknown) {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: unknown }).data;

    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const messages: string[] = [];

      for (const [, value] of Object.entries(data as Record<string, unknown>)) {
        if (Array.isArray(value)) {
          value.forEach((item) => messages.push(String(item)));
          continue;
        }

        if (typeof value === 'string') {
          messages.push(value);
        }
      }

      if (messages.length > 0) {
        return messages;
      }
    }
  }

  if (error && typeof error === 'object' && 'error' in error) {
    const message = (error as { error?: unknown }).error;

    if (typeof message === 'string' && message.trim()) {
      return [message];
    }
  }

  return [
    'Something went wrong while completing the payment. Please try again.',
  ];
}

export const PayWithCardDialog: React.FC<PayWithCardDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [step, setStep] = useState<'details' | 'card'>('details');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const [payWithCard, { isLoading: isInitiatingCharge }] =
    usePayWithCardMutation();

  const isBusy = isInitiatingCharge;

  const resetAndClose = () => {
    setStep('details');
    setAmount('');
    setDueDate('');
    setFormErrors([]);
    onOpenChange(false);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);
    setStep('card');
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && resetAndClose()}>
      <DialogContent className='max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {step === 'details' ? 'Pay Rent' : 'Card Details'}
          </DialogTitle>
        </DialogHeader>
        <PaymentDialogSteps
          steps={[{ label: 'Details' }, { label: 'Card' }]}
          currentIndex={step === 'details' ? 0 : 1}
        />

        {step === 'details' && (
          <form onSubmit={handleDetailsSubmit} className='space-y-4'>
            <div className='bg-muted/40 space-y-4 rounded-lg border p-4'>
              <div className='space-y-2'>
                <Label
                  htmlFor='amount'
                  className='text-muted-foreground text-xs font-medium tracking-wide uppercase'
                >
                  Amount
                </Label>
                <div className='relative'>
                  <Input
                    id='amount'
                    type='number'
                    step='0.01'
                    min='0'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className='pl-7 text-lg font-semibold'
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <Label
                  htmlFor='due-date'
                  className='text-muted-foreground text-xs font-medium tracking-wide uppercase'
                >
                  Due Date
                </Label>
                <Input
                  id='due-date'
                  type='date'
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {formErrors.length > 0 && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>
                  <ul className='bg-destructive/20 text-danger space-y-1 rounded-md p-2 text-center text-xs'>
                    {formErrors.map((message, index) => (
                      <li key={`${message}-${index}`}>{message}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={resetAndClose}
                disabled={isBusy}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isBusy}>
                {isBusy && <Loading className='h-4 w-4' />}
                {isBusy ? 'Processing…' : 'Continue to Payment'}
              </Button>
            </div>
          </form>
        )}

        {step === 'card' && (
          <CardPaymentForm
            amount={amount}
            onSuccess={async (paymentMethodId) => {
              setFormErrors([]);

              try {
                await payWithCard({
                  due_date: dueDate,
                  payment_method_id: paymentMethodId,
                  amount,
                }).unwrap();

                onSuccess?.();
                resetAndClose();
              } catch (err) {
                console.error('Failed to complete card payment:', err);
                const messages = getApiErrorMessages(err);
                setFormErrors(messages);
                throw new Error(messages.join(' | '));
              }
            }}
            onCancel={resetAndClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
