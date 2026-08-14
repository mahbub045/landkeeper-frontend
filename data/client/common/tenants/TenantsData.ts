import { TenantForm } from '@/types/client/Common/Tenants/TenantsTypes';

export const AVATAR_COLORS = [
  'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
  'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
  'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
  'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
  'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400',
  'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400',
];

export const EMPTY_FORM: TenantForm = {
  propertyId: '',
  title: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  email: '',
  phone: '',
  rent_amount: '',
  deposit: '',
  tenancy_start_date: '',
  tenancy_end_date: '',
  employment_details: '',
  guarantor_name: '',
  notes: '',
};

export const OVERRIDE_KEY_MAP: Record<string, string> = {
  tenancy_start_date: 'tenancy_start_date',
  tenancy_end_date: 'tenancy_end_date',
  property: 'propertyId',
};

export const TABLE_COLUMNS = [
  'Tenant',
  'Property',
  'Rent',
  'Start Date',
  'End Date',
  'Status',
  'Created At',
  'Actions',
];

export const avatarColor = (idx: number) =>
  AVATAR_COLORS[idx % AVATAR_COLORS.length];
