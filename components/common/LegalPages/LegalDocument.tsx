import LegalTableOfContents from '@/components/common/LegalPages/LegalTableOfContents';
import PublicPageHero from '@/components/common/LegalPages/PublicPageHero';
import { Button } from '@/components/ui/button';
import { SUPPORT_EMAIL } from '@/data/common/LegalPages/LegalPagesData';
import { LegalDocumentProps } from '@/types/common/LegalPages/LegalPagesTypes';
import { CalendarDays, LifeBuoy, ListOrdered, Mail } from 'lucide-react';
import Link from 'next/link';

const LegalDocument: React.FC<LegalDocumentProps> = ({
  icon,
  title,
  description,
  lastUpdated,
  sections,
}) => {
  return (
    <>
      <PublicPageHero
        icon={icon}
        eyebrow='Legal'
        title={title}
        description={description}
      >
        <div className='text-muted-foreground flex flex-wrap items-center justify-center gap-3 text-sm'>
          <span className='bg-background/80 inline-flex items-center gap-2 rounded-full border px-3 py-1 backdrop-blur'>
            <CalendarDays className='h-4 w-4' />
            Last updated {lastUpdated}
          </span>
          <span className='bg-background/80 inline-flex items-center gap-2 rounded-full border px-3 py-1 backdrop-blur'>
            <ListOrdered className='h-4 w-4' />
            {sections.length} sections
          </span>
        </div>
      </PublicPageHero>

      <div className='grid gap-10 px-4 py-12 md:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14 xl:px-12'>
        {/* Table of contents */}
        <aside className='hidden lg:block'>
          <div className='sticky top-24 space-y-4'>
            <LegalTableOfContents sections={sections} />

            <Link
              href='/support'
              className='bg-card hover:border-primary/40 flex items-center gap-3 rounded-xl border p-4 text-sm transition-colors'
            >
              <div className='bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg'>
                <LifeBuoy className='h-4 w-4' />
              </div>
              <div>
                <p className='font-medium'>Need help?</p>
                <p className='text-muted-foreground text-xs'>
                  Visit our support centre
                </p>
              </div>
            </Link>
          </div>
        </aside>

        {/* Sections */}
        <article className='space-y-4'>
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className='bg-card scroll-mt-24 rounded-xl border p-6 md:p-8'
            >
              <div className='mb-4 flex items-center gap-3'>
                <span className='bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold'>
                  {index + 1}
                </span>
                <h2 className='text-lg font-semibold tracking-tight md:text-xl'>
                  {section.title}
                </h2>
              </div>
              <div className='space-y-3'>
                {section.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className='text-muted-foreground leading-relaxed'
                  >
                    {paragraph}
                  </p>
                ))}
                {section.bullets && (
                  <ul className='space-y-2.5'>
                    {section.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className='text-muted-foreground flex gap-3 leading-relaxed'
                      >
                        <span className='bg-primary mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full' />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}

          {/* Contact CTA */}
          <div className='border-primary/20 bg-primary/5 flex flex-col items-start justify-between gap-4 rounded-xl border p-6 sm:flex-row sm:items-center md:p-8'>
            <div>
              <h3 className='text-lg font-semibold'>Still have questions?</h3>
              <p className='text-muted-foreground mt-1 text-sm'>
                Our team is happy to explain anything in this document.
              </p>
            </div>
            <div className='flex flex-wrap gap-2'>
              <Button asChild variant='outline'>
                <a href={`mailto:${SUPPORT_EMAIL}`}>
                  <Mail />
                  Email us
                </a>
              </Button>
              <Button asChild>
                <Link href='/support'>
                  <LifeBuoy />
                  Support centre
                </Link>
              </Button>
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

export default LegalDocument;
