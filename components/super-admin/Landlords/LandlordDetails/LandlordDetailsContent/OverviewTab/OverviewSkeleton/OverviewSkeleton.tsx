import { Skeleton } from '@/components/ui/skeleton';

const OverviewSkeleton: React.FC = () => (
  <div className='space-y-6'>
    <Skeleton className='h-32 w-full rounded-xl' />
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className='h-18 rounded-xl' />
      ))}
    </div>
    <div className='grid gap-6 xl:grid-cols-2'>
      <Skeleton className='h-80 rounded-xl' />
      <Skeleton className='h-80 rounded-xl' />
    </div>
  </div>
);

export default OverviewSkeleton;
