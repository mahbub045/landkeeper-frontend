import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import DetailsEmptyState from '@/components/common/DetailsPage/DetailsEmptyState';
import DetailsSection from '@/components/common/DetailsPage/DetailsSection';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useGetCertificateSharesQuery } from '@/store/api/endpoints/client/Common/Compliance/CertificateSharesApi';
import {
  CirtificateShare,
  ComplianceShareListProps,
} from '@/types/client/Common/Compliance/CertificateSharesTypes';
import { PAGE_LIMIT } from '@/utils/commonConstants.ts';
import formatChoiceFieldValue, { getInitials } from '@/utils/formatters';
import { Ban, Mail, Plus, Share2, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import AddNewShareDialog from '../../CertificateRegistry/Dialogs/AddNewShareDialog';
import DeleteShareDialog from '../../CertificateRegistry/Dialogs/DeleteShareDialog';

const getShareFullName = (share: CirtificateShare) =>
  [
    share.title ? formatChoiceFieldValue(share.title) : '',
    share.first_name || '',
    share.middle_name || '',
    share.last_name || '',
  ]
    .filter(Boolean)
    .join(' ');

const ComplianceShareList: React.FC<ComplianceShareListProps> = ({
  certificateAlias,
  propertyAlias,
}) => {
  const [page, setPage] = useState(1);
  const [isAddShareDialogOpen, setIsAddShareDialogOpen] = useState(false);
  const [isDeleteShareDialogOpen, setIsDeleteShareDialogOpen] = useState(false);
  const [shareToRemove, setShareToRemove] = useState<string | null>(null);

  const {
    data: certificateShares,
    isFetching,
    isError,
  } = useGetCertificateSharesQuery({
    certificateAlias,
    params: { page, limit: PAGE_LIMIT },
  });

  const shares = certificateShares?.results ?? [];
  const count = certificateShares?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(count / PAGE_LIMIT));
  const isEmpty = !isFetching && !isError && shares.length === 0;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }

    return pages;
  };

  const handleShareRemoved = () => {
    // Step back if the last share on this page was removed
    if (shares.length === 1 && page > 1) {
      setPage((p) => p - 1);
    }
  };

  return (
    <DetailsSection
      title='Certificate Shares'
      icon={Share2}
      description='Tenants who can view this certificate.'
      contentClassName='space-y-4'
      action={
        <Button
          variant='info'
          size='sm'
          onClick={() => setIsAddShareDialogOpen(true)}
        >
          <Plus />
          <span className='hidden sm:inline'>Share with Tenant</span>
        </Button>
      }
    >
      {isError ? (
        <CustomErrorMessage title='certificate shares' />
      ) : isFetching ? (
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className='shadow-sm'>
              <CardContent className='flex items-start gap-3 p-4'>
                <Skeleton className='h-10 w-10 shrink-0 rounded-full' />
                <div className='min-w-0 flex-1 space-y-2'>
                  <Skeleton className='h-4 w-2/3' />
                  <Skeleton className='h-3 w-1/2' />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isEmpty ? (
        <DetailsEmptyState
          icon={Ban}
          message="This certificate hasn't been shared with any tenants."
        />
      ) : (
        <>
          <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
            {shares.map((share: CirtificateShare) => {
              const fullName = getShareFullName(share);

              return (
                <Card key={share.alias} className='shadow-sm'>
                  <CardContent className='flex items-start gap-3 p-4'>
                    <Avatar className='h-10 w-10 shrink-0'>
                      <AvatarImage
                        src={share.avatar ?? undefined}
                        alt={fullName}
                      />
                      <AvatarFallback className='bg-muted text-sm font-medium'>
                        {getInitials(fullName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className='min-w-0 flex-1 space-y-2'>
                      <div className='flex items-start justify-between gap-2'>
                        <div className='min-w-0'>
                          <p className='truncate text-sm leading-none font-medium'>
                            {fullName}
                          </p>
                          <Badge variant='default' className='mt-1'>
                            Tenant
                          </Badge>
                        </div>
                        <Button
                          variant='destructive'
                          title='Remove Share'
                          size='icon'
                          onClick={() => {
                            setShareToRemove(share.alias);
                            setIsDeleteShareDialogOpen(true);
                          }}
                          aria-label='Remove share'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>

                      <div className='text-muted-foreground text-xs'>
                        <p className='flex items-center gap-1.5 truncate'>
                          <Mail className='h-3.5 w-3.5 shrink-0' />
                          <span className='truncate'>{share.email}</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className='flex items-center justify-between'>
            {count > 0 && (
              <p className='text-muted-foreground text-sm whitespace-nowrap'>
                Showing {(page - 1) * PAGE_LIMIT + 1} to{' '}
                {Math.min(page * PAGE_LIMIT, count)} of {count} Tenants
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
      {/* Modals */}
      <AddNewShareDialog
        open={isAddShareDialogOpen}
        onClose={() => setIsAddShareDialogOpen(false)}
        certificateAlias={certificateAlias}
        propertyAlias={propertyAlias}
        complianceAlias={certificateAlias}
      />
      <DeleteShareDialog
        open={isDeleteShareDialogOpen}
        onClose={() => setIsDeleteShareDialogOpen(false)}
        certificateAlias={certificateAlias}
        tenantAliases={shareToRemove ? [shareToRemove] : []}
        onDeleted={handleShareRemoved}
      />
    </DetailsSection>
  );
};

export default ComplianceShareList;
