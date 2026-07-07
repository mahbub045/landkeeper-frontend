import { TenantForm } from '@/types/client/Common/Tenant/TenantTypes';

export const avatarColors = [
  'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
  'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
  'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
  'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
  'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400',
  'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400',
];

export const EMPTY_FORM: TenantForm = {
  propertyId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  rentAmount: '',
  deposit: '',
  tenancyStart: '',
  tenancyEnd: '',
  employmentDetails: '',
  guarantorName: '',
  notes: '',
};

export const OVERRIDE_KEY_MAP: Record<string, string> = {
  tenancy_start_date: 'tenancyStart',
  tenancy_end_date: 'tenancyEnd',
  property: 'propertyId',
};
