import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChartIcon } from 'lucide-react';

export default function PropertyTypesChartSkeleton() {
  return (
    <Card className='rounded-2xl border border-gray-100 shadow-sm dark:border-gray-700/50'>
      <CardHeader className='pb-2'>
        <div className='flex items-center gap-2'>
          <PieChartIcon className='size-4 text-indigo-500' />
          <CardTitle className='text-base font-semibold text-gray-800 dark:text-gray-100'>
            Property Types
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className='flex flex-col items-center pb-6'>
        <div className='bg-muted size-[240px] animate-pulse rounded-full' />
        <div className='mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='flex items-center gap-1.5'>
              <span className='bg-muted inline-block size-3 animate-pulse rounded-sm' />
              <span className='bg-muted h-3 w-16 animate-pulse rounded' />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
