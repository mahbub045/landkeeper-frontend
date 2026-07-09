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
  user: {
    id: number;
    alias: string;
    email: string;
    title: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    phone?: string;
    profile_image?: string;
    is_active: boolean;
  };
  role: string;
  created_at: string;
  updated_at: string;
}

export interface InviteMember {
  alias: string;
  email: string;
  role: string;
  message: string;
  created_at: string;
  updated_at: string;
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
