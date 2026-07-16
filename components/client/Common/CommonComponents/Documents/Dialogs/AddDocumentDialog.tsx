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
import { useAddDocumentsMutation } from '@/store/api/endpoints/client/Common/Documents/DocumentsApi';
import { useFilterPropertiesQuery } from '@/store/api/endpoints/client/Common/Filters/FilterPropertiesApi';
import {
  DocumentCategory,
  DocumentForm,
  initialForm,
  UploadDocumentDialogProps,
} from '@/types/client/Common/Documents/DocumentTypes';
import { Property } from '@/types/client/Common/Properties/PropertyTypes';
import { snakeToCamel } from '@/utils/formatters';

import { CloudUpload, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

// ── Dialog ─────────────────────────────────────────────────────────────────

const AddDocumentDialog: React.FC<UploadDocumentDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [propertyOpen, setPropertyOpen] = useState(false);
  const [propertySearch, setPropertySearch] = useState('');

  const [form, setForm] = useState<DocumentForm>(initialForm);

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof DocumentForm>(key: K, value: DocumentForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: '' }));
  }

  // ── Reset ─────────────────────────────────────────────────────────────────

  function handleClose() {
    setForm(initialForm);
    setFieldErrors({});
    setFile(null);
    setPropertySearch('');
    onClose();
  }

  // ── RTK Query ─────────────────────────────────────────────────────────────

  const { data, isLoading: propertiesLoading } = useFilterPropertiesQuery(
    propertySearch ? { search: propertySearch } : {},
    { skip: !propertyOpen },
  );

  const [addDocument, { isLoading: loading }] = useAddDocumentsMutation();

  // ── File helpers ──────────────────────────────────────────────────────────

  function addFile(incoming: FileList | null) {
    if (!incoming || incoming.length === 0) return;
    setFile(incoming[0]);
    setFieldErrors((prev) => ({ ...prev, file: '' }));
  }

  function removeFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFile(e.dataTransfer.files);
  }, []);

  // ── Submit ────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // manual guard for the non-native property combobox
    if (!form.propertyId) {
      setFieldErrors((prev) => ({
        ...prev,
        propertyId: 'Please select a property.',
      }));
      return;
    }

    if (!file) {
      setFieldErrors((prev) => ({
        ...prev,
        file: 'Please upload a document.',
      }));
      return;
    }

    const payload = new FormData();
    payload.append('property', form.propertyId);
    payload.append('document_category', form.category);
    payload.append('document_name', form.name.trim());
    payload.append('tags', form.tags.trim());
    // NOTE: confirm this field name against your backend serializer
    payload.append('uploaded_files', file);

    try {
      await addDocument(payload).unwrap();
      toast.success('Document uploaded successfully.');
      onSuccess?.();
      handleClose();
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
        toast.error('Failed to upload document. Please try again.');
      }
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className='flex max-h-[90vh] w-full flex-col overflow-hidden p-0 sm:max-w-185'
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader className='shrink-0 border-b px-6 py-6'>
          <DialogTitle className='text-foreground text-xl font-bold'>
            Upload Document
          </DialogTitle>
          <DialogDescription>
            Add a new document for your proprty.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='contents'>
          {/* Scrollable body */}
          <div className='flex-1 space-y-5 overflow-y-auto px-6 py-5'>

            {/* Property */}
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
                      ? (data?.find(
                          (p: Property) => String(p.id) === form.propertyId,
                        )?.property_name ?? propertySearch)
                      : propertySearch
                  }
                  onChange={(e) => {
                    setPropertySearch(e.target.value);
                    set('propertyId', '');
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
                  required
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
                  className={
                    fieldErrors.documentCategory ? 'border-danger' : ''
                  }
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
              <FieldError
                errors={[{ message: fieldErrors.documentCategory }]}
              />
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

            {/* File upload */}
            <div className='space-y-3'>
              <FieldLabel className='gap-0 text-sm font-semibold'>
                Document<span className='text-danger'>*</span>
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
              {!file && (
                <div className='bg-warning border-2-warning rounded p-2'>
                  <p className='text-xs text-white'>
                    At least one document/image is required
                  </p>
                </div>
              )}
              <FieldError errors={[{ message: fieldErrors.file }]} />

              {file && (
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
              )}
            </div>
          </div>

          {/* Footer */}
          <div className='flex shrink-0 items-center justify-end gap-3 border-t px-6 py-4'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={loading}>
              {loading && <Loading className='text-white!' />}
              Upload
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDocumentDialog;
