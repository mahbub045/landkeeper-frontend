'use client';

// components/StartNewJourney/steps/ComplianceStep.tsx

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
import {
  CERTIFICATE_OPTIONS,
  EMPTY_FORM as EMPTY_COMPLIANCE_DIALOG_FORM,
} from '@/data/client/common/compliance/ComplianceData';
import { CertificateForm } from '@/types/client/Common/Compliance/ComplianceTypes';
import { ComplianceStepProps } from '@/types/client/StartNewJourney/StartNewJourneyTypes';
import { CloudUpload, X } from 'lucide-react';
import { forwardRef, useCallback, useRef, useState } from 'react';

export type ComplianceStepValue = Omit<CertificateForm, 'propertyId'>;

export const EMPTY_COMPLIANCE_STEP_FORM: ComplianceStepValue = (() => {
  const { propertyId: _propertyId, ...rest } = EMPTY_COMPLIANCE_DIALOG_FORM;
  return rest;
})();

const ComplianceTab = forwardRef<HTMLFormElement, ComplianceStepProps>(
  ({ active, value, onChange, files, onFilesChange, errors }, ref) => {
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function set(key: keyof ComplianceStepValue, v: string) {
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
      if (fileInputRef.current) fileInputRef.current.value = '';
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
        <Field data-invalid={!!errors.certificateType}>
          <FieldLabel className='gap-0 text-sm font-semibold'>
            Certificate Type<span className='text-danger'>*</span>
          </FieldLabel>
          <Select
            value={value.certificateType}
            onValueChange={(v) => set('certificateType', v)}
          >
            <SelectTrigger
              aria-invalid={!!errors.certificateType}
              className={
                errors.certificateType
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            >
              <SelectValue placeholder='Select certificate type...' />
            </SelectTrigger>
            <SelectContent>
              {CERTIFICATE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={[{ message: errors.certificateType }]} />
        </Field>

        <div className='grid grid-cols-2 gap-4'>
          <Field data-invalid={!!errors.issueDate}>
            <FieldLabel className='gap-0 text-sm font-semibold'>
              Issue Date
            </FieldLabel>
            <Input
              type='date'
              value={value.issueDate}
              onChange={(e) => set('issueDate', e.target.value)}
              aria-invalid={!!errors.issueDate}
              className={
                errors.issueDate
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
              // required
            />
            <FieldError errors={[{ message: errors.issueDate }]} />
          </Field>

          <Field data-invalid={!!errors.expiryDate}>
            <FieldLabel className='gap-0 text-sm font-semibold'>
              Expiry Date
            </FieldLabel>
            <Input
              type='date'
              value={value.expiryDate}
              min={value.issueDate || undefined}
              onChange={(e) => set('expiryDate', e.target.value)}
              aria-invalid={!!errors.expiryDate}
              className={
                errors.expiryDate
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
              // required
            />
            <FieldError errors={[{ message: errors.expiryDate }]} />
          </Field>
        </div>

        <Field data-invalid={!!errors.certificateNumber}>
          <FieldLabel className='gap-0 text-sm font-semibold'>
            Certificate Number
          </FieldLabel>
          <Input
            type='text'
            placeholder='e.g. CERT-2026-001'
            value={value.certificateNumber}
            onChange={(e) => set('certificateNumber', e.target.value)}
            aria-invalid={!!errors.certificateNumber}
            className={
              errors.certificateNumber
                ? 'border-danger focus-visible:ring-danger/50'
                : ''
            }
          />
          <FieldError errors={[{ message: errors.certificateNumber }]} />
        </Field>

        <Field data-invalid={!!errors.issuedBy}>
          <FieldLabel className='gap-0 text-sm font-semibold'>
            Issued By
          </FieldLabel>
          <Input
            type='text'
            placeholder='Company or engineer name'
            value={value.issuedBy}
            onChange={(e) => set('issuedBy', e.target.value)}
            aria-invalid={!!errors.issuedBy}
            className={
              errors.issuedBy
                ? 'border-danger focus-visible:ring-danger/50'
                : ''
            }
          />
          <FieldError errors={[{ message: errors.issuedBy }]} />
        </Field>

        <div className='space-y-3'>
          <FieldLabel className='gap-0 text-sm font-semibold'>
            Certificate Files
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
              errors.file
                ? 'border-danger bg-red-50 dark:bg-red-950/20'
                : dragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/40',
            ].join(' ')}
          >
            <CloudUpload
              className={[
                'mb-3 h-10 w-10',
                errors.file ? 'text-danger' : 'text-primary',
              ].join(' ')}
            />
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
          <FieldError errors={[{ message: errors.file }]} />

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

ComplianceTab.displayName = 'Compliance';

export default ComplianceTab;

export function validateComplianceStep(
  value: ComplianceStepValue,
): Record<string, string> {
  const errors: Record<string, string> = {};
  // if (!value.certificateType)
  //   errors.certificateType = 'Please select a certificate type.';
  return errors;
}
