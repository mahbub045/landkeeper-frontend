'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useAppSelector } from '@/store/hooks';
import { Mortgage } from '@/types/client/Common/Mortgage/MortgageTypes';
import { getMortgageDetailsUrl } from '@/utils/redirectPath';
import { Landmark } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import MortgageCard from './MortgageCard/MortgageCard';

const MortgageList: React.FC<{ mortgages: Mortgage[]; isLoading: boolean }> = ({
  mortgages,
  isLoading,
}) => {
  const { data: session } = useSession();
  const landlordAlias = useAppSelector(
    (state) => state.landlordAlias.landlordAlias,
  );
  if (isLoading)
    return (
      <div className='grid min-w-0 grid-cols-1 gap-4 space-y-4 sm:grid-cols-2 xl:grid-cols-3'>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className='h-84 rounded-2xl' />
        ))}
      </div>
    );

  if (!mortgages.length)
    return (
      <div className='bg-card flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed px-6 py-16 text-center'>
        <div className='bg-primary/10 ring-primary/5 flex size-16 items-center justify-center rounded-full ring-8'>
          <Landmark className='text-primary size-7' />
        </div>
        <div className='space-y-1'>
          <p className='text-foreground text-base font-semibold'>
            No mortgages found
          </p>
          <p className='text-muted-foreground max-w-sm text-sm'>
            There are no mortgages to show yet. Try a different search or add a
            mortgage to start tracking your property financing.
          </p>
        </div>
      </div>
    );

  return (
    <div className='grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
      {mortgages.map((mortgage) => (
        <Link
          key={mortgage.alias}
          href={getMortgageDetailsUrl(session, mortgage.alias, landlordAlias)}
        >
          <MortgageCard mortgage={mortgage} />
        </Link>
      ))}
    </div>
  );
};

export default MortgageList;
