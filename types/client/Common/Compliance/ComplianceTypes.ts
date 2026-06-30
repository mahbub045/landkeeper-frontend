export type CertStatus = 'Valid' | 'Expired' | 'Expiring Soon';

export interface Certificate {
  id: number;
  property: string;
  type: string;
  issueDate: string;
  expiryDate: string;
  status: CertStatus;
}

export interface Expiration {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

export interface ComplianceBreakdownItem {
  label: string;
  current: number;
  total: number;
  color: string;
}

export interface ComplianceScoreProps {
  percent: number;
  validCount: number;
  totalCount: number;
  breakdown: ComplianceBreakdownItem[];
}

export interface CertificateRegistryProps {
  certificates: Certificate[];
}

export interface UpcomingExpirationsProps {
  items: Expiration[];
}

export interface CertificateForm {
  propertyId: string;
  certificateType: string;
  issueDate: string;
  expiryDate: string;
  certificateNumber: string;
  issuedBy: string;
}

export interface AddCertificateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  properties?: { id: string; name: string }[];
}
