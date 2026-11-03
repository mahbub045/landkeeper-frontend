import {
  FooterLink,
  LegalSection,
  SupportContactChannel,
  SupportFaq,
} from '@/types/common/LegalPages/LegalPagesTypes';
import { Clock, Mail } from 'lucide-react';

// TODO: confirm the real support mailbox and legal copy before going live
export const SUPPORT_EMAIL = 'support@landkeeper.co.uk';
export const LEGAL_LAST_UPDATED = '3 November 2026';

export const FOOTER_LINKS: FooterLink[] = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Support', href: '/support' },
];

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'Landkeeper ("we", "us", "our") provides a property management portal for landlords, letting agents, mortgage advisers, administrators and tenants. This policy explains what personal data we collect, why we collect it and the choices you have.',
      'We process personal data in line with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.',
    ],
  },
  {
    id: 'data-we-collect',
    title: 'Information we collect',
    bullets: [
      'Account details such as your name, email address, phone number and role.',
      'Property information including addresses, tenancy details, mortgages, compliance certificates and uploaded documents.',
      'Financial records you add, such as income, expenses and rent payments.',
      'Billing details processed securely by our payment provider, Stripe. We never store full card numbers.',
      'Technical data such as IP address, browser type and usage logs used to keep the service secure.',
    ],
  },
  {
    id: 'how-we-use',
    title: 'How we use your information',
    bullets: [
      'To provide, maintain and improve the Landkeeper portal.',
      'To manage your subscription and process payments.',
      'To send service notifications, such as compliance reminders and support ticket updates.',
      'To respond to support requests and resolve technical issues.',
      'To meet our legal and regulatory obligations.',
    ],
  },
  {
    id: 'sharing',
    title: 'Sharing your information',
    paragraphs: [
      'We do not sell your personal data. We only share it with users you invite to your account (for example letting agents, advisers or tenants), and with trusted service providers who help us run the platform, such as hosting, email and payment processors. These providers are bound by contracts that protect your data.',
    ],
  },
  {
    id: 'retention',
    title: 'Data retention',
    paragraphs: [
      'We keep your data for as long as your account is active, and afterwards only for as long as needed to meet legal, accounting or reporting requirements.',
    ],
  },
  {
    id: 'your-rights',
    title: 'Your rights',
    bullets: [
      'Access the personal data we hold about you.',
      'Ask us to correct inaccurate or incomplete data.',
      'Ask us to delete your data, subject to legal requirements.',
      'Object to or restrict certain processing.',
      'Request a copy of your data in a portable format.',
      'Complain to the Information Commissioner’s Office (ICO).',
    ],
  },
  {
    id: 'security',
    title: 'Security',
    paragraphs: [
      'We use encryption in transit, access controls and regular reviews to protect your information. No system is completely secure, so please keep your password safe and let us know straight away if you suspect unauthorised access.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact us',
    paragraphs: [
      `If you have questions about this policy or want to exercise your rights, email us at ${SUPPORT_EMAIL}.`,
    ],
  },
];

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: 'acceptance',
    title: 'Acceptance of terms',
    paragraphs: [
      'By creating an account or using Landkeeper you agree to these Terms of Service. If you use Landkeeper on behalf of a business, you confirm you are authorised to accept these terms for it.',
    ],
  },
  {
    id: 'accounts',
    title: 'Your account',
    bullets: [
      'You must provide accurate information and keep it up to date.',
      'You are responsible for keeping your login details secure.',
      'You are responsible for activity carried out by users you invite to your account.',
      'Notify us immediately of any unauthorised use of your account.',
    ],
  },
  {
    id: 'subscriptions',
    title: 'Subscriptions and billing',
    paragraphs: [
      'Some features require a paid subscription. Fees are billed in advance through Stripe and renew automatically until cancelled. You can change or cancel your plan at any time from Billing & Plans; cancellation takes effect at the end of the current billing period.',
    ],
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable use',
    bullets: [
      'Do not upload unlawful, misleading or infringing content.',
      'Do not attempt to access data or accounts you are not authorised to use.',
      'Do not interfere with or disrupt the security or performance of the service.',
      'Do not resell or redistribute the service without our written permission.',
    ],
  },
  {
    id: 'your-content',
    title: 'Your content',
    paragraphs: [
      'You keep ownership of the data and documents you upload. You grant us a limited licence to store and process that content only to provide the service to you.',
    ],
  },
  {
    id: 'disclaimer',
    title: 'Professional advice disclaimer',
    paragraphs: [
      'Landkeeper is a management tool. Reports, reminders and calculations are provided for convenience and do not constitute legal, tax, financial or mortgage advice. Always check important decisions with a qualified professional.',
    ],
  },
  {
    id: 'liability',
    title: 'Limitation of liability',
    paragraphs: [
      'To the extent permitted by law, we are not liable for indirect or consequential losses, or for loss of data, profits or business. Our total liability is limited to the fees you paid in the 12 months before the claim.',
    ],
  },
  {
    id: 'termination',
    title: 'Termination',
    paragraphs: [
      'You may close your account at any time. We may suspend or terminate accounts that breach these terms. On termination, your access ends and data is handled as described in our Privacy Policy.',
    ],
  },
  {
    id: 'changes',
    title: 'Changes to these terms',
    paragraphs: [
      'We may update these terms from time to time. We will notify you of material changes, and continued use of the service means you accept the updated terms.',
    ],
  },
  {
    id: 'governing-law',
    title: 'Governing law',
    paragraphs: [
      'These terms are governed by the laws of England and Wales, and the courts of England and Wales have exclusive jurisdiction.',
    ],
  },
];

export const SUPPORT_CONTACT_CHANNELS: SupportContactChannel[] = [
  {
    icon: Mail,
    title: 'Email support',
    description: 'Send us a message and we’ll get back to you.',
    value: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}`,
  },
  {
    icon: Clock,
    title: 'Support hours',
    description: 'We aim to reply within one working day.',
    value: 'Mon – Fri, 9:00 – 17:30 (UK time)',
    href: '',
  },
];

export const SUPPORT_FAQS: SupportFaq[] = [
  {
    question: 'I forgot my password. How do I reset it?',
    answer:
      'Go to the sign-in page and click "Forgot password". We’ll email you a link to set a new password.',
  },
  {
    question: 'How do I invite a letting agent, adviser or tenant?',
    answer:
      'Open the relevant section in your dashboard and use the invite option. The person will receive an email to set up their account.',
  },
  {
    question: 'How do I change or cancel my subscription?',
    answer:
      'Landlords can manage plans from Billing & Plans in the sidebar. Changes take effect from your next billing period.',
  },
  {
    question: 'Where can I download my reports?',
    answer:
      'Open Reports from the sidebar, choose a report type and date range, then click Download.',
  },
  {
    question: 'How do I report a bug or request a feature?',
    answer:
      'Signed-in users can raise a support ticket from Support Tickets in the sidebar. Choose "Bug report" or "Feature request" as the type.',
  },
];
