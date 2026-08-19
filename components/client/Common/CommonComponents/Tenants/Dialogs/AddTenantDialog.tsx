'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  EMPTY_FORM,
  OVERRIDE_KEY_MAP,
} from '@/data/client/common/tenants/TenantsData';
import { TITLE_OPTIONS } from '@/data/common/TitleOptions';
import { cn } from '@/lib/utils';
import { useFilterPropertiesQuery } from '@/store/api/endpoints/client/Common/Filters/FilterPropertiesApi';
import { useAddTenantsMutation } from '@/store/api/endpoints/client/Common/Tenants/TenantsApi';
import { Property } from '@/types/client/Common/Properties/PropertyTypes';
import {
  AddTenantModalProps,
  TenantForm,
} from '@/types/client/Common/Tenants/TenantsTypes';
import { getCurrencySign, snakeToCamel } from '@/utils/formatters';
import { Upload, User, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const AddTenantDialog: React.FC<AddTenantModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<TenantForm>(EMPTY_FORM);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [propertyOpen, setPropertyOpen] = useState(false);
  const [propertySearch, setPropertySearch] = useState('');

  function set(key: keyof TenantForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ── RTK Queries  ───────────────────────────────────────────────────────────────────

  const { data, isLoading } = useFilterPropertiesQuery(
    propertySearch ? { search: propertySearch } : {},
    { skip: !propertyOpen },
  );

  const [addTenant] = useAddTenantsMutation();

  // ── Avatar handlers ────────────────────────────────────────────────────────

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }

  // ── Reset ───────────────────────────────────────────────────────────────────

  function handleClose() {
    setBannerError(null);
    setFieldErrors({});
    setLoading(false);
    setForm(EMPTY_FORM);
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(null);
    setAvatarPreview(null);
    onClose();
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBannerError(null);
    setFieldErrors({});
    setLoading(true);

    const formData = new FormData();
    if (avatarFile) formData.append('avatar', avatarFile);
    formData.append('title', form.title);
    formData.append('first_name', form.first_name);
    formData.append('middle_name', form.middle_name);
    formData.append('last_name', form.last_name);
    formData.append('email', form.email);
    formData.append('phone', form.phone);
    formData.append('rent_amount', form.rent_amount);
    formData.append('deposit', form.deposit);
    formData.append('tenancy_start_date', form.tenancy_start_date);
    if (form.tenancy_end_date)
      formData.append('tenancy_end_date', form.tenancy_end_date);
    formData.append('employment_details', form.employment_details);
    formData.append('guarantor_name', form.guarantor_name);
    formData.append('notes', form.notes);
    formData.append('property', form.propertyId);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await addTenant(formData as any).unwrap();
      toast.success('Tenant added successfully.');
      onSuccess?.();
      handleClose();
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = (err as any)?.data;

      if (data && typeof data === 'object') {
        const mapped: Record<string, string> = {};
        let hasFieldErrors = false;

        for (const [backendKey, value] of Object.entries(data)) {
          if (backendKey === 'detail' || backendKey === 'message') continue;
          const formKey =
            OVERRIDE_KEY_MAP[backendKey] ?? snakeToCamel(backendKey);
          mapped[formKey] = Array.isArray(value) ? value[0] : (value as string);
          hasFieldErrors = true;
        }

        if (hasFieldErrors) {
          setFieldErrors(mapped);
        } else {
          toast.error(
            data?.detail ??
              data?.message ??
              'Something went wrong. Please try again.',
          );
        }
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className='flex max-h-[90vh] w-full flex-col overflow-hidden p-0 sm:max-w-185'
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader className='shrink-0 border-b px-6 pt-6 pb-5'>
          <DialogTitle className='text-foreground text-xl font-bold'>
            Add Tenant
          </DialogTitle>
          <DialogDescription>Add a new tenant to the system.</DialogDescription>
        </DialogHeader>

        {/* Scrollable body */}
        <form
          onSubmit={handleSubmit}
          className='flex-1 space-y-5 overflow-y-auto px-6 py-5'
        >
          {bannerError && (
            <p className='text-danger rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm dark:border-red-900/40 dark:bg-red-950/30'>
              {bannerError}
            </p>
          )}

          {/* Avatar */}
          <Field data-invalid={!!fieldErrors.avatar}>
            <FieldLabel className='text-sm font-semibold'>Avatar</FieldLabel>
            <div className='flex items-center justify-center gap-4'>
              <Input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleAvatarChange}
              />

              {/* Container — NOT a button, just positions the trigger + badge */}
              <div className='group relative h-40 w-40 shrink-0'>
                <Button
                  type='button'
                  variant='ghost'
                  onClick={() => fileInputRef.current?.click()}
                  className='h-40 w-40 rounded-full p-0 hover:bg-transparent focus-visible:ring-2 focus-visible:ring-offset-2'
                >
                  <Avatar
                    className={`h-40 w-40 border-2 transition-colors ${
                      avatarPreview
                        ? 'border-transparent'
                        : 'border-border group-hover:border-primary/50 border-dashed'
                    }`}
                  >
                    <AvatarImage
                      src={avatarPreview ?? undefined}
                      alt='Avatar preview'
                    />
                    <AvatarFallback className='bg-muted'>
                      <User className='text-muted-foreground h-7 w-7' />
                    </AvatarFallback>
                  </Avatar>

                  {/* Hover overlay */}
                  <div className='pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100'>
                    <Upload className='h-5 w-5 text-white' />
                  </div>
                </Button>

                {avatarPreview && (
                  <Button
                    type='button'
                    variant='destructive'
                    size='icon'
                    onClick={(e) => {
                      e.stopPropagation();
                      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
                      setAvatarFile(null);
                      setAvatarPreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className='border-background absolute top-3 right-3 h-6 w-6 rounded-full border-2 p-0 shadow-sm transition-transform hover:scale-110'
                  >
                    <X className='h-3.5 w-3.5' />
                  </Button>
                )}
              </div>

              <div className='flex flex-col gap-1.5'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => fileInputRef.current?.click()}
                  className='w-fit'
                >
                  <Upload className='mr-2 h-4 w-4' />
                  {avatarFile ? 'Change Photo' : 'Upload Photo'}
                </Button>
                <FieldDescription className='text-xs'>
                  PNG or JPG, up to 5MB
                </FieldDescription>
              </div>
            </div>
            <FieldError errors={[{ message: fieldErrors.avatar }]} />
          </Field>

          {/* Property */}
          <Field data-invalid={!!fieldErrors.propertyId}>
            <FieldLabel className='gap-0 text-sm font-semibold'>
              Property<span className='text-danger'>*</span>
            </FieldLabel>
            <div className='relative'>
              <Input
                type='text'
                placeholder='Search by property name...'
                value={
                  form.propertyId
                    ? (data?.find(
                        (p: Property) => String(p.id) === form.propertyId,
                      )?.property_name ?? propertySearch)
                    : propertySearch
                }
                onChange={(e) => {
                  setPropertySearch(e.target.value);
                  set('propertyId', ''); // clear selection when user types
                  setPropertyOpen(true);
                }}
                onClick={() => setPropertyOpen(true)}
                onBlur={() => setTimeout(() => setPropertyOpen(false), 150)}
                aria-invalid={!!fieldErrors.propertyId}
                className={cn(
                  'h-10',
                  fieldErrors.propertyId &&
                    'border-danger focus-visible:ring-danger/50',
                )}
                required
              />

              {propertyOpen && (
                <div className='bg-background border-border absolute top-full left-0 z-50 mt-1 w-full rounded-md border shadow-md'>
                  {isLoading ? (
                    <div className='flex items-center justify-center gap-2 px-4 py-3 text-sm'>
                      <Loading />
                    </div>
                  ) : !data?.length ? (
                    <p className='text-muted-foreground px-4 py-3 text-sm'>
                      No properties found.
                    </p>
                  ) : (
                    <ul className='max-h-60 overflow-y-auto py-1'>
                      {data.map((p: Property) => (
                        <li
                          key={p.alias}
                          onMouseDown={() => {
                            set('propertyId', String(p.id));
                            setPropertySearch('');
                            setPropertyOpen(false);
                          }}
                          className={cn(
                            'hover:bg-muted flex cursor-pointer items-center gap-3 px-4 py-2.5',
                            form.propertyId === String(p.id) && 'bg-muted',
                          )}
                        >
                          <span className='text-foreground text-sm'>
                            {p.property_name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <FieldError errors={[{ message: fieldErrors.propertyId }]} />
          </Field>

          {/* First Name + Last Name */}
          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!fieldErrors.title}>
              <FieldLabel className='gap-0 text-sm font-semibold'>
                Title<span className='text-danger'>*</span>
              </FieldLabel>
              <Select
                value={form.title}
                onValueChange={(val) => {
                  set('title', val);
                }}
                required
              >
                <SelectTrigger id='title'>
                  <SelectValue placeholder='Select' />
                </SelectTrigger>
                <SelectContent>
                  {TITLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[{ message: fieldErrors.title }]} />
            </Field>

            <Field data-invalid={!!fieldErrors.first_name}>
              <FieldLabel className='gap-0 text-sm font-semibold'>
                First Name<span className='text-danger'>*</span>
              </FieldLabel>
              <Input
                type='text'
                value={form.first_name}
                onChange={(e) => set('first_name', e.target.value)}
                aria-invalid={!!fieldErrors.first_name}
                className={
                  fieldErrors.first_name
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
                required
              />
              <FieldError errors={[{ message: fieldErrors.first_name }]} />
            </Field>
          </div>

          {/* Middle Name + Last Name */}
          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!fieldErrors.middle_name}>
              <FieldLabel className='gap-0 text-sm font-semibold'>
                Middle Name
              </FieldLabel>
              <Input
                type='text'
                value={form.middle_name}
                onChange={(e) => set('middle_name', e.target.value)}
                aria-invalid={!!fieldErrors.middle_name}
                className={
                  fieldErrors.middle_name
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: fieldErrors.middle_name }]} />
            </Field>

            <Field data-invalid={!!fieldErrors.last_name}>
              <FieldLabel className='gap-0 text-sm font-semibold'>
                Last Name<span className='text-danger'>*</span>
              </FieldLabel>
              <Input
                type='text'
                value={form.last_name}
                onChange={(e) => set('last_name', e.target.value)}
                aria-invalid={!!fieldErrors.last_name}
                className={
                  fieldErrors.last_name
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
                required
              />
              <FieldError errors={[{ message: fieldErrors.last_name }]} />
            </Field>
          </div>

          {/* Email + Phone */}
          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!fieldErrors.email}>
              <FieldLabel className='gap-0 text-sm font-semibold'>
                Email<span className='text-danger'>*</span>
              </FieldLabel>
              <Input
                type='email'
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                aria-invalid={!!fieldErrors.email}
                className={
                  fieldErrors.email
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
                required
              />
              <FieldError errors={[{ message: fieldErrors.email }]} />
            </Field>

            <Field data-invalid={!!fieldErrors.phone}>
              <FieldLabel className='gap-0 text-sm font-semibold'>
                Phone<span className='text-danger'>*</span>
              </FieldLabel>
              <Input
                type='tel'
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                aria-invalid={!!fieldErrors.phone}
                className={
                  fieldErrors.phone
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
                required
              />
              <FieldError errors={[{ message: fieldErrors.phone }]} />
            </Field>
          </div>

          {/* Rent Amount + Deposit */}
          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!fieldErrors.rent_amount}>
              <FieldLabel className='text-sm font-semibold'>
                Rent Amount
              </FieldLabel>
              <Input
                type='number'
                placeholder={`${getCurrencySign()} per month`}
                value={form.rent_amount}
                onChange={(e) => set('rent_amount', e.target.value)}
                aria-invalid={!!fieldErrors.rent_amount}
                className={
                  fieldErrors.rent_amount
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: fieldErrors.rent_amount }]} />
            </Field>

            <Field data-invalid={!!fieldErrors.deposit}>
              <FieldLabel className='text-sm font-semibold'>Deposit</FieldLabel>
              <Input
                type='number'
                placeholder={getCurrencySign()}
                value={form.deposit}
                onChange={(e) => set('deposit', e.target.value)}
                aria-invalid={!!fieldErrors.deposit}
                className={
                  fieldErrors.deposit
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: fieldErrors.deposit }]} />
            </Field>
          </div>

          {/* Tenancy Start + Tenancy End */}
          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!fieldErrors.tenancy_start_date}>
              <FieldLabel className='text-sm font-semibold'>
                Tenancy Start
              </FieldLabel>
              <Input
                type='date'
                value={form.tenancy_start_date}
                onChange={(e) => set('tenancy_start_date', e.target.value)}
                aria-invalid={!!fieldErrors.tenancy_start_date}
                className={
                  fieldErrors.tenancy_start_date
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError
                errors={[{ message: fieldErrors.tenancy_start_date }]}
              />
            </Field>

            <Field data-invalid={!!fieldErrors.tenancy_end_date}>
              <FieldLabel className='text-sm font-semibold'>
                Tenancy End
              </FieldLabel>
              <Input
                type='date'
                value={form.tenancy_end_date}
                min={form.tenancy_start_date || undefined}
                onChange={(e) => set('tenancy_end_date', e.target.value)}
                aria-invalid={!!fieldErrors.tenancy_end_date}
                className={
                  fieldErrors.tenancy_end_date
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError
                errors={[{ message: fieldErrors.tenancy_end_date }]}
              />
            </Field>
          </div>

          {/* Employment Details */}
          <Field data-invalid={!!fieldErrors.employment_details}>
            <FieldLabel className='text-sm font-semibold'>
              Employment Details
            </FieldLabel>
            <Input
              type='text'
              placeholder='Employer name and role'
              value={form.employment_details}
              onChange={(e) => set('employment_details', e.target.value)}
              aria-invalid={!!fieldErrors.employment_details}
              className={
                fieldErrors.employment_details
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError
              errors={[{ message: fieldErrors.employment_details }]}
            />
          </Field>

          {/* Guarantor Name */}
          <Field data-invalid={!!fieldErrors.guarantor_name}>
            <FieldLabel className='text-sm font-semibold'>
              Guarantor Name
            </FieldLabel>
            <Input
              type='text'
              placeholder='Optional'
              value={form.guarantor_name}
              onChange={(e) => set('guarantor_name', e.target.value)}
              aria-invalid={!!fieldErrors.guarantor_name}
              className={
                fieldErrors.guarantor_name
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: fieldErrors.guarantor_name }]} />
          </Field>

          {/* Notes */}
          <Field data-invalid={!!fieldErrors.notes}>
            <FieldLabel className='text-sm font-semibold'>Notes</FieldLabel>
            <Textarea
              placeholder='Additional notes...'
              rows={4}
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              aria-invalid={!!fieldErrors.notes}
              className={
                fieldErrors.notes
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: fieldErrors.notes }]} />
          </Field>

          {/* Footer */}
          <div className='flex shrink-0 items-center justify-end gap-3 border-t px-6 py-4'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={loading}>
              {loading && <Loading className='text-white!' />}
              Add Tenant
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTenantDialog;
