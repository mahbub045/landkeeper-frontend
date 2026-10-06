'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import {
  ImageWithLoaderProps,
  LightboxProps,
  PropertyGalleryProps,
} from '@/types/client/Common/Properties/PropertyDetailsTypes';
import { ChevronLeft, ChevronRight, Grid2x2, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// Image with loader

const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({
  src,
  alt,
  sizes,
  priority = false,
  fill = true,
  className = 'object-cover',
  unoptimized = false,
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <div className='bg-muted/40 absolute inset-0 flex items-center justify-center'>
          <Loading />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
        className={`transition-opacity duration-300 ${className} ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
};

// Main component

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ docs }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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
  // Show at most 4 thumbnails (so grid = hero + 4 = 5 total slots)
  const gridItems = rest.slice(0, 4);
  const total = docs.length;

  // ── 1 image: full-width ──
  if (total === 1) {
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
        <Lightbox
          docs={docs}
          index={lightboxIndex}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onPrev={() =>
            setLightboxIndex((i) => (i - 1 + docs.length) % docs.length)
          }
          onNext={() => setLightboxIndex((i) => (i + 1) % docs.length)}
        />
      </>
    );
  }

  // ── 2 images: hero left + 1 right (full height) ──
  if (total === 2) {
    return (
      <>
        <div className='relative overflow-hidden rounded-2xl'>
          <div
            className='grid gap-1'
            style={{ gridTemplateColumns: '2fr 1fr', height: '420px' }}
          >
            <div
              className='bg-muted/40 relative cursor-zoom-in overflow-hidden'
              onClick={() => openLightbox(0)}
            >
              <ImageWithLoader
                src={hero.image}
                alt={hero.description ?? 'Property image 1'}
                sizes='60vw'
                priority
                className='object-cover transition-transform duration-300 hover:scale-[1.02]'
              />
            </div>
            <div
              className='bg-muted/40 relative cursor-zoom-in overflow-hidden'
              onClick={() => openLightbox(1)}
            >
              <ImageWithLoader
                src={rest[0].image}
                alt={rest[0].description ?? 'Property image 2'}
                sizes='40vw'
                className='object-cover transition-transform duration-300 hover:scale-[1.02]'
              />
            </div>
          </div>
          <ShowAllButton onClick={() => openLightbox(0)} />
        </div>
        <Lightbox
          docs={docs}
          index={lightboxIndex}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onPrev={() =>
            setLightboxIndex((i) => (i - 1 + docs.length) % docs.length)
          }
          onNext={() => setLightboxIndex((i) => (i + 1) % docs.length)}
        />
      </>
    );
  }

  // ── 3 images: hero left + 2 stacked right ──
  if (total === 3) {
    return (
      <>
        <div className='relative overflow-hidden rounded-2xl'>
          <div
            className='grid gap-1'
            style={{
              gridTemplateColumns: '2fr 1fr',
              gridTemplateRows: '1fr 1fr',
              height: '420px',
            }}
          >
            <div
              className='bg-muted/40 relative row-span-2 cursor-zoom-in overflow-hidden'
              onClick={() => openLightbox(0)}
            >
              <ImageWithLoader
                src={hero.image}
                alt={hero.description ?? 'Property image 1'}
                sizes='60vw'
                priority
                className='object-cover transition-transform duration-300 hover:scale-[1.02]'
              />
            </div>
            {rest.slice(0, 2).map((doc, i) => (
              <div
                key={doc.id}
                className='bg-muted/40 relative cursor-zoom-in overflow-hidden'
                onClick={() => openLightbox(i + 1)}
              >
                <ImageWithLoader
                  src={doc.image}
                  alt={doc.description ?? `Property image ${i + 2}`}
                  sizes='40vw'
                  className='object-cover transition-transform duration-300 hover:scale-[1.02]'
                />
              </div>
            ))}
          </div>
          <ShowAllButton onClick={() => openLightbox(0)} />
        </div>
        <Lightbox
          docs={docs}
          index={lightboxIndex}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onPrev={() =>
            setLightboxIndex((i) => (i - 1 + docs.length) % docs.length)
          }
          onNext={() => setLightboxIndex((i) => (i + 1) % docs.length)}
        />
      </>
    );
  }

  // ── 4 images: hero left + 3 right (1 top full + 2 bottom) ──
  if (total === 4) {
    return (
      <>
        <div className='relative overflow-hidden rounded-2xl'>
          <div
            className='grid gap-1'
            style={{
              gridTemplateColumns: '2fr 1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              height: '420px',
            }}
          >
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
            {/* top-right spans 2 cols */}
            <div
              className='bg-muted/40 relative col-span-2 cursor-zoom-in overflow-hidden'
              onClick={() => openLightbox(1)}
            >
              <ImageWithLoader
                src={rest[0].image}
                alt={rest[0].description ?? 'Property image 2'}
                sizes='50vw'
                className='object-cover transition-transform duration-300 hover:scale-[1.02]'
              />
            </div>
            {/* bottom two thumbnails */}
            {rest.slice(1, 3).map((doc, i) => (
              <div
                key={doc.id}
                className='bg-muted/40 relative cursor-zoom-in overflow-hidden'
                onClick={() => openLightbox(i + 2)}
              >
                <ImageWithLoader
                  src={doc.image}
                  alt={doc.description ?? `Property image ${i + 3}`}
                  sizes='25vw'
                  className='object-cover transition-transform duration-300 hover:scale-[1.02]'
                />
              </div>
            ))}
          </div>
          <ShowAllButton onClick={() => openLightbox(0)} />
        </div>
        <Lightbox
          docs={docs}
          index={lightboxIndex}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onPrev={() =>
            setLightboxIndex((i) => (i - 1 + docs.length) % docs.length)
          }
          onNext={() => setLightboxIndex((i) => (i + 1) % docs.length)}
        />
      </>
    );
  }

  // ── 5+ images: hero left (2 rows) + 2×2 right grid ──
  return (
    <>
      <div className='relative overflow-hidden rounded-2xl'>
        <div
          className='grid gap-1'
          style={{
            gridTemplateColumns: '2fr 1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            height: '420px',
          }}
        >
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

          {gridItems.map((doc, i) => {
            const isLast = i === gridItems.length - 1 && total > 5;
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
                  <div className='absolute inset-0 flex items-end justify-end bg-black/40 p-3'>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(i + 1);
                      }}
                      className='h-8 px-2 sm:h-9 sm:px-3'
                    >
                      <Grid2x2 />
                      <span className='ml-2 hidden sm:inline'>Show all</span>
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Show all button when exactly 5 */}
        {total === 5 && <ShowAllButton onClick={() => openLightbox(0)} />}
      </div>

      <Lightbox
        docs={docs}
        index={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={() =>
          setLightboxIndex((i) => (i - 1 + docs.length) % docs.length)
        }
        onNext={() => setLightboxIndex((i) => (i + 1) % docs.length)}
      />
    </>
  );
};

// Show all button
const ShowAllButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <Button
    onClick={onClick}
    className='absolute right-2 bottom-2 z-20 h-8 rounded-md px-2 shadow-lg sm:right-3 sm:bottom-3 sm:h-9 sm:px-3'
  >
    <Grid2x2 />
    <span className='ml-2 hidden sm:inline'>Show all</span>
  </Button>
);

// Lightbox

const Lightbox: React.FC<LightboxProps> = ({
  docs,
  index,
  open,
  onClose,
  onPrev,
  onNext,
}) => {
  if (!open) return null;
  return createPortal(
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm'
      onClick={onClose}
    >
      <Button
        className='absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20'
        onClick={onClose}
        aria-label='Close'
      >
        <X className='size-5' />
      </Button>

      {docs.length > 1 && (
        <span className='absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white/70 tabular-nums'>
          {index + 1} / {docs.length}
        </span>
      )}

      <div
        className='relative h-[85vh] w-[90vw]'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='bg-muted/5 relative h-full w-full overflow-hidden rounded-2xl'>
          <ImageWithLoader
            key={docs[index].id ?? index}
            src={docs[index].image}
            alt={docs[index].description ?? `Image ${index + 1}`}
            sizes='90vw'
            className='object-contain'
            unoptimized
            priority
          />
        </div>
        {docs[index].description && (
          <p className='absolute right-0 bottom-0 left-0 mt-2 text-center text-sm text-white/60'>
            {docs[index].description}
          </p>
        )}
      </div>

      {docs.length > 1 && (
        <>
          <Button
            className='absolute top-1/2 left-3 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/25'
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label='Previous image'
          >
            <ChevronLeft className='size-5' />
          </Button>
          <Button
            className='absolute top-1/2 right-3 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/25'
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label='Next image'
          >
            <ChevronRight className='size-5' />
          </Button>
        </>
      )}
    </div>,
    document.body,
  );
};

export default PropertyGallery;
