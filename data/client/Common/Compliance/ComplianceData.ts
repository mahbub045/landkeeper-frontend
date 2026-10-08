import {
  CertificateForm,
  CertStatus,
  CertStatusTone,
  CertStatusToneKey,
} from '@/types/client/Common/Compliance/ComplianceTypes';
import { getAlertSeverity } from '@/data/client/Common/Dashboard/DashboardData';

// Mirrors the backend `CertificateType` choices
export const CERTIFICATE_OPTIONS = [
  { value: 'GAS_SAFETY_CERTIFICATE', label: 'Gas Safety Certificate' },
  {
    value: 'EPC_CERTIFICATE',
    label: 'Energy Performance Certificate (EPC)',
  },
  {
    value: 'EICR_CERTIFICATE',
    label: 'Electrical Installation Condition Report (EICR)',
  },
  {
    value: 'DEPOSIT_PROTECTION_CERTIFICATE',
    label: 'Deposit Protection Certificate',
  },
  { value: 'RIGHT_TO_RENT_CHECK', label: 'Right to Rent Checks' },
  { value: 'HMO_LICENCE', label: 'HMO Licence' },
  {
    value: 'PROPERTY_INSURANCE_CERTIFICATE',
    label: 'Property Insurance Certificate',
  },
  {
    value: 'FIRE_SAFETY_CERTIFICATE',
    label: 'Fire Safety Certificate / Fire Risk Assessment',
  },
  { value: 'SELECTIVE_LICENCE', label: 'Selective Licence' },
  {
    value: 'PAT_TESTING_CERTIFICATE',
    label: 'Portable Appliance Testing (PAT) Certificate',
  },
  { value: 'PROPERTY_FLOOR_PLANS', label: 'Property Floor Plans' },
];

export const CERTIFICATE_STYLES: Record<string, string> = {
  GAS_SAFETY_CERTIFICATE: 'bg-blue-100 text-blue-800',
  EPC_CERTIFICATE: 'bg-green-100 text-green-800',
  EICR_CERTIFICATE: 'bg-orange-100 text-orange-800',
  DEPOSIT_PROTECTION_CERTIFICATE: 'bg-indigo-100 text-indigo-800',
  RIGHT_TO_RENT_CHECK: 'bg-pink-100 text-pink-800',
  HMO_LICENCE: 'bg-purple-100 text-purple-800',
  PROPERTY_INSURANCE_CERTIFICATE: 'bg-gray-100 text-gray-800',
  FIRE_SAFETY_CERTIFICATE: 'bg-red-100 text-red-800',
  SELECTIVE_LICENCE: 'bg-cyan-100 text-cyan-800',
  PAT_TESTING_CERTIFICATE: 'bg-yellow-100 text-yellow-800',
  PROPERTY_FLOOR_PLANS: 'bg-teal-100 text-teal-800',
};

export const EMPTY_FORM: CertificateForm = {
  propertyId: '',
  certificateType: '',
  issueDate: '',
  expiryDate: '',
  certificateNumber: '',
  issuedBy: '',
};

// Mirrors the dashboard's Alerts & Reminders severity colours; Valid stays green
export const CERT_STATUS_TONES: Record<CertStatusToneKey, CertStatusTone> = {
  Valid: {
    color: 'bg-success/10 text-success',
    dot: 'bg-success',
    text: 'text-success',
  },
  expired: {
    color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    dot: 'bg-red-500',
    text: 'text-red-600 dark:text-red-400',
  },
  urgent: {
    color:
      'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    dot: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
  },
  upcoming: {
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    dot: 'bg-blue-500',
    text: 'text-blue-600 dark:text-blue-400',
  },
};

export const getDaysUntilExpiry = (expiryDate: string): number =>
  Math.ceil(
    (new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

export const getCertStatus = (expiryDate: string): CertStatus => {
  const daysUntilExpiry = getDaysUntilExpiry(expiryDate);

  if (daysUntilExpiry < 0) return 'Expired';
  if (daysUntilExpiry <= 30) return 'Expiring Soon';
  return 'Valid';
};

// Colour follows days remaining (like the dashboard alerts), not just the status label
export const getCertStatusTone = (expiryDate: string): CertStatusTone =>
  CERT_STATUS_TONES[
    getCertStatus(expiryDate) === 'Valid'
      ? 'Valid'
      : getAlertSeverity(getDaysUntilExpiry(expiryDate))
  ];
