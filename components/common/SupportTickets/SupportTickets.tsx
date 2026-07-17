'use client';

import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { PAGE_LIMIT } from '@/data/common/PaginationData';
import { useGetSupportTicketsQuery } from '@/store/api/endpoints/common/SupportTickets/SupportTicketsApi';
import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import CustomErrorMessage from '../CustomErrorMessage/CustomErrorMessage';
import AddSupportTicketDialog from './Dialogs/AddSupportTicketDialog';
import SupportTicketTable from './SupportTicketTable/SupportTicketTable';

const SupportTicket: React.FC = () => {
  const { data: session } = useSession();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [ticketTypeFilter, setTicketTypeFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const queryParams = {
    page,
    page_size: PAGE_LIMIT,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(ticketTypeFilter.length > 0 && {
      ticket_type: ticketTypeFilter.join(','),
    }),
    ...(priorityFilter.length > 0 && { priority: priorityFilter.join(',') }),
    ...(statusFilter.length > 0 && { status: statusFilter.join(',') }),
  };

  const {
    data: supportTicketData,
    isLoading,
    isError,
  } = useGetSupportTicketsQuery(queryParams);

  const apiTickets = supportTicketData?.results ?? [];

  const totalPages = Math.ceil((supportTicketData?.count ?? 0) / PAGE_LIMIT);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleTicketTypeFilterChange(values: string[]) {
    setTicketTypeFilter(values);
    setPage(1);
  }

  function handlePriorityFilterChange(values: string[]) {
    setPriorityFilter(values);
    setPage(1);
  }

  function handleStatusFilterChange(values: string[]) {
    setStatusFilter(values);
    setPage(1);
  }

  const getPageNumbers = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (page >= totalPages - 2)
      return [
        1,
        '...',
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [1, '...', page - 1, page, page + 1, '...', totalPages];
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-foreground text-2xl font-bold tracking-tight'>
            Support Tickets
          </h1>
          <p className='text-muted-foreground text-sm'>
            View and manage submitted support tickets
          </p>
        </div>
        {session?.user?.role !== 'SUPER_ADMIN' && (
          <Button onClick={() => setModalOpen(true)}>
            <Plus />
            Add Ticket
          </Button>
        )}
      </div>

      {isError ? (
        <CustomErrorMessage title='support tickets' />
      ) : (
        <>
          <SupportTicketTable
            supportTicketsData={apiTickets}
            search={search}
            onSearchChange={handleSearchChange}
            ticketTypeFilter={ticketTypeFilter}
            onTicketTypeFilterChange={handleTicketTypeFilterChange}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={handlePriorityFilterChange}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            isLoading={isLoading}
          />

          <div className='flex items-center justify-between'>
            {(supportTicketData?.count ?? 0) > 0 && (
              <p className='text-muted-foreground text-sm whitespace-nowrap'>
                Showing {(page - 1) * PAGE_LIMIT + 1} to{' '}
                {Math.min(page * PAGE_LIMIT, supportTicketData?.count ?? 0)} of{' '}
                {supportTicketData?.count ?? 0} Tickets
              </p>
            )}
            {totalPages > 1 && (
              <Pagination className='justify-end'>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => page > 1 && setPage((p) => p - 1)}
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
                          onClick={() => setPage(p as number)}
                          className='cursor-pointer'
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => page < totalPages && setPage((p) => p + 1)}
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
        </>
      )}

      <AddSupportTicketDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
      />
    </div>
  );
};

export default SupportTicket;
