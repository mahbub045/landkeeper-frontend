import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AddableMortgageCardProps } from '@/types/client/Common/Tools/Permission/MortgagesPermissionTypes';
import formatChoiceFieldValue from '@/utils/formatters';
import { Check } from 'lucide-react';

const AddableMortgageCard: React.FC<AddableMortgageCardProps> = ({
  item,
  selected,
  toggleMortgage,
}) => {
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
        'group relative cursor-pointer p-3.5 text-left transition-all hover:shadow-md',
        selected
          ? 'border-primary ring-primary/20 ring-2'
          : 'hover:border-primary/40',
      )}
    >
      {/* --- selection checkmark --- */}
      <span
        className={cn(
          'absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors',
          selected
            ? 'border-primary bg-primary'
            : 'border-muted-foreground/30 group-hover:border-primary/50',
        )}
      >
        {selected && (
          <Check
            className='text-primary-foreground h-3 w-3'
            strokeWidth={3}
          />
        )}
      </span>

      {/* --- content --- */}
      <div className='space-y-1.5 pr-6'>
        <div className='flex items-start justify-between gap-2'>
          <div className='truncate text-sm font-medium'>
            {item.lender_name || 'Untitled mortgage'}
          </div>
          {item.outstanding_balance != null && (
            <Badge className='bg-primary/70 shrink-0 truncate text-xs'>
              £{item.outstanding_balance.toLocaleString()}
            </Badge>
          )}
        </div>

        {item.property?.address && (
          <div className='text-muted-foreground truncate text-xs'>
            {item.property.address}
          </div>
        )}

        {item.interest_rate_type && (
          <Badge variant='secondary' className='truncate text-xs'>
            {formatChoiceFieldValue(item.interest_rate_type)}
          </Badge>
        )}
      </div>
    </Card>
  );
};

export default AddableMortgageCard;