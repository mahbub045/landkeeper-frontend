
import { Certificate, CertificateForm, ComplianceBreakdownItem, Expiration } from '@/types/client/Common/Compliance/ComplianceTypes';
import { Droplets, Flame, Zap } from 'lucide-react';

export const upcomingExpirations: Expiration[] = [
  {
    id: 1,
    title: 'Gas Safety Certificate',
    subtitle: '14 Oak Street - Expired 3 days ago',
    icon: Flame,
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-500',
  },
  {
    id: 2,
    title: 'EPC Certificate',
    subtitle: '42 Maple Avenue - Expires in 14 days',
    icon: Zap,
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-500',
  },
  {
    id: 3,
    title: 'Fire Risk Assessment',
    subtitle: '8 Pine Road - Expires in 45 days',
    icon: Droplets,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-500',
  },
];

export const complianceBreakdown: ComplianceBreakdownItem[] = [
  { label: 'Gas Safety', current: 4, total: 5, color: 'bg-amber-400' },
  { label: 'EPC', current: 5, total: 5, color: 'bg-emerald-500' },
  { label: 'Electrical', current: 5, total: 5, color: 'bg-emerald-500' },
];

export const CERTIFICATE_TYPES = [
  'Gas Safety Certificate',
  'EPC Certificate',
  'Electrical Safety Certificate',
  'Fire Risk Assessment',
  'HMO Licence',
  'PAT Testing',
  'Legionella Assessment',
  'Insurance Document',
];

export const EMPTY_FORM: CertificateForm = {
  propertyId: '',
  certificateType: 'Gas Safety Certificate',
  issueDate: '',
  expiryDate: '',
  certificateNumber: '',
  issuedBy: '',
};
