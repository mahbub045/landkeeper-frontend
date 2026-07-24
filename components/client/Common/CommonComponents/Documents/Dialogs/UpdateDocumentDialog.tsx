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

  // all files already attached to this document (index-tracked, since
  // PropertyDocument entries don't always carry a stable removable id)
  const existingFiles = document.files ?? [];
  const [removedExistingIndexes, setRemovedExistingIndexes] = useState<
    Set<number>
  >(new Set());

  // newly-added files, multiple allowed
  const [files, setFiles] = useState<File[]>([]);
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

  function addFiles(incoming: FileList | null) {
    if (!incoming || incoming.length === 0) return;

    const newFiles = Array.from(incoming);

    setFiles((prev) => {
      const existingKeys = new Set(prev.map((f) => `${f.name}-${f.size}`));
      const deduped = newFiles.filter(
        (f) => !existingKeys.has(`${f.name}-${f.size}`),
      );
      return [...prev, ...deduped];
    });

    setFieldErrors((prev) => ({ ...prev, file: '' }));

    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removeNewFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function removeExistingFile(index: number) {
    setRemovedExistingIndexes((prev) => new Set(prev).add(index));
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  const remainingExistingFiles = existingFiles.filter(
    (_, index) => !removedExistingIndexes.has(index),
  );
  const totalFileCount = remainingExistingFiles.length + files.length;

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

    if (totalFileCount === 0) {
      setFieldErrors((prev) => ({
        ...prev,
        file: 'Please upload at least one document.',
      }));
      return;
    }

    const payload = new FormData();
    payload.append('property', form.propertyId);
    payload.append('document_category', form.category);
    payload.append('document_name', form.name.trim());

    // Only send new files if the user actually picked some -- this is a
    // PATCH, so omitting it leaves the existing files untouched.
    files.forEach((file) => {
      payload.append('uploaded_files', file);
    });

    // NOTE: confirm this field name against your backend serializer if it
    // supports removing individual existing files (e.g. by id/alias).
    // Falling back to index-based removal markers here since
    // PropertyDocument.files may not expose a stable identifier.
    if (removedExistingIndexes.size > 0) {
      Array.from(removedExistingIndexes).forEach((index) => {
        payload.append('removed_file_indexes', String(index));
      });
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

        {/* File Upload */}
        <div className='space-y-3'>
          <FieldLabel className='gap-0 text-sm font-semibold'>
            Documents<span className='text-danger'>*</span>
          </FieldLabel>

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
              PDF, DOC, XLS, JPG, PNG up to 50MB each. You can select multiple
              files.
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
          <FieldError errors={[{ message: fieldErrors.file }]} />

          {(remainingExistingFiles.length > 0 || files.length > 0) && (
            <ul className='space-y-2'>
              {existingFiles.map((existingFile, index) => {
                if (removedExistingIndexes.has(index)) return null;
                return (
                  <li
                    key={`existing-${index}`}
                    className='bg-muted flex items-center justify-between rounded-md px-4 py-2.5'
                  >
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
                      onClick={() => removeExistingFile(index)}
                      className='text-muted-foreground hover:text-danger ml-2 h-6 w-6 shrink-0'
                      aria-label={`Remove ${getFileName(existingFile.file)}`}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </li>
                );
              })}

              {files.map((file, index) => (
                <li
                  key={`new-${file.name}-${file.size}-${index}`}
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
                    onClick={() => removeNewFile(index)}
                    className='text-muted-foreground hover:text-danger ml-2 h-6 w-6 shrink-0'
                    aria-label={`Remove ${file.name}`}
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
          <DialogDescription>
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
