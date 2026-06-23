import { AccessLevelKey, InviteTeamMemberForm, TeamMember } from '@/types/client/Landlord/Tools/TeamAccess/TeamAccessTypes';

export const members: TeamMember[] = [
  {
    id: 1,
    name: 'Robert Smith',
    role: 'Accountant',
    email: 'robert.smith@finance.co.uk',
    access: 'Financial records & reports',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Amanda White',
    role: 'Mortgage Adviser',
    email: 'amanda.white@mortgage.co.uk',
    access: 'Mortgage & property documents',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Tom Green',
    role: 'Letting Agent',
    email: 'tom.green@lettings.co.uk',
    access: 'Tenant and tenancy data',
    status: 'Pending',
  },
];


export const ROLES = [
  'Property Manager',
  'Accountant',
  'Letting Agent',
  'Solicitor',
  'Mortgage Adviser',
];

export const ACCESS_LEVEL_OPTIONS: { key: AccessLevelKey; label: string }[] = [
  { key: 'allProperties', label: 'All Properties' },
  { key: 'financialRecords', label: 'Financial Records' },
  { key: 'documents', label: 'Documents' },
  { key: 'complianceData', label: 'Compliance Data' },
];

export const ACCESS_DURATIONS = [
  'Until revoked',
  '30 days',
  '90 days',
  '6 months',
  '1 year',
];

export const EMPTY_FORM: InviteTeamMemberForm = {
  email: '',
  role: 'Mortgage Adviser',
  accessLevel: {
    allProperties: true,
    financialRecords: true,
    documents: true,
    complianceData: false,
  },
  accessDuration: 'Until revoked',
  message: '',
};