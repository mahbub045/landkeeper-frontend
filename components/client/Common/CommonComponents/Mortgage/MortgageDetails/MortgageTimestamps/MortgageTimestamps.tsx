'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MortgageTimestampsProps } from '@/types/client/Common/Mortgage/MortgageDetailsTypes';
import { formatDate } from '@/utils/formatters';
import { CalendarClock, CalendarPlus } from 'lucide-react';

const MortgageTimestamps: React.FC<MortgageTimestampsProps> = ({
  createdAt,
  updatedAt,
}) => {
  const items = [
    { icon: CalendarPlus, label: 'Created on', value: formatDate(createdAt) },
    {
      icon: CalendarClock,
      label: 'Last updated',
      value: formatDate(updatedAt),
    },
  ];

  return (
    <Card className='shadow-md'>
      <CardHeader className='pb-2'>
        <p className='text-foreground text-base font-semibold'>
          Record history
        </p>
      </CardHeader>
      <CardContent className='grid gap-3 sm:grid-cols-2'>
        {items.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className='bg-muted/40 flex items-center gap-3 rounded-md p-3 shadow'
          >
            <div className='bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-md'>
              <Icon className='size-4' />
            </div>
            <div className='min-w-0'>
              <p className='text-muted-foreground text-xs'>{label}</p>
              <p className='text-foreground truncate font-mono text-sm font-medium'>
                {value || 'Not provided'}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MortgageTimestamps;
