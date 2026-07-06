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

export type FormState = {
  title: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  role: string;
  is_active: boolean;
};

export interface DeleteAcceptedUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
}