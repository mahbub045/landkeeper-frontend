'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  InfoRowProps,
  InfoSectionProps,
  PersonalInfoProps,
} from '@/types/super-admin/Landlords/Overview/OverviewType';
import { Hash, IdCard, Mail, MapPin, Pencil, Phone, User } from 'lucide-react';
import { useState } from 'react';
import EditPersonalInfoDialog from './Dialogs/EditPersonalInfoDialog';

const NOT_PROVIDED = 'Not provided';

/** Card with a titled header. Also used by AccountDetails */
export const InfoSection: React.FC<InfoSectionProps> = ({
  title,
  icon: Icon,
  action,
  children,
}) => (
  <div className='ring-foreground/10 rounded-xl ring-1'>
    <div className='flex min-h-12 items-center gap-2 border-b px-5 py-2'>
      <Icon className='text-primary size-4' />
      <h3 className='text-sm font-semibold'>{title}</h3>
      {action && <div className='ml-auto'>{action}</div>}
    </div>
    <div className='divide-y px-5'>{children}</div>
  </div>
);

/** Label/value row. Also used by AccountDetails */
export const InfoRow: React.FC<InfoRowProps> = ({
  icon: Icon,
  label,
  value,
}) => {
  const isEmpty = value == null || value === '';
  return (
    <div className='flex items-start gap-3 py-3'>
      <Icon className='text-muted-foreground mt-0.5 size-4 shrink-0' />
      <div className='flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4'>
        <span className='text-muted-foreground text-sm'>{label}</span>
        <span
          className={cn(
            'truncate text-sm font-medium sm:text-right',
            isEmpty && 'text-muted-foreground/70 font-normal italic',
          )}
        >
          {isEmpty ? NOT_PROVIDED : value}
        </span>
      </div>
    </div>
  );
};

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  landlord,
  landlord_alias,
  fullName,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <InfoSection
        title='Personal Information'
        icon={User}
        action={
          <Button
            type='button'
            size='xs'
            variant='default'
            onClick={() => setIsEditOpen(true)}
          >
            <Pencil />
            Edit
          </Button>
        }
      >
        <InfoRow icon={User} label='Full Name' value={fullName} />
        <InfoRow icon={Mail} label='Email' value={landlord.email} />
        <InfoRow icon={Phone} label='Phone' value={landlord.phone} />
        <InfoRow
          icon={MapPin}
          label='Current Address'
          value={landlord.current_address}
        />
        <InfoRow icon={IdCard} label='NI Number' value={landlord.ni_number} />
        <InfoRow icon={Hash} label='UTR Number' value={landlord.utr_number} />
      </InfoSection>

      <EditPersonalInfoDialog
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        landlord={landlord}
        landlord_alias={landlord_alias}
      />
    </>
  );
};

export default PersonalInfo;
