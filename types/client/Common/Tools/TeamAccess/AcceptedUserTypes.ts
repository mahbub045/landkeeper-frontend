import { TeamMember } from './TeamAccessTypes';

export type AcceptedUsersProps = {
  members: TeamMember[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  page: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrevious: boolean;
  totalCount: number;
};

export interface EditAcceptedUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
}
