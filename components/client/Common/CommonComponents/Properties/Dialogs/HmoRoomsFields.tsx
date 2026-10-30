'use client';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  DetailsForm,
  HmoRoomsFieldsProps,
  PropertyRoom,
} from '@/types/client/Common/Properties/PropertyTypes';
import { getCurrencySign } from '@/utils/formatters';

const MAX_HMO_ROOMS = 50;

export const isHmo = (propertyType: string) => propertyType === 'HMO';

// Grow / shrink the room rows so there is exactly one per bedroom. Existing
// rows are preserved so typed values survive a bedrooms edit.
export function syncRoomsToBedrooms(
  rooms: PropertyRoom[],
  bedrooms: string,
): PropertyRoom[] {
  const count = Math.min(
    Math.max(parseInt(bedrooms, 10) || 0, 0),
    MAX_HMO_ROOMS,
  );
  if (count === rooms.length) return rooms;
  if (count < rooms.length) return rooms.slice(0, count);
  return [
    ...rooms,
    ...Array.from({ length: count - rooms.length }, () => ({
      room_name: '',
      monthly_rent: '',
    })),
  ];
}

export function sumRoomRents(rooms: PropertyRoom[]): number {
  const total = rooms.reduce(
    (sum, r) => sum + (parseFloat(r.monthly_rent) || 0),
    0,
  );
  return Math.round(total * 100) / 100;
}

// For HMOs the monthly rental income is the sum of the room rents, so set
// both together.
export function applyRoomsChange(
  form: DetailsForm,
  rooms: PropertyRoom[],
): DetailsForm {
  const total = sumRoomRents(rooms);
  return {
    ...form,
    rooms,
    monthly_rental_income: total > 0 ? String(total) : '',
  };
}

// Applies a field change to the details form, keeping HMO rooms in sync with
// the bedrooms count whenever bedrooms or property type changes.
export function applyDetailsChange(
  form: DetailsForm,
  key: keyof DetailsForm,
  value: string,
): DetailsForm {
  const next = { ...form, [key]: value };
  if (
    (key === 'bedrooms' || key === 'property_type') &&
    isHmo(next.property_type)
  ) {
    return applyRoomsChange(
      next,
      syncRoomsToBedrooms(next.rooms, next.bedrooms),
    );
  }
  return next;
}

// The API expects indexed form fields (rooms[i].field), not a JSON blob.
export function appendRooms(formData: FormData, form: DetailsForm) {
  if (!isHmo(form.property_type)) return;
  form.rooms.forEach((room, i) => {
    formData.append(`rooms[${i}].room_name`, room.room_name);
    formData.append(`rooms[${i}].monthly_rent`, room.monthly_rent);
  });
}

// DRF nests errors for list fields (e.g. rooms: [{}, {monthly_rent: [...]}]),
// so dig out the first readable message.
export function firstErrorMessage(val: unknown): string | undefined {
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) {
    for (const item of val) {
      const msg = firstErrorMessage(item);
      if (msg) return msg;
    }
    return undefined;
  }
  if (typeof val === 'object' && val !== null) {
    for (const item of Object.values(val)) {
      const msg = firstErrorMessage(item);
      if (msg) return msg;
    }
  }
  return undefined;
}

const HmoRoomsFields: React.FC<HmoRoomsFieldsProps> = ({
  rooms,
  onChange,
  error,
}) => {
  function updateRoom(index: number, key: keyof PropertyRoom, value: string) {
    onChange(rooms.map((r, i) => (i === index ? { ...r, [key]: value } : r)));
  }

  const totalRent = sumRoomRents(rooms);

  return (
    <Field data-invalid={!!error}>
      <FieldLabel className='text-sm font-semibold'>
        HMO Rooms<span className='text-danger'>*</span>
      </FieldLabel>

      {rooms.length === 0 ? (
        <p className='text-muted-foreground text-xs'>
          Enter the number of bedrooms to add a row for each room.
        </p>
      ) : (
        <div className='space-y-2'>
          <div className='grid grid-cols-2 gap-2'>
            <span className='text-muted-foreground text-xs'>Room Name</span>
            <span className='text-muted-foreground text-xs'>Monthly Rent</span>
          </div>
          {rooms.map((room, i) => (
            <div key={i} className='grid grid-cols-2 gap-2'>
              <Input
                type='text'
                placeholder={`Room ${i + 1}`}
                value={room.room_name}
                onChange={(e) => updateRoom(i, 'room_name', e.target.value)}
                required
                className='border-primary! focus-visible:ring-primary/50'
              />
              <Input
                type='number'
                min={0}
                placeholder={getCurrencySign()}
                value={room.monthly_rent}
                onChange={(e) => updateRoom(i, 'monthly_rent', e.target.value)}
                required
                className='border-primary! focus-visible:ring-primary/50'
              />
            </div>
          ))}
          <p className='text-muted-foreground text-right text-xs'>
            Total monthly rent:{' '}
            <span className='text-foreground font-medium'>
              {getCurrencySign()}
              {totalRent.toLocaleString()}
            </span>
          </p>
        </div>
      )}
      <FieldError errors={[{ message: error }]} />
    </Field>
  );
};

export default HmoRoomsFields;
