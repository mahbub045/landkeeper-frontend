'use client';

import DetailsSection from '@/components/common/DetailsPage/DetailsSection';
import { PropertyFinancialsProps } from '@/types/client/Common/Properties/PropertyDetailsTypes';
import { getCurrencySign } from '@/utils/formatters';
import { Wallet } from 'lucide-react';

const fmt = (val: string | number | null | undefined) => {
  if (val === null || val === undefined || val === '') return '—';
  const n = typeof val === 'number' ? val : parseFloat(val);
  return isNaN(n) ? '—' : `${getCurrencySign()}${n.toLocaleString()}`;
};

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className='flex items-start justify-between gap-4 py-2.5'>
    <span className='text-muted-foreground text-sm'>{label}</span>
    <span className='text-foreground text-right text-sm font-medium'>
      {value}
    </span>
  </div>
);

const PropertyFinancials: React.FC<PropertyFinancialsProps> = ({
  property,
}) => {
  const isLeasehold = property.property_tenure === 'LEASEHOLD';

  return (
    <DetailsSection title='Financials' icon={Wallet} className='h-full'>
      {/* Headline rent figure */}
      <div className='bg-primary/5 border-primary/15 mb-3 rounded-xl border p-4'>
        <p className='text-muted-foreground text-xs'>Rent / Month</p>
        <p className='text-primary mt-0.5 text-2xl font-bold tracking-tight'>
          {property.monthly_rental_income
            ? `${fmt(property.monthly_rental_income)}/mo`
            : '—'}
        </p>
      </div>

      <div className='divide-border divide-y'>
        <InfoRow label='Purchase Price' value={fmt(property.purchase_price)} />
        <InfoRow label='Current Value' value={fmt(property.current_value)} />

        {isLeasehold && (
          <>
            <InfoRow
              label='Monthly Service Charge'
              value={fmt(property.monthly_service_charge)}
            />
            <InfoRow
              label='Annual Ground Rent'
              value={fmt(property.annual_ground_rent)}
            />
          </>
        )}
      </div>
    </DetailsSection>
  );
};

export default PropertyFinancials;
