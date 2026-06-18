'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MortgageList from './Mortgagelist/Mortgagelist';
import SummaryCards from './Summarycards/Summarycards';

const MortgageContainer: React.FC = () => {
  return (
    <div className='space-y-6'>
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-foreground text-2xl font-bold tracking-tight'>
            Mortgages
          </h1>
          <p className='text-muted-foreground text-sm'>
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
