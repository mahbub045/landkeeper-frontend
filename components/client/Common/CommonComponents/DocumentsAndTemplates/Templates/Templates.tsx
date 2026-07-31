'use client';
import React from 'react';

import TemplateCard from './TemplateCard/TemplateCard';
import TemplateIntakeSlot from './TemplateIntakeSlot/TemplateIntakeSlot';

const Templates: React.FC = () => {
  return (
    <div className='mb-10 w-full'>
      <div>
        {/* header */}
        <div className='mb-1 flex flex-wrap items-end justify-between gap-4'>
          <div>
            <p className='text-secondary mb-2 text-[11px] tracking-[0.18em] uppercase'>
              Document Catalog
            </p>
            <h1 className='text-3xl leading-none font-semibold'>
              Template Library
            </h1>
          </div>
        </div>

        <div className='mb-8 h-px w-full bg-[#D9D3C2]' />

        {/* upload */}
        <div className='mb-12'>
          <TemplateIntakeSlot />
        </div>

        <div>
          <TemplateCard />
        </div>
      </div>
    </div>
  );
};

export default Templates;
