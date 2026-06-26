'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGetPropertyDetailsQuery } from '@/store/api/endpoints/client/Common/Properties/PropertiesApi';
import formatChoiceFieldValue from '@/utils/formatters';
import { ArrowLeft, LoaderPinwheel, MapPin, Pencil } from 'lucide-react';
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
        <LoaderPinwheel className='text-primary size-6 animate-spin' />
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <p className='text-muted-foreground text-sm'>
          Failed to load property.
        </p>
      </div>
    );
  }

  const isOccupied = property.status === 'OCCUPIED';

  return (
    <div className='space-y-6 px-4 py-6'>
      {/* ── Back + Header ── */}
      <div className='flex items-start justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => router.push('/client/landlord/properties')}
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
            className={`gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${
              isOccupied
                ? 'bg-success/90 text-white'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <span
              className={`inline-block size-1.5 rounded-full ${
                isOccupied ? 'bg-white' : 'bg-muted-foreground/60'
              }`}
            />
            {formatChoiceFieldValue(property.status)}
          </Badge>
          <Button size='sm' variant='outline' onClick={() => setEditOpen(true)}>
            <Pencil className='mr-1.5 size-3.5' />
            Edit
          </Button>
        </div>
      </div>

      {/* ── Gallery ── */}
      {property.documents.length > 0 && (
        <PropertyGallery docs={property.documents} />
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
        onSuccess={() => router.push('/client/landlord/properties')}
        propertyAlias={property.alias}
        propertyName={property.property_name}
      />
    </div>
  );
};

export default PropertyDetails;
