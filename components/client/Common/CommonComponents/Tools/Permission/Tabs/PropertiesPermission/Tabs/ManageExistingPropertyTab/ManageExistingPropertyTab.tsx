'use client';
import { Card } from '@/components/ui/card';
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
import {
  ManageExistingTabProps,
  PropertiesPermissionType,
} from '@/types/client/Common/Tools/Permission/PropertiesPermissionTypes';
import { PAGE_LIMIT } from '@/utils/CommonConstants';
import GrantedPropertieCard from './GrantedPropertieCard/GrantedPropertieCard';

const getPageNumbers = (
  page: number,
  totalPages: number,
): (number | '...')[] => {
  const delta = 1;
  const range: (number | '...')[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= page - delta && i <= page + delta)
    ) {
      range.push(i);
    } else if (range[range.length - 1] !== '...') {
      range.push('...');
    }
  }

  return range;
};

const ManageExistingPropertyTab: React.FC<ManageExistingTabProps> = ({
  isLoadingGranted,
  userAlias,
  grantedProperties,
  grantedCount,
  grantedTotalPages,
  grantedPage,
  setGrantedPage,
  pendingAliases,
  handleToggleCanEdit,
  handleRevoke,
}) => {
  return (
    <>
      {isLoadingGranted && (
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-20 rounded-xl' />
          ))}
        </div>
      )}

      {!isLoadingGranted && userAlias && grantedProperties.length > 0 && (
        <>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
            {grantedProperties.map((item: PropertiesPermissionType) => {
              const permissionAlias = item.alias;
              const isPending = pendingAliases.has(permissionAlias);

              return (
                <GrantedPropertieCard
                  key={permissionAlias}
                  item={item}
                  isPending={isPending}
                  handleToggleCanEdit={handleToggleCanEdit}
                  handleRevoke={handleRevoke}
                />
              );
            })}
          </div>

          {/* --- pagination --- */}
          <div className='flex items-center justify-between'>
            {grantedCount > 0 && (
              <p className='text-muted-foreground text-sm whitespace-nowrap'>
                Showing {(grantedPage - 1) * PAGE_LIMIT + 1} to{' '}
                {Math.min(grantedPage * PAGE_LIMIT, grantedCount)} of{' '}
                {grantedCount} Properties
              </p>
            )}
            {grantedTotalPages > 1 && (
              <Pagination className='justify-end'>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        grantedPage > 1 && setGrantedPage((p) => p - 1)
                      }
                      aria-disabled={grantedPage === 1}
                      className={
                        grantedPage === 1
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>

                  {getPageNumbers(grantedPage, grantedTotalPages).map((p, i) =>
                    p === '...' ? (
                      <PaginationItem key={`granted-ellipsis-${i}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={p}>
                        <PaginationLink
                          isActive={p === grantedPage}
                          onClick={() => setGrantedPage(p as number)}
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
                        grantedPage < grantedTotalPages &&
                        setGrantedPage((p) => p + 1)
                      }
                      aria-disabled={grantedPage === grantedTotalPages}
                      className={
                        grantedPage === grantedTotalPages
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

      {!isLoadingGranted && userAlias && grantedProperties.length === 0 && (
        <Card className='text-muted-foreground border-dashed p-8 text-center text-sm shadow-none'>
          This user has no property permissions yet.
        </Card>
      )}
    </>
  );
};

export default ManageExistingPropertyTab;
