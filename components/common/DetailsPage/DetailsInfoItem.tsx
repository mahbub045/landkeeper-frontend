import { cn } from '@/lib/utils';
import { DetailsInfoItemProps } from '@/types/common/DetailsPage/DetailsPageTypes';

const DetailsInfoItem: React.FC<DetailsInfoItemProps> = ({
  icon: Icon,
  label,
  value,
  className,
}) => {
  const isEmpty = value === null || value === undefined || value === '';

  return (
    <div className={cn('flex items-start gap-3', className)}>
      {Icon && (
        <span className='bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg'>
          <Icon className='size-4' />
        </span>
      )}
      <div className='min-w-0'>
        <dt className='text-muted-foreground text-xs'>{label}</dt>
        <dd className='text-foreground text-sm font-medium wrap-break-word'>
          {isEmpty ? (
            <span className='text-muted-foreground font-normal'>
              Not available
            </span>
          ) : (
            value
          )}
        </dd>
      </div>
    </div>
  );
};

export default DetailsInfoItem;
