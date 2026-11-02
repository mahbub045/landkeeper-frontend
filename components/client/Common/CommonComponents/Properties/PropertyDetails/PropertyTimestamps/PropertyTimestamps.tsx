'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyTimestampsProps } from '@/types/client/Common/Properties/PropertyDetailsTypes';
import { formatDate } from '@/utils/formatters';
import { CalendarClock, CalendarPlus } from 'lucide-react';

const PropertyTimestamps: React.FC<PropertyTimestampsProps> = ({
  createdAt,
  updatedAt,
}) => {
  const items = [
    { icon: CalendarPlus, label: 'Created On', value: formatDate(createdAt) },
    { icon: CalendarClock, label: 'Last Updated', value: formatDate(updatedAt) },
  ];

  return (
    <Card className='border-border rounded-2xl shadow-sm'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-base font-semibold'>Record History</CardTitle>
      </CardHeader>
      <CardContent className='grid gap-3 px-5 pb-5 sm:grid-cols-2'>
        {items.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className='bg-muted/40 flex items-center gap-3 rounded-xl p-3'
          >
            <div className='bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg'>
              <Icon className='size-4' />
            </div>
            <div className='min-w-0'>
              <p className='text-muted-foreground text-xs'>{label}</p>
              <p className='text-foreground truncate text-sm font-semibold'>
                {value || '—'}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PropertyTimestamps;
