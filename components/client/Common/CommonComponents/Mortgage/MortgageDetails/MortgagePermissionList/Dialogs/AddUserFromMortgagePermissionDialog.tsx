import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useGetAuthUserListQuery } from '@/store/api/endpoints/auth/AuthUserListApi';
import { useAddPermissionMutation } from '@/store/api/endpoints/client/Common/Permissions/PermissionsApi';
import { AuthUser } from '@/types/auth/AuthUsersType';
import { AddUserFromMortgagePermissionDialogProps } from '@/types/client/Common/Mortgage/MortgagePermissionTypes';
import formatChoiceFieldValue, { getInitials } from '@/utils/formatters';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import {
  Check,
  ChevronsUpDown,
  Eye,
  Pencil,
  User as UserIcon,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

// Small reusable avatar: shows profile_image if present, otherwise initials
const UserAvatar: React.FC<{
  profileImage: string | null;
  firstName: string;
  lastName: string;
  size?: 'sm' | 'md';
}> = ({ profileImage, firstName, lastName, size = 'md' }) => {
  const dimension = size === 'sm' ? 'h-6 w-6 text-[11px]' : 'h-8 w-8 text-xs';

  if (profileImage) {
    return (
      <Image
        src={profileImage}
        alt={`${firstName} ${lastName}`}
        height={size === 'sm' ? 24 : 32}
        width={size === 'sm' ? 24 : 32}
        className={cn(
          'shrink-0 rounded-full object-cover',
          dimension.split(' ').slice(0, 2).join(' '),
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        'bg-primary/10 text-primary flex shrink-0 items-center justify-center rounded-full font-medium',
        dimension,
      )}
    >
      {getInitials(firstName)}
    </span>
  );
};

const AddUserFromMortgagePermissionDialog: React.FC<
  AddUserFromMortgagePermissionDialogProps
> = ({ isOpen, onClose, mortgageAlias }) => {
  const { data: authUsers, isLoading: isAuthUsersLoading } =
    useGetAuthUserListQuery({
      role: 'MORTGAGE_ADVISER',
    });
  const [addPermission, { isLoading }] = useAddPermissionMutation();

  const [userPopoverOpen, setUserPopoverOpen] = useState(false);
  const [selectedUserAlias, setSelectedUserAlias] = useState<string>('');

  // "Can view" is mandatory and always true — not user-toggleable.
  const canView = true;
  const [canEdit, setCanEdit] = useState(false);

  const selectedUser = authUsers?.find(
    (entry: AuthUser) => entry.user.alias === selectedUserAlias,
  );

  const resetForm = () => {
    setSelectedUserAlias('');
    setCanEdit(false);
    setUserPopoverOpen(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const [submitErrors, setSubmitErrors] = useState<string[]>([]);

  const isFetchBaseQueryError = (
    error: unknown,
  ): error is FetchBaseQueryError => {
    return typeof error === 'object' && error != null && 'status' in error;
  };

  const handleSubmit = async () => {
    if (!selectedUserAlias || !mortgageAlias) return;

    setSubmitErrors([]);
    try {
      await addPermission({
        user: selectedUserAlias,
        mortgage: mortgageAlias,
        can_view: canView,
        can_edit: canEdit,
      }).unwrap();
      handleClose();
    } catch (err) {
      const error = err as FetchBaseQueryError | SerializedError;

      let messages: string[] = [];

      if (isFetchBaseQueryError(error)) {
        const data = error.data;
        if (data && typeof data === 'object') {
          messages = Object.values(data as Record<string, unknown>).flatMap(
            (val) => (Array.isArray(val) ? val.map(String) : [String(val)]),
          );
        } else if (typeof data === 'string') {
          messages = [data];
        }
      } else {
        if (error.message) messages = [error.message];
      }

      setSubmitErrors(
        messages.length
          ? messages
          : ['Something went wrong. Please try again.'],
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='gap-0 overflow-visible p-0 sm:max-w-110'>
        <DialogHeader className='px-6 pt-6 pb-1'>
          <DialogTitle className='text-lg font-semibold'>
            Add User For Permission
          </DialogTitle>
          <DialogDescription className='text-muted-foreground text-sm'>
            Grant a mortgage adviser access to this mortgage.
          </DialogDescription>
        </DialogHeader>

        {submitErrors.length > 0 && (
          <div className='bg-danger/10 border-danger space-y-1 px-6 py-2'>
            {submitErrors.map((msg, i) => (
              <p key={i} className='text-destructive text-sm'>
                {msg}
              </p>
            ))}
          </div>
        )}

        <div className='space-y-6 px-6 py-3'>
          {/* User select */}
          <div className='space-y-2'>
            <Label className='text-sm font-medium'>Select User</Label>
            <Popover open={userPopoverOpen} onOpenChange={setUserPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={userPopoverOpen}
                  className='border-input hover:bg-accent/50 h-11 w-full justify-between font-normal'
                  disabled={isAuthUsersLoading}
                >
                  {selectedUser ? (
                    <span className='flex min-w-0 items-center gap-2'>
                      <UserAvatar
                        profileImage={selectedUser.user.profile_image}
                        firstName={selectedUser.user.first_name}
                        lastName={selectedUser.user.last_name}
                        size='sm'
                      />
                      <span className='flex min-w-0 flex-col items-start'>
                        <span>
                          <span className='truncate'>
                            {selectedUser.user.first_name}{' '}
                            {selectedUser.user.last_name}
                          </span>
                          <span className='bg-primary/10 text-primary ms-1 truncate rounded-full px-2 text-xs'>
                            {formatChoiceFieldValue(selectedUser.role)}
                          </span>
                        </span>
                        <span className='text-muted-foreground truncate text-xs'>
                          {selectedUser.user.email}
                        </span>
                      </span>
                    </span>
                  ) : (
                    <span className='text-muted-foreground flex items-center gap-2'>
                      <UserIcon className='h-4 w-4' />
                      {isAuthUsersLoading
                        ? 'Loading users...'
                        : 'Select a user'}
                    </span>
                  )}
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-40' />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align='start'
                sideOffset={6}
                className='w-(--radix-popover-trigger-width) p-0'
              >
                <Command>
                  <CommandInput
                    placeholder='Search by name or email...'
                    className='h-8!'
                  />

                  <CommandList className='max-h-55'>
                    <CommandEmpty className='text-muted-foreground py-6 text-center text-sm'>
                      No user found.
                    </CommandEmpty>
                    <CommandGroup>
                      {authUsers?.map((entry: AuthUser) => {
                        const { user, role } = entry;
                        const fullName = `${formatChoiceFieldValue(user.title)} ${user.first_name} ${user.middle_name} ${user.last_name}`;
                        const isSelected = selectedUserAlias === user.alias;
                        return (
                          <CommandItem
                            key={user.alias}
                            value={`${fullName} ${user.email}`}
                            onSelect={() => {
                              setSelectedUserAlias(user.alias);
                              setUserPopoverOpen(false);
                            }}
                            className='flex cursor-pointer items-center gap-2.5 px-3 py-2.5'
                          >
                            <UserAvatar
                              profileImage={user.profile_image}
                              firstName={user.first_name}
                              lastName={user.last_name}
                            />
                            <div className='flex min-w-0 flex-col'>
                              <span>
                                <span className='truncate text-sm font-medium'>
                                  {fullName}
                                </span>
                                <span className='bg-primary/10 text-primary ms-1 truncate rounded-full px-2 text-xs'>
                                  {formatChoiceFieldValue(role)}
                                </span>
                              </span>
                              <span className='text-muted-foreground truncate text-xs'>
                                {user.email}
                              </span>
                            </div>

                            <Check
                              className={cn(
                                'ml-2 h-4 w-4 shrink-0',
                                isSelected ? 'opacity-100' : 'opacity-0',
                              )}
                            />
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Permissions */}
          <div className='space-y-2'>
            <Label className='text-sm font-medium'>Permissions</Label>
            <div className='border-input divide-y overflow-hidden rounded-lg border'>
              {/* Can view — locked ON, not clickable */}
              <div
                aria-disabled='true'
                className='flex w-full cursor-not-allowed items-center gap-3 px-3.5 py-3 text-left opacity-70'
              >
                <span className='bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-md'>
                  <Eye className='text-muted-foreground h-4 w-4' />
                </span>
                <div className='min-w-0 flex-1'>
                  <p className='text-sm font-medium'>Can view</p>
                  <p className='text-muted-foreground text-xs'>
                    Required — read-only access to mortgage details
                  </p>
                </div>
                <span className='bg-primary border-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2'>
                  <Check className='text-primary-foreground h-3 w-3' />
                </span>
              </div>

              {/* Can edit — freely toggleable */}
              <button
                type='button'
                onClick={() => setCanEdit((v) => !v)}
                className='hover:bg-accent/40 flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors'
              >
                <span className='bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-md'>
                  <Pencil className='text-muted-foreground h-4 w-4' />
                </span>
                <div className='min-w-0 flex-1'>
                  <p className='text-sm font-medium'>Can edit</p>
                  <p className='text-muted-foreground text-xs'>
                    Modify mortgage details and documents
                  </p>
                </div>
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    canEdit
                      ? 'bg-primary border-primary'
                      : 'border-input bg-transparent',
                  )}
                >
                  {canEdit && (
                    <Check className='text-primary-foreground h-3 w-3' />
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        <DialogFooter className='bg-muted/30 mb-1 gap-2 border-t px-6 py-4 sm:gap-2'>
          <Button variant='outline' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant='warning'
            onClick={handleSubmit}
            disabled={!selectedUserAlias || isLoading}
          >
            {isLoading && <Loading className='text-white!' />}Add Permission
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserFromMortgagePermissionDialog;
