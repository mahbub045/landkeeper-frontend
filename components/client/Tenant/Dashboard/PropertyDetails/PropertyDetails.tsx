'use client';
import PropertyGallery from '@/components/client/Common/CommonComponents/Properties/PropertyDetails/PropertyGallery/PropertyGallery';
import PropertyNotes from '@/components/client/Common/CommonComponents/Properties/PropertyDetails/Propertynotes/PropertyNotes';
import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import { Badge } from '@/components/ui/badge';
import { STATUS_STYLES } from '@/data/client/Common/Properties/PropertiesData';
import { PROPERTY_STATUS_OPTIONS } from '@/data/common/ChoiceFieldOptions';
import { useGetPropertyDetailsQuery } from '@/store/api/endpoints/client/Tenant/Dashboard/DashboardApis';
import { ImageOff, MapPin } from 'lucide-react';
import LandlordCard from './LandlordCard';
import PropertyDetailsSkeleton from './PropertyDetailsSkeleton';
import PropertyOverviewCard from './PropertyOverviewCard';

const PropertyDetails: React.FC = () => {
  const { data: property, isError, isLoading } = useGetPropertyDetailsQuery();

  if (isLoading) return <PropertyDetailsSkeleton />;

  if (isError || !property) {
    return (
      <div className='mx-auto w-full max-w-6xl py-16'>
        <CustomErrorMessage title='property' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* ── Header ── */}
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
            Your Home
          </p>
          <h1 className='text-foreground flex items-center gap-2 truncate text-2xl leading-tight font-semibold'>
            <MapPin className='text-primary size-3.5 shrink-0' />
            {property.address}
          </h1>
        </div>
        <Badge
          className={`gap-1.5 rounded-full text-xs font-semibold ${STATUS_STYLES[property.status] ?? 'bg-muted text-muted-foreground'}`}
        >
          <span className='inline-block size-1.5 rounded-full bg-white' />
          {PROPERTY_STATUS_OPTIONS.find((opt) => opt.value === property.status)
            ?.label ?? property.status}
        </Badge>
      </div>

      {/* ── Gallery ── */}
      {property.documents?.length ? (
        <PropertyGallery docs={property.documents} />
      ) : (
        <div className='border-border text-muted-foreground flex h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed'>
          <ImageOff className='size-6' />
          <span className='text-sm'>No images available for this property</span>
        </div>
      )}

      {/* ── Overview + Landlord ── */}
      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <PropertyOverviewCard property={property} />
        </div>
        {property.landlord && <LandlordCard landlord={property.landlord} />}
      </div>

      {/* ── Notes ── */}
      {property.notes && <PropertyNotes notes={property.notes} />}
    </div>
  );
};

export default PropertyDetails;
