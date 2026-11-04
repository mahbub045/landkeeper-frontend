import { Button } from '@/components/ui/button';
import { DetailsDangerZoneProps } from '@/types/common/DetailsPage/DetailsPageTypes';
import { AlertTriangle, Trash2 } from 'lucide-react';
import DetailsSection from './DetailsSection';

const DetailsDangerZone: React.FC<DetailsDangerZoneProps> = ({
  title,
  description,
  onDeleteClick,
  buttonLabel = 'Delete',
}) => {
  return (
    <DetailsSection title='Danger Zone' icon={AlertTriangle} tone='danger'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <p className='text-foreground text-sm font-medium'>{title}</p>
          <p className='text-muted-foreground mt-0.5 text-xs'>{description}</p>
        </div>
        <Button
          variant='destructive'
          size='sm'
          className='shrink-0 self-start sm:self-auto'
          onClick={onDeleteClick}
        >
          <Trash2 className='size-3.5' />
          {buttonLabel}
        </Button>
      </div>
    </DetailsSection>
  );
};

export default DetailsDangerZone;
