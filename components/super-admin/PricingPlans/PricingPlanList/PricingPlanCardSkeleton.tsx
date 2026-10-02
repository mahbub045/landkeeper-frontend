import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const PricingPlanCardSkeleton: React.FC = () => (
  <Card className='border-border relative overflow-hidden rounded-2xl py-0 shadow-md'>
    <Skeleton className='absolute inset-x-0 top-0 h-1 rounded-none' />
    <CardContent className='flex flex-col gap-5 px-5 py-6'>
      <div className='flex items-center gap-3'>
        <Skeleton className='size-11 rounded-xl' />
        <div className='flex-1 space-y-2'>
          <Skeleton className='h-5 w-1/2' />
          <Skeleton className='h-4 w-20 rounded-full' />
        </div>
      </div>
      <Skeleton className='h-10 w-36' />
      <Skeleton className='h-16 w-full rounded-xl' />
      <div className='space-y-3'>
        <Skeleton className='h-4 w-32' />
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className='flex items-center gap-2.5'>
            <Skeleton className='size-4 shrink-0 rounded-full' />
            <Skeleton className='h-3.5' style={{ width: `${80 - (i % 5) * 9}%` }} />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default PricingPlanCardSkeleton;
