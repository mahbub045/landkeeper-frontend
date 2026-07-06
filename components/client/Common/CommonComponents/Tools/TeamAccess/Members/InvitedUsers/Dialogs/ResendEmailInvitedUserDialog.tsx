import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useResendInviteEmailMutation } from '@/store/api/endpoints/client/Common/Tools/TeamAccess/TeamAccessApi';
import { ResendEmailInvitedUserDialogProps } from '@/types/client/Common/Tools/TeamAccess/InvitedUsersTypes';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { AlertCircle, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

const ResendEmailInvitedUserDialog: React.FC<
  ResendEmailInvitedUserDialogProps
> = ({ isOpen, onClose, inviteUserData }) => {
  const [resendInviteEmail, { isLoading }] = useResendInviteEmailMutation();

  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleClose = () => {
    setGeneralError(null);
    onClose();
  };

  const handleResendEmail = async () => {
    if (!inviteUserData) return;

    setGeneralError(null);

    try {
      await resendInviteEmail(inviteUserData.alias).unwrap();

      toast.success('Invite email resent successfully');
      handleClose();
    } catch (error) {
      console.error('Resend Invite Email Error:', error);

      let message = 'Failed to resend invite email. Please try again.';

      if ((error as FetchBaseQueryError)?.status) {
        const fetchError = error as FetchBaseQueryError;

        if (fetchError.data && typeof fetchError.data === 'object') {
          const data = fetchError.data as {
            detail?: string;
            message?: string;
            error?: string;
          };

          message = data.detail || data.message || data.error || message;
        } else if ('error' in fetchError) {
          message = fetchError.error;
        }
      } else {
        const serializedError = error as SerializedError;

        if (serializedError.message) {
          message = serializedError.message;
        }
      }

      setGeneralError(message);
      toast.error(message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Resend Invitation Email</DialogTitle>

          <DialogDescription>
            {inviteUserData ? (
              <>
                Resend the invitation email to{' '}
                <span className='text-primary/80 font-medium'>
                  {inviteUserData.email}
                </span>
                ?
              </>
            ) : (
              'Are you sure you want to resend the invitation email?'
            )}
          </DialogDescription>
        </DialogHeader>

        {generalError && (
          <div className='bg-danger/10 text-danger flex items-center gap-2 rounded-md px-3 py-2 text-xs'>
            <AlertCircle className='size-4 shrink-0' />
            {generalError}
          </div>
        )}

        <DialogFooter className='gap-2 sm:gap-2'>
          <Button variant='outline' onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>

          <Button
            onClick={handleResendEmail}
            disabled={isLoading || !inviteUserData}
            className='gap-2'
          >
            {isLoading ? (
              <Loading className='text-white!' />
            ) : (
              <Mail className='h-4 w-4' />
            )}
            Resend Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResendEmailInvitedUserDialog;
