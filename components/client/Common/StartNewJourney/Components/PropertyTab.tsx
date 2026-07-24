'use client';

// components/StartNewJourney/steps/PropertyDetailsStep.tsx

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  PROPERTY_OWNER_OPTIONS,
  PROPERTY_STATUS_OPTIONS,
  PROPERTY_TENURE_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
} from '@/data/client/common/properties/PropertiesData';
import { DetailsForm } from '@/types/client/Common/Properties/PropertyTypes';
import { PropertyDetailsStepProps } from '@/types/client/StartNewJourney/StartNewJourneyTypes';
import { getCurrencySign } from '@/utils/formatters';
import { CloudUpload, Lock, Plus, Sparkles, Trash2, X } from 'lucide-react';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

const PropertyTab = forwardRef<HTMLFormElement, PropertyDetailsStepProps>(
  ({ active, value, onChange, files, onFilesChange, errors }, ref) => {
    const [isNameCustom, setIsNameCustom] = useState(false);
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function set(key: keyof DetailsForm, v: string) {
      onChange({ ...value, [key]: v });
    }

    useEffect(() => {
      if (isNameCustom) return;
      const derived = value.address;
      if (derived !== value.property_name) {
        onChange({ ...value, property_name: derived });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value.address, isNameCustom]);

    function handleToggleCustom() {
      if (isNameCustom) {
        setIsNameCustom(false);
        onChange({ ...value, property_name: value.address });
      } else {
        setIsNameCustom(true);
      }
    }

    // ── Owners (property_owner === 'OWNER') ─────────────────────────────────────

    function addOwner() {
      onChange({
        ...value,
        shareholder: [...value.shareholder, { owner_name: '' }],
      });
    }

    function updateOwner(index: number, name: string) {
      onChange({
        ...value,
        shareholder: value.shareholder.map((o, i) =>
          i === index ? { ...o, owner_name: name } : o,
        ),
      });
    }

    function removeOwner(index: number) {
      onChange({
        ...value,
        shareholder: value.shareholder.filter((_, i) => i !== index),
      });
    }

    // ── Shareholders (property_owner === 'COMPANY') ─────────────────────────────

    function addShareholder() {
      onChange({
        ...value,
        shareholder: [
          ...value.shareholder,
          { shareholder_name: '', share_percentage: '' },
        ],
      });
    }

    function updateShareholder(
      index: number,
      key: 'shareholder_name' | 'share_percentage',
      val: string,
    ) {
      onChange({
        ...value,
        shareholder: value.shareholder.map((s, i) =>
          i === index ? { ...s, [key]: val } : s,
        ),
      });
    }

    function removeShareholder(index: number) {
      onChange({
        ...value,
        shareholder: value.shareholder.filter((_, i) => i !== index),
      });
    }

    function addFiles(incoming: FileList | null) {
      if (!incoming) return;
      const existing = new Set(files.map((f) => f.name + f.size));
      const merged = [
        ...files,
        ...Array.from(incoming).filter((f) => !existing.has(f.name + f.size)),
      ];
      onFilesChange(merged);
    }

    function removeFile(index: number) {
      onFilesChange(files.filter((_, i) => i !== index));
    }

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        addFiles(e.dataTransfer.files);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [files],
    );

    return (
      <form ref={ref} hidden={!active} className='space-y-8'>
        {/* ── Details ── */}
        <div className='space-y-5'>
          <div className='flex justify-center'>
            <div className='border-primary/15 from-primary/10 via-primary/5 w-full rounded-xl border bg-linear-to-br to-transparent p-4'>
              <Field data-invalid={!!errors.name}>
                <div className='mb-1.5 flex items-center justify-between'>
                  <FieldLabel className='gap-1.5 text-sm font-semibold'>
                    <div className='gap-0'>Property Name</div>
                    {!isNameCustom && (
                      <span className='bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase'>
                        <Sparkles className='h-2.5 w-2.5' />
                        Auto From Address
                      </span>
                    )}
                  </FieldLabel>
                  <button
                    type='button'
                    onClick={handleToggleCustom}
                    className={[
                      'inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors',
                      isNameCustom
                        ? 'bg-primary/10 text-primary hover:bg-primary/15'
                        : 'bg-background text-muted-foreground hover:text-primary border shadow-sm',
                    ].join(' ')}
                  >
                    {isNameCustom ? 'Use Auto-fill' : 'Edit manually'}
                  </button>
                </div>
                <div className='relative'>
                  <Input
                    type='text'
                    placeholder='e.g. 14 Oak Street'
                    value={value.property_name}
                    onChange={(e) => set('property_name', e.target.value)}
                    readOnly={!isNameCustom}
                    aria-invalid={!!errors.property_name}
                    className={[
                      'bg-background transition-shadow',
                      errors.property_name
                        ? 'border-danger focus-visible:ring-danger/50'
                        : '',
                      !isNameCustom
                        ? 'text-muted-foreground cursor-default pr-9 shadow-none'
                        : 'shadow-sm',
                    ].join(' ')}
                  />
                  {!isNameCustom && (
                    <Lock className='text-muted-foreground/50 pointer-events-none absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2' />
                  )}
                </div>
                <FieldError errors={[{ message: errors.property_name }]} />
              </Field>
            </div>
          </div>

          <Field data-invalid={!!errors.address}>
            <FieldLabel className='text-sm font-semibold'>
              Property Address<span className='text-danger'>*</span>
            </FieldLabel>
            <Input
              type='text'
              placeholder='Full address'
              value={value.address}
              onChange={(e) => set('address', e.target.value)}
              aria-invalid={!!errors.address}
              required
              className={
                errors.address
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: errors.address }]} />
          </Field>

          <div className='flex items-end gap-4'>
            <Field
              className='flex-1'
              data-invalid={!!errors.property_property_owner}
            >
              <FieldLabel className='text-sm font-semibold'>
                Property Owner
              </FieldLabel>
              <Select
                value={value.property_owner}
                onValueChange={(v) => set('property_owner', v)}
              >
                <SelectTrigger
                  className={
                    errors.property_property_owner ? 'border-danger' : ''
                  }
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_OWNER_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {value.property_owner === 'OWNER' && (
              <Button
                type='button'
                variant='default'
                className='h-10'
                onClick={addOwner}
              >
                <Plus className='h-3.5 w-3.5' />
                Add Owner
              </Button>
            )}

            {value.property_owner === 'COMPANY' && (
              <Button
                type='button'
                variant='default'
                className='h-10'
                onClick={addShareholder}
              >
                <Plus className='h-3.5 w-3.5' />
                Add Shareholders
              </Button>
            )}
          </div>
          <FieldError errors={[{ message: errors.property_property_owner }]} />

          {/* Owner inputs — full width, below the row */}
          {value.property_owner === 'OWNER' && (
            <Field data-invalid={!!errors.ownerships}>
              {value.shareholder.length > 0 && (
                <div className='space-y-2'>
                  {value.shareholder.map((owner, i) => (
                    <div key={i} className='flex items-center gap-2'>
                      <Input
                        type='text'
                        placeholder='Owner name'
                        value={owner.owner_name}
                        onChange={(e) => updateOwner(i, e.target.value)}
                        className='flex-1'
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        onClick={() => removeOwner(i)}
                        className='text-muted-foreground hover:text-danger shrink-0'
                        aria-label='Remove owner'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <FieldError errors={[{ message: errors.ownerships }]} />
            </Field>
          )}

          {value.property_owner === 'COMPANY' && (
            <Field data-invalid={!!errors.company_name}>
              <FieldLabel className='text-sm font-semibold'>
                Company Name<span className='text-danger'>*</span>
              </FieldLabel>
              <Input
                type='text'
                placeholder='Company name'
                value={value.company_name}
                onChange={(e) => set('company_name', e.target.value)}
                aria-invalid={!!errors.company_name}
                required
                className={
                  errors.company_name
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: errors.company_name }]} />
            </Field>
          )}

          {/* Shareholder inputs — full width, below the row */}
          {value.property_owner === 'COMPANY' && (
            <Field data-invalid={!!errors.shareholder}>
              {value.shareholder.length > 0 && (
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <div className='grid flex-1 grid-cols-1 gap-2 lg:grid-cols-2'>
                      <FieldLabel className='text-sm font-semibold'>
                        Name
                      </FieldLabel>
                      <FieldLabel className='text-sm font-semibold'>
                        % Share
                      </FieldLabel>
                    </div>
                    <div className='w-9 shrink-0' />
                  </div>

                  {value.shareholder.map((sh, i) => (
                    <div key={i} className='flex items-center gap-2'>
                      <div className='grid flex-1 grid-cols-1 gap-2 lg:grid-cols-2'>
                        <Input
                          type='text'
                          placeholder='Shareholder name'
                          value={sh.shareholder_name}
                          onChange={(e) =>
                            updateShareholder(
                              i,
                              'shareholder_name',
                              e.target.value,
                            )
                          }
                        />
                        <Input
                          type='number'
                          placeholder='% share'
                          value={sh.share_percentage}
                          onChange={(e) =>
                            updateShareholder(
                              i,
                              'share_percentage',
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        onClick={() => removeShareholder(i)}
                        className='text-muted-foreground hover:text-danger shrink-0'
                        aria-label='Remove shareholder'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <FieldError errors={[{ message: errors.shareholder }]} />
            </Field>
          )}

          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!errors.property_type}>
              <FieldLabel className='text-sm font-semibold'>
                Property Type
              </FieldLabel>
              <Select
                value={value.property_type}
                onValueChange={(v) => set('property_type', v)}
              >
                <SelectTrigger
                  className={errors.property_type ? 'border-danger' : ''}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[{ message: errors.property_type }]} />
            </Field>

            <Field data-invalid={!!errors.status}>
              <FieldLabel className='text-sm font-semibold'>Status</FieldLabel>
              <Select
                value={value.status}
                onValueChange={(v) => set('status', v)}
              >
                <SelectTrigger className={errors.status ? 'border-danger' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[{ message: errors.status }]} />
            </Field>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!errors.purchase_price}>
              <FieldLabel className='text-sm font-semibold'>
                Purchase Price
              </FieldLabel>
              <Input
                type='number'
                placeholder={getCurrencySign()}
                maxLength={10}
                value={value.purchase_price}
                onChange={(e) => set('purchase_price', e.target.value)}
                aria-invalid={!!errors.purchase_price}
                className={
                  errors.purchase_price
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: errors.purchase_price }]} />
            </Field>

            <Field data-invalid={!!errors.current_value}>
              <FieldLabel className='text-sm font-semibold'>
                Current Value
              </FieldLabel>
              <Input
                type='number'
                placeholder={getCurrencySign()}
                value={value.current_value}
                onChange={(e) => set('current_value', e.target.value)}
                aria-invalid={!!errors.current_value}
                className={
                  errors.current_value
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: errors.current_value }]} />
            </Field>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!errors.monthly_rental_income}>
              <FieldLabel className='text-sm font-semibold'>
                Monthly Rental Income
              </FieldLabel>
              <Input
                type='number'
                placeholder={getCurrencySign()}
                value={value.monthly_rental_income}
                onChange={(e) => set('monthly_rental_income', e.target.value)}
                aria-invalid={!!errors.monthly_rental_income}
                className={
                  errors.monthly_rental_income
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError
                errors={[{ message: errors.monthly_rental_income }]}
              />
            </Field>

            <Field data-invalid={!!errors.purchase_date}>
              <FieldLabel className='text-sm font-semibold'>
                Purchase Date
              </FieldLabel>
              <Input
                type='date'
                value={value.purchase_date}
                onChange={(e) => set('purchase_date', e.target.value)}
                aria-invalid={!!errors.purchase_date}
                className={
                  errors.purchase_date
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: errors.purchase_date }]} />
            </Field>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!errors.bedrooms}>
              <FieldLabel className='text-sm font-semibold'>
                Bedrooms
              </FieldLabel>
              <Input
                type='number'
                value={value.bedrooms}
                placeholder='e.g. 3'
                onChange={(e) => set('bedrooms', e.target.value)}
                aria-invalid={!!errors.bedrooms}
                className={
                  errors.bedrooms
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: errors.bedrooms }]} />
            </Field>

            <Field data-invalid={!!errors.bathrooms}>
              <FieldLabel className='text-sm font-semibold'>
                Bathrooms
              </FieldLabel>
              <Input
                type='number'
                value={value.bathrooms}
                placeholder='e.g. 2'
                onChange={(e) => set('bathrooms', e.target.value)}
                aria-invalid={!!errors.bathrooms}
                className={
                  errors.bathrooms
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: errors.bathrooms }]} />
            </Field>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <Field data-invalid={!!errors.year_built}>
            <FieldLabel className='text-sm font-semibold'>
              Year Built
            </FieldLabel>
            <Input
              type='number'
              value={value.year_built}
              onChange={(e) => set('year_built', e.target.value)}
              aria-invalid={!!errors.year_built}
              placeholder='e.g. 1995'
              className={
                errors.year_built
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: errors.year_built }]} />
          </Field>

          <Field data-invalid={!!errors.property_tenure}>
            <FieldLabel className='text-sm font-semibold'>
              Property Tenure
            </FieldLabel>
            <Select
              value={value.property_tenure}
              onValueChange={(v) => set('property_tenure', v)}
            >
              <SelectTrigger
                className={errors.property_tenure ? 'border-danger' : ''}
              >
                <SelectValue placeholder='Select tenure' />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TENURE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[{ message: errors.property_tenure }]} />
          </Field>
        </div>

        {value.property_tenure === 'LEASEHOLD' && (
          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!errors.remaining_lease_term}>
              <FieldLabel className='text-sm font-semibold'>
                Remaining Lease Term (yrs)
              </FieldLabel>
              <Input
                type='number'
                value={value.remaining_lease_term}
                onChange={(e) => set('remaining_lease_term', e.target.value)}
                aria-invalid={!!errors.remaining_lease_term}
                placeholder='e.g. 25'
                className={
                  errors.remaining_lease_term
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: errors.remaining_lease_term }]} />
            </Field>

            <Field data-invalid={!!errors.monthly_service_charge}>
              <FieldLabel className='text-sm font-semibold'>
                Monthly Service Charge
              </FieldLabel>
              <Input
                type='number'
                placeholder={getCurrencySign()}
                value={value.monthly_service_charge}
                onChange={(e) => set('monthly_service_charge', e.target.value)}
                aria-invalid={!!errors.monthly_service_charge}
                className={
                  errors.monthly_service_charge
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError
                errors={[{ message: errors.monthly_service_charge }]}
              />
            </Field>
            <Field data-invalid={!!errors.annual_ground_rent}>
              <FieldLabel className='text-sm font-semibold'>
                Annual Ground Rent
              </FieldLabel>
              <Input
                type='number'
                placeholder={getCurrencySign()}
                value={value.annual_ground_rent}
                onChange={(e) => set('annual_ground_rent', e.target.value)}
                aria-invalid={!!errors.annual_ground_rent}
                className={
                  errors.annual_ground_rent
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: errors.annual_ground_rent }]} />
            </Field>
          </div>
        )}

        <div className='grid grid-cols-2 gap-4'>
          <Field data-invalid={!!errors.council_tax_band}>
            <FieldLabel className='text-sm font-semibold'>
              Council Tax Band
            </FieldLabel>
            <Input
              type='text'
              placeholder='e.g. A, B, C...'
              value={value.council_tax_band}
              onChange={(e) => set('council_tax_band', e.target.value)}
              aria-invalid={!!errors.council_tax_band}
              className={
                errors.council_tax_band
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: errors.council_tax_band }]} />
          </Field>
          <Field data-invalid={!!errors.local_authority}>
            <FieldLabel className='text-sm font-semibold'>
              Local Authority
            </FieldLabel>
            <Input
              type='text'
              value={value.local_authority}
              onChange={(e) => set('local_authority', e.target.value)}
              aria-invalid={!!errors.local_authority}
              placeholder='e.g. London Borough of Camden'
              className={
                errors.local_authority
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: errors.local_authority }]} />
          </Field>
        </div>

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

        {/* ── Pictures ── */}
        <div className='space-y-4'>
          <FieldLabel className='gap-0 text-sm font-semibold'>
            Property Pictures
          </FieldLabel>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            className={[
              'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-14 transition-colors',
              errors.documents
                ? 'border-danger bg-red-50 dark:bg-red-950/20'
                : dragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/40',
            ].join(' ')}
          >
            <CloudUpload
              className={[
                'mb-3 h-10 w-10',
                errors.documents ? 'text-danger' : 'text-primary',
              ].join(' ')}
            />
            <p className='text-foreground text-sm font-semibold'>
              Drag &amp; Drop or Click to Upload
            </p>
            <p className='text-muted-foreground mt-1 text-xs'>
              JPG, JPEG, PNG up to 50MB
            </p>
            {errors.documents && (
              <FieldError
                className='mt-2'
                errors={[{ message: errors.documents }]}
              />
            )}
            <input
              ref={fileInputRef}
              type='file'
              multiple
              accept='.jpg,.jpeg,.png'
              className='hidden'
              onChange={(e) => addFiles(e.target.files)}
            />
          </div>

          {files.length > 0 && (
            <ul className='space-y-2'>
              {files.map((file, i) => (
                <li
                  key={i}
                  className='bg-muted flex items-center justify-between rounded-md px-4 py-2.5'
                >
                  <Badge
                    variant='secondary'
                    className='max-w-[80%] truncate font-normal'
                  >
                    {file.name}
                  </Badge>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={() => removeFile(i)}
                    className='text-muted-foreground hover:text-danger ml-2 h-6 w-6 shrink-0'
                    aria-label='Remove file'
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>
    );
  },
);

PropertyTab.displayName = 'Property';

export default PropertyTab;

// Non-native validation (Select is native enough here since only address is
// truly required by the backend sample; the only manual guard is the image
// dropzone, which isn't a native form control).
export function validatePropertyStep(files: File[]): Record<string, string> {
  const errors: Record<string, string> = {};
  return errors;
}
