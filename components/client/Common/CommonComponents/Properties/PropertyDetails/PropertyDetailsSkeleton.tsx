import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { InfoCardSkeletonProps } from '@/types/client/Common/Properties/PropertyDetailsTypes';

const InfoCardSkeleton = ({ rows }: InfoCardSkeletonProps) => (
  <Card className='border-border rounded-2xl shadow-sm'>
    <CardHeader className='pb-2'>
      <Skeleton className='bg-foreground/15 h-5 w-36' />
    </CardHeader>
    <CardContent className='divide-border divide-y px-5 pb-4'>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className='flex items-center justify-between gap-4 py-3'>
          <Skeleton className='bg-foreground/15 h-4 w-28' />
          <Skeleton className='bg-foreground/15 h-4 w-24' />
        </div>
      ))}
    </CardContent>
  </Card>
);

export default function PropertyDetailsSkeleton() {
  return (
    <div className='space-y-6 px-4 py-6'>
      {/* ── Back + Header ── */}
      <div className='flex items-start justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <Skeleton className='bg-foreground/15 size-9 shrink-0 rounded-md' />
          <div>
            <Skeleton className='bg-foreground/15 mb-2 h-6 w-56 max-w-full' />
            <Skeleton className='bg-foreground/15 h-4 w-72 max-w-full' />
          </div>
        </div>

        <div className='flex shrink-0 items-center gap-2'>
          <Skeleton className='bg-foreground/15 h-6 w-20 rounded-full' />
          <Skeleton className='bg-foreground/15 h-8 w-16' />
        </div>
      </div>

      {/* ── Gallery ── */}
      <div
        className='grid gap-1 overflow-hidden rounded-2xl'
        style={{
          gridTemplateColumns: '2fr 1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          height: '420px',
        }}
      >
        <Skeleton className='bg-foreground/15 row-span-2 rounded-none' />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className='bg-foreground/15 rounded-none' />
        ))}
      </div>

      {/* ── Info + Financials ── */}
      <div className='grid gap-6 md:grid-cols-2'>
        <InfoCardSkeleton rows={8} />
        <InfoCardSkeleton rows={5} />
      </div>

      {/* ── Notes ── */}
      <Card className='border-border rounded-2xl shadow-sm'>
        <CardHeader className='pb-2'>
          <Skeleton className='bg-foreground/15 h-5 w-16' />
        </CardHeader>
        <CardContent className='space-y-2 px-5 pb-5'>
          <Skeleton className='bg-foreground/15 h-4 w-full' />
          <Skeleton className='bg-foreground/15 h-4 w-11/12' />
          <Skeleton className='bg-foreground/15 h-4 w-3/5' />
        </CardContent>
      </Card>
    </div>
  );
}
