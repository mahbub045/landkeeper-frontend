import LegalDocument from '@/components/common/LegalPages/LegalDocument';
import {
  LEGAL_LAST_UPDATED,
  TERMS_SECTIONS,
} from '@/data/common/LegalPages/LegalPagesData';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Landkeeper',
};

export default function TermsPage() {
  return (
    <LegalDocument
      title='Terms of Service'
      description='The terms that apply when you use the Landkeeper property management portal.'
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={TERMS_SECTIONS}
    />
  );
}
