'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyInfoProps } from '@/types/client/Common/Properties/PropertyDetailsTypes';
import { formatDate } from '@/utils/formatters';
import {
  Bath,
  Bed,
  Building2,
  CalendarDays,
  Landmark,
  ScrollText,
  Users,
} from 'lucide-react';

const TYPE_LABELS: Record<string, string> = {
  RESIDENTIAL: 'Residential',
  HMO: 'HMO',
  COMMERCIAL: 'Commercial',
  MIXED_USE: 'Mixed Use',
  HOLIDAY_LET: 'Holiday Let',
};

const OWNER_LABELS: Record<string, string> = {
  OWNER: 'Individual Owner(s)',
  COMPANY: 'Company (Shareholders)',
};

const TENURE_LABELS: Record<string, string> = {
  FREEHOLD: 'Freehold',
  LEASEHOLD: 'Leasehold',
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

const PropertyInfo: React.FC<PropertyInfoProps> = ({ property }) => {
  const isLeasehold = property.property_tenure === 'LEASEHOLD';

  return (
    <Card className='border-border rounded-2xl shadow-sm'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-base font-semibold'>
          Property Details
        </CardTitle>
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

        {property.property_owner && (
          <InfoRow
            label='Owner'
            value={
              <span className='flex items-center gap-1.5'>
                <Users className='text-primary size-3.5' />
                {OWNER_LABELS[property.property_owner] ??
                  property.property_owner}
              </span>
            }
          />
        )}

        {property.shareholder?.length > 0 && (
          <InfoRow
            label={
              property.property_owner === 'COMPANY' ? 'Shareholders' : 'Owners'
            }
            value={
              <div className='flex flex-col items-end gap-0.5'>
                {property.shareholder.map((item, i) =>
                  'shareholder_name' in item ? (
                    <span key={i}>
                      {item.shareholder_name}
                      {item.share_percentage != null &&
                        ` (${item.share_percentage}%)`}
                    </span>
                  ) : (
                    <span key={i}>{item.owner_name}</span>
                  ),
                )}
              </div>
            }
          />
        )}

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

        {property.year_built != null && (
          <InfoRow label='Year Built' value={property.year_built} />
        )}

        {property.property_tenure && (
          <InfoRow
            label='Tenure'
            value={
              <span className='flex items-center gap-1.5'>
                <ScrollText className='text-primary size-3.5' />
                {TENURE_LABELS[property.property_tenure] ??
                  property.property_tenure}
              </span>
            }
          />
        )}

        {isLeasehold && property.remaining_lease_term != null && (
          <InfoRow
            label='Remaining Lease Term'
            value={`${property.remaining_lease_term} yrs`}
          />
        )}

        {property.council_tax_band && (
          <InfoRow label='Council Tax Band' value={property.council_tax_band} />
        )}

        {property.local_authority && (
          <InfoRow
            label='Local Authority'
            value={
              <span className='flex items-center gap-1.5'>
                <Landmark className='text-primary size-3.5' />
                {property.local_authority}
              </span>
            }
          />
        )}

        <InfoRow
          label='Purchase Date'
          value={
            <span className='flex items-center gap-1.5'>
              <CalendarDays className='text-primary size-3.5' />
              {property.purchase_date
                ? formatDate(property.purchase_date)
                : '—'}
            </span>
          }
        />
      </CardContent>
    </Card>
  );
};

export default PropertyInfo;
