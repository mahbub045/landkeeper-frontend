'use client';

import { ComplianceTimestampsProps } from '@/types/client/Common/Compliance/ComplianceTypes';
import { formatDate } from '@/utils/formatters';
import { CalendarClock, CalendarPlus } from 'lucide-react';

const ComplianceTimestamps: React.FC<ComplianceTimestampsProps> = ({
  createdAt,
  updatedAt,
}) => {
  const items = [
    { icon: CalendarPlus, label: 'Created On', value: formatDate(createdAt) },
    {
      icon: CalendarClock,
      label: 'Last Updated',
      value: formatDate(updatedAt),
    },
  ];

  return (
    <section className='rounded-xl border p-5 sm:p-6'>
      <h2 className='mb-5 text-sm font-semibold'>Record History</h2>
      <dl className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        {items.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className='bg-muted/40 flex items-center gap-3 rounded-lg p-3 shadow'
          >
            <span className='bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg'>
              <Icon className='size-4' />
            </span>
            <div className='min-w-0'>
              <dt className='text-muted-foreground text-xs'>{label}</dt>
              <dd className='text-sm font-medium'>
                {value || (
                  <span className='text-muted-foreground font-normal'>
                    Not Available
                  </span>
                )}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default ComplianceTimestamps;
