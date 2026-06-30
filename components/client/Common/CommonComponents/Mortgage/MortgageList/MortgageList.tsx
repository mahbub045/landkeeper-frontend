'use client';

import { Mortgage } from '@/types/client/Common/Mortgage/MortgageTypes';
import MortgageCard from '../MortgageCard/MortgageCard';

const MortgageList: React.FC<{ mortgages: Mortgage[]; isLoading: boolean }> = ({
  mortgages,
  isLoading,
}) => {
  if (isLoading)
    return (
      <p className='text-muted-foreground text-sm'>Loading mortgages...</p>
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
