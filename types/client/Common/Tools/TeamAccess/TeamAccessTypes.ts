export type MemberStatus = 'Active' | 'Pending';

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  access: string;
  status: MemberStatus;
}

export type AccessLevelKey =
  | 'allProperties'
  | 'financialRecords'
  | 'documents'
  | 'complianceData';

export interface InviteTeamMemberForm {
  email: string;
  role: string;
  accessLevel: Record<AccessLevelKey, boolean>;
  accessDuration: string;
  message: string;
}

export interface InviteTeamMemberModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}
