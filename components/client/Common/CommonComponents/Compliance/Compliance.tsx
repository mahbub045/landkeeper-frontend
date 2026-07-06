'use client';

import HoverInfoPopover from '@/components/common/HoverInfoPopover/HoverInfoPopover';
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
  complianceBreakdown,
  upcomingExpirations,
} from '@/data/client/common/compliance/ComplianceData';
import { useGetCompliancesQuery } from '@/store/api/endpoints/client/Common/Compliance/ComplianceApi';
import {
  ApiCertificate,
  Certificate,
  CertStatus,
} from '@/types/client/Common/Compliance/ComplianceTypes';
import { Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import CertificateRegistry from './CertificateRegistry/CertificateRegistry';
import ComplianceScore from './ComplianceScore/ComplianceScore';
import AddCertificateDialog from './Dialogs/AddCertificateDialog';
import UpcomingExpirations from './UpcomingExpirations/UpcomingExpirations';

const COMPLIANCE_SCORE = 87;
const PAGE_LIMIT = 12;

const humanizeCertType = (type: string) =>
  type
    .toLowerCase()
    .split('_')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

const getCertStatus = (expiryDate: string): CertStatus => {
  const daysUntilExpiry = Math.ceil(
    (new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  if (daysUntilExpiry < 0) return 'Expired';
  if (daysUntilExpiry <= 30) return 'Expiring Soon';
  return 'Valid';
};

const Compliance: React.FC = () => {
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

  const { data, isLoading, isError } = useGetCompliancesQuery(queryParams);

  const totalPages = Math.ceil((data?.count ?? 0) / PAGE_LIMIT);

  const apiCertificates: ApiCertificate[] = data?.results ?? [];

  const certificates: Certificate[] = useMemo(() => {
    return apiCertificates.map((cert: ApiCertificate) => ({
      alias: cert.alias,
      property: cert.property.property_name,
      type: humanizeCertType(cert.certificate_type),
      certificateNumber: cert.certificate_number,
      issueDate: cert.issue_date,
      expiryDate: cert.expiry_date,
      status: getCertStatus(cert.expiry_date),
    }));
  }, [apiCertificates]);

  const validCount = certificates.filter(
    (c: Certificate) => c.status === 'Valid',
  ).length;
  const totalCount = certificates.length;

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
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <h1 className='text-foreground text-2xl font-bold tracking-tight'>
            Compliance &amp; Certifications
          </h1>
          <p className='text-muted-foreground text-sm'>
            Track certificates and regulatory requirements
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
            <HoverInfoPopover text='You can search using Property Name and Certificate Type.' />
          </div>

          <Button onClick={() => setModalOpen(true)}>
            <Plus />
            Add Certificate
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <ComplianceScore
          percent={COMPLIANCE_SCORE}
          validCount={validCount}
          totalCount={totalCount}
          breakdown={complianceBreakdown}
        />
        <UpcomingExpirations items={upcomingExpirations} />
      </div>

      {isError ? (
        <p className='text-center text-danger text-sm'>
          Failed to load certificates. Please try again.
        </p>
      ) : (
        <>
          <CertificateRegistry
            certificates={certificates}
            apiCertificates={apiCertificates}
            isLoading={isLoading}
          />

          {totalPages > 1 && (
            <div className='flex items-center justify-between'>
              <p className='text-muted-foreground text-sm whitespace-nowrap'>
                Showing {(page - 1) * PAGE_LIMIT + 1} to{' '}
                {Math.min(page * PAGE_LIMIT, data?.count ?? 0)} of{' '}
                {data?.count ?? 0} Certificates
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

      <AddCertificateDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
        properties={[]}
      />
    </div>
  );
};

export default Compliance;
