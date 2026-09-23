'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  useDeletePaymentMethodMutation,
  usePaymewntMethodsQuery,
  useUpdatePaymentMethodMutation,
} from '@/store/api/endpoints/client/Landlord/BillingAndPlans/Billing/BillingApi';
import { PaymentMethod } from '@/types/client/Landlord/BillingAndPlans/BillingType';
import {
  CreditCard,
  Info,
  LoaderCircle,
  MoreVertical,
  Plus,
  Star,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import CardBrandLogo from '../../../../../../data/common/CardBrandLogo';
import AddPaymentMethodDialog from './Dialogs/AddPaymentMethodDialog';
import DeleteCardDialog from './Dialogs/DeleteCardDialog';

export default function PaymentMethodsTab() {
  const { data: paymentMethodsData, isLoading } =
    usePaymewntMethodsQuery(undefined);
  const [updatePaymentMethod, { isLoading: isUpdatePending }] =
    useUpdatePaymentMethodMutation();
  const [deletePaymentMethod, { isLoading: isDeletePending }] =
    useDeletePaymentMethodMutation();

  // Track which specific card is mid-update/delete (by alias) so only that
  // row shows a spinner instead of blocking the whole list.
  const [pendingAlias, setPendingAlias] = useState<
    PaymentMethod['alias'] | null
  >(null);
  const [cardToDelete, setCardToDelete] = useState<PaymentMethod | null>(null);
  const [addCardOpen, setAddCardOpen] = useState(false);

  const cards = paymentMethodsData?.results ?? [];

  const handleSetDefault = async (card: PaymentMethod) => {
    if (card.is_default) return;

    setPendingAlias(card.alias);
    try {
      await updatePaymentMethod({
        card_alias: card.alias,
        is_default: true,
      }).unwrap();
      toast.success('Default payment method updated.');
    } catch (error: unknown) {
      console.error('Failed to update default payment method:', error);
      const errorData =
        error && typeof error === 'object' && 'data' in error
          ? (error as { data?: unknown }).data
          : null;
      const errorMessage =
        errorData && typeof errorData === 'object'
          ? (errorData as { detail?: string; message?: string }).detail ||
            (errorData as { detail?: string; message?: string }).message
          : null;
      toast.error(
        errorMessage || 'Could not update default card. Please try again.',
      );
    } finally {
      setPendingAlias(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!cardToDelete) return;

    setPendingAlias(cardToDelete.alias);
    try {
      await deletePaymentMethod({ card_alias: cardToDelete.alias }).unwrap();
      toast.success('Card removed.');
    } catch (error: unknown) {
      console.error('Failed to delete payment method:', error);
      const errorData =
        error && typeof error === 'object' && 'data' in error
          ? (error as { data?: unknown }).data
          : null;
      const errorMessage =
        errorData && typeof errorData === 'object'
          ? (errorData as { detail?: string; message?: string }).detail ||
            (errorData as { detail?: string; message?: string }).message
          : null;
      toast.error(errorMessage || 'Could not remove card. Please try again.');
    } finally {
      setPendingAlias(null);
      setCardToDelete(null);
    }
  };

  return (
    <div className='border-border/70 rounded-2xl border bg-white p-6 dark:bg-white/4'>
      <div className='mb-5 flex items-center justify-between'>
        <p className='text-sm font-semibold'>Saved payment methods</p>
        <Button size='sm' onClick={() => setAddCardOpen(true)}>
          <Plus />
          Add payment method
        </Button>
      </div>

      <div className='bg-warning/10 text-warning mb-5 flex items-start gap-2 rounded-md p-3 text-xs'>
        <Info className='mt-0.5 size-4 shrink-0' aria-hidden='true' />
        <p>
          Your next bill will be charged to your default card. To use a
          different card, add it below and set it as default.
        </p>
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center py-14'>
          <Loading />
        </div>
      ) : cards.length === 0 ? (
        <div className='border-border/70 flex flex-col items-center justify-center rounded-xl border border-dashed py-14 text-center'>
          <CreditCard
            className='text-muted-foreground mb-3 size-8'
            aria-hidden='true'
          />
          <p className='font-medium'>No payment methods saved</p>
          <p className='text-muted-foreground mt-1 max-w-xs text-sm'>
            Add a card to make future subscription payments faster.
          </p>
        </div>
      ) : (
        <ul className='space-y-2.5'>
          {cards.map((card: PaymentMethod) => {
            const isCardPending = pendingAlias === card.alias;

            return (
              <li
                key={card.alias}
                className='border-border flex items-center gap-3 rounded-md border px-4 py-3'
              >
                <CardBrandLogo brand={card.card_brand} />

                <div className='flex-1'>
                  <p className='text-sm font-medium capitalize'>
                    {card.card_brand ?? 'Card'}{' '}
                    <span className='text-muted-foreground font-normal'>
                      •••• {card.last_four}
                    </span>
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    Expires {String(card.expiry_month).padStart(2, '0')}/
                    {card.expiry_year}
                  </p>
                </div>

                {card.is_default && (
                  <span
                    className={cn(
                      'bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
                    )}
                  >
                    <Star
                      className='size-3'
                      aria-hidden='true'
                      fill='currentColor'
                    />
                    Default
                  </span>
                )}

                {isCardPending ? (
                  <LoaderCircle
                    className='text-muted-foreground size-4 shrink-0 animate-spin'
                    aria-hidden='true'
                  />
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        aria-label='More options'
                        className='text-muted-foreground shrink-0'
                      >
                        <MoreVertical className='size-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-44'>
                      <DropdownMenuItem
                        disabled={card.is_default}
                        onClick={() => handleSetDefault(card)}
                        className='cursor-pointer'
                      >
                        <Star className='size-4' aria-hidden='true' />
                        Set as default
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant='destructive'
                        onClick={() => setCardToDelete(card)}
                        className='cursor-pointer'
                      >
                        <Trash2 className='size-4' aria-hidden='true' />
                        Remove card
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <DeleteCardDialog
        cardToDelete={cardToDelete}
        onOpenChange={(open) => {
          if (!open) setCardToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        isDeletePending={isDeletePending}
      />

      <AddPaymentMethodDialog
        open={addCardOpen}
        onClose={() => setAddCardOpen(false)}
        onSuccess={() => setAddCardOpen(false)}
      />
    </div>
  );
}
