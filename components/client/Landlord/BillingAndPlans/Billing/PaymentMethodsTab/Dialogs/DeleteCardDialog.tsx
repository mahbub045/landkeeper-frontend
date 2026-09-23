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
import CardBrandLogo from '@/data/common/CardBrandLogo';
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
          <AlertDialogTitle className='text-danger -mb-3 text-xl'>
            Remove this card?
          </AlertDialogTitle>
          <AlertDialogDescription className='text-muted-foreground text-xs'>
            It will no longer be available for future payments.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {cardToDelete && (
          <div className='border-border/70 from-muted/40 flex items-center gap-3 rounded-xl border bg-linear-to-br to-transparent p-4'>
            <CardBrandLogo
              brand={cardToDelete.card_brand}
              className='ring-border/60 flex h-9 w-12 shrink-0 items-center justify-center rounded-md ring-1'
            />
            <div className='min-w-0 flex-1'>
              <p className='text-sm font-semibold'>
                {cardBrandLabels[cardToDelete.card_brand.toLowerCase()] ??
                  cardToDelete.card_brand ??
                  'Card'}{' '}
                <span className='text-muted-foreground font-normal tracking-wider'>
                  •••• {cardToDelete.last_four}
                </span>
              </p>
              <p className='text-muted-foreground text-xs'>
                Expires {String(cardToDelete.expiry_month).padStart(2, '0')}/
                {cardToDelete.expiry_year}
              </p>
            </div>
          </div>
        )}

        {cardToDelete?.is_default && (
          <div className='border-danger/20 bg-danger/10 text-danger flex gap-2 rounded-lg border p-3 text-sm'>
            <TriangleAlert
              className='mt-0.5 size-4 shrink-0'
              aria-hidden='true'
            />
            <span>
              This is your default payment method. If you have an active
              subscription, removing it may cause future payments to fail unless
              you set another card as default first.
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
