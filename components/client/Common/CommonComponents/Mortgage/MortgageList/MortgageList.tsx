'use client';

import { Skeleton } from '@/components/ui/skeleton';
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
  if (isLoading)
    return (
      <div className='space-y-4'>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className='h-84 rounded-2xl' />
        ))}
      </div>
    );

  if (!mortgages.length)
    return (
      <div className='text-muted-foreground flex flex-col items-center justify-center py-20 text-center'>
        <Landmark className='mb-3 size-10' />
        <p className='text-sm font-medium'>No mortgages found</p>
      </div>
    );

  return (
    <div className='grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
      {mortgages.map((mortgage) => (
        <Link
          key={mortgage.alias}
          href={getMortgageDetailsUrl(session, mortgage.alias)}
        >
          <MortgageCard mortgage={mortgage} />
        </Link>
      ))}
    </div>
  );
};

export default MortgageList;
