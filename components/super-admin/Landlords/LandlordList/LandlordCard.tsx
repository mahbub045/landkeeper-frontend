import { CalendarDays, Crown, Mail, Phone } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PLAN_STYLES } from '@/data/super-admin/Landlords/LandlordData';
import { cn } from '@/lib/utils';
import { LandlordType } from '@/types/super-admin/Landlords/Overview/OverviewType';
import { formatChoiceFieldValue, formatDate } from '@/utils/formatters';
import Link from 'next/link';

const LandlordCard: React.FC<{ landlord: LandlordType }> = ({ landlord }) => {
  const fullName =
    `${formatChoiceFieldValue(landlord.title)} ${landlord.first_name} ${landlord.middle_name ? landlord.middle_name + ' ' : ''}${landlord.last_name}`.trim();
  const initials =
    `${landlord.first_name?.[0] ?? ''}${landlord.last_name?.[0] ?? ''}`.toUpperCase();

  return (
    <Link href={`/super-admin/landlords/${landlord.alias}`}>
      <Card
        glow
        glowClassName='h-full'
        className='border-border h-full rounded-2xl py-0'
      >
        <CardContent className='flex h-full flex-col gap-4 px-5 py-5'>
          <div className='flex items-start gap-3'>
            <Avatar className='size-12 shrink-0'>
              {landlord.profile_image && (
                <AvatarImage src={landlord.profile_image} alt={fullName} />
              )}
              <AvatarFallback className='bg-primary/10 text-primary font-semibold'>
                {initials || '?'}
              </AvatarFallback>
            </Avatar>

            <div className='min-w-0 flex-1'>
              <p
                className='text-foreground truncate font-semibold'
                title={fullName}
              >
                {fullName}
              </p>
              <div className='mt-1 flex items-center gap-1.5'>
                <span
                  className={cn(
                    'size-2 rounded-full',
                    landlord.is_active ? 'bg-emerald-500' : 'bg-red-500',
                  )}
                />
                <span className='text-muted-foreground text-xs'>
                  {landlord.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          <div className='space-y-2 text-sm'>
            <div className='text-muted-foreground flex items-center gap-2'>
              <Mail className='size-4 shrink-0' />
              <span className='truncate' title={landlord.email}>
                {landlord.email}
              </span>
            </div>
            <div className='text-muted-foreground flex items-center gap-2'>
              <Phone className='size-4 shrink-0' />
              <span className='truncate'>
                {landlord.phone || 'Not provided'}
              </span>
            </div>
            <div className='text-muted-foreground flex items-center gap-2'>
              <CalendarDays className='size-4 shrink-0' />
              <span>Joined {formatDate(landlord.created_at)}</span>
            </div>
          </div>

          <div className='border-border mt-auto flex items-center justify-between gap-2 border-t pt-4'>
            {landlord.has_subscription && landlord.plan ? (
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                  PLAN_STYLES[landlord.plan],
                )}
              >
                <Crown className='size-3' />
                {formatChoiceFieldValue(landlord.plan)}
              </span>
            ) : (
              <Badge variant='outline' className='text-muted-foreground'>
                No plan Active
              </Badge>
            )}

            {landlord.subscription_status ? (
              <Badge
                variant={
                  landlord.subscription_status === 'ACTIVE'
                    ? 'successLight'
                    : 'warningLight'
                }
              >
                {formatChoiceFieldValue(landlord.subscription_status)}
              </Badge>
            ) : landlord.trial_days_left != null ? (
              <Badge variant='infoLight'>
                {landlord.trial_days_left} trial days left
              </Badge>
            ) : (
              <Badge variant='dangerLight'>Unsubscribed</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default LandlordCard;
