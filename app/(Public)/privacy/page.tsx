import LegalDocument from '@/components/common/LegalPages/LegalDocument';
import {
  LEGAL_LAST_UPDATED,
  PRIVACY_SECTIONS,
} from '@/data/common/LegalPages/LegalPagesData';
import { ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Landkeeper',
};

export default function PrivacyPage() {
  return (
    <LegalDocument
      icon={ShieldCheck}
      title='Privacy Policy'
      description='How Landkeeper collects, uses and protects your personal data.'
      lastUpdated={LEGAL_LAST_UPDATED}
      sections={PRIVACY_SECTIONS}
    />
  );
}
