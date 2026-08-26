import MainBodyShell from '@/components/layout/MainBodyShell';
import SessionExpiryReload from '@/components/SessionExpiryReload';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function MainBodyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <>
      <SessionExpiryReload />
      <MainBodyShell>{children}</MainBodyShell>
    </>
  );
}
