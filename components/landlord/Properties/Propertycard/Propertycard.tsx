'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Property } from '@/types/landlord/Properties/PropertyTypes';
import { getCurrencySign } from '@/utils/formatters';
import { Bath, Bed, Home, MapPin } from 'lucide-react';
import Image from 'next/image';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const isOccupied = property.status === 'Occupied';

  return (
    <Card className='cursor-pointer overflow-hidden rounded-2xl border-border pt-0 pb-3 shadow-sm transition-shadow hover:shadow-md'>
      <div className='relative h-48 w-full'>
        <Image
          src={property.image}
          alt={property.name}
          fill
          className='object-cover'
          sizes='(max-width: 768px) 100vw, 33vw'
        />
        <div className='absolute top-3 right-3'>
          <Badge className={`gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-sm hover:bg-inherit ${isOccupied ? 'bg-success/90 text-white' : 'bg-muted text-muted-foreground'}`}>
            <span className={`inline-block size-1.5 rounded-full ${isOccupied ? 'bg-white' : 'bg-muted-foreground/60'}`} />
            {property.status}
          </Badge>
        </div>
      </div>

      <CardContent>
        <h3 className='text-base font-bold text-foreground'>{property.name}</h3>
        <p className='mt-1 flex items-center gap-1 text-xs text-muted-foreground'>
          <MapPin className='size-3 shrink-0 text-primary' />
          {property.address}
        </p>
        <div className='mt-1 flex items-center gap-3 text-xs text-muted-foreground'>
          <span className='flex items-center gap-1'>
            <Bed className='size-3.5 text-primary' />
            {property.bedrooms}
          </span>
          <span className='flex items-center gap-1'>
            <Bath className='size-3.5 text-primary' />
            {property.bathrooms}
          </span>
          <span className='flex items-center gap-1'>
            <Home className='size-3.5 text-primary' />
            {property.type}
          </span>
        </div>
        <p className='mt-1 text-lg font-bold text-foreground'>
          {property.rentPerMonth
            ? `${getCurrencySign()}${property.rentPerMonth.toLocaleString()}/mo`
            : 'Vacant'}
        </p>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;