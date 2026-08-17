import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { useGetPropertyPermissionsQuery } from '@/store/api/endpoints/client/Common/Properties/PropertiesApi';
import {
  PropertyPermission,
  PropertyPermissionListProps,
} from '@/types/client/Common/Properties/PropertyDetailsTypes';
import formatChoiceFieldValue, { getInitials } from '@/utils/formatters';
import { Ban, Eye, Mail, Pencil, Phone, Plus } from 'lucide-react';
import React, { useState } from 'react';
import AddUserFromPropertyPermissionDialog from './Dialogs/AddUserFromPropertyPermissionDialog';

const PAGE_LIMIT = 4;

const PropertyPermissionList: React.FC<PropertyPermissionListProps> = ({
  propertyAlias,
}) => {
  const [page, setPage] = useState(1);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

  const {
    data: propertyPermissions,
    isLoading,
    isError,
  } = useGetPropertyPermissionsQuery({
    property_alias: propertyAlias,
    page,
    limit: PAGE_LIMIT,
  });

  const permissions = propertyPermissions?.results ?? [];
  const count = propertyPermissions?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(count / PAGE_LIMIT));
  const isEmpty = !isLoading && !isError && permissions.length === 0;

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

  return (
    <div className='border-warning space-y-4 rounded-lg border border-dashed p-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-warning text-lg leading-none font-medium'>
            Property access
          </h2>
          <p className='text-muted-foreground mt-1 text-sm'>
            Mortgage advisers with permission to view or edit this property.
          </p>
        </div>
        <div>
          <Button
            variant='warning'
            size='sm'
            className='mt-2'
            onClick={() => setIsAddUserDialogOpen(true)}
          >
            <Plus />
            Add new Permission
          </Button>
        </div>
      </div>

      {isError ? (
        <CustomErrorMessage title='property access' />
      ) : isLoading ? (
        <div className='grid gap-3 sm:grid-cols-2'>
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className='shadow-sm'>
              <CardContent className='flex items-start gap-3 p-4'>
                <Skeleton className='h-10 w-10 shrink-0 rounded-full' />
                <div className='min-w-0 flex-1 space-y-2'>
                  <Skeleton className='h-4 w-2/3' />
                  <Skeleton className='h-3 w-1/2' />
                  <Skeleton className='h-3 w-1/3' />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isEmpty ? (
        <div className='flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-12 text-center'>
          <Ban className='text-muted-foreground h-6 w-6' />
          <p className='text-muted-foreground text-sm'>
            No mortgage advisers have been given access to this property.
          </p>
        </div>
      ) : (
        <>
          <div className='grid gap-3 sm:grid-cols-2'>
            {permissions.map((permission: PropertyPermission) => {
              const fullName = permission.user.name;

              return (
                <Card key={permission.alias} className='shadow-sm'>
                  <CardContent className='flex items-start gap-3 p-4'>
                    <Avatar className='h-10 w-10 shrink-0'>
                      <AvatarFallback className='bg-muted text-sm font-medium'>
                        {getInitials(permission.user.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className='min-w-0 flex-1 space-y-2'>
                      <div>
                        <p className='truncate text-sm leading-none font-medium'>
                          {fullName}
                        </p>
                        <Badge variant='default' className='mt-1'>
                          {formatChoiceFieldValue(permission.user.role)}
                        </Badge>
                      </div>

                      <div className='text-muted-foreground space-y-1 text-xs'>
                        <p className='flex items-center gap-1.5 truncate'>
                          <Mail className='h-3.5 w-3.5 shrink-0' />
                          <span className='truncate'>
                            {permission.user.email}
                          </span>
                        </p>

                        <p className='flex items-center gap-1.5'>
                          <Phone className='h-3.5 w-3.5 shrink-0' />
                          {permission.user.phone}
                        </p>
                      </div>

                      <div className='flex flex-wrap gap-1.5 pt-1'>
                        <Badge
                          variant={permission.can_view ? 'warning' : 'outline'}
                          className='flex items-center gap-1 text-xs font-normal'
                        >
                          <Eye className='h-3 w-3' />
                          {permission.can_view ? 'Can view' : 'No view access'}
                        </Badge>
                        <Badge
                          variant={permission.can_edit ? 'warning' : 'outline'}
                          className='flex items-center gap-1 text-xs font-normal'
                        >
                          <Pencil className='h-3 w-3' />
                          {permission.can_edit ? 'Can edit' : 'No edit access'}
                        </Badge>
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
                {Math.min(page * PAGE_LIMIT, count)} of {count} Advisers
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
      <AddUserFromPropertyPermissionDialog
        isOpen={isAddUserDialogOpen}
        onClose={() => setIsAddUserDialogOpen(false)}
        propertyAlias={propertyAlias}
      />
    </div>
  );
};

export default PropertyPermissionList;
