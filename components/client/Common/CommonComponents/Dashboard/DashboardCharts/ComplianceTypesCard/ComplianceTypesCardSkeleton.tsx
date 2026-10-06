import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

export default function ComplianceTypesCardSkeleton() {
  return (
    <Card className='rounded-2xl border border-gray-100 shadow-sm dark:border-gray-700/50'>
      <CardHeader className='pb-2'>
        <div className='flex items-center gap-2'>
          <Activity className='size-4 text-teal-500' />
          <CardTitle className='text-base font-semibold text-gray-800 dark:text-gray-100'>
            Compliance Types
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
