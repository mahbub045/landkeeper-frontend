import { Card, CardContent } from '@/components/ui/card';

export default function DashboardStatsSkeleton() {
  return (
    <div className='grid grid-cols-2 gap-4 xl:grid-cols-3'>
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className='border-border rounded-2xl border shadow-sm'>
          <CardContent className='px-5 py-2'>
            <div className='mb-4 flex items-start justify-between'>
              <div className='bg-muted size-10 animate-pulse rounded-xl' />
              <div className='bg-muted h-5 w-14 animate-pulse rounded-full' />
            </div>

            <div className='bg-muted mb-2 h-7 w-16 animate-pulse rounded' />
            <div className='bg-muted h-4 w-28 animate-pulse rounded' />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
