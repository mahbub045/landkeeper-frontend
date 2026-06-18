'use client';

import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import Members from './Members/Members';

const TeamAccessContainer: React.FC = () => {
  return (
    <div className='space-y-6'>
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-foreground text-2xl font-bold tracking-tight'>
            Team Access
          </h1>
          <p className='text-muted-foreground text-sm'>
            Manage professional access to your portfolio
          </p>
        </div>
        <Button>
          <UserPlus />
          Invite User
        </Button>
      </div>
      <Members />
    </div>
  );
};

export default TeamAccessContainer;
