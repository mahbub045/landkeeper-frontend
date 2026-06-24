'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import MortgageList from './MortgageList/MortgageList';
import SummaryCards from './SummaryCards/SummaryCards';
import AddMortgageDialog from './Dialogs/AddMortgageDialog';

const Mortgage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

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
        <Button onClick={() => setModalOpen(true)}>
          <Plus />
          Add Mortgage
        </Button>
      </div>

      <SummaryCards />
      <MortgageList />

      <AddMortgageDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          // refetch / invalidate RTK cache here
        }}
        properties={[]} // pass your properties array here
      />
    </div>
  );
};

export default Mortgage;
