'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyFinancialsProps } from '@/types/client/Common/Properties/PropertyDetailsTypes';
import { getCurrencySign } from '@/utils/formatters';

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
    <Card className='border-border rounded-2xl shadow-sm'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-base font-semibold'>Financials</CardTitle>
      </CardHeader>
      <CardContent className='divide-border divide-y px-5 pb-4'>
        <InfoRow
          label='Rent / Month'
          value={
            property.monthly_rental_income ? (
              <span className='text-primary font-bold'>
                {fmt(property.monthly_rental_income)}/mo
              </span>
            ) : (
              '—'
            )
          }
        />
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
      </CardContent>
    </Card>
  );
};

export default PropertyFinancials;