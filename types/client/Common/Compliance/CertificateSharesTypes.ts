import { ApiCertificate } from './ComplianceTypes';

export interface ViewCertificateSharesDialogProps {
  open: boolean;
  onClose: () => void;
  selectedCertificate: ApiCertificate | null;
}

export interface AddNewShareDialogProps {
  open: boolean;
  onClose: () => void;
  certificateAlias: string;
}

export interface CirtificateShare {
  alias: string;
  title: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
}

export interface TenantFilterItem {
  alias: string;
  avatar: string | null;
  title: string | null;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
}
