import { CertificateForm } from '@/types/client/Common/Compliance/ComplianceTypes';

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
