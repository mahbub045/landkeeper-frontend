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
import {
  CERTIFICATE_TYPES,
  EMPTY_FORM,
} from '@/data/client/common/compliance/ComplianceData';
import {
  AddCertificateModalProps,
  CertificateForm,
} from '@/types/client/Common/Compliance/ComplianceTypes';

import { CloudUpload, Loader2 } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

const AddCertificateDialog: React.FC<AddCertificateModalProps> = ({
  open,
  onClose,
  onSuccess,
  properties = [],
}) => {
  const [loading, setLoading] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<CertificateForm>(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set(key: keyof CertificateForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ── File helpers ────────────────────────────────────────────────────────────
  function handleFile(incoming: FileList | null) {
    if (!incoming?.length) return;
    setFile(incoming[0]);
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files);
  }, []);

  // ── Reset ───────────────────────────────────────────────────────────────────
  function handleClose() {
    setBannerError(null);
    setFieldErrors({});
    setLoading(false);
    setForm(EMPTY_FORM);
    setFile(null);
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
            Add Certificate
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

          {/* Certificate Type */}
          <Field data-invalid={!!fieldErrors.certificateType}>
            <FieldLabel className='text-sm font-semibold'>
              Certificate Type
            </FieldLabel>
            <Select
              value={form.certificateType}
              onValueChange={(v) => set('certificateType', v)}
            >
              <SelectTrigger
                className={fieldErrors.certificateType ? 'border-danger' : ''}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CERTIFICATE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[{ message: fieldErrors.certificateType }]} />
          </Field>

          {/* Issue Date + Expiry Date */}
          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!fieldErrors.issueDate}>
              <FieldLabel className='text-sm font-semibold'>
                Issue Date
              </FieldLabel>
              <Input
                type='date'
                value={form.issueDate}
                onChange={(e) => set('issueDate', e.target.value)}
                aria-invalid={!!fieldErrors.issueDate}
                className={
                  fieldErrors.issueDate
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: fieldErrors.issueDate }]} />
            </Field>

            <Field data-invalid={!!fieldErrors.expiryDate}>
              <FieldLabel className='text-sm font-semibold'>
                Expiry Date
              </FieldLabel>
              <Input
                type='date'
                value={form.expiryDate}
                onChange={(e) => set('expiryDate', e.target.value)}
                aria-invalid={!!fieldErrors.expiryDate}
                className={
                  fieldErrors.expiryDate
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: fieldErrors.expiryDate }]} />
            </Field>
          </div>

          {/* Certificate Number */}
          <Field data-invalid={!!fieldErrors.certificateNumber}>
            <FieldLabel className='text-sm font-semibold'>
              Certificate Number
            </FieldLabel>
            <Input
              type='text'
              placeholder='e.g. CERT-2026-001'
              value={form.certificateNumber}
              onChange={(e) => set('certificateNumber', e.target.value)}
              aria-invalid={!!fieldErrors.certificateNumber}
              className={
                fieldErrors.certificateNumber
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: fieldErrors.certificateNumber }]} />
          </Field>

          {/* Issued By */}
          <Field data-invalid={!!fieldErrors.issuedBy}>
            <FieldLabel className='text-sm font-semibold'>Issued By</FieldLabel>
            <Input
              type='text'
              placeholder='Company or engineer name'
              value={form.issuedBy}
              onChange={(e) => set('issuedBy', e.target.value)}
              aria-invalid={!!fieldErrors.issuedBy}
              className={
                fieldErrors.issuedBy
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: fieldErrors.issuedBy }]} />
          </Field>

          {/* File upload */}
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
              fieldErrors.file
                ? 'border-danger bg-red-50 dark:bg-red-950/20'
                : dragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/40',
            ].join(' ')}
          >
            <CloudUpload className='text-primary mb-3 h-10 w-10' />
            {file ? (
              <p className='text-foreground text-sm font-semibold'>
                {file.name}
              </p>
            ) : (
              <>
                <p className='text-foreground text-sm font-semibold'>
                  Upload Certificate
                </p>
                <p className='text-muted-foreground mt-1 text-xs'>
                  PDF or image file
                </p>
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
        </div>

        {/* Footer */}
        <div className='flex shrink-0 items-center justify-end gap-3 border-t px-6 py-4'>
          <Button variant='outline' onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Add Certificate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCertificateDialog;
