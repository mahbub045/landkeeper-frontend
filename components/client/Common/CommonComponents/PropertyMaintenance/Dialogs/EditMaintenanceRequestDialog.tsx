'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  ACCEPTED_FILE_TYPES,
  CATEGORY_OPTIONS,
  MAX_FILE_SIZE_MB,
  MAX_FILES,
} from '@/data/client/common/PropertyMaintenance/PropertyMaintenanceData';
import {
  useEditPropertyMaintenanceMutation,
  useGetPropertyMaintenanceDetailsQuery,
} from '@/store/api/endpoints/client/Common/PropertyMaintenance/PropertyMaintenanceApi';
import {
  EditMaintenanceRequestDialogProps,
  EditMaintenanceRequestFormProps,
  ExistingDocument,
  FormValues,
  MaintenanceDocument,
} from '@/types/client/Common/PropertyMaintenance/PropertyMaintenanceType';
import { FileText, Paperclip, X } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'sonner';

const getDisplayFileName = (filePath: string): string => {
  const segments = filePath.split('/').filter(Boolean);
  return segments[segments.length - 1] || filePath;
};

const EditMaintenanceRequestDialog: React.FC<
  EditMaintenanceRequestDialogProps
> = ({ isOpen, onClose, maintenanceRequestAlias }) => {
  const {
    data: requestDetails,
    isLoading: isDetailsLoading,
    isError: isDetailsError,
  } = useGetPropertyMaintenanceDetailsQuery(maintenanceRequestAlias, {
    skip: !isOpen || !maintenanceRequestAlias,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Edit Maintenance Request</DialogTitle>
          <DialogDescription>
            Update the details below and save your changes.
          </DialogDescription>
        </DialogHeader>

        {isDetailsLoading && (
          <div className='flex items-center justify-center py-10'>
            <Loading className='size-6' />
          </div>
        )}

        {!isDetailsLoading && isDetailsError && (
          <p className='text-danger py-10 text-center text-sm'>
            Failed to load maintenance request details.
          </p>
        )}

        {!isDetailsLoading && !isDetailsError && requestDetails && (
          <EditMaintenanceRequestForm
            key={maintenanceRequestAlias}
            requestDetails={requestDetails}
            maintenanceRequestAlias={maintenanceRequestAlias}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

const EditMaintenanceRequestForm: React.FC<EditMaintenanceRequestFormProps> = ({
  requestDetails,
  maintenanceRequestAlias,
  onClose,
}) => {
  const [editMaintenanceRequest, { isLoading: isSubmitting }] =
    useEditPropertyMaintenanceMutation();

  // Derived once at mount from the already-fetched details — no effect,
  // no cascading setState.
  const [formState, setFormState] = useState<FormValues>(() => ({
    issue: requestDetails.issue ?? '',
    category: requestDetails.category ?? '',
    is_emergency: !!requestDetails.is_emergency,
    notes: requestDetails.notes ?? '',
  }));
  const [documents, setDocuments] = useState<File[]>([]);
  const [existingDocuments, setExistingDocuments] = useState<
    ExistingDocument[]
  >(() => requestDetails.documents ?? []);
  const [removedDocumentIds, setRemovedDocumentIds] = useState<
    MaintenanceDocument['id'][]
  >([]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleFieldChange = (
    field: keyof FormValues,
    value: string | boolean,
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;

    const combined = [...documents, ...selected];

    if (combined.length > MAX_FILES) {
      toast.error(`You can attach up to ${MAX_FILES} files.`);
      e.target.value = '';
      return;
    }

    const oversized = selected.find(
      (file) => file.size > MAX_FILE_SIZE_MB * 1024 * 1024,
    );
    if (oversized) {
      toast.error(`"${oversized.name}" exceeds ${MAX_FILE_SIZE_MB}MB.`);
      e.target.value = '';
      return;
    }

    setDocuments(combined);
    e.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingDocument = (id: MaintenanceDocument['id']) => {
    setExistingDocuments((prev) => prev.filter((doc) => doc.id !== id));
    setRemovedDocumentIds((prev) => [...prev, id]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append('issue', formState.issue.trim());
    payload.append('category', formState.category);
    payload.append('is_emergency', formState.is_emergency ? 'TRUE' : 'FALSE');
    if (formState.notes.trim()) {
      payload.append('notes', formState.notes.trim());
    }
    documents.forEach((file) => payload.append('documents', file));
    removedDocumentIds.forEach((id) =>
      payload.append('removed_document_ids', id.toString()),
    );

    try {
      await editMaintenanceRequest({
        alias: maintenanceRequestAlias,
        payload,
      }).unwrap();
      toast.success('Maintenance request updated.');
      onClose();
    } catch (error) {
      toast.error('Failed to update maintenance request.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='issue'>
          Issue<span className='text-danger'>*</span>
        </Label>
        <Input
          id='issue'
          type='text'
          placeholder='e.g. Leaking bathroom sink'
          value={formState.issue}
          onChange={(e) => handleFieldChange('issue', e.target.value)}
          required
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='category'>
          Category<span className='text-danger'>*</span>
        </Label>
        <Select
          value={formState.category}
          onValueChange={(value) => handleFieldChange('category', value)}
          required
        >
          <SelectTrigger id='category'>
            <SelectValue placeholder='Select a category' />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='bg-danger/20 text-danger flex items-center gap-2 rounded-md p-2'>
        <Checkbox
          id='is_emergency'
          checked={formState.is_emergency}
          onCheckedChange={(checked) =>
            handleFieldChange('is_emergency', checked === true)
          }
          className='border-danger data-[state=checked]:bg-danger! data-[state=checked]:border-danger! data-[state=checked]:hover:bg-danger/80 cursor-pointer'
        />
        <Label
          htmlFor='is_emergency'
          className='cursor-pointer text-sm font-normal'
        >
          This is an emergency
        </Label>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='notes'>Notes</Label>
        <Textarea
          id='notes'
          placeholder='Any additional details (optional)'
          value={formState.notes}
          onChange={(e) => handleFieldChange('notes', e.target.value)}
          rows={3}
        />
      </div>

      {existingDocuments.length > 0 && (
        <div className='space-y-2'>
          <Label>Existing attachments</Label>
          <ul className='space-y-1.5'>
            {existingDocuments.map((doc) => (
              <li
                key={doc.id}
                className='flex items-center justify-between rounded-md bg-gray-50/60 px-2.5 py-1.5 text-sm'
              >
                <a
                  href={doc.file}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex min-w-0 items-center gap-2 hover:underline'
                >
                  <FileText className='text-primary size-4 shrink-0' />
                  <span className='truncate'>
                    {getDisplayFileName(doc.file)}
                  </span>
                </a>
                <button
                  type='button'
                  onClick={() => handleRemoveExistingDocument(doc.id)}
                  className='shrink-0 cursor-pointer text-gray-500 hover:text-gray-800'
                >
                  <X className='size-3.5' />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className='space-y-2'>
        <Label htmlFor='documents'>Add attachments</Label>
        <label
          htmlFor='documents'
          className='border-input flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed py-4 text-sm text-gray-600 transition-colors hover:bg-gray-50/60'
        >
          <Paperclip className='size-4' />
          Click to attach photos or PDFs
        </label>
        <Input
          id='documents'
          type='file'
          accept={ACCEPTED_FILE_TYPES}
          multiple
          onChange={handleFilesChange}
          className='hidden'
        />
        {documents.length > 0 && (
          <ul className='space-y-1.5'>
            {documents.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className='flex items-center justify-between rounded-md bg-gray-50/60 px-2.5 py-1.5 text-sm'
              >
                <div className='flex min-w-0 items-center gap-2'>
                  <FileText className='text-primary size-4 shrink-0' />
                  <span className='truncate'>{file.name}</span>
                </div>
                <button
                  type='button'
                  onClick={() => handleRemoveFile(index)}
                  className='shrink-0 cursor-pointer text-gray-500 hover:text-gray-800'
                >
                  <X className='size-3.5' />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <DialogFooter>
        <Button
          type='button'
          variant='outline'
          onClick={handleClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting && <Loading className='size-4 text-white!' />}
          Save Changes
        </Button>
      </DialogFooter>
    </form>
  );
};

export default EditMaintenanceRequestDialog;
