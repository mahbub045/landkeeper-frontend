'use client';

import { cn } from '@/lib/utils';
import { LegalTableOfContentsProps } from '@/types/common/LegalPages/LegalPagesTypes';
import { useEffect, useState } from 'react';

const LegalTableOfContents: React.FC<LegalTableOfContentsProps> = ({
  sections,
}) => {
  const [activeId, setActiveId] = useState(sections[0]?.id);

  // Highlight the entry for the section currently in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-96px 0px -65% 0px' },
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className='bg-card rounded-xl border p-4'>
      <p className='text-muted-foreground mb-3 px-2 text-xs font-semibold tracking-wider uppercase'>
        On this page
      </p>
      <ul className='space-y-1 text-sm'>
        {sections.map((section, index) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={cn(
                'flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors',
                activeId === section.id
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <span className='w-4 text-xs tabular-nums'>{index + 1}</span>
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LegalTableOfContents;
