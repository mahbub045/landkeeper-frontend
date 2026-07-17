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
import { useDeleteAcceptedUserMutation } from '@/store/api/endpoints/client/Common/Tools/TeamAccess/TeamAccessApi';
import { DeleteAcceptedUserDialogProps } from '@/types/client/Common/Tools/TeamAccess/AcceptedUserTypes';
import formatChoiceFieldValue from '@/utils/formatters';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

const DeleteAcceptedUserDialog: React.FC<DeleteAcceptedUserDialogProps> = ({
  isOpen,
  onClose,
  member,
}) => {
  const [deleteAcceptedUser, { isLoading }] = useDeleteAcceptedUserMutation();

  const [generalError, setGeneralError] = useState<string | null>(null);

  const fullName = [
    formatChoiceFieldValue(member?.user?.title),
    member?.user?.first_name,
    member?.user?.middle_name,
    member?.user?.last_name,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClose = () => {
    setGeneralError(null);
    onClose();
  };

  const handleDelete = async () => {
    if (!member) return;

    setGeneralError(null);

    try {
      await deleteAcceptedUser(member.user.alias).unwrap();

      toast.success('Team member removed');
      handleClose();
    } catch (error) {
      console.error('Delete API Error:', error);

      let message = 'Failed to remove member. Please try again.';

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
          <DialogTitle>Delete Team Member</DialogTitle>
          <DialogDescription>This action is irreversible.</DialogDescription>
        </DialogHeader>

        <div className='space-y-3'>
          {fullName ? (
            <p className='text-sm'>
              Are you sure you want to delete{' '}
              <span className='text-danger/80 font-medium'>{fullName}</span>{' '}
              from your team?
            </p>
          ) : (
            <p className='text-sm'>
              Are you sure you want to delete this team member?
            </p>
          )}

          <div className='bg-danger/10 border-danger/20 text-danger flex items-start gap-2 rounded-md border px-3 py-2.5 text-xs'>
            <AlertCircle className='mt-0.5 size-4 shrink-0' />
            <span>
              They will immediately lose access to the team, all shared
              resources, and any pending invitations. This cannot be reversed.
            </span>
          </div>
        </div>

        {generalError && (
          <div className='bg-danger/10 text-danger flex items-center gap-2 rounded-md px-3 py-2 text-xs'>
            <AlertCircle className='size-4 shrink-0' />
            {generalError}
          </div>
        )}

        <DialogFooter className='gap-2 sm:gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type='button'
            variant='danger'
            onClick={handleDelete}
            disabled={isLoading || !member}
            className='gap-1.5'
          >
            {isLoading && <Loading className='text-white!' />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAcceptedUserDialog;
