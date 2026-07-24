'use client';

// components/StartNewJourney/steps/TenantStep.tsx

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
import { EMPTY_FORM as EMPTY_TENANT_DIALOG_FORM } from '@/data/client/common/tenant/TenantData';
import { TITLE_OPTIONS } from '@/data/common/TitleOptions';
import { TenantForm } from '@/types/client/Common/Tenant/TenantTypes';
import { TenantStepProps } from '@/types/client/StartNewJourney/StartNewJourneyTypes';
import { getCurrencySign } from '@/utils/formatters';
import { Upload, User, X } from 'lucide-react';
import { forwardRef, useRef } from 'react';

export type TenantStepValue = Omit<TenantForm, 'propertyId'>;

export const EMPTY_TENANT_STEP_FORM: TenantStepValue = (() => {
  const { propertyId: _propertyId, ...rest } = EMPTY_TENANT_DIALOG_FORM;
  return rest;
})();

const TenantTab = forwardRef<HTMLFormElement, TenantStepProps>(
  (
    {
      active,
      value,
      onChange,
      avatarFile,
      avatarPreview,
      onAvatarChange,
      errors,
    },
    ref,
  ) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    function set(key: keyof TenantStepValue, v: string) {
      onChange({ ...value, [key]: v });
    }

    function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      if (!file) return;
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      onAvatarChange(file, URL.createObjectURL(file));
    }

    function clearAvatar(e: React.MouseEvent) {
      e.stopPropagation();
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      onAvatarChange(null, null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }

    return (
      <form ref={ref} hidden={!active} className='space-y-5'>
        {/* Avatar */}
        <Field data-invalid={!!errors.avatar}>
          <FieldLabel className='text-sm font-semibold'>Avatar</FieldLabel>
          <div className='flex items-center justify-center gap-4'>
            <Input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleAvatarChange}
            />
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
                <div className='pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100'>
                  <Upload className='h-5 w-5 text-white' />
                </div>
              </Button>
              {avatarPreview && (
                <Button
                  type='button'
                  variant='destructive'
                  size='icon'
                  onClick={clearAvatar}
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
          <FieldError errors={[{ message: errors.avatar }]} />
        </Field>

        <div className='grid grid-cols-2 gap-4'>
          <Field data-invalid={!!errors.title}>
            <FieldLabel className='gap-0 text-sm font-semibold'>
              Title<span className='text-danger'>*</span>
            </FieldLabel>
            <Select value={value.title} onValueChange={(v) => set('title', v)}>
              <SelectTrigger
                id='title'
                aria-invalid={!!errors.title}
                className={
                  errors.title
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              >
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
            <FieldError errors={[{ message: errors.title }]} />
          </Field>

          <Field data-invalid={!!errors.firstName}>
            <FieldLabel className='gap-0 text-sm font-semibold'>
              First Name<span className='text-danger'>*</span>
            </FieldLabel>
            <Input
              type='text'
              value={value.firstName}
              onChange={(e) => set('firstName', e.target.value)}
              aria-invalid={!!errors.firstName}
              className={
                errors.firstName
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
              required
            />
            <FieldError errors={[{ message: errors.firstName }]} />
          </Field>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <Field data-invalid={!!errors.middleName}>
            <FieldLabel className='gap-0 text-sm font-semibold'>
              Middle Name
            </FieldLabel>
            <Input
              type='text'
              value={value.middleName}
              onChange={(e) => set('middleName', e.target.value)}
              aria-invalid={!!errors.middleName}
              className={
                errors.middleName
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: errors.middleName }]} />
          </Field>

          <Field data-invalid={!!errors.lastName}>
            <FieldLabel className='gap-0 text-sm font-semibold'>
              Last Name<span className='text-danger'>*</span>
            </FieldLabel>
            <Input
              type='text'
              value={value.lastName}
              onChange={(e) => set('lastName', e.target.value)}
              aria-invalid={!!errors.lastName}
              className={
                errors.lastName
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
              required
            />
            <FieldError errors={[{ message: errors.lastName }]} />
          </Field>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <Field data-invalid={!!errors.email}>
            <FieldLabel className='gap-0 text-sm font-semibold'>
              Email<span className='text-danger'>*</span>
            </FieldLabel>
            <Input
              type='email'
              value={value.email}
              onChange={(e) => set('email', e.target.value)}
              aria-invalid={!!errors.email}
              className={
                errors.email ? 'border-danger focus-visible:ring-danger/50' : ''
              }
              required
            />
            <FieldError errors={[{ message: errors.email }]} />
          </Field>

          <Field data-invalid={!!errors.phone}>
            <FieldLabel className='gap-0 text-sm font-semibold'>
              Phone<span className='text-danger'>*</span>
            </FieldLabel>
            <Input
              type='tel'
              value={value.phone}
              onChange={(e) => set('phone', e.target.value)}
              aria-invalid={!!errors.phone}
              className={
                errors.phone ? 'border-danger focus-visible:ring-danger/50' : ''
              }
              required
            />
            <FieldError errors={[{ message: errors.phone }]} />
          </Field>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <Field data-invalid={!!errors.rentAmount}>
            <FieldLabel className='text-sm font-semibold'>
              Rent Amount
            </FieldLabel>
            <Input
              type='number'
              placeholder={`${getCurrencySign()} per month`}
              value={value.rentAmount}
              onChange={(e) => set('rentAmount', e.target.value)}
              aria-invalid={!!errors.rentAmount}
              className={
                errors.rentAmount
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: errors.rentAmount }]} />
          </Field>

          <Field data-invalid={!!errors.deposit}>
            <FieldLabel className='text-sm font-semibold'>Deposit</FieldLabel>
            <Input
              type='number'
              placeholder={getCurrencySign()}
              value={value.deposit}
              onChange={(e) => set('deposit', e.target.value)}
              aria-invalid={!!errors.deposit}
              className={
                errors.deposit
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: errors.deposit }]} />
          </Field>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <Field data-invalid={!!errors.tenancyStart}>
            <FieldLabel className='text-sm font-semibold'>
              Tenancy Start
            </FieldLabel>
            <Input
              type='date'
              value={value.tenancyStart}
              onChange={(e) => set('tenancyStart', e.target.value)}
              aria-invalid={!!errors.tenancyStart}
              className={
                errors.tenancyStart
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: errors.tenancyStart }]} />
          </Field>

          <Field data-invalid={!!errors.tenancyEnd}>
            <FieldLabel className='text-sm font-semibold'>
              Tenancy End
            </FieldLabel>
            <Input
              type='date'
              value={value.tenancyEnd}
              min={value.tenancyStart || undefined}
              onChange={(e) => set('tenancyEnd', e.target.value)}
              aria-invalid={!!errors.tenancyEnd}
              className={
                errors.tenancyEnd
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: errors.tenancyEnd }]} />
          </Field>
        </div>

        <Field data-invalid={!!errors.employmentDetails}>
          <FieldLabel className='text-sm font-semibold'>
            Employment Details
          </FieldLabel>
          <Input
            type='text'
            placeholder='Employer name and role'
            value={value.employmentDetails}
            onChange={(e) => set('employmentDetails', e.target.value)}
            aria-invalid={!!errors.employmentDetails}
            className={
              errors.employmentDetails
                ? 'border-danger focus-visible:ring-danger/50'
                : ''
            }
          />
          <FieldError errors={[{ message: errors.employmentDetails }]} />
        </Field>

        <Field data-invalid={!!errors.guarantorName}>
          <FieldLabel className='text-sm font-semibold'>
            Guarantor Name
          </FieldLabel>
          <Input
            type='text'
            placeholder='Optional'
            value={value.guarantorName}
            onChange={(e) => set('guarantorName', e.target.value)}
            aria-invalid={!!errors.guarantorName}
            className={
              errors.guarantorName
                ? 'border-danger focus-visible:ring-danger/50'
                : ''
            }
          />
          <FieldError errors={[{ message: errors.guarantorName }]} />
        </Field>

        <Field data-invalid={!!errors.notes}>
          <FieldLabel className='text-sm font-semibold'>Notes</FieldLabel>
          <Textarea
            placeholder='Additional notes...'
            rows={4}
            value={value.notes}
            onChange={(e) => set('notes', e.target.value)}
            aria-invalid={!!errors.notes}
            className={
              errors.notes ? 'border-danger focus-visible:ring-danger/50' : ''
            }
          />
          <FieldError errors={[{ message: errors.notes }]} />
        </Field>
      </form>
    );
  },
);

TenantTab.displayName = 'Tenant';

export default TenantTab;

// Title uses shadcn Select, which doesn't enforce native `required` the way
// a real <select> would — guard it manually like the other Select fields
// across the codebase already do.
export function validateTenantStep(
  value: TenantStepValue,
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!value.title) errors.title = 'Please select a title.';
  return errors;
}
