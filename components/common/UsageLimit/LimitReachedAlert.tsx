'use client';

import { Button } from '@/components/ui/button';
import { LimitReachedAlertProps } from '@/types/common/Permissions/CommonPermissionsTypes';
import { Sparkles, TriangleAlert } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const UPGRADE_PLAN_PATH = '/client/landlord/billing-and-plans/pricing-plans';

const LimitReachedAlert: React.FC<LimitReachedAlertProps> = ({
  resource,
  max,
}) => {
  const { data: session } = useSession();
  // Only the landlord owns the subscription and can change the plan
  const canUpgrade = session?.user?.role === 'LANDLORD';

  return (
    <div className='flex flex-col gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-amber-500/30 dark:bg-amber-500/10'>
      <div className='flex items-start gap-3'>
        <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'>
          <TriangleAlert className='size-5' />
        </div>
        <div>
          <p className='text-sm font-semibold text-amber-900 dark:text-amber-200'>
            You&rsquo;ve reached your {resource} limit
          </p>
          <p className='text-sm text-amber-800/80 dark:text-amber-200/70'>
            {max !== null && (
              <>
                Your current plan allows up to {max} {resource}.{' '}
              </>
            )}
            {canUpgrade
              ? `Upgrade your plan to add more ${resource}.`
              : `Ask your landlord to upgrade the plan to add more ${resource}.`}
          </p>
        </div>
      </div>
      {canUpgrade && (
        <Button asChild size='sm' className='shrink-0'>
          <Link href={UPGRADE_PLAN_PATH}>
            <Sparkles />
            Upgrade plan
          </Link>
        </Button>
      )}
    </div>
  );
};

export default LimitReachedAlert;
