'use client';

import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog/DeleteConfirmDialog';
import { cardBrandLabels } from '@/data/client/Landlord/BillingAndPlans/BillingData';
import CardBrandLogo from '@/data/common/CardBrandLogo';
import { PaymentMethod } from '@/types/client/Landlord/BillingAndPlans/BillingType';
import { CreditCard } from 'lucide-react';

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
    <DeleteConfirmDialog
      open={cardToDelete !== null}
      onClose={() => onOpenChange(false)}
      onConfirm={onConfirm}
      isLoading={isDeletePending}
      icon={CreditCard}
      title='Remove this card?'
      description='It will no longer be available for future payments.'
      targetLabel={cardToDelete?.is_default ? 'Default card' : 'Card'}
      targetName={
        cardToDelete && (
          <>
            {cardBrandLabels[cardToDelete.card_brand.toLowerCase()] ??
              cardToDelete.card_brand ??
              'Card'}{' '}
            <span className='tracking-wider'>
              •••• {cardToDelete.last_four}
            </span>
          </>
        )
      }
      targetSubtext={
        cardToDelete &&
        `Expires ${String(cardToDelete.expiry_month).padStart(2, '0')}/${cardToDelete.expiry_year}`
      }
      targetMedia={
        cardToDelete && (
          <CardBrandLogo
            brand={cardToDelete.card_brand}
            className='ring-border/60 flex h-9 w-12 shrink-0 items-center justify-center rounded-md ring-1'
          />
        )
      }
      badge={null}
      impactTitle='Heads up'
      impactNote={
        cardToDelete?.is_default &&
        'This is your default payment method. If you have an active subscription, removing it may cause future payments to fail unless you set another card as default first.'
      }
      cancelLabel='Keep Card'
      confirmLabel='Remove Card'
    />
  );
}
