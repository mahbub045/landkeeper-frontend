'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyRoomsProps } from '@/types/client/Common/Properties/PropertyDetailsTypes';
import { getCurrencySign } from '@/utils/formatters';
import { DoorOpen } from 'lucide-react';

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
    <Card className='border-border rounded-2xl shadow-sm'>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-base font-semibold'>HMO Rooms</CardTitle>
        <span className='text-muted-foreground text-xs'>
          {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'}
        </span>
      </CardHeader>
      <CardContent className='px-5 pb-4'>
        <div className='divide-border divide-y'>
          {rooms.map((room, i) => (
            <div
              key={room.alias ?? i}
              className='flex items-center justify-between gap-4 py-2.5'
            >
              <span className='text-foreground flex items-center gap-1.5 text-sm font-medium'>
                <DoorOpen className='text-primary size-3.5' />
                {room.room_name || `Room ${i + 1}`}
              </span>
              <span className='text-foreground text-sm font-medium'>
                {fmt(room.monthly_rent)}/mo
              </span>
            </div>
          ))}
        </div>
        <div className='border-border mt-1 flex items-center justify-between border-t pt-3'>
          <span className='text-muted-foreground text-sm'>Total</span>
          <span className='text-primary text-sm font-bold'>
            {fmt(totalRent)}/mo
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyRooms;
