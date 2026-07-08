'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { documentCategoryOptions } from '@/data/client/common/documents/DocumentsData';
import { cn } from '@/lib/utils';
import { useUpdateDocumentMutation } from '@/store/api/endpoints/client/Common/Documents/DocumentsApi';
import { useFilterPropertiesQuery } from '@/store/api/endpoints/client/Common/Filters/FilterPropertiesApi';
import {
  DocumentCategory,
  PropertyDocument,
  UpdateDocumentDialogProps,
  UpdateDocumentForm,
  UpdateDocumentFormProps,
} from '@/types/client/Common/Documents/DocumentTypes';
import { Property } from '@/types/client/Common/Properties/PropertyTypes';
import { snakeToCamel } from '@/utils/formatters';

import { CloudUpload, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

// ── Helpers ──────────────────────────────────────────────────────────────

function getFileName(url: string): string {
  try {
    const path = new URL(url).pathname;
    const last = path.substring(path.lastIndexOf('/') + 1);
    return decodeURIComponent(last) || 'document';
  } catch {
    return 'document';
  }
}

function toFormState(document: PropertyDocument): UpdateDocumentForm {
  return {
    propertyId: String(document.property.id),
    propertyName: document.property.property_name,
    category: document.document_category as DocumentCategory,
    name: document.document_name,
    tags: document.tags ?? '',
  };
}

// ── Inner form (keyed per-document so state resets cleanly) ───────────────

const UpdateDocumentFormInner: React.FC<UpdateDocumentFormProps> = ({
  document,
  onClose,
  onSuccess,
}) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [propertyOpen, setPropertyOpen] = useState(false);
  const [propertySearch, setPropertySearch] = useState('');

  const [form, setForm] = useState<UpdateDocumentForm>(() =>
    toFormState(document),
  );

  const existingFile = document.files[0] ?? null;
  const [removedExisting, setRemovedExisting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof UpdateDocumentForm>(
    key: K,
    value: UpdateDocumentForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: '' }));
  }

  // ── RTK Query ─────────────────────────────────────────────────────────

  const { data, isLoading: propertiesLoading } = useFilterPropertiesQuery(
    propertySearch ? { search: propertySearch } : {},
    { skip: !propertyOpen },
  );

  const [updateDocument, { isLoading: loading }] = useUpdateDocumentMutation();

  // ── File helpers ──────────────────────────────────────────────────────

  function addFile(incoming: FileList | null) {
    if (!incoming || incoming.length === 0) return;
    setFile(incoming[0]);
    setFieldErrors((prev) => ({ ...prev, file: '' }));
  }

  function removeFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (existingFile) setRemovedExisting(true);
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFile(e.dataTransfer.files);
  }, []);

  // ── Submit ──────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.propertyId) {
      setFieldErrors((prev) => ({
        ...prev,
        propertyId: 'Please select a property.',
      }));
      return;
    }

    if (!form.name.trim()) {
      setFieldErrors((prev) => ({
        ...prev,
        documentName: 'Please enter a document name.',
      }));
      return;
    }

    const payload = new FormData();
    payload.append('property', form.propertyId);
    payload.append('document_category', form.category);
    payload.append('document_name', form.name.trim());
    payload.append('tags', form.tags.trim());
    // Only send a file if the user actually picked a new one -- this is
    // a PATCH, so omitting it leaves the existing file untouched.
    if (file) {
      payload.append('uploaded_files', file);
    }

    try {
      await updateDocument({
        document_alias: document.alias,
        payload,
      }).unwrap();
      toast.success('Document updated successfully.');
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      try {
        const errorData = (err as { data?: Record<string, string[]> })?.data;
        if (errorData) {
          const mapped: Record<string, string> = {};
          Object.entries(errorData).forEach(([key, messages]) => {
            mapped[snakeToCamel(key)] = Array.isArray(messages)
              ? messages[0]
              : String(messages);
          });
          setFieldErrors((prev) => ({ ...prev, ...mapped }));
        }
      } catch {
        toast.error('Failed to update document. Please try again.');
      }
    }
  }

  const showExistingFile = existingFile && !removedExisting && !file;

  return (
    <form onSubmit={handleSubmit} className='contents'>
      {/* Scrollable body */}
      <div className='flex-1 space-y-5 overflow-y-auto px-6 py-5'>
        <Field data-invalid={!!fieldErrors.propertyId}>
          <FieldLabel className='gap-0 text-sm font-semibold'>
            Property<span className='text-danger'>*</span>
          </FieldLabel>
          <div className='relative'>
            <Input
              type='text'
              placeholder='Search by property name...'
              value={
                form.propertyId
                  ? data?.find(
                      (p: Property) => String(p.id) === form.propertyId,
                    )?.property_name ||
                    propertySearch ||
                    form.propertyName
                  : propertySearch
              }
              onChange={(e) => {
                setPropertySearch(e.target.value);
                set('propertyId', '');
                set('propertyName', '');
                setPropertyOpen(true);
              }}
              onClick={() => setPropertyOpen(true)}
              onBlur={() => setTimeout(() => setPropertyOpen(false), 150)}
              aria-invalid={!!fieldErrors.propertyId}
              className={cn(
                'h-10',
                fieldErrors.propertyId &&
                  'border-danger focus-visible:ring-danger/50',
              )}
            />

            {propertyOpen && (
              <div className='bg-background border-border absolute top-full left-0 z-50 mt-1 w-full rounded-md border shadow-md'>
                {propertiesLoading ? (
                  <div className='flex items-center justify-center gap-2 px-4 py-3 text-sm'>
                    <Loading />
                  </div>
                ) : !data?.length ? (
                  <p className='text-muted-foreground px-4 py-3 text-sm'>
                    No properties found.
                  </p>
                ) : (
                  <ul className='max-h-60 overflow-y-auto py-1'>
                    {data.map((p: Property) => (
                      <li
                        key={p.alias}
                        onMouseDown={() => {
                          set('propertyId', String(p.id));
                          set('propertyName', p.property_name);
                          setPropertySearch('');
                          setPropertyOpen(false);
                        }}
                        className={cn(
                          'hover:bg-muted flex cursor-pointer items-center gap-3 px-4 py-2.5',
                          form.propertyId === String(p.id) && 'bg-muted',
                        )}
                      >
                        <span className='text-foreground text-sm'>
                          {p.property_name}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          <FieldError errors={[{ message: fieldErrors.propertyId }]} />
        </Field>

        <Field data-invalid={!!fieldErrors.documentCategory}>
          <FieldLabel className='text-sm font-semibold'>
            Document Category
          </FieldLabel>
          <Select
            value={form.category}
            onValueChange={(v) => set('category', v as DocumentCategory)}
          >
            <SelectTrigger
              className={fieldErrors.documentCategory ? 'border-danger' : ''}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {documentCategoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={[{ message: fieldErrors.documentCategory }]} />
        </Field>

        <Field data-invalid={!!fieldErrors.documentName}>
          <FieldLabel className='text-sm font-semibold'>
            Document Name<span className='text-danger'>*</span>
          </FieldLabel>
          <Input
            type='text'
            placeholder='e.g. Tenancy Agreement - Oak Street'
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            aria-invalid={!!fieldErrors.documentName}
            className={
              fieldErrors.documentName
                ? 'border-danger focus-visible:ring-danger/50'
                : ''
            }
            required
          />
          <FieldError errors={[{ message: fieldErrors.documentName }]} />
        </Field>

        <Field data-invalid={!!fieldErrors.tags}>
          <FieldLabel className='text-sm font-semibold'>Tags</FieldLabel>
          <Input
            type='text'
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

        {/* File Upload */}
        <div className='space-y-3'>
          <FieldLabel className='text-sm font-semibold'>File</FieldLabel>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors',
              fieldErrors.file
                ? 'border-danger bg-red-50 dark:bg-red-950/20'
                : dragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/40',
            )}
          >
            <CloudUpload
              className={cn(
                'mb-3 h-10 w-10',
                fieldErrors.file ? 'text-danger' : 'text-primary',
              )}
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
              accept='.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png'
              className='hidden'
              onChange={(e) => addFile(e.target.files)}
            />
          </div>
          <FieldError errors={[{ message: fieldErrors.file }]} />

          {showExistingFile ? (
            <ul className='space-y-2'>
              <li className='bg-muted flex items-center justify-between rounded-md px-4 py-2.5'>
                <Badge
                  variant='secondary'
                  className='max-w-[80%] truncate font-normal'
                >
                  {getFileName(existingFile.file)}
                </Badge>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={removeFile}
                  className='text-muted-foreground hover:text-danger ml-2 h-6 w-6 shrink-0'
                  aria-label='Remove file'
                >
                  <X className='h-4 w-4' />
                </Button>
              </li>
            </ul>
          ) : (
            file && (
              <ul className='space-y-2'>
                <li className='bg-muted flex items-center justify-between rounded-md px-4 py-2.5'>
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
                    onClick={removeFile}
                    className='text-muted-foreground hover:text-danger ml-2 h-6 w-6 shrink-0'
                    aria-label='Remove file'
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </li>
              </ul>
            )
          )}
        </div>
      </div>

      {/* Footer */}
      <div className='flex shrink-0 items-center justify-end gap-3 border-t px-6 py-4'>
        <Button
          type='button'
          variant='outline'
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type='submit' disabled={loading}>
          {loading && <Loading className='text-white!' />}
          Update
        </Button>
      </div>
    </form>
  );
};

// ── Shell dialog ────────────────────────────────────────────────────────

const UpdateDocumentDialog: React.FC<UpdateDocumentDialogProps> = ({
  document,
  open,
  onClose,
  onSuccess,
}) => {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className='flex max-h-[90vh] w-full flex-col overflow-hidden p-0 sm:max-w-185'
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className='shrink-0 border-b px-6 py-6'>
          <DialogTitle className='text-foreground text-xl font-bold'>
            Update Document
          </DialogTitle>
          <DialogDescription className='text-muted-foreground mt-1 text-sm'>
            Update the details of your document.
          </DialogDescription>
        </DialogHeader>

        {document && (
          <UpdateDocumentFormInner
            key={document.alias}
            document={document}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDocumentDialog;
