'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import {
  DocumentCategory,
  DocumentForm,
  initialForm as INITIAL_DOCUMENT_DIALOG_FORM,
} from '@/types/client/Common/Documents/DocumentTypes';
import { DocumentStepProps } from '@/types/client/StartNewJourney/StartNewJourneyTypes';
import { CloudUpload, X } from 'lucide-react';
import { forwardRef, useCallback, useRef, useState } from 'react';

export type DocumentStepValue = Omit<DocumentForm, 'propertyId'>;

export const EMPTY_DOCUMENT_STEP_FORM: DocumentStepValue = (() => {
  const { propertyId: _propertyId, ...rest } = INITIAL_DOCUMENT_DIALOG_FORM;
  return rest;
})();

const DocumentsTab = forwardRef<HTMLFormElement, DocumentStepProps>(
  ({ active, value, onChange, files, onFilesChange, errors }, ref) => {
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function set<K extends keyof DocumentStepValue>(
      key: K,
      v: DocumentStepValue[K],
    ) {
      onChange({ ...value, [key]: v });
    }

    function addFiles(incoming: FileList | null) {
      if (!incoming || incoming.length === 0) return;
      const existing = new Set(files.map((f) => f.name + f.size));
      onFilesChange([
        ...files,
        ...Array.from(incoming).filter((f) => !existing.has(f.name + f.size)),
      ]);
    }

    function removeFile(index: number) {
      onFilesChange(files.filter((_, i) => i !== index));
      if (fileInputRef.current) fileInputRef.current.value = '';
    }

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        addFiles(e.dataTransfer.files);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [files],
    );

    return (
      <form ref={ref} hidden={!active} className='space-y-5'>
        <Field data-invalid={!!errors.documentName}>
          <FieldLabel className='gap-0 text-sm font-semibold'>
            Document Name<span className='text-danger'>*</span>
          </FieldLabel>
          <Input
            type='text'
            placeholder='e.g. Tenancy Agreement - Oak Street'
            value={value.name}
            onChange={(e) => set('name', e.target.value)}
            aria-invalid={!!errors.documentName}
            className={
              errors.documentName
                ? 'border-danger focus-visible:ring-danger/50'
                : ''
            }
            required
          />
          <FieldError errors={[{ message: errors.documentName }]} />
        </Field>

        <Field data-invalid={!!errors.documentCategory}>
          <FieldLabel className='text-sm font-semibold'>
            Document Category
          </FieldLabel>
          <Select
            value={value.category}
            onValueChange={(v) => set('category', v as DocumentCategory)}
          >
            <SelectTrigger
              className={errors.documentCategory ? 'border-danger' : ''}
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
          <FieldError errors={[{ message: errors.documentCategory }]} />
        </Field>

        <div className='space-y-3'>
          <FieldLabel className='gap-0 text-sm font-semibold'>
            Documents
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
              errors.file
                ? 'border-danger bg-red-50 dark:bg-red-950/20'
                : dragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/40',
            )}
          >
            <CloudUpload
              className={cn(
                'mb-3 h-10 w-10',
                errors.file ? 'text-danger' : 'text-primary',
              )}
            />
            <p className='text-foreground text-sm font-semibold'>
              Drag &amp; Drop or Click to Upload
            </p>
            <p className='text-muted-foreground mt-1 text-xs'>
              PDF, DOC, XLS, JPG, PNG up to 50MB each, multiple files allowed
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
          <FieldError errors={[{ message: errors.file }]} />

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
      </form>
    );
  },
);

DocumentsTab.displayName = 'DocumentStep';

export default DocumentsTab;
