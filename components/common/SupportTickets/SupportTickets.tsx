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
import { useGetSupportTicketsQuery } from '@/store/api/endpoints/common/SupportTickets/SupportTicketsApi';
import {
  ApiSupportTicket,
  SupportTicket as SupportTicketModel,
} from '@/types/common/SupportTickets/SupportTicketTypes';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AddSupportTicketDialog from './Dialogs/AddSupportTicketDialog';
import SupportTicketTable from './SupportTicketTable/SupportTicketTable';

const PAGE_LIMIT = 12;

function mapApiTicket(apiTicket: ApiSupportTicket): SupportTicketModel {
  return {
    alias: apiTicket.alias,
    ticketId: apiTicket.ticket_id,
    ticketType: apiTicket.ticket_type,
    subject: apiTicket.subject,
    description: apiTicket.description,
    fileCount: apiTicket.files?.length ?? 0,
    createdAt: apiTicket.created_at,
    createdByName: apiTicket.created_by?.name?.trim() || 'Unknown',
    createdByEmail: apiTicket.created_by?.email,
    createdByAvatar: apiTicket.created_by?.profile_image ?? undefined,
    organisation: apiTicket.organisation,
  };
}

const SupportTicket: React.FC = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const queryParams = {
    page,
    page_size: PAGE_LIMIT,
    ...(debouncedSearch && { search: debouncedSearch }),
  };

  const { data, isLoading, isError } = useGetSupportTicketsQuery(queryParams);

  const tickets = useMemo(
    () => (data?.results ?? []).map(mapApiTicket),
    [data?.results],
  );

  const apiTickets = data?.results ?? [];

  const totalPages = Math.ceil((data?.count ?? 0) / PAGE_LIMIT);

  function handleSearchChange(value: string) {
    setSearch(value);
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

        <Button onClick={() => setModalOpen(true)}>
          <Plus />
          Add Ticket
        </Button>
      </div>

      {isError ? (
        <p className='text-danger text-sm'>
          Failed to load support tickets. Please try again.
        </p>
      ) : (
        <>
          <SupportTicketTable
            tickets={tickets}
            apiTickets={apiTickets}
            search={search}
            onSearchChange={handleSearchChange}
            isLoading={isLoading}
          />

          {totalPages > 1 && (
            <div className='flex items-center justify-between'>
              <p className='text-muted-foreground text-sm whitespace-nowrap'>
                Showing {(page - 1) * PAGE_LIMIT + 1} to{' '}
                {Math.min(page * PAGE_LIMIT, data?.count ?? 0)} of{' '}
                {data?.count ?? 0} Tickets
              </p>

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
            </div>
          )}
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
