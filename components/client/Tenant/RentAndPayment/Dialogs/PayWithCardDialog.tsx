'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardPaymentForm } from '@/components/client/Common/Payments/CardPaymentForm';
import { useCreateRentPaymentMutation, usePayWithCardMutation } from '@/store/api/endpoints/client/Tenant/PaymentsApi/RentPaymentsApi';


interface PayWithCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function PayWithCardDialog({
  open,
  onOpenChange,
  onSuccess,
}: PayWithCardDialogProps) {
  const [step, setStep] = useState<'details' | 'card'>('details');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
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
    setClientSecret(null);
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

      const { client_secret } = await payWithCard({
        rent_payment: rentPayment.alias,
        amount,
      }).unwrap();

      setClientSecret(client_secret);
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
          <DialogTitle>{step === 'details' ? 'Pay Rent' : 'Card Details'}</DialogTitle>
        </DialogHeader>

        {step === 'details' && (
          <form onSubmit={handleDetailsSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='amount'>Amount</Label>
              <Input
                id='amount'
                type='number'
                step='0.01'
                min='0'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='due-date'>Due Date</Label>
              <Input
                id='due-date'
                type='date'
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            {formError && (
              <p className='text-sm text-red-600' role='alert'>
                {formError}
              </p>
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
                {isBusy ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  'Continue to Payment'
                )}
              </Button>
            </div>
          </form>
        )}

        {step === 'card' && clientSecret && (
          <CardPaymentForm
            clientSecret={clientSecret}
            amount={amount}
            onSuccess={() => {
              onSuccess?.();
              resetAndClose();
            }}
            onCancel={resetAndClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}