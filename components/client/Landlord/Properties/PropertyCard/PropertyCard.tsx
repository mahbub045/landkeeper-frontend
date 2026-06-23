'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Property } from '@/types/client/Landlord/Properties/PropertyTypes';
import { getCurrencySign } from '@/utils/formatters';
import { Bath, Bed, Home, MapPin } from 'lucide-react';
import Image from 'next/image';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const isOccupied = property.status === 'Occupied';

  return (
    <Card className='border-border cursor-pointer overflow-hidden rounded-2xl pt-0 pb-3 shadow-sm transition-shadow hover:shadow-md'>
      <div className='relative h-48 w-full'>
        <Image
          src={property.image}
          alt={property.name}
          fill
          className='object-cover'
          sizes='(max-width: 768px) 100vw, 33vw'
        />
        <div className='absolute top-3 right-3'>
          <Badge
            className={`gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-sm hover:bg-inherit ${isOccupied ? 'bg-success/90 text-white' : 'bg-muted text-muted-foreground'}`}
          >
            <span
              className={`inline-block size-1.5 rounded-full ${isOccupied ? 'bg-white' : 'bg-muted-foreground/60'}`}
            />
            {property.status}
          </Badge>
        </div>
      </div>

      <CardContent>
        <h3 className='text-foreground text-base font-bold'>{property.name}</h3>
        <p className='text-muted-foreground mt-1 flex items-center gap-1 text-xs'>
          <MapPin className='text-primary size-3 shrink-0' />
          {property.address}
        </p>
        <div className='text-muted-foreground mt-1 flex items-center gap-3 text-xs'>
          <span className='flex items-center gap-1'>
            <Bed className='text-primary size-3.5' />
            {property.bedrooms}
          </span>
          <span className='flex items-center gap-1'>
            <Bath className='text-primary size-3.5' />
            {property.bathrooms}
          </span>
          <span className='flex items-center gap-1'>
            <Home className='text-primary size-3.5' />
            {property.type}
          </span>
        </div>
        <p className='text-foreground mt-1 text-lg font-bold'>
          {property.rentPerMonth
            ? `${getCurrencySign()}${property.rentPerMonth.toLocaleString()}/mo`
            : 'Vacant'}
        </p>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
