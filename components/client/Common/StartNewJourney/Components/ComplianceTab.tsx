'use client';

// components/StartNewJourney/steps/ComplianceStep.tsx

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
import { CloudUpload } from 'lucide-react';
import { forwardRef, useCallback, useRef, useState } from 'react';

export type ComplianceStepValue = Omit<CertificateForm, 'propertyId'>;

export const EMPTY_COMPLIANCE_STEP_FORM: ComplianceStepValue = (() => {
  const { propertyId: _propertyId, ...rest } = EMPTY_COMPLIANCE_DIALOG_FORM;
  return rest;
})();

interface ComplianceStepProps {
  active: boolean;
  value: ComplianceStepValue;
  onChange: (v: ComplianceStepValue) => void;
  file: File | null;
  onFileChange: (file: File | null) => void;
  errors: Record<string, string>;
}

const ComplianceTab = forwardRef<HTMLFormElement, ComplianceStepProps>(
  ({ active, value, onChange, file, onFileChange, errors }, ref) => {
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function set(key: keyof ComplianceStepValue, v: string) {
      onChange({ ...value, [key]: v });
    }

    function handleFile(incoming: FileList | null) {
      if (!incoming?.length) return;
      onFileChange(incoming[0]);
    }

    const handleDrop = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      handleFile(e.dataTransfer.files);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <form ref={ref} hidden={!active} className='space-y-5'>
        <Field data-invalid={!!errors.certificateType}>
          <FieldLabel className='gap-0 text-sm font-semibold'>
            Certificate Type<span className='text-danger'>*</span>
          </FieldLabel>
          <Select value={value.certificateType} onValueChange={(v) => set('certificateType', v)}>
            <SelectTrigger
              aria-invalid={!!errors.certificateType}
              className={errors.certificateType ? 'border-danger focus-visible:ring-danger/50' : ''}
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
              Issue Date<span className='text-danger'>*</span>
            </FieldLabel>
            <Input
              type='date'
              value={value.issueDate}
              onChange={(e) => set('issueDate', e.target.value)}
              aria-invalid={!!errors.issueDate}
              className={errors.issueDate ? 'border-danger focus-visible:ring-danger/50' : ''}
              required
            />
            <FieldError errors={[{ message: errors.issueDate }]} />
          </Field>

          <Field data-invalid={!!errors.expiryDate}>
            <FieldLabel className='gap-0 text-sm font-semibold'>
              Expiry Date<span className='text-danger'>*</span>
            </FieldLabel>
            <Input
              type='date'
              value={value.expiryDate}
              min={value.issueDate || undefined}
              onChange={(e) => set('expiryDate', e.target.value)}
              aria-invalid={!!errors.expiryDate}
              className={errors.expiryDate ? 'border-danger focus-visible:ring-danger/50' : ''}
              required
            />
            <FieldError errors={[{ message: errors.expiryDate }]} />
          </Field>
        </div>

        <Field data-invalid={!!errors.certificateNumber}>
          <FieldLabel className='gap-0 text-sm font-semibold'>Certificate Number</FieldLabel>
          <Input
            type='text'
            placeholder='e.g. CERT-2026-001'
            value={value.certificateNumber}
            onChange={(e) => set('certificateNumber', e.target.value)}
            aria-invalid={!!errors.certificateNumber}
            className={errors.certificateNumber ? 'border-danger focus-visible:ring-danger/50' : ''}
          />
          <FieldError errors={[{ message: errors.certificateNumber }]} />
        </Field>

        <Field data-invalid={!!errors.issuedBy}>
          <FieldLabel className='gap-0 text-sm font-semibold'>Issued By</FieldLabel>
          <Input
            type='text'
            placeholder='Company or engineer name'
            value={value.issuedBy}
            onChange={(e) => set('issuedBy', e.target.value)}
            aria-invalid={!!errors.issuedBy}
            className={errors.issuedBy ? 'border-danger focus-visible:ring-danger/50' : ''}
          />
          <FieldError errors={[{ message: errors.issuedBy }]} />
        </Field>

        <div>
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
            <CloudUpload className='text-primary mb-3 h-10 w-10' />
            {file ? (
              <p className='text-foreground text-sm font-semibold'>{file.name}</p>
            ) : (
              <>
                <p className='text-foreground text-sm font-semibold'>Upload Certificate</p>
                <p className='text-muted-foreground mt-1 text-xs'>PDF or image file</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type='file'
              accept='.pdf,.jpg,.jpeg,.png,.webp'
              className='hidden'
              onChange={(e) => handleFile(e.target.files)}
            />
          </div>
          <FieldError errors={[{ message: errors.file }]} />
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
  if (!value.certificateType) errors.certificateType = 'Please select a certificate type.';
  return errors;
}