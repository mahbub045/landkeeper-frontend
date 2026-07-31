import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUploadTemplateMutation } from '@/store/api/endpoints/client/Common/DocumentsAndTemplates/TemplatesApi';

interface UploadTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UploadTemplateDialog: React.FC<UploadTemplateDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [uploadFile, { isLoading, isSuccess, isError }] =
    useUploadTemplateMutation();
    
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex max-h-[90vh] w-full flex-col overflow-hidden sm:max-w-185'>
        <DialogHeader>
          <DialogTitle className='text-foreground text-xl font-bold'>
            Upload Template
          </DialogTitle>
          <DialogDescription>
            Add new templates for your property.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UploadTemplateDialog;
