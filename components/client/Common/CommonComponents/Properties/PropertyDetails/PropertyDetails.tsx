'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  PROPERTY_STATUS_OPTIONS,
  STATUS_STYLES,
} from '@/data/client/common/properties/PropertiesData';
import { useGetPropertyDetailsQuery } from '@/store/api/endpoints/client/Common/Properties/PropertiesApi';
import { getPropertiesUrl } from '@/utils/redirectPath';
import { ArrowLeft, ImageOff, MapPin, Pencil } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import DeletePropertyDialog from '../Dialogs/DeletePropertyDialog';
import UpdatePropertyDialog from '../Dialogs/UpdatePropertyDialog';
import PropertyDangerZone from './PropertyDangerZone/PropertyDangerZone';
import PropertyFinancials from './PropertyFinancials/PropertyFinancials';
import PropertyGallery from './PropertyGallery/PropertyGallery';
import PropertyInfo from './Propertyinfo/Propertyinfo';
import PropertyNotes from './Propertynotes/PropertyNotes';

const PropertyDetails: React.FC = () => {
  const params = useParams();
  const alias = params.propertyalias as string;
  const {
    data: property,
    isLoading,
    isError,
    refetch,
  } = useGetPropertyDetailsQuery(alias, { skip: !alias });
  const { data: session } = useSession();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loading />
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loading />
      </div>
    );
  }

  return (
    <div className='space-y-6 px-4 py-6'>
      {/* ── Back + Header ── */}
      <div className='flex items-start justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => window.history.back()}
            className='text-muted-foreground hover:text-foreground shrink-0'
          >
            <ArrowLeft className='size-5' />
          </Button>
          <div>
            <h1 className='text-foreground text-xl leading-tight font-bold'>
              {property.property_name}
            </h1>
            <p className='text-muted-foreground mt-0.5 flex items-center gap-1 text-sm'>
              <MapPin className='text-primary size-3.5 shrink-0' />
              {property.address}
            </p>
          </div>
        </div>

        <div className='flex shrink-0 items-center gap-2'>
          <Badge
            className={`gap-1.5 rounded-full text-xs font-semibold ${STATUS_STYLES[property.status] ?? 'bg-muted text-muted-foreground'}`}
          >
            <span className='inline-block size-1.5 rounded-full bg-white' />
            <span>
              {PROPERTY_STATUS_OPTIONS.find(
                (opt) => opt.value === property.status,
              )?.label ?? property.status}
            </span>
          </Badge>
          <Button size='sm' variant='outline' onClick={() => setEditOpen(true)}>
            <Pencil className='mr-1.5 size-3.5' />
            Edit
          </Button>
        </div>
      </div>

      {/* ── Gallery ── */}
      {property.documents.length > 0 ? (
        <PropertyGallery docs={property.documents} />
      ) : (
        <div className='border-danger text-muted-foreground flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed'>
          <ImageOff className='text-danger size-6' />
          <span className='text-sm'>No images uploaded for this property</span>
        </div>
      )}
      {/* ── Info + Financials ── */}
      <div className='grid gap-6 md:grid-cols-2'>
        <PropertyInfo property={property} />
        <PropertyFinancials property={property} />
      </div>

      {/* ── Notes ── */}
      {property.notes && <PropertyNotes notes={property.notes} />}

      {/* ── Danger Zone ── */}
      {session?.user?.role === 'LANDLORD' && (
        <PropertyDangerZone onDeleteClick={() => setDeleteOpen(true)} />
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
        onSuccess={() => router.push(getPropertiesUrl(session))}
        propertyAlias={property.alias}
        propertyName={property.property_name}
      />
    </div>
  );
};

export default PropertyDetails;
