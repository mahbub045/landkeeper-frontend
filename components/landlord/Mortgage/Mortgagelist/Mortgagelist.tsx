'use client';

import { mortgages } from '@/data/landlord/mortgage/MortgageData';
import MortgageCard from '../Mortgagecard/Mortgagecard';

const MortgageList: React.FC = () => {
  return (
    <div className='space-y-4'>
      {mortgages.map((mortgage) => (
        <MortgageCard key={mortgage.id} mortgage={mortgage} />
      ))}
    </div>
  );
};

export default MortgageList;
