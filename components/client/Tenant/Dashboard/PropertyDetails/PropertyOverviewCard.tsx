'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  OverviewStatProps,
  TenantPropertyOverviewCardProps,
} from '@/types/client/Tenant/Dashboard/DashboardsTypes';
import formatChoiceFieldValue from '@/utils/formatters';
import {
  Bath,
  Bed,
  Building2,
  CalendarDays,
  ScrollText,
  Users,
} from 'lucide-react';

const OverviewStat: React.FC<OverviewStatProps> = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className='bg-muted/40 flex items-center gap-3 rounded-xl p-3'>
    <div className='bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg'>
      <Icon className='size-4' />
    </div>
    <div className='min-w-0'>
      <p className='text-muted-foreground text-xs'>{label}</p>
      <p className='text-foreground truncate text-sm font-semibold'>
        {value ?? '—'}
      </p>
    </div>
  </div>
);

const PropertyOverviewCard: React.FC<TenantPropertyOverviewCardProps> = ({
  property,
}) => {
  const owner =
    property.property_owner === 'COMPANY' && property.company_name
      ? property.company_name
      : formatChoiceFieldValue(property.property_owner) || null;

  return (
    <Card className='border-border h-full rounded-2xl shadow-sm'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-base font-semibold'>
          Property Overview
        </CardTitle>
      </CardHeader>
      <CardContent className='grid flex-1 auto-rows-fr grid-cols-2 gap-3 px-5 pb-5 sm:grid-cols-3'>
        <OverviewStat
          icon={Building2}
          label='Type'
          value={formatChoiceFieldValue(property.property_type)}
        />
        <OverviewStat icon={Bed} label='Bedrooms' value={property.bedrooms} />
        <OverviewStat
          icon={Bath}
          label='Bathrooms'
          value={property.bathrooms}
        />
        <OverviewStat
          icon={ScrollText}
          label='Tenure'
          value={formatChoiceFieldValue(property.property_tenure) || null}
        />
        <OverviewStat
          icon={CalendarDays}
          label='Year Built'
          value={property.year_built}
        />
        <OverviewStat icon={Users} label='Ownership' value={owner} />
      </CardContent>
    </Card>
  );
};

export default PropertyOverviewCard;
