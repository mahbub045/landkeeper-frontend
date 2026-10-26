import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function MortgageDetailsSkeleton() {
  return (
    <div className='mx-auto space-y-8 py-10'>
      {/* Masthead */}
      <div className='relative flex flex-col justify-between gap-4 border-b pb-6 md:flex-row md:items-end'>
        <div>
          <Skeleton className='bg-foreground/15 mb-2 h-3 w-28' />
          <Skeleton className='bg-foreground/15 mb-2 h-8 w-72 max-w-full' />
          <Skeleton className='bg-foreground/15 h-4 w-40' />
        </div>

        <div className='flex items-center gap-2'>
          <div className='absolute top-0 right-0 flex gap-2'>
            <Skeleton className='bg-foreground/15 h-8 w-18' />
            <Skeleton className='bg-foreground/15 h-8 w-16' />
          </div>

          <Skeleton className='bg-foreground/15 h-5 w-24 rounded-full' />
        </div>
      </div>

      {/* Timeline */}
      <Card className='shadow-sm'>
        <CardHeader className='pb-2'>
          <Skeleton className='bg-foreground/15 h-4 w-24' />
        </CardHeader>
        <CardContent>
          <Skeleton className='bg-foreground/15 mt-8 mb-3 h-2 w-full rounded-full' />
          <div className='mb-4 flex justify-between'>
            <Skeleton className='bg-foreground/15 h-8 w-24' />
            <Skeleton className='bg-foreground/15 h-8 w-24' />
          </div>
        </CardContent>
      </Card>

      <div className='grid gap-8 md:grid-cols-[1.6fr_1fr]'>
        {/* Particulars register */}
        <Card className='shadow-sm'>
          <CardHeader className='pb-2'>
            <Skeleton className='bg-foreground/15 h-4 w-32' />
          </CardHeader>
          <CardContent className='space-y-4'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className='flex items-center gap-2'>
                <Skeleton className='bg-foreground/15 h-4 w-28' />
                <span className='border-border flex-1 border-b border-dashed' />
                <Skeleton className='bg-foreground/15 h-4 w-20' />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Documents + notes */}
        <div className='space-y-8'>
          <Card className='shadow-sm'>
            <CardHeader className='pb-2'>
              <Skeleton className='bg-foreground/15 h-4 w-24' />
            </CardHeader>
            <CardContent className='space-y-3'>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className='flex items-center gap-3 p-2'>
                  <Skeleton className='bg-foreground/15 size-4 shrink-0 rounded' />
                  <Skeleton className='bg-foreground/15 h-4 flex-1' />
                  <Skeleton className='bg-foreground/15 h-4 w-12 rounded-full' />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className='shadow-sm'>
            <CardHeader className='pb-2'>
              <Skeleton className='bg-foreground/15 h-4 w-16' />
            </CardHeader>
            <CardContent className='space-y-2'>
              <Skeleton className='bg-foreground/15 h-4 w-full' />
              <Skeleton className='bg-foreground/15 h-4 w-4/5' />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
