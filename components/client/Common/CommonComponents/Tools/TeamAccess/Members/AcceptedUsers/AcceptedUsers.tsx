import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { PAGE_LIMIT } from '@/data/common/PaginationData';
import { useEditAcceptedUserMutation } from '@/store/api/endpoints/client/Common/Tools/TeamAccess/TeamAccessApi';
import { AcceptedUsersProps } from '@/types/client/Common/Tools/TeamAccess/AcceptedUserTypes';
import { TeamMember } from '@/types/client/Common/Tools/TeamAccess/TeamAccessTypes';
import {
  formatChoiceFieldValue,
  formatDate,
  getInitials,
} from '@/utils/formatters';
import { Mail, Pencil, Phone, ShieldUser, Trash2, Users } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import DeleteAcceptedUserDialog from './Dialogs/DeleteAcceptedUserDialog';
import EditAcceptedUserDialog from './Dialogs/EditAcceptedUserDialog';

const AcceptedUsers: React.FC<AcceptedUsersProps> = ({
  members,
  isLoading,
  isError,
  refetch,
  page,
  onPageChange,
  totalCount,
}) => {
  const [isEditAcceptedUserDialogOpen, setIsEditAcceptedUserDialogOpen] =
    useState(false);
  const [isDeleteAcceptedUserDialogOpen, setIsDeleteAcceptedUserDialogOpen] =
    useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [updateAcceptedUserStatus, { isLoading: isUpdatingStatus }] =
    useEditAcceptedUserMutation();

  const handleEditAcceptedUserDialogOpen = (member: TeamMember) => {
    setSelectedMember(member);
    setIsEditAcceptedUserDialogOpen(true);
  };

  const handleDeleteAcceptedUserDialogOpen = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDeleteAcceptedUserDialogOpen(true);
  };

  const handleStatusChange = async (member: TeamMember, nextStatus: string) => {
    if (!member?.user?.alias) return;

    const nextIsActive = nextStatus === 'active';

    if (member.user.is_active === nextIsActive) return;

    try {
      await updateAcceptedUserStatus({
        alias: member.user.alias,
        body: {
          user: {
            is_active: nextIsActive,
          },
        },
      }).unwrap();

      toast.success(
        nextIsActive ? 'Member marked active' : 'Member deactivated',
      );
    } catch {
      toast.error('Failed to update member status. Please try again.');
    }
  };

  const totalPages = Math.max(1, Math.ceil((totalCount ?? 0) / PAGE_LIMIT));

  const getPageNumbers = () => {
    const total = totalPages;
    const current = page;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const siblings = 1;
    const left = Math.max(2, current - siblings);
    const right = Math.min(total - 1, current + siblings);

    const showLeftEllipsis = left > 2;
    const showRightEllipsis = right < total - 1;

    const pages: (number | string)[] = [1];
    if (showLeftEllipsis) pages.push('...');
    for (let p = left; p <= right; p++) pages.push(p);
    if (showRightEllipsis) pages.push('...');
    pages.push(total);
    return pages;
  };
  return (
    <>
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

      {!isLoading && isError && <CustomErrorMessage title='team members' />}

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

      {!isLoading &&
        !isError &&
        members.length > 0 &&
        members.map((member: TeamMember) => (
          <Card key={member?.user?.alias} className='border'>
            <CardContent className='relative flex items-center gap-4 px-4 py-4'>
              <Select
                value={member?.user?.is_active ? 'active' : 'deactivated'}
                onValueChange={(value) => handleStatusChange(member, value)}
                disabled={isUpdatingStatus}
              >
                <SelectTrigger
                  size='sm'
                  className={`absolute -top-2 right-2 h-6! w-fit gap-1.5 border px-2 py-1.5 text-xs font-semibold hover:bg-inherit ${member?.user?.is_active ? 'border-success/30 bg-success/10 text-success' : 'border-danger/30 bg-danger/10 text-danger'}`}
                >
                  <span
                    className={`inline-block size-1.5 rounded-full ${member?.user?.is_active ? 'bg-success' : 'bg-danger'}`}
                  />
                  <SelectValue>
                    {member?.user?.is_active ? 'Active' : 'Deactivated'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='active' className='focus:bg-success/10'>
                    <span className='bg-success inline-block size-1.5 rounded-full' />
                    Active
                  </SelectItem>
                  <SelectItem
                    value='deactivated'
                    className='focus:bg-danger/10'
                  >
                    <span className='bg-danger inline-block size-1.5 rounded-full' />
                    Deactivated
                  </SelectItem>
                </SelectContent>
              </Select>

              <Avatar className='size-11 shrink-0'>
                <AvatarImage
                  src={member?.user?.profile_image}
                  alt={member?.user?.first_name || 'User'}
                />
                <AvatarFallback className='bg-primary/10 text-primary text-sm font-bold'>
                  {getInitials(member?.user?.first_name || 'U')}
                </AvatarFallback>
              </Avatar>

              <div className='min-w-0 flex-1'>
                <p className='text-foreground text-sm font-bold'>
                  {formatChoiceFieldValue(member?.user?.title)}{' '}
                  {member?.user?.first_name} {member?.user?.middle_name}{' '}
                  {member?.user?.last_name}
                </p>
                <p className='text-muted-foreground mt-0.5 flex gap-2 text-xs font-semibold'>
                  <span className='flex gap-0.5'>
                    <ShieldUser size={14} />
                    {formatChoiceFieldValue(member?.role)}
                  </span>
                  <span className='font-bold'>&bull;</span>
                  <span className='flex gap-0.5'>
                    <Mail size={14} />
                    {member?.user?.email}
                  </span>
                </p>
                {member?.user?.phone && (
                  <p className='text-muted-foreground mt-0.5 flex items-center gap-1 text-xs'>
                    <Phone size={16} />
                    {member?.user?.phone}
                  </p>
                )}
                {member?.created_at && (
                  <p className='text-muted-foreground/70 mt-0.5 text-xs'>
                    Joined {formatDate(member?.created_at)}
                  </p>
                )}
              </div>

              <div className='flex shrink-0 items-center gap-2'>
                <Button
                  aria-label='Edit'
                  variant='outline'
                  size='icon'
                  title='Edit User'
                  className='rounded-lg'
                  onClick={() => handleEditAcceptedUserDialogOpen(member)}
                >
                  <Pencil />
                </Button>
                <Button
                  aria-label='Remove'
                  variant='danger'
                  size='icon'
                  title='Delete User'
                  className='rounded-lg'
                  onClick={() => handleDeleteAcceptedUserDialogOpen(member)}
                >
                  <Trash2 />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      {/* Pagination */}

      <div className='mt-3 flex items-center justify-between'>
        {totalCount > 0 && (
          <p className='text-muted-foreground text-sm whitespace-nowrap'>
            Showing {(page - 1) * PAGE_LIMIT + 1} to{' '}
            {Math.min(page * PAGE_LIMIT, totalCount ?? 0)} of {totalCount ?? 0}{' '}
            Invites
          </p>
        )}
        {totalPages > 1 && (
          <Pagination className='justify-end'>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && onPageChange(page - 1)}
                  aria-disabled={page === 1}
                  className={
                    page === 1
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>

              {getPageNumbers().map((p, i) =>
                p === '...' ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === page}
                      onClick={() => onPageChange(p as number)}
                      className='cursor-pointer'
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => page < totalPages && onPageChange(page + 1)}
                  aria-disabled={page === totalPages}
                  className={
                    page === totalPages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Dialogs  */}
      <EditAcceptedUserDialog
        isOpen={isEditAcceptedUserDialogOpen}
        onClose={() => setIsEditAcceptedUserDialogOpen(false)}
        member={selectedMember}
      />
      <DeleteAcceptedUserDialog
        isOpen={isDeleteAcceptedUserDialogOpen}
        onClose={() => setIsDeleteAcceptedUserDialogOpen(false)}
        member={selectedMember}
      />
    </>
  );
};
export default AcceptedUsers;
