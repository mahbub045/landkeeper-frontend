import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const LandlordCardSkeleton: React.FC = () => (
  <Card className='border-border rounded-2xl py-0 shadow-md'>
    <CardContent className='flex flex-col gap-4 px-5 py-5'>
      <div className='flex items-center gap-3'>
        <Skeleton className='size-12 rounded-full' />
        <div className='flex-1 space-y-2'>
          <Skeleton className='h-4 w-3/4' />
          <Skeleton className='h-3 w-1/4' />
        </div>
      </div>
      <div className='space-y-2'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-2/3' />
        <Skeleton className='h-4 w-1/2' />
      </div>
      <div className='border-border flex justify-between border-t pt-4'>
        <Skeleton className='h-5 w-20 rounded-full' />
        <Skeleton className='h-5 w-16 rounded-full' />
      </div>
    </CardContent>
  </Card>
);

export default LandlordCardSkeleton;
