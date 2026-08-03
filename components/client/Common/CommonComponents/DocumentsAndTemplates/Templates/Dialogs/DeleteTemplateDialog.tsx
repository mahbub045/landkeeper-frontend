import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteTemplateMutation } from '@/store/api/endpoints/client/Common/DocumentsAndTemplates/TemplatesApi';
import { DeleteTemplateDialogProps } from '@/types/client/Common/DocumentsAndTemplates/TemplatesTypes';
import { Trash2, TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';

const DeleteTemplateDialog: React.FC<DeleteTemplateDialogProps> = ({
  isOpen,
  setIsOpen,
  template,
}) => {
  const [deleteTemplate, { isLoading }] = useDeleteTemplateMutation();

  async function handleDelete() {
    if (!template) return;
    try {
      await deleteTemplate(template.alias).unwrap();
      toast.success('Template deleted.');
      setIsOpen(false);
    } catch {
      toast.error('Failed to delete template. Please try again.');
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='rounded-sm sm:max-w-105'>
        <DialogHeader>
          <div className='mb-2 flex size-11 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30'>
            <TriangleAlert className='size-5 text-red-600 dark:text-red-500' />
          </div>
          <DialogTitle className='text-primary text-[16px] font-semibold'>
            Delete Template
          </DialogTitle>
          <DialogDescription className='text-[13px] leading-relaxed text-[#5B6472]'>
            Are you sure you want to delete{' '}
            <span className='text-primary font-medium'>
              &quot;{template?.title}&quot;
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='mt-2 gap-2 sm:gap-2'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            disabled={isLoading}
            onClick={() => setIsOpen(false)}
            className='rounded-sm'
          >
            Cancel
          </Button>
          <Button
            type='button'
            variant='destructive'
            size='sm'
            disabled={isLoading}
            onClick={handleDelete}
            className='rounded-sm'
          >
            {isLoading ? (
              <Loading className='text-white!' />
            ) : (
              <Trash2 size={13} strokeWidth={1.8} />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTemplateDialog;
