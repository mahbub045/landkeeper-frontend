'use client';

import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import Members from './Members/Members';
import InviteTeamMemberDialog from './Dialogs/InviteTeamMemberModal';

const TeamAccessContainer: React.FC = () => {
  const [inviteOpen, setInviteOpen] = useState(false); // ← new

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
        <Button onClick={() => setInviteOpen(true)}>
          <UserPlus />
          Invite User
        </Button>
      </div>
      <Members />

      {/* Invite Team Member modal */}
      <InviteTeamMemberDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onSuccess={() => {
          // refetch / revalidate Members list here once the API call is wired up
        }}
      />
    </div>
  );
};

export default TeamAccessContainer;
