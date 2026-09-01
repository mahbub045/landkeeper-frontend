import Loading from '@/components/common/CustomLoader/Loading';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { GrantedPropertieCardProps } from '@/types/client/Common/Tools/Permission/PermissionTypes';
import { formatChoiceFieldValue } from '@/utils/formatters';
import { ImageOff, X } from 'lucide-react';
import Image from 'next/image';

const GrantedPropertieCard: React.FC<GrantedPropertieCardProps> = ({
  item,
  isPending,
  handleToggleCanEdit,
  handleRevoke,
}) => {
  const thumbnail = item.property.documents?.[0]?.image;

  return (
    <Card key={item.alias} className='relative overflow-hidden p-3.5'>
      <div className='-mx-3.5 -mt-3.5 mb-3'>
        <AspectRatio ratio={16 / 9} className='bg-muted relative'>
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={item.property.address || 'Property image'}
              fill
              className='object-cover'
              sizes='(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
            />
          ) : (
            <div className='text-muted-foreground flex h-full w-full items-center justify-center'>
              <ImageOff className='h-6 w-6' />
            </div>
          )}
        </AspectRatio>
      </div>

      <div className='flex justify-between gap-1'>
        <div className='truncate text-sm font-medium'>
          {item.property.address || 'Untitled property'}
        </div>
        {item.property.property_type && (
          <Badge variant='default' className='bg-primary/70 truncate text-xs'>
            {formatChoiceFieldValue(item.property.property_type)}
          </Badge>
        )}
      </div>

      {item.property.status && (
        <Badge
          variant='secondary'
          className='bg-secondary/70 absolute top-2 right-2 mt-1 truncate text-xs'
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

export default GrantedPropertieCard;
