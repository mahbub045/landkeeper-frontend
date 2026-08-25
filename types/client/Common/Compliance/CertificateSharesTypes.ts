import { ApiCertificate } from './ComplianceTypes';

export interface ViewCertificateSharesDialogProps {
  open: boolean;
  onClose: () => void;
  selectedCertificate: ApiCertificate | null;
}

export interface AddNewShareDialogProps {
  open: boolean;
  onClose: () => void;
}