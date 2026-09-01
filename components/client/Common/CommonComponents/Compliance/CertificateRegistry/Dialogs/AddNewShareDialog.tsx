'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  useAddNewShareMutation,
  useGetTenantFilterListQuery,
} from '@/store/api/endpoints/client/Common/Compliance/CertificateSharesApi';
import {
  AddNewShareDialogProps,
  TenantFilterItem,
} from '@/types/client/Common/Compliance/CertificateSharesTypes';
import { SEARCH_DEBOUNCE_MS } from '@/utils/CommonConstants';
import formatChoiceFieldValue from '@/utils/formatters';
import { Check, Search, User, X } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

const getTenantFullName = (tenant: TenantFilterItem) =>
  [
    tenant.title ? formatChoiceFieldValue(tenant.title) : '',
    tenant.first_name,
    tenant.middle_name,
    tenant.last_name,
  ]
    .filter(Boolean)
    .join(' ');

const AddNewShareDialog: React.FC<AddNewShareDialogProps> = ({
  open,
  onClose,
  certificateAlias,
  propertyAlias,
  complianceAlias,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedTenants, setSelectedTenants] = useState<TenantFilterItem[]>(
    [],
  );

  const { data: tenantList, isLoading: isTenantListLoading } =
    useGetTenantFilterListQuery(
      {
        search,
        property_alias: propertyAlias,
        compliance_alias: complianceAlias,
      },
      {
        skip: !isPopoverOpen || !propertyAlias,
      },
    );
  const [addNewShare, { isLoading: isAddNewShareLoading }] =
    useAddNewShareMutation();

  const options: TenantFilterItem[] = tenantList || [];

  // Debounce search input before sending it as an API param
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(searchInput.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const isSelected = (alias: string) =>
    selectedTenants.some((t) => t.alias === alias);

  const handleToggleTenant = (tenant: TenantFilterItem) => {
    setSelectedTenants((prev) =>
      isSelected(tenant.alias)
        ? prev.filter((t) => t.alias !== tenant.alias)
        : [...prev, tenant],
    );
  };

  const handleRemoveTenant = (alias: string) => {
    setSelectedTenants((prev) => prev.filter((t) => t.alias !== alias));
  };

  const handleClose = () => {
    setSearchInput('');
    setSearch('');
    setSelectedTenants([]);
    onClose();
  };

  const handleSubmit = async () => {
    if (selectedTenants.length === 0) {
      toast.error('Select at least one tenant to share with.');
      return;
    }

    try {
      await addNewShare({
        certificateAlias: certificateAlias,
        payload: { tenant: selectedTenants.map((t) => t.alias) },
      }).unwrap();
      toast.success('Certificate shared successfully.');
      handleClose();
    } catch (error) {
      toast.error('Failed to share certificate.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='flex max-h-[90vh] w-full flex-col overflow-hidden p-0 sm:max-w-150'>
        {/* Header */}
        <DialogHeader className='shrink-0 border-b px-6 pt-6 pb-5'>
          <DialogTitle className='text-foreground text-xl font-bold'>
            Add New Share
          </DialogTitle>
          <DialogDescription>
            Add a new share to this certificate.
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className='flex flex-col gap-3 overflow-y-auto px-6'>
          {/* Selected tenants */}
          {selectedTenants.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {selectedTenants.map((tenant) => (
                <Badge
                  size='lg'
                  key={tenant.alias}
                  variant='secondary'
                  className='flex h-8 items-center gap-2 pr-1 pl-1.5'
                >
                  <Avatar className='size-5 shrink-0'>
                    <AvatarImage
                      src={tenant.avatar ?? undefined}
                      alt={getTenantFullName(tenant)}
                    />
                    <AvatarFallback>
                      <User className='size-3' />
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex min-w-0 flex-col leading-tight'>
                    <span className='truncate font-medium'>
                      {getTenantFullName(tenant)}
                    </span>
                    {tenant.email && (
                      <span className='truncate text-[10px] opacity-80'>
                        {tenant.email}
                      </span>
                    )}
                  </div>
                  <button
                    type='button'
                    onClick={() => handleRemoveTenant(tenant.alias)}
                    className='hover:bg-muted-foreground/20 shrink-0 cursor-pointer rounded-full p-0.5'
                  >
                    <X className='size-3' />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <div>
                <h2 className='text-sm font-medium'>Select Tenants</h2>
                <div className='relative w-full'>
                  <Search className='text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2' />
                  <Input
                    type='text'
                    placeholder='Search tenants by name or email...'
                    value={searchInput}
                    onChange={handleSearchChange}
                    onFocus={() => setIsPopoverOpen(true)}
                    className='w-full pl-8!'
                  />
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent
              align='start'
              className='w-(--radix-popover-trigger-width) p-1'
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <div className='max-h-64 overflow-y-auto'>
                {isTenantListLoading && (
                  <div className='flex items-center justify-center gap-2 py-6 text-sm'>
                    <Loading className='size-4' />
                    Searching...
                  </div>
                )}

                {!isTenantListLoading && options.length === 0 && (
                  <p className='text-muted-foreground py-6 text-center text-sm'>
                    No tenants found.
                  </p>
                )}

                {!isTenantListLoading &&
                  options.map((tenant) => (
                    <button
                      key={tenant.alias}
                      type='button'
                      onClick={() => handleToggleTenant(tenant)}
                      className='hover:bg-muted flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm'
                    >
                      <div
                        className={`flex size-4 shrink-0 items-center justify-center rounded-sm border ${
                          isSelected(tenant.alias)
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-primary'
                        }`}
                      >
                        {isSelected(tenant.alias) && (
                          <Check className='size-3' />
                        )}
                      </div>
                      <Avatar className='size-7 shrink-0'>
                        <AvatarImage
                          src={tenant.avatar ?? undefined}
                          alt={getTenantFullName(tenant)}
                        />
                        <AvatarFallback>
                          <User className='size-3.5' />
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex min-w-0 flex-col'>
                        <span className='truncate font-medium'>
                          {getTenantFullName(tenant)}
                        </span>
                        {tenant.email && (
                          <span className='text-muted-foreground truncate text-xs'>
                            {tenant.email}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Footer */}
        <DialogFooter className='my-1 shrink-0 border-t px-6'>
          <Button type='button' variant='outline' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type='button'
            onClick={handleSubmit}
            disabled={isAddNewShareLoading || selectedTenants.length === 0}
          >
            {isAddNewShareLoading && <Loading className='size-4 text-white!' />}
            Add Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewShareDialog;
