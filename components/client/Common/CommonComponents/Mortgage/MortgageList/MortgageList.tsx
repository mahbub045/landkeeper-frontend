'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Mortgage } from '@/types/client/Common/Mortgage/MortgageTypes';
import MortgageCard from '../MortgageCard/MortgageCard';

const MortgageList: React.FC<{ mortgages: Mortgage[]; isLoading: boolean }> = ({
  mortgages,
  isLoading,
}) => {
  if (isLoading)
    return (
      <div className='space-y-4'>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className='h-84 rounded-2xl' />
        ))}
      </div>
    );

  if (!mortgages.length)
    return <p className='text-muted-foreground text-sm'>No mortgages found.</p>;

  return (
    <div className='space-y-4'>
      {mortgages.map((mortgage) => (
        <MortgageCard key={mortgage.alias} mortgage={mortgage} />
      ))}
    </div>
  );
};

export default MortgageList;
