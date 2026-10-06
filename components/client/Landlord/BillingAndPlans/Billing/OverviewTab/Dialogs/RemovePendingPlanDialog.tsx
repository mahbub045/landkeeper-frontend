'use client';

import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog/DeleteConfirmDialog';
import { RemovePendingPlanDialogProps } from '@/types/client/Landlord/BillingAndPlans/BillingType';
import { formatDate } from '@/utils/formatters';
import { CalendarClock, CalendarX } from 'lucide-react';

export default function RemovePendingPlanDialog({
  open,
  pendingPlan,
  currentPlanName,
  onOpenChange,
  onConfirm,
  isRemovePending,
}: RemovePendingPlanDialogProps) {
  return (
    <DeleteConfirmDialog
      open={open}
      onClose={() => onOpenChange(false)}
      onConfirm={onConfirm}
      isLoading={isRemovePending}
      icon={CalendarX}
      title='Remove scheduled plan?'
      description="You'll stay on your current plan."
      targetLabel='Scheduled plan'
      targetName={pendingPlan?.name}
      targetSubtext={
        pendingPlan && `$${Number(pendingPlan.monthly_price).toFixed(2)}/month`
      }
      targetIcon={CalendarClock}
      badge={null}
      impactTitle='Heads up'
      impactNote={
        <>
          The change scheduled for{' '}
          <span className='font-semibold'>
            {pendingPlan && formatDate(pendingPlan.effective_date)}
          </span>{' '}
          will be cancelled and you&apos;ll continue on{' '}
          <span className='font-semibold'>{currentPlanName}</span>.
        </>
      }
      cancelLabel='Keep Change'
      confirmLabel='Remove Plan'
    />
  );
}
