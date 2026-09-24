import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog/DeleteConfirmDialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useDeletePermissionMutation } from '@/store/api/endpoints/client/Common/Permissions/PermissionsApi';
import { DeleteUserFromMortgagePermissionDialogProps } from '@/types/client/Common/Mortgage/MortgagePermissionTypes';
import { getInitials } from '@/utils/formatters';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Eye, Pencil, UserMinus } from 'lucide-react';
import { useState } from 'react';

const IMPACT_ITEMS = [
  { icon: Eye, label: 'View access' },
  { icon: Pencil, label: 'Edit access' },
];

const DeleteUserFromMortgagePermissionDialog: React.FC<
  DeleteUserFromMortgagePermissionDialogProps
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
      await deletePermission({ alias: userToRemove.alias }).unwrap();
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
    <DeleteConfirmDialog
      open={isOpen}
      onClose={handleClose}
      onConfirm={handleDelete}
      isLoading={isLoading}
      confirmDisabled={!userToRemove}
      icon={UserMinus}
      title='Remove mortgage access?'
      description="This will revoke this user's access to the mortgage."
      targetLabel='User'
      targetName={userToRemove?.user.name}
      targetSubtext={userToRemove?.user.email}
      targetMedia={
        userToRemove && (
          <Avatar className='h-12 w-12 shrink-0 ring-1 ring-red-500/30'>
            <AvatarFallback className='bg-red-500/15 text-sm font-semibold text-red-600 dark:text-red-400'>
              {getInitials(userToRemove.user.name)}
            </AvatarFallback>
          </Avatar>
        )
      }
      badge={null}
      impactTitle='Access that will be revoked'
      impactItems={IMPACT_ITEMS}
      impactNote='They will immediately lose view and edit access to this mortgage.'
      error={submitError}
      cancelLabel='Keep Access'
      confirmLabel='Remove Access'
    />
  );
};

export default DeleteUserFromMortgagePermissionDialog;
