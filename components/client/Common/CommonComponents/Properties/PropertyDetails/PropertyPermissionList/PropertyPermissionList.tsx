import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PAGE_LIMIT } from '@/data/common/PaginationData';
import { cn } from '@/lib/utils';
import { useUpdatePermissionMutation } from '@/store/api/endpoints/client/Common/Permissions/PermissionsApi';
import { useGetPropertyPermissionsQuery } from '@/store/api/endpoints/client/Common/Properties/PropertiesApi';
import {
  PropertyPermission,
  PropertyPermissionListProps,
} from '@/types/client/Common/Properties/PropertyDetailsTypes';
import formatChoiceFieldValue, { getInitials } from '@/utils/formatters';
import {
  Ban,
  Check,
  Eye,
  Mail,
  Pencil,
  Phone,
  Plus,
  Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import AddUserFromPropertyPermissionDialog from './Dialogs/AddUserFromPropertyPermissionDialog';
import DeleteUserFromPropertyPermissionDialog from './Dialogs/DeleteUserFromPropertyPermissionDialog';

const PropertyPermissionList: React.FC<PropertyPermissionListProps> = ({
  propertyAlias,
}) => {
  const [page, setPage] = useState(1);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState<PropertyPermission | null>(
    null,
  );
  const [updatingAlias, setUpdatingAlias] = useState<string | null>(null);

  const handleDeleteUser = (user: PropertyPermission) => {
    setUserToRemove(user);
    setIsDeleteUserDialogOpen(true);
  };

  const {
    data: propertyPermissions,
    isLoading,
    isError,
  } = useGetPropertyPermissionsQuery({
    property_alias: propertyAlias,
    page,
    limit: PAGE_LIMIT,
  });

  const [updatePermission] = useUpdatePermissionMutation();

  const handleTogglePermission = async (
    permission: PropertyPermission,
    field: 'can_view' | 'can_edit',
  ) => {
    setUpdatingAlias(permission.alias);
    try {
      await updatePermission({
        alias: permission.alias,
        payload: { [field]: !permission[field] },
      }).unwrap();
      toast.success(
        `Successfully updated ${field.replace('_', ' ')} permission for ${permission.user.name}`,
      );
    } catch {
      // Optionally surface an error toast here
      toast.error(
        `Failed to update ${field.replace('_', ' ')} permission for ${permission.user.name}`,
      );
    } finally {
      setUpdatingAlias(null);
    }
  };

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
              const isRowUpdating = updatingAlias === permission.alias;

              return (
                <Card key={permission.alias} className='shadow-sm'>
                  <CardContent className='flex items-start gap-3 p-4'>
                    <Avatar className='h-10 w-10 shrink-0'>
                      <AvatarImage
                        src={permission.user.profile_image ?? undefined}
                        alt={permission.user.name}
                      />
                      <AvatarFallback className='bg-muted text-sm font-medium'>
                        {getInitials(permission.user.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className='min-w-0 flex-1 space-y-2'>
                      <div className='flex items-start justify-between gap-2'>
                        <div className='min-w-0'>
                          <p className='truncate text-sm leading-none font-medium'>
                            {fullName}
                          </p>
                          <Badge variant='default' className='mt-1'>
                            {formatChoiceFieldValue(permission.user.role)}
                          </Badge>
                        </div>
                        <Button
                          variant='destructive'
                          title='Remove User From Permission'
                          size='icon'
                          onClick={() => {
                            handleDeleteUser(permission);
                          }}
                          aria-label='Remove permission'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
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
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type='button'
                              disabled={isRowUpdating}
                              onClick={() =>
                                handleTogglePermission(permission, 'can_view')
                              }
                              aria-pressed={permission.can_view}
                              className={cn(
                                'flex cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-all',
                                'disabled:cursor-not-allowed disabled:opacity-60',
                                permission.can_view
                                  ? 'bg-warning border-warning text-warning-foreground shadow-sm'
                                  : 'border-input text-muted-foreground hover:bg-accent/50 bg-transparent',
                              )}
                            >
                              <Eye className='h-3 w-3' />
                              Can view
                              {permission.can_view && (
                                <Check className='h-3 w-3' />
                              )}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Click to {permission.can_view ? 'revoke' : 'grant'}{' '}
                            view access
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type='button'
                              disabled={isRowUpdating}
                              onClick={() =>
                                handleTogglePermission(permission, 'can_edit')
                              }
                              aria-pressed={permission.can_edit}
                              className={cn(
                                'flex cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-all',
                                'disabled:cursor-not-allowed disabled:opacity-60',
                                permission.can_edit
                                  ? 'bg-warning border-warning text-warning-foreground shadow-sm'
                                  : 'border-input text-muted-foreground hover:bg-accent/50 bg-transparent',
                              )}
                            >
                              <Pencil className='h-3 w-3' />
                              Can edit
                              {permission.can_edit && (
                                <Check className='h-3 w-3' />
                              )}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Click to {permission.can_edit ? 'revoke' : 'grant'}{' '}
                            edit access
                          </TooltipContent>
                        </Tooltip>
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
      <DeleteUserFromPropertyPermissionDialog
        isOpen={isDeleteUserDialogOpen}
        onClose={() => setIsDeleteUserDialogOpen(false)}
        userToRemove={userToRemove}
      />
    </div>
  );
};

export default PropertyPermissionList;
