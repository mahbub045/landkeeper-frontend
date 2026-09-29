'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getCategory } from '@/data/client/common/marketplace/MarketplaceData';
import { cn } from '@/lib/utils';
import { MarketplaceService } from '@/types/client/Common/Marketplace/MarketplaceTypes';
import { MapPin, Star } from 'lucide-react';

const ServiceCard: React.FC<{ service: MarketplaceService }> = ({
  service,
}) => {
  const category = getCategory(service.category);

  return (
    <Card className='group h-full gap-0 py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'>
      <CardContent className='flex h-full flex-col p-4'>
        {/* Brand logo */}
        <div
          className={cn(
            'flex h-20 items-center gap-3 rounded-lg px-4',
            service.dark_logo ? 'bg-slate-900' : 'bg-transparent',
          )}
        >
          <service.brand_icon
            className={cn(
              'size-10 shrink-0',
              service.dark_logo ? 'text-white' : 'text-primary',
            )}
            strokeWidth={2.25}
          />
          <div className='min-w-0'>
            <p
              className={cn(
                'truncate text-2xl leading-tight font-bold tracking-tight',
                service.brand_color,
              )}
            >
              {service.brand_name}
            </p>
            <p
              className={cn(
                'truncate text-[10px] font-medium tracking-wider uppercase',
                service.dark_logo ? 'text-slate-300' : 'text-muted-foreground',
              )}
            >
              {service.brand_tagline}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className='mt-3 flex flex-1 flex-col'>
          {category && (
            <Badge
              className={cn(
                'rounded-full border-0 px-2.5 text-[11px] font-medium',
                category.badge_class_name,
              )}
            >
              {category.label}
            </Badge>
          )}

          <h3 className='text-foreground mt-2 text-sm font-semibold'>
            {service.name}
          </h3>
          <p className='text-muted-foreground mt-1.5 line-clamp-4 text-xs leading-relaxed'>
            {service.description}
          </p>

          <div className='mt-3 flex items-center gap-1.5 text-xs'>
            <Star className='size-4 fill-amber-400 text-amber-400' />
            <span className='text-foreground font-semibold'>
              {service.rating.toFixed(1)}
            </span>
            <span className='text-muted-foreground'>
              ({service.review_count} reviews)
            </span>
          </div>

          <div className='text-muted-foreground mt-1.5 flex items-center gap-1.5 text-[11px]'>
            <MapPin className='size-3.5 shrink-0' />
            <span className='truncate'>{service.coverage_label}</span>
          </div>

          <p className='text-foreground mt-auto pt-4 text-xs font-semibold'>
            {service.price_label}
          </p>

          <Button
            variant='outline'
            className='border-primary/40 text-primary group-hover:bg-primary group-hover:text-primary-foreground mt-3 w-full'
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
