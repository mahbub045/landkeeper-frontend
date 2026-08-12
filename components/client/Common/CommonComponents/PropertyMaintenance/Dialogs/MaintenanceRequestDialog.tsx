'use client';

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
import { CATEGORY_OPTIONS } from '@/data/client/common/PropertyMaintenance/PropertyMaintenanceData';
import { useMaintenanceRequestMutation } from '@/store/api/endpoints/client/Common/PropertyMaintenance/PropertyMaintenanceApi';
import { MaintenanceRequestDialogProps } from '@/types/client/Common/PropertyMaintenance/PropertyMaintenanceType';
import { FileText, Loader2, Paperclip, X } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'sonner';

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 10;
const ACCEPTED_FILE_TYPES = '.jpg,.jpeg,.png,.pdf';

const initialState = {
  issue: '',
  category: '',
  is_emergency: false,
  notes: '',
};

const MaintenanceRequestDialog: React.FC<MaintenanceRequestDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [maintenanceRequest, { isLoading }] = useMaintenanceRequestMutation();

  const [formState, setFormState] = useState(initialState);
  const [documents, setDocuments] = useState<File[]>([]);

  const resetForm = () => {
    setFormState(initialState);
    setDocuments([]);
  };

  const handleClose = () => {
    if (isLoading) return;
    resetForm();
    onClose();
  };

  const handleFieldChange = (
    field: keyof typeof initialState,
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

    try {
      await maintenanceRequest({payload}).unwrap();
      toast.success('Maintenance request submitted.');
      resetForm();
      onClose();
    } catch (error) {
      toast.error('Failed to submit maintenance request.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Make Maintenance Request</DialogTitle>
          <DialogDescription>
            Describe the issue and we&apos;ll route it to your property manager.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='issue'>
              Issue <span className='text-danger'>*</span>
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
            <Label htmlFor='category'>Category</Label>
            <Select
              value={formState.category}
              onValueChange={(value) => handleFieldChange('category', value)}
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

          <div className='flex items-center gap-2 bg-danger/20 p-2 rounded-md text-danger'>
            <Checkbox
              id='is_emergency'
              checked={formState.is_emergency}
              onCheckedChange={(checked) =>
                handleFieldChange('is_emergency', checked === true)
              }
             className='border-danger cursor-pointer data-[state=checked]:bg-danger! data-[state=checked]:border-danger! data-[state=checked]:hover:bg-danger/80'
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

          <div className='space-y-2'>
            <Label htmlFor='documents'>Attachments</Label>
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
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading && <Loader2 className='size-4 animate-spin' />}
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceRequestDialog;
