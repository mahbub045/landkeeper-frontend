'use client';

import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog/DeleteConfirmDialog';
import { useDeleteDocumentMutation } from '@/store/api/endpoints/client/Common/DocumentsAndTemplates/DocumentsApi';
import { DeleteDocumentDialogProps } from '@/types/client/Common/DocumentsAndTemplates/DocumentTypes';
import { Database, FileText } from 'lucide-react';
import { toast } from 'sonner';

const IMPACT_ITEMS = [
  { icon: FileText, label: 'Document file' },
  { icon: Database, label: 'Associated info' },
];

const DeleteDocumentDialog: React.FC<DeleteDocumentDialogProps> = ({
  open,
  onClose,
  onSuccess,
  documentAlias,
  documentName,
}) => {
  const [deleteDocument, { isLoading }] = useDeleteDocumentMutation();

  async function handleDelete() {
    try {
      await deleteDocument({
        document_alias: documentAlias,
      }).unwrap();

      toast.success('Document deleted successfully.');
      onSuccess?.();
      onClose();
    } catch {
      toast.error('Failed to delete document. Please try again.');
    }
  }

  return (
    <DeleteConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={handleDelete}
      isLoading={isLoading}
      title='Delete this document?'
      targetLabel='Document to delete'
      targetName={documentName}
      targetIcon={FileText}
      impactItems={IMPACT_ITEMS}
      cancelLabel='Keep Document'
      confirmLabel='Delete Document'
    />
  );
};

export default DeleteDocumentDialog;
