'use client';

import { mortgages } from '@/data/client/Landlord/mortgage/MortgageData';
import MortgageCard from '../MortgageCard/MortgageCard';

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
