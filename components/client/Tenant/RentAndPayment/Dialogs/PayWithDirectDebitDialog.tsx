'use client';

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
  usePayWithDirectDebitMutation,
} from '@/store/api/endpoints/client/Tenant/PaymentsApi/RentPaymentsApi';
import { PayWithDirectDebitDialogProps } from '@/types/client/Tenant/TenantTypes';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { PaymentDialogSteps } from './PaymentDialogSteps';

export const PayWithDirectDebitDialog: React.FC<
  PayWithDirectDebitDialogProps
> = ({ open, onOpenChange, onSuccess }) => {
  const [step, setStep] = useState<'details' | 'confirmation'>('details');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const [createRentPayment, { isLoading: isCreating }] =
    useCreateRentPaymentMutation();
  const [payWithDirectDebit, { isLoading: isSubmitting }] =
    usePayWithDirectDebitMutation();

  const isBusy = isCreating || isSubmitting;

  const resetAndClose = () => {
    setStep('details');
    setAmount('');
    setDueDate('');
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

      await payWithDirectDebit({
        rent_payment: rentPayment.alias,
      }).unwrap();

      setStep('confirmation');
      onSuccess?.();
    } catch (err) {
      console.error('Failed to request Direct Debit payment:', err);
      setFormError(
        'Something went wrong while notifying your bank. Please try again.',
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && resetAndClose()}>
      <DialogContent className='max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {step === 'details' ? 'Request Rent Deduction' : 'Request Sent'}
          </DialogTitle>
        </DialogHeader>
        {step === 'details' && (
          <PaymentDialogSteps
            steps={[{ label: 'Details' }, { label: 'Confirmation' }]}
            currentIndex={0}
          />
        )}

        {step === 'details' && (
          <form onSubmit={handleDetailsSubmit} className='space-y-4'>
            <div className='bg-muted/40 space-y-4 rounded-lg border p-4'>
              <div className='space-y-2'>
                <Label
                  htmlFor='dd-amount'
                  className='text-muted-foreground text-xs font-medium tracking-wide uppercase'
                >
                  Amount
                </Label>
                <div className='relative'>
                  <Input
                    id='dd-amount'
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
                  htmlFor='dd-due-date'
                  className='text-muted-foreground text-xs font-medium tracking-wide uppercase'
                >
                  Due Date
                </Label>
                <Input
                  id='dd-due-date'
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
                {isBusy && <Loader2 className='mr-1 h-4 w-4 animate-spin' />}
                {isBusy ? 'Processing…' : 'Notify Bank'}
              </Button>
            </div>
          </form>
        )}

        {step === 'confirmation' && (
          <div className='flex flex-col items-center gap-4 py-6 text-center'>
            <div className='bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full'>
              <CheckCircle2 className='text-primary h-8 w-8' />
            </div>
            <div className='space-y-1'>
              <p className='text-lg font-semibold'>
                Your bank has been notified
              </p>
              <p className='text-muted-foreground text-sm'>
                We&apos;ve requested ৳{amount} to be deducted for the payment
                due {dueDate}.
              </p>
            </div>
            <p className='text-muted-foreground text-xs'>
              This may take a few days to clear, you&apos;ll see it update in
              your payment history once confirmed.
            </p>
            <Button onClick={resetAndClose} className='mt-2 w-full sm:w-fit'>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
