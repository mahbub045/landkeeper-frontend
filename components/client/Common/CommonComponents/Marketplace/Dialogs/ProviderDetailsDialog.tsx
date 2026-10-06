'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import MarketplaceCategoryIcon from '@/components/common/MarketplaceCategoryIcon/MarketplaceCategoryIcon';
import { getCategoryColor } from '@/data/super-admin/Marketplace/MarketplaceData';
import { cn } from '@/lib/utils';
import {
  ProviderContactItem,
  ProviderDetailsDialogProps,
} from '@/types/super-admin/Marketplace/MarketplaceTypes';
import { BadgeCheck, Globe, Link2, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';

const ProviderDetailsDialog: React.FC<ProviderDetailsDialogProps> = ({
  provider,
  open,
  onClose,
}) => {
  const contacts = [
    provider.website_url && {
      icon: Globe,
      title: 'Website',
      label: provider.website_url.replace(/^https?:\/\/(www\.)?/, ''),
      href: provider.website_url,
      external: true,
    },
    provider.referral_url && {
      icon: Link2,
      title: 'Referral',
      label: provider.referral_url.replace(/^https?:\/\/(www\.)?/, ''),
      href: provider.referral_url,
      external: true,
    },
    provider.contact_email && {
      icon: Mail,
      label: provider.contact_email,
      href: `mailto:${provider.contact_email}`,
    },
    provider.contact_phone && {
      icon: Phone,
      label: provider.contact_phone,
      href: `tel:${provider.contact_phone.replace(/\s/g, '')}`,
    },
    provider.address && { icon: MapPin, label: provider.address },
  ].filter(Boolean) as ProviderContactItem[];

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg'>
        <DialogHeader>
          <div className='flex items-center gap-3'>
            {provider.logo ? (
              <div className='relative size-14 shrink-0 overflow-hidden rounded-lg'>
                <Image
                  src={provider.logo}
                  alt={provider.name}
                  fill
                  sizes='56px'
                  className='object-contain'
                />
              </div>
            ) : (
              <MarketplaceCategoryIcon
                icon={provider.categories[0]?.icon}
                seed={provider.categories[0]?.alias}
                className='size-14 rounded-lg'
                iconClassName='size-7'
              />
            )}
            <div className='min-w-0 text-left'>
              <DialogTitle className='flex items-center gap-1.5'>
                {provider.name}
                {provider.is_verified && (
                  <BadgeCheck
                    aria-label='Verified provider'
                    className='text-primary size-5 shrink-0'
                  />
                )}
              </DialogTitle>
              <DialogDescription>
                {provider.short_description ?? 'Marketplace provider'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className='space-y-5'>
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
            <div>
              <p className='text-foreground mb-1.5 text-sm font-semibold'>
                About
              </p>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                {provider.description}
              </p>
            </div>
          )}

          {provider.services_offered.length > 0 && (
            <div>
              <p className='text-foreground mb-2 text-sm font-semibold'>
                Services offered
              </p>
              <div className='flex flex-wrap gap-1.5'>
                {provider.services_offered.map((service) => (
                  <span
                    key={service}
                    className='border-border text-foreground rounded-md border px-2 py-0.5 text-xs'
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {contacts.length > 0 && (
            <div>
              <p className='text-foreground mb-2 text-sm font-semibold'>
                Contact
              </p>
              <ul className='space-y-2'>
                {contacts.map((contact) => (
                  <li
                    key={contact.label}
                    className='flex items-start gap-2.5 text-sm'
                  >
                    <contact.icon className='text-muted-foreground mt-0.5 size-4 shrink-0' />
                    {contact.title && (
                      <span className='text-muted-foreground w-16 shrink-0'>
                        {contact.title}
                      </span>
                    )}
                    {contact.href ? (
                      <a
                        href={contact.href}
                        {...(contact.external && {
                          target: '_blank',
                          rel: 'noopener noreferrer',
                        })}
                        className='text-primary break-all hover:underline'
                      >
                        {contact.label}
                      </a>
                    ) : (
                      <span className='text-foreground'>{contact.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProviderDetailsDialog;
