import {
  DocCategory,
  DocumentFilterOption,
} from '@/types/client/Common/Documents/DocumentTypes';

// Single source of truth. Both AddDocumentDialog's category <Select>
// and the list page's filter tabs derive from this.
export const documentCategoryOptions = [
  { value: 'MORTGAGE_DOCUMENTS', label: 'Mortgage Documents' },
  { value: 'TENANCY_AGREEMENT', label: 'Tenancy Agreement' },
  { value: 'CERTIFICATE', label: 'Certificate' },
  { value: 'INSURANCE', label: 'Insurance' },
  { value: 'INVOICE', label: 'Invoice' },
  { value: 'TAX_DOCUMENT', label: 'Tax Document' },
  { value: 'PROPERTY_PHOTO', label: 'Property Photo' },
  { value: 'LEGAL_DOCUMENT', label: 'Legal Document' },
] as const;

// Derived lookup: DocCategory -> label. Used in DocumentList for the
// secondary line (e.g. "Certificate").
export const categoryLabelMap = documentCategoryOptions.reduce(
  (acc, option) => {
    acc[option.value] = option.label;
    return acc;
  },
  {} as Record<DocCategory, string>,
);

// Used by DocumentFilter. 'ALL' is prepended and carries no
// document_category param when selected (see Documents.tsx).
export const filterTabs: DocumentFilterOption[] = [
  { value: 'ALL', label: 'All' },
  ...documentCategoryOptions,
];
