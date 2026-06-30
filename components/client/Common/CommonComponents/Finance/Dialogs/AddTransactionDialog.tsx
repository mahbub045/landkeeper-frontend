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
import { Textarea } from '@/components/ui/textarea';
import {
  EMPTY_FORM,
  TRANSACTION_CATEGORIES,
} from '@/data/client/common/finance/FinanceData';
import {
  AddTransactionModalProps,
  TransactionForm,
} from '@/types/client/Common/Finance/FinanceTypes';

import { Loader2, Paperclip } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

// ── Validation ───────────────────────────────────────────────────────────────

function validate(
  form: TransactionForm,
  file: File | null,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.propertyId) errors.propertyId = 'Please select a property.';
  if (!form.category) errors.category = 'Please select a category.';
  if (!form.amount.trim()) errors.amount = 'Amount is required.';
  else if (Number(form.amount) <= 0)
    errors.amount = 'Amount must be greater than zero.';
  if (!form.date) errors.date = 'Date is required.';

  return errors;
}

// ── Modal ─────────────────────────────────────────────────────────────────────

const AddTransactionDialog: React.FC<AddTransactionModalProps> = ({
  open,
  onClose,
  onSuccess,
  properties = [],
}) => {
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<TransactionForm>(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof TransactionForm>(
    key: K,
    value: TransactionForm[K],
  ) {
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
    setFieldErrors({});
    setLoading(false);
    setForm(EMPTY_FORM);
    setFile(null);
    onClose();
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    const errors = validate(form, file);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

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
            Add Transaction
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable body */}
        <div className='flex-1 space-y-5 overflow-y-auto px-6 py-5'>
          {/* Type + Property */}
          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!fieldErrors.type}>
              <FieldLabel className='text-sm font-semibold'>Type</FieldLabel>
              <Select
                value={form.type}
                onValueChange={(v) => set('type', v as TransactionForm['type'])}
              >
                <SelectTrigger
                  className={fieldErrors.type ? 'border-danger' : ''}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Income'>Income</SelectItem>
                  <SelectItem value='Expense'>Expense</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={[{ message: fieldErrors.type }]} />
            </Field>

            <Field data-invalid={!!fieldErrors.propertyId}>
              <FieldLabel className='text-sm font-semibold'>
                Property
              </FieldLabel>
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
          </div>

          {/* Category */}
          <Field data-invalid={!!fieldErrors.category}>
            <FieldLabel className='text-sm font-semibold'>Category</FieldLabel>
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
                {TRANSACTION_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[{ message: fieldErrors.category }]} />
          </Field>

          {/* Amount + Date */}
          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!fieldErrors.amount}>
              <FieldLabel className='text-sm font-semibold'>Amount</FieldLabel>
              <Input
                type='number'
                placeholder='£'
                step='0.01'
                value={form.amount}
                onChange={(e) => set('amount', e.target.value)}
                aria-invalid={!!fieldErrors.amount}
                className={
                  fieldErrors.amount
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: fieldErrors.amount }]} />
            </Field>

            <Field data-invalid={!!fieldErrors.date}>
              <FieldLabel className='text-sm font-semibold'>Date</FieldLabel>
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
              rows={2}
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
              className={[
                'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors',
                fieldErrors.file
                  ? 'border-danger bg-red-50 dark:bg-red-950/20'
                  : dragging
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/40',
              ].join(' ')}
            >
              <Paperclip className='text-primary mb-3 h-9 w-9' />
              {file ? (
                <p className='text-foreground text-sm font-semibold'>
                  {file.name}
                </p>
              ) : (
                <p className='text-muted-foreground text-sm'>
                  Attach receipt or invoice
                </p>
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
          </Field>
        </div>

        {/* Footer */}
        <div className='flex shrink-0 items-center justify-end gap-3 border-t px-6 py-4'>
          <Button variant='outline' onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Add Transaction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
