import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AddablePropertieCardProps } from '@/types/client/Common/Tools/Permission/PermissionTypes';
import formatChoiceFieldValue from '@/utils/formatters';
import { Check } from 'lucide-react';

const AddablePropertieCard: React.FC<AddablePropertieCardProps> = ({
  item,
  selected,
  toggleProperty,
}) => {
  return (
    <Card
      key={item.alias}
      role='button'
      tabIndex={0}
      onClick={() => toggleProperty(item.alias)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleProperty(item.alias);
        }
      }}
      className={cn(
        'group relative cursor-pointer p-3.5 pr-9 text-left transition-all hover:shadow-sm',
        selected && 'border-primary/40 bg-primary/5 ring-primary/20 ring-2',
      )}
    >
      <div className='truncate text-sm font-medium'>
        {item.address || 'Untitled property'}
      </div>

      {item.property_type && (
        <Badge className='bg-primary/30 mt-1 truncate text-xs text-black dark:text-white'>
          {formatChoiceFieldValue(item.property_type)}
        </Badge>
      )}

      <span
        className={cn(
          'absolute top-6 right-3 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border transition-colors',
          selected
            ? 'border-primary bg-primary'
            : 'border-primary/70 bg-background group-hover:border-primary',
        )}
      >
        {selected && (
          <Check className='text-primary-foreground h-3 w-3' strokeWidth={3} />
        )}
      </span>
      {item.status && (
        <Badge
          variant='secondary'
          className='bg-secondary/30 absolute right-2 bottom-2 mt-1 truncate text-xs text-black dark:text-white'
        >
          {formatChoiceFieldValue(item.status)}
        </Badge>
      )}
    </Card>
  );
};

export default AddablePropertieCard;
