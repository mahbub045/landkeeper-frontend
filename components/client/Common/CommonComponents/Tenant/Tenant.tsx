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
import { useGetTenantsQuery } from '@/store/api/endpoints/client/Common/Tenant/TenantApi';
import {
  ApiTenant,
  Tenant as TenantModel,
} from '@/types/client/Common/Tenant/TenantTypes';
import formatChoiceFieldValue from '@/utils/formatters';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AddTenantDialog from './Dialogs/AddTenantDialog';
import TenantTable from './TenantTable/TenantTable';

const PAGE_LIMIT = 12;

function mapApiTenant(apiTenant: ApiTenant): TenantModel {
  return {
    alias: apiTenant.alias,
    title: formatChoiceFieldValue(apiTenant.title) || '',
    first_name: apiTenant.first_name,
    middle_name: apiTenant.middle_name || '',
    last_name: apiTenant.last_name,
    email: apiTenant.email,
    avatar: apiTenant.avatar ?? undefined,
    property: apiTenant.property?.property_name ?? '—',
    rent: Number(apiTenant.rent_amount) || 0,
    startDate: apiTenant.tenancy_start_date,
    endDate: apiTenant.tenancy_end_date,
    is_active: apiTenant.is_active,
  };
}

const Tenant: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
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
  };

  const { data, isLoading, isError } = useGetTenantsQuery(queryParams);

  const tenants = useMemo(
    () => (data?.results ?? []).map(mapApiTenant),
    [data?.results],
  );

  const apiTenants = data?.results ?? [];

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
            Tenants
          </h1>
          <p className='text-muted-foreground text-sm'>
            Manage tenant information and tenancies
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus />
          Add Tenant
        </Button>
      </div>

      {isError ? (
        <p className='text-danger text-center text-sm'>
          Failed to load tenants. Please try again.
        </p>
      ) : (
        <>
          <TenantTable
            tenants={tenants}
            apiTenants={apiTenants}
            search={search}
            onSearchChange={handleSearchChange}
            isLoading={isLoading}
          />

          {totalPages > 1 && (
            <div className='flex items-center justify-between'>
              <p className='text-muted-foreground text-sm whitespace-nowrap'>
                Showing {(page - 1) * PAGE_LIMIT + 1} to{' '}
                {Math.min(page * PAGE_LIMIT, data?.count ?? 0)} of{' '}
                {data?.count ?? 0} Tenants
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

      <AddTenantDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Tenant;
