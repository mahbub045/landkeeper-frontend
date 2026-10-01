import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PLAN_STYLES } from '@/data/super-admin/Landlords/LandlordData';
import { cn } from '@/lib/utils';
import { useGetlandlordDetailsQuery } from '@/store/api/endpoints/super-admin/Landlords/LandlordOverview/LandlordOverviewApi';
import { LandlordType } from '@/types/super-admin/Landlords/LandlordOverview/LandlordOverviewType';
import {
  formatChoiceFieldValue,
  formatDate,
  formatDateAndTime,
} from '@/utils/formatters';
import {
  BadgeCheck,
  CalendarDays,
  CreditCard,
  Crown,
  Hash,
  IdCard,
  KeyRound,
  LucideIcon,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  Timer,
  User,
} from 'lucide-react';

const NOT_PROVIDED = 'Not provided';

const SubscriptionBadge: React.FC<{ landlord: LandlordType }> = ({
  landlord,
}) => {
  if (landlord.subscription_status)
    return (
      <Badge
        variant={
          landlord.subscription_status === 'ACTIVE'
            ? 'successLight'
            : 'warningLight'
        }
      >
        {formatChoiceFieldValue(landlord.subscription_status)}
      </Badge>
    );
  if (landlord.trial_days_left != null)
    return (
      <Badge variant='infoLight'>
        {landlord.trial_days_left} trial days left
      </Badge>
    );
  return <Badge variant='dangerLight'>Unsubscribed</Badge>;
};

const StatTile: React.FC<{
  icon: LucideIcon;
  color: string;
  label: string;
  children: React.ReactNode;
}> = ({ icon: Icon, color, label, children }) => (
  <div className='bg-card ring-foreground/10 flex items-center gap-3 rounded-xl p-4 ring-1'>
    <div
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-lg',
        color,
      )}
    >
      <Icon className='size-5' />
    </div>
    <div className='min-w-0'>
      <p className='text-muted-foreground text-xs'>{label}</p>
      <div className='mt-0.5 truncate text-sm font-semibold'>{children}</div>
    </div>
  </div>
);

const InfoRow: React.FC<{
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

const InfoSection: React.FC<{
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

const OverviewSkeleton: React.FC = () => (
  <div className='space-y-6'>
    <Skeleton className='h-32 w-full rounded-xl' />
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className='h-18 rounded-xl' />
      ))}
    </div>
    <div className='grid gap-6 xl:grid-cols-2'>
      <Skeleton className='h-80 rounded-xl' />
      <Skeleton className='h-80 rounded-xl' />
    </div>
  </div>
);

const OverviewTab: React.FC<{ landlord_uid: string }> = ({ landlord_uid }) => {
  const {
    data: landlord,
    isLoading,
    isError,
  } = useGetlandlordDetailsQuery({ landlord_uid });

  if (isLoading) return <OverviewSkeleton />;
  if (isError || !landlord)
    return <CustomErrorMessage title='landlord details' />;

  const fullName = [
    formatChoiceFieldValue(landlord.title),
    landlord.first_name,
    landlord.middle_name,
    landlord.last_name,
  ]
    .filter(Boolean)
    .join(' ');
  const initials =
    `${landlord.first_name?.[0] ?? ''}${landlord.last_name?.[0] ?? ''}`.toUpperCase();

  return (
    <div className='space-y-6'>
      {/* Profile header */}
      <Card className='from-primary/10 via-card to-card relative gap-0 bg-linear-to-br p-5 sm:p-6'>
        <div className='flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex min-w-0 items-center gap-4'>
            <div className='relative shrink-0'>
              <Avatar className='ring-background size-16 ring-4 sm:size-20'>
                {landlord.profile_image && (
                  <AvatarImage src={landlord.profile_image} alt={fullName} />
                )}
                <AvatarFallback className='bg-primary text-primary-foreground text-xl font-semibold'>
                  {initials || '?'}
                </AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  'ring-card absolute right-1 bottom-1 size-3.5 rounded-full ring-2',
                  landlord.is_active ? 'bg-emerald-500' : 'bg-red-500',
                )}
              />
            </div>

            <div className='min-w-0'>
              <h2 className='truncate text-xl font-semibold tracking-tight'>
                {fullName}
              </h2>
              <p className='text-muted-foreground mt-0.5 flex items-center gap-1.5 truncate text-sm'>
                <Mail className='size-3.5 shrink-0' />
                {landlord.email}
              </p>
              <div className='mt-2 flex flex-wrap items-center gap-2'>
                <Badge variant='outline'>
                  {formatChoiceFieldValue(landlord.role)}
                </Badge>
                <Badge
                  variant={landlord.is_active ? 'successLight' : 'dangerLight'}
                >
                  {landlord.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-2 sm:flex-col sm:items-end'>
            {landlord.has_subscription && landlord.plan ? (
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
                  PLAN_STYLES[landlord.plan],
                )}
              >
                <Crown className='size-3.5' />
                {formatChoiceFieldValue(landlord.plan)} Plan
              </span>
            ) : (
              <Badge variant='outline' className='text-muted-foreground'>
                No plan active
              </Badge>
            )}
            <SubscriptionBadge landlord={landlord} />
          </div>
        </div>
      </Card>

      {/* Quick stats */}
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <StatTile
          icon={BadgeCheck}
          label='Account Status'
          color={
            landlord.is_active
              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
          }
        >
          {landlord.is_active ? 'Active' : 'Inactive'}
        </StatTile>
        <StatTile
          icon={Crown}
          label='Current Plan'
          color='bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
        >
          {landlord.plan ? formatChoiceFieldValue(landlord.plan) : 'None'}
        </StatTile>
        <StatTile
          icon={CreditCard}
          label='Subscription'
          color='bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400'
        >
          {landlord.subscription_status
            ? formatChoiceFieldValue(landlord.subscription_status)
            : landlord.trial_days_left != null
              ? `Trial · ${landlord.trial_days_left} days left`
              : 'Unsubscribed'}
        </StatTile>
        <StatTile
          icon={CalendarDays}
          label='Member Since'
          color='bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400'
        >
          {formatDate(landlord.created_at)}
        </StatTile>
      </div>

      {/* Details */}
      <div className='grid gap-6 xl:grid-cols-2'>
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

        <InfoSection title='Account Details' icon={ShieldCheck}>
          <InfoRow
            icon={ShieldCheck}
            label='Role'
            value={formatChoiceFieldValue(landlord.role)}
          />
          <InfoRow
            icon={KeyRound}
            label='Password'
            value={
              landlord.is_password_available ? (
                <Badge variant='successLight'>Set</Badge>
              ) : (
                <Badge variant='warningLight'>Not set</Badge>
              )
            }
          />
          <InfoRow
            icon={CreditCard}
            label='Subscription'
            value={<SubscriptionBadge landlord={landlord} />}
          />
          <InfoRow
            icon={Timer}
            label='Trial Days Left'
            value={landlord.trial_days_left ?? '—'}
          />
          <InfoRow
            icon={CalendarDays}
            label='Joined'
            value={formatDateAndTime(landlord.created_at)}
          />
          <InfoRow
            icon={RefreshCw}
            label='Last Updated'
            value={formatDateAndTime(landlord.updated_at)}
          />
        </InfoSection>
      </div>
    </div>
  );
};

export default OverviewTab;
