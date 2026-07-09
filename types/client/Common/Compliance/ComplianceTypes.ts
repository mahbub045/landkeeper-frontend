export type CertStatus = 'Valid' | 'Expired' | 'Expiring Soon';

export interface Certificate {
  alias: string;
  property: string;
  type: string;
  certificateNumber: number;
  issueDate: string;
  expiryDate: string;
  status: CertStatus;
}

export interface ApiCertificate {
  alias: string;
  certificate_file: string | null;
  certificate_number: number;
  certificate_type: string;
  created_at: string;
  expiry_date: string;
  issue_date: string;
  issued_by: string;
  property: { id: number; alias: string; property_name: string };
  updated_at: string;
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
  isLoading?: boolean;
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

export interface UpdateCertificateDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  certificate: ApiCertificate;
}

export interface DeleteCertificateDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  certificateAlias: string;
}
