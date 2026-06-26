'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { useGetPropertyDetailsQuery } from '@/store/api/endpoints/client/Common/Properties/PropertiesApi';
import {
  PropertyDetailsProps,
  PropertyDocument,
} from '@/types/client/Common/Properties/PropertyTypes';
import { getCurrencySign } from '@/utils/formatters';
import {
  AlertTriangle,
  ArrowLeft,
  Bath,
  Bed,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LoaderPinwheel,
  MapPin,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import DeletePropertyDialog from '../Dialogs/DeletePropertyDialog';
import UpdatePropertyDialog from '../Dialogs/UpdatePropertyDialog';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (val: string) =>
  `${getCurrencySign()}${parseFloat(val).toLocaleString()}`;

const formatDate = (iso: string | null) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const TYPE_LABELS: Record<string, string> = {
  RESIDENTIAL: 'Residential',
  HMO: 'HMO',
  COMMERCIAL: 'Commercial',
  MIXED_USE: 'Mixed Use',
  HOLIDAY_LET: 'Holiday Let',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className='flex items-start justify-between gap-4 py-2.5'>
    <span className='text-muted-foreground text-sm'>{label}</span>
    <span className='text-foreground text-right text-sm font-medium'>
      {value}
    </span>
  </div>
);

// ─── Document Gallery ─────────────────────────────────────────────────────────

const DocumentGallery: React.FC<{ docs: PropertyDocument[] }> = ({ docs }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  // Sync dot indicator with carousel position
  useEffect(() => {
    if (!api) return;
    const update = () => setCurrent(api.selectedScrollSnap());
    api.on('init', update);
    api.on('select', update);
    return () => {
      api.off('init', update);
      api.off('select', update);
    };
  }, [api]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft')
        setLightboxIndex((i) => (i - 1 + docs.length) % docs.length);
      if (e.key === 'ArrowRight')
        setLightboxIndex((i) => (i + 1) % docs.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxOpen, docs.length]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxOpen]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* ── Main Carousel ── */}
      <Carousel setApi={setApi} className='w-full'>
        <CarouselContent>
          {docs.map((doc, index) => (
            <CarouselItem key={doc.id}>
              <div
                className='relative aspect-video w-full cursor-zoom-in overflow-hidden rounded-xl'
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={doc.image}
                  alt={doc.description ?? `Image ${index + 1}`}
                  fill
                  className='object-cover transition-transform duration-300 hover:scale-[1.02]'
                  sizes='(max-width: 1024px) 100vw, 860px'
                  priority={index === 0}
                />
              </div>
              {doc.description && (
                <p className='text-muted-foreground mt-2 text-center text-xs'>
                  {doc.description}
                </p>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>

        {docs.length > 1 && (
          <>
            <CarouselPrevious className='left-2' />
            <CarouselNext className='right-2' />
          </>
        )}
      </Carousel>

      {/* ── Lightbox Portal ── */}
      {lightboxOpen &&
        createPortal(
          <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm'
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close */}
            <Button
              className='absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20'
              onClick={() => setLightboxOpen(false)}
              aria-label='Close'
            >
              <X className='size-5' />
            </Button>

            {/* Counter */}
            {docs.length > 1 && (
              <span className='absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white/70 tabular-nums'>
                {lightboxIndex + 1} / {docs.length}
              </span>
            )}

            {/* Image */}
            <div
              className='relative h-[85vh] w-[90vw]'
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={docs[lightboxIndex].image}
                alt={
                  docs[lightboxIndex].description ??
                  `Image ${lightboxIndex + 1}`
                }
                fill
                className='object-contain'
                sizes='90vw'
                priority
              />
              {docs[lightboxIndex].description && (
                <p className='absolute right-0 bottom-0 left-0 mt-2 text-center text-sm text-white/60'>
                  {docs[lightboxIndex].description}
                </p>
              )}
            </div>

            {/* Prev / Next */}
            {docs.length > 1 && (
              <>
                <Button
                  className='absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/25'
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(
                      (i) => (i - 1 + docs.length) % docs.length,
                    );
                  }}
                  aria-label='Previous image'
                >
                  <ChevronLeft className='size-5' />
                </Button>
                <Button
                  className='absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/25'
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((i) => (i + 1) % docs.length);
                  }}
                  aria-label='Next image'
                >
                  <ChevronRight className='size-5' />
                </Button>
              </>
            )}
          </div>,
          document.body,
        )}
    </>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  onEdit,
  onDelete,
}) => {
  const params = useParams();
  const alias = params.propertyalias as string;
  const {
    data: property,
    isLoading,
    isError,
    refetch,
  } = useGetPropertyDetailsQuery(alias, {
    skip: !alias,
  });
  const router = useRouter();
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <LoaderPinwheel className='text-muted-foreground size-6 animate-spin' />
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
  const heroImage = property.documents?.[0]?.image ?? '';

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
              className={`inline-block size-1.5 rounded-full ${isOccupied ? 'bg-white' : 'bg-muted-foreground/60'}`}
            />
            {property.status}
          </Badge>
          <Button size='sm' variant='outline' onClick={() => setEditOpen(true)}>
            <Pencil className='mr-1.5 size-3.5' />
            Edit
          </Button>
        </div>
      </div>

      {/* ── Hero Image ── */}
      <Card className='border-border overflow-hidden rounded-2xl pt-0 pb-0 shadow-sm'>
        <div className='relative h-auto w-full'>
          {/* ── Documents / Gallery ── */}
          {property.documents.length > 0 && (
            <Card className='border-border rounded-2xl py-0 shadow-sm'>
              <DocumentGallery docs={property.documents} />
            </Card>
          )}
        </div>
      </Card>

      {/* ── Main Grid ── */}
      <div className='grid gap-6 md:grid-cols-2'>
        {/* ── Property Info ── */}
        <Card className='border-border rounded-2xl shadow-sm'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base font-semibold'>
              Property Details
            </CardTitle>
          </CardHeader>
          <CardContent className='divide-border divide-y px-5 pb-4'>
            <InfoRow
              label='Type'
              value={
                <span className='flex items-center gap-1.5'>
                  <Building2 className='text-primary size-3.5' />
                  {TYPE_LABELS[property.property_type] ??
                    property.property_type}
                </span>
              }
            />
            {property.bedrooms != null && (
              <InfoRow
                label='Bedrooms'
                value={
                  <span className='flex items-center gap-1.5'>
                    <Bed className='text-primary size-3.5' />
                    {property.bedrooms}
                  </span>
                }
              />
            )}
            {property.bathrooms != null && (
              <InfoRow
                label='Bathrooms'
                value={
                  <span className='flex items-center gap-1.5'>
                    <Bath className='text-primary size-3.5' />
                    {property.bathrooms}
                  </span>
                }
              />
            )}
            <InfoRow
              label='Purchase Date'
              value={
                <span className='flex items-center gap-1.5'>
                  <CalendarDays className='text-primary size-3.5' />
                  {formatDate(property.purchase_date)}
                </span>
              }
            />
          </CardContent>
        </Card>

        {/* ── Financials ── */}
        <Card className='border-border rounded-2xl shadow-sm'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base font-semibold'>
              Financials
            </CardTitle>
          </CardHeader>
          <CardContent className='divide-border divide-y px-5 pb-4'>
            <InfoRow
              label='Rent / Month'
              value={
                property.rent_per_month ? (
                  <span className='text-primary font-bold'>
                    {fmt(property.rent_per_month)}/mo
                  </span>
                ) : (
                  '—'
                )
              }
            />
            <InfoRow
              label='Purchase Price'
              value={fmt(property.purchase_price)}
            />
            <InfoRow
              label='Current Value'
              value={fmt(property.current_value)}
            />
          </CardContent>
        </Card>
      </div>

      {/* ── Notes ── */}
      {property.notes && (
        <Card className='border-border rounded-2xl shadow-sm'>
          <CardHeader className='pb-2'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-base font-semibold'>Notes</CardTitle>
            </div>
          </CardHeader>
          <CardContent className='px-5 pb-5'>
            <p className='text-muted-foreground text-sm leading-relaxed whitespace-pre-line'>
              {property.notes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* ── Danger Zone ── */}
      <Card className='border-destructive/40 rounded-2xl shadow-sm'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-destructive flex items-center gap-2 text-base font-semibold'>
            <AlertTriangle className='size-4' />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4 px-5 pb-5'>
          <Separator className='bg-destructive/20' />
          <div className='flex items-start justify-between gap-4'>
            <div>
              <p className='text-foreground text-sm font-medium'>
                Delete property
              </p>
              <p className='text-muted-foreground mt-0.5 text-xs'>
                Permanently removes this property and all associated data. This
                cannot be undone.
              </p>
            </div>
            {!deleteConfirm ? (
              <Button
                variant='destructive'
                size='sm'
                className='shrink-0'
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className='mr-1.5 size-3.5' />
                Delete
              </Button>
            ) : (
              <div className='flex shrink-0 items-center gap-2'>
                <span className='text-muted-foreground text-xs'>Sure?</span>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => {
                    setDeleteConfirm(false);
                    onDelete?.();
                  }}
                >
                  Confirm
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
