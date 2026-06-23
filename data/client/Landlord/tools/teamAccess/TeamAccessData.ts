import { TeamMember } from '@/types/client/Landlord/Tools/TeamAccess/TeamAccessTypes';

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
