'use client';

import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import HoverInfoPopover from '@/components/common/HoverInfoPopover/HoverInfoPopover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  avatarColor,
  TABLE_COLUMNS,
} from '@/data/client/common/tenants/TenantsData';
import { PAGE_LIMIT } from '@/data/common/PaginationData';
import {
  useGetTenantsQuery,
  useUpdateTenantMutation,
} from '@/store/api/endpoints/client/Common/Tenants/TenantsApi';
import { TenantTypes } from '@/types/client/Common/Tenants/TenantsTypes';
import formatChoiceFieldValue, {
  formatDate,
  formatDateAndTime,
  getCurrencySign,
  getInitials,
} from '@/utils/formatters';
import { Eye, Pencil, Plus, Search, Send, Trash, User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AddTenantDialog from '../Dialogs/AddTenantDialog';
import DeleteTenantDialog from '../Dialogs/DeleteTenantDialog';
import SendInvitationDialog from '../Dialogs/SendInvitationDialog';
import UpdateTenantDialog from '../Dialogs/UpdateTenantDialog';
import ViewTenantDialog from '../Dialogs/ViewTenantDialog';

const TenantList: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data: session } = useSession();

  const [selectedTenant, setSelectedTenant] = useState<TenantTypes | null>(
    null,
  );
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [sentInvitation, setSentInvitation] = useState(false);

  const [updateTenant, { isLoading: isUpdatingStatus }] =
    useUpdateTenantMutation();

  const handleStatusChange = async (tenant: TenantTypes, value: string) => {
    const updatedTenant = {
      is_active: value === 'active',
    };
    try {
      await updateTenant({
        tenant_alias: tenant.alias,
        payload: updatedTenant,
      });
      toast.success(
        `Tenant status updated to ${value === 'active' ? 'Active' : 'Deactivated'}`,
      );
    } catch (error) {
      console.error('Error updating tenant status:', error);
      toast.error('Failed to update tenant status');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const queryParams = {
    page,
    page_size: PAGE_LIMIT,
    ...(debouncedSearch && { search: debouncedSearch }),
  };

  const {
    data: tenantsData,
    isLoading,
    isError,
  } = useGetTenantsQuery(queryParams);

  const tenants: TenantTypes[] = tenantsData?.results ?? [];

  const totalPages = Math.ceil((tenantsData?.count ?? 0) / PAGE_LIMIT);

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
        <CustomErrorMessage title='tenants' />
      ) : (
        <>
          <Card className='border-border overflow-hidden rounded-2xl pt-0 shadow-sm'>
            <div className='border-border flex items-center justify-between gap-1 border-b px-6 py-4'>
              <h2 className='text-foreground text-base font-semibold'>
                All Tenants
              </h2>
              <div className='flex items-center gap-1'>
                <div className='relative w-64'>
                  <Search className='text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2' />
                  <Input
                    type='text'
                    placeholder='Search tenants...'
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className='h-9! w-64 rounded-xl pr-8! pl-7!'
                  />
                  <HoverInfoPopover text='You can search using First Name, Last Name, Email and Phone.' />
                </div>
              </div>
            </div>

            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    {TABLE_COLUMNS.map((col) => (
                      <TableHead
                        key={col}
                        className='px-6 text-center font-semibold tracking-wider'
                      >
                        {col}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className='p-0'>
                        <div className='space-y-3 p-6'>
                          {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton
                              key={i}
                              className='h-14 w-full rounded-xl'
                            />
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : tenants.length > 0 ? (
                    tenants.map((tenant, idx) => (
                      <TableRow key={tenant.alias} className='text-center'>
                        <TableCell>
                          <div className='flex items-center justify-start gap-3 pl-10'>
                            <Avatar className='size-9 shrink-0'>
                              <AvatarImage
                                src={tenant.avatar || ''}
                                alt={tenant.first_name}
                              />
                              <AvatarFallback
                                className={`text-xs font-bold ${avatarColor(idx)}`}
                              >
                                {getInitials(tenant.first_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col items-start justify-center'>
                              <p className='text-foreground text-sm font-semibold'>
                                {`${formatChoiceFieldValue(tenant.title || '')} ${tenant.first_name || ''} ${tenant.middle_name || ''} ${tenant.last_name || ''}`.trim()}
                              </p>
                              <p className='text-muted-foreground text-xs'>
                                {tenant.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className='text-sm'>
                          {tenant.property?.property_name ? (
                            <p className='text-foreground text-sm font-semibold'>
                              {tenant.property.property_name}
                            </p>
                          ) : (
                            <small className='text-muted-foreground'>
                              Not Available
                            </small>
                          )}
                        </TableCell>
                        <TableCell className='text-sm font-bold'>
                          {tenant.rent_amount ? (
                            <>
                              {getCurrencySign()}{' '}
                              <span>{tenant.rent_amount}</span>
                            </>
                          ) : (
                            <small className='text-muted-foreground'>
                              {getCurrencySign()} 0
                            </small>
                          )}
                        </TableCell>
                        <TableCell className='text-sm'>
                          {tenant.tenancy_start_date ? (
                            formatDate(tenant.tenancy_start_date)
                          ) : (
                            <small className='text-muted-foreground'>
                              Not Available
                            </small>
                          )}
                        </TableCell>
                        <TableCell className='text-sm'>
                          {tenant.tenancy_end_date ? (
                            formatDate(tenant.tenancy_end_date)
                          ) : (
                            <small className='text-muted-foreground'>
                              Not Available
                            </small>
                          )}
                        </TableCell>

                        <TableCell className='flex items-center justify-center'>
                          {tenant.is_password_set ? (
                            <Select
                              value={
                                tenant.is_active ? 'active' : 'deactivated'
                              }
                              onValueChange={(value) =>
                                handleStatusChange(tenant, value)
                              }
                              disabled={isUpdatingStatus}
                            >
                              <SelectTrigger
                                size='sm'
                                className={`h-6! w-fit gap-1.5 border px-2 py-1.5 text-xs font-semibold hover:bg-inherit ${
                                  tenant.is_active
                                    ? 'border-success/30 bg-success/10 text-success'
                                    : 'border-danger/30 bg-danger/10 text-danger'
                                }`}
                              >
                                <span
                                  className={`inline-block size-1.5 rounded-full ${
                                    tenant.is_active
                                      ? 'bg-success'
                                      : 'bg-danger'
                                  }`}
                                />
                                <SelectValue>
                                  {tenant.is_active ? 'Active' : 'Deactivated'}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem
                                  value='active'
                                  className='focus:bg-success/10'
                                >
                                  <span className='bg-success inline-block size-1.5 rounded-full' />
                                  Active
                                </SelectItem>
                                <SelectItem
                                  value='deactivated'
                                  className='focus:bg-danger/10'
                                >
                                  <span className='bg-danger inline-block size-1.5 rounded-full' />
                                  Deactivated
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge
                              variant='destructive'
                              className='ps-3 text-xs'
                            >
                              <span>Deactivated</span>
                              <HoverInfoPopover
                                triggerClassName='flex size-4 items-center justify-center'
                                content='Tenant has not set their password yet'
                              />
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className='text-sm'>
                          {tenant.created_at ? (
                            formatDateAndTime(tenant.created_at)
                          ) : (
                            <small className='text-muted-foreground'>
                              Not Available
                            </small>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center justify-center gap-2'>
                            <Button
                              variant='success'
                              size='icon'
                              title='Send Invitation'
                              className='rounded-lg'
                              onClick={() => {
                                setSelectedTenant(tenant);
                                setSentInvitation(true);
                              }}
                            >
                              <Send />
                            </Button>
                            <Button
                              variant='secondary'
                              size='icon'
                              title='View Tenant Details'
                              className='rounded-lg'
                              onClick={() => {
                                setSelectedTenant(tenant);
                                setViewOpen(true);
                              }}
                            >
                              <Eye />
                            </Button>
                            <Button
                              variant='default'
                              size='icon'
                              title='Edit Tenant Details'
                              className='rounded-lg'
                              onClick={() => {
                                setSelectedTenant(tenant);
                                setEditOpen(true);
                              }}
                            >
                              <Pencil />
                            </Button>
                            {session?.user?.role === 'LANDLORD' && (
                              <Button
                                variant='danger'
                                size='icon'
                                title='Delete Tenant'
                                className='rounded-lg'
                                onClick={() => {
                                  setSelectedTenant(tenant);
                                  setDeleteOpen(true);
                                }}
                              >
                                <Trash />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className='py-16 text-center'>
                        <div className='text-muted-foreground flex flex-col items-center justify-center gap-2'>
                          <User className='size-10' />
                          <span className='text-sm'>No tenants found</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
          <div className='flex items-center justify-between'>
            {(tenantsData?.count ?? 0) > 0 && (
              <p className='text-muted-foreground text-sm whitespace-nowrap'>
                Showing {(page - 1) * PAGE_LIMIT + 1} to{' '}
                {Math.min(page * PAGE_LIMIT, tenantsData?.count ?? 0)} of{' '}
                {tenantsData?.count ?? 0} Tenants
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

      <AddTenantDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
      />
      <SendInvitationDialog
        open={sentInvitation}
        onClose={() => setSentInvitation(false)}
        tenantData={selectedTenant}
      />

      <UpdateTenantDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={() => setEditOpen(false)}
        tenant={selectedTenant}
      />

      <DeleteTenantDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onSuccess={() => setDeleteOpen(false)}
        tenantData={selectedTenant}
      />

      <ViewTenantDialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        tenant={selectedTenant}
      />
    </div>
  );
};

export default TenantList;
