import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useGetInviteTeamMemberQuery,
  useGetTeamMembersQuery,
} from '@/store/api/endpoints/client/Common/Tools/TeamAccess/TeamAccessApi';
import React, { useState } from 'react';
import AcceptedUsers from './AcceptedUsers';
import InvitedUsers from './InvitedUsers';

const Members: React.FC = () => {
  const [invitesPage, setInvitesPage] = useState(1);
  const [membersPage, setMembersPage] = useState(1);

  const {
    data: teamMembers,
    isLoading,
    isError,
    refetch,
  } = useGetTeamMembersQuery({ page: membersPage });
  const {
    data: inviteTeamMembers,
    isLoading: isInviteLoading,
    isError: isInviteError,
    refetch: refetchInvites,
  } = useGetInviteTeamMemberQuery({ page: invitesPage });

  const members = teamMembers?.results || [];
  const invites = inviteTeamMembers?.results || [];

  const invitesCount = inviteTeamMembers?.count ?? 0;
  const membersCount = teamMembers?.count ?? 0;
  const invitesHasNext = Boolean(inviteTeamMembers?.next);
  const invitesHasPrevious = Boolean(inviteTeamMembers?.previous);
  const membersHasNext = Boolean(teamMembers?.next);
  const membersHasPrevious = Boolean(teamMembers?.previous);

  return (
    <Card>
      <CardContent className='p-5'>
        <Tabs defaultValue='invited' className='w-full'>
          <TabsList className='mb-4 grid w-full grid-cols-2'>
            <TabsTrigger value='invited' className='cursor-pointer'>
              Invite Users
              {invites.length > 0 && (
                <Badge className='ml-2 h-5 min-w-5 rounded-full px-1.5 text-xs'>
                  {invites.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value='accepted' className='cursor-pointer'>
              Accepted Users
              {members.length > 0 && (
                <Badge className='ml-2 h-5 min-w-5 rounded-full px-1.5 text-xs'>
                  {members.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Invited Users */}
          <TabsContent value='invited' className='space-y-3'>
            <InvitedUsers
              invites={invites}
              isInviteLoading={isInviteLoading}
              isInviteError={isInviteError}
              refetchInvites={refetchInvites}
              page={invitesPage}
              onPageChange={(p: number) => setInvitesPage(Math.max(1, p))}
              hasNext={invitesHasNext}
              hasPrevious={invitesHasPrevious}
              totalCount={invitesCount}
            />
          </TabsContent>

          {/* Accepted Users */}
          <TabsContent value='accepted' className='space-y-3'>
            <AcceptedUsers
              members={members}
              isLoading={isLoading}
              isError={isError}
              refetch={refetch}
              page={membersPage}
              onPageChange={(p: number) => setMembersPage(Math.max(1, p))}
              hasNext={membersHasNext}
              hasPrevious={membersHasPrevious}
              totalCount={membersCount}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Members;
