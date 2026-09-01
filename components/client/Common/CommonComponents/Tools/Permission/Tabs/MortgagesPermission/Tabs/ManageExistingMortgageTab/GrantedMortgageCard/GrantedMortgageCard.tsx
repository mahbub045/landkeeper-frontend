import Loading from '@/components/common/CustomLoader/Loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { GrantedMortgageCardProps } from '@/types/client/Common/Tools/Permission/MortgagesPermissionTypes';
import { formatChoiceFieldValue } from '@/utils/formatters';
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
      <div className='flex justify-between gap-1'>
        <div className='truncate text-sm font-medium'>
          {item.mortgage.lender_name || 'Untitled mortgage'}
        </div>
        {item.mortgage.interest_rate_type && (
          <Badge variant='default' className='bg-primary/70 truncate text-xs'>
            {formatChoiceFieldValue(item.mortgage.interest_rate_type)}
          </Badge>
        )}
      </div>

      {item.property?.address && (
        <div className='text-muted-foreground truncate text-xs'>
          {item.property.address}
        </div>
      )}

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