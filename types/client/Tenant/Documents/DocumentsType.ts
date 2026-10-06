export interface DocumentProperty {
  id: number;
  alias: string;
  property_name: string;
}

export interface CertificateDocument {
  alias: string;
  property: DocumentProperty;
  certificate_type: string;
  issue_date: string | null;
  expiry_date: string | null;
  certificate_number: string | null;
  issued_by: string | null;
  certificate_file: string | null;
  created_at: string;
  updated_at: string;
}

export interface TenantDocumentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CertificateDocument[];
}
