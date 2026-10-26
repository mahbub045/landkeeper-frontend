import {
  DocCategory,
  DocumentFilterOption,
} from '@/types/client/Common/DocumentsAndTemplates/DocumentTypes';
import { DOCUMENT_CATEGORY_OPTIONS } from '@/data/common/ChoiceFieldOptions';

// Derived lookup: DocCategory -> label. Used in DocumentList for the
// secondary line (e.g. "Certificate").
export const categoryLabelMap = DOCUMENT_CATEGORY_OPTIONS.reduce(
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
  ...DOCUMENT_CATEGORY_OPTIONS,
];
