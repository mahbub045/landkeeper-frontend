import { InviteTeamMemberForm } from '@/types/client/Common/Tools/TeamAccess/TeamAccessTypes';

export const ROLES = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'LETTING_AGENT', label: 'Letting Agent' },
];

export const EMPTY_FORM: InviteTeamMemberForm = {
  email: '',
  role: 'ADMIN',
  message: '',
};
