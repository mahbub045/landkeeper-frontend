'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import type { FeatureSlide } from '@/types/common/auth/AuthPageLeftPanelTypes';

import {
  ComplianceIllustration,
  DashboardIllustration,
  MarketplaceIllustration,
  MtdIllustration,
  PropertiesIllustration,
  RentIllustration,
  ReportsIllustration,
} from './FeatureIllustrations';

const AUTOPLAY_MS = 5000;

const SLIDES: FeatureSlide[] = [
  {
    key: 'dashboard',
    title: 'Your Whole Portfolio At A Glance',
    description:
      'Occupancy, arrears and upcoming tasks on one clear dashboard.',
    Illustration: DashboardIllustration,
  },
  {
    key: 'properties',
    title: 'Properties & Tenants In One Place',
    description:
      'Keep every property, tenancy and tenant record organised and easy to find.',
    Illustration: PropertiesIllustration,
  },
  {
    key: 'rent',
    title: 'Track Rent, Expenses & Mortgages',
    description:
      'See what has been paid, what is due and how your portfolio is performing.',
    Illustration: RentIllustration,
  },
  {
    key: 'compliance',
    title: 'Stay Compliant, Automatically',
    description:
      'Get reminded before gas safety, EICR and EPC certificates expire.',
    Illustration: ComplianceIllustration,
  },
  {
    key: 'reports',
    title: 'Reports & Analytics',
    description:
      'Understand yields, expenses and cash flow with reports ready to download.',
    Illustration: ReportsIllustration,
  },
  {
    key: 'mtd',
    title: 'Ready For Making Tax Digital',
    description: 'Prepare quarterly updates and submit them straight to HMRC.',
    Illustration: MtdIllustration,
  },
  {
    key: 'marketplace',
    title: 'Find Trusted Service Providers',
    description:
      'Browse verified tradespeople and services for your properties in the marketplace.',
    Illustration: MarketplaceIllustration,
  },
];

const AuthPageLeftPanel: React.FC = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on('select', onSelect);

    // Autoplay — restarts whenever the user picks a slide.
    let timer = setInterval(() => api.scrollNext(), AUTOPLAY_MS);
    const resetTimer = () => {
      clearInterval(timer);
      timer = setInterval(() => api.scrollNext(), AUTOPLAY_MS);
    };
    api.on('pointerDown', resetTimer);

    return () => {
      clearInterval(timer);
      api.off('select', onSelect);
      api.off('pointerDown', resetTimer);
    };
  }, [api]);

  return (
    <div className='relative hidden flex-col overflow-hidden bg-[linear-gradient(160deg,oklch(0.27_0.09_262),oklch(0.38_0.15_261)_55%,oklch(0.5_0.19_260))] p-12 lg:flex lg:w-1/2'>
      {/* Soft background glows */}
      <span
        className='absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/5'
        aria-hidden='true'
      />
      <span
        className='absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-white/5'
        aria-hidden='true'
      />

      {/* Parcel boundary grid */}
      <svg
        className='absolute inset-0 h-full w-full opacity-[0.05]'
        aria-hidden='true'
      >
        <defs>
          <pattern
            id='parcelGrid'
            width='64'
            height='64'
            patternUnits='userSpaceOnUse'
          >
            <path
              d='M 64 0 L 0 0 0 64'
              fill='none'
              stroke='white'
              strokeWidth='1'
            />
          </pattern>
        </defs>
        <rect width='100%' height='100%' fill='url(#parcelGrid)' />
      </svg>

      <div className='relative z-10'>
        <Image
          src='/images/logo-white.png'
          alt='Landkeeper'
          width={400}
          height={100}
          className='h-12 w-40 rounded-xl'
          loading='eager'
        />
      </div>

      {/* Feature carousel */}
      <div className='relative z-10 flex flex-1 flex-col justify-center'>
        <Carousel setApi={setApi} opts={{ loop: true }} className='w-full'>
          <CarouselContent>
            {SLIDES.map(({ key, title, description, Illustration }) => (
              <CarouselItem key={key} className='select-none'>
                <Illustration />
                <div className='mx-auto mt-10 max-w-sm text-center'>
                  <h2 className='text-primary-foreground text-3xl leading-tight font-semibold tracking-tight'>
                    {title}
                  </h2>
                  <p className='text-primary-foreground/70 mt-3 text-[15px] leading-relaxed'>
                    {description}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Dots */}
        <div className='mt-8 flex justify-center gap-2'>
          {SLIDES.map((slide, i) => (
            <button
              key={slide.key}
              type='button'
              aria-label={`Show slide ${i + 1}`}
              aria-current={current === i}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                current === i
                  ? 'bg-primary-foreground w-6'
                  : 'bg-primary-foreground/35 hover:bg-primary-foreground/60 w-1.5',
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthPageLeftPanel;
