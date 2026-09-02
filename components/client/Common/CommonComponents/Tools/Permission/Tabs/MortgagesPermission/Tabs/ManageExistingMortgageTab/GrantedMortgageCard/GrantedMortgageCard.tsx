import Loading from '@/components/common/CustomLoader/Loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { epcStyles } from '@/data/client/common/mortgage/MortgageData';
import { cn } from '@/lib/utils';
import { GrantedMortgageCardProps } from '@/types/client/Common/Tools/Permission/MortgagesPermissionTypes';
import { formatChoiceFieldValue, getCurrencySign } from '@/utils/formatters';
import { X } from 'lucide-react';

const GrantedMortgageCard: React.FC<GrantedMortgageCardProps> = ({
  item,
  isPending,
  handleToggleCanEdit,
  handleRevoke,
}) => {
  return (
    <Card
      key={item.alias}
      className='group relative p-3.5 transition-all hover:shadow-md'
    >
      <div className='flex items-start justify-between gap-2'>
        <div className='min-w-0'>
          <div className='truncate text-sm font-medium'>
            {item.mortgage.lender_name || 'Untitled mortgage'}
          </div>
          <div className='text-muted-foreground truncate text-xs'>
            {item.property?.property_type
              ? formatChoiceFieldValue(item.property.property_type)
              : 'Property type unknown'}
          </div>
        </div>

        <div className='flex shrink-0 flex-col items-end gap-1'>
          <Badge variant='default' className='bg-primary/70 truncate text-xs'>
            {item.mortgage.interest_rate_type
              ? formatChoiceFieldValue(item.mortgage.interest_rate_type)
              : 'Rate type N/A'}
          </Badge>
          <Badge
            variant='outline'
            className={cn(
              'truncate font-mono text-xs',
              item.mortgage.epc_rating
                ? epcStyles(item.mortgage.epc_rating)
                : 'text-muted-foreground',
            )}
          >
            EPC {item.mortgage.epc_rating ?? '—'}
          </Badge>
        </div>
      </div>

      <div className='text-muted-foreground truncate text-xs'>
        {item.property?.address || 'Address not provided'}
      </div>

      {/* --- financial stats --- */}
      <div className='mt-3 flex flex-wrap items-end justify-between gap-3 border-t pt-3'>
        <div>
          <p className='text-sm font-semibold'>
            {getCurrencySign()}
            {(item.mortgage.outstanding_balance ?? 0).toLocaleString('en-GB')}
          </p>
          <p className='text-muted-foreground text-xs'>
            Outstanding Balance
          </p>
        </div>

        <div className='flex gap-3 text-right'>
          <div>
            <p className='font-mono text-sm font-semibold'>
              {item.mortgage.interest_rate ?? 0}%
            </p>
            <p className='text-muted-foreground text-xs'>Rate</p>
          </div>
          <div>
            <p className='font-mono text-sm font-semibold'>
              {getCurrencySign()}
              {(item.mortgage.monthly_payment ?? 0).toLocaleString('en-GB')}
            </p>
            <p className='text-muted-foreground text-xs'>Per Month</p>
          </div>
        </div>
      </div>

      <p className='text-muted-foreground mt-1 text-xs'>
        {item.mortgage.remaining_mortgage != null
          ? `${item.mortgage.remaining_mortgage} yrs remaining`
          : 'Remaining term unknown'}
      </p>

      <div className='mt-3 flex items-center justify-between border-t pt-3'>
        <div className='flex items-center gap-2'>
          <Switch
            id={`can-edit-${item.alias}`}
            checked={item.can_edit}
            disabled={isPending}
            onCheckedChange={(checked) =>
              handleToggleCanEdit(item.alias, checked)
            }
            className='bg-success/10 data-[state=checked]:bg-success cursor-pointer'
          />
          <Label
            htmlFor={`can-edit-${item.alias}`}
            className='cursor-pointer text-xs font-normal'
          >
            Can edit
          </Label>
        </div>

        <Button
          type='button'
          variant='destructive'
          size='sm'
          disabled={isPending}
          onClick={() => handleRevoke(item.alias)}
        >
          {isPending ? (
            <Loading className='text-danger! h-3.5 w-3.5' />
          ) : (
            <span className='flex items-center gap-1'>
              <X />
              Revoke Permission
            </span>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default GrantedMortgageCard;