import { LegalDocumentProps } from '@/types/common/LegalPages/LegalPagesTypes';

const LegalDocument: React.FC<LegalDocumentProps> = ({
  title,
  description,
  lastUpdated,
  sections,
}) => {
  return (
    <div>
      {/* Heading */}
      <div className='mb-10 border-b pb-8'>
        <p className='text-primary mb-2 text-sm font-semibold tracking-wider uppercase'>
          Legal
        </p>
        <h1 className='text-3xl font-bold tracking-tight md:text-4xl'>
          {title}
        </h1>
        <p className='text-muted-foreground mt-3 max-w-2xl'>{description}</p>
        <p className='text-muted-foreground mt-4 text-xs'>
          Last updated: {lastUpdated}
        </p>
      </div>

      <div className='grid gap-10 lg:grid-cols-[220px_1fr]'>
        {/* Table of contents */}
        <nav className='hidden lg:block'>
          <div className='sticky top-24'>
            <p className='mb-3 text-sm font-semibold'>On this page</p>
            <ul className='space-y-2 border-l text-sm'>
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className='text-muted-foreground hover:text-foreground hover:border-primary -ml-px block border-l border-transparent pl-3 transition-colors'
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Sections */}
        <div className='space-y-10'>
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className='scroll-mt-24'
            >
              <h2 className='mb-3 text-xl font-semibold tracking-tight'>
                {index + 1}. {section.title}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className='text-muted-foreground mb-3 leading-relaxed'
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets && (
                <ul className='text-muted-foreground list-disc space-y-2 pl-5 leading-relaxed'>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegalDocument;
