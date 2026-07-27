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
  EMPTY_MORTGAGE_FORM,
  INTEREST_RATE_TYPE_OPTIONS,
} from '@/data/client/common/mortgage/MortgageData';
import { cn } from '@/lib/utils';
import { useFilterPropertiesQuery } from '@/store/api/endpoints/client/Common/Filters/FilterPropertiesApi';
import { useAddMortgagesMutation } from '@/store/api/endpoints/client/Common/Mortgage/MortgageApi';
import {
  AddMortgageDialogProps,
  MortgageForm,
} from '@/types/client/Common/Mortgage/MortgageTypes';
import { Property } from '@/types/client/Common/Properties/PropertyTypes';
import { getCurrencySign, snakeToCamel } from '@/utils/formatters';

import { Paperclip, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

const AddMortgageDialog: React.FC<AddMortgageDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [propertyOpen, setPropertyOpen] = useState(false);
  const [propertySearch, setPropertySearch] = useState('');

  // ── File upload state ───────────────────────────────────────────────────────
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useFilterPropertiesQuery(
    propertySearch ? { search: propertySearch } : {},
    { skip: !propertyOpen },
  );
  const [addMortgage] = useAddMortgagesMutation();

  const [form, setForm] = useState<MortgageForm>(EMPTY_MORTGAGE_FORM);

  function set(key: keyof MortgageForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ── File helpers ──────────────────────────────────────────────────────────
  function addFiles(incoming: FileList | null) {
    if (!incoming?.length) return;
    setFiles((prev) => [...prev, ...Array.from(incoming)]);
    setFieldErrors((prev) => ({ ...prev, file: '' }));
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  // ── Reset ───────────────────────────────────────────────────────────────────

  function handleClose() {
    setBannerError(null);
    setFieldErrors({});
    setLoading(false);
    setForm(EMPTY_MORTGAGE_FORM);
    setFiles([]);
    setPropertySearch('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const guardErrors: Record<string, string> = {};
    if (!form.interest_rate_type)
      guardErrors.interest_rate_type = 'Please select a product type.';

    if (Object.keys(guardErrors).length > 0) {
      setFieldErrors(guardErrors);
      setLoading(false);
      return;
    }
    setBannerError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append('property', form.property);
      payload.append('lender_name', form.lender_name);
      payload.append('interest_rate_type', form.interest_rate_type);
      payload.append('interest_rate', form.interest_rate);
      payload.append(
        'interest_rate_expiry_date',
        form.interest_rate_expiry_date,
      );
      payload.append('outstanding_balance', form.outstanding_balance);
      payload.append('monthly_payment', form.monthly_payment);
      payload.append('remaining_mortgage', form.remaining_mortgage);
      if (form.epc_rating) payload.append('epc_rating', form.epc_rating);
      payload.append(
        'epc_certificate_expiry_date',
        form.epc_certificate_expiry_date,
      );
      payload.append('notes', form.notes);
      files.forEach((file) => payload.append('mortgage_documents', file));

      await addMortgage(payload).unwrap();
      toast.success('Mortgage added successfully.');
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
            backendKey === 'term' ? 'termYears' : snakeToCamel(backendKey);
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
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
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
            Add Mortgage
          </DialogTitle>
          <DialogDescription>
            Add a new mortgage to the system.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable body */}
        <form
          onSubmit={handleSubmit}
          className='flex-1 space-y-5 overflow-y-auto px-6 py-5'
        >
          {bannerError && (
            <p className='text-danger mb-1 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm dark:border-red-900/40 dark:bg-red-950/30'>
              {bannerError}
            </p>
          )}

          {/* Property */}
          <Field data-invalid={!!fieldErrors.property}>
            <FieldLabel className='gap-0 text-sm font-semibold'>
              Property<span className='text-danger'>*</span>
            </FieldLabel>
            <div className='relative'>
              <Input
                type='text'
                placeholder='Search by property name...'
                value={
                  form.property
                    ? (data?.find(
                        (p: Property) => String(p.id) === form.property,
                      )?.property_name ?? propertySearch)
                    : propertySearch
                }
                onChange={(e) => {
                  setPropertySearch(e.target.value);
                  set('property', ''); // clear selection when user types
                  setPropertyOpen(true);
                }}
                onClick={() => setPropertyOpen(true)}
                onBlur={() => setTimeout(() => setPropertyOpen(false), 150)}
                aria-invalid={!!fieldErrors.property}
                className={cn(
                  'h-10',
                  fieldErrors.property &&
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
                            set('property', String(p.id));
                            setPropertySearch('');
                            setPropertyOpen(false);
                          }}
                          className={cn(
                            'hover:bg-muted flex cursor-pointer items-center gap-3 px-4 py-2.5',
                            form.property === String(p.id) && 'bg-muted',
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
            <FieldError errors={[{ message: fieldErrors.property }]} />
          </Field>

          {/* Lender Name */}
          <Field data-invalid={!!fieldErrors.lender_name}>
            <FieldLabel className='gap-0 text-sm font-semibold'>
              Lender Name<span className='text-danger'>*</span>
            </FieldLabel>
            <Input
              type='text'
              placeholder='e.g. Halifax, Nationwide'
              value={form.lender_name}
              onChange={(e) => set('lender_name', e.target.value)}
              aria-invalid={!!fieldErrors.lender_name}
              className={
                fieldErrors.lender_name
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
              required
            />
            <FieldError errors={[{ message: fieldErrors.lender_name }]} />
          </Field>

          {/*  Interest Rate Type + Interest Rate */}
          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!fieldErrors.interest_rate_type}>
              <FieldLabel className='gap-0 text-sm font-semibold'>
                Interest Rate Type<span className='text-danger'>*</span>
              </FieldLabel>
              <Select
                value={form.interest_rate_type}
                onValueChange={(v) => set('interest_rate_type', v)}
              >
                <SelectTrigger
                  aria-invalid={!!fieldErrors.interest_rate_type}
                  className={
                    fieldErrors.interest_rate_type
                      ? 'border-danger focus-visible:ring-danger/50'
                      : ''
                  }
                >
                  <SelectValue placeholder='Select Interest Rate Type' />
                </SelectTrigger>
                <SelectContent>
                  {INTEREST_RATE_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError
                errors={[{ message: fieldErrors.interest_rate_type }]}
              />
            </Field>

            <Field data-invalid={!!fieldErrors.interest_rate}>
              <FieldLabel className='text-sm font-semibold'>
                Interest Rate (%)
              </FieldLabel>
              <Input
                type='number'
                placeholder='e.g. 3.2'
                step='0.01'
                value={form.interest_rate}
                onChange={(e) => set('interest_rate', e.target.value)}
                aria-invalid={!!fieldErrors.interest_rate}
                className={
                  fieldErrors.interest_rate
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: fieldErrors.interest_rate }]} />
            </Field>
          </div>

          {/* Interest Rate Expiry Date + Outstanding Balance */}
          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!fieldErrors.interest_rate_expiry_date}>
              <FieldLabel className='text-sm font-semibold'>
                Interest Rate Expiry Date
              </FieldLabel>
              <Input
                type='date'
                value={form.interest_rate_expiry_date}
                onChange={(e) =>
                  set('interest_rate_expiry_date', e.target.value)
                }
                aria-invalid={!!fieldErrors.interest_rate_expiry_date}
                className={
                  fieldErrors.interest_rate_expiry_date
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError
                errors={[{ message: fieldErrors.interest_rate_expiry_date }]}
              />
            </Field>

            <Field data-invalid={!!fieldErrors.outstanding_balance}>
              <FieldLabel className='text-sm font-semibold'>
                Outstanding Balance
              </FieldLabel>
              <Input
                type='number'
                placeholder={getCurrencySign()}
                value={form.outstanding_balance}
                onChange={(e) => set('outstanding_balance', e.target.value)}
                aria-invalid={!!fieldErrors.outstanding_balance}
                className={
                  fieldErrors.outstanding_balance
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError
                errors={[{ message: fieldErrors.outstanding_balance }]}
              />
            </Field>
          </div>

          {/* Monthly Payment + Remaining Mortgage Term(Years) */}
          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!fieldErrors.monthly_payment}>
              <FieldLabel className='text-sm font-semibold'>
                Monthly Payment
              </FieldLabel>
              <Input
                type='number'
                placeholder={getCurrencySign()}
                value={form.monthly_payment}
                onChange={(e) => set('monthly_payment', e.target.value)}
                aria-invalid={!!fieldErrors.monthly_payment}
                className={
                  fieldErrors.monthly_payment
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: fieldErrors.monthly_payment }]} />
            </Field>

            <Field data-invalid={!!fieldErrors.remaining_mortgage}>
              <FieldLabel className='text-sm font-semibold'>
                Remaining Mortgage Term(Years)
              </FieldLabel>
              <Input
                type='number'
                placeholder='e.g. 2'
                value={form.remaining_mortgage}
                onChange={(e) => set('remaining_mortgage', e.target.value)}
                aria-invalid={!!fieldErrors.remaining_mortgage}
                className={
                  fieldErrors.remaining_mortgage
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError
                errors={[{ message: fieldErrors.remaining_mortgage }]}
              />
            </Field>
          </div>

          {/* EPC Rating + EPC Certificate Expiry Date */}
          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!fieldErrors.epc_rating}>
              <FieldLabel className='text-sm font-semibold'>
                EPC Rating
              </FieldLabel>
              <Input
                type='text'
                value={form.epc_rating}
                onChange={(e) => {
                  const letterOnly = e.target.value
                    .replace(/[^a-zA-Z]/g, '')
                    .slice(0, 1)
                    .toUpperCase();
                  set('epc_rating', letterOnly);
                }}
                aria-invalid={!!fieldErrors.epc_rating}
                className={
                  fieldErrors.epc_rating
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: fieldErrors.epc_rating }]} />
            </Field>

            <Field data-invalid={!!fieldErrors.epc_certificate_expiry_date}>
              <FieldLabel className='text-sm font-semibold'>
                EPC Certificate Expiry Date
              </FieldLabel>
              <Input
                type='date'
                value={form.epc_certificate_expiry_date}
                onChange={(e) =>
                  set('epc_certificate_expiry_date', e.target.value)
                }
                aria-invalid={!!fieldErrors.epc_certificate_expiry_date}
                className={
                  fieldErrors.epc_certificate_expiry_date
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError
                errors={[{ message: fieldErrors.epc_certificate_expiry_date }]}
              />
            </Field>
          </div>

          {/*  Notes */}
          <Field data-invalid={!!fieldErrors.brokerNotes}>
            <FieldLabel className='text-sm font-semibold'>Notes</FieldLabel>
            <Textarea
              placeholder='Add notes...'
              rows={4}
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              aria-invalid={!!fieldErrors.notes}
              className={
                fieldErrors.notes
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: fieldErrors.brokerNotes }]} />
          </Field>

          {/* Document(s) upload */}
          <Field data-invalid={!!fieldErrors.file}>
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
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors',
                fieldErrors.file
                  ? 'border-danger bg-red-50 dark:bg-red-950/20'
                  : dragging
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/40',
              )}
            >
              <Paperclip className='text-primary mb-3 h-9 w-9' />
              <p className='text-muted-foreground text-sm'>
                Attach mortgage documents
              </p>
              <input
                ref={fileInputRef}
                type='file'
                accept='.pdf,.jpg,.jpeg,.png,.webp'
                multiple
                className='hidden'
                onChange={(e) => addFiles(e.target.files)}
              />
            </div>
            <FieldError errors={[{ message: fieldErrors.file }]} />

            {files.length > 0 && (
              <ul className='space-y-2'>
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${file.size}-${index}`}
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
                      onClick={() => removeFile(index)}
                      className='text-muted-foreground hover:text-danger ml-2 h-6 w-6 shrink-0'
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </Field>

          {/* Footer */}
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
              {loading && <Loading className='text-white!' />}
              Add Mortgage
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMortgageDialog;
