import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PLAN_STYLES } from '@/data/super-admin/Landlords/LandlordData';
import { cn } from '@/lib/utils';
import {
  LandlordProps,
  ProfileHeaderProps,
} from '@/types/super-admin/Landlords/Overview/OverviewType';
import { formatChoiceFieldValue } from '@/utils/formatters';
import { Crown, Mail } from 'lucide-react';

/** Also used by AccountDetails */
export const SubscriptionBadge: React.FC<LandlordProps> = ({ landlord }) => {
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

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  landlord,
  fullName,
}) => {
  const initials =
    `${landlord.first_name?.[0] ?? ''}${landlord.last_name?.[0] ?? ''}`.toUpperCase();
  const hasPlan = landlord.has_subscription && Boolean(landlord.plan);

  return (
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
              <Badge
                variant={landlord.is_active ? 'successLight' : 'dangerLight'}
              >
                {landlord.is_active ? 'Account Active' : 'Account Inactive'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Current plan panel */}
        <div className='bg-card/70 ring-foreground/10 flex items-center gap-3 rounded-xl px-4 py-3 shadow-sm ring-1 backdrop-blur-sm sm:min-w-56'>
          <div
            className={cn(
              'flex size-11 shrink-0 items-center justify-center rounded-lg',
              hasPlan
                ? PLAN_STYLES[landlord.plan!]
                : 'bg-muted text-muted-foreground',
            )}
          >
            <Crown className='size-5' />
          </div>

          <div className='min-w-0 flex-1'>
            <p className='text-muted-foreground text-[11px] font-medium tracking-wider uppercase'>
              Current Plan
            </p>
            <p className='truncate text-base leading-tight font-semibold'>
              {hasPlan
                ? `${formatChoiceFieldValue(landlord.plan)} Plan`
                : 'No active plan'}
            </p>
            <div className='mt-1.5'>
              <SubscriptionBadge landlord={landlord} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileHeader;
