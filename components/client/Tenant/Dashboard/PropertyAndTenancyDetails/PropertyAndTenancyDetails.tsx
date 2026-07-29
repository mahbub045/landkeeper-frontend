import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import React from 'react';

interface TenancyRecord {
  id: string;
  address: string;
  city: string;
  termStart: string;
  termEnd: string;
  termLength: string;
  status: 'Active' | 'Ending soon' | 'Expired';
}

const tenancies: TenancyRecord[] = [
  {
    id: '1',
    address: '123 Maple Street, Apt 4B',
    city: 'Ilford, IG1 1ZZ',
    termStart: 'Oct 1, 2025',
    termEnd: 'Sep 30, 2026',
    termLength: '12-month agreement',
    status: 'Active',
  },
  {
    id: '2',
    address: '56 Birchwood Road, Flat 2',
    city: 'Romford, RM1 3QF',
    termStart: 'Jan 15, 2025',
    termEnd: 'Jan 14, 2026',
    termLength: '12-month agreement',
    status: 'Ending soon',
  },
  {
    id: '3',
    address: '9 Willow Court',
    city: 'Barking, IG11 8XZ',
    termStart: 'Mar 1, 2024',
    termEnd: 'Feb 28, 2025',
    termLength: '12-month agreement',
    status: 'Expired',
  },
  {
    id: '4',
    address: '14 Elmfield Avenue',
    city: 'Dagenham, RM10 7JP',
    termStart: 'Jun 1, 2025',
    termEnd: 'May 31, 2026',
    termLength: '12-month agreement',
    status: 'Active',
  },
  {
    id: '5',
    address: '14 Elmfield Avenue',
    city: 'Dagenham, RM10 7JP',
    termStart: 'Jun 1, 2025',
    termEnd: 'May 31, 2026',
    termLength: '12-month agreement',
    status: 'Active',
  },
  {
    id: '6',
    address: '14 Elmfield Avenue',
    city: 'Dagenham, RM10 7JP',
    termStart: 'Jun 1, 2025',
    termEnd: 'May 31, 2026',
    termLength: '12-month agreement',
    status: 'Active',
  },
  {
    id: '7',
    address: '14 Elmfield Avenue',
    city: 'Dagenham, RM10 7JP',
    termStart: 'Jun 1, 2025',
    termEnd: 'May 31, 2026',
    termLength: '12-month agreement',
    status: 'Active',
  },
];

const statusStyles: Record<TenancyRecord['status'], string> = {
  Active: 'bg-success',
  'Ending soon': 'bg-amber-400',
  Expired: 'bg-danger',
};

const PropertyAndTenancyDetails: React.FC = () => {
  return (
    <div className='mx-auto w-full max-w-4xl space-y-3 p-4'>
      <div className='flex items-center gap-2 text-sm font-medium'>
        <MapPin className='h-4 w-4' />
        Property and tenancy details
      </div>

      <div className='overflow-hidden rounded-xl border'>
        {/* Header row */}
        <div className='grid grid-cols-4 gap-4 border-b px-5 py-3'>
          <p className='text-xs text-neutral-500'>Property address</p>
          <p className='text-xs text-neutral-500'>Tenancy term</p>
          <p className='text-xs text-neutral-500'>Length</p>
          <p className='text-center text-xs text-neutral-500'>Status</p>
        </div>

        {/* Scrollable data rows */}
        <div className='max-h-105 divide-y overflow-y-auto'>
          {tenancies.map((t) => (
            <Card
              key={t.id}
              className='mx-1 my-2 grid grid-cols-4 items-center gap-4 border-x-0 border-t-0 border-b-0 px-2 py-3 last:border-b-0'
            >
              <div>
                <p className='text-sm font-medium'>{t.address}</p>
                <p className='text-sm text-neutral-400'>{t.city}</p>
              </div>
              <p className='text-sm'>
                {t.termStart} - {t.termEnd}
              </p>
              <p className='text-sm text-neutral-400'>{t.termLength}</p>
              <p className='text-center text-sm'>
                <Badge className={`font-medium ${statusStyles[t.status]}`}>
                  <span className='inline-block h-2 w-2 rounded-full bg-current align-middle'></span>
                  {t.status}
                </Badge>
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyAndTenancyDetails;
