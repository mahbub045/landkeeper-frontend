'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteDocumentMutation } from '@/store/api/endpoints/client/Common/DocumentsAndTemplates/DocumentsApi';
import { DeleteDocumentDialogProps } from '@/types/client/Common/DocumentsAndTemplates/DocumentTypes';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

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
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-md'>
        {/* Header */}
        <DialogHeader className='to-background flex flex-col items-center bg-linear-to-b from-red-50 px-6 pt-8 pb-6 dark:from-red-950/30'>
          <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30'>
            <AlertTriangle className='h-8 w-8 text-red-600' />
          </div>

          <DialogTitle className='text-center text-2xl font-bold'>
            Delete Document
          </DialogTitle>

          <DialogDescription className='mt-2 text-center text-sm'>
            This action is permanent and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className='space-y-5 px-6 py-6'>
          <p className='text-muted-foreground text-center text-sm leading-7'>
            You&rsquo;re about to permanently delete the following document:
          </p>

          <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center dark:border-red-900/50 dark:bg-red-950/30'>
            <span className='text-base font-semibold wrap-break-word text-red-600'>
              {documentName}
            </span>
          </div>

          <div className='rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20'>
            <p className='text-center text-sm leading-6 text-amber-700 dark:text-amber-300'>
              This document and any associated information will be permanently
              removed. This action cannot be reversed.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className='bg-muted/20 flex justify-end gap-3 border-t px-6 py-5'>
          <Button
            variant='outline'
            onClick={onClose}
            disabled={isLoading}
            className='min-w-24'
          >
            Cancel
          </Button>

          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={isLoading}
            className='min-w-40'
          >
            {isLoading && <Loading className='mr-2 text-white!' />}
            Delete Document
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDocumentDialog;
