'use client';
import { CardPaymentForm } from '@/components/client/Common/Payments/CardPaymentForm';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { usePayWithCardMutation } from '@/store/api/endpoints/client/Tenant/PaymentsApi/RentPaymentsApi';
import { createContext, useContext, useState } from 'react';

interface PaymentRequest {
  amount: string;
  dueDate: string;
  onSuccess?: () => void;
}

const PaymentContext = createContext<{
  openPayment: (req: PaymentRequest) => void;
} | null>(null);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [request, setRequest] = useState<PaymentRequest | null>(null);
  const [payWithCard, { isLoading, error }] = usePayWithCardMutation();

  const handleClose = () => setRequest(null);

  return (
    <PaymentContext.Provider value={{ openPayment: setRequest }}>
      {children}
      <Dialog open={!!request} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className='max-h-[90vh] overflow-y-auto'>
          <DialogTitle>Payment</DialogTitle>
          {isLoading && (
            <p className='text-muted-foreground text-sm'>Preparing payment…</p>
          )}
          {error && (
            <p className='text-sm text-red-600'>
              Could not start payment. Please try again.
            </p>
          )}
          {request && (
            <CardPaymentForm
              amount={request.amount}
              onSuccess={async (paymentMethodId) => {
                await payWithCard({
                  due_date: request.dueDate,
                  payment_method_id: paymentMethodId,
                  amount: request.amount,
                }).unwrap();

                request.onSuccess?.();
                handleClose();
              }}
              onCancel={handleClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error('usePayment must be used within PaymentProvider');
  return ctx;
}
