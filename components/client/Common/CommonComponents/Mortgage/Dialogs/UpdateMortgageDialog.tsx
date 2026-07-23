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
      propertyId: m.property?.id ? String(m.property.id) : '',
      lenderName: m.lender_name ?? '',
      interestRateType: m.interest_rate_type ?? '',
      interestRate: m.interest_rate ? String(m.interest_rate) : '',
      interestRateExpiryDate: m.interest_rate_expiry_date ?? '',
      outstandingBalance: m.outstanding_balance
        ? String(m.outstanding_balance)
        : '',
      monthlyPayment: m.monthly_payment ? String(m.monthly_payment) : '',
      remainingMortgage: m.remaining_mortgage
        ? String(m.remaining_mortgage)
        : '',
      epcRating: m.epc_rating ?? '',
      epcCertificateExpiryDate: m.epc_certificate_expiry_date ?? '',
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
    if (!form.interestRateType)
      guardErrors.interestRateType = 'Please select an interest rate type.';

    if (Object.keys(guardErrors).length > 0) {
      setFieldErrors(guardErrors);
      return;
    }

    setBannerError(null);
    setFieldErrors({});

    try {
      const payload = new FormData();
      payload.append('property', form.propertyId);
      payload.append('lender_name', form.lenderName);
      payload.append('interest_rate_type', form.interestRateType);
      payload.append('interest_rate', form.interestRate);
      payload.append(
        'interest_rate_expiry_date',
        form.interestRateExpiryDate,
      );
      payload.append('outstanding_balance', form.outstandingBalance);
      payload.append('monthly_payment', form.monthlyPayment);
      payload.append('remaining_mortgage', form.remainingMortgage);
      if (form.epcRating) payload.append('epc_rating', form.epcRating);
      payload.append(
        'epc_certificate_expiry_date',
        form.epcCertificateExpiryDate,
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
          <Field data-invalid={!!fieldErrors.propertyId}>
            <FieldLabel className='gap-0 text-sm font-semibold'>
              Property<span className='text-danger'>*</span>
            </FieldLabel>
            <div className='relative'>
              <Input
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
                  set('propertyId', ''); // clear selection when user types
                  setPropertyOpen(true);
                }}
                onClick={() => setPropertyOpen(true)}
                onBlur={() => setTimeout(() => setPropertyOpen(false), 150)}
                aria-invalid={!!fieldErrors.propertyId}
                className={
                  fieldErrors.propertyId
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

          {/* Lender Name */}
          <Field data-invalid={!!fieldErrors.lenderName}>
            <FieldLabel className='gap-0 text-sm font-semibold'>
              Lender Name<span className='text-danger'>*</span>
            </FieldLabel>
            <Input
              placeholder='e.g. Halifax, Nationwide'
              value={form.lenderName}
              onChange={(e) => set('lenderName', e.target.value)}
              aria-invalid={!!fieldErrors.lenderName}
              className={
                fieldErrors.lenderName
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
              required
            />
            <FieldError errors={[{ message: fieldErrors.lenderName }]} />
          </Field>

          {/* Interest Rate Type + Interest Rate */}
          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!fieldErrors.interestRateType}>
              <FieldLabel className='gap-0 text-sm font-semibold'>
                Interest Rate Type<span className='text-danger'>*</span>
              </FieldLabel>
              <Select
                value={form.interestRateType}
                onValueChange={(v) => set('interestRateType', v)}
              >
                <SelectTrigger
                  className={
                    fieldErrors.interestRateType ? 'border-danger' : ''
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
                errors={[{ message: fieldErrors.interestRateType }]}
              />
            </Field>

            <Field data-invalid={!!fieldErrors.interestRate}>
              <FieldLabel className='text-sm font-semibold'>
                Interest Rate (%)
              </FieldLabel>
              <Input
                type='number'
                placeholder='e.g. 3.2'
                step='0.01'
                value={form.interestRate}
                onChange={(e) => set('interestRate', e.target.value)}
                aria-invalid={!!fieldErrors.interestRate}
                className={
                  fieldErrors.interestRate
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: fieldErrors.interestRate }]} />
            </Field>
          </div>

          {/* Interest Rate Expiry Date + Outstanding Balance */}
          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!fieldErrors.interestRateExpiryDate}>
              <FieldLabel className='text-sm font-semibold'>
                Interest Rate Expiry Date
              </FieldLabel>
              <Input
                type='date'
                value={form.interestRateExpiryDate}
                onChange={(e) => set('interestRateExpiryDate', e.target.value)}
                aria-invalid={!!fieldErrors.interestRateExpiryDate}
                className={
                  fieldErrors.interestRateExpiryDate
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError
                errors={[{ message: fieldErrors.interestRateExpiryDate }]}
              />
            </Field>

            <Field data-invalid={!!fieldErrors.outstandingBalance}>
              <FieldLabel className='text-sm font-semibold'>
                Outstanding Balance
              </FieldLabel>
              <Input
                type='number'
                placeholder={getCurrencySign()}
                value={form.outstandingBalance}
                onChange={(e) => set('outstandingBalance', e.target.value)}
                aria-invalid={!!fieldErrors.outstandingBalance}
                className={
                  fieldErrors.outstandingBalance
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError
                errors={[{ message: fieldErrors.outstandingBalance }]}
              />
            </Field>
          </div>

          {/* Monthly Payment + Remaining Mortgage Term(Years) */}
          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!fieldErrors.monthlyPayment}>
              <FieldLabel className='text-sm font-semibold'>
                Monthly Payment
              </FieldLabel>
              <Input
                type='number'
                placeholder={getCurrencySign()}
                value={form.monthlyPayment}
                onChange={(e) => set('monthlyPayment', e.target.value)}
                aria-invalid={!!fieldErrors.monthlyPayment}
                className={
                  fieldErrors.monthlyPayment
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: fieldErrors.monthlyPayment }]} />
            </Field>

            <Field data-invalid={!!fieldErrors.remainingMortgage}>
              <FieldLabel className='text-sm font-semibold'>
                Remaining Mortgage Term(Years)
              </FieldLabel>
              <Input
                type='number'
                placeholder='e.g. 25'
                value={form.remainingMortgage}
                onChange={(e) => set('remainingMortgage', e.target.value)}
                aria-invalid={!!fieldErrors.remainingMortgage}
                className={
                  fieldErrors.remainingMortgage
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError
                errors={[{ message: fieldErrors.remainingMortgage }]}
              />
            </Field>
          </div>

          {/* EPC Rating + EPC Certificate Expiry Date */}
          <div className='grid grid-cols-2 gap-4'>
            {/* EPC Rating */}
            <Field data-invalid={!!fieldErrors.epcRating}>
              <FieldLabel className='text-sm font-semibold'>
                EPC Rating
              </FieldLabel>
              <Input
                type='text'
                value={form.epcRating}
                onChange={(e) => set('epcRating', e.target.value)}
                aria-invalid={!!fieldErrors.epcRating}
                className={
                  fieldErrors.epcRating
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: fieldErrors.epcRating }]} />
            </Field>

            {/* EPC Certificate Expiry Date */}
            <Field data-invalid={!!fieldErrors.epcCertificateExpiryDate}>
              <FieldLabel className='text-sm font-semibold'>
                EPC Certificate Expiry Date
              </FieldLabel>
              <Input
                type='date'
                value={form.epcCertificateExpiryDate}
                onChange={(e) =>
                  set('epcCertificateExpiryDate', e.target.value)
                }
                aria-invalid={!!fieldErrors.epcCertificateExpiryDate}
                className={
                  fieldErrors.epcCertificateExpiryDate
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError
                errors={[{ message: fieldErrors.epcCertificateExpiryDate }]}
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