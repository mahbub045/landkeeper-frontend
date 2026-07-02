'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useFilterPropertiesQuery } from '@/store/api/endpoints/client/Common/Filters/FilterPropertiesApi';
import { useAddTenantsMutation } from '@/store/api/endpoints/client/Common/Tenant/TenantApi';
import { Property } from '@/types/client/Common/Properties/PropertyTypes';
import {
  AddTenantModalProps,
  TenantForm,
} from '@/types/client/Common/Tenant/TenantTypes';
import { getCurrencySign } from '@/utils/formatters';

import { Upload, User, X } from 'lucide-react';
import { useRef, useState } from 'react';

const EMPTY_FORM: TenantForm = {
  propertyId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  rentAmount: '',
  deposit: '',
  tenancyStart: '',
  tenancyEnd: '',
  employmentDetails: '',
  guarantorName: '',
  notes: '',
};

// Backend snake_case -> form camelCase key mapping for field-level errors
const ERROR_KEY_MAP: Record<string, string> = {
  avatar: 'avatar',
  first_name: 'firstName',
  last_name: 'lastName',
  email: 'email',
  phone: 'phone',
  rent_amount: 'rentAmount',
  deposit: 'deposit',
  tenancy_start_date: 'tenancyStart',
  tenancy_end_date: 'tenancyEnd',
  employment_details: 'employmentDetails',
  guarantor_name: 'guarantorName',
  notes: 'notes',
  property: 'propertyId',
};

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
  async function handleSubmit() {
    if (
      form.tenancyStart &&
      form.tenancyEnd &&
      form.tenancyEnd < form.tenancyStart
    ) {
      setFieldErrors((prev) => ({
        ...prev,
        tenancyEnd: 'End date cannot be before start date',
      }));
      return;
    }

    setBannerError(null);
    setFieldErrors({});
    setLoading(true);

    const formData = new FormData();
    if (avatarFile) formData.append('avatar', avatarFile);
    formData.append('first_name', form.firstName);
    formData.append('last_name', form.lastName);
    formData.append('email', form.email);
    formData.append('phone', form.phone);
    formData.append('rent_amount', form.rentAmount);
    formData.append('deposit', form.deposit);
    formData.append('tenancy_start_date', form.tenancyStart);
    if (form.tenancyEnd) formData.append('tenancy_end_date', form.tenancyEnd);
    formData.append('employment_details', form.employmentDetails);
    formData.append('guarantor_name', form.guarantorName);
    formData.append('notes', form.notes);
    formData.append('property', form.propertyId);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await addTenant(formData as any).unwrap();
      onSuccess?.();
      handleClose();
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = (err as any)?.data;

      if (data && typeof data === 'object') {
        const mapped: Record<string, string> = {};

        Object.keys(data).forEach((key) => {
          const mappedKey = ERROR_KEY_MAP[key] ?? key;
          const value = data[key];
          mapped[mappedKey] = Array.isArray(value) ? value[0] : value;
        });

        setFieldErrors(mapped);
        setBannerError(
          data.detail || data.message || 'Please fix the errors below.',
        );
      } else {
        setBannerError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className='flex max-h-[90vh] w-full flex-col overflow-hidden p-0 sm:max-w-185'>
        {/* Header */}
        <DialogHeader className='shrink-0 border-b px-6 pt-6 pb-5'>
          <DialogTitle className='text-foreground text-xl font-bold'>
            Add Tenant
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable body */}
        <div className='flex-1 space-y-5 overflow-y-auto px-6 py-5'>
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
            <Field data-invalid={!!fieldErrors.firstName}>
              <FieldLabel className='text-sm font-semibold'>
                First Name
              </FieldLabel>
              <Input
                type='text'
                value={form.firstName}
                onChange={(e) => set('firstName', e.target.value)}
                aria-invalid={!!fieldErrors.firstName}
                className={
                  fieldErrors.firstName
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: fieldErrors.firstName }]} />
            </Field>

            <Field data-invalid={!!fieldErrors.lastName}>
              <FieldLabel className='text-sm font-semibold'>
                Last Name
              </FieldLabel>
              <Input
                type='text'
                value={form.lastName}
                onChange={(e) => set('lastName', e.target.value)}
                aria-invalid={!!fieldErrors.lastName}
                className={
                  fieldErrors.lastName
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: fieldErrors.lastName }]} />
            </Field>
          </div>

          {/* Email + Phone */}
          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!fieldErrors.email}>
              <FieldLabel className='text-sm font-semibold'>Email</FieldLabel>
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
              />
              <FieldError errors={[{ message: fieldErrors.email }]} />
            </Field>

            <Field data-invalid={!!fieldErrors.phone}>
              <FieldLabel className='text-sm font-semibold'>Phone</FieldLabel>
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
              />
              <FieldError errors={[{ message: fieldErrors.phone }]} />
            </Field>
          </div>

          {/* Rent Amount + Deposit */}
          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!fieldErrors.rentAmount}>
              <FieldLabel className='text-sm font-semibold'>
                Rent Amount
              </FieldLabel>
              <Input
                type='number'
                placeholder={`${getCurrencySign()} per month`}
                value={form.rentAmount}
                onChange={(e) => set('rentAmount', e.target.value)}
                aria-invalid={!!fieldErrors.rentAmount}
                className={
                  fieldErrors.rentAmount
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: fieldErrors.rentAmount }]} />
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
            <Field data-invalid={!!fieldErrors.tenancyStart}>
              <FieldLabel className='text-sm font-semibold'>
                Tenancy Start
              </FieldLabel>
              <Input
                type='date'
                value={form.tenancyStart}
                onChange={(e) => {
                  const value = e.target.value;
                  set('tenancyStart', value);
                  setFieldErrors((prev) => {
                    if (form.tenancyEnd && value && form.tenancyEnd < value) {
                      return {
                        ...prev,
                        tenancyEnd: 'End date cannot be before start date',
                      };
                    }
                    const { tenancyEnd, ...rest } = prev;
                    return rest;
                  });
                }}
                aria-invalid={!!fieldErrors.tenancyStart}
                className={
                  fieldErrors.tenancyStart
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: fieldErrors.tenancyStart }]} />
            </Field>

            <Field data-invalid={!!fieldErrors.tenancyEnd}>
              <FieldLabel className='text-sm font-semibold'>
                Tenancy End
              </FieldLabel>
              <Input
                type='date'
                value={form.tenancyEnd}
                min={form.tenancyStart || undefined}
                onChange={(e) => {
                  const value = e.target.value;
                  set('tenancyEnd', value);
                  setFieldErrors((prev) => {
                    if (
                      form.tenancyStart &&
                      value &&
                      value < form.tenancyStart
                    ) {
                      return {
                        ...prev,
                        tenancyEnd: 'End date cannot be before start date',
                      };
                    }
                    const { tenancyEnd, ...rest } = prev;
                    return rest;
                  });
                }}
                aria-invalid={!!fieldErrors.tenancyEnd}
                className={
                  fieldErrors.tenancyEnd
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: fieldErrors.tenancyEnd }]} />
            </Field>
          </div>

          {/* Employment Details */}
          <Field data-invalid={!!fieldErrors.employmentDetails}>
            <FieldLabel className='text-sm font-semibold'>
              Employment Details
            </FieldLabel>
            <Input
              type='text'
              placeholder='Employer name and role'
              value={form.employmentDetails}
              onChange={(e) => set('employmentDetails', e.target.value)}
              aria-invalid={!!fieldErrors.employmentDetails}
              className={
                fieldErrors.employmentDetails
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: fieldErrors.employmentDetails }]} />
          </Field>

          {/* Guarantor Name */}
          <Field data-invalid={!!fieldErrors.guarantorName}>
            <FieldLabel className='text-sm font-semibold'>
              Guarantor Name
            </FieldLabel>
            <Input
              type='text'
              placeholder='Optional'
              value={form.guarantorName}
              onChange={(e) => set('guarantorName', e.target.value)}
              aria-invalid={!!fieldErrors.guarantorName}
              className={
                fieldErrors.guarantorName
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: fieldErrors.guarantorName }]} />
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
        </div>

        {/* Footer */}
        <div className='flex shrink-0 items-center justify-end gap-3 border-t px-6 py-4'>
          <Button variant='outline' onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loading className='text-white!' />}
            Add Tenant
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTenantDialog;
