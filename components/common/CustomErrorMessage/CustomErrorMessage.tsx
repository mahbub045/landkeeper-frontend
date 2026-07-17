import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface CustomErrorMessageProps {
  title: string;
}

const CustomErrorMessage: React.FC<CustomErrorMessageProps> = ({ title }) => {
  return (
    <div className='border-danger flex flex-col items-center justify-center gap-3 rounded-md border border-dashed py-12 text-center'>
      <div className='bg-danger/10 flex h-12 w-12 items-center justify-center rounded-full'>
        <AlertCircle className='text-danger h-6 w-6' />
      </div>
      <div className='space-y-1'>
        <p className='text-danger/80 text-sm font-medium'>
          Failed to load {title}
        </p>
        <p className='text-muted-foreground text-sm'>
          Something went wrong while fetching the {title}. Please try again.
        </p>
      </div>
      <Button
        variant='default'
        size='sm'
        onClick={() => window.location.reload()}
        className='mt-1'
      >
        <RefreshCcw />
        Retry
      </Button>
    </div>
  );
};

export default CustomErrorMessage;
