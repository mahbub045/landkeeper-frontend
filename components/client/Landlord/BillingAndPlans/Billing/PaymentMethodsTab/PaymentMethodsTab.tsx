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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cardBrandLabels } from '@/data/client/Landlord/BillingAndPlans/BillingData';
import { cn } from '@/lib/utils';
import {
  useDeletePaymentMethodMutation,
  usePaymewntMethodsQuery,
  useUpdatePaymentMethodMutation,
} from '@/store/api/endpoints/client/Landlord/BillingAndPlans/Billing/BillingApi';
import { PaymentMethod } from '@/types/client/Landlord/BillingAndPlans/BillingType';
import {
  CreditCard,
  LoaderCircle,
  MoreVertical,
  Star,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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

  const cards = paymentMethodsData?.cards ?? [];

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
        {/* <Button size='sm'>
          <Plus />
          Add payment method
        </Button> */}
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
                <div className='bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg'>
                  <CreditCard
                    className='text-muted-foreground size-4'
                    aria-hidden='true'
                  />
                </div>

                <div className='flex-1'>
                  <p className='text-sm font-medium'>
                    {cardBrandLabels[card.card_brand.toLowerCase()] ??
                      card.card_brand}{' '}
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
                        disabled={card.is_default}
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

      <AlertDialog
        open={cardToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setCardToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this card?</AlertDialogTitle>
            <AlertDialogDescription>
              {cardToDelete && (
                <>
                  {cardBrandLabels[cardToDelete.card_brand.toLowerCase()] ??
                    cardToDelete.card_brand}{' '}
                  ending in {cardToDelete.last_four} will no longer be available
                  for future payments.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant='destructive' onClick={handleConfirmDelete}>
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
    </div>
  );
}
