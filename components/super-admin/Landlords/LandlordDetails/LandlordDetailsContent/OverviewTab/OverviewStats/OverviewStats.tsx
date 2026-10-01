import { cn } from '@/lib/utils';
import { LandlordType } from '@/types/super-admin/Landlords/Overview/OverviewType';
import { formatChoiceFieldValue, formatDate } from '@/utils/formatters';
import {
  BadgeCheck,
  CalendarDays,
  CreditCard,
  Crown,
  LucideIcon,
} from 'lucide-react';

interface StatTileProps {
  icon: LucideIcon;
  color: string;
  label: string;
  children: React.ReactNode;
}

const StatTile: React.FC<StatTileProps> = ({
  icon: Icon,
  color,
  label,
  children,
}) => (
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

const OverviewStats: React.FC<{ landlord: LandlordType }> = ({ landlord }) => (
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
);

export default OverviewStats;
