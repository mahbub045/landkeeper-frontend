'use client';

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
} from '@/data/client/Landlord/properties/PropertiesData';
import {
  AddPropertyModalProps,
  DetailsForm,
  MortgageForm,
  Tab,
} from '@/types/client/Landlord/Properties/PropertyTypes';
import { CloudUpload, Loader2, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

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

  const [details, setDetails] = useState<DetailsForm>({
    name: '',
    type: 'Residential',
    status: 'Occupied',
    address: '',
    purchasePrice: '',
    currentValue: '',
    purchaseDate: '',
    bedrooms: '',
    bathrooms: '',
    notes: '',
  });

  const [mortgage, setMortgage] = useState<MortgageForm>({
    lenderName: '',
    productType: 'Fixed Rate',
    interestRate: '',
    monthlyPayment: '',
    outstandingBalance: '',
    startDate: '',
    endDate: '',
  });

  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const propertyIdRef = useRef<string | null>(null);

  // ── Reset ───────────────────────────────────────────────────────────────────
  function handleClose() {
    setActiveTab('Details');
    setBannerError(null);
    setFieldErrors({});
    setLoading(false);
    setFiles([]);
    propertyIdRef.current = null;
    onClose();
  }

  // ── Shared API error handler ────────────────────────────────────────────────
  async function handleApiError(res: Response) {
    const body = await res.json();

    if (body.errors && typeof body.errors === 'object') {
      setFieldErrors(body.errors);

      const targetTab = TAB_PRIORITY.find((tab) =>
        Object.keys(body.errors).some((field) => FIELD_TAB_MAP[field] === tab),
      );
      if (targetTab) setActiveTab(targetTab);

      setBannerError('Please fix the highlighted fields and try again.');
    } else {
      setBannerError(body.message ?? 'Something went wrong. Please try again.');
    }
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    setBannerError(null);
    setFieldErrors({});
    setLoading(true);

    // will add the api and validation later
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
      <DialogContent className='flex max-h-[90vh] w-full flex-col overflow-hidden p-0 sm:max-w-185'>
        {/* Header */}
        <DialogHeader className='shrink-0 border-b px-6 pt-6 pb-0'>
          <div className='flex items-center justify-between pb-4'>
            <DialogTitle className='text-foreground text-xl font-bold'>
              Add New Property
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
          {activeTab === 'Mortgage' && (
            <MortgageTab
              form={mortgage}
              onChange={setMortgage}
              errors={fieldErrors}
            />
          )}
          {activeTab === 'Documents' && (
            <DocumentsTab
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
        </div>

        {/* Footer */}
        <div className='flex shrink-0 items-center justify-end gap-3 border-t px-6 py-4'>
          <Button variant='outline' onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Add Property
          </Button>
        </div>
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
}> = ({ form, onChange, errors }) => {
  function set(key: keyof DetailsForm, value: string) {
    onChange({ ...form, [key]: value });
  }

  return (
    <div className='space-y-5'>
      <Field data-invalid={!!errors.name}>
        <FieldLabel className='text-sm font-semibold'>Property Name</FieldLabel>
        <Input
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
            </SelectContent>
          </Select>
          <FieldError errors={[{ message: errors.status }]} />
        </Field>
      </div>

      <Field data-invalid={!!errors.address}>
        <FieldLabel className='text-sm font-semibold'>Address</FieldLabel>
        <Input
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

      <div className='grid grid-cols-3 gap-4'>
        <Field data-invalid={!!errors.purchasePrice}>
          <FieldLabel className='text-sm font-semibold'>
            Purchase Price
          </FieldLabel>
          <Input
            type='number'
            placeholder='£'
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
            placeholder='£'
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

// ── Mortgage Tab ──────────────────────────────────────────────────────────────

const MortgageTab: React.FC<{
  form: MortgageForm;
  onChange: (f: MortgageForm) => void;
  errors: Record<string, string>;
}> = ({ form, onChange, errors }) => {
  function set(key: keyof MortgageForm, value: string) {
    onChange({ ...form, [key]: value });
  }

  return (
    <div className='space-y-5'>
      <Field data-invalid={!!errors.lenderName}>
        <FieldLabel className='text-sm font-semibold'>Lender Name</FieldLabel>
        <Input
          placeholder='e.g. Halifax'
          value={form.lenderName}
          onChange={(e) => set('lenderName', e.target.value)}
          aria-invalid={!!errors.lenderName}
          className={
            errors.lenderName
              ? 'border-danger focus-visible:ring-danger/50'
              : ''
          }
        />
        <FieldError errors={[{ message: errors.lenderName }]} />
      </Field>

      <div className='grid grid-cols-2 gap-4'>
        <Field data-invalid={!!errors.productType}>
          <FieldLabel className='text-sm font-semibold'>
            Product Type
          </FieldLabel>
          <Select
            value={form.productType}
            onValueChange={(v) => set('productType', v)}
          >
            <SelectTrigger
              className={errors.productType ? 'border-danger' : ''}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='Fixed Rate'>Fixed Rate</SelectItem>
              <SelectItem value='Variable Rate'>Variable Rate</SelectItem>
              <SelectItem value='Tracker'>Tracker</SelectItem>
              <SelectItem value='Interest Only'>Interest Only</SelectItem>
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
            value={form.interestRate}
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
        <Field data-invalid={!!errors.monthlyPayment}>
          <FieldLabel className='text-sm font-semibold'>
            Monthly Payment
          </FieldLabel>
          <Input
            type='number'
            placeholder='£'
            value={form.monthlyPayment}
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

        <Field data-invalid={!!errors.outstandingBalance}>
          <FieldLabel className='text-sm font-semibold'>
            Outstanding Balance
          </FieldLabel>
          <Input
            type='number'
            placeholder='£'
            value={form.outstandingBalance}
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
        <Field data-invalid={!!errors.startDate}>
          <FieldLabel className='text-sm font-semibold'>Start Date</FieldLabel>
          <Input
            type='date'
            value={form.startDate}
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
            value={form.endDate}
            onChange={(e) => set('endDate', e.target.value)}
            aria-invalid={!!errors.endDate}
            className={
              errors.endDate ? 'border-danger focus-visible:ring-danger/50' : ''
            }
          />
          <FieldError errors={[{ message: errors.endDate }]} />
        </Field>
      </div>
    </div>
  );
};

// ── Documents Tab ─────────────────────────────────────────────────────────────

const DocumentsTab: React.FC<{
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
          PDF, DOC, JPG, PNG up to 50MB
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
          accept='.pdf,.doc,.docx,.jpg,.jpeg,.png'
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
                type='button'
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