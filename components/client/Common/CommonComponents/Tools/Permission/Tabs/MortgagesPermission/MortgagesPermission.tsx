'use client';
import Loading from '@/components/common/CustomLoader/Loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useGetAuthUserListQuery } from '@/store/api/endpoints/auth/AuthUserListApi';
import {
  useDeletePermissionMutation,
  useUpdatePermissionMutation,
} from '@/store/api/endpoints/client/Common/Permissions/PermissionsApi';
import {
  useAddMortgagesPermissionMutation,
  useGetMortgagesForPermissionQuery,
} from '@/store/api/endpoints/client/Common/Tools/Permission/MortgagesPermissionApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  MortgagesPermissionTabKey,
  setMortgagesPermissionActiveTab,
} from '@/store/slices/permissionTabsSlice';
import { AuthUser } from '@/types/auth/AuthUsersType';
import {
  MortgageForPermissionType,
  MortgagesPermissionType,
} from '@/types/client/Common/Tools/Permission/MortgagesPermissionTypes';
import { PAGE_LIMIT } from '@/utils/CommonConstants';
import { Check, RefreshCcw, Search, Users, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import AddMortgagesTab from './Tabs/AddMortgagesTab/AddMortgagesTab';
import ManageExistingMortgageTab from './Tabs/ManageExistingMortgageTab/ManageExistingMortgageTab';

const MortgagesPermission: React.FC = () => {
  // --- user search state ---
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // --- tab state ---
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(
    (state) => state.mortgagesPermissionTabs.activeTab,
  );

  // --- "Add Mortgages" tab state ---
  const [selectedAliases, setSelectedAliases] = useState<string[]>([]);
  const [canEdit, setCanEdit] = useState(false);

  // --- "Manage Existing" tab state ---
  const [pendingAliases, setPendingAliases] = useState<Set<string>>(new Set());

  // --- pagination state (one page counter per tab) ---
  const [addablePage, setAddablePage] = useState(1);
  const [grantedPage, setGrantedPage] = useState(1);

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

  // --- "Add Mortgages" data: mortgages not yet granted to this user ---
  const {
    data: addableMortgageData,
    isFetching: isLoadingAddable,
    refetch: refetchAddable,
  } = useGetMortgagesForPermissionQuery(
    {
      userAlias: userAlias!,
      params: { permission_status: 'not_added', page: addablePage },
    },
    { skip: !userAlias },
  );
  const addableMortgages: MortgageForPermissionType[] =
    addableMortgageData?.results ?? [];
  const addableCount = addableMortgageData?.count ?? 0;
  const addableTotalPages = Math.max(1, Math.ceil(addableCount / PAGE_LIMIT));

  // --- "Manage Existing" data: mortgages already granted to this user ---
  const {
    data: grantedMortgageData,
    isFetching: isLoadingGranted,
    refetch: refetchGranted,
  } = useGetMortgagesForPermissionQuery(
    { userAlias: userAlias!, params: { page: grantedPage } },
    { skip: !userAlias },
  );
  const grantedMortgages: MortgagesPermissionType[] =
    grantedMortgageData?.results ?? [];
  const grantedCount = grantedMortgageData?.count ?? 0;
  const grantedTotalPages = Math.max(1, Math.ceil(grantedCount / PAGE_LIMIT));

  const [addMortgagesPermission, { isLoading: isSaving }] =
    useAddMortgagesPermissionMutation();
  const [updateMortgagePermission] = useUpdatePermissionMutation();
  const [removeMortgagesPermission] = useDeletePermissionMutation();

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
    setAddablePage(1);
    setGrantedPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setIsDropdownOpen(true);
    if (selectedUser) {
      setSelectedUser(null);
      setSelectedAliases([]);
      setCanEdit(false);
      setAddablePage(1);
      setGrantedPage(1);
    }
  };

  const handleClearSearch = () => {
    setSearch('');
    setDebouncedSearch('');
    setSelectedUser(null);
    setSelectedAliases([]);
    setCanEdit(false);
    setIsDropdownOpen(true);
    setAddablePage(1);
    setGrantedPage(1);
  };

  const toggleMortgage = (alias: string) => {
    setSelectedAliases((prev) =>
      prev.includes(alias) ? prev.filter((a) => a !== alias) : [...prev, alias],
    );
  };

  const toggleSelectAll = () => {
    const allAliases = addableMortgages.map((m) => m.alias);
    setSelectedAliases((prev) =>
      prev.length === allAliases.length ? [] : allAliases,
    );
  };

  const handleSubmit = async () => {
    if (!userAlias || selectedAliases.length === 0) return;

    await addMortgagesPermission({
      userAlias,
      payload: {
        mortgage: selectedAliases,
        can_view: true,
        can_edit: canEdit,
      },
    }).unwrap();

    setSelectedAliases([]);
    setAddablePage(1);
    refetchAddable();
    refetchGranted();
  };

  const handleToggleCanEdit = async (
    permissionAlias: string,
    nextCanEdit: boolean,
  ) => {
    if (!userAlias) return;
    setPendingAliases((prev) => new Set(prev).add(permissionAlias));
    try {
      await updateMortgagePermission({
        alias: permissionAlias,
        payload: { can_edit: nextCanEdit },
      }).unwrap();
      refetchGranted();
    } finally {
      setPendingAliases((prev) => {
        const next = new Set(prev);
        next.delete(permissionAlias);
        return next;
      });
    }
  };

  const handleRevoke = async (permissionAlias: string) => {
    if (!userAlias) return;

    const result = await Swal.fire({
      title: 'Revoke access to this mortgage?',
      text: 'This mortgage adviser will lose view and edit access.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Revoke',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setPendingAliases((prev) => new Set(prev).add(permissionAlias));
    try {
      await removeMortgagesPermission({
        alias: permissionAlias,
      }).unwrap();
      setGrantedPage(1);
      refetchGranted();
      refetchAddable();
      toast.success('Mortgage access revoked.');
    } catch {
      toast.error('Failed to revoke access. Please try again.');
    } finally {
      setPendingAliases((prev) => {
        const next = new Set(prev);
        next.delete(permissionAlias);
        return next;
      });
    }
  };

  const allSelected =
    addableMortgages.length > 0 &&
    selectedAliases.length === addableMortgages.length;

  return (
    <div className='mx-auto w-full space-y-6'>
      {/* --- header --- */}
      <div className='text-center'>
        <h2 className='text-lg font-semibold tracking-tight'>
          Mortgage permissions
        </h2>
        <p className='text-muted-foreground mt-0.5 text-sm'>
          Grant a mortgage adviser access to specific mortgages.
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
            <Loading className='text-muted-foreground! absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2' />
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
        <Card className='border-primary/15 from-primary/4 flex items-center gap-4 bg-linear-to-br to-transparent p-4'>
          <Avatar className='ring-primary/10 h-12 w-12 shrink-0 ring-4'>
            <AvatarImage
              src={selectedUser.user.profile_image || undefined}
              alt={getFullName(selectedUser)}
            />
            <AvatarFallback className='bg-primary/10 text-primary text-sm font-semibold'>
              {getInitials(selectedUser)}
            </AvatarFallback>
          </Avatar>

          <div className='min-w-0 flex-1 space-y-0.5'>
            <div className='truncate text-sm font-semibold'>
              {getFullName(selectedUser)}
            </div>
            <div className='text-muted-foreground truncate text-xs'>
              {selectedUser.user.email}
            </div>
          </div>

          <div className='flex shrink-0 items-center gap-3'>
            <Badge
              variant='secondary'
              className='border-primary/20 bg-primary/10 text-primary gap-1 font-normal'
            >
              <Check className='h-3 w-3' strokeWidth={3} />
              Mortgage adviser
            </Badge>

            <Button
              type='button'
              variant='destructive'
              size='xs'
              onClick={handleClearSearch}
            >
              <RefreshCcw />
              Change
            </Button>
          </div>
        </Card>
      ) : (
        <Card className='flex flex-col items-center gap-2 border-dashed p-8 text-center shadow-none'>
          <Users className='text-muted-foreground h-5 w-5' />
          <p className='text-muted-foreground text-sm'>
            Search and select a mortgage adviser above to manage their mortgage
            permissions.
          </p>
        </Card>
      )}

      {/* --- tabs: Add Mortgages / Manage Existing --- */}
      {selectedUser && (
        <Tabs
          value={activeTab}
          onValueChange={(v) =>
            dispatch(
              setMortgagesPermissionActiveTab(v as MortgagesPermissionTabKey),
            )
          }
        >
          <TabsList className='bg-primary/5 w-full py-5'>
            <TabsTrigger value='add' className='cursor-pointer p-4'>
              Add mortgages{addableCount > 0 ? ` (${addableCount})` : ''}
            </TabsTrigger>
            <TabsTrigger value='manage' className='cursor-pointer p-4'>
              Manage existing{grantedCount > 0 ? ` (${grantedCount})` : ''}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* ================= ADD MORTGAGES TAB ================= */}
      {activeTab === 'add' && (
        <AddMortgagesTab
          isLoadingAddable={isLoadingAddable}
          userAlias={userAlias}
          addableMortgages={addableMortgages}
          addableCount={addableCount}
          addableTotalPages={addableTotalPages}
          addablePage={addablePage}
          setAddablePage={setAddablePage}
          selectedAliases={selectedAliases}
          toggleMortgage={toggleMortgage}
          toggleSelectAll={toggleSelectAll}
          canEdit={canEdit}
          setCanEdit={setCanEdit}
          handleSubmit={handleSubmit}
          isSaving={isSaving}
          allSelected={allSelected}
        />
      )}

      {/* ================= MANAGE EXISTING TAB ================= */}
      {activeTab === 'manage' && (
        <ManageExistingMortgageTab
          isLoadingGranted={isLoadingGranted}
          userAlias={userAlias}
          grantedMortgages={grantedMortgages}
          grantedCount={grantedCount}
          grantedTotalPages={grantedTotalPages}
          grantedPage={grantedPage}
          setGrantedPage={setGrantedPage}
          pendingAliases={pendingAliases}
          handleToggleCanEdit={handleToggleCanEdit}
          handleRevoke={handleRevoke}
        />
      )}
    </div>
  );
};

export default MortgagesPermission;
