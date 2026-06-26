'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Property } from '@/types/client/Common/Properties/PropertyTypes';
import { Bath, Bed, Building2, CalendarDays } from 'lucide-react';

interface PropertyInfoProps {
  property: Property;
}

const TYPE_LABELS: Record<string, string> = {
  RESIDENTIAL: 'Residential',
  HMO: 'HMO',
  COMMERCIAL: 'Commercial',
  MIXED_USE: 'Mixed Use',
  HOLIDAY_LET: 'Holiday Let',
};

const formatDate = (iso: string | null) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className='flex items-start justify-between gap-4 py-2.5'>
    <span className='text-muted-foreground text-sm'>{label}</span>
    <span className='text-foreground text-right text-sm font-medium'>{value}</span>
  </div>
);

const PropertyInfo: React.FC<PropertyInfoProps> = ({ property }) => {
  return (
    <Card className='border-border rounded-2xl shadow-sm'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-base font-semibold'>Property Details</CardTitle>
      </CardHeader>
      <CardContent className='divide-border divide-y px-5 pb-4'>
        <InfoRow
          label='Type'
          value={
            <span className='flex items-center gap-1.5'>
              <Building2 className='text-primary size-3.5' />
              {TYPE_LABELS[property.property_type] ?? property.property_type}
            </span>
          }
        />
        {property.bedrooms != null && (
          <InfoRow
            label='Bedrooms'
            value={
              <span className='flex items-center gap-1.5'>
                <Bed className='text-primary size-3.5' />
                {property.bedrooms}
              </span>
            }
          />
        )}
        {property.bathrooms != null && (
          <InfoRow
            label='Bathrooms'
            value={
              <span className='flex items-center gap-1.5'>
                <Bath className='text-primary size-3.5' />
                {property.bathrooms}
              </span>
            }
          />
        )}
        <InfoRow
          label='Purchase Date'
          value={
            <span className='flex items-center gap-1.5'>
              <CalendarDays className='text-primary size-3.5' />
              {formatDate(property.purchase_date)}
            </span>
          }
        />
      </CardContent>
    </Card>
  );
};

export default PropertyInfo;