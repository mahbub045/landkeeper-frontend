'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PropertyCardProps } from '@/types/client/Common/Properties/PropertyTypes';
import { getCurrencySign } from '@/utils/formatters';
import { getPropertyDetailsUrl } from '@/utils/redirectPath';
import { Bath, Bed, Home, MapPin } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { data: session } = useSession();
  const isOccupied = property.status === 'OCCUPIED';
  const image = property.documents?.[0]?.image ?? '';
  const [imageLoaded, setImageLoaded] = useState(false);

  const TYPE_LABELS: Record<string, string> = {
    RESIDENTIAL: 'Residential',
    HMO: 'HMO',
    COMMERCIAL: 'Commercial',
    MIXED_USE: 'Mixed Use',
    HOLIDAY_LET: 'Holiday Let',
  };

  const STATUS_LABELS: Record<string, string> = {
    OCCUPIED: 'Occupied',
    VACANT: 'Vacant',
    UNDER_MAINTENANCE: 'Under Maintenance',
  };

  return (
    <Link href={getPropertyDetailsUrl(session, property.alias)}>
      <Card className='border-border cursor-pointer overflow-hidden rounded-2xl pt-0 pb-3 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md'>
        <div className='relative h-48 w-full'>
          {image ? (
            <>
              {!imageLoaded && (
                <div className='bg-muted absolute inset-0 flex items-center justify-center'>
                  <Loading />
                </div>
              )}
              <Image
                src={image}
                alt={property.property_name}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 100vw, 33vw'
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className='bg-muted flex h-full w-full items-center justify-center'>
              <Home className='text-muted-foreground size-10' />
            </div>
          )}
          <div className='absolute top-3 right-3'>
            <Badge
              className={`gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold ${isOccupied ? 'bg-success/90 text-white' : 'bg-muted text-muted-foreground'}`}
            >
              <span
                className={`inline-block size-1.5 rounded-full ${isOccupied ? 'bg-white' : 'bg-muted-foreground/90'}`}
              />
              <span className='pt-0.5'>
                {STATUS_LABELS[property.status] ?? property.status}
              </span>
            </Badge>
          </div>
        </div>

        <CardContent>
          <h3 className='text-foreground truncate text-base font-bold'>
            {property.property_name}
          </h3>
          <p className='text-muted-foreground mt-1 flex items-center gap-1 truncate text-xs'>
            <MapPin className='text-primary size-3 shrink-0' />
            {property.address}
          </p>
          <div className='text-muted-foreground mt-1 flex items-center gap-3 text-xs'>
            {property.bedrooms && (
              <span className='flex items-center gap-1'>
                <Bed className='text-primary size-3.5' />
                {property.bedrooms}
              </span>
            )}
            {property.bathrooms && (
              <span className='flex items-center gap-1'>
                <Bath className='text-primary size-3.5' />
                {property.bathrooms}
              </span>
            )}
            {property.property_type && (
              <span className='flex items-center gap-1'>
                <Home className='text-primary size-3.5' />
                {TYPE_LABELS[property.property_type] ?? property.property_type}
              </span>
            )}
          </div>
          {property.rent_per_month && (
            <p className='text-foreground mt-1 text-lg font-bold'>
              {`${getCurrencySign()}${parseFloat(property?.rent_per_month).toLocaleString()}/mo`}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default PropertyCard;
