'use client';

import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import DetailsDangerZone from '@/components/common/DetailsPage/DetailsDangerZone';
import DetailsEmptyState from '@/components/common/DetailsPage/DetailsEmptyState';
import DetailsPageHeader from '@/components/common/DetailsPage/DetailsPageHeader';
import DetailsRecordHistory from '@/components/common/DetailsPage/DetailsRecordHistory';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { STATUS_STYLES } from '@/data/client/Common/Properties/PropertiesData';
import { PROPERTY_STATUS_OPTIONS } from '@/data/common/ChoiceFieldOptions';
import { useGetPropertyDetailsQuery } from '@/store/api/endpoints/client/Common/Properties/PropertiesApi';
import { useAppSelector } from '@/store/hooks';
import { removeUnderscoresAndCapitalize } from '@/utils/formatters';
import { getPropertiesUrl } from '@/utils/redirectPath';
import { ImageOff, MapPin, Pencil } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import DeletePropertyDialog from '../Dialogs/DeletePropertyDialog';
import UpdatePropertyDialog from '../Dialogs/UpdatePropertyDialog';
import PropertyDetailsSkeleton from './PropertyDetailsSkeleton';
import PropertyFinancials from './PropertyFinancials/PropertyFinancials';
import PropertyGallery from './PropertyGallery/PropertyGallery';
import PropertyInfo from './Propertyinfo/Propertyinfo';
import PropertyNotes from './Propertynotes/PropertyNotes';
import PropertyPermissionList from './PropertyPermissionList/PropertyPermissionList';
import PropertyRooms from './PropertyRooms/PropertyRooms';

const PropertyDetails: React.FC = () => {
  const { data: session } = useSession();
  const landlordAlias = useAppSelector(
    (state) => state.landlordAlias.landlordAlias,
  );
  const params = useParams();
  const alias = params.propertyalias as string;
  const {
    data: property,
    isLoading,
    isError,
    refetch,
  } = useGetPropertyDetailsQuery(alias, { skip: !alias });
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

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
        eyebrow='Property'
        title={property.property_name}
        description={
          <span className='flex items-center gap-1.5'>
            <MapPin className='text-primary size-3.5 shrink-0' />
            {property.address}
          </span>
        }
        meta={
          <>
            <Badge
              className={`gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[property.status] ?? 'bg-muted text-muted-foreground'}`}
            >
              <span className='inline-block size-1.5 rounded-full bg-white' />
              {PROPERTY_STATUS_OPTIONS.find(
                (opt) => opt.value === property.status,
              )?.label ?? property.status}
            </Badge>
            {property.property_type && (
              <Badge
                variant='outline'
                className='bg-background/80 rounded-full px-3 py-1 text-xs'
              >
                {removeUnderscoresAndCapitalize(property.property_type)}
              </Badge>
            )}
          </>
        }
        actions={
          property.can_edit && (
            <Button onClick={() => setEditOpen(true)}>
              <Pencil />
              Edit
            </Button>
          )
        }
      />

      {/* ── Gallery ── */}
      {property.documents.length > 0 ? (
        <PropertyGallery docs={property.documents} />
      ) : (
        <DetailsEmptyState
          icon={ImageOff}
          message='No images uploaded for this property'
          className='h-48'
        />
      )}

      {/* ── Info + Financials ── */}
      <div className='grid gap-6 md:grid-cols-2'>
        <PropertyInfo property={property} />
        <PropertyFinancials property={property} />
      </div>

      {/* ── HMO Rooms ── */}
      {property.property_type === 'HMO' && !!property.rooms?.length && (
        <PropertyRooms rooms={property.rooms} />
      )}

      {/* ── Notes ── */}
      {property.notes && <PropertyNotes notes={property.notes} />}

      {/* ── Record History ── */}
      <DetailsRecordHistory
        createdAt={property.created_at}
        updatedAt={property.updated_at}
      />

      {/* ── Permissions ── */}
      {session?.user?.role === 'LANDLORD' && (
        <PropertyPermissionList propertyAlias={property.alias} />
      )}

      {/* ── Danger Zone ── */}
      {session?.user?.role === 'LANDLORD' && (
        <DetailsDangerZone
          title='Delete property'
          description='Permanently removes this property and all associated data. This cannot be undone.'
          onDeleteClick={() => setDeleteOpen(true)}
        />
      )}

      {/* ── Dialogs ── */}
      <UpdatePropertyDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={() => refetch()}
        property={property}
      />
      <DeletePropertyDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onSuccess={() => router.push(getPropertiesUrl(session, landlordAlias))}
        propertyAlias={property.alias}
        propertyName={property.property_name}
      />
    </div>
  );
};

export default PropertyDetails;
