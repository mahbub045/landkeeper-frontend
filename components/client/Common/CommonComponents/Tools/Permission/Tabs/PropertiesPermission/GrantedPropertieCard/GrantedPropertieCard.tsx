import Loading from '@/components/common/CustomLoader/Loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { GrantedPropertieCardProps } from '@/types/client/Common/Tools/Permission/PermissionTypes';
import { formatChoiceFieldValue } from '@/utils/formatters';

const GrantedPropertieCard: React.FC<GrantedPropertieCardProps> = ({
  item,
  isPending,
  handleToggleCanEdit,
  handleRevoke,
}) => {
  return (
    <Card key={item.alias} className='p-3.5'>
      <div className='truncate text-sm font-medium'>
        {item.property.address || 'Untitled property'}
      </div>
      {item.property.property_type && (
        <Badge
          variant='default'
          className='bg-primary/30 absolute right-2 bottom-2 mt-1 truncate text-xs text-black dark:text-white'
        >
          {formatChoiceFieldValue(item.property.property_type)}
        </Badge>
      )}

      {item.property.status && (
        <Badge
          variant='secondary'
          className='bg-secondary/30 absolute right-2 bottom-2 mt-1 truncate text-xs text-black dark:text-white'
        >
          {formatChoiceFieldValue(item.property.status)}
        </Badge>
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
            className='cursor-pointer'
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
          variant='ghost'
          size='sm'
          disabled={isPending}
          onClick={() => handleRevoke(item.alias)}
          className='text-destructive hover:text-destructive h-auto p-0 text-xs'
        >
          {isPending ? <Loading className='h-3.5 w-3.5' /> : 'Revoke'}
        </Button>
      </div>
    </Card>
  );
};

export default GrantedPropertieCard;
