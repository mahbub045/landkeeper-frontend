import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog/DeleteConfirmDialog';
import { useDeleteTemplateMutation } from '@/store/api/endpoints/client/Common/DocumentsAndTemplates/TemplatesApi';
import { DeleteTemplateDialogProps } from '@/types/client/Common/DocumentsAndTemplates/TemplatesTypes';
import { LayoutTemplate } from 'lucide-react';
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
    <DeleteConfirmDialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onConfirm={handleDelete}
      isLoading={isLoading}
      confirmDisabled={!template}
      title='Delete this template?'
      targetLabel='Template to delete'
      targetName={template?.title}
      targetIcon={LayoutTemplate}
      cancelLabel='Keep Template'
      confirmLabel='Delete Template'
    />
  );
};

export default DeleteTemplateDialog;
