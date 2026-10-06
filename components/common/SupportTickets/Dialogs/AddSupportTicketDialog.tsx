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
import { Textarea } from '@/components/ui/textarea';
import {
  EMPTY_FORM,
  PriorityOptions,
  TicketTypeOptions,
} from '@/data/common/SupportTickets/SupportTicketsData';

import { cn } from '@/lib/utils';
import { useAddSupportTicketsMutation } from '@/store/api/endpoints/common/SupportTickets/SupportTicketsApi';
import {
  AddSupportTicketModalProps,
  SupportTicketForm,
} from '@/types/common/SupportTickets/SupportTicketTypes';

import { snakeToCamel } from '@/utils/formatters';

import { Paperclip, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

// ── Dialog ────────────────────────────────────────────────────────────────

const AddSupportTicketDialog: React.FC<AddSupportTicketModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<SupportTicketForm>(EMPTY_FORM);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof SupportTicketForm>(
    key: K,
    value: SupportTicketForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: '' }));
  }

  // ── File helpers ──────────────────────────────────────────────────────────
  function addFiles(incoming: FileList | null) {
    if (!incoming?.length) return;
    setFiles((prev) => [...prev, ...Array.from(incoming)]);
    setFieldErrors((prev) => ({ ...prev, uploadFiles: '' }));
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  // ── Reset ─────────────────────────────────────────────────────────────────
  function handleClose() {
    setForm(EMPTY_FORM);
    setFieldErrors({});
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  }

  // ── RTK Query ─────────────────────────────────────────────────────────────
  const [addSupportTicket, { isLoading: loading }] =
    useAddSupportTicketsMutation();

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // manual guard for the non-native control (ticket type select)
    if (!form.ticketType) {
      setFieldErrors((prev) => ({
        ...prev,
        ticketType: 'Please select a ticket type.',
      }));
      return;
    }
    if (!form.priority) {
      setFieldErrors((prev) => ({
        ...prev,
        priority: 'Please select a priority.',
      }));
      return;
    }

    const payload = new FormData();
    payload.append('ticket_type', form.ticketType);
    payload.append('priority', form.priority);
    payload.append('subject', form.subject.trim());
    payload.append('description', form.description.trim());
    files.forEach((file) => payload.append('upload_files', file));

    try {
      await addSupportTicket(payload).unwrap();
      toast.success('Support ticket submitted successfully.');
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
        toast.error('Failed to submit ticket. Please try again.');
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
        <DialogHeader className='shrink-0 border-b px-6 pt-6 pb-5'>
          <DialogTitle className='text-foreground text-xl font-bold'>
            Add Support Ticket
          </DialogTitle>
          <DialogDescription>
            Submit a new support ticket for your issue or request.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='contents'>
          {/* Scrollable body */}
          <div className='flex-1 space-y-5 overflow-y-auto px-6 py-5'>
            <div className='grid grid-cols-2 gap-4'>
              {/* Ticket Type */}
              <Field data-invalid={!!fieldErrors.ticketType}>
                <FieldLabel className='gap-0 text-sm font-semibold'>
                  Ticket Type<span className='text-danger'>*</span>
                </FieldLabel>
                <Select
                  value={form.ticketType}
                  onValueChange={(v) =>
                    set('ticketType', v as SupportTicketForm['ticketType'])
                  }
                >
                  <SelectTrigger
                    className={fieldErrors.ticketType ? 'border-danger' : ''}
                  >
                    <SelectValue placeholder='Select ticket type' />
                  </SelectTrigger>
                  <SelectContent>
                    {TicketTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[{ message: fieldErrors.ticketType }]} />
              </Field>

              {/* Priority */}
              <Field data-invalid={!!fieldErrors.priority}>
                <FieldLabel className='gap-0 text-sm font-semibold'>
                  Priority<span className='text-danger'>*</span>
                </FieldLabel>
                <Select
                  value={form.priority}
                  onValueChange={(v) =>
                    set('priority', v as SupportTicketForm['priority'])
                  }
                >
                  <SelectTrigger
                    className={fieldErrors.priority ? 'border-danger' : ''}
                  >
                    <SelectValue placeholder='Select priority' />
                  </SelectTrigger>
                  <SelectContent>
                    {PriorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[{ message: fieldErrors.priority }]} />
              </Field>
            </div>

            {/* Subject */}
            <Field data-invalid={!!fieldErrors.subject}>
              <FieldLabel className='gap-0 text-sm font-semibold'>
                Subject<span className='text-danger'>*</span>
              </FieldLabel>
              <Input
                type='text'
                placeholder='Brief summary of the issue...'
                value={form.subject}
                onChange={(e) => set('subject', e.target.value)}
                aria-invalid={!!fieldErrors.subject}
                className={
                  fieldErrors.subject
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
                required
              />
              <FieldError errors={[{ message: fieldErrors.subject }]} />
            </Field>

            {/* Description */}
            <Field data-invalid={!!fieldErrors.description}>
              <FieldLabel className='gap-0 text-sm font-semibold'>
                Description<span className='text-danger'>*</span>
              </FieldLabel>
              <Textarea
                placeholder='Describe the issue in detail...'
                rows={8}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                aria-invalid={!!fieldErrors.description}
                className={
                  fieldErrors.description
                    ? 'border-danger focus-visible:ring-danger/50'
                    : ''
                }
                required
              />
              <FieldError errors={[{ message: fieldErrors.description }]} />
            </Field>

            {/* File upload */}
            <Field data-invalid={!!fieldErrors.uploadFiles}>
              <FieldLabel className='text-sm font-semibold'>
                Attachments
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
                  'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-2 transition-colors',
                  fieldErrors.uploadFiles
                    ? 'border-danger bg-red-50 dark:bg-red-950/20'
                    : dragging
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted/40',
                )}
              >
                <Paperclip className='text-primary mb-3 h-9 w-9' />
                <p className='text-muted-foreground text-sm'>
                  Attach screenshots, logs, or other files
                </p>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='.pdf,.jpg,.jpeg,.png,.webp,.txt,.log'
                  multiple
                  className='hidden'
                  onChange={(e) => addFiles(e.target.files)}
                />
              </div>
              <FieldError errors={[{ message: fieldErrors.uploadFiles }]} />

              {files.length > 0 && (
                <ul className='space-y-2'>
                  {files.map((file, index) => (
                    <li
                      key={`${file.name}-${file.size}-${index}`}
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
                        onClick={() => removeFile(index)}
                        className='text-muted-foreground hover:text-danger ml-2 h-6 w-6 shrink-0'
                        aria-label={`Remove ${file.name}`}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </Field>
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
              Submit Ticket
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSupportTicketDialog;
