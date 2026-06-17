'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MortgageList from './Mortgagelist/Mortgagelist';
import SummaryCards from './Summarycards/Summarycards';

const MortgageContainer: React.FC = () => {
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
            Mortgages
          </h1>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Track and manage your property financing
          </p>
        </div>
        <Button>
          <Plus />
          Add Mortgage
        </Button>
      </div>

      <SummaryCards />
      <MortgageList />
    </div>
  );
};

export default MortgageContainer;
