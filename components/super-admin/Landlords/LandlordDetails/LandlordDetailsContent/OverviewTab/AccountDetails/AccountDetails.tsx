import { Badge } from '@/components/ui/badge';
import { LandlordProps } from '@/types/super-admin/Landlords/Overview/OverviewType';
import { formatChoiceFieldValue, formatDateAndTime } from '@/utils/formatters';
import {
  CalendarDays,
  CreditCard,
  KeyRound,
  RefreshCw,
  ShieldCheck,
  Timer,
} from 'lucide-react';
import { InfoRow, InfoSection } from '../PersonalInfo/PersonalInfo';
import { SubscriptionBadge } from '../ProfileHeader/ProfileHeader';

const AccountDetails: React.FC<LandlordProps> = ({ landlord }) => (
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
);

export default AccountDetails;
