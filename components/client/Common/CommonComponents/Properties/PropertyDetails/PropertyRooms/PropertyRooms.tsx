'use client';

import DetailsSection from '@/components/common/DetailsPage/DetailsSection';
import { PropertyRoomsProps } from '@/types/client/Common/Properties/PropertyDetailsTypes';
import { getCurrencySign } from '@/utils/formatters';
import { BedDouble, DoorOpen } from 'lucide-react';

const fmt = (val: string | number | null | undefined) => {
  if (val === null || val === undefined || val === '') return '—';
  const n = typeof val === 'number' ? val : parseFloat(val);
  return isNaN(n) ? '—' : `${getCurrencySign()}${n.toLocaleString()}`;
};

const PropertyRooms: React.FC<PropertyRoomsProps> = ({ rooms }) => {
  const totalRent = rooms.reduce(
    (sum, r) => sum + (parseFloat(r.monthly_rent) || 0),
    0,
  );

  return (
    <DetailsSection
      title='HMO Rooms'
      icon={BedDouble}
      description={`${rooms.length} ${rooms.length === 1 ? 'room' : 'rooms'}`}
      action={
        <span className='bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold'>
          {fmt(totalRent)}/mo total
        </span>
      }
    >
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        {rooms.map((room, i) => (
          <div
            key={room.alias ?? i}
            className='bg-muted/40 flex items-center justify-between gap-4 rounded-xl p-3'
          >
            <span className='text-foreground flex min-w-0 items-center gap-2 text-sm font-medium'>
              <span className='bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg'>
                <DoorOpen className='size-4' />
              </span>
              <span className='truncate'>
                {room.room_name || `Room ${i + 1}`}
              </span>
            </span>
            <span className='text-foreground shrink-0 text-sm font-semibold'>
              {fmt(room.monthly_rent)}/mo
            </span>
          </div>
        ))}
      </div>
    </DetailsSection>
  );
};

export default PropertyRooms;
