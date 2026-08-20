import { UserRole } from '@/types/next-auth';

export const isSuperAdmin_Landlord_Admin_LettingAgent_MortgageAdviser = (
  value: string | null,
): value is UserRole =>
  value !== null &&
  [
    'SUPER_ADMIN',
    'LANDLORD',
    'ADMIN',
    'LETTING_AGENT',
    'MORTGAGE_ADVISER',
  ].includes(value);

export const isLandlord_Admin_LettingAgent_MortgageAdviser = (
  value: string | null,
): value is UserRole =>
  value !== null &&
  ['LANDLORD', 'ADMIN', 'LETTING_AGENT', 'MORTGAGE_ADVISER'].includes(value);

export const isLandlord_Admin_LettingAgent = (
  value: string | null,
): value is UserRole =>
  value !== null && ['LANDLORD', 'ADMIN', 'LETTING_AGENT'].includes(value);

export const isLandlord_Admin = (value: string | null): value is UserRole =>
  value !== null && ['LANDLORD', 'ADMIN'].includes(value);
