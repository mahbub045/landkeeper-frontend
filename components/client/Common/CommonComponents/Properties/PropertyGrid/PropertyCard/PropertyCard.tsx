'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  PROPERTY_STATUS_OPTIONS,
  STATUS_STYLES,
} from '@/data/client/common/properties/PropertiesData';
import { PropertyCardProps } from '@/types/client/Common/Properties/PropertyTypes';
import { getCurrencySign } from '@/utils/formatters';
import { getPropertyDetailsUrl } from '@/utils/redirectPath';
import { Bath, Bed, Home, MapPin } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const TYPE_LABELS: Record<string, string> = {
  RESIDENTIAL: 'Residential',
  HMO: 'HMO',
  COMMERCIAL: 'Commercial',
  MIXED_USE: 'Mixed Use',
  HOLIDAY_LET: 'Holiday Let',
};

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { data: session } = useSession();

  const image = property.documents?.[0]?.image ?? '';
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link href={getPropertyDetailsUrl(session, property.alias)}>
      <div className='group relative overflow-visible'>
        {/* Animated Gradient Glow */}
        <div className='from-primary via-secondary to-primary absolute -inset-2 z-0 rounded-[24px] bg-linear-to-r opacity-0 blur-xl transition-all duration-700 group-hover:opacity-100' />

        <Card className='border-border bg-card group-hover:border-primary/40 relative z-10 overflow-hidden rounded-2xl border pt-0 pb-3 transition-all duration-700 group-hover:-translate-y-1.5 group-hover:shadow-xl'>
          {/* Image */}
          <div className='relative h-48 w-full overflow-hidden'>
            {image ? (
              <>
                {!imageLoaded && (
                  <div className='bg-muted absolute inset-0 z-10 overflow-hidden'>
                    <div className='bg-muted absolute inset-0' />

                    <div className='animate-shimmer absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/50 to-transparent dark:via-white/10' />

                    <div className='absolute inset-0 flex items-center justify-center'>
                      <Loading />
                    </div>
                  </div>
                )}

                <Image
                  src={image}
                  alt={property.property_name}
                  fill
                  priority
                  unoptimized
                  onLoad={() => setImageLoaded(true)}
                  className='object-cover'
                />

                <div className='absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent' />
              </>
            ) : (
              <div className='bg-muted flex h-full items-center justify-center'>
                <Home className='text-muted-foreground size-10' />
              </div>
            )}

            <div className='absolute top-3 right-3'>
              <Badge
                className={`gap-1.5 rounded-full text-xs font-semibold ${
                  STATUS_STYLES[property.status] ??
                  'bg-muted text-muted-foreground'
                }`}
              >
                <span className='inline-block size-1.5 rounded-full bg-white' />

                <span>
                  {PROPERTY_STATUS_OPTIONS.find(
                    (opt) => opt.value === property.status,
                  )?.label ?? property.status}
                </span>
              </Badge>
            </div>
          </div>

          {/* Content */}
          <CardContent>
            <div className='flex justify-between gap-2'>
              <h3 className='text-foreground truncate text-base font-bold'>
                {property.property_name}
              </h3>

              {property.rent_per_month && (
                <p className='text-foreground shrink-0 text-lg font-bold'>
                  {`${getCurrencySign()}${parseFloat(
                    property.rent_per_month,
                  ).toLocaleString()}/mo`}
                </p>
              )}
            </div>

            <p className='text-muted-foreground mt-1 flex items-center gap-1 truncate text-xs'>
              <MapPin className='text-primary size-3 shrink-0' />
              {property.address}
            </p>

            <div className='text-muted-foreground mt-3 flex items-center gap-4 text-xs'>
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
                  {TYPE_LABELS[property.property_type] ??
                    property.property_type}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
};

export default PropertyCard;
