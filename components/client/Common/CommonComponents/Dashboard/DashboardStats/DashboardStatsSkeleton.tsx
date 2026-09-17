import { Card, CardContent } from '@/components/ui/card';

export default function DashboardStatsSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className='border-border rounded-2xl shadow-md'>
          <CardContent className='px-6 py-3'>
            <div className='mb-4 flex items-center justify-between'>
              <div className='bg-muted h-8 w-8 animate-pulse rounded-lg' />
              <div className='bg-muted mb-2 h-7 w-16 animate-pulse rounded' />
            </div>

            <div className='bg-muted h-4 w-28 animate-pulse rounded' />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
