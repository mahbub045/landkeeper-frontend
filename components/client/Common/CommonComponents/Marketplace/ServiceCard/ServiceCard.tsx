'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getCategoryColor } from '@/data/super-admin/Marketplace/MarketplaceData';
import { cn } from '@/lib/utils';
import { ServiceCardProps } from '@/types/super-admin/Marketplace/MarketplaceTypes';
import { BadgeCheck, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import MarketplaceCategoryIcon from '@/components/common/MarketplaceCategoryIcon/MarketplaceCategoryIcon';
import ProviderDetailsDialog from '../Dialogs/ProviderDetailsDialog';

const ServiceCard: React.FC<ServiceCardProps> = ({ provider }) => {
  const category = provider.categories[0];
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <Card className='group h-full gap-0 py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'>
      <CardContent className='flex h-full flex-col p-4'>
        {/* Brand logo */}
        <div className='flex h-20 items-center gap-3 rounded-lg px-4'>
          {provider.logo ? (
            <div className='relative size-12 shrink-0 overflow-hidden rounded-lg'>
              <Image
                src={provider.logo}
                alt={provider.name}
                fill
                sizes='48px'
                className='object-contain'
              />
            </div>
          ) : (
            <MarketplaceCategoryIcon
              icon={category?.icon}
              seed={category?.alias}
              className='size-12 rounded-lg'
              iconClassName='size-6'
            />
          )}
          <div className='min-w-0'>
            <p className='text-foreground flex items-center gap-1.5 truncate text-xl leading-tight font-bold tracking-tight'>
              <span className='truncate'>{provider.name}</span>
              {provider.is_verified && (
                <BadgeCheck
                  aria-label='Verified provider'
                  className='text-primary size-5 shrink-0'
                />
              )}
            </p>
            {provider.short_description && (
              <p className='text-muted-foreground truncate text-[10px] font-medium tracking-wider uppercase'>
                {provider.short_description}
              </p>
            )}
          </div>
        </div>

        {/* Details */}
        <div className='mt-3 flex flex-1 flex-col'>
          {provider.categories.length > 0 && (
            <div className='flex flex-wrap gap-1.5'>
              {provider.categories.map((c) => (
                <Badge
                  key={c.alias}
                  className={cn(
                    'rounded-full border-0 px-2.5 text-[11px] font-medium',
                    getCategoryColor(c.alias).icon_bg,
                    getCategoryColor(c.alias).icon_color,
                  )}
                >
                  {c.name}
                </Badge>
              ))}
            </div>
          )}

          {provider.description && (
            <p className='text-muted-foreground mt-2 line-clamp-4 text-xs leading-relaxed'>
              {provider.description}
            </p>
          )}

          {provider.services_offered.length > 0 && (
            <div className='mt-3 flex flex-wrap gap-1.5'>
              {provider.services_offered.map((service) => (
                <span
                  key={service}
                  className='border-border text-foreground rounded-md border px-2 py-0.5 text-[11px]'
                >
                  {service}
                </span>
              ))}
            </div>
          )}

          <div className='mt-auto flex gap-2 pt-4'>
            <Button
              variant='outline'
              onClick={() => setDetailsOpen(true)}
              className='border-primary/40 text-primary hover:bg-primary/5 hover:text-primary flex-1'
            >
              View Details
            </Button>
            {provider.website_url && (
              <Button asChild className='flex-1'>
                <a
                  href={provider.website_url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Website
                  <ExternalLink />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      <ProviderDetailsDialog
        provider={provider}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    </Card>
  );
};

export default ServiceCard;
