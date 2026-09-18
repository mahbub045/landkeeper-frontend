'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PricingPlan } from '@/types/client/Landlord/BillingAndPlans/PricingPlansType';
import { ArrowRight, TriangleAlert } from 'lucide-react';

interface PricingPlanDowngradeDialogProps {
  currentPlanName?: string;
  downgradePlan: PricingPlan | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function PricingPlanDowngradeDialog({
  currentPlanName,
  downgradePlan,
  onOpenChange,
  onConfirm,
}: PricingPlanDowngradeDialogProps) {
  return (
    <AlertDialog open={!!downgradePlan} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className='bg-danger/10 text-danger'>
            <TriangleAlert aria-hidden='true' />
          </AlertDialogMedia>
          <AlertDialogTitle>Confirm plan downgrade</AlertDialogTitle>
          <AlertDialogDescription>
            This change takes effect on your{' '}
            <span className='text-foreground font-semibold'>
              next billing cycle
            </span>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className='flex items-center justify-center gap-3 py-1 text-sm font-medium'>
          <span className='text-muted-foreground rounded-full border px-3 py-1'>
            {currentPlanName}
          </span>
          <ArrowRight
            className='text-muted-foreground size-4 shrink-0'
            aria-hidden='true'
          />
          <span className='bg-primary/10 text-primary rounded-full px-3 py-1'>
            {downgradePlan?.name}
          </span>
        </div>

        <div className='border-danger/20 bg-danger/10 text-danger rounded-lg border p-3 text-sm'>
          You&apos;ll keep your current plan and its benefits until the end of
          this billing cycle. The new plan starts on your next billing date.
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Agreed</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
