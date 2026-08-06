import { documentCategoryOptions } from '@/data/client/common/DocumentsAndTemplates/DocumentsData';

export type DocCategory =
  | 'MORTGAGE_DOCUMENTS'
  | 'TENANCY_AGREEMENT'
  | 'CERTIFICATE'
  | 'INSURANCE'
  | 'INVOICE'
  | 'TAX_DOCUMENT'
  | 'PROPERTY_PHOTO'
  | 'LEGAL_DOCUMENT';

export type DocumentCategory =
  (typeof documentCategoryOptions)[number]['value'];

export interface DocumentForm {
  propertyId: string;
  category: DocumentCategory;
  name: string;
}

export const initialForm: DocumentForm = {
  propertyId: '',
  category: 'MORTGAGE_DOCUMENTS',
  name: '',
};

// 'ALL' means "no category filter applied" -- everything else maps
// 1:1 to the document_category param sent to the API.
export type FilterTab = 'ALL' | DocCategory;

export interface DocumentFilterOption {
  value: FilterTab;
  label: string;
}

export interface DocumentFile {
  id: number;
  file: string;
  description: string | null;
}

export interface DocumentProperty {
  id: number;
  alias: string;
  property_name: string;
}

export interface PropertyDocument {
  alias: string;
  document_category: DocCategory;
  document_name: string;
  files: DocumentFile[];
  property: DocumentProperty;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface UploadDocumentForm {
  propertyId: string;
  category: string;
  name: string;
}

export interface UploadDocumentDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface UpdateDocumentForm {
  propertyId: string;
  propertyName: string;
  category: DocumentCategory;
  name: string;
}

export interface UpdateDocumentFormProps {
  document: PropertyDocument;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface UpdateDocumentDialogProps {
  document: PropertyDocument | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface DocumentFilterProps {
  filterTabs: DocumentFilterOption[];
  activeFilter: FilterTab;
  onFilterChange: (tab: FilterTab) => void;
}

export interface DeleteDocumentDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  documentAlias: string;
  documentName: string;
}
