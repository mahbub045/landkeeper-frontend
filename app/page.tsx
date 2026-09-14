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

  const isSubscribed =
    session.user.has_subscription === true &&
    (session.user.subscription_status === 'ACTIVE' ||
      session.user.subscription_status === 'TRIALING');

  if (userRole === 'LANDLORD' && !isSubscribed) {
    redirect('/client/landlord/billing-and-plans/billing');
  }

  redirect(getDashboardPath(userRole as UserRole));
}
