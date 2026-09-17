'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cardBrandLabels } from '@/data/client/Landlord/BillingAndPlans/BillingData';
import { PaymentMethod } from '@/types/client/Landlord/BillingAndPlans/BillingType';
import { Trash2, TriangleAlert } from 'lucide-react';

interface DeleteCardDialogProps {
  cardToDelete: PaymentMethod | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeletePending: boolean;
}

export default function DeleteCardDialog({
  cardToDelete,
  onOpenChange,
  onConfirm,
  isDeletePending,
}: DeleteCardDialogProps) {
  return (
    <AlertDialog open={cardToDelete !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove this card?</AlertDialogTitle>
          <AlertDialogDescription>
            {cardToDelete && (
              <>
                {cardBrandLabels[cardToDelete.card_brand.toLowerCase()] ??
                  cardToDelete.card_brand}{' '}
                ending in{' '}
                <span className='text-primary font-semibold'>
                  {cardToDelete.last_four}
                </span>{' '}
                will no longer be available for future payments.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {cardToDelete?.is_default && (
          <div className='border-danger/20 bg-danger/10 text-danger flex gap-2 rounded-lg border p-3 text-sm'>
            <TriangleAlert
              className='mt-0.5 size-4 shrink-0'
              aria-hidden='true'
            />
            <span>
              This is your default payment method. If you have an active
              subscription, removing it may cause future payments to fail
              unless you set another card as default first.
            </span>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant='destructive' onClick={onConfirm}>
            {isDeletePending ? (
              <Loading className='text-danger! size-4' />
            ) : (
              <Trash2 className='size-4' aria-hidden='true' />
            )}
            Remove card
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
