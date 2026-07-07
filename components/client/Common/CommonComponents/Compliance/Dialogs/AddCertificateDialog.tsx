'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  CERTIFICATE_OPTIONS,
  EMPTY_FORM,
} from '@/data/client/common/compliance/ComplianceData';
import { cn } from '@/lib/utils';
import { useAddCompliancesMutation } from '@/store/api/endpoints/client/Common/Compliance/ComplianceApi';
import { useFilterPropertiesQuery } from '@/store/api/endpoints/client/Common/Filters/FilterPropertiesApi';
import {
  AddCertificateModalProps,
  CertificateForm,
} from '@/types/client/Common/Compliance/ComplianceTypes';
import { Property } from '@/types/client/Common/Properties/PropertyTypes';
import { snakeToCamel } from '@/utils/formatters';
import { CloudUpload, Loader2 } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

const AddCertificateDialog: React.FC<AddCertificateModalProps> = ({
  open,
  onClose,
  onSuccess,
  properties = [],
}) => {
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<CertificateForm>(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [propertyOpen, setPropertyOpen] = useState(false);
  const [propertySearch, setPropertySearch] = useState('');

  function set(key: keyof CertificateForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ── RTK Queries ────────────────────────────────────────────────────────────

  const { data, isLoading } = useFilterPropertiesQuery(
    propertySearch ? { search: propertySearch } : {},
    { skip: !propertyOpen },
  );

  const [addCompliance, { isLoading: loading }] = useAddCompliancesMutation();

  // ── File helpers ────────────────────────────────────────────────────────────

  function handleFile(incoming: FileList | null) {
    if (!incoming?.length) return;
    setFile(incoming[0]);
    setFieldErrors((prev) => ({ ...prev, file: '' }));
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
    setForm(EMPTY_FORM);
    setFile(null);
    onClose();
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBannerError(null);

    // Manual guards for non-native controls (shadcn Select + custom file drop zone),
    // native `required` doesn't validate these.
    const guardErrors: Record<string, string> = {};
    if (!form.certificateType)
      guardErrors.certificateType = 'Please select a certificate type.';
    // if (!file) guardErrors.file = 'Please upload a certificate file.';

    if (Object.keys(guardErrors).length > 0) {
      setFieldErrors(guardErrors);
      return;
    }
    setFieldErrors({});

    try {
      const formData = new FormData();
      formData.append('property', form.propertyId);
      formData.append('certificate_type', form.certificateType);
      formData.append('issue_date', form.issueDate);
      formData.append('expiry_date', form.expiryDate);
      formData.append('certificate_number', form.certificateNumber);
      formData.append('issued_by', form.issuedBy);
      if (file) formData.append('certificate_file', file);

      await addCompliance(formData).unwrap();
      onSuccess?.();
      handleClose();
    } catch (err: unknown) {
      const data = (
        err as {
          data?: Record<string, unknown> & {
            detail?: string;
            message?: string;
          };
        }
      )?.data;

      if (data && typeof data === 'object') {
        const mapped: Record<string, string> = {};
        let hasFieldErrors = false;

        for (const [backendKey, value] of Object.entries(data)) {
          if (backendKey === 'detail' || backendKey === 'message') continue;
          const formKey =
            backendKey === 'certificate_file'
              ? 'file'
              : snakeToCamel(backendKey);
          mapped[formKey] = Array.isArray(value) ? value[0] : (value as string);
          hasFieldErrors = true;
        }

        if (hasFieldErrors) {
          setFieldErrors(mapped);
        } else {
          setBannerError(
            data?.detail ??
              data?.message ??
              'Something went wrong. Please try again.',
          );
        }
      } else {
        setBannerError('Something went wrong. Please try again.');
      }
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className='flex max-h-[90vh] w-full flex-col overflow-hidden p-0 sm:max-w-185'
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader className='shrink-0 border-b px-6 pt-6 pb-5'>
          <DialogTitle className='text-foreground text-xl font-bold'>
            Add Certificate
          </DialogTitle>
          <DialogDescription className='text-muted-foreground mt-1 text-sm'>
            Add a new certificate to the system.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable body */}
        <form
          onSubmit={handleSubmit}
          className='flex-1 space-y-5 overflow-y-auto px-6 py-5'
        >
          {bannerError && (
            <p className='text-danger rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm dark:border-red-900/40 dark:bg-red-950/30'>
              {bannerError}
            </p>
          )}

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
                  set('propertyId', '');
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
                required
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

          {/* Certificate Type */}
          <Field data-invalid={!!fieldErrors.certificateType}>
            <FieldLabel className='gap-0 text-sm font-semibold'>
              Certificate Type<span className='text-danger'>*</span>
            </FieldLabel>
            <Select
              value={form.certificateType}
              onValueChange={(v) => {
                set('certificateType', v);
                setFieldErrors((prev) => ({ ...prev, certificateType: '' }));
              }}
            >
              <SelectTrigger
                aria-invalid={!!fieldErrors.certificateType}
                className={
                  fieldErrors.certificateType
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
            <FieldError errors={[{ message: fieldErrors.certificateType }]} />
          </Field>

          {/* Issue Date + Expiry Date */}
          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!fieldErrors.issueDate}>
              <FieldLabel className='gap-0 text-sm font-semibold'>
                Issue Date<span className='text-danger'>*</span>
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
                required
              />
              <FieldError errors={[{ message: fieldErrors.issueDate }]} />
            </Field>

            <Field data-invalid={!!fieldErrors.expiryDate}>
              <FieldLabel className='gap-0 text-sm font-semibold'>
                Expiry Date<span className='text-danger'>*</span>
              </FieldLabel>
              <Input
                type='date'
                value={form.expiryDate}
                min={form.issueDate || undefined}
                onChange={(e) => set('expiryDate', e.target.value)}
                aria-invalid={!!fieldErrors.expiryDate}
                className={
                  fieldErrors.expiryDate
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
                required
              />
              <FieldError errors={[{ message: fieldErrors.expiryDate }]} />
            </Field>
          </div>

          {/* Certificate Number */}
          <Field data-invalid={!!fieldErrors.certificateNumber}>
            <FieldLabel className='gap-0 text-sm font-semibold'>
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
            <FieldLabel className='gap-0 text-sm font-semibold'>
              Issued By
            </FieldLabel>
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
            <FieldError errors={[{ message: fieldErrors.file }]} />
          </div>

          <div className='flex shrink-0 items-center justify-end gap-3 border-t px-6 py-4'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={loading}>
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Add Certificate
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCertificateDialog;
