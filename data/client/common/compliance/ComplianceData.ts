import { CertificateForm } from '@/types/client/Common/Compliance/ComplianceTypes';

export const CERTIFICATE_OPTIONS = [
  { value: 'GAS_SAFETY_CERTIFICATE', label: 'Gas Safety Certificate' },
  { value: 'EPC_CERTIFICATE', label: 'EPC Certificate' },
  {
    value: 'ELECTRICAL_SAFETY_CERTIFICATE',
    label: 'Electrical Safety Certificate',
  },
  { value: 'FIRE_RISK_ASSESSMENT', label: 'Fire Risk Assessment' },
  { value: 'HMO_LICENCE', label: 'HMO Licence' },
  { value: 'PAT_TESTING', label: 'PAT Testing' },
  { value: 'LEGIONELLA_ASSESSMENT', label: 'Legionella Assessment' },
  { value: 'INSURANCE_DOCUMENT', label: 'Insurance Document' },
];

export const CERTIFICATE_STYLES: Record<string, string> = {
  GAS_SAFETY_CERTIFICATE: 'bg-blue-100 text-blue-800',
  EPC_CERTIFICATE: 'bg-green-100 text-green-800',
  ELECTRICAL_SAFETY_CERTIFICATE: 'bg-orange-100 text-orange-800',
  FIRE_RISK_ASSESSMENT: 'bg-red-100 text-red-800',
  HMO_LICENCE: 'bg-purple-100 text-purple-800',
  PAT_TESTING: 'bg-yellow-100 text-yellow-800',
  LEGIONELLA_ASSESSMENT: 'bg-teal-100 text-teal-800',
  INSURANCE_DOCUMENT: 'bg-gray-100 text-gray-800',
};

export const EMPTY_FORM: CertificateForm = {
  propertyId: '',
  certificateType: '',
  issueDate: '',
  expiryDate: '',
  certificateNumber: '',
  issuedBy: '',
};
