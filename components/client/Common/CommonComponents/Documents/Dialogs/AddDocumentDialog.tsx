'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  documentCategories,
  properties,
} from '@/data/client/common/documents/DocumentsData';
import {
  UploadDocumentForm,
  UploadDocumentModalProps,
} from '@/types/client/Common/Documents/DocumentTypes';

import { CloudUpload, Loader2, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

// ── Validation ───────────────────────────────────────────────────────────────

function validate(
  form: UploadDocumentForm,
  files: File[],
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.propertyId) errors.propertyId = 'Please select a property.';
  if (!form.category) errors.category = 'Please select a document category.';
  if (!form.name.trim()) errors.name = 'Document name is required.';
  if (files.length === 0) errors.documents = 'Please upload at least one file.';

  return errors;
}

// ── Modal ─────────────────────────────────────────────────────────────────────

const AddDocumentDialog: React.FC<UploadDocumentModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<UploadDocumentForm>({
    propertyId: '',
    category: 'Mortgage Documents',
    name: '',
    tags: '',
  });

  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set(key: keyof UploadDocumentForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ── Reset ───────────────────────────────────────────────────────────────────
  function handleClose() {
    setForm({
      propertyId: '',
      category: 'Mortgage Documents',
      name: '',
      tags: '',
    });
    setFieldErrors({});
    setLoading(false);
    setFiles([]);
    onClose();
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    const errors = validate(form, files);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    // will add the api call later
  }

  // ── File helpers ────────────────────────────────────────────────────────────
  function addFiles(incoming: FileList | null) {
    if (!incoming) return;
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      return [
        ...prev,
        ...Array.from(incoming).filter((f) => !existing.has(f.name + f.size)),
      ];
    });
    setFieldErrors((prev) => ({ ...prev, documents: '' }));
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className='flex max-h-[90vh] w-full flex-col overflow-hidden p-0 sm:max-w-185'>
        {/* Header */}
        <DialogHeader className='shrink-0 border-b px-6 py-6'>
          <DialogTitle className='text-foreground text-xl font-bold'>
            Upload Document
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable body */}
        <div className='flex-1 space-y-5 overflow-y-auto px-6 py-5'>
          <Field data-invalid={!!fieldErrors.propertyId}>
            <FieldLabel className='text-sm font-semibold'>Property</FieldLabel>
            <Select
              value={form.propertyId}
              onValueChange={(v) => set('propertyId', v)}
            >
              <SelectTrigger
                className={fieldErrors.propertyId ? 'border-danger' : ''}
              >
                <SelectValue placeholder='Select property...' />
              </SelectTrigger>
              <SelectContent>
                {properties?.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[{ message: fieldErrors.propertyId }]} />
          </Field>

          <Field data-invalid={!!fieldErrors.category}>
            <FieldLabel className='text-sm font-semibold'>
              Document Category
            </FieldLabel>
            <Select
              value={form.category}
              onValueChange={(v) => set('category', v)}
            >
              <SelectTrigger
                className={fieldErrors.category ? 'border-danger' : ''}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {documentCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[{ message: fieldErrors.category }]} />
          </Field>

          <Field data-invalid={!!fieldErrors.name}>
            <FieldLabel className='text-sm font-semibold'>
              Document Name
            </FieldLabel>
            <Input
              placeholder='e.g. Tenancy Agreement - Oak Street'
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              aria-invalid={!!fieldErrors.name}
              className={
                fieldErrors.name
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: fieldErrors.name }]} />
          </Field>

          <Field data-invalid={!!fieldErrors.tags}>
            <FieldLabel className='text-sm font-semibold'>Tags</FieldLabel>
            <Input
              placeholder='Comma separated tags...'
              value={form.tags}
              onChange={(e) => set('tags', e.target.value)}
              aria-invalid={!!fieldErrors.tags}
              className={
                fieldErrors.tags
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: fieldErrors.tags }]} />
          </Field>

          {/* File upload */}
          <div className='space-y-3'>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onClick={() => fileInputRef.current?.click()}
              className={[
                'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors',
                fieldErrors.documents
                  ? 'border-danger bg-red-50 dark:bg-red-950/20'
                  : dragging
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/40',
              ].join(' ')}
            >
              <CloudUpload
                className={[
                  'mb-3 h-10 w-10',
                  fieldErrors.documents ? 'text-danger' : 'text-primary',
                ].join(' ')}
              />
              <p className='text-foreground text-sm font-semibold'>
                Drag &amp; Drop or Click to Upload
              </p>
              <p className='text-muted-foreground mt-1 text-xs'>
                PDF, DOC, XLS, JPG, PNG up to 50MB
              </p>
              <input
                ref={fileInputRef}
                type='file'
                multiple
                accept='.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png'
                className='hidden'
                onChange={(e) => addFiles(e.target.files)}
              />
            </div>
            <FieldError errors={[{ message: fieldErrors.documents }]} />

            {files.length > 0 && (
              <ul className='space-y-2'>
                {files.map((file, i) => (
                  <li
                    key={i}
                    className='bg-muted flex items-center justify-between rounded-md px-4 py-2.5'
                  >
                    <Badge
                      variant='secondary'
                      className='max-w-[80%] truncate font-normal'
                    >
                      {file.name}
                    </Badge>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      onClick={() => removeFile(i)}
                      className='text-muted-foreground hover:text-danger ml-2 h-6 w-6 shrink-0'
                      aria-label='Remove file'
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className='flex shrink-0 items-center justify-end gap-3 border-t px-6 py-4'>
          <Button variant='outline' onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDocumentDialog;
