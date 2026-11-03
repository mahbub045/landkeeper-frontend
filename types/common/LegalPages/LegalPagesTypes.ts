import type { LucideIcon } from 'lucide-react';

export interface LegalSection {
  /** Anchor id used by the table of contents */
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface LegalDocumentProps {
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface SupportFaq {
  question: string;
  answer: string;
}

export interface SupportContactChannel {
  icon: LucideIcon;
  title: string;
  description: string;
  value: string;
  href: string;
}

export interface PublicPageShellProps {
  children: React.ReactNode;
}
