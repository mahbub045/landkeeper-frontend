'use client';

import LimitReachedAlert from '@/components/common/UsageLimit/LimitReachedAlert';
import UsageLimit from '@/components/common/UsageLimit/UsageLimit';
import { Button } from '@/components/ui/button';
import { useGetCommonPermissionsQuery } from '@/store/api/endpoints/common/Permissions/CommonPermissionsApi';
import { UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import InviteTeamMemberDialog from './Dialogs/InviteTeamMemberDialog';
import Members from './Members/Members';

const TeamAccess: React.FC = () => {
  const [inviteOpen, setInviteOpen] = useState(false);
  const { data: commonPermissions } = useGetCommonPermissionsQuery(undefined);

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <h1 className='text-foreground text-2xl font-bold tracking-tight'>
            Team Access
          </h1>
          <p className='text-muted-foreground text-sm'>
            Manage professional access to your portfolio
          </p>
        </div>
        <div className='flex items-center gap-2'>
          {commonPermissions && (
            <UsageLimit
              icon={Users}
              label='Users'
              used={commonPermissions.user_count}
              max={commonPermissions.max_users}
            />
          )}
          {commonPermissions?.can_add_user && (
            <Button onClick={() => setInviteOpen(true)}>
              <UserPlus />
              Invite User
            </Button>
          )}
        </div>
      </div>

      {commonPermissions && !commonPermissions.can_add_user && (
        <LimitReachedAlert resource='users' max={commonPermissions.max_users} />
      )}

      {/* Member List  */}
      <Members />

      {/* Invite Team Member modal */}
      <InviteTeamMemberDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
      />
    </div>
  );
};

export default TeamAccess;
