export type CertStatus = 'Valid' | 'Expired' | 'Expiring Soon';

export interface ApiCertificate {
  alias: string;
  certificate_file: string | null;
  certificate_number: string;
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
  certificates: ApiCertificate[];
  isLoading?: boolean;
  startIndex?: number;
  search: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddClick: () => void;
}

export interface CertificateRowProps {
  cert: ApiCertificate;
  index: number;
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
  certificateName?: string;
  certificateNumber?: string;
}

export interface ComplianceExpiryTimelineProps {
  issueDate: string;
  expiryDate: string;
}

export interface ComplianceDangerZoneProps {
  onDeleteClick: () => void;
}
