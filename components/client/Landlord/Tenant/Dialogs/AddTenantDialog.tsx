'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
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
  AddTenantModalProps,
  TenantForm,
} from '@/types/client/Landlord/Tenant/TenantTypes';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

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

const AddTenantDialog: React.FC<AddTenantModalProps> = ({
  open,
  onClose,
  onSuccess,
  properties = [],
}) => {
  const [loading, setLoading] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<TenantForm>(EMPTY_FORM);

  function set(key: keyof TenantForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ── Reset ───────────────────────────────────────────────────────────────────
  function handleClose() {
    setBannerError(null);
    setFieldErrors({});
    setLoading(false);
    setForm(EMPTY_FORM);
    onClose();
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    setBannerError(null);
    setFieldErrors({});
    setLoading(true);

    // RTK Query mutation goes here
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

          {/* Property */}
          <Field data-invalid={!!fieldErrors.propertyId}>
            <FieldLabel className='text-sm font-semibold'>Property</FieldLabel>
            <Select
              value={form.propertyId}
              onValueChange={(v) => set('propertyId', v)}
            >
              <SelectTrigger
                className={fieldErrors.propertyId ? 'border-danger' : ''}
              >
                <SelectValue placeholder='Select property...' />
              </SelectTrigger>
              <SelectContent>
                {properties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[{ message: fieldErrors.propertyId }]} />
          </Field>

          {/* First Name + Last Name */}
          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!fieldErrors.firstName}>
              <FieldLabel className='text-sm font-semibold'>
                First Name
              </FieldLabel>
              <Input
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
                placeholder='£ per month'
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
                placeholder='£'
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
                onChange={(e) => set('tenancyStart', e.target.value)}
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
                onChange={(e) => set('tenancyEnd', e.target.value)}
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
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Add Tenant
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTenantDialog;
