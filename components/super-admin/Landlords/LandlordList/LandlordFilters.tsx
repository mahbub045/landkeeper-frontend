import {
  CalendarRange,
  Crown,
  CreditCard,
  ListFilter,
  RotateCcw,
  UserCheck,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { LandlordFilterValues } from '@/types/super-admin/Landlords/LandlordOverview/LandlordOverviewType';

export const DEFAULT_LANDLORD_FILTERS: LandlordFilterValues = {
  is_active: 'all',
  subscription_status: 'all',
  plan_type: 'all',
  created_at_from: '',
  created_at_to: '',
};

export const countActiveLandlordFilters = (filters: LandlordFilterValues) =>
  (
    Object.keys(DEFAULT_LANDLORD_FILTERS) as (keyof LandlordFilterValues)[]
  ).filter((key) => filters[key] !== DEFAULT_LANDLORD_FILTERS[key]).length;

export const hasActiveLandlordFilters = (filters: LandlordFilterValues) =>
  countActiveLandlordFilters(filters) > 0;

interface FilterOption {
  value: string;
  label: string;
  dot?: string;
}

const ACCOUNT_STATUS_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All accounts' },
  { value: 'true', label: 'Active', dot: 'bg-emerald-500' },
  { value: 'false', label: 'Inactive', dot: 'bg-red-500' },
];

const SUBSCRIPTION_STATUS_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All subscriptions' },
  { value: 'ACTIVE', label: 'Active', dot: 'bg-emerald-500' },
  { value: 'TRIALING', label: 'Trialing', dot: 'bg-sky-500' },
  { value: 'PENDING', label: 'Pending', dot: 'bg-amber-500' },
  { value: 'PAST_DUE', label: 'Past Due', dot: 'bg-orange-500' },
  { value: 'CANCELLED', label: 'Cancelled', dot: 'bg-red-500' },
  { value: 'EXPIRED', label: 'Expired', dot: 'bg-zinc-400' },
];

const PLAN_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All plans' },
  { value: 'BASIC', label: 'Basic', dot: 'bg-sky-500' },
  { value: 'STANDARD', label: 'Standard', dot: 'bg-violet-500' },
  { value: 'PREMIUM', label: 'Premium', dot: 'bg-amber-500' },
];

const CONTROL_CLASS = 'bg-background h-9! w-full rounded-xl';

const FilterField: React.FC<{
  label: string;
  icon: React.ElementType;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}> = ({ label, icon: Icon, htmlFor, className, children }) => (
  <div className={cn('space-y-1.5', className)}>
    <Label
      htmlFor={htmlFor}
      className='text-muted-foreground flex items-center gap-1.5 text-xs font-medium'
    >
      <Icon className='size-3.5' />
      {label}
    </Label>
    {children}
  </div>
);

const FilterSelect: React.FC<{
  id: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}> = ({ id, value, options, onChange }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger
      id={id}
      className={cn(CONTROL_CLASS, 'focus-visible:ring-0')}
    >
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {options.map((opt) => (
        <SelectItem key={opt.value} value={opt.value}>
          <span className='flex items-center gap-2'>
            {opt.dot && <span className={cn('size-2 rounded-full', opt.dot)} />}
            {opt.label}
          </span>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

interface LandlordFiltersProps {
  filters: LandlordFilterValues;
  onChange: (filters: LandlordFilterValues) => void;
}

const LandlordFilters: React.FC<LandlordFiltersProps> = ({
  filters,
  onChange,
}) => {
  const activeCount = countActiveLandlordFilters(filters);

  function update<K extends keyof LandlordFilterValues>(
    key: K,
    value: LandlordFilterValues[K],
  ) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <Card className='border-border bg-muted/40 animate-in fade-in slide-in-from-top-2 rounded-2xl py-0 shadow-sm duration-200'>
      <CardContent className='space-y-4 px-5 py-4'>
        <div className='flex items-center justify-between'>
          <p className='text-foreground flex items-center gap-2 text-sm font-semibold'>
            <span className='bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg'>
              <ListFilter className='size-4' />
            </span>
            Filter landlords
            {activeCount > 0 && (
              <span className='bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium'>
                {activeCount} applied
              </span>
            )}
          </p>

          <Button
            type='button'
            variant='ghost'
            size='sm'
            disabled={activeCount === 0}
            onClick={() => onChange(DEFAULT_LANDLORD_FILTERS)}
            className='text-muted-foreground hover:text-foreground h-8 rounded-xl'
          >
            <RotateCcw className='size-3.5' />
            Reset
          </Button>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
          <FilterField
            label='Account status'
            icon={UserCheck}
            htmlFor='filter-account-status'
          >
            <FilterSelect
              id='filter-account-status'
              value={filters.is_active}
              options={ACCOUNT_STATUS_OPTIONS}
              onChange={(v) =>
                update('is_active', v as LandlordFilterValues['is_active'])
              }
            />
          </FilterField>

          <FilterField
            label='Subscription'
            icon={CreditCard}
            htmlFor='filter-subscription'
          >
            <FilterSelect
              id='filter-subscription'
              value={filters.subscription_status}
              options={SUBSCRIPTION_STATUS_OPTIONS}
              onChange={(v) =>
                update(
                  'subscription_status',
                  v as LandlordFilterValues['subscription_status'],
                )
              }
            />
          </FilterField>

          <FilterField label='Plan' icon={Crown} htmlFor='filter-plan'>
            <FilterSelect
              id='filter-plan'
              value={filters.plan_type}
              options={PLAN_OPTIONS}
              onChange={(v) =>
                update('plan_type', v as LandlordFilterValues['plan_type'])
              }
            />
          </FilterField>

          <FilterField
            label='Joined between'
            icon={CalendarRange}
            htmlFor='filter-joined-from'
            className='sm:col-span-2 lg:col-span-3 xl:col-span-2'
          >
            <div className='flex items-center gap-2'>
              <Input
                id='filter-joined-from'
                type='date'
                aria-label='Joined from'
                value={filters.created_at_from}
                max={filters.created_at_to || undefined}
                onChange={(e) => update('created_at_from', e.target.value)}
                className={CONTROL_CLASS}
              />
              <span className='text-muted-foreground text-xs'>to</span>
              <Input
                type='date'
                aria-label='Joined to'
                value={filters.created_at_to}
                min={filters.created_at_from || undefined}
                onChange={(e) => update('created_at_to', e.target.value)}
                className={CONTROL_CLASS}
              />
            </div>
          </FilterField>
        </div>
      </CardContent>
    </Card>
  );
};

export default LandlordFilters;
