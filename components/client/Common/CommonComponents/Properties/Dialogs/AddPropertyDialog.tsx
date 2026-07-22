'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Badge } from '@/components/ui/badge';
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
import { Textarea } from '@/components/ui/textarea';
import {
  EMPTY_DETAILS_FORM,
  FIELD_TAB_MAP,
  OVERRIDE_KEY_MAP,
  PROPERTY_STATUS_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  TAB_LABELS,
  TAB_PRIORITY,
  TABS,
} from '@/data/client/common/properties/PropertiesData';

import { useAddPropertiesMutation } from '@/store/api/endpoints/client/Common/Properties/PropertiesApi';
import {
  AddPropertyModalProps,
  DetailsForm,
  Tab,
} from '@/types/client/Common/Properties/PropertyTypes';
import { getCurrencySign, snakeToCamel } from '@/utils/formatters';

import { CloudUpload, Lock, Sparkles, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

// ── Modal ─────────────────────────────────────────────────────────────────────

const AddPropertyDialog: React.FC<AddPropertyModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('Details');
  const [loading, setLoading] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [details, setDetails] = useState<DetailsForm>(EMPTY_DETAILS_FORM);
  const [isNameCustom, setIsNameCustom] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const propertyIdRef = useRef<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // ── RTK Query ───────────────────────────────────────────────────────────────

  const [addProperty] = useAddPropertiesMutation();

  // ── Reset ───────────────────────────────────────────────────────────────────

  function handleClose() {
    setActiveTab('Details');
    setBannerError(null);
    setFieldErrors({});
    setLoading(false);
    setFiles([]);
    propertyIdRef.current = null;
    setDetails(EMPTY_DETAILS_FORM);
    setIsNameCustom(false);
    onClose();
  }

  // ── Shared API error handler ────────────────────────────────────────────────

  function handleApiError(body: unknown) {
    if (typeof body === 'object' && body !== null) {
      const apiError = body as Record<string, unknown>;
      const normalized: Record<string, string> = {};

      Object.entries(apiError).forEach(([key, val]) => {
        if (key === 'message') return;
        const mapped = OVERRIDE_KEY_MAP[key] ?? snakeToCamel(key);
        normalized[mapped] = Array.isArray(val) ? val[0] : String(val);
      });

      if (Object.keys(normalized).length > 0) {
        setFieldErrors(normalized);
        const targetTab = TAB_PRIORITY.find((tab) =>
          Object.keys(normalized).some((field) => FIELD_TAB_MAP[field] === tab),
        );
        if (targetTab) setActiveTab(targetTab);
        toast.error('Please fix the highlighted fields and try again.');
        return;
      }

      if (typeof apiError.message === 'string') {
        toast.error(apiError.message);
        return;
      }
    }
    toast.error('Something went wrong. Please try again.');
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBannerError(null);
    setFieldErrors({});

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('property_name', details.name);
      formData.append('property_type', details.type);
      formData.append('status', details.status);
      formData.append('address', details.address);
      formData.append('purchase_price', details.purchasePrice);
      formData.append('current_value', details.currentValue);
      formData.append('rent_per_month', details.rentPerMonth);
      formData.append('purchase_date', details.purchaseDate);
      formData.append('bedrooms', details.bedrooms);
      formData.append('bathrooms', details.bathrooms);
      formData.append('notes', details.notes);
      files.forEach((file) => formData.append('documents_data', file));

      await addProperty(formData).unwrap();
      toast.success('Property added successfully.');
      onSuccess?.();
      handleClose();
    } catch (err: unknown) {
      const rtkError = err as { data?: unknown };
      if (rtkError?.data) {
        handleApiError(rtkError.data);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  // ── File helpers ────────────────────────────────────────────────────────────

  function addFiles(incoming: FileList | null) {
    if (!incoming) return;
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      return [
        ...prev,
        ...Array.from(incoming).filter((f) => !existing.has(f.name + f.size)),
      ];
    });
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className='flex max-h-[90vh] w-full flex-col overflow-hidden p-0 sm:max-w-185'
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader className='shrink-0 border-b px-6 pt-6 pb-0'>
          <DialogTitle className='text-foreground text-xl font-bold'>
            Add New Property
          </DialogTitle>
          <DialogDescription>
            Add a new property to the system.
          </DialogDescription>

          {/* Tabs */}
          <div className='flex gap-6'>
            {TABS.map((tab) => {
              const hasError = Object.keys(fieldErrors).some(
                (f) => FIELD_TAB_MAP[f] === tab,
              );
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={[
                    'cursor-pointer pb-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-primary border-primary border-b-2'
                      : hasError
                        ? 'text-danger'
                        : 'text-muted-foreground hover:text-foreground',
                  ].join(' ')}
                >
                  {TAB_LABELS[tab]}
                  {hasError && !isActive && (
                    <span className='bg-danger ml-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle' />
                  )}
                </button>
              );
            })}
          </div>
        </DialogHeader>

        {/* Scrollable body */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className='flex-1 overflow-y-auto px-6 py-5'
        >
          {bannerError && (
            <p className='text-danger mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm dark:border-red-900/40 dark:bg-red-950/30'>
              {bannerError}
            </p>
          )}

          {activeTab === 'Details' && (
            <DetailsTab
              form={details}
              onChange={setDetails}
              errors={fieldErrors}
              isNameCustom={isNameCustom}
              onToggleNameCustom={setIsNameCustom}
            />
          )}
          {activeTab === 'Property Picture' && (
            <PropertyPictureTab
              files={files}
              dragging={dragging}
              fileInputRef={fileInputRef}
              errors={fieldErrors}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onFileChange={(e) => addFiles(e.target.files)}
              onRemove={removeFile}
            />
          )}

          <div className='flex shrink-0 items-center justify-end gap-3 border-t px-6 py-4'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            {activeTab === 'Details' ? (
              <Button
                key='next-btn'
                type='button'
                onClick={() => {
                  if (formRef.current?.reportValidity()) {
                    setActiveTab('Property Picture');
                  }
                }}
                disabled={loading}
              >
                Next
              </Button>
            ) : (
              <Button key='submit-btn' type='submit' disabled={loading}>
                {loading && <Loading className='text-white!' />}
                Add Property
              </Button>
            )}
          </div>
        </form>

        {/* Footer */}
      </DialogContent>
    </Dialog>
  );
};

export default AddPropertyDialog;

// ── Details Tab ───────────────────────────────────────────────────────────────

const DetailsTab: React.FC<{
  form: DetailsForm;
  onChange: (f: DetailsForm) => void;
  errors: Record<string, string>;
  isNameCustom: boolean;
  onToggleNameCustom: (v: boolean) => void;
}> = ({ form, onChange, errors, isNameCustom, onToggleNameCustom }) => {
  function set(key: keyof DetailsForm, value: string) {
    onChange({ ...form, [key]: value });
  }

  // Auto-fill the property name from the address whenever the address
  // changes, unless the user has opted into custom (manual) naming.
  useEffect(() => {
    if (isNameCustom) return;
    const derived = form.address;
    if (derived !== form.name) {
      onChange({ ...form, name: derived });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.address, isNameCustom]);

  function handleToggleCustom() {
    if (isNameCustom) {
      // Switching back to auto: re-derive immediately from current address.
      onToggleNameCustom(false);
      onChange({ ...form, name: form.address });
    } else {
      onToggleNameCustom(true);
    }
  }

  return (
    <div className='space-y-5'>
      <div className='flex justify-center'>
        <div className='border-primary/15 from-primary/10 via-primary/5 w-full rounded-xl border bg-linear-to-br to-transparent p-4'>
          <Field data-invalid={!!errors.name}>
            <div className='mb-1.5 flex items-center justify-between'>
              <FieldLabel className='gap-1.5 text-sm font-semibold'>
                Property Name<span className='text-danger'>*</span>
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
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                readOnly={!isNameCustom}
                aria-invalid={!!errors.name}
                required
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

            {!isNameCustom && (
              <p className='text-muted-foreground mt-1.5 text-xs leading-relaxed'>
                Derived from your address. Tap{' '}
                <span className='text-primary font-medium'>Edit manually</span>{' '}
                to set a custom name.
              </p>
            )}
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
          value={form.address}
          onChange={(e) => set('address', e.target.value)}
          aria-invalid={!!errors.address}
          required
          className={
            errors.address ? 'border-danger focus-visible:ring-danger/50' : ''
          }
        />
        <FieldError errors={[{ message: errors.address }]} />
      </Field>

      <div className='grid grid-cols-2 gap-4'>
        <Field data-invalid={!!errors.type}>
          <FieldLabel className='text-sm font-semibold'>
            Property Type
          </FieldLabel>
          <Select value={form.type} onValueChange={(v) => set('type', v)}>
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
          <Select value={form.status} onValueChange={(v) => set('status', v)}>
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
            value={form.purchasePrice}
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
            value={form.currentValue}
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
            value={form.rentPerMonth}
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
            value={form.purchaseDate}
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
          <FieldLabel className='text-sm font-semibold'>Bedrooms</FieldLabel>
          <Input
            type='number'
            value={form.bedrooms}
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
          <FieldLabel className='text-sm font-semibold'>Bathrooms</FieldLabel>
          <Input
            type='number'
            value={form.bathrooms}
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
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          aria-invalid={!!errors.notes}
          className={
            errors.notes ? 'border-danger focus-visible:ring-danger/50' : ''
          }
        />
        <FieldError errors={[{ message: errors.notes }]} />
      </Field>
    </div>
  );
};

// ── Property Picture Tab ─────────────────────────────────────────────────────

const PropertyPictureTab: React.FC<{
  files: File[];
  dragging: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  errors: Record<string, string>;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (i: number) => void;
}> = ({
  files,
  dragging,
  fileInputRef,
  errors,
  onDrop,
  onDragOver,
  onDragLeave,
  onFileChange,
  onRemove,
}) => {
  return (
    <div className='space-y-4'>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
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
          onChange={onFileChange}
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
                variant='ghost'
                size='icon'
                onClick={() => onRemove(i)}
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
  );
};
