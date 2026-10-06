'use client';

import Loading from '@/components/common/CustomLoader/Loading';
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
import { useDisconnectStripeAccountMutation } from '@/store/api/endpoints/common/ProfileSettings/StripeAccountSetupApi';
import { TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';

interface DisconnectStripeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDisconnected?: () => void;
}

const DisconnectStripeDialog: React.FC<DisconnectStripeDialogProps> = ({
  open,
  onOpenChange,
  onDisconnected,
}) => {
  const [disconnectStripeAccount, { isLoading: isDisconnecting }] =
    useDisconnectStripeAccountMutation();

  const handleConfirm = async () => {
    try {
      await disconnectStripeAccount(undefined).unwrap();
      toast.success('Stripe account disconnected.');
      onOpenChange(false);
      onDisconnected?.();
    } catch {
      toast.error('Could not disconnect Stripe account. Please try again.');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className='bg-danger/10 text-danger'>
            <TriangleAlert aria-hidden='true' />
          </AlertDialogMedia>
          <AlertDialogTitle>Disconnect Stripe account</AlertDialogTitle>
          <AlertDialogDescription>
            You won&apos;t be able to receive rent payments or payouts until
            you reconnect a Stripe account.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => onOpenChange(false)}
            disabled={isDisconnecting}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant='destructive'
            onClick={handleConfirm}
            disabled={isDisconnecting}
          >
            {isDisconnecting && <Loading size={16} className='text-danger' />}
            Disconnect
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DisconnectStripeDialog;
