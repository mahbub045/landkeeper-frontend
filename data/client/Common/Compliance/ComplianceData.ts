import {
  CertificateForm,
  CertStatus,
} from '@/types/client/Common/Compliance/ComplianceTypes';

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

export const CERT_STATUS_CONFIG: Record<
  CertStatus,
  { color: string; dot: string }
> = {
  Valid: { color: 'bg-success/10 text-success', dot: 'bg-success' },
  Expired: { color: 'bg-danger/10 text-danger', dot: 'bg-danger' },
  'Expiring Soon': { color: 'bg-warning/10 text-warning', dot: 'bg-warning' },
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
