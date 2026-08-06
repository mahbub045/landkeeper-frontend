'use client';
import React from 'react';

import { CloudUpload, Upload } from 'lucide-react';
import { useSession } from 'next-auth/react';
import UploadTemplateDialog from './Dialogs/UploadTemplateDialog';
import TemplateCard from './TemplateCard/TemplateCard';

const Templates: React.FC = () => {
  const { data: session } = useSession();
  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);

  return (
    <div className='mb-12 w-full'>
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
        {(session?.user?.role === 'SUPER_ADMIN' ||
          session?.user?.role === 'LANDLORD' ||
          session?.user?.role === 'ADMIN') && (
          <div className='mb-12'>
            <button
              onClick={() => setUploadDialogOpen(true)}
              className='hover:border-primary focus-visible:ring-primary dark:hover:border-primary relative flex w-full cursor-pointer items-center gap-5 rounded-sm border-[1.5px] border-dashed border-[#D8DCE3] bg-white px-6 py-8 text-left transition-colors hover:bg-[#FAFAF8] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-[#3A3F47] dark:bg-[#1C1F24] dark:hover:bg-[#22262C]'
            >
              <div className='h-14 w-14 shrink-0'>
                <CloudUpload
                  size={56}
                  className='text-secondary dark:text-[#A8B0BC]'
                  strokeWidth={1.4}
                />
              </div>

              <div className='min-w-0 flex-1 text-left'>
                <p className='text-secondary mb-1 text-left text-[15px] font-medium dark:text-[#E5E7EB]'>
                  Add a template to the catalog
                </p>
                <p className='text-left text-[12px] text-[#5B6472] dark:text-[#9AA2AD]'>
                  Drop a PDF here, or click to browse from your files.
                </p>
              </div>

              <span className='bg-primary hidden shrink-0 items-center gap-1 rounded-sm px-3 py-1.5 text-[11px] tracking-widest text-[#FBFAF6] uppercase sm:inline-flex'>
                <Upload size={12} strokeWidth={2} />
                Browse
              </span>
            </button>
          </div>
        )}

        <div>
          <TemplateCard />
        </div>
      </div>
      <UploadTemplateDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />
    </div>
  );
};

export default Templates;
