'use client';

import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import Loading from '@/components/common/CustomLoader/Loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetCertificateSharesQuery } from '@/store/api/endpoints/client/Common/Compliance/CertificateSharesApi';
import {
  CirtificateShare,
  ViewCertificateSharesDialogProps,
} from '@/types/client/Common/Compliance/CertificateSharesTypes';
import { PAGE_LIMIT } from '@/utils/CommonConstants';
import formatChoiceFieldValue from '@/utils/formatters';
import { Plus, Trash2, User } from 'lucide-react';
import { useState } from 'react';
import AddNewShareDialog from './AddNewShareDialog';
import DeleteShareDialog from './DeleteShareDialog';

const getShareFullName = (share: CirtificateShare) =>
  [
    share.title ? formatChoiceFieldValue(share.title) : '',
    share.first_name || '',
    share.middle_name || '',
    share.last_name || '',
  ]
    .filter(Boolean)
    .join(' ');

const ViewCertificateSharesDialog: React.FC<
  ViewCertificateSharesDialogProps
> = ({ open, onClose, selectedCertificate, propertyAlias }) => {
  const [page, setPage] = useState(1);
  const [isOpenAddNewShareDialogOpen, setIsOpenAddNewShareDialogOpen] =
    useState(false);
  const [isOpenDeleteShareDialogOpen, setIsOpenDeleteShareDialogOpen] =
    useState(false);
  const [selectedAliases, setSelectedAliases] = useState<string[]>([]);

  const {
    data: certificateShares,
    isLoading: isCertificateSharesLoading,
    isError,
  } = useGetCertificateSharesQuery(
    {
      certificateAlias: selectedCertificate?.alias || '',
      params: {
        page,
        limit: PAGE_LIMIT,
      },
    },
    { skip: !selectedCertificate?.alias },
  );

  const results = certificateShares?.results || [];
  const totalCount = certificateShares?.count ?? 0;
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

  const isAllSelected =
    results.length > 0 &&
    results.every((share: CirtificateShare) =>
      selectedAliases.includes(share.alias),
    );

  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelectedAliases((prev) =>
        prev.filter(
          (alias) => !results.some((r: CirtificateShare) => r.alias === alias),
        ),
      );
    } else {
      setSelectedAliases((prev) => [
        ...prev,
        ...results
          .map((r: CirtificateShare) => r.alias)
          .filter((alias: string) => !prev.includes(alias)),
      ]);
    }
  };

  const handleToggleRow = (alias: string) => {
    setSelectedAliases((prev) =>
      prev.includes(alias) ? prev.filter((a) => a !== alias) : [...prev, alias],
    );
  };

  const handleDeleteSelected = () => {
    setIsOpenDeleteShareDialogOpen(true);
  };

  const handleDeleteRow = (alias: string) => {
    setSelectedAliases([alias]);
    setIsOpenDeleteShareDialogOpen(true);
  };

  const handleDeleted = () => {
    setSelectedAliases([]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='flex max-h-[90vh] w-full flex-col overflow-hidden p-0 sm:max-w-185'>
        {/* Header */}
        <DialogHeader className='shrink-0 border-b px-6 pt-6 pb-5'>
          <DialogTitle className='text-foreground text-xl font-bold'>
            View Certificate Shares
          </DialogTitle>
          <DialogDescription>
            View the shares associated with this certificate. You can see which
            users or groups have access to this certificate and what actions
            they are allowed to perform.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className='flex items-center justify-between border-b px-6 pb-4'>
            <h2 className='text-xl font-semibold'>Share List</h2>
            <div className='flex items-center gap-2'>
              {selectedAliases.length > 0 && (
                <Button variant='destructive' onClick={handleDeleteSelected}>
                  <Trash2 />
                  Delete Selected ({selectedAliases.length})
                </Button>
              )}
              <Button onClick={() => setIsOpenAddNewShareDialogOpen(true)}>
                <Plus />
                Add New Share
              </Button>
            </div>
          </div>
          <div className='overflow-auto px-6 py-4'>
            <Table>
              <TableHeader>
                <TableRow className='bg-muted'>
                  <TableHead className='w-10'>
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleToggleAll}
                      disabled={results.length === 0}
                    />
                  </TableHead>
                  <TableHead>SL NO.</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className='text-center'>Action</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {isCertificateSharesLoading && (
                  <TableRow>
                    <TableCell colSpan={5} className='py-6 text-center'>
                      <Loading className='mx-auto size-5' />
                    </TableCell>
                  </TableRow>
                )}

                {!isCertificateSharesLoading && isError && (
                  <TableRow>
                    <TableCell colSpan={5} className='py-10 text-center'>
                      <CustomErrorMessage title='shares' />
                    </TableCell>
                  </TableRow>
                )}

                {!isCertificateSharesLoading &&
                  !isError &&
                  results.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className='py-5 text-center'>
                        <p className='text-sm text-gray-900'>No User Found</p>
                      </TableCell>
                    </TableRow>
                  )}

                {!isCertificateSharesLoading &&
                  !isError &&
                  results.map((share: CirtificateShare, index: number) => (
                    <TableRow key={share.alias}>
                      <TableCell>
                        <Checkbox
                          checked={selectedAliases.includes(share.alias)}
                          onCheckedChange={() => handleToggleRow(share.alias)}
                        />
                      </TableCell>
                      <TableCell>#{index + 1}</TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <Avatar className='size-8 shrink-0'>
                            <AvatarImage
                              src={share.avatar ?? undefined}
                              alt={getShareFullName(share)}
                            />
                            <AvatarFallback>
                              <User className='size-4' />
                            </AvatarFallback>
                          </Avatar>
                          <span className='truncate'>
                            {getShareFullName(share)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{share.email}</TableCell>
                      <TableCell className='text-center'>
                        <Button
                          variant='destructive'
                          size='icon'
                          title='Delete Share'
                          onClick={() => handleDeleteRow(share.alias)}
                        >
                          <Trash2 />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </tbody>
            </Table>

            {/* Pagination footer */}
            {!isCertificateSharesLoading && !isError && results.length > 0 && (
              <div className='mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <p className='text-muted-foreground text-sm whitespace-nowrap'>
                  Showing {(page - 1) * PAGE_LIMIT + 1} to{' '}
                  {Math.min(page * PAGE_LIMIT, totalCount)} of {totalCount}{' '}
                  results
                </p>
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
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
      {/* Dialogs  */}
      <AddNewShareDialog
        open={isOpenAddNewShareDialogOpen}
        onClose={() => setIsOpenAddNewShareDialogOpen(false)}
        certificateAlias={selectedCertificate?.alias || ''}
        propertyAlias={propertyAlias || ''}
      />
      <DeleteShareDialog
        open={isOpenDeleteShareDialogOpen}
        onClose={() => setIsOpenDeleteShareDialogOpen(false)}
        certificateAlias={selectedCertificate?.alias || ''}
        tenantAliases={selectedAliases}
        onDeleted={handleDeleted}
      />
    </Dialog>
  );
};

export default ViewCertificateSharesDialog;
