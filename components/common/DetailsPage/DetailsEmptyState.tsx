import { cn } from '@/lib/utils';
import { DetailsEmptyStateProps } from '@/types/common/DetailsPage/DetailsPageTypes';

const DetailsEmptyState: React.FC<DetailsEmptyStateProps> = ({
  icon: Icon,
  message,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-muted/20 border-warning/50 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-10 text-center',
        className,
      )}
    >
      <span className='bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-full'>
        <Icon className='size-5' />
      </span>
      <p className='text-muted-foreground text-sm'>{message}</p>
    </div>
  );
};

export default DetailsEmptyState;
