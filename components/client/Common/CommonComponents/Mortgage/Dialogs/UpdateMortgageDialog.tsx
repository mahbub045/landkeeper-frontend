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
import { useUpdateMortgageMutation } from '@/store/api/endpoints/client/Common/Mortgage/MortgageApi';
import {
  Mortgage,
  MortgageForm,
  UpdateMortgageDialogProps,
} from '@/types/client/Common/Mortgage/MortgageTypes';
import { Property } from '@/types/client/Common/Properties/PropertyTypes';
import { getCurrencySign, snakeToCamel } from '@/utils/formatters';

import { Paperclip, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const UpdateMortgageDialog: React.FC<UpdateMortgageDialogProps> = ({
  open,
  onClose,
  onSuccess,
  mortgage,
}) => {
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [propertyOpen, setPropertyOpen] = useState(false);
  const [propertySearch, setPropertySearch] = useState(
    () => mortgage?.property?.property_name ?? '',
  );

  const { data, isLoading } = useFilterPropertiesQuery(
    propertySearch ? { search: propertySearch } : {},
    { skip: !propertyOpen },
  );
  const [updateMortgage, { isLoading: submitting }] =
    useUpdateMortgageMutation();

  // ── Document state ──────────────────────────────────────────────────────
  // New files the user is adding in this edit session
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Documents still "kept" from the original mortgage (for display + removal)
  const [existingDocuments, setExistingDocuments] = useState(
    mortgage?.uploaded_documents ?? [],
  );

  // Re-fetched blobs of the ORIGINAL documents, turned back into File objects
  // so they can be re-uploaded — backend replaces the whole set on update.
  const [cachedExistingFiles, setCachedExistingFiles] = useState<
    Record<number, File>
  >({});
  const [documentsLoading, setDocumentsLoading] = useState(false);

  const loading = submitting || documentsLoading;

  // ── Build initial form from the mortgage being edited ─────────────────────
  function buildFormFromMortgage(m: Mortgage): MortgageForm {
    if (!m) return EMPTY_MORTGAGE_FORM;

    return {
      property: m.property?.id ? String(m.property.id) : '',
      lender_name: m.lender_name ?? '',
      interest_rate_type: m.interest_rate_type ?? '',
      interest_rate: m.interest_rate ? String(m.interest_rate) : '',
      interest_rate_expiry_date: m.interest_rate_expiry_date ?? '',
      outstanding_balance: m.outstanding_balance
        ? String(m.outstanding_balance)
        : '',
      monthly_payment: m.monthly_payment ? String(m.monthly_payment) : '',
      remaining_mortgage: m.remaining_mortgage
        ? String(m.remaining_mortgage)
        : '',
      epc_rating: m.epc_rating ?? '',
      epc_certificate_expiry_date: m.epc_certificate_expiry_date ?? '',
      notes: m.notes ?? '',
    };
  }

  const [form, setForm] = useState<MortgageForm>(() =>
    buildFormFromMortgage(mortgage),
  );

  function set(key: keyof MortgageForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ── Prefetch existing documents as File objects ─────────────────────────
  useEffect(() => {
    if (!open || !mortgage?.uploaded_documents?.length) return;

    let cancelled = false;

    const prefetch = async () => {
      setDocumentsLoading(true);
      try {
        const entries = await Promise.all(
          mortgage.uploaded_documents.map(async (doc) => {
            const res = await fetch(
              `/api/fetch-remote-files?url=${encodeURIComponent(doc.file)}`,
            );
            if (!res.ok) {
              throw new Error(
                `Failed to fetch document ${doc.id} (${res.status})`,
              );
            }
            const blob = await res.blob();
            const filename = doc.file.split('/').pop() || `document-${doc.id}`;
            return [
              doc.id,
              new File([blob], filename, { type: blob.type }),
            ] as const;
          }),
        );
        if (!cancelled) setCachedExistingFiles(Object.fromEntries(entries));
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to prefetch existing documents', err);
          toast.error(
            'Could not load one or more existing documents. Removing/keeping them may not work correctly.',
          );
        }
      } finally {
        if (!cancelled) setDocumentsLoading(false);
      }
    };

    prefetch();

    return () => {
      cancelled = true;
    };
  }, [open, mortgage?.alias, mortgage?.uploaded_documents]);

  // ── File helpers ──────────────────────────────────────────────────────────
  function addFiles(incoming: FileList | null) {
    if (!incoming?.length) return;
    setNewFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      return [
        ...prev,
        ...Array.from(incoming).filter((f) => !existing.has(f.name + f.size)),
      ];
    });
    setFieldErrors((prev) => ({ ...prev, file: '' }));
  }

  function removeNewFile(index: number) {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removeExistingDocument(id: number) {
    setExistingDocuments((prev) => prev.filter((d) => d.id !== id));
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
    setNewFiles([]);
    setExistingDocuments(mortgage?.uploaded_documents ?? []);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const guardErrors: Record<string, string> = {};
    if (!form.interest_rate_type)
      guardErrors.interest_rate_type = 'Please select an interest rate type.';

    if (Object.keys(guardErrors).length > 0) {
      setFieldErrors(guardErrors);
      return;
    }

    setBannerError(null);
    setFieldErrors({});

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

      // Backend replaces the whole document set on update, so re-send every
      // document the user still wants to keep, plus any newly added ones —
      // all under 'uploaded_documents'.
      existingDocuments.forEach((d) => {
        const file = cachedExistingFiles[d.id];
        if (file) payload.append('mortgage_documents', file);
      });
      newFiles.forEach((file) => payload.append('mortgage_documents', file));

      await updateMortgage({
        mortgage_alias: mortgage.alias,
        payload,
      }).unwrap();
      toast.success('Mortgage updated successfully.');
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
            Update Mortgage
          </DialogTitle>
          <DialogDescription>
            Update the details of this mortgage.
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
                className={
                  fieldErrors.property
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
                required
              />

              {propertyOpen && (
                <div className='bg-background border-border absolute top-full left-0 z-50 mt-1 w-full rounded-md border shadow-md'>
                  {isLoading ? (
                    <div className='text-muted-foreground flex items-center gap-2 px-4 py-3 text-sm'>
                      <Loading />
                      Loading...
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

          {/* Interest Rate Type + Interest Rate */}
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
                  className={
                    fieldErrors.interest_rate_type ? 'border-danger' : ''
                  }
                >
                  <SelectValue />
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
                placeholder='e.g. 25'
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
            {/* EPC Rating */}
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

            {/* EPC Certificate Expiry Date */}
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
          <Field data-invalid={!!fieldErrors.notes}>
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
            <FieldError errors={[{ message: fieldErrors.notes }]} />
          </Field>

          {/* Document upload */}
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

            {/* Existing documents (still-kept, re-uploaded on save) */}
            {existingDocuments.length > 0 && (
              <div className='space-y-2'>
                <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                  Existing Documents
                  {documentsLoading && ' (preparing...)'}
                </p>
                <ul className='space-y-2'>
                  {existingDocuments.map((doc) => (
                    <li
                      key={doc.id}
                      className='bg-muted flex items-center justify-between rounded-md px-4 py-2.5'
                    >
                      <a
                        href={doc.file}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='max-w-[80%] truncate text-sm underline'
                      >
                        {doc.file.split('/').pop()}
                      </a>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        onClick={() => removeExistingDocument(doc.id)}
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

            {/* Newly added files pending upload */}
            {newFiles.length > 0 && (
              <div className='space-y-2'>
                <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                  New Uploads
                </p>
                <ul className='space-y-2'>
                  {newFiles.map((f, index) => (
                    <li
                      key={`${f.name}-${f.size}-${index}`}
                      className='bg-muted flex items-center justify-between rounded-md px-4 py-2.5'
                    >
                      <Badge
                        variant='secondary'
                        className='max-w-[80%] truncate font-normal'
                      >
                        {f.name}
                      </Badge>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        onClick={() => removeNewFile(index)}
                        className='text-muted-foreground hover:text-danger ml-2 h-6 w-6 shrink-0'
                        aria-label={`Remove ${f.name}`}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Field>

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
              Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateMortgageDialog;
