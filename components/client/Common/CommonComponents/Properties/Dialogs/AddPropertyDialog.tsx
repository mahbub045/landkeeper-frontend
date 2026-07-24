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
  PROPERTY_OWNER_OPTIONS,
  PROPERTY_STATUS_OPTIONS,
  PROPERTY_TENURE_OPTIONS,
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

import { CloudUpload, Lock, Plus, Sparkles, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

// ── Modal ─────────────────────────────────────────────────────────────────────

const AddPropertyDialog: React.FC<AddPropertyModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('Details');
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

  const [addProperty, { isLoading }] = useAddPropertiesMutation();

  // ── Reset ───────────────────────────────────────────────────────────────────

  function handleClose() {
    setActiveTab('Details');
    setBannerError(null);
    setFieldErrors({});
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

    try {
      const formData = new FormData();
      formData.append('property_name', details.property_name);
      formData.append('address', details.address);
      formData.append('property_owner', details.property_owner);
      formData.append('company_name', details.company_name);

      // ── Shareholder / Owner rows ────────────────────────────────────────────
      // The API expects indexed form fields (shareholder[i].field), not a
      // single JSON blob. Each row is either an "owner" row (OWNER flow) or a
      // "shareholder" row (COMPANY flow) — only append whichever keys exist.
      details.shareholder.forEach((item, i) => {
        if ('owner_name' in item && item.owner_name !== undefined) {
          formData.append(`shareholder[${i}].owner_name`, item.owner_name);
        }
        if ('shareholder_name' in item && item.shareholder_name !== undefined) {
          formData.append(
            `shareholder[${i}].shareholder_name`,
            item.shareholder_name,
          );
        }
        if ('share_percentage' in item && item.share_percentage !== undefined) {
          formData.append(
            `shareholder[${i}].share_percentage`,
            item.share_percentage,
          );
        }
      });

      formData.append('property_type', details.property_type);
      formData.append('status', details.status);

      // ── Optional fields ──────────────────────────────────────────────────
      // DRF rejects '' for IntegerField/DateField/DecimalField ("A valid
      // integer is required.", "Date has wrong format."). Omit the key
      // entirely when blank so the backend treats it as null instead.
      const appendIfPresent = (key: string, value: string) => {
        if (value !== '' && value !== null && value !== undefined) {
          formData.append(key, value);
        }
      };

      appendIfPresent('purchase_price', details.purchase_price);
      appendIfPresent('current_value', details.current_value);
      appendIfPresent('monthly_rental_income', details.monthly_rental_income);
      appendIfPresent('purchase_date', details.purchase_date);
      appendIfPresent('bedrooms', details.bedrooms);
      appendIfPresent('bathrooms', details.bathrooms);
      appendIfPresent('year_built', details.year_built);
      appendIfPresent('property_tenure', details.property_tenure);
      appendIfPresent('remaining_lease_term', details.remaining_lease_term);
      appendIfPresent('monthly_service_charge', details.monthly_service_charge);
      appendIfPresent('annual_ground_rent', details.annual_ground_rent);
      appendIfPresent('council_tax_band', details.council_tax_band);
      appendIfPresent('local_authority', details.local_authority);
      appendIfPresent('notes', details.notes);
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
              disabled={isLoading}
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
                disabled={isLoading}
              >
                Next
              </Button>
            ) : (
              <Button key='submit-btn' type='submit' disabled={isLoading}>
                {isLoading && <Loading className='text-white!' />}
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
    if (derived !== form.property_name) {
      onChange({ ...form, property_name: derived });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.address, isNameCustom]);

  function handleToggleCustom() {
    if (isNameCustom) {
      // Switching back to auto: re-derive immediately from current address.
      onToggleNameCustom(false);
      onChange({ ...form, property_name: form.address });
    } else {
      onToggleNameCustom(true);
    }
  }

  // ── Owners (property_owner === 'OWNER') ─────────────────────────────────────

  function addOwner() {
    onChange({
      ...form,
      shareholder: [...form.shareholder, { owner_name: '' }],
    });
  }

  function updateOwner(index: number, value: string) {
    onChange({
      ...form,
      shareholder: form.shareholder.map((o, i) =>
        i === index ? { ...o, owner_name: value } : o,
      ),
    });
  }

  function removeOwner(index: number) {
    onChange({
      ...form,
      shareholder: form.shareholder.filter((_, i) => i !== index),
    });
  }

  // ── Shareholders (property_owner === 'COMPANY') ─────────────────────────────

  function addShareholder() {
    onChange({
      ...form,
      shareholder: [
        ...form.shareholder,
        { shareholder_name: '', share_percentage: '' },
      ],
    });
  }

  function updateShareholder(
    index: number,
    key: 'shareholder_name' | 'share_percentage',
    value: string,
  ) {
    onChange({
      ...form,
      shareholder: form.shareholder.map((s, i) =>
        i === index ? { ...s, [key]: value } : s,
      ),
    });
  }

  function removeShareholder(index: number) {
    onChange({
      ...form,
      shareholder: form.shareholder.filter((_, i) => i !== index),
    });
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
                value={form.property_name}
                onChange={(e) => set('property_name', e.target.value)}
                readOnly={!isNameCustom}
                aria-invalid={!!errors.property_name}
                required
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

            {!isNameCustom && (
              <p className='text-muted-foreground mt-1.5 text-xs leading-relaxed'>
                Derived from your address. Tap{' '}
                <span className='text-primary font-medium'>Edit manually</span>{' '}
                to set a custom name.
              </p>
            )}
            <FieldError errors={[{ message: errors.property_name }]} />
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

      <Field data-invalid={!!errors.property_owner}>
        <div className='flex items-end justify-between gap-4'>
          <div className='flex-1'>
            <FieldLabel className='text-sm font-semibold'>
              Property Owner
            </FieldLabel>
            <Select
              value={form.property_owner}
              onValueChange={(v) => set('property_owner', v)}
            >
              <SelectTrigger
                className={errors.property_owner ? 'border-danger' : ''}
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
          </div>

          {form.property_owner === 'OWNER' && (
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

          {form.property_owner === 'COMPANY' && (
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
        <FieldError errors={[{ message: errors.property_owner }]} />
      </Field>

      {form.property_owner === 'OWNER' && (
        <Field data-invalid={!!errors.ownerships}>
          {form.shareholder.length > 0 && (
            <div className='space-y-2'>
              {form.shareholder.map((owner, i) => (
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

      {form.property_owner === 'COMPANY' && (
        <Field data-invalid={!!errors.company_name}>
          <FieldLabel className='text-sm font-semibold'>
            Company Name<span className='text-danger'>*</span>
          </FieldLabel>
          <Input
            type='text'
            placeholder='Company name'
            value={form.company_name}
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

      {form.property_owner === 'COMPANY' && (
        <Field data-invalid={!!errors.shareholder}>
          {form.shareholder.length > 0 && (
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

              {form.shareholder.map((sh, i) => (
                <div key={i} className='flex items-center gap-2'>
                  <div className='grid flex-1 grid-cols-1 gap-2 lg:grid-cols-2'>
                    <Input
                      type='text'
                      placeholder='Shareholder name'
                      value={sh.shareholder_name}
                      onChange={(e) =>
                        updateShareholder(i, 'shareholder_name', e.target.value)
                      }
                    />
                    <Input
                      type='number'
                      placeholder='% share'
                      value={sh.share_percentage}
                      onChange={(e) =>
                        updateShareholder(i, 'share_percentage', e.target.value)
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
            value={form.property_type}
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
            value={form.purchase_price}
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
            value={form.current_value}
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
            value={form.monthly_rental_income}
            onChange={(e) => set('monthly_rental_income', e.target.value)}
            aria-invalid={!!errors.monthly_rental_income}
            className={
              errors.monthly_rental_income
                ? 'border-danger focus-visible:ring-danger/50'
                : ''
            }
          />
          <FieldError errors={[{ message: errors.rent_per_month }]} />
        </Field>

        <Field data-invalid={!!errors.purchase_date}>
          <FieldLabel className='text-sm font-semibold'>
            Purchase Date
          </FieldLabel>
          <Input
            type='date'
            value={form.purchase_date}
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
          <FieldLabel className='text-sm font-semibold'>Bedrooms</FieldLabel>
          <Input
            type='number'
            value={form.bedrooms}
            onChange={(e) => set('bedrooms', e.target.value)}
            aria-invalid={!!errors.bedrooms}
            placeholder='e.g. 3'
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
            placeholder='e.g. 2'
            className={
              errors.bathrooms
                ? 'border-danger focus-visible:ring-danger/50'
                : ''
            }
          />
          <FieldError errors={[{ message: errors.bathrooms }]} />
        </Field>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <Field data-invalid={!!errors.year_built}>
          <FieldLabel className='text-sm font-semibold'>Year Built</FieldLabel>
          <Input
            type='number'
            value={form.year_built}
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
            value={form.property_tenure}
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

      {form.property_tenure === 'LEASEHOLD' && (
        <div className='grid grid-cols-2 gap-4'>
          <Field data-invalid={!!errors.remaining_lease_term}>
            <FieldLabel className='text-sm font-semibold'>
              Remaining Lease Term (yrs)
            </FieldLabel>
            <Input
              type='number'
              value={form.remaining_lease_term}
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
              value={form.monthly_service_charge}
              onChange={(e) => set('monthly_service_charge', e.target.value)}
              aria-invalid={!!errors.monthly_service_charge}
              className={
                errors.monthly_service_charge
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: errors.monthly_service_charge }]} />
          </Field>
          <Field data-invalid={!!errors.annual_ground_rent}>
            <FieldLabel className='text-sm font-semibold'>
              Annual Ground Rent
            </FieldLabel>
            <Input
              type='number'
              placeholder={getCurrencySign()}
              value={form.annual_ground_rent}
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
            value={form.council_tax_band}
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
            value={form.local_authority}
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
