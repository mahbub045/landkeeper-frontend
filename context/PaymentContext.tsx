'use client';
import { CardPaymentForm } from '@/components/client/Common/Payments/CardPaymentForm';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { usePayWithCardMutation } from '@/store/api/endpoints/client/Tenant/PaymentsApi/RentPaymentsApi';
import { createContext, useContext, useEffect, useState } from 'react';

interface PaymentRequest {
  rentPaymentAlias: string;
  amount: string;
  onSuccess?: () => void;
}

const PaymentContext = createContext<{
  openPayment: (req: PaymentRequest) => void;
} | null>(null);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [request, setRequest] = useState<PaymentRequest | null>(null);
  const [payWithCard, { data, isLoading, error }] = usePayWithCardMutation();

  useEffect(() => {
    if (!request) return;
    payWithCard({
      rent_payment: request.rentPaymentAlias,
      amount: request.amount,
    });
  }, [request]);

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
          {request && data?.client_secret && (
            <CardPaymentForm
              clientSecret={data.client_secret}
              amount={request.amount}
              onSuccess={() => {
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
