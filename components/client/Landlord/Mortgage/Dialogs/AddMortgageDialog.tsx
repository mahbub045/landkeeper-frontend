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
  AddMortgageModalProps,
  MortgageForm,
} from '@/types/client/Landlord/Mortgage/MortgageTypes';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

const AddMortgageDialog: React.FC<AddMortgageModalProps> = ({
  open,
  onClose,
  onSuccess,
  properties = [],
}) => {
  const [loading, setLoading] = useState(false);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<MortgageForm>({
    propertyId: '',
    lenderName: '',
    productType: 'Fixed Rate',
    interestRate: '',
    loanAmount: '',
    outstandingBalance: '',
    monthlyPayment: '',
    termYears: '',
    startDate: '',
    endDate: '',
    brokerNotes: '',
  });

  function set(key: keyof MortgageForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ── Reset ───────────────────────────────────────────────────────────────────
  function handleClose() {
    setBannerError(null);
    setFieldErrors({});
    setLoading(false);
    setForm({
      propertyId: '',
      lenderName: '',
      productType: 'Fixed Rate',
      interestRate: '',
      loanAmount: '',
      outstandingBalance: '',
      monthlyPayment: '',
      termYears: '',
      startDate: '',
      endDate: '',
      brokerNotes: '',
    });
    onClose();
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    setBannerError(null);
    setFieldErrors({});
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
            Add Mortgage
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable body */}
        <div className='flex-1 space-y-5 overflow-y-auto px-6 py-5'>
          {bannerError && (
            <p className='text-danger mb-1 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm dark:border-red-900/40 dark:bg-red-950/30'>
              {bannerError}
            </p>
          )}

          {/* Property */}
          <Field data-invalid={!!fieldErrors.propertyId}>
            <FieldLabel className='text-sm font-semibold'>Property</FieldLabel>
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

          {/* Lender Name */}
          <Field data-invalid={!!fieldErrors.lenderName}>
            <FieldLabel className='text-sm font-semibold'>
              Lender Name
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
            />
            <FieldError errors={[{ message: fieldErrors.lenderName }]} />
          </Field>

          {/* Product Type + Interest Rate */}
          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!fieldErrors.productType}>
              <FieldLabel className='text-sm font-semibold'>
                Product Type
              </FieldLabel>
              <Select
                value={form.productType}
                onValueChange={(v) => set('productType', v)}
              >
                <SelectTrigger
                  className={fieldErrors.productType ? 'border-danger' : ''}
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
              <FieldError errors={[{ message: fieldErrors.productType }]} />
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

          {/* Loan Amount + Outstanding Balance */}
          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!fieldErrors.loanAmount}>
              <FieldLabel className='text-sm font-semibold'>
                Loan Amount
              </FieldLabel>
              <Input
                type='number'
                placeholder='£'
                value={form.loanAmount}
                onChange={(e) => set('loanAmount', e.target.value)}
                aria-invalid={!!fieldErrors.loanAmount}
                className={
                  fieldErrors.loanAmount
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: fieldErrors.loanAmount }]} />
            </Field>

            <Field data-invalid={!!fieldErrors.outstandingBalance}>
              <FieldLabel className='text-sm font-semibold'>
                Outstanding Balance
              </FieldLabel>
              <Input
                type='number'
                placeholder='£'
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

          {/* Monthly Payment + Term */}
          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!fieldErrors.monthlyPayment}>
              <FieldLabel className='text-sm font-semibold'>
                Monthly Payment
              </FieldLabel>
              <Input
                type='number'
                placeholder='£'
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

            <Field data-invalid={!!fieldErrors.termYears}>
              <FieldLabel className='text-sm font-semibold'>
                Term (Years)
              </FieldLabel>
              <Input
                type='number'
                placeholder='e.g. 25'
                value={form.termYears}
                onChange={(e) => set('termYears', e.target.value)}
                aria-invalid={!!fieldErrors.termYears}
                className={
                  fieldErrors.termYears
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: fieldErrors.termYears }]} />
            </Field>
          </div>

          {/* Start Date + End Date */}
          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!fieldErrors.startDate}>
              <FieldLabel className='text-sm font-semibold'>
                Start Date
              </FieldLabel>
              <Input
                type='date'
                value={form.startDate}
                onChange={(e) => set('startDate', e.target.value)}
                aria-invalid={!!fieldErrors.startDate}
                className={
                  fieldErrors.startDate
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: fieldErrors.startDate }]} />
            </Field>

            <Field data-invalid={!!fieldErrors.endDate}>
              <FieldLabel className='text-sm font-semibold'>
                End Date
              </FieldLabel>
              <Input
                type='date'
                value={form.endDate}
                onChange={(e) => set('endDate', e.target.value)}
                aria-invalid={!!fieldErrors.endDate}
                className={
                  fieldErrors.endDate
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
              />
              <FieldError errors={[{ message: fieldErrors.endDate }]} />
            </Field>
          </div>

          {/* Broker Notes */}
          <Field data-invalid={!!fieldErrors.brokerNotes}>
            <FieldLabel className='text-sm font-semibold'>
              Broker Notes
            </FieldLabel>
            <Textarea
              placeholder='Notes from mortgage adviser...'
              rows={4}
              value={form.brokerNotes}
              onChange={(e) => set('brokerNotes', e.target.value)}
              aria-invalid={!!fieldErrors.brokerNotes}
              className={
                fieldErrors.brokerNotes
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: fieldErrors.brokerNotes }]} />
          </Field>
        </div>

        {/* Footer */}
        <div className='flex shrink-0 items-center justify-end gap-3 border-t px-6 py-4'>
          <Button variant='outline' onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Add Mortgage
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMortgageDialog;
