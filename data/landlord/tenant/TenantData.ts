import { Tenant } from '@/types/landlord/Tenant/TenantTypes';

export const tenants: Tenant[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    property: '14 Oak Street',
    rent: 850,
    startDate: '01/06/2024',
    endDate: '01/06/2025',
    status: 'Renewal Due',
  },
  {
    id: 2,
    name: 'James Wilson',
    email: 'james.w@email.com',
    property: '42 Maple Avenue',
    rent: 400,
    startDate: '15/01/2024',
    endDate: '15/01/2025',
    status: 'Renewal Due',
  },
  {
    id: 3,
    name: 'Emma Davis',
    email: 'emma.d@email.com',
    property: '42 Maple Avenue',
    rent: 380,
    startDate: '01/03/2024',
    endDate: '01/03/2025',
    status: 'Renewal Due',
  },
  {
    id: 4,
    name: 'Michael Brown',
    email: 'michael.b@email.com',
    property: '42 Maple Avenue',
    rent: 420,
    startDate: '01/09/2024',
    endDate: '01/09/2025',
    status: 'Renewal Due',
  },
  {
    id: 5,
    name: 'Lisa Taylor',
    email: 'lisa.t@email.com',
    property: '8 Pine Road',
    rent: 750,
    startDate: '01/04/2024',
    endDate: '01/04/2025',
    status: 'Renewal Due',
  },
  {
    id: 6,
    name: 'David Clark',
    email: 'david.c@email.com',
    property: '23 Elm Drive',
    rent: 1500,
    startDate: '01/12/2023',
    endDate: '01/12/2028',
    status: 'Active',
  },
];


export const avatarColors = [
  'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
  'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
  'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
  'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
  'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400',
  'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400',
];

