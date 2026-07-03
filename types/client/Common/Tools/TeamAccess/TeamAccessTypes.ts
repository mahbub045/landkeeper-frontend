export type MemberStatus = 'ACTIVE' | 'PENDING' | 'DEACTIVATED';

export type FormErrors = Partial<Record<keyof InviteTeamMemberForm, string>>;
export type ApiError = {
  status?: number;
  data?: {
    message?: string;
    [key: string]: unknown;
  };
  error?: string;
};

export interface AcceptInviteApiError {
  status?: number;
  data?: {
    detail?: string;
    message?: string;
    new_password?: string | string[];
    confirm_password?: string | string[];
    [key: string]: unknown;
  };
  error?: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  message?: string;
  status: MemberStatus;
}

export interface InviteTeamMemberForm {
  email: string;
  role: string;
  message: string;
}

export interface InviteTeamMemberModalProps {
  open: boolean;
  onClose: () => void;
}
