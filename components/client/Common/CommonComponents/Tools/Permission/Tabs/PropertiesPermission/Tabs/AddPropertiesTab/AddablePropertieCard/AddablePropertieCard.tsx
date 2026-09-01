import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AddablePropertieCardProps } from '@/types/client/Common/Tools/Permission/PermissionTypes';
import formatChoiceFieldValue from '@/utils/formatters';
import { Check, ImageOff } from 'lucide-react';
import Image from 'next/image';

const AddablePropertieCard: React.FC<AddablePropertieCardProps> = ({
  item,
  selected,
  toggleProperty,
}) => {
  const thumbnail = item.documents?.[0]?.image;

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
        'group relative cursor-pointer overflow-hidden p-0 text-left transition-all hover:shadow-md',
        selected
          ? 'border-primary ring-primary/20 ring-2'
          : 'hover:border-primary/40',
      )}
    >
      {/* --- image --- */}
      <div className='relative'>
        <AspectRatio ratio={16 / 9} className='bg-muted relative'>
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={item.address || 'Property image'}
              fill
              className={cn(
                'object-cover transition-transform duration-300',
                'group-hover:scale-105',
              )}
              sizes='(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
            />
          ) : (
            <div className='text-muted-foreground flex h-full w-full items-center justify-center'>
              <ImageOff className='h-6 w-6' />
            </div>
          )}

          {/* dark gradient so overlaid badges/checkmark stay legible on any photo */}
          <div className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent' />

          {/* selection checkmark, overlaid top-right on the image */}
          <span
            className={cn(
              'absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full border-2 shadow-sm transition-colors',
              selected
                ? 'border-primary bg-primary'
                : 'border-white/80 bg-black/20 backdrop-blur-sm group-hover:border-white',
            )}
          >
            {selected && (
              <Check
                className='text-primary-foreground h-3.5 w-3.5'
                strokeWidth={3}
              />
            )}
          </span>

          {/* status badge, overlaid bottom-left on the image */}
          {item.status && (
            <Badge
              variant='secondary'
              className='bg-secondary/90 absolute top-2 left-2 truncate text-xs backdrop-blur-sm'
            >
              {formatChoiceFieldValue(item.status)}
            </Badge>
          )}
        </AspectRatio>
      </div>

      {/* --- content --- */}
      <div className='flex justify-between space-y-1.5 p-3.5'>
        <div className='truncate text-sm font-medium'>
          {item.address || 'Untitled property'}
        </div>

        <div className='flex flex-wrap items-center gap-1.5 pt-0.5'>
          {item.property_type && (
            <Badge className='bg-primary/70 truncate text-xs'>
              {formatChoiceFieldValue(item.property_type)}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AddablePropertieCard;
