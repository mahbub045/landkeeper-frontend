'use client';
import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import Loading from '@/components/common/CustomLoader/Loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CATEGORY_META,
  STATUS_DOT,
  STATUS_STYLES,
} from '@/data/client/common/PropertyMaintenance/PropertyMaintenanceData';
import { useGetPropertyMaintenanceDetailsQuery } from '@/store/api/endpoints/client/Common/PropertyMaintenance/PropertyMaintenanceApi';
import { MaintenanceRequest } from '@/types/client/Common/PropertyMaintenance/PropertyMaintenanceType';
import formatChoiceFieldValue, { formatDateAndTime } from '@/utils/formatters';
import {
  ArrowLeft,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  ImageOff,
  Trash,
  User,
  X,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

const PropertyMaintenanceDetails: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { maintenancealias } = useParams();
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

  if (isLoading) {
    return (
      <div className='mx-auto'>
        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <Skeleton className='mb-2 h-7 w-72' />
            <Skeleton className='h-4 w-56' />
          </div>
          <div className='flex flex-wrap gap-2'>
            <Skeleton className='h-9 w-20' />
            <Skeleton className='h-9 w-20' />
            <Skeleton className='h-9 w-20' />
          </div>
        </div>

        {/* Header */}
        <div className='mb-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-6'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
            <div className='min-w-0 flex-1'>
              <Skeleton className='mb-2 h-3 w-24' />
              <Skeleton className='mb-3 h-6 w-80 max-w-full' />
              <div className='flex gap-2'>
                <Skeleton className='h-5 w-20 rounded-full' />
                <Skeleton className='h-5 w-24 rounded-full' />
              </div>
            </div>
            <Skeleton className='h-9 w-32 shrink-0' />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            {/* Notes skeleton */}
            <div className='rounded-xl border border-gray-200 bg-white p-5 sm:p-6'>
              <Skeleton className='mb-3 h-4 w-16' />
              <Skeleton className='mb-2 h-4 w-full' />
              <Skeleton className='mb-2 h-4 w-11/12' />
              <Skeleton className='h-4 w-2/3' />
            </div>

            {/* Photos skeleton */}
            <div className='rounded-xl border border-gray-200 bg-white p-5 sm:p-6'>
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
            <div className='rounded-xl border border-gray-200 bg-white p-5'>
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
            <div className='rounded-xl border border-gray-200 bg-white p-5'>
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
    <div className='mx-auto'>
      <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-foreground text-2xl font-bold tracking-tight'>
            Property Maintenance{' '}
            {session?.user?.role === 'TENANT' ? 'Requests' : ''} Details
          </h1>
          <p className='text-muted-foreground text-sm'>
            Manage your property maintenance{' '}
            {session?.user?.role === 'TENANT' ? 'requests' : ''} Details
          </p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Button variant='outline' onClick={() => router.back()}>
            <ArrowLeft className='size-4' />
            Back
          </Button>
          <Button variant='default'>
            <Edit />
            Edit
          </Button>
          <Button variant='destructive'>
            <Trash />
            Delete
          </Button>
        </div>
      </div>

      {/* Header */}
      <div
        className={`mb-6 rounded-xl border p-5 sm:p-6 ${
          maintenanceRequestDetails?.is_emergency
            ? 'border-rose-200 bg-rose-50/40'
            : 'border-gray-200 bg-white'
        }`}
      >
        <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
          <div className='min-w-0'>
            <div className='mb-2 flex flex-wrap items-center gap-2'>
              <span className='font-mono text-xs font-medium tracking-wide text-gray-400'>
                {maintenanceRequestDetails?.request_id}
              </span>
              {maintenanceRequestDetails?.is_emergency && (
                <Badge className='gap-1 rounded-full bg-rose-600 px-2.5 py-0.5 text-xs font-semibold text-white hover:bg-rose-600'>
                  <span className='relative flex size-1.5'>
                    <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75' />
                    <span className='relative inline-flex size-1.5 rounded-full bg-white' />
                  </span>
                  Emergency
                </Badge>
              )}
            </div>
            <h1 className='text-xl font-semibold text-gray-900 sm:text-2xl'>
              {maintenanceRequestDetails?.issue}
            </h1>
            <div className='mt-2 flex flex-wrap items-center gap-2'>
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
            </div>
          </div>

          {session?.user?.role !== 'TENANT' && (
            <div className='flex shrink-0 gap-2'>
              <Button
                variant='outline'
                onClick={() =>
                  console.log(
                    'Update status clicked for',
                    maintenanceRequestDetails?.alias,
                  )
                }
              >
                Update status
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Main column */}
        <div className='space-y-6 lg:col-span-2'>
          {/* Notes */}
          <section className='rounded-xl border border-gray-200 bg-white p-5 sm:p-6'>
            <h2 className='mb-3 text-sm font-semibold text-gray-900'>Notes</h2>
            {maintenanceRequestDetails?.notes ? (
              <p className='text-sm leading-relaxed text-gray-600'>
                {maintenanceRequestDetails?.notes}
              </p>
            ) : (
              <p className='text-sm text-gray-400 italic'>
                No additional notes were provided.
              </p>
            )}
          </section>

          {/* Photos */}
          <section className='rounded-xl border border-gray-200 bg-white p-5 sm:p-6'>
            <h2 className='mb-3 text-sm font-semibold text-gray-900'>
              Photos
              {documents.length > 0 && (
                <span className='ml-1.5 font-normal text-gray-400'>
                  ({documents.length})
                </span>
              )}
            </h2>
            {documents.length === 0 ? (
              <div className='flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 py-10 text-gray-400'>
                <ImageOff className='size-6' />
                <p className='text-sm'>No photos were attached</p>
              </div>
            ) : (
              <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
                {documents.map((doc, i) => (
                  <button
                    key={doc.id}
                    onClick={() => openLightbox(i)}
                    className='group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50'
                  >
                    {!loadedImages[String(doc.id)] && (
                      <div className='absolute inset-0 z-10 flex items-center justify-center bg-gray-50'>
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
          </section>
        </div>

        {/* Sidebar */}

        <div className='space-y-6'>
          {session?.user?.role !== 'TENANT' && (
            <section className='rounded-xl border border-gray-200 bg-white p-5'>
              <h2 className='mb-4 text-sm font-semibold text-gray-900'>
                Requested by
              </h2>
              <dl className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <User className='mt-0.5 size-4 shrink-0 text-gray-400' />
                  <div className='min-w-0'>
                    <dt className='text-xs text-gray-400'>Tenant</dt>
                    <dd className='truncate text-sm font-medium text-gray-900'>
                      {maintenanceRequestDetails?.tenant}
                    </dd>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <Building2 className='mt-0.5 size-4 shrink-0 text-gray-400' />
                  <div className='min-w-0'>
                    <dt className='text-xs text-gray-400'>Property</dt>
                    <dd className='text-sm font-medium text-gray-900'>
                      {maintenanceRequestDetails?.property}
                    </dd>
                  </div>
                </div>
              </dl>
            </section>
          )}

          <section className='rounded-xl border border-gray-200 bg-white p-5'>
            <h2 className='mb-4 text-sm font-semibold text-gray-900'>
              Timeline
            </h2>
            <dl className='space-y-4'>
              <div className='flex items-start gap-3'>
                <Calendar className='mt-0.5 size-4 shrink-0 text-gray-400' />
                <div className='min-w-0'>
                  <dt className='text-xs text-gray-400'>Submitted</dt>
                  <dd className='text-sm font-medium text-gray-900'>
                    {formatDateAndTime(maintenanceRequestDetails?.created_at)}
                  </dd>
                  <dd className='text-xs text-gray-400'>
                    {timeAgo(maintenanceRequestDetails?.created_at)}
                  </dd>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <Clock className='mt-0.5 size-4 shrink-0 text-gray-400' />
                <div className='min-w-0'>
                  <dt className='text-xs text-gray-400'>Last updated</dt>
                  <dd className='text-sm font-medium text-gray-900'>
                    {formatDateAndTime(maintenanceRequestDetails?.updated_at)}
                  </dd>
                  <dd className='text-xs text-gray-400'>
                    {timeAgo(maintenanceRequestDetails?.updated_at)}
                  </dd>
                </div>
              </div>
            </dl>
          </section>
        </div>
      </div>

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
    </div>
  );
};

export default PropertyMaintenanceDetails;
