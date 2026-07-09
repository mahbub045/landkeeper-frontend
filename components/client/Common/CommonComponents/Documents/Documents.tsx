'use client';

import { Search, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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

import { filterTabs } from '@/data/client/common/documents/DocumentsData';
import { useGetDocumentsQuery } from '@/store/api/endpoints/client/Common/Documents/DocumentsApi';
import {
  FilterTab,
  PropertyDocument,
} from '@/types/client/Common/Documents/DocumentTypes';
import AddDocumentDialog from './Dialogs/AddDocumentDialog';
import DocumentFilter from './DocumentFilter/DocumentFilter';
import DocumentList from './DocumentList/DocumentList';
import HoverInfoPopover from '@/components/common/HoverInfoPopover/HoverInfoPopover';

const PAGE_LIMIT = 12;

const Documents: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('ALL');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const queryParams = {
    page,
    page_size: PAGE_LIMIT,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(activeFilter !== 'ALL' && { document_category: activeFilter }),
  };

  const { data, isLoading, isError } = useGetDocumentsQuery(queryParams);

  const documents: PropertyDocument[] = data?.results ?? [];
  const totalPages = Math.ceil((data?.count ?? 0) / PAGE_LIMIT);

  const activeFilterLabel =
    filterTabs.find((tab) => tab.value === activeFilter)?.label ?? 'All';

  function handleFilterChange(tab: FilterTab) {
    setActiveFilter(tab);
    setPage(1);
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
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
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <h1 className='text-foreground text-2xl font-bold'>Documents</h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            Manage all property-related documents
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <div className='relative w-64'>
            <Search className='text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2' />
            <Input
              type='text'
              placeholder='Search...'
              value={search}
              onChange={handleSearchChange}
              className='h-8! w-64 pr-8! pl-7!'
            />
            <HoverInfoPopover text='You can search using Property Name and Document Name.' />
          </div>

          <Button onClick={() => setUploadOpen(true)}>
            <Upload />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Filters */}
      <DocumentFilter
        filterTabs={filterTabs}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {isError ? (
        <p className='text-danger text-center text-sm'>
          Failed to load documents. Please try again.
        </p>
      ) : (
        <>
          {/* Document Library */}
          <Card className='overflow-hidden'>
            <CardHeader className='flex flex-row items-center justify-between border-b'>
              <h2 className='text-foreground text-sm font-semibold'>
                Document Library
              </h2>

              <span className='text-muted-foreground text-sm'>
                {data?.count ?? 0} documents
              </span>
            </CardHeader>

            <CardContent className='p-0'>
              <DocumentList
                documents={documents}
                activeFilterLabel={activeFilterLabel}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          {totalPages > 1 && (
            <div className='flex items-center justify-between'>
              <p className='text-muted-foreground text-sm whitespace-nowrap'>
                Showing {(page - 1) * PAGE_LIMIT + 1} to{' '}
                {Math.min(page * PAGE_LIMIT, data?.count ?? 0)} of{' '}
                {data?.count ?? 0} Documents
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
                      onClick={() =>
                        page < totalPages && setPage((p) => p + 1)
                      }
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

      {/* Upload modal */}
      <AddDocumentDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={() => setUploadOpen(false)}
      />
    </div>
  );
};

export default Documents;