import SupportPage from '@/components/common/LegalPages/SupportPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support | Landkeeper',
};

export default function SupportRoutePage() {
  return <SupportPage />;
}
