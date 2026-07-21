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
  PRODUCT_TYPE_OPTIONS,
} from '@/data/client/common/mortgage/MortgageData';
import { MortgageForm } from '@/types/client/Common/Mortgage/MortgageTypes';
import { getCurrencySign } from '@/utils/formatters';
import { CloudUpload, X } from 'lucide-react';
import { forwardRef, useCallback, useRef, useState } from 'react';

export type MortgageStepValue = Omit<MortgageForm, 'propertyId'>;

export const EMPTY_MORTGAGE_STEP_FORM: MortgageStepValue = (() => {
  const { propertyId: _propertyId, ...rest } = EMPTY_MORTGAGE_FORM;
  return rest;
})();

interface MortgageStepProps {
  active: boolean;
  value: MortgageStepValue;
  onChange: (v: MortgageStepValue) => void;
  files: File[];
  onFilesChange: (files: File[]) => void;
  errors: Record<string, string>;
}

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

        <div className='grid grid-cols-2 gap-4'>
          <Field data-invalid={!!errors.productType}>
            <FieldLabel className='gap-0 text-sm font-semibold'>
              Product Type
            </FieldLabel>
            <Select
              value={value.productType}
              onValueChange={(v) => set('productType', v)}
            >
              <SelectTrigger
                aria-invalid={!!errors.productType}
                className={
                  errors.productType
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              >
                <SelectValue placeholder='Select Product Type' />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[{ message: errors.productType }]} />
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

        <div className='grid grid-cols-2 gap-4'>
          <Field data-invalid={!!errors.loanAmount}>
            <FieldLabel className='text-sm font-semibold'>
              Loan Amount
            </FieldLabel>
            <Input
              type='number'
              placeholder={getCurrencySign()}
              value={value.loanAmount}
              onChange={(e) => set('loanAmount', e.target.value)}
              aria-invalid={!!errors.loanAmount}
              className={
                errors.loanAmount
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: errors.loanAmount }]} />
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
              Term (Years)
            </FieldLabel>
            <Input
              type='number'
              placeholder='e.g. 25'
              value={value.termYears}
              onChange={(e) => set('termYears', e.target.value)}
              aria-invalid={!!errors.termYears}
              className={
                errors.termYears
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: errors.termYears }]} />
          </Field>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <Field data-invalid={!!errors.startDate}>
            <FieldLabel className='text-sm font-semibold'>
              Start Date
            </FieldLabel>
            <Input
              type='date'
              value={value.startDate}
              onChange={(e) => set('startDate', e.target.value)}
              aria-invalid={!!errors.startDate}
              className={
                errors.startDate
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: errors.startDate }]} />
          </Field>

          <Field data-invalid={!!errors.endDate}>
            <FieldLabel className='text-sm font-semibold'>End Date</FieldLabel>
            <Input
              type='date'
              value={value.endDate}
              min={value.startDate || undefined}
              onChange={(e) => set('endDate', e.target.value)}
              aria-invalid={!!errors.endDate}
              className={
                errors.endDate
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: errors.endDate }]} />
          </Field>
        </div>

        <Field data-invalid={!!errors.brokerNotes}>
          <FieldLabel className='text-sm font-semibold'>
            Broker Notes
          </FieldLabel>
          <Textarea
            placeholder='Notes from mortgage adviser...'
            rows={4}
            value={value.brokerNotes}
            onChange={(e) => set('brokerNotes', e.target.value)}
            aria-invalid={!!errors.brokerNotes}
            className={
              errors.brokerNotes
                ? 'border-danger focus-visible:ring-danger/50'
                : ''
            }
          />
          <FieldError errors={[{ message: errors.brokerNotes }]} />
        </Field>

        {/* Mortgage documents — new field, not in the original AddMortgageDialog */}
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
