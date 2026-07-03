'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Badge } from '@/components/ui/badge';
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
import { Textarea } from '@/components/ui/textarea';
import {
  FIELD_TAB_MAP,
  TAB_PRIORITY,
  TABS,
} from '@/data/client/common/properties/PropertiesData';
import { useUpdatePropertyMutation } from '@/store/api/endpoints/client/Common/Properties/PropertiesApi';
import {
  DetailsForm,
  PropertyDocument,
  Tab,
  UpdatePropertyModalProps,
} from '@/types/client/Common/Properties/PropertyTypes';
import { getCurrencySign } from '@/utils/formatters';
import { CloudUpload, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert API status string → form select value */
function apiStatusToForm(status: string): string {
  const map: Record<string, string> = {
    OCCUPIED: 'Occupied',
    VACANT: 'Vacant',
    UNDER_MAINTENANCE: 'UNDER_MAINTENANCE',
  };
  return map[status] ?? status;
}

/** Convert API property_type string → form select value */
function apiTypeToForm(type: string): string {
  const map: Record<string, string> = {
    RESIDENTIAL: 'Residential',
    HMO: 'HMO',
    COMMERCIAL: 'Commercial',
    MIXED_USE: 'MIXED_USE',
    HOLIDAY_LET: 'HOLIDAY_LET',
  };
  return map[type] ?? type;
}

/** Strip trailing zeros — turns "1000000.00" → "1000000" */
function cleanDecimal(val: string | null | undefined): string {
  if (!val) return '';
  const n = parseFloat(val);
  return isNaN(n) ? '' : String(n);
}

// ─── Main Component ───────────────────────────────────────────────────────────

const UpdatePropertyDialog: React.FC<UpdatePropertyModalProps> = ({
  open,
  onClose,
  onSuccess,
  property,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('Details');
  const [loading, setLoading] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // ── Initialise form from property prop ─────────────────────────────────────

  const buildInitialDetails = (): DetailsForm => ({
    name: property?.property_name ?? '',
    type: apiTypeToForm(property?.property_type ?? 'Residential'),
    status: apiStatusToForm(property?.status ?? 'Vacant'),
    address: property?.address ?? '',
    purchasePrice: cleanDecimal(property?.purchase_price),
    currentValue: cleanDecimal(property?.current_value),
    rent_per_month: cleanDecimal(property?.rent_per_month),
    purchaseDate: property?.purchase_date ?? '',
    bedrooms: property?.bedrooms != null ? String(property.bedrooms) : '',
    bathrooms: property?.bathrooms != null ? String(property.bathrooms) : '',
    notes: property?.notes ?? '',
  });

  const [details, setDetails] = useState<DetailsForm>(buildInitialDetails);
  const [existingDocs, setExistingDocs] = useState<PropertyDocument[]>(
    property?.documents ?? [],
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track which property alias is currently seeded into local state.
  // Using useState so the comparison is safe during render (useRef.current
  // cannot be read during render per React's rules).
  // When open flips true or the property alias changes we reset synchronously.
  // This is the pattern React docs recommend for deriving state from props:
  // https://react.dev/reference/react/useState#storing-information-from-previous-renders
  const [seededAlias, setSeededAlias] = useState<string | null>(null);
  const incomingAlias = open ? (property?.alias ?? null) : null;
  const [cachedExistingFiles, setCachedExistingFiles] = useState<File[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);

  if (incomingAlias !== seededAlias) {
    setSeededAlias(incomingAlias);
    if (incomingAlias !== null) {
      setDetails(buildInitialDetails());
      setExistingDocs(property?.documents ?? []);
      setNewFiles([]);
      setCachedExistingFiles([]); // ← add this
      setActiveTab('Details');
      setBannerError(null);
      setFieldErrors({});
    }
  }

  useEffect(() => {
    if (!open || !property?.documents?.length) return;

    let cancelled = false;

    const prefetch = async () => {
      setDocsLoading(true);
      try {
        const files = await Promise.all(
          property.documents.map(async (doc) => {
            const res = await fetch(
              `/api/proxy-image?url=${encodeURIComponent(doc.image)}`,
            );
            const blob = await res.blob();
            const filename =
              doc.image.split('/').pop() ||
              doc.description ||
              `document-${doc.id}`;
            return new File([blob], filename, { type: blob.type });
          }),
        );
        if (!cancelled) setCachedExistingFiles(files);
      } finally {
        if (!cancelled) setDocsLoading(false);
      }
    };

    prefetch();

    return () => {
      cancelled = true;
    };
  }, [open, property?.alias, property?.documents]);

  // ── RTK Query ───────────────────────────────────────────────────────────────

  const [updateProperty] = useUpdatePropertyMutation();

  // ── Validation ──────────────────────────────────────────────────────────────

  function validate(): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!details.name.trim()) {
      errors.name = 'Property name is required';
    }
    if (!details.address.trim()) {
      errors.address = 'Address is required';
    }

    return errors;
  }

  // ── Shared error handler (mirrors AddPropertyDialog) ───────────────────────

  function handleApiError(body: unknown) {
    if (typeof body === 'object' && body !== null) {
      const apiError = body as Record<string, unknown>;

      const keyMap: Record<string, string> = {
        purchase_price: 'purchasePrice',
        current_value: 'currentValue',
        purchase_date: 'purchaseDate',
        property_name: 'name',
        property_type: 'type',
        rent_per_month: 'rent_per_month',
        address: 'address',
        bedrooms: 'bedrooms',
        bathrooms: 'bathrooms',
        notes: 'notes',
      };

      const normalized: Record<string, string> = {};
      Object.entries(apiError).forEach(([key, val]) => {
        if (key === 'message') return;
        const mapped = keyMap[key] ?? key;
        normalized[mapped] = Array.isArray(val) ? val[0] : String(val);
      });

      if (Object.keys(normalized).length > 0) {
        setFieldErrors(normalized);
        const targetTab = TAB_PRIORITY.find((tab) =>
          Object.keys(normalized).some((field) => FIELD_TAB_MAP[field] === tab),
        );
        if (targetTab) setActiveTab(targetTab);
        setBannerError('Please fix the highlighted fields and try again.');
        return;
      }

      if (typeof apiError.message === 'string') {
        setBannerError(apiError.message);
        return;
      }
    }
    setBannerError('Something went wrong. Please try again.');
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (!property?.alias) return;

    const errors = validate();

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const targetTab = TAB_PRIORITY.find((tab) =>
        Object.keys(errors).some((field) => FIELD_TAB_MAP[field] === tab),
      );
      if (targetTab) setActiveTab(targetTab);
      setBannerError('Please fix the highlighted fields and try again.');
      return;
    }

    setBannerError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('property_name', details.name);
      formData.append('property_type', details.type.toUpperCase());
      formData.append('status', details.status.toUpperCase());
      formData.append('address', details.address);
      formData.append('purchase_price', details.purchasePrice);
      formData.append('current_value', details.currentValue);
      formData.append('rent_per_month', details.rent_per_month);
      formData.append('purchase_date', details.purchaseDate);
      formData.append('bedrooms', details.bedrooms);
      formData.append('bathrooms', details.bathrooms);
      formData.append('notes', details.notes);

      const seen = new Set<string>();
      const filesToKeep = cachedExistingFiles.filter((file) => {
        if (seen.has(file.name)) return false;
        seen.add(file.name);
        return existingDocs.some(
          (doc) => doc.image.split('/').pop() === file.name,
        );
      });

      console.log(
        'filesToKeep',
        filesToKeep.map((f) => f.name),
      );
      console.log(
        'existingDocs at submit',
        existingDocs.map((d) => d.image.split('/').pop()),
      );

      filesToKeep.forEach((file) => formData.append('documents_data', file));
      newFiles.forEach((file) => formData.append('documents_data', file));

      await updateProperty({
        property_alias: property.alias,
        payload: formData,
      }).unwrap();

      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const rtkError = err as { data?: unknown };
      if (rtkError?.data) {
        handleApiError(rtkError.data);
      } else {
        setBannerError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  // ── File helpers ────────────────────────────────────────────────────────────

  function addFiles(incoming: FileList | null) {
    if (!incoming) return;
    setNewFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      return [
        ...prev,
        ...Array.from(incoming).filter((f) => !existing.has(f.name + f.size)),
      ];
    });
  }

  function removeNewFile(index: number) {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function removeExistingDoc(id: number) {
    setExistingDocs((prev) => prev.filter((d) => d.id !== id));
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='flex max-h-[90vh] w-full flex-col overflow-hidden p-0 sm:max-w-185'>
        {/* Header */}
        <DialogHeader className='shrink-0 border-b px-6 pt-6 pb-0'>
          <div className='flex items-center justify-between pb-4'>
            <DialogTitle className='text-foreground text-xl font-bold'>
              Edit Property
            </DialogTitle>
          </div>

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
                  type='button'
                  onClick={() => setActiveTab(tab)}
                  className={[
                    'pb-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-primary border-primary border-b-2'
                      : hasError
                        ? 'text-danger'
                        : 'text-muted-foreground hover:text-foreground',
                  ].join(' ')}
                >
                  {tab}
                  {hasError && !isActive && (
                    <span className='bg-danger ml-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle' />
                  )}
                </button>
              );
            })}
          </div>
        </DialogHeader>

        {/* Scrollable body */}
        <div className='flex-1 overflow-y-auto px-6 py-5'>
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
            />
          )}

          {activeTab === 'Documents' && (
            <DocumentsTab
              existingDocs={existingDocs}
              newFiles={newFiles}
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
              onRemoveExisting={removeExistingDoc}
              onRemoveNew={removeNewFile}
            />
          )}
        </div>

        {/* Footer */}
        <div className='flex shrink-0 items-center justify-end gap-3 border-t px-6 py-4'>
          <Button variant='outline' onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          {activeTab === 'Details' ? (
            <Button
              onClick={() => setActiveTab('Documents')}
              disabled={loading}
            >
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading || docsLoading}>
              {loading && <Loading className='text-white!' />}
              Update
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePropertyDialog;

// ── Details Tab ───────────────────────────────────────────────────────────────

const DetailsTab: React.FC<{
  form: DetailsForm;
  onChange: (f: DetailsForm) => void;
  errors: Record<string, string>;
}> = ({ form, onChange, errors }) => {
  function set(key: keyof DetailsForm, value: string) {
    onChange({ ...form, [key]: value });
  }

  return (
    <div className='space-y-5'>
      <Field data-invalid={!!errors.name}>
        <FieldLabel className='gap-0 text-sm font-semibold'>
          Property Name<span className='text-danger'>*</span>
        </FieldLabel>
        <Input
          type='text'
          placeholder='e.g. 14 Oak Street'
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          aria-invalid={!!errors.name}
          className={
            errors.name ? 'border-danger focus-visible:ring-danger/50' : ''
          }
        />
        <FieldError errors={[{ message: errors.name }]} />
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
              <SelectItem value='Residential'>Residential</SelectItem>
              <SelectItem value='HMO'>HMO</SelectItem>
              <SelectItem value='Commercial'>Commercial</SelectItem>
              <SelectItem value='MIXED_USE'>Mixed Use</SelectItem>
              <SelectItem value='HOLIDAY_LET'>Holiday Let</SelectItem>
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
              <SelectItem value='Occupied'>Occupied</SelectItem>
              <SelectItem value='Vacant'>Vacant</SelectItem>
              <SelectItem value='UNDER_MAINTENANCE'>
                Under Maintenance
              </SelectItem>
            </SelectContent>
          </Select>
          <FieldError errors={[{ message: errors.status }]} />
        </Field>
      </div>

      <Field data-invalid={!!errors.address}>
        <FieldLabel className='gap-0 text-sm font-semibold'>
          Address<span className='text-danger'>*</span>
        </FieldLabel>
        <Input
          type='text'
          placeholder='Full address'
          value={form.address}
          onChange={(e) => set('address', e.target.value)}
          aria-invalid={!!errors.address}
          className={
            errors.address ? 'border-danger focus-visible:ring-danger/50' : ''
          }
        />
        <FieldError errors={[{ message: errors.address }]} />
      </Field>

      <div className='grid grid-cols-2 gap-4'>
        <Field data-invalid={!!errors.purchasePrice}>
          <FieldLabel className='text-sm font-semibold'>
            Purchase Price
          </FieldLabel>
          <Input
            type='number'
            placeholder={getCurrencySign()}
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
        <Field data-invalid={!!errors.rent_per_month}>
          <FieldLabel className='text-sm font-semibold'>
            Rent Per Month
          </FieldLabel>
          <Input
            type='number'
            placeholder={getCurrencySign()}
            value={form.rent_per_month}
            onChange={(e) => set('rent_per_month', e.target.value)}
            aria-invalid={!!errors.rent_per_month}
            className={
              errors.rent_per_month
                ? 'border-danger focus-visible:ring-danger/50'
                : ''
            }
          />
          <FieldError errors={[{ message: errors.rent_per_month }]} />
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

// ── Documents Tab ─────────────────────────────────────────────────────────────

const DocumentsTab: React.FC<{
  existingDocs: PropertyDocument[];
  newFiles: File[];
  dragging: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  errors: Record<string, string>;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveExisting: (id: number) => void;
  onRemoveNew: (i: number) => void;
}> = ({
  existingDocs,
  newFiles,
  dragging,
  fileInputRef,
  errors,
  onDrop,
  onDragOver,
  onDragLeave,
  onFileChange,
  onRemoveExisting,
  onRemoveNew,
}) => {
  return (
    <div className='space-y-4'>
      {/* ── Existing Documents ── */}
      {existingDocs.length > 0 && (
        <div className='space-y-2'>
          <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
            Existing Documents
          </p>
          <ul className='space-y-2'>
            {existingDocs.map((doc) => (
              <li
                key={doc.id}
                className='bg-muted flex items-center gap-3 rounded-md px-3 py-2'
              >
                {/* Thumbnail */}
                <div className='relative h-10 w-14 shrink-0 overflow-hidden rounded'>
                  <Image
                    src={doc.image}
                    alt={doc.description ?? `Document ${doc.id}`}
                    fill
                    className='object-cover'
                    sizes='56px'
                  />
                </div>

                <span className='text-foreground min-w-0 flex-1 truncate text-sm'>
                  {doc.description ?? `Document ${doc.id}`}
                </span>

                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => onRemoveExisting(doc.id)}
                  className='text-muted-foreground hover:text-danger ml-auto h-6 w-6 shrink-0'
                  aria-label='Remove document'
                >
                  <X className='h-4 w-4' />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Upload Zone ── */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={[
          'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 transition-colors',
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

      {/* ── New Files ── */}
      {newFiles.length > 0 && (
        <div className='space-y-2'>
          <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
            New Uploads
          </p>
          <ul className='space-y-2'>
            {newFiles.map((file, i) => (
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
                  onClick={() => onRemoveNew(i)}
                  className='text-muted-foreground hover:text-danger ml-2 h-6 w-6 shrink-0'
                  aria-label='Remove file'
                >
                  <X className='h-4 w-4' />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
