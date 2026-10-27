import { Skeleton } from '@/components/ui/skeleton';

export default function ComplianceDetailsSkeleton() {
  return (
    <div className='mx-auto'>
      {/* Page title */}
      <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <Skeleton className='bg-foreground/15 mb-2 h-7 w-56' />
          <Skeleton className='bg-foreground/15 h-4 w-72 max-w-full' />
        </div>
        <div className='flex flex-wrap gap-2'>
          <Skeleton className='bg-foreground/15 h-9 w-20' />
          <Skeleton className='bg-foreground/15 h-9 w-20' />
        </div>
      </div>

      {/* Header */}
      <div className='mb-6 rounded-xl border p-5 sm:p-6'>
        <div className='mb-2 flex items-center gap-2'>
          <Skeleton className='bg-foreground/15 h-6 w-44' />
          <Skeleton className='bg-foreground/15 size-4 rounded' />
        </div>
        <Skeleton className='bg-foreground/15 h-7 w-80 max-w-full' />
        <div className='mt-2 flex flex-wrap items-center gap-2'>
          <Skeleton className='bg-foreground/15 h-6 w-20 rounded-full' />
          <Skeleton className='bg-foreground/15 h-6 w-28 rounded-full' />
          <Skeleton className='bg-foreground/15 h-3 w-32' />
        </div>
      </div>

      <div className='space-y-6'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          {/* Certificate information */}
          <section className='rounded-xl border p-5 sm:p-6'>
            <Skeleton className='bg-foreground/15 mb-5 h-4 w-40' />
            <div className='grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='flex items-start gap-3'>
                  <Skeleton className='bg-foreground/15 size-8 shrink-0 rounded-lg' />
                  <div className='min-w-0 flex-1'>
                    <Skeleton className='bg-foreground/15 mb-1.5 h-3 w-20' />
                    <Skeleton className='bg-foreground/15 h-4 w-32 max-w-full' />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Validity timeline */}
          <section className='rounded-xl border p-5 sm:p-6'>
            <div className='mb-6 flex items-center justify-between gap-2'>
              <Skeleton className='bg-foreground/15 h-4 w-32' />
              <Skeleton className='bg-foreground/15 h-5 w-20 rounded-full' />
            </div>
            <div className='pt-8'>
              <Skeleton className='bg-foreground/15 h-2 w-full rounded-full' />
            </div>
            <div className='mt-3 flex items-start justify-between gap-4'>
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className='flex items-start gap-2'>
                  <Skeleton className='bg-foreground/15 mt-0.5 size-4 shrink-0 rounded' />
                  <div>
                    <Skeleton className='bg-foreground/15 mb-1.5 h-3 w-12' />
                    <Skeleton className='bg-foreground/15 h-4 w-24' />
                  </div>
                </div>
              ))}
            </div>
            <div className='mt-5 grid grid-cols-1 gap-3 border-t pt-4 sm:grid-cols-3'>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className='bg-foreground/15 mb-1.5 h-3 w-16' />
                  <Skeleton className='bg-foreground/15 h-4 w-20' />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Document */}
        <section className='rounded-xl border p-5 sm:p-6'>
          <div className='mb-4 flex items-center justify-between gap-2'>
            <Skeleton className='bg-foreground/15 h-4 w-24' />
            <Skeleton className='bg-foreground/15 h-8 w-20' />
          </div>
          <Skeleton className='bg-foreground/15 h-80 w-full rounded-lg' />
        </section>
      </div>
    </div>
  );
}
