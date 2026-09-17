'use client';

import { CardPaymentForm } from '@/components/client/Common/Payments/CardPaymentForm';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { PricingPlan } from '@/types/client/Landlord/BillingAndPlans/PricingPlansType';

interface PricingPlanPaymentDialogProps {
  selectedPlan: PricingPlan | null;
  onOpenChange: (open: boolean) => void;
  // Resolves with the client_secret (and its mode) returned by the backend
  // after the subscription/plan-select call.
  onPaymentMethod: (
    paymentMethodId: string,
  ) => Promise<{ clientSecret: string; mode?: 'payment' | 'setup' }>;
  // Fired once Stripe has actually confirmed the PaymentIntent succeeded.
  onConfirmed: () => Promise<void> | void;
  onCancel: () => void;
}

export default function PricingPlanPaymentDialog({
  selectedPlan,
  onOpenChange,
  onPaymentMethod,
  onConfirmed,
  onCancel,
}: PricingPlanPaymentDialogProps) {
  return (
    <Dialog open={selectedPlan !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>
          Start your{' '}
          <span className='text-primary font-bold'>{selectedPlan?.name}</span>{' '}
          subscription
        </DialogTitle>
        {selectedPlan && (
          <CardPaymentForm
            amount={Number(selectedPlan.monthly_price).toFixed(2)}
            onSuccess={onPaymentMethod}
            onConfirmed={onConfirmed}
            onCancel={onCancel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}