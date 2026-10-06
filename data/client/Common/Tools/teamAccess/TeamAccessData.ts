import { InviteTeamMemberForm } from '@/types/client/Common/Tools/TeamAccess/TeamAccessTypes';

export const EMPTY_FORM: InviteTeamMemberForm = {
  email: '',
  role: 'ADMIN',
  message: '',
};

export const GetRoleBadge = ({ role }: { role: string }) => {
  const roleColors: Record<string, string> = {
    ADMIN: 'bg-emerald-500/30 rounded-2xl px-2 py-0.5',
    LETTING_AGENT: 'bg-purple-500/30 rounded-2xl px-2 py-0.5',
    MORTGAGE_ADVISER: 'bg-cyan-500/30 rounded-2xl px-2 py-0.5',
  };
  return roleColors[role] || 'bg-gray-500/30 rounded-2xl px-2 py-0.5';
};
