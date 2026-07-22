import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import { Badge } from '@/components/ui/badge';
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
import { Skeleton } from '@/components/ui/skeleton';
import { PAGE_LIMIT } from '@/data/common/PaginationData';
import { InvitedUsersProps } from '@/types/client/Common/Tools/TeamAccess/InvitedUsersTypes';
import { InviteMember } from '@/types/client/Common/Tools/TeamAccess/TeamAccessTypes';
import { formatChoiceFieldValue, formatDate } from '@/utils/formatters';
import {
  Mail,
  MessagesSquare,
  RefreshCw,
  Trash2,
  UserPlus,
} from 'lucide-react';
import React, { useState } from 'react';
import DeleteInvitedUserDialog from './Dialogs/DeleteInvitedUserDialog';
import ResendEmailInvitedUserDialog from './Dialogs/ResendEmailInvitedUserDialog';

const InvitedUsers: React.FC<InvitedUsersProps> = ({
  invites,
  isInviteLoading,
  isInviteError,
  refetchInvites,
  page,
  onPageChange,
  totalCount,
}) => {
  const [
    isResendEmailInvitedUserDialogOpen,
    setIsResendEmailInvitedUserDialogOpen,
  ] = useState(false);
  const [isDeleteInvitedUserDialogOpen, setIsDeleteInvitedUserDialogOpen] =
    useState(false);
  const [selectedInviteUser, setSelectedInviteUser] =
    useState<InviteMember | null>(null);

  const handleResendEmailDialogOpen = (invite: InviteMember) => {
    setSelectedInviteUser(invite);
    setIsResendEmailInvitedUserDialogOpen(true);
  };

  const handleDeleteInvitedUserDialogOpen = (invite: InviteMember) => {
    setSelectedInviteUser(invite);
    setIsDeleteInvitedUserDialogOpen(true);
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
      {isInviteLoading && (
        <div className='space-y-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className='border'>
              <CardContent className='flex items-center gap-4 px-4 py-4'>
                <Skeleton className='size-11 shrink-0 rounded-full' />
                <div className='min-w-0 flex-1 space-y-2'>
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='h-3 w-48' />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isInviteLoading && isInviteError && (
        <CustomErrorMessage title='invited users' />
      )}

      {!isInviteLoading && !isInviteError && invites.length === 0 && (
        <div className='flex flex-col items-center justify-center gap-3 py-10 text-center'>
          <div className='bg-muted flex size-12 items-center justify-center rounded-full'>
            <UserPlus className='text-muted-foreground size-6' />
          </div>
          <div>
            <p className='text-foreground text-sm font-semibold'>
              No pending invites
            </p>
            <p className='text-muted-foreground mt-1 text-xs'>
              You haven&apos;t invited any team members yet.
            </p>
          </div>
        </div>
      )}

      {!isInviteLoading &&
        !isInviteError &&
        invites.length > 0 &&
        invites.map((invite: InviteMember, i: number) => {
          return (
            <Card key={`${invite.email}-${i}`} className='border'>
              <CardContent className='relative flex items-center gap-4 px-4 py-4'>
                <Badge className='border-warning/30 bg-warning/10 text-warning absolute -top-2 right-2 gap-1.5 px-2 py-1.5 text-xs font-semibold hover:bg-inherit'>
                  <span className='bg-warning inline-block size-1.5 rounded-full' />
                  Pending
                </Badge>

                <div className='bg-primary/10 flex size-11 shrink-0 items-center justify-center rounded-full'>
                  <Mail className='text-primary size-5' />
                </div>

                <div className='min-w-0 flex-1'>
                  <p className='text-foreground truncate text-sm font-bold'>
                    {invite.email} &bull;{' '}
                    <small className='text-muted-foreground mt-0.5 text-xs'>
                      {' '}
                      {formatChoiceFieldValue(invite?.role)}
                    </small>
                  </p>

                  {invite.message && (
                    <p className='text-muted-foreground/70 mt-0.5 flex items-center gap-1 text-xs'>
                      <MessagesSquare size={16} />
                      {invite.message}
                    </p>
                  )}
                  <p className='text-muted-foreground/70 mt-0.5 text-xs'>
                    Invited {formatDate(invite.created_at)}
                  </p>
                </div>

                <div className='flex shrink-0 items-center gap-1.5'>
                  <Button
                    variant='outline'
                    size='sm'
                    title='Resend invite email'
                    onClick={() => handleResendEmailDialogOpen(invite)}
                  >
                    <RefreshCw />
                    Resend Email
                  </Button>

                  <Button
                    variant='destructive'
                    size='sm'
                    title='Delete invite'
                    onClick={() => handleDeleteInvitedUserDialogOpen(invite)}
                  >
                    <Trash2 />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

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
      <ResendEmailInvitedUserDialog
        isOpen={isResendEmailInvitedUserDialogOpen}
        onClose={() => setIsResendEmailInvitedUserDialogOpen(false)}
        inviteUserData={selectedInviteUser}
      />
      <DeleteInvitedUserDialog
        isOpen={isDeleteInvitedUserDialogOpen}
        onClose={() => setIsDeleteInvitedUserDialogOpen(false)}
        inviteUserData={selectedInviteUser}
      />
    </>
  );
};

export default InvitedUsers;
