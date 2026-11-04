'use client';
import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import Loading from '@/components/common/CustomLoader/Loading';
import DetailsCopyId from '@/components/common/DetailsPage/DetailsCopyId';
import DetailsEmptyState from '@/components/common/DetailsPage/DetailsEmptyState';
import DetailsInfoItem from '@/components/common/DetailsPage/DetailsInfoItem';
import DetailsPageHeader from '@/components/common/DetailsPage/DetailsPageHeader';
import DetailsSection from '@/components/common/DetailsPage/DetailsSection';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { MAINTENANCE_STATUS_OPTIONS } from '@/data/common/ChoiceFieldOptions';
import {
  canEditMaintenanceStatus,
  CATEGORY_META,
  STATUS_DOT,
  STATUS_STYLES,
} from '@/data/client/Common/PropertyMaintenance/PropertyMaintenanceData';
import {
  useEditPropertyMaintenanceMutation,
  useGetPropertyMaintenanceDetailsQuery,
} from '@/store/api/endpoints/client/Common/PropertyMaintenance/PropertyMaintenanceApi';
import { MaintenanceRequest } from '@/types/client/Common/PropertyMaintenance/PropertyMaintenanceType';
import formatChoiceFieldValue, { formatDateAndTime } from '@/utils/formatters';
import {
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  History,
  ImageOff,
  Images,
  StickyNote,
  Trash,
  User,
  X,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import DeleteMaintenanceRequestDialog from '../Dialogs/DeleteMaintenanceRequestDialog';
import EditMaintenanceRequestDialog from '../Dialogs/EditMaintenanceRequestDialog';
import PropertyMaintenanceComments from './PropertyMaintenanceComments/PropertyMaintenanceComments';

const PropertyMaintenanceDetails: React.FC = () => {
  const { data: session } = useSession();
  const { maintenancealias } = useParams();
  const [
    isEditMaintenanceRequestDialogOpen,
    setIsEditMaintenanceRequestDialogOpen,
  ] = useState(false);
  const [
    isDeleteMaintenanceRequestDialogOpen,
    setIsDeleteMaintenanceRequestDialogOpen,
  ] = useState(false);
  const [selectedRequestAlias, setSelectedRequestAlias] = useState<
    string | null
  >(null);

  const handleOpenEditDialog = (alias: string) => {
    setSelectedRequestAlias(alias);
    setIsEditMaintenanceRequestDialogOpen(true);
  };

  const handleOpenDeleteDialog = (alias: string) => {
    setSelectedRequestAlias(alias);
    setIsDeleteMaintenanceRequestDialogOpen(true);
  };
  const {
    data: maintenanceDetails,
    isLoading,
    isError,
  } = useGetPropertyMaintenanceDetailsQuery(maintenancealias, {
    skip: !maintenancealias,
  });

  const maintenanceRequestDetails: MaintenanceRequest | undefined =
    maintenanceDetails;

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  // Tracks which thumbnail images have finished loading, keyed by document id
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  // Tracks whether the full-size image in the lightbox has finished loading
  const [lightboxImageLoaded, setLightboxImageLoaded] = useState(false);

  const documents = maintenanceRequestDetails?.documents ?? [];

  const handleImageLoaded = (id: number | string) => {
    setLoadedImages((prev) => ({ ...prev, [String(id)]: true }));
  };

  // Opens the lightbox at a given index and resets its loaded state,
  // called directly from user interactions rather than from an effect.
  const openLightbox = (index: number) => {
    setLightboxImageLoaded(false);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const goToLightboxIndex = (updater: (i: number) => number) => {
    setLightboxIndex((i) => {
      if (i === null) return i;
      setLightboxImageLoaded(false);
      return updater(i);
    });
  };

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight')
        goToLightboxIndex((i) => (i + 1) % documents.length);
      if (e.key === 'ArrowLeft')
        goToLightboxIndex((i) => (i - 1 + documents.length) % documents.length);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, documents.length]);

  const [editStatus, { isLoading: isStatusUpdating }] =
    useEditPropertyMaintenanceMutation();

  const canEditStatus = canEditMaintenanceStatus(session?.user?.role);

  const handleStatusChange = async (newStatus: string) => {
    if (!maintenanceRequestDetails?.alias) return;
    try {
      await editStatus({
        alias: maintenanceRequestDetails.alias,
        payload: { current_status: newStatus },
      }).unwrap();
      toast.success('Status updated successfully.');
    } catch (error) {
      toast.error('Failed to update status.');
    }
  };

  if (isLoading) {
    return (
      <div className='mx-auto'>
        {/* Header */}
        <div className='mb-6 rounded-2xl border p-5 sm:p-6'>
          <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
            <div className='flex min-w-0 flex-1 items-start gap-4'>
              <Skeleton className='size-9 shrink-0 rounded-full' />
              <div className='min-w-0 flex-1'>
                <Skeleton className='mb-2 h-3 w-32' />
                <Skeleton className='mb-3 h-7 w-80 max-w-full' />
                <div className='flex gap-2'>
                  <Skeleton className='h-6 w-28 rounded-full' />
                  <Skeleton className='h-6 w-20 rounded-full' />
                  <Skeleton className='h-6 w-24 rounded-full' />
                </div>
              </div>
            </div>
            <div className='flex gap-2'>
              <Skeleton className='h-9 w-20' />
              <Skeleton className='h-9 w-20' />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            {/* Notes skeleton */}
            <div className='rounded-xl border p-5 sm:p-6'>
              <Skeleton className='mb-3 h-4 w-16' />
              <Skeleton className='mb-2 h-4 w-full' />
              <Skeleton className='mb-2 h-4 w-11/12' />
              <Skeleton className='h-4 w-2/3' />
            </div>

            {/* Photos skeleton */}
            <div className='rounded-xl border p-5 sm:p-6'>
              <Skeleton className='mb-3 h-4 w-20' />
              <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className='aspect-square w-full rounded-lg'
                  />
                ))}
              </div>
            </div>
          </div>

          <div className='space-y-6'>
            {/* Requested by skeleton */}
            <div className='rounded-xl border p-5'>
              <Skeleton className='mb-4 h-4 w-28' />
              <div className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <Skeleton className='size-4 shrink-0 rounded' />
                  <div className='min-w-0 flex-1'>
                    <Skeleton className='mb-1 h-3 w-12' />
                    <Skeleton className='h-4 w-32' />
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <Skeleton className='size-4 shrink-0 rounded' />
                  <div className='min-w-0 flex-1'>
                    <Skeleton className='mb-1 h-3 w-14' />
                    <Skeleton className='h-4 w-40' />
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline skeleton */}
            <div className='rounded-xl border p-5'>
              <Skeleton className='mb-4 h-4 w-20' />
              <div className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <Skeleton className='size-4 shrink-0 rounded' />
                  <div className='min-w-0 flex-1'>
                    <Skeleton className='mb-1 h-3 w-16' />
                    <Skeleton className='mb-1 h-4 w-28' />
                    <Skeleton className='h-3 w-14' />
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <Skeleton className='size-4 shrink-0 rounded' />
                  <div className='min-w-0 flex-1'>
                    <Skeleton className='mb-1 h-3 w-20' />
                    <Skeleton className='mb-1 h-4 w-28' />
                    <Skeleton className='h-3 w-14' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !maintenanceRequestDetails) {
    return (
      <div className='mx-auto w-full max-w-6xl py-16'>
        <CustomErrorMessage title='maintenance request' />
      </div>
    );
  }

  return (
    <div className='mx-auto space-y-6'>
      <DetailsPageHeader
        eyebrow={
          session?.user?.role === 'TENANT'
            ? 'Maintenance request'
            : 'Property maintenance'
        }
        title={maintenanceRequestDetails?.issue}
        tone={maintenanceRequestDetails?.is_emergency ? 'danger' : 'default'}
        actions={
          <>
            {session?.user?.role === 'TENANT' && (
              <Button
                variant='default'
                onClick={() =>
                  handleOpenEditDialog(maintenanceRequestDetails?.alias)
                }
              >
                <Edit />
                Edit
              </Button>
            )}
            <Button
              variant='destructive'
              onClick={() =>
                handleOpenDeleteDialog(maintenanceRequestDetails?.alias)
              }
            >
              <Trash />
              Delete
            </Button>
          </>
        }
        meta={
          <>
            <DetailsCopyId
              copyKey={maintenanceRequestDetails?.alias}
              value={maintenanceRequestDetails?.request_id}
              label='Maintenance ID'
            />
            {maintenanceRequestDetails?.is_emergency && (
              <Badge className='gap-1 rounded-full bg-rose-600 px-2.5 py-0.5 text-xs font-semibold text-white hover:bg-rose-600'>
                <span className='relative flex size-1.5'>
                  <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75' />
                  <span className='relative inline-flex size-1.5 rounded-full bg-white' />
                </span>
                Emergency
              </Badge>
            )}
            {canEditStatus ? (
              <Select
                value={maintenanceRequestDetails?.current_status}
                onValueChange={handleStatusChange}
                disabled={isStatusUpdating}
              >
                <SelectTrigger
                  className={`h-5! w-fit gap-1.5 rounded-full border-none px-3 py-1 text-xs font-medium shadow-none ${STATUS_STYLES[maintenanceRequestDetails?.current_status]}`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align='start'>
                  {MAINTENANCE_STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <span className='flex items-center gap-1.5'>
                        <span
                          className={`size-1.5 shrink-0 rounded-full ${STATUS_DOT[status.value]}`}
                        />
                        {status.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Badge
                className={`gap-1.5 ${STATUS_STYLES[maintenanceRequestDetails?.current_status]}`}
              >
                <span
                  className={`size-1.5 rounded-full ${STATUS_DOT[maintenanceRequestDetails?.current_status]}`}
                />
                {formatChoiceFieldValue(
                  maintenanceRequestDetails?.current_status,
                )}
              </Badge>
            )}
            <Badge
              className={`gap-1.5 ring-1 ring-inset ${CATEGORY_META[maintenanceRequestDetails?.category].classes}`}
            >
              {(() => {
                const CategoryIcon =
                  CATEGORY_META[maintenanceRequestDetails?.category].icon;
                return <CategoryIcon className='size-3' />;
              })()}
              {formatChoiceFieldValue(maintenanceRequestDetails?.category)}
            </Badge>
          </>
        }
      />

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Main column */}
        <div className='space-y-6 lg:col-span-2'>
          {/* Notes */}
          <DetailsSection title='Notes' icon={StickyNote}>
            {maintenanceRequestDetails?.notes ? (
              <p className='text-foreground text-sm leading-relaxed whitespace-pre-line'>
                {maintenanceRequestDetails?.notes}
              </p>
            ) : (
              <p className='text-muted-foreground text-sm italic'>
                No additional notes were provided.
              </p>
            )}
          </DetailsSection>

          {/* Photos */}
          <DetailsSection
            title='Photos'
            icon={Images}
            action={
              documents.length > 0 && (
                <span className='bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium'>
                  {documents.length}
                </span>
              )
            }
          >
            {documents.length === 0 ? (
              <DetailsEmptyState
                icon={ImageOff}
                message='No photos were attached'
              />
            ) : (
              <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
                {documents.map((doc, i) => (
                  <button
                    key={doc.id}
                    onClick={() => openLightbox(i)}
                    className='group bg-muted/40 relative aspect-square cursor-zoom-in overflow-hidden rounded-xl border'
                  >
                    {!loadedImages[String(doc.id)] && (
                      <div className='bg-muted/40 absolute inset-0 z-10 flex items-center justify-center'>
                        <Loading />
                      </div>
                    )}
                    <Image
                      src={doc.file}
                      alt={`Attachment ${i + 1} for ${maintenanceRequestDetails?.issue}`}
                      height={200}
                      width={200}
                      onLoad={() => handleImageLoaded(doc.id)}
                      className={`size-full object-cover transition-all duration-200 group-hover:scale-105 ${
                        loadedImages[String(doc.id)]
                          ? 'opacity-100'
                          : 'opacity-0'
                      }`}
                    />
                    <div className='absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10' />
                  </button>
                ))}
              </div>
            )}
          </DetailsSection>
        </div>

        {/* Sidebar */}

        <div className='space-y-6'>
          {session?.user?.role !== 'TENANT' && (
            <DetailsSection title='Requested by' icon={User}>
              <dl className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <Avatar className='size-9 shrink-0'>
                    <AvatarImage
                      src={
                        maintenanceRequestDetails?.tenant.avatar ?? undefined
                      }
                      alt={maintenanceRequestDetails?.tenant.name ?? 'Tenant'}
                    />
                    <AvatarFallback className='bg-primary/10'>
                      <User />
                    </AvatarFallback>
                  </Avatar>

                  <div className='min-w-0'>
                    <dt className='text-muted-foreground text-xs'>Tenant</dt>
                    <dd className='truncate text-sm font-medium'>
                      {maintenanceRequestDetails?.tenant.name}
                    </dd>
                    <p className='text-muted-foreground text-xs'>
                      {maintenanceRequestDetails?.tenant.email}
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      {maintenanceRequestDetails?.tenant.phone}
                    </p>
                  </div>
                </div>
                <DetailsInfoItem
                  icon={Building2}
                  label='Property'
                  value={maintenanceRequestDetails?.property}
                />
              </dl>
            </DetailsSection>
          )}

          <DetailsSection title='Timeline' icon={History}>
            <dl className='space-y-4'>
              <DetailsInfoItem
                icon={Calendar}
                label='Submitted'
                value={formatDateAndTime(maintenanceRequestDetails?.created_at)}
              />
              <DetailsInfoItem
                icon={Clock}
                label='Last updated'
                value={formatDateAndTime(maintenanceRequestDetails?.updated_at)}
              />
            </dl>
          </DetailsSection>
        </div>
      </div>

      <PropertyMaintenanceComments pmAlias={maintenanceRequestDetails?.alias} />

      {/* Lightbox */}
      {lightboxIndex !== null && documents[lightboxIndex] && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4'
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={closeLightbox}
            className='absolute top-4 right-4 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white'
            aria-label='Close'
          >
            <X className='size-5' />
          </button>

          {documents.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToLightboxIndex(
                    (i) => (i - 1 + documents.length) % documents.length,
                  );
                }}
                className='absolute left-4 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white'
                aria-label='Previous photo'
              >
                <ChevronLeft className='size-6' />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToLightboxIndex((i) => (i + 1) % documents.length);
                }}
                className='absolute right-4 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white'
                aria-label='Next photo'
              >
                <ChevronRight className='size-6' />
              </button>
            </>
          )}

          {!lightboxImageLoaded && (
            <div className='absolute inset-0 flex items-center justify-center'>
              <Loading />
            </div>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={documents[lightboxIndex].file}
            alt={`Attachment ${lightboxIndex + 1} for ${maintenanceRequestDetails?.issue}`}
            className={`max-h-[85vh] max-w-full rounded-lg object-contain transition-opacity duration-200 ${
              lightboxImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setLightboxImageLoaded(true)}
            onClick={(e) => e.stopPropagation()}
          />

          {documents.length > 1 && (
            <span className='absolute bottom-4 text-xs text-white/70'>
              {lightboxIndex + 1} / {documents.length}
            </span>
          )}
        </div>
      )}
      {/* Dialogs  */}
      <EditMaintenanceRequestDialog
        isOpen={isEditMaintenanceRequestDialogOpen}
        onClose={() => setIsEditMaintenanceRequestDialogOpen(false)}
        maintenanceRequestAlias={selectedRequestAlias || ''}
      />
      <DeleteMaintenanceRequestDialog
        isOpen={isDeleteMaintenanceRequestDialogOpen}
        onClose={() => setIsDeleteMaintenanceRequestDialogOpen(false)}
        maintenanceRequestAlias={selectedRequestAlias || ''}
        maintenanceRequestId={maintenanceRequestDetails?.request_id || ''}
      />
    </div>
  );
};

export default PropertyMaintenanceDetails;
