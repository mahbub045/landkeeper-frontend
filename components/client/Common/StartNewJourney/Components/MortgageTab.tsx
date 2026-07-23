'use client';

// components/StartNewJourney/steps/MortgageStep.tsx

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
  EMPTY_MORTGAGE_FORM,
  INTEREST_RATE_TYPE_OPTIONS,
} from '@/data/client/common/mortgage/MortgageData';
import { MortgageForm } from '@/types/client/Common/Mortgage/MortgageTypes';
import { MortgageStepProps } from '@/types/client/StartNewJourney/StartNewJourneyTypes';
import { getCurrencySign } from '@/utils/formatters';
import { CloudUpload, X } from 'lucide-react';
import { forwardRef, useCallback, useRef, useState } from 'react';

export type MortgageStepValue = Omit<MortgageForm, 'propertyId'>;

export const EMPTY_MORTGAGE_STEP_FORM: MortgageStepValue = (() => {
  const { propertyId: _propertyId, ...rest } = EMPTY_MORTGAGE_FORM;
  return rest;
})();

const MortgageTab = forwardRef<HTMLFormElement, MortgageStepProps>(
  ({ active, value, onChange, files, onFilesChange, errors }, ref) => {
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function set(key: keyof MortgageStepValue, v: string) {
      onChange({ ...value, [key]: v });
    }

    function addFiles(incoming: FileList | null) {
      if (!incoming) return;
      const existing = new Set(files.map((f) => f.name + f.size));
      onFilesChange([
        ...files,
        ...Array.from(incoming).filter((f) => !existing.has(f.name + f.size)),
      ]);
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
      <form ref={ref} hidden={!active} className='space-y-5'>
        {/* Lender Name */}
        <Field data-invalid={!!errors.lenderName}>
          <FieldLabel className='gap-0 text-sm font-semibold'>
            Lender Name<span className='text-danger'>*</span>
          </FieldLabel>
          <Input
            type='text'
            placeholder='e.g. Halifax, Nationwide'
            value={value.lenderName}
            onChange={(e) => set('lenderName', e.target.value)}
            aria-invalid={!!errors.lenderName}
            className={
              errors.lenderName
                ? 'border-danger focus-visible:ring-danger/50'
                : ''
            }
            required
          />
          <FieldError errors={[{ message: errors.lenderName }]} />
        </Field>

        {/*  Interest Rate Type + Interest Rate */}
        <div className='grid grid-cols-2 gap-4'>
          <Field data-invalid={!!errors.interestRateType}>
            <FieldLabel className='gap-0 text-sm font-semibold'>
              Interest Rate Type<span className='text-danger'>*</span>
            </FieldLabel>
            <Select
              value={value.interestRateType}
              onValueChange={(v) => set('interestRateType', v)}
            >
              <SelectTrigger
                aria-invalid={!!errors.interestRateType}
                className={
                  errors.interestRateType
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              >
                <SelectValue placeholder='Select Product Type' />
              </SelectTrigger>
              <SelectContent>
                {INTEREST_RATE_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[{ message: errors.interestRateType }]} />
          </Field>

          <Field data-invalid={!!errors.interestRate}>
            <FieldLabel className='text-sm font-semibold'>
              Interest Rate (%)
            </FieldLabel>
            <Input
              type='number'
              placeholder='e.g. 3.2'
              step='0.01'
              value={value.interestRate}
              onChange={(e) => set('interestRate', e.target.value)}
              aria-invalid={!!errors.interestRate}
              className={
                errors.interestRate
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: errors.interestRate }]} />
          </Field>
        </div>

        {/* Interest Rate Expiry Date + Outstanding Balance */}
        <div className='grid grid-cols-2 gap-4'>
          <Field data-invalid={!!errors.interestRateExpiryDate}>
            <FieldLabel className='text-sm font-semibold'>
              Interest Rate Expiry Date
            </FieldLabel>
            <Input
              type='date'
              value={value.interestRateExpiryDate}
              onChange={(e) => set('interestRateExpiryDate', e.target.value)}
              aria-invalid={!!errors.interestRateExpiryDate}
              className={
                errors.interestRateExpiryDate
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: errors.interestRateExpiryDate }]} />
          </Field>

          <Field data-invalid={!!errors.outstandingBalance}>
            <FieldLabel className='text-sm font-semibold'>
              Outstanding Balance
            </FieldLabel>
            <Input
              type='number'
              placeholder={getCurrencySign()}
              value={value.outstandingBalance}
              onChange={(e) => set('outstandingBalance', e.target.value)}
              aria-invalid={!!errors.outstandingBalance}
              className={
                errors.outstandingBalance
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: errors.outstandingBalance }]} />
          </Field>
        </div>

        {/* Monthly Payment + Remaining Mortgage Term(Years) */}
        <div className='grid grid-cols-2 gap-4'>
          <Field data-invalid={!!errors.monthlyPayment}>
            <FieldLabel className='text-sm font-semibold'>
              Monthly Payment
            </FieldLabel>
            <Input
              type='number'
              placeholder={getCurrencySign()}
              value={value.monthlyPayment}
              onChange={(e) => set('monthlyPayment', e.target.value)}
              aria-invalid={!!errors.monthlyPayment}
              className={
                errors.monthlyPayment
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: errors.monthlyPayment }]} />
          </Field>

          <Field data-invalid={!!errors.termYears}>
            <FieldLabel className='text-sm font-semibold'>
              Remaining Mortgage Term(Years)
            </FieldLabel>
            <Input
              type='number'
              placeholder='e.g. 25'
              value={value.remainingMortgage}
              onChange={(e) => set('remainingMortgage', e.target.value)}
              aria-invalid={!!errors.remainingMortgage}
              className={
                errors.remainingMortgage
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: errors.remainingMortgage }]} />
          </Field>
        </div>

        {/* EPC Rating + EPC Certificate Expiry Date */}
        <div className='grid grid-cols-2 gap-4'>
          <Field data-invalid={!!errors.epcRating}>
            <FieldLabel className='text-sm font-semibold'>
              EPC Rating
            </FieldLabel>
            <Input
              type='text'
              value={value.epcRating}
              onChange={(e) => set('epcRating', e.target.value)}
              aria-invalid={!!errors.epcRating}
              className={
                errors.epcRating
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: errors.epcRating }]} />
          </Field>

          <Field data-invalid={!!errors.epcCertificateExpiryDate}>
            <FieldLabel className='text-sm font-semibold'>
              EPC Certificate Expiry Date
            </FieldLabel>
            <Input
              type='date'
              value={value.epcCertificateExpiryDate}
              onChange={(e) => set('epcCertificateExpiryDate', e.target.value)}
              aria-invalid={!!errors.epcCertificateExpiryDate}
              className={
                errors.epcCertificateExpiryDate
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError
              errors={[{ message: errors.epcCertificateExpiryDate }]}
            />
          </Field>
        </div>

        {/*  Notes */}
        <Field data-invalid={!!errors.notes}>
          <FieldLabel className='text-sm font-semibold'>Notes</FieldLabel>
          <Textarea
            placeholder='Notes from mortgage adviser...'
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

        {/* Mortgage documents */}
        <div className='space-y-3'>
          <FieldLabel className='text-sm font-semibold'>
            Mortgage Documents
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
              'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors',
              dragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-muted/40',
            ].join(' ')}
          >
            <CloudUpload className='text-primary mb-3 h-10 w-10' />
            <p className='text-foreground text-sm font-semibold'>
              Drag &amp; Drop or Click to Upload
            </p>
            <p className='text-muted-foreground mt-1 text-xs'>
              PDF or image, multiple files allowed
            </p>
            <input
              ref={fileInputRef}
              type='file'
              multiple
              accept='.pdf,.jpg,.jpeg,.png,.webp'
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

MortgageTab.displayName = 'Mortgage';

export default MortgageTab;

export function validateMortgageStep(
  value: MortgageStepValue,
): Record<string, string> {
  const errors: Record<string, string> = {};
  return errors;
}
