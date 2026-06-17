'use client';

import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import Members from './Members/Members';

const TeamAccessContainer: React.FC = () => {
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
            Team Access
          </h1>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Manage professional access to your portfolio
          </p>
        </div>

        <Button>
          <UserPlus />
          Invite User
        </Button>
      </div>

      {/* MemberList */}
      <Members />
    </div>
  );
};

export default TeamAccessContainer;
