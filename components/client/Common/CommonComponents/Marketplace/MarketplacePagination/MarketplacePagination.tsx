'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { MarketplacePaginationProps } from '@/types/super-admin/Marketplace/MarketplaceTypes';

const MarketplacePagination: React.FC<MarketplacePaginationProps> = ({
  page,
  pageSize,
  totalCount,
  onPageChange,
  itemLabel = 'Services',
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalCount === 0) return null;

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
    <div className='flex flex-col items-center justify-between gap-3 sm:flex-row'>
      <p className='text-muted-foreground text-sm whitespace-nowrap'>
        Showing {(page - 1) * pageSize + 1} to{' '}
        {Math.min(page * pageSize, totalCount)} of {totalCount} {itemLabel}
      </p>
      {totalPages > 1 && (
        <Pagination className='mx-0 w-auto justify-end'>
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
  );
};

export default MarketplacePagination;
