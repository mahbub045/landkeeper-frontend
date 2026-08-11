'use client';
import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import HoverInfoPopover from '@/components/common/HoverInfoPopover/HoverInfoPopover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CATEGORY_STYLES,
  STATUS_STYLES,
} from '@/data/client/common/PropertyMaintenance/PropertyMaintenanceData';
import { PAGE_LIMIT } from '@/data/common/PaginationData';
import { useGetPropertyMaintenanceQuery } from '@/store/api/endpoints/client/Common/PropertyMaintenance/PropertyMaintenanceApi';
import { MaintenanceRequest } from '@/types/client/Common/PropertyMaintenance/PropertyMaintenanceType';
import formatChoiceFieldValue, { formatDateAndTime } from '@/utils/formatters';
import { getPropertyMaintenanceUrl } from '@/utils/redirectPath';
import { Edit, Plus, Search, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';

const SEARCH_DEBOUNCE_MS = 400;

const PropertyMaintenanceList: React.FC = () => {
  const { data: session } = useSession();
  // Raw text bound to the input, updates on every keystroke
  const [searchInput, setSearchInput] = useState('');
  // Debounced value that's actually sent to the API
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Debounce: wait for typing to pause before firing the API call,
  // then reset back to page 1 since the result set has changed.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const {
    data: propertyMaintenanceData,
    isLoading,
    isFetching,
    isError,
  } = useGetPropertyMaintenanceQuery({ page, limit: PAGE_LIMIT, search }); // adjust params to match your endpoint

  const maintenanceRequests: MaintenanceRequest[] = useMemo(
    () => propertyMaintenanceData?.results || [],
    [propertyMaintenanceData],
  );

  // Table rows show the skeleton on the first load and on any
  // subsequent refetch (search or page change).
  const showTableLoading = isLoading || isFetching;

  const totalCount = propertyMaintenanceData?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_LIMIT));

  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    const delta = 1;

    for (let p = 1; p <= totalPages; p++) {
      if (
        p === 1 ||
        p === totalPages ||
        (p >= page - delta && p <= page + delta)
      ) {
        pages.push(p);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <div className='w-full'>
      {/* Header */}
      <div className='mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold'>Maintenance requests</h1>
        </div>

        <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
          <div className='relative w-full sm:w-64'>
            <Search className='text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2' />
            <Input
              type='text'
              placeholder='Search...'
              value={searchInput}
              onChange={handleSearchChange}
              className='h-8! w-full pr-8! pl-7! sm:w-64'
            />
            <HoverInfoPopover
              text={
                session?.user?.role === 'TENANT'
                  ? 'You can search using Request ID.'
                  : 'You can search using Request ID, Property Tenant Name and Property Address.'
              }
            />
          </div>

          {session?.user?.role === 'TENANT' && (
            <Button onClick={() => console.log('Add request clicked')}>
              <Plus />
              Make Maintenance Request
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className='mb-4 w-full overflow-x-auto'>
        <Table className='min-w-180'>
          <TableHeader>
            <TableRow>
              <TableHead className='uppercase'>Request ID</TableHead>
              {session?.user?.role !== 'TENANT' && (
                <>
                  <TableHead className='uppercase'>Tenant</TableHead>
                  <TableHead className='uppercase'>Property</TableHead>
                </>
              )}
              <TableHead className='uppercase'>Issue</TableHead>
              <TableHead className='text-center uppercase'>Status</TableHead>
              <TableHead className='text-center uppercase'>Priority</TableHead>
              <TableHead className='text-center uppercase'>Category</TableHead>
              <TableHead className='text-center uppercase'>
                Created At
              </TableHead>
              <TableHead className='text-center uppercase'>
                Updated At
              </TableHead>
              <TableHead className='text-center uppercase'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {showTableLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 12 }).map((__, j) => (
                    <TableCell key={j} className='py-3.5'>
                      <div className='h-4 w-full max-w-35 animate-pulse rounded bg-gray-100' />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!showTableLoading && isError && (
              <TableRow>
                <TableCell colSpan={12} className='py-10 text-center'>
                  <CustomErrorMessage title='maintenance requests' />
                </TableCell>
              </TableRow>
            )}

            {!showTableLoading &&
              !isError &&
              maintenanceRequests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={12} className='py-10 text-center'>
                    <p className='text-sm text-gray-900'>
                      {search
                        ? 'No matching requests'
                        : 'No maintenance requests yet'}
                    </p>
                    <p className='mt-1 text-sm text-gray-500'>
                      {search
                        ? 'Try a different search term.'
                        : 'Add your first request to get started.'}
                    </p>
                  </TableCell>
                </TableRow>
              )}

            {!showTableLoading &&
              !isError &&
              maintenanceRequests.map((request) => (
                <TableRow
                  key={request.alias}
                  className={`transition-colors hover:bg-gray-50/60 ${
                    request.is_emergency ? 'text-danger' : ''
                  }`}
                >
                  <TableCell className='py-3.5 text-sm'>
                    <Link
                      href={getPropertyMaintenanceUrl(
                        session,
                        request.alias as string,
                      )}
                      className={`text_decoration_hover transition-colors hover:bg-gray-50/60 ${
                        request.is_emergency ? 'text-danger!' : ''
                      }`}
                    >
                      {request.request_id}
                    </Link>
                  </TableCell>
                  {session?.user?.role !== 'TENANT' && (
                    <>
                      <TableCell className='py-3.5 text-sm'>
                        {request.tenant}
                      </TableCell>
                      <TableCell className='max-w-50 truncate py-3.5 text-sm'>
                        {request.property}
                      </TableCell>
                    </>
                  )}
                  <TableCell className='max-w-50 truncate py-3.5 text-sm'>
                    {request.issue}
                  </TableCell>
                  <TableCell className='py-3.5 text-center'>
                    <Badge
                      className={` ${STATUS_STYLES[request.current_status]}`}
                    >
                      {formatChoiceFieldValue(request.current_status)}
                    </Badge>
                  </TableCell>
                  <TableCell className='py-3.5 text-center'>
                    <Badge
                      className={`${request.is_emergency ? 'bg-danger/20 text-danger' : 'bg-green-100 text-green-800'} rounded-full px-2.5 py-1 text-xs`}
                    >
                      {request.is_emergency ? 'Emergency' : 'Normal'}
                    </Badge>
                  </TableCell>
                  <TableCell className='py-3.5 text-center'>
                    <Badge
                      className={`${
                        CATEGORY_STYLES[request.category]
                      } rounded-full px-2.5 py-1 text-xs`}
                    >
                      {formatChoiceFieldValue(request.category)}
                    </Badge>
                  </TableCell>
                  <TableCell className='py-3.5 text-center text-sm'>
                    {formatDateAndTime(request.created_at)}
                  </TableCell>
                  <TableCell className='py-3.5 text-center text-sm'>
                    {formatDateAndTime(request.updated_at)}
                  </TableCell>
                  <TableCell className='py-3.5 text-center text-sm'>
                    <div className='flex justify-end gap-2'>
                      <Button
                        title='Edit'
                        onClick={() =>
                          console.log('Edit clicked for', request.alias)
                        }
                        size='icon'
                        variant='outline'
                      >
                        <Edit />
                      </Button>
                      <Button
                        title='Delete'
                        onClick={() =>
                          console.log('Delete clicked for', request.alias)
                        }
                        size='icon'
                        variant='destructive'
                      >
                        <Trash />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination footer */}
      {!isError && (
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          {totalCount > 0 && (
            <p className='text-muted-foreground text-sm whitespace-nowrap'>
              Showing {(page - 1) * PAGE_LIMIT + 1} to{' '}
              {Math.min(page * PAGE_LIMIT, totalCount)} of {totalCount} requests
            </p>
          )}
          {totalPages > 1 && (
            <Pagination className='justify-center sm:justify-end'>
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
      )}
    </div>
  );
};

export default PropertyMaintenanceList;
