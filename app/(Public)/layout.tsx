import PublicPageShell from '@/components/common/LegalPages/PublicPageShell';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicPageShell>{children}</PublicPageShell>;
}
