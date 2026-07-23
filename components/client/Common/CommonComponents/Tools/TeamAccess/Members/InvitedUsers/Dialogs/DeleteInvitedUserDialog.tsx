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
import { useDeleteInvitedUserMutation } from '@/store/api/endpoints/client/Common/Tools/TeamAccess/TeamAccessApi';
import { DeleteInvitedUserDialogProps } from '@/types/client/Common/Tools/TeamAccess/InvitedUsersTypes';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

const DeleteInvitedUserDialog: React.FC<DeleteInvitedUserDialogProps> = ({
  isOpen,
  onClose,
  inviteUserData,
}) => {
  const [deleteInvitedUser, { isLoading }] = useDeleteInvitedUserMutation();

  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleClose = () => {
    setGeneralError(null);
    onClose();
  };

  const handleDelete = async () => {
    if (!inviteUserData) return;

    setGeneralError(null);

    try {
      await deleteInvitedUser(inviteUserData.alias).unwrap();

      toast.success('Invitation deleted successfully');
      handleClose();
    } catch (error) {
      console.error('Delete Invitation Error:', error);

      let message = 'Failed to delete invitation. Please try again.';

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
    <DialogContent className="overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-md">
      {/* Header */}
      <DialogHeader className="flex flex-col items-center bg-linear-to-b from-red-50 to-background px-6 pt-8 pb-6 dark:from-red-950/30">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>

        <DialogTitle className="text-center text-2xl font-bold">
          Delete Invitation
        </DialogTitle>

        <DialogDescription className="mt-2 text-center text-sm">
          This action is permanent and cannot be undone.
        </DialogDescription>
      </DialogHeader>

      {/* Body */}
      <div className="space-y-5 px-6 py-6">
        <p className="text-center text-sm leading-7 text-muted-foreground">
          You&rsquo;re about to permanently delete this invitation.
        </p>

        {inviteUserData?.email && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center dark:border-red-900/50 dark:bg-red-950/30">
            <span className="break-all text-base font-semibold text-red-600">
              {inviteUserData.email}
            </span>
          </div>
        )}

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
          <p className="text-center text-sm leading-6 text-amber-700 dark:text-amber-300">
            The invitation will be permanently removed and the recipient will no
            longer be able to use it to join your team.
          </p>
        </div>

        {generalError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
            <p className="text-center text-sm text-red-600">
              {generalError}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <DialogFooter className="border-t bg-muted/20 px-6 pb-8">
        <Button
          variant="outline"
          onClick={handleClose}
          disabled={isLoading}
          className="min-w-24"
        >
          Cancel
        </Button>

        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isLoading || !inviteUserData}
          className="min-w-40"
        >
          {isLoading && <Loading className="mr-2 text-white!" />}
          Delete Invitation
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
};

export default DeleteInvitedUserDialog;
