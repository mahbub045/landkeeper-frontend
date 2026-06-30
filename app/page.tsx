import { authOptions } from '@/lib/auth';
import { getDashboardPath } from '@/lib/navigation';
import { UserRole } from '@/types/next-auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;
  redirect(session ? getDashboardPath(userRole as UserRole) : '/auth/signin');
}
