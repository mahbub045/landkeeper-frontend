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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useUpdateMTDFinanceCostsMutation } from '@/store/api/endpoints/client/Common/MakingTaxDigital/MakingTaxDigitalApi';
import {
  EditFinanceCostDialogProps,
  EditFinanceCostFormProps,
} from '@/types/client/Common/MakingTaxDigital/MakingTaxDigitalTypes';

import { CloudUpload, FileText, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

// ── Inner form (keyed per finance cost so state resets cleanly) ──────────

const EditFinanceCostForm: React.FC<EditFinanceCostFormProps> = ({
  reportAlias,
  financeCost,
  onClose,
}) => {
  const [notes, setNotes] = useState(financeCost.notes ?? '');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // newly-added files, multiple allowed
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [updateFinanceCost, { isLoading: loading }] =
    useUpdateMTDFinanceCostsMutation();

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

    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removeNewFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  // ── Submit ──────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const payload = new FormData();
    payload.append('notes', notes.trim());

    // This is a PATCH, so omitting files leaves the existing evidence as-is
    files.forEach((file) => {
      payload.append('evidence_files', file);
    });

    try {
      await updateFinanceCost({
        reportAlias,
        financeCostAlias: financeCost.alias,
        payload,
      }).unwrap();
      toast.success('Finance cost updated successfully.');
      onClose();
    } catch (err: unknown) {
      const errorData = (err as { data?: Record<string, string[]> })?.data;
      if (errorData && typeof errorData === 'object') {
        const mapped: Record<string, string> = {};
        Object.entries(errorData).forEach(([key, messages]) => {
          mapped[key] = Array.isArray(messages)
            ? messages[0]
            : String(messages);
        });
        setFieldErrors(mapped);
      } else {
        toast.error('Failed to update finance cost. Please try again.');
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className='contents'>
      {/* Scrollable body */}
      <div className='flex-1 space-y-5 overflow-y-auto px-6 py-5'>
        <div className='bg-muted/50 grid grid-cols-1 gap-3 rounded-lg px-4 py-3 text-sm sm:grid-cols-2'>
          <div>
            <p className='text-muted-foreground text-xs'>Property</p>
            <p className='text-foreground font-medium'>
              {financeCost.property_name}
            </p>
          </div>
          <div>
            <p className='text-muted-foreground text-xs'>Lender</p>
            <p className='text-foreground font-medium'>
              {financeCost.lender_name}
            </p>
          </div>
        </div>

        <Field data-invalid={!!fieldErrors.notes}>
          <FieldLabel
            htmlFor='mtd-finance-cost-notes'
            className='text-sm font-semibold'
          >
            Notes
          </FieldLabel>
          <Textarea
            id='mtd-finance-cost-notes'
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              setFieldErrors((prev) => ({ ...prev, notes: '' }));
            }}
            placeholder='Add any notes about this finance cost'
            rows={3}
          />
          <FieldError errors={[{ message: fieldErrors.notes }]} />
        </Field>

        {/* Evidence upload */}
        <div className='space-y-3'>
          <FieldLabel className='text-sm font-semibold'>Evidence</FieldLabel>

          {financeCost.evidence.length > 0 && (
            <ul className='space-y-2'>
              {financeCost.evidence.map((file) => (
                <li
                  key={file.id}
                  className='bg-muted flex items-center gap-2 rounded-md px-4 py-2.5'
                >
                  <FileText className='text-muted-foreground size-4 shrink-0' />
                  <span className='text-foreground truncate text-sm'>
                    {file.name}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 transition-colors',
              fieldErrors.evidence_files
                ? 'border-danger bg-red-50 dark:bg-red-950/20'
                : dragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/40',
            )}
          >
            <CloudUpload
              className={cn(
                'mb-3 h-10 w-10',
                fieldErrors.evidence_files ? 'text-danger' : 'text-primary',
              )}
            />
            <p className='text-foreground text-sm font-semibold'>
              Drag &amp; Drop or Click to Upload
            </p>
            <p className='text-muted-foreground mt-1 text-xs'>
              Mortgage statements, lender letters, etc. You can select multiple
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
          <FieldError errors={[{ message: fieldErrors.evidence_files }]} />

          {files.length > 0 && (
            <ul className='space-y-2'>
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

const EditFinanceCostDialog: React.FC<EditFinanceCostDialogProps> = ({
  reportAlias,
  financeCost,
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className='flex max-h-[90vh] w-full flex-col overflow-hidden p-0 sm:max-w-150'
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className='shrink-0 border-b px-6 py-6'>
          <DialogTitle className='text-primary -mb-2 text-xl font-bold'>
            Edit Finance Cost
          </DialogTitle>
          <DialogDescription>
            Update the notes and supporting evidence for this finance cost.
          </DialogDescription>
        </DialogHeader>

        {reportAlias && financeCost && (
          <EditFinanceCostForm
            key={financeCost.alias}
            reportAlias={reportAlias}
            financeCost={financeCost}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditFinanceCostDialog;
