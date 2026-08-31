'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useGetAuthUserListQuery } from '@/store/api/endpoints/auth/AuthUserListApi';
import {
  useAddPropertiesPermissionMutation,
  useGetPropertiesForPermissionQuery,
} from '@/store/api/endpoints/client/Common/Tools/Permission/PermissionApi';
import { AuthUser } from '@/types/auth/AuthUsersType';
import { PropertiesPermissionType } from '@/types/client/Common/Tools/Permission/PermissionTypes';
import { Check, Loader2, Search, Users, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const PropertiesPermission: React.FC = () => {
  // --- user search state ---
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // --- property selection state ---
  const [selectedAliases, setSelectedAliases] = useState<string[]>([]);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // fetch users whenever the dropdown is open — empty search returns all users
  const { data: userData, isFetching: isSearching } = useGetAuthUserListQuery(
    { search: debouncedSearch, role: 'MORTGAGE_ADVISER' },
    { skip: !isDropdownOpen },
  );
  const users: AuthUser[] = userData?.results ?? userData ?? [];

  const userAlias = selectedUser?.user.alias;

  const {
    data: propertyData,
    isFetching: isLoadingProperties,
    refetch,
  } = useGetPropertiesForPermissionQuery(userAlias!, { skip: !userAlias });
  const properties = propertyData?.results ?? [];

  const [addPropertiesPermission, { isLoading: isSaving }] =
    useAddPropertiesPermissionMutation();

  const getFullName = (user: AuthUser) =>
    [user.user.first_name, user.user.middle_name, user.user.last_name]
      .filter(Boolean)
      .join(' ');

  const getInitials = (user: AuthUser) => {
    const first = user.user.first_name?.[0] ?? '';
    const last = user.user.last_name?.[0] ?? '';
    return (first + last).toUpperCase() || user.user.email[0]?.toUpperCase();
  };

  const handleSelectUser = (user: AuthUser) => {
    setSelectedUser(user);
    setSearch(getFullName(user) || user.user.email);
    setDebouncedSearch('');
    setSelectedAliases([]);
    setCanEdit(false);
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setIsDropdownOpen(true);
    if (selectedUser) {
      // user is editing the search again — clear the previous selection
      setSelectedUser(null);
      setSelectedAliases([]);
      setCanEdit(false);
    }
  };

  const handleClearSearch = () => {
    setSearch('');
    setDebouncedSearch('');
    setSelectedUser(null);
    setSelectedAliases([]);
    setCanEdit(false);
    setIsDropdownOpen(true);
  };

  const toggleProperty = (alias: string) => {
    setSelectedAliases((prev) =>
      prev.includes(alias) ? prev.filter((a) => a !== alias) : [...prev, alias],
    );
  };

  const toggleSelectAll = () => {
    const allAliases = properties.map(
      (p: PropertiesPermissionType) => p.property.alias,
    );
    setSelectedAliases((prev) =>
      prev.length === allAliases.length ? [] : allAliases,
    );
  };

  const handleSubmit = async () => {
    if (!userAlias || selectedAliases.length === 0) return;

    await addPropertiesPermission({
      userAlias,
      payload: {
        property: selectedAliases,
        can_view: true,
        can_edit: canEdit,
      },
    }).unwrap();

    setSelectedAliases([]);
    refetch();
  };

  const allSelected =
    properties.length > 0 && selectedAliases.length === properties.length;

  return (
    <div className='mx-auto w-full space-y-6'>
      {/* --- header --- */}
      <div className='text-center'>
        <h2 className='text-lg font-semibold tracking-tight'>
          Property permissions
        </h2>
        <p className='text-muted-foreground mt-0.5 text-sm'>
          Grant a mortgage adviser access to specific properties.
        </p>
      </div>

      {/* --- user search --- */}
      <div className='relative mx-auto max-w-md' ref={searchContainerRef}>
        <div className='relative'>
          <Search className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />

          <Input
            value={search}
            type='text'
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder='Search a mortgage adviser by name or email'
            className='pr-9! pl-9!'
          />

          {isSearching && (
            <Loader2 className='text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin' />
          )}

          {!isSearching && search && (
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={handleClearSearch}
              className='text-muted-foreground absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2'
              aria-label='Clear search'
            >
              <X className='h-3.5 w-3.5' />
            </Button>
          )}
        </div>

        {isDropdownOpen && (
          <Card className='absolute z-10 mt-2 max-h-72 w-full overflow-y-auto p-1.5 shadow-lg'>
            {isSearching && (
              <div className='text-muted-foreground px-3 py-3 text-sm'>
                Searching…
              </div>
            )}

            {!isSearching &&
              users.length > 0 &&
              users.map((item) => {
                const fullName = getFullName(item);
                const isSelected = item.user.alias === userAlias;

                return (
                  <button
                    key={item.user.alias}
                    onClick={() => handleSelectUser(item)}
                    className={cn(
                      'hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition-colors',
                      isSelected && 'bg-accent',
                    )}
                  >
                    <Avatar className='h-8 w-8 shrink-0'>
                      <AvatarImage
                        src={item.user.profile_image || undefined}
                        alt={fullName}
                      />
                      <AvatarFallback className='text-xs'>
                        {getInitials(item)}
                      </AvatarFallback>
                    </Avatar>
                    <div className='min-w-0'>
                      <div className='truncate text-sm font-medium'>
                        {fullName || item.user.email}
                      </div>
                      <div className='text-muted-foreground truncate text-xs'>
                        {item.user.email}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className='text-primary ml-auto h-4 w-4 shrink-0' />
                    )}
                  </button>
                );
              })}

            {!isSearching && users.length === 0 && (
              <div className='text-muted-foreground px-3 py-3 text-sm'>
                No mortgage advisers found.
              </div>
            )}
          </Card>
        )}
      </div>

      {/* --- selected user summary / empty state --- */}
      {selectedUser ? (
        <Card className='flex items-center gap-3 p-4'>
          <Avatar className='h-9 w-9 shrink-0'>
            <AvatarImage
              src={selectedUser.user.profile_image || undefined}
              alt={getFullName(selectedUser)}
            />
            <AvatarFallback className='text-xs'>
              {getInitials(selectedUser)}
            </AvatarFallback>
          </Avatar>
          <div className='min-w-0'>
            <div className='truncate text-sm font-medium'>
              {getFullName(selectedUser)}
            </div>
            <div className='text-muted-foreground truncate text-xs'>
              {selectedUser.user.email}
            </div>
          </div>
          <Badge variant='secondary' className='ml-auto shrink-0'>
            Mortgage adviser
          </Badge>
        </Card>
      ) : (
        <Card className='flex flex-col items-center gap-2 border-dashed p-8 text-center shadow-none'>
          <Users className='text-muted-foreground h-5 w-5' />
          <p className='text-muted-foreground text-sm'>
            Search and select a mortgage adviser above to manage their property
            permissions.
          </p>
        </Card>
      )}

      {isLoadingProperties && (
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-16 rounded-xl' />
          ))}
        </div>
      )}

      {/* --- property cards --- */}
      {!isLoadingProperties && userAlias && properties.length > 0 && (
        <>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
              {properties.length} propert
              {properties.length === 1 ? 'y' : 'ies'}
            </span>
            <Button
              type='button'
              variant='link'
              size='sm'
              onClick={toggleSelectAll}
              className='h-auto p-0 text-xs'
            >
              {allSelected ? 'Clear all' : 'Select all'}
            </Button>
          </div>

          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
            {properties.map((item: PropertiesPermissionType) => {
              const alias = item.property.alias;
              const selected = selectedAliases.includes(alias);

              return (
                <Card
                  key={alias}
                  role='button'
                  tabIndex={0}
                  onClick={() => toggleProperty(alias)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleProperty(alias);
                    }
                  }}
                  className={cn(
                    'group relative cursor-pointer p-3.5 pr-9 text-left transition-all hover:shadow-sm',
                    selected &&
                      'border-primary/40 bg-primary/5 ring-primary/20 ring-2',
                  )}
                >
                  <div className='truncate text-sm font-medium'>
                    {item.property.property_name || 'Untitled property'}
                  </div>
                  {item.mortgage?.lender_name && (
                    <div className='text-muted-foreground mt-1 truncate text-xs'>
                      {item.mortgage.lender_name}
                    </div>
                  )}

                  <span
                    className={cn(
                      'absolute top-1/2 right-3 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border transition-colors',
                      selected
                        ? 'border-primary bg-primary'
                        : 'border-input bg-background group-hover:border-muted-foreground',
                    )}
                  >
                    {selected && (
                      <Check
                        className='text-primary-foreground h-3 w-3'
                        strokeWidth={3}
                      />
                    )}
                  </span>
                </Card>
              );
            })}
          </div>

          {/* --- permission toggles + submit --- */}
          <div className='flex flex-wrap items-center gap-x-6 gap-y-3 border-t pt-4'>
            <Badge variant='success' className='gap-1.5 font-normal'>
              <Check className='h-3 w-3' strokeWidth={3} />
              Can view
              <span>(always granted)</span>
            </Badge>

            <div className='flex items-center gap-2.5'>
              <Switch
                id='can-edit'
                checked={canEdit}
                onCheckedChange={setCanEdit}
                className='cursor-pointer'
              />
              <Label
                htmlFor='can-edit'
                className='cursor-pointer text-sm font-normal'
              >
                Can edit
              </Label>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={selectedAliases.length === 0 || isSaving}
              className='ml-auto'
            >
              {isSaving ? (
                <>
                  <Loader2 className='h-3.5 w-3.5 animate-spin' />
                  Saving…
                </>
              ) : (
                `Apply to ${selectedAliases.length} selected`
              )}
            </Button>
          </div>
        </>
      )}

      {!isLoadingProperties && userAlias && properties.length === 0 && (
        <Card className='text-muted-foreground border-dashed p-8 text-center text-sm shadow-none'>
          No properties found for this user.
        </Card>
      )}
    </div>
  );
};

export default PropertiesPermission;
