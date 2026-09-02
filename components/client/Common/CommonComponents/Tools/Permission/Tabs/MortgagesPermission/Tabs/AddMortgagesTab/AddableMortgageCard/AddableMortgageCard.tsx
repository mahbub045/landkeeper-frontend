import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  epcStyles,
  expiryUrgencyStyles,
} from '@/data/client/common/mortgage/MortgageData';
import { cn } from '@/lib/utils';
import { AddableMortgageCardProps } from '@/types/client/Common/Tools/Permission/MortgagesPermissionTypes';
import formatChoiceFieldValue, {
  formatDate,
  getCurrencySign,
  getDaysUntilDue,
} from '@/utils/formatters';
import { Calendar, Check } from 'lucide-react';

const AddableMortgageCard: React.FC<AddableMortgageCardProps> = ({
  item,
  selected,
  toggleMortgage,
}) => {
  const rateExpiryDays = getDaysUntilDue(item.interest_rate_expiry_date);

  return (
    <Card
      key={item.alias}
      role='button'
      tabIndex={0}
      onClick={() => toggleMortgage(item.alias)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleMortgage(item.alias);
        }
      }}
      className={cn(
        'group relative min-w-0 cursor-pointer space-y-2 p-4 text-left transition-all hover:shadow-md sm:p-6',
        selected
          ? 'border-primary ring-primary/20 ring-2'
          : 'hover:border-primary/40',
      )}
    >
      {/* --- selection checkmark --- */}
      <span
        className={cn(
          'absolute top-4 right-4 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors sm:top-6 sm:right-6',
          selected
            ? 'border-primary bg-primary'
            : 'border-muted-foreground/30 group-hover:border-primary/50',
        )}
      >
        {selected && (
          <Check className='text-primary-foreground h-3 w-3' strokeWidth={3} />
        )}
      </span>

      {/* --- header --- */}
      <div className='min-w-0 pr-8'>
        <p className='text-muted-foreground truncate text-sm'>
          {item.property?.address || 'Untitled property'}
        </p>
        <h2 className='mt-0.5 truncate text-lg font-bold'>
          {item.lender_name}
        </h2>
        <p className='text-muted-foreground mt-0.5 text-xs'>
          {formatChoiceFieldValue(item.interest_rate_type)}
          {item.remaining_mortgage != null &&
            ` · ${item.remaining_mortgage} yrs remaining`}
        </p>
      </div>

      {item.epc_rating && (
        <Badge
          variant='outline'
          className={cn(
            'absolute top-4 right-4 font-mono text-xs sm:top-6 sm:right-6',
            epcStyles(item.epc_rating),
          )}
          style={{ marginTop: '1.75rem' }}
        >
          EPC:{item.epc_rating}
        </Badge>
      )}

      {/* --- stats --- */}
      <div className='flex min-w-0 flex-wrap items-end justify-between gap-4'>
        <div className='min-w-0'>
          <p className='truncate text-sm font-bold tracking-tight'>
            {getCurrencySign()}
            {parseFloat(
              item.outstanding_balance?.toString() ?? '0',
            ).toLocaleString('en-GB')}
          </p>
          <p className='text-muted-foreground mt-1 text-xs'>
            Outstanding Balance
          </p>
        </div>

        <div className='mt-4 flex min-w-0 shrink-0 gap-4 text-start sm:gap-6'>
          <div>
            <p className='font-mono text-sm font-semibold'>
              {parseFloat(item.interest_rate?.toString() ?? '0')}%
            </p>
            <p className='text-muted-foreground text-xs'>Rate</p>
          </div>

          <div>
            <p className='font-mono text-sm font-semibold'>
              {getCurrencySign()}
              {parseFloat(
                item?.monthly_payment?.toString() ?? '0',
              ).toLocaleString('en-GB')}
            </p>
            <p className='text-muted-foreground text-xs'>Per Month</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* --- footer --- */}
      <div className='flex items-start gap-3'>
        {item.interest_rate_expiry_date ? (
          <div
            className={cn(
              'flex items-center gap-1.5 text-xs',
              expiryUrgencyStyles(rateExpiryDays),
            )}
          >
            <Calendar className='size-3.5' />
            <span className='min-w-0'>
              Rate fixed until {formatDate(item.interest_rate_expiry_date)}
              {rateExpiryDays !== null && rateExpiryDays >= 0 && (
                <span className='ml-1 opacity-80'>({rateExpiryDays}d)</span>
              )}
            </span>
          </div>
        ) : (
          <div className='text-muted-foreground flex items-center gap-1.5 text-xs'>
            <Calendar className='size-3.5' />
            <span>Rate not fixed</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AddableMortgageCard;
