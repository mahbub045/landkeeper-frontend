import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';

export default function AlertsRemindersSkeleton() {
  return (
    <Card className='border-border rounded-2xl shadow-md'>
      <CardHeader className='pb-3'>
        <div className='flex items-center gap-2'>
          <Bell className='size-4 text-amber-500' />
          <CardTitle className='text-base font-semibold text-gray-800 dark:text-gray-100'>
            Alerts &amp; Reminders
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className='max-h-105 space-y-2 overflow-y-auto px-4 pb-4'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className='border-border flex items-center gap-3 rounded-xl border p-3 shadow-sm'
          >
            <div className='bg-muted size-8 shrink-0 animate-pulse rounded-lg' />
            <div className='flex-1 space-y-2'>
              <div className='bg-muted h-3.5 w-3/4 animate-pulse rounded' />
              <div className='bg-muted h-3 w-1/2 animate-pulse rounded' />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
