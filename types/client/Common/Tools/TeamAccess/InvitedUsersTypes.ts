import { InviteMember } from './TeamAccessTypes';

export type InvitedUsersProps = {
  invites: InviteMember[];
  isInviteLoading: boolean;
  isInviteError: boolean;
  refetchInvites: () => void;
  page: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrevious: boolean;
  totalCount: number;
};

export interface ResendEmailInvitedUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  inviteUserData: InviteMember | null;
}

export interface DeleteInvitedUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  inviteUserData: InviteMember | null;
}
