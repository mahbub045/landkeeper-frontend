import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetTeamMembersQuery } from '@/store/api/endpoints/client/Common/Tools/TeamAccess/TeamAccessApi';
import { TeamMember } from '@/types/client/Common/Tools/TeamAccess/TeamAccessTypes';
import formatChoiceFieldValue, {
  formatDate,
  getInitials,
} from '@/utils/formatters';
import {
  AlertCircle,
  MessagesSquare,
  Pencil,
  Trash2,
  Users,
} from 'lucide-react';

const Members: React.FC = () => {
  const {
    data: teamMembers,
    isLoading,
    isError,
    refetch,
  } = useGetTeamMembersQuery(undefined);

  const members = teamMembers?.results || [];

  return (
    <Card>
      <CardContent className='space-y-3 p-5'>
        <h2 className='text-foreground mb-4 text-sm font-semibold'>
          Active Team Members
        </h2>

        {/* Loading skeleton */}
        {isLoading && (
          <div className='space-y-3'>
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className='border'>
                <CardContent className='flex items-center gap-4 px-4 py-4'>
                  <Skeleton className='size-11 shrink-0 rounded-full' />
                  <div className='min-w-0 flex-1 space-y-2'>
                    <Skeleton className='h-4 w-32' />
                    <Skeleton className='h-3 w-48' />
                  </div>
                  <div className='flex shrink-0 items-center gap-2'>
                    <Skeleton className='size-9 rounded-lg' />
                    <Skeleton className='size-9 rounded-lg' />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error state */}
        {!isLoading && isError && (
          <div className='flex flex-col items-center justify-center gap-3 py-10 text-center'>
            <div className='bg-danger/10 flex size-12 items-center justify-center rounded-full'>
              <AlertCircle className='text-danger size-6' />
            </div>
            <div>
              <p className='text-foreground text-sm font-semibold'>
                Failed to load team members
              </p>
              <p className='text-muted-foreground mt-1 text-xs'>
                Something went wrong while fetching the team. Please try again.
              </p>
            </div>
            <Button variant='outline' size='sm' onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}

        {/* Not found / empty state */}
        {!isLoading && !isError && members.length === 0 && (
          <div className='flex flex-col items-center justify-center gap-3 py-10 text-center'>
            <div className='bg-muted flex size-12 items-center justify-center rounded-full'>
              <Users className='text-muted-foreground size-6' />
            </div>
            <div>
              <p className='text-foreground text-sm font-semibold'>
                No team members found
              </p>
              <p className='text-muted-foreground mt-1 text-xs'>
                You haven&apos;t added any team members yet.
              </p>
            </div>
          </div>
        )}

        {/* Data */}
        {!isLoading &&
          !isError &&
          members.length > 0 &&
          members.map((member: TeamMember) => (
            <Card key={member?.user?.alias} className='border'>
              <CardContent className='relative flex items-center gap-4 px-4 py-4'>
                <Badge
                  className={`absolute -top-2 right-2 gap-1.5 px-2 py-1.5 text-xs font-semibold hover:bg-inherit ${member?.user?.is_active ? 'border-success/30 bg-success/10 text-success' : 'border-warning/30 bg-warning/10 text-warning'}`}
                >
                  <span
                    className={`inline-block size-1.5 rounded-full ${member?.user?.is_active ? 'bg-success' : 'bg-warning'}`}
                  />
                  {member?.user?.is_active ? 'Active' : 'Pending'}
                </Badge>

                {/* Avatar */}
                <Avatar className='size-11 shrink-0'>
                  <AvatarImage
                    src={member?.user?.profile_image}
                    alt={member?.user?.first_name || 'User'}
                  />
                  <AvatarFallback className='bg-primary/10 text-primary text-sm font-bold'>
                    {getInitials(member?.user?.first_name || 'U')}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className='min-w-0 flex-1'>
                  <p className='text-foreground text-sm font-bold'>
                    {formatChoiceFieldValue(member?.user?.title)}{' '}
                    {member?.user?.first_name} {member?.user?.middle_name}{' '}
                    {member?.user?.last_name}
                  </p>
                  <p className='text-muted-foreground mt-0.5 text-xs'>
                    {formatChoiceFieldValue(member?.role)} &bull;{' '}
                    {member?.user?.email}
                  </p>
                  {member?.user?.phone && (
                    <p className='text-muted-foreground/70 mt-0.5 flex items-center gap-1 text-xs'>
                      <MessagesSquare size={16} />
                      {member?.user?.phone}
                    </p>
                  )}
                  {member?.created_at && (
                    <p className='text-muted-foreground/70 mt-0.5 text-xs'>
                      Joined {formatDate(member?.created_at)}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className='flex shrink-0 items-center gap-2'>
                  <Button
                    aria-label='Edit'
                    variant='outline'
                    size='icon'
                    className='rounded-lg'
                  >
                    <Pencil />
                  </Button>
                  <Button
                    aria-label='Remove'
                    variant='danger'
                    size='icon'
                    className='rounded-lg'
                  >
                    <Trash2 />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </CardContent>
    </Card>
  );
};

export default Members;
