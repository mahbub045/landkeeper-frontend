'use client';
import PropertyGallery from '@/components/client/Common/CommonComponents/Properties/PropertyDetails/PropertyGallery/PropertyGallery';
import PropertyNotes from '@/components/client/Common/CommonComponents/Properties/PropertyDetails/Propertynotes/PropertyNotes';
import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import DetailsEmptyState from '@/components/common/DetailsPage/DetailsEmptyState';
import DetailsPageHeader from '@/components/common/DetailsPage/DetailsPageHeader';
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
      <DetailsPageHeader
        showBack={false}
        eyebrow='Your Home'
        title={
          <span className='flex items-center gap-2'>
            <MapPin className='text-primary size-5 shrink-0' />
            {property.address}
          </span>
        }
        meta={
          <Badge
            className={`gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[property.status] ?? 'bg-muted text-muted-foreground'}`}
          >
            <span className='inline-block size-1.5 rounded-full bg-white' />
            {PROPERTY_STATUS_OPTIONS.find(
              (opt) => opt.value === property.status,
            )?.label ?? property.status}
          </Badge>
        }
      />

      {/* ── Gallery ── */}
      {property.documents?.length ? (
        <PropertyGallery docs={property.documents} />
      ) : (
        <DetailsEmptyState
          icon={ImageOff}
          message='No images available for this property'
          className='h-48'
        />
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
