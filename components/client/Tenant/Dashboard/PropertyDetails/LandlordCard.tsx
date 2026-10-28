'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ContactRowProps,
  TenantLandlordCardProps,
} from '@/types/client/Tenant/Dashboard/DashboardsTypes';
import { getInitials } from '@/utils/formatters';
import { MapPin, Phone, UserRound } from 'lucide-react';

const ContactRow: React.FC<ContactRowProps> = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className='flex items-start gap-3 py-2.5'>
    <Icon className='text-primary mt-0.5 size-4 shrink-0' />
    <div className='min-w-0'>
      <p className='text-muted-foreground text-xs'>{label}</p>
      {value ? (
        <p className='text-foreground text-sm font-medium wrap-break-word'>
          {value}
        </p>
      ) : (
        <p className='text-muted-foreground text-sm italic'>Not provided</p>
      )}
    </div>
  </div>
);

const LandlordCard: React.FC<TenantLandlordCardProps> = ({ landlord }) => {
  return (
    <Card className='border-border h-full rounded-2xl shadow-sm'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-base font-semibold'>Your Landlord</CardTitle>
      </CardHeader>
      <CardContent className='px-5 pb-1'>
        <div className='border-border flex items-center gap-3 border-b pb-4'>
          <div className='bg-primary text-primary-foreground flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold'>
            {getInitials(landlord.name)}
          </div>
          <p className='text-foreground text-sm leading-snug font-semibold'>
            {landlord.name}
          </p>
        </div>
        <div className='divide-border divide-y'>
          <ContactRow
            icon={UserRound}
            label='Contact Person'
            value={landlord.contact_person}
          />
          <ContactRow icon={Phone} label='Mobile' value={landlord.mobile} />
          <ContactRow icon={MapPin} label='Address' value={landlord.address} />
        </div>
      </CardContent>
    </Card>
  );
};

export default LandlordCard;
