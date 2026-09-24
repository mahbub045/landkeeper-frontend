import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog/DeleteConfirmDialog';
import { useDeleteAcceptedUserMutation } from '@/store/api/endpoints/client/Common/Tools/TeamAccess/TeamAccessApi';
import { DeleteAcceptedUserDialogProps } from '@/types/client/Common/Tools/TeamAccess/AcceptedUserTypes';
import formatChoiceFieldValue from '@/utils/formatters';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { FolderOpen, Mail, User, UserMinus, Users } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

const IMPACT_ITEMS = [
  { icon: Users, label: 'Team access' },
  { icon: FolderOpen, label: 'Shared resources' },
  { icon: Mail, label: 'Pending invites' },
];

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
    <DeleteConfirmDialog
      open={isOpen}
      onClose={handleClose}
      onConfirm={handleDelete}
      isLoading={isLoading}
      confirmDisabled={!member}
      icon={UserMinus}
      title='Remove this team member?'
      targetLabel='Team member'
      targetName={fullName}
      targetIcon={User}
      impactTitle='Access that will be revoked'
      impactItems={IMPACT_ITEMS}
      error={generalError}
      cancelLabel='Keep Member'
      confirmLabel='Remove Member'
    />
  );
};

export default DeleteAcceptedUserDialog;
