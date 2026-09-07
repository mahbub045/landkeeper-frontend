'use client';

import { CardPaymentForm } from '@/components/client/Common/Payments/CardPaymentForm';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { PricingPlan } from '@/types/client/Landlord/BillingAndPlans/PricingPlansType';

interface PricingPlanPaymentDialogProps {
  selectedPlan: PricingPlan | null;
  onOpenChange: (open: boolean) => void;
  onPaymentMethod: (paymentMethodId: string) => Promise<void>;
  onCancel: () => void;
}

export default function PricingPlanPaymentDialog({
  selectedPlan,
  onOpenChange,
  onPaymentMethod,
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
            onCancel={onCancel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
