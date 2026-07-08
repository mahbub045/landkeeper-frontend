'use client';

import Loading from '@/components/common/CustomLoader/Loading';
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
  PRODUCT_TYPE_OPTIONS,
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

import { useState } from 'react';
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

  const { data, isLoading } = useFilterPropertiesQuery(
    propertySearch ? { search: propertySearch } : {},
    { skip: !propertyOpen },
  );
  const [addMortgage] = useAddMortgagesMutation();

  const [form, setForm] = useState<MortgageForm>(EMPTY_MORTGAGE_FORM);

  function set(key: keyof MortgageForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ── Reset ───────────────────────────────────────────────────────────────────

  function handleClose() {
    setBannerError(null);
    setFieldErrors({});
    setLoading(false);
    setForm(EMPTY_MORTGAGE_FORM);
    onClose();
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const guardErrors: Record<string, string> = {};
    if (!form.productType)
      guardErrors.productType = 'Please select a product type.';

    if (Object.keys(guardErrors).length > 0) {
      setFieldErrors(guardErrors);
      setLoading(false);
      return;
    }
    setBannerError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      const payload = {
        property: form.propertyId,
        lender_name: form.lenderName,
        product_type: form.productType,
        interest_rate: form.interestRate,
        loan_amount: form.loanAmount,
        outstanding_balance: form.outstandingBalance,
        monthly_payment: form.monthlyPayment,
        term: Number(form.termYears),
        start_date: form.startDate || null,
        end_date: form.endDate || null,
        broker_notes: form.brokerNotes,
      };

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
          <DialogDescription className='text-muted-foreground mt-1 text-sm'>
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
                  set('propertyId', ''); // clear selection when user types
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
              type='text'
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

          {/* Product Type + Interest Rate */}
          <div className='grid grid-cols-2 gap-4'>
            <Field data-invalid={!!fieldErrors.productType}>
              <FieldLabel className='gap-0 text-sm font-semibold'>
                Product Type<span className='text-danger'>*</span>
              </FieldLabel>
              <Select
                value={form.productType}
                onValueChange={(v) => set('productType', v)}
              >
                <SelectTrigger
                  aria-invalid={!!fieldErrors.productType}
                  className={
                    fieldErrors.productType
                      ? 'border-danger focus-visible:ring-danger/50'
                      : ''
                  }
                >
                  <SelectValue placeholder='Select Product Type' />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
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
                placeholder={getCurrencySign()}
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

          {/* Monthly Payment + Term */}
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
            {/* Start Date */}
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

            {/* End Date */}
            <Field data-invalid={!!fieldErrors.endDate}>
              <FieldLabel className='text-sm font-semibold'>
                End Date
              </FieldLabel>
              <Input
                type='date'
                value={form.endDate}
                min={form.startDate || undefined}
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
