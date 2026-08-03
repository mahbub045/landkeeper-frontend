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
import {
  useCreateRentPaymentMutation,
  usePayWithCardMutation,
} from '@/store/api/endpoints/client/Tenant/PaymentsApi/RentPaymentsApi';
import { PayWithCardDialogProps } from '@/types/client/Tenant/TenantTypes';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { PaymentDialogSteps } from './PaymentDialogSteps';

export const PayWithCardDialog: React.FC<PayWithCardDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [step, setStep] = useState<'details' | 'card'>('details');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [rentPaymentAlias, setRentPaymentAlias] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [createRentPayment, { isLoading: isCreating }] =
    useCreateRentPaymentMutation();
  const [payWithCard, { isLoading: isInitiatingCharge }] =
    usePayWithCardMutation();

  const isBusy = isCreating || isInitiatingCharge;

  const resetAndClose = () => {
    setStep('details');
    setAmount('');
    setDueDate('');
    setRentPaymentAlias(null);
    setFormError(null);
    onOpenChange(false);
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      const rentPayment = await createRentPayment({
        amount,
        due_date: dueDate,
      }).unwrap();

      setRentPaymentAlias(rentPayment.alias);
      setStep('card');
    } catch (err) {
      console.error('Failed to start card payment:', err);
      setFormError(
        'Something went wrong while starting the payment. Please try again.',
      );
    }
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

            {formError && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{formError}</AlertDescription>
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

        {step === 'card' && rentPaymentAlias && (
          <CardPaymentForm
            amount={amount}
            onSuccess={async (paymentMethodId) => {
              setFormError(null);

              try {
                await payWithCard({
                  rent_payment: rentPaymentAlias,
                  payment_method_id: paymentMethodId,
                  amount,
                }).unwrap();

                onSuccess?.();
                resetAndClose();
              } catch (err) {
                console.error('Failed to complete card payment:', err);
                const message =
                  'Something went wrong while completing the payment. Please try again.';
                setFormError(message);
                throw new Error(message);
              }
            }}
            onCancel={resetAndClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
