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
      <DialogContent className='overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-md'>
        {/* Header */}
        <DialogHeader className='to-background flex flex-col items-center bg-linear-to-b from-red-50 px-6 pt-8 pb-6 dark:from-red-950/30'>
          <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30'>
            <AlertCircle className='h-8 w-8 text-red-600' />
          </div>

          <DialogTitle className='text-center text-2xl font-bold'>
            Remove Team Member
          </DialogTitle>

          <DialogDescription className='mt-2 text-center text-sm'>
            This action is permanent and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className='space-y-5 px-6 py-6'>
          <p className='text-muted-foreground text-center text-sm leading-7'>
            {fullName
              ? "You're about to permanently remove the following team member:"
              : "You're about to permanently remove this team member."}
          </p>

          {fullName && (
            <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center dark:border-red-900/50 dark:bg-red-950/30'>
              <span className='text-base font-semibold wrap-break-word text-red-600'>
                {fullName}
              </span>
            </div>
          )}

          <div className='rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20'>
            <p className='text-center text-sm leading-6 text-amber-700 dark:text-amber-300'>
              This member will immediately lose access to the team, shared
              resources, and pending invitations. This action cannot be
              reversed.
            </p>
          </div>

          {generalError && (
            <div className='rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30'>
              <p className='text-center text-sm text-red-600'>{generalError}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className='bg-muted/20 border-t px-6 pb-8'>
          <Button
            variant='outline'
            onClick={handleClose}
            disabled={isLoading}
            className='min-w-24'
          >
            Cancel
          </Button>

          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={isLoading || !member}
            className='min-w-40'
          >
            {isLoading && <Loading className='mr-2 text-white!' />}
            Remove Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAcceptedUserDialog;
