import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function PropertyDetailsSkeleton() {
  return (
    <div className='space-y-6'>
      {/* ── Header ── */}
      <div className='flex items-start justify-between gap-4'>
        <div>
          <Skeleton className='bg-foreground/15 mb-2 h-7 w-56 max-w-full' />
          <Skeleton className='bg-foreground/15 h-4 w-72 max-w-full' />
        </div>
        <Skeleton className='bg-foreground/15 h-6 w-20 rounded-full' />
      </div>

      {/* ── Gallery ── */}
      <Skeleton className='bg-foreground/15 h-105 w-full rounded-2xl' />

      {/* ── Overview + Landlord ── */}
      <div className='grid gap-6 lg:grid-cols-3'>
        <Card className='border-border rounded-2xl shadow-sm lg:col-span-2'>
          <CardHeader className='pb-2'>
            <Skeleton className='bg-foreground/15 h-5 w-36' />
          </CardHeader>
          <CardContent className='grid grid-cols-2 gap-3 px-5 pb-5 sm:grid-cols-3'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='bg-foreground/15 h-25 rounded-xl' />
            ))}
          </CardContent>
        </Card>
        <Card className='border-border rounded-2xl shadow-sm'>
          <CardHeader className='pb-2'>
            <Skeleton className='bg-foreground/15 h-5 w-32' />
          </CardHeader>
          <CardContent className='space-y-4 px-5 pb-5'>
            <div className='flex items-center gap-3'>
              <Skeleton className='bg-foreground/15 size-11 rounded-full' />
              <Skeleton className='bg-foreground/15 h-4 w-40' />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className='bg-foreground/15 h-9 w-full' />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
