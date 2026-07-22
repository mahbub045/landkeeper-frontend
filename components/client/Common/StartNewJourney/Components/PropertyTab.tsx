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
  PROPERTY_STATUS_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
} from '@/data/client/common/properties/PropertiesData';
import { DetailsForm } from '@/types/client/Common/Properties/PropertyTypes';
import { PropertyDetailsStepProps } from '@/types/client/StartNewJourney/StartNewJourneyTypes';
import { getCurrencySign } from '@/utils/formatters';
import { CloudUpload, Lock, Sparkles, X } from 'lucide-react';
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
      if (derived !== value.name) {
        onChange({ ...value, name: derived });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value.address, isNameCustom]);

    function handleToggleCustom() {
      if (isNameCustom) {
        setIsNameCustom(false);
        onChange({ ...value, name: value.address });
      } else {
        setIsNameCustom(true);
      }
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
                    <div className='gap-0'>
                      Property Name<span className='text-danger'>*</span>
                    </div>
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
                    value={value.name}
                    onChange={(e) => set('name', e.target.value)}
                    readOnly={!isNameCustom}
                    aria-invalid={!!errors.name}
                    className={[
                      'bg-background transition-shadow',
                      errors.name
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
                <FieldError errors={[{ message: errors.name }]} />
              </Field>
            </div>
          </div>

          <Field data-invalid={!!errors.address}>
            <FieldLabel className='gap-0 text-sm font-semibold'>
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

          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!errors.type}>
              <FieldLabel className='text-sm font-semibold'>
                Property Type
              </FieldLabel>
              <Select value={value.type} onValueChange={(v) => set('type', v)}>
                <SelectTrigger className={errors.type ? 'border-danger' : ''}>
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
              <FieldError errors={[{ message: errors.type }]} />
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
            <Field data-invalid={!!errors.purchasePrice}>
              <FieldLabel className='text-sm font-semibold'>
                Purchase Price
              </FieldLabel>
              <Input
                type='number'
                placeholder={getCurrencySign()}
                maxLength={10}
                value={value.purchasePrice}
                onChange={(e) => set('purchasePrice', e.target.value)}
                aria-invalid={!!errors.purchasePrice}
                className={
                  errors.purchasePrice
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: errors.purchasePrice }]} />
            </Field>

            <Field data-invalid={!!errors.currentValue}>
              <FieldLabel className='text-sm font-semibold'>
                Current Value
              </FieldLabel>
              <Input
                type='number'
                placeholder={getCurrencySign()}
                value={value.currentValue}
                onChange={(e) => set('currentValue', e.target.value)}
                aria-invalid={!!errors.currentValue}
                className={
                  errors.currentValue
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: errors.currentValue }]} />
            </Field>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!errors.rentPerMonth}>
              <FieldLabel className='text-sm font-semibold'>
                Rent Per Month
              </FieldLabel>
              <Input
                type='number'
                placeholder={getCurrencySign()}
                value={value.rentPerMonth}
                onChange={(e) => set('rentPerMonth', e.target.value)}
                aria-invalid={!!errors.rentPerMonth}
                className={
                  errors.rentPerMonth
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: errors.rentPerMonth }]} />
            </Field>

            <Field data-invalid={!!errors.purchaseDate}>
              <FieldLabel className='text-sm font-semibold'>
                Purchase Date
              </FieldLabel>
              <Input
                type='date'
                value={value.purchaseDate}
                onChange={(e) => set('purchaseDate', e.target.value)}
                aria-invalid={!!errors.purchaseDate}
                className={
                  errors.purchaseDate
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: errors.purchaseDate }]} />
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
        </div>

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
