import { authOptions } from '@/lib/auth';
import { UserRole } from '@/types/next-auth';
import { getDashboardPath } from '@/utils/redirectPath';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;
  if (!session) {
    redirect('/auth/signin');
  }

  if (userRole === 'LANDLORD' && session.user.has_subscription !== true) {
    redirect('/client/landlord/billing-and-plans/pricing-plans');
  }

  redirect(getDashboardPath(userRole as UserRole));
}
