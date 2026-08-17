import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeletePermissionMutation } from '@/store/api/endpoints/client/Common/Permissions/PermissionsApi';
import { DeleteUserFromPropertyPermissionDialogProps } from '@/types/client/Common/Properties/PropertyDetailsTypes';
import { getInitials } from '@/utils/formatters';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const DeleteUserFromPropertyPermissionDialog: React.FC<
  DeleteUserFromPropertyPermissionDialogProps
> = ({ isOpen, onClose, userToRemove }) => {
  const [deletePermission, { isLoading }] = useDeletePermissionMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isFetchBaseQueryError = (
    error: unknown,
  ): error is FetchBaseQueryError => {
    return typeof error === 'object' && error != null && 'status' in error;
  };

  const handleClose = () => {
    setSubmitError(null);
    onClose();
  };

  const handleDelete = async () => {
    if (!userToRemove) return;
    setSubmitError(null);
    try {
      await deletePermission({ content_alias: userToRemove.alias }).unwrap();
      handleClose();
    } catch (err) {
      const error = err as FetchBaseQueryError | SerializedError;
      let message = 'Something went wrong. Please try again.';

      if (isFetchBaseQueryError(error)) {
        const data = error.data;
        if (typeof data === 'string') {
          message = data;
        } else if (data && typeof data === 'object') {
          const values = Object.values(data as Record<string, unknown>);
          if (values.length) {
            message = Array.isArray(values[0])
              ? String(values[0][0])
              : String(values[0]);
          }
        }
      } else if (error.message) {
        message = error.message;
      }

      setSubmitError(message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='gap-0 overflow-visible p-0 sm:max-w-100'>
        <DialogHeader className='px-6 pt-6 pb-1'>
          <DialogTitle className='text-lg font-semibold'>
            Remove Property Access
          </DialogTitle>
          <DialogDescription className='text-muted-foreground text-sm'>
            This will revoke this user&apos;s access to the property. This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {submitError && (
          <div className='bg-danger/10 border-danger px-6 py-2'>
            <p className='text-destructive text-sm'>{submitError}</p>
          </div>
        )}

        {userToRemove && (
          <div className='px-6 py-4'>
            <div className='border-input bg-muted/30 flex items-center gap-3 rounded-lg border p-3'>
              <Avatar className='h-10 w-10 shrink-0'>
                <AvatarFallback className='bg-muted text-sm font-medium'>
                  {getInitials(userToRemove.user.name)}
                </AvatarFallback>
              </Avatar>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium'>
                  {userToRemove.user.name}
                </p>
                <p className='text-muted-foreground truncate text-xs'>
                  {userToRemove.user.email}
                </p>
              </div>
            </div>

            <div className='text-destructive bg-destructive/5 mt-3 flex items-start gap-2 rounded-lg px-3 py-2 text-xs'>
              <AlertTriangle className='mt-0.5 h-3.5 w-3.5 shrink-0' />
              <span>
                They will immediately lose view and edit access to this
                property.
              </span>
            </div>
          </div>
        )}

        <DialogFooter className='bg-muted/30 mb-1 gap-2 border-t px-6 py-4 sm:gap-2'>
          <Button variant='outline' onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={isLoading || !userToRemove}
          >
            {isLoading ? 'Removing...' : 'Remove Access'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserFromPropertyPermissionDialog;
