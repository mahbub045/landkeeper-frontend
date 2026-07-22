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
  EMPTY_FORM,
  TransactionCategoryOptions,
} from '@/data/client/common/finance/FinanceData';
import { cn } from '@/lib/utils';
import { useFilterPropertiesQuery } from '@/store/api/endpoints/client/Common/Filters/FilterPropertiesApi';
import { useAddFinanceMutation } from '@/store/api/endpoints/client/Common/Finance/FinanceApi';
import {
  AddTransactionModalProps,
  TransactionForm,
} from '@/types/client/Common/Finance/FinanceTypes';
import { Property } from '@/types/client/Common/Properties/PropertyTypes';
import { getCurrencySign, snakeToCamel } from '@/utils/formatters';

import { Paperclip, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

// ── Dialog ────────────────────────────────────────────────────────────────

const AddTransactionDialog: React.FC<AddTransactionModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<TransactionForm>(EMPTY_FORM);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [propertyOpen, setPropertyOpen] = useState(false);
  const [propertySearch, setPropertySearch] = useState('');

  function set<K extends keyof TransactionForm>(
    key: K,
    value: TransactionForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: '' }));
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

  // ── Reset ─────────────────────────────────────────────────────────────────
  function handleClose() {
    setForm(EMPTY_FORM);
    setFieldErrors({});
    setFiles([]);
    setPropertySearch('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  }

  // ── RTK Query ─────────────────────────────────────────────────────────────
  const { data, isLoading: propertiesLoading } = useFilterPropertiesQuery(
    propertySearch ? { search: propertySearch } : {},
    { skip: !propertyOpen },
  );

  const [addFinance, { isLoading: loading }] = useAddFinanceMutation();

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // manual guards for the non-native controls (property combobox, category select)
    if (!form.propertyId) {
      setFieldErrors((prev) => ({
        ...prev,
        propertyId: 'Please select a property.',
      }));
      return;
    }

    if (!form.category) {
      setFieldErrors((prev) => ({
        ...prev,
        category: 'Please select a category.',
      }));
      return;
    }

    const payload = new FormData();
    payload.append('property', form.propertyId);
    payload.append('type', form.type);
    payload.append('category', form.category);
    payload.append('amount', form.amount);
    payload.append('date', form.date);
    payload.append('description', form.description.trim());
    files.forEach((file) => payload.append('uploaded_receipt', file));

    try {
      await addFinance(payload).unwrap();
      toast.success('Transaction added successfully.');
      onSuccess?.();
      handleClose();
    } catch (err: unknown) {
      try {
        const errorData = (err as { data?: Record<string, string[]> })?.data;
        if (errorData) {
          const mapped: Record<string, string> = {};
          Object.entries(errorData).forEach(([key, messages]) => {
            mapped[snakeToCamel(key)] = Array.isArray(messages)
              ? messages[0]
              : String(messages);
          });
          setFieldErrors((prev) => ({ ...prev, ...mapped }));
        }
      } catch {
        toast.error('Failed to add transaction. Please try again.');
      }
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className='flex max-h-[90vh] w-full flex-col overflow-hidden p-0 sm:max-w-185'
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader className='shrink-0 border-b px-6 pt-6 pb-5'>
          <DialogTitle className='text-foreground text-xl font-bold'>
            Add Transaction
          </DialogTitle>
          <DialogDescription>
            Add a new transaction for your property.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='contents'>
          {/* Scrollable body */}
          <div className='flex-1 space-y-5 overflow-y-auto px-6 py-5'>
            {/* Type + Property */}
            <div className='grid grid-cols-2 gap-4'>
              {/* Type */}
              <Field data-invalid={!!fieldErrors.type}>
                <FieldLabel className='text-sm font-semibold'>Type</FieldLabel>
                <Select
                  value={form.type}
                  onValueChange={(v) =>
                    set('type', v as TransactionForm['type'])
                  }
                >
                  <SelectTrigger
                    className={fieldErrors.type ? 'border-danger' : ''}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='INCOME'>Income</SelectItem>
                    <SelectItem value='EXPENSE'>Expense</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError errors={[{ message: fieldErrors.type }]} />
              </Field>

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
                      {propertiesLoading ? (
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
            </div>

            {/* Category */}
            <Field data-invalid={!!fieldErrors.category}>
              <FieldLabel className='gap-0 text-sm font-semibold'>
                Category<span className='text-danger'>*</span>
              </FieldLabel>
              <Select
                value={form.category}
                onValueChange={(v) => set('category', v)}
              >
                <SelectTrigger
                  className={fieldErrors.category ? 'border-danger' : ''}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TransactionCategoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[{ message: fieldErrors.category }]} />
            </Field>

            {/* Amount + Date */}
            <div className='grid grid-cols-2 gap-4'>
              <Field data-invalid={!!fieldErrors.amount}>
                <FieldLabel className='gap-0 text-sm font-semibold'>
                  Amount<span className='text-danger'>*</span>
                </FieldLabel>
                <Input
                  type='number'
                  placeholder={getCurrencySign()}
                  step='0.01'
                  min='0.01'
                  value={form.amount}
                  onChange={(e) => set('amount', e.target.value)}
                  aria-invalid={!!fieldErrors.amount}
                  className={
                    fieldErrors.amount
                      ? 'border-danger focus-visible:ring-danger/50'
                      : ''
                  }
                  required
                />
                <FieldError errors={[{ message: fieldErrors.amount }]} />
              </Field>

              <Field data-invalid={!!fieldErrors.date}>
                <FieldLabel className='gap-0 text-sm font-semibold'>
                  Date<span className='text-danger'>*</span>
                </FieldLabel>
                <Input
                  type='date'
                  value={form.date}
                  onChange={(e) => set('date', e.target.value)}
                  aria-invalid={!!fieldErrors.date}
                  className={
                    fieldErrors.date
                      ? 'border-danger focus-visible:ring-danger/50'
                      : ''
                  }
                  required
                />
                <FieldError errors={[{ message: fieldErrors.date }]} />
              </Field>
            </div>

            {/* Description */}
            <Field data-invalid={!!fieldErrors.description}>
              <FieldLabel className='text-sm font-semibold'>
                Description
              </FieldLabel>
              <Textarea
                placeholder='Brief description...'
                rows={6}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                aria-invalid={!!fieldErrors.description}
                className={
                  fieldErrors.description
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: fieldErrors.description }]} />
            </Field>

            {/* Receipt / Invoice upload */}
            <Field data-invalid={!!fieldErrors.file}>
              <FieldLabel className='text-sm font-semibold'>
                Receipt/Invoice
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
                  'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-2 transition-colors',
                  fieldErrors.file
                    ? 'border-danger bg-red-50 dark:bg-red-950/20'
                    : dragging
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted/40',
                )}
              >
                <Paperclip className='text-primary mb-3 h-9 w-9' />
                <p className='text-muted-foreground text-sm'>
                  Attach receipt or invoice
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
          </div>

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
              Add Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
