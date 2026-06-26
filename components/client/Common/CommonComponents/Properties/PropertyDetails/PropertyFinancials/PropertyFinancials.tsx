'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyFinancialsProps } from '@/types/client/Common/Properties/PropertyDetailsTypes';
import { getCurrencySign } from '@/utils/formatters';

const fmt = (val: string | null) => {
  if (!val) return '—';
  return `${getCurrencySign()}${parseFloat(val).toLocaleString()}`;
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
  return (
    <Card className='border-border rounded-2xl shadow-sm'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-base font-semibold'>Financials</CardTitle>
      </CardHeader>
      <CardContent className='divide-border divide-y px-5 pb-4'>
        <InfoRow
          label='Rent / Month'
          value={
            property.rent_per_month ? (
              <span className='text-primary font-bold'>
                {fmt(property.rent_per_month)}/mo
              </span>
            ) : (
              '—'
            )
          }
        />
        <InfoRow label='Purchase Price' value={fmt(property.purchase_price)} />
        <InfoRow label='Current Value' value={fmt(property.current_value)} />
      </CardContent>
    </Card>
  );
};

export default PropertyFinancials;
