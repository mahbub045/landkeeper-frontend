'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UpcomingExpirationsProps } from '@/types/landlord/Compliance/ComplianceTypes';

const UpcomingExpirations: React.FC<UpcomingExpirationsProps> = ({ items }) => {
  return (
    <Card className='border-border rounded-2xl shadow-sm'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-foreground text-base font-semibold'>
          Upcoming Expirations
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-0 px-4 pb-4'>
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`flex items-start gap-3 py-4 ${idx < items.length - 1 ? 'border-border border-b' : ''}`}
            >
              <div className={`shrink-0 rounded-full p-2.5 ${item.iconBg}`}>
                <Icon className={`size-4 ${item.iconColor}`} />
              </div>
              <div>
                <p className='text-foreground text-sm font-semibold'>
                  {item.title}
                </p>
                <p className='text-muted-foreground mt-0.5 text-xs'>
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default UpcomingExpirations;
