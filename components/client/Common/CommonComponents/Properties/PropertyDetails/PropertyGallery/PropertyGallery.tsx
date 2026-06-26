'use client';

import { Button } from '@/components/ui/button';
import { PropertyDocument } from '@/types/client/Common/Properties/PropertyTypes';
import { ChevronLeft, ChevronRight, LoaderPinwheel, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PropertyGalleryProps {
  docs: PropertyDocument[];
}

// ─── Grid icon ────────────────────────────────────────────────────────────────

const GridIcon = () => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 16 16'
    fill='none'
    className='shrink-0'
  >
    <rect
      x='1'
      y='1'
      width='6'
      height='6'
      rx='1'
      stroke='currentColor'
      strokeWidth='1.5'
    />
    <rect
      x='9'
      y='1'
      width='6'
      height='6'
      rx='1'
      stroke='currentColor'
      strokeWidth='1.5'
    />
    <rect
      x='1'
      y='9'
      width='6'
      height='6'
      rx='1'
      stroke='currentColor'
      strokeWidth='1.5'
    />
    <rect
      x='9'
      y='9'
      width='6'
      height='6'
      rx='1'
      stroke='currentColor'
      strokeWidth='1.5'
    />
  </svg>
);

// ─── Image with loader ────────────────────────────────────────────────────────
// Wraps Next/Image and shows a centred spinner until the image has loaded.

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({
  src,
  alt,
  sizes,
  priority = false,
  className = 'object-cover',
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* Spinner — visible until image loads */}
      {!loaded && (
        <div className='bg-muted/40 absolute inset-0 flex items-center justify-center'>
          <LoaderPinwheel className='text-primary size-6 animate-spin' />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`transition-opacity duration-300 ${className} ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ docs }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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

  if (docs.length === 0) return null;

  const [hero, ...rest] = docs;
  const gridItems = rest.slice(0, 4);

  // ── Single image ──
  if (docs.length === 1) {
    return (
      <>
        <div
          className='bg-muted/40 relative aspect-video w-full cursor-zoom-in overflow-hidden rounded-2xl'
          onClick={() => openLightbox(0)}
        >
          <ImageWithLoader
            src={hero.image}
            alt={hero.description ?? 'Property image'}
            sizes='100vw'
            priority
            className='object-cover transition-transform duration-300 hover:scale-[1.02]'
          />
        </div>

        {lightboxOpen &&
          createPortal(
            <div
              className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm'
              onClick={() => setLightboxOpen(false)}
            >
              <Button
                className='absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20'
                onClick={() => setLightboxOpen(false)}
                aria-label='Close'
              >
                <X className='size-5' />
              </Button>
              <div
                className='relative h-[85vh] w-[90vw]'
                onClick={(e) => e.stopPropagation()}
              >
                <ImageWithLoader
                  src={docs[0].image}
                  alt={docs[0].description ?? 'Image 1'}
                  sizes='90vw'
                  priority
                  className='object-contain'
                />
              </div>
            </div>,
            document.body,
          )}
      </>
    );
  }

  return (
    <>
      {/* ── Photo Grid ── */}
      <div className='relative overflow-hidden rounded-2xl'>
        <div
          className='grid gap-1'
          style={{
            gridTemplateColumns: '2fr 1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            height: '420px',
          }}
        >
          {/* Hero — spans full 2 rows on the left */}
          <div
            className='bg-muted/40 relative row-span-2 cursor-zoom-in overflow-hidden'
            onClick={() => openLightbox(0)}
          >
            <ImageWithLoader
              src={hero.image}
              alt={hero.description ?? 'Property image 1'}
              sizes='50vw'
              priority
              className='object-cover transition-transform duration-300 hover:scale-[1.02]'
            />
          </div>

          {/* Up to 4 thumbnails on the right (2×2) */}
          {gridItems.map((doc, i) => {
            const isLast = i === gridItems.length - 1 && docs.length > 5;
            return (
              <div
                key={doc.id}
                className='bg-muted/40 relative cursor-zoom-in overflow-hidden'
                onClick={() => openLightbox(i + 1)}
              >
                <ImageWithLoader
                  src={doc.image}
                  alt={doc.description ?? `Property image ${i + 2}`}
                  sizes='25vw'
                  className='object-cover transition-transform duration-300 hover:scale-[1.02]'
                />
                {isLast && (
                  <div className='absolute inset-0 flex items-end justify-end p-3'>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(i + 1);
                      }}
                    >
                      <GridIcon />
                      Show all photos
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Floating "Show all photos" when ≤5 total images */}
        {docs.length <= 5 && (
          <Button
            className='absolute right-4 bottom-4 z-10'
            onClick={() => openLightbox(0)}
          >
            <GridIcon />
            Show all photos
          </Button>
        )}
      </div>

      {/* ── Lightbox Portal ── */}
      {lightboxOpen &&
        createPortal(
          <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm'
            onClick={() => setLightboxOpen(false)}
          >
            <Button
              className='absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20'
              onClick={() => setLightboxOpen(false)}
              aria-label='Close'
            >
              <X className='size-5' />
            </Button>

            {docs.length > 1 && (
              <span className='absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white/70 tabular-nums'>
                {lightboxIndex + 1} / {docs.length}
              </span>
            )}

            <div
              className='relative h-[85vh] w-[90vw]'
              onClick={(e) => e.stopPropagation()}
            >
              <ImageWithLoader
                src={docs[lightboxIndex].image}
                alt={
                  docs[lightboxIndex].description ??
                  `Image ${lightboxIndex + 1}`
                }
                sizes='90vw'
                priority
                className='object-contain'
              />
              {docs[lightboxIndex].description && (
                <p className='absolute right-0 bottom-0 left-0 mt-2 text-center text-sm text-white/60'>
                  {docs[lightboxIndex].description}
                </p>
              )}
            </div>

            {docs.length > 1 && (
              <>
                <Button
                  className='absolute top-1/2 left-3 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/25'
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
                  className='absolute top-1/2 right-3 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/25'
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

export default PropertyGallery;
