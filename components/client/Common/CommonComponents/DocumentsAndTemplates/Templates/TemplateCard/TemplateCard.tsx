import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDownloadFile } from '@/hooks/useDownloadFile';
import { useGetTemplatesQuery } from '@/store/api/endpoints/client/Common/DocumentsAndTemplates/TemplatesApi';
import { TemplateType } from '@/types/client/Common/DocumentsAndTemplates/TemplatesTypes';
import { formatDateAndTime } from '@/utils/formatters';
import { Dot, Download, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import DeleteTemplateDialog from '../Dialogs/DeleteTemplateDialog';
import EditTemplateDialog from '../Dialogs/EditTemplateDialog';

const TemplateCard: React.FC = () => {
  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(
    null,
  );
  const {
    data: templates,
    isLoading,
    isError,
  } = useGetTemplatesQuery(undefined);
  const { downloadFile, isDownloading } = useDownloadFile();

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className='relative'>
            <div className='border-secondary absolute inset-0 translate-x-0.75 translate-y-0.75 rounded-sm border' />
            <div className='border-secondary absolute inset-0 translate-x-[1.1px] translate-y-[1.1px] rounded-sm border' />

            <div className='relative flex h-full min-h-47.5 animate-pulse flex-col justify-between rounded-sm border p-5'>
              <div>
                <div className='mb-4 flex items-start justify-between gap-3'>
                  <div className='h-5 w-20 rounded-sm bg-[#E5E7EB] dark:bg-[#2A2E35]' />
                  <div className='flex items-center gap-1'>
                    <div className='h-7 w-7 rounded-sm bg-[#E5E7EB] dark:bg-[#2A2E35]' />
                    <div className='h-7 w-7 rounded-sm bg-[#E5E7EB] dark:bg-[#2A2E35]' />
                  </div>
                </div>
                <div className='mb-2 h-4 w-3/4 rounded-sm bg-[#E5E7EB] dark:bg-[#2A2E35]' />
                <div className='mb-3 h-3 w-1/2 rounded-sm bg-[#E5E7EB] dark:bg-[#2A2E35]' />
              </div>
              <div className='h-8 w-32 rounded-sm bg-[#E5E7EB] dark:bg-[#2A2E35]' />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return <CustomErrorMessage title='Templates' />;
  }

  if (!templates?.results?.length) {
    return (
      <div className='border-secondary flex flex-col items-center justify-center gap-2 rounded-sm border border-dashed py-16 text-center'>
        <p className='text-primary text-[14px] font-medium'>No templates yet</p>
        <p className='text-[12px] text-[#5B6472]'>
          Add a template to get started.
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {templates.results.map((tpl: TemplateType) => (
        <div key={tpl.alias} className='relative'>
          {/* stacked-paper effect */}
          <div className='border-secondary absolute inset-0 translate-x-0.75 translate-y-0.75 rounded-sm border' />
          <div className='border-secondary absolute inset-0 translate-x-[1.1px] translate-y-[1.1px] rounded-sm border' />

          <div className='relative flex h-full min-h-47.5 flex-col justify-between rounded-sm p-5 transition-shadow hover:shadow-[0_10px_24px_-14px_rgba(30,42,56,0.35)]'>
            <div>
              <div className='mb-4 flex items-start justify-between gap-3'>
                <Badge
                  variant='outline'
                  className='border-secondary text-primary -rotate-2 rounded-sm bg-[#A67C3D]/6 px-2.5 py-1 text-[10px] tracking-[0.14em] uppercase'
                >
                  {tpl.category}
                </Badge>

                <div className='flex items-center gap-1'>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => {
                      setSelectedTemplate(tpl);
                      setIsOpenEditDialog(true);
                    }}
                  >
                    <Pencil size={13} strokeWidth={1.8} />
                  </Button>

                  <Button
                    variant='destructive'
                    size='icon'
                    onClick={() => {
                      setSelectedTemplate(tpl);
                      setIsOpenDeleteDialog(true);
                    }}
                  >
                    <Trash2 size={13} strokeWidth={1.8} />
                  </Button>
                </div>
              </div>

              <h3 className='text-primary mb-1 line-clamp-2 text-[17px] leading-snug font-medium'>
                {tpl.title}
              </h3>
              <p className='flex items-center text-[11px] tracking-wide text-[#5B6472]'>
                {tpl.size}
                <Dot />
                {formatDateAndTime(tpl.created_at)}
              </p>
            </div>

            <Button
              onClick={() =>
                downloadFile({
                  url: tpl.file,
                  filename: `${tpl.title.replace(/\s+/g, '-').toLowerCase()}.pdf`,
                })
              }
              disabled={isDownloading}
              size='sm'
              variant='secondary'
              className='self-start'
            >
              <Download size={13} strokeWidth={2} />
              Download PDF
            </Button>
          </div>
          {/* Dialogs  */}
          <EditTemplateDialog
            isOpen={isOpenEditDialog}
            setIsOpen={setIsOpenEditDialog}
            template={selectedTemplate}
          />
          <DeleteTemplateDialog
            isOpen={isOpenDeleteDialog}
            setIsOpen={setIsOpenDeleteDialog}
            template={selectedTemplate}
          />
        </div>
      ))}
    </div>
  );
};

export default TemplateCard;
