// context/PaymentContext.tsx
'use client';
import { createContext, useContext, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { CardPaymentForm } from '@/components/client/Common/Payments/CardPaymentForm';

interface PaymentRequest {
  rentPaymentAlias: string;
  amount: string;
  currency?: string;
  onSuccess?: () => void;
}

const PaymentContext = createContext<{ openPayment: (req: PaymentRequest) => void } | null>(null);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [request, setRequest] = useState<PaymentRequest | null>(null);

  return (
    <PaymentContext.Provider value={{ openPayment: setRequest }}>
      {children}
      <Dialog open={!!request} onOpenChange={(open) => !open && setRequest(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogTitle>Payment</DialogTitle>
          {request && (
            <CardPaymentForm
              rentPaymentAlias={request.rentPaymentAlias}
              amount={request.amount}
              currency={request.currency}
              onSuccess={() => {
                request.onSuccess?.();
                setRequest(null);
              }}
              onCancel={() => setRequest(null)}
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