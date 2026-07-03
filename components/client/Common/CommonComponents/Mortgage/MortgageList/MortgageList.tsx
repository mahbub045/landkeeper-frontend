'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Mortgage } from '@/types/client/Common/Mortgage/MortgageTypes';
import { Landmark } from 'lucide-react';
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
    return (
      <div className='text-muted-foreground flex flex-col items-center justify-center py-20 text-center'>
        <Landmark className='mb-3 size-10' />
        <p className='text-sm font-medium'>No mortgages found</p>
      </div>
    );

  return (
    <div className='space-y-4'>
      {mortgages.map((mortgage) => (
        <MortgageCard key={mortgage.alias} mortgage={mortgage} />
      ))}
    </div>
  );
};

export default MortgageList;
