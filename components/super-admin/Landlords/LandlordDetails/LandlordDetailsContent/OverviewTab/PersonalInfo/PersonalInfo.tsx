import { cn } from '@/lib/utils';
import { LandlordType } from '@/types/super-admin/Landlords/Overview/OverviewType';
import {
  Hash,
  IdCard,
  LucideIcon,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react';

const NOT_PROVIDED = 'Not provided';

/** Card with a titled header. Also used by AccountDetails */
export const InfoSection: React.FC<{
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}> = ({ title, icon: Icon, children }) => (
  <div className='ring-foreground/10 rounded-xl ring-1'>
    <div className='flex items-center gap-2 border-b px-5 py-3'>
      <Icon className='text-primary size-4' />
      <h3 className='text-sm font-semibold'>{title}</h3>
    </div>
    <div className='divide-y px-5'>{children}</div>
  </div>
);

/** Label/value row. Also used by AccountDetails */
export const InfoRow: React.FC<{
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
}> = ({ icon: Icon, label, value }) => {
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

interface PersonalInfoProps {
  landlord: LandlordType;
  fullName: string;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ landlord, fullName }) => (
  <InfoSection title='Personal Information' icon={User}>
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
);

export default PersonalInfo;
