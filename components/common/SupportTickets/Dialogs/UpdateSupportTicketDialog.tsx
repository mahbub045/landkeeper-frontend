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
  PriorityOptions,
  TicketTypeOptions,
} from '@/data/common/SupportTickets/SupportTicketsData';

import { cn } from '@/lib/utils';
import { useUpdateSupportTicketsMutation } from '@/store/api/endpoints/common/SupportTickets/SupportTicketsApi';
import {
  ApiSupportTicketFile,
  SupportTicketForm,
  UpdateSupportTicketDialogProps,
} from '@/types/common/SupportTickets/SupportTicketTypes';

import { snakeToCamel } from '@/utils/formatters';

import { Paperclip, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

function mapToForm(
  ticket: UpdateSupportTicketDialogProps['ticket'],
): SupportTicketForm {
  if (!ticket) {
    return { ticketType: '', priority: '', subject: '', description: '' };
  }

  return {
    ticketType: ticket.ticket_type,
    priority: ticket.priority,
    subject: ticket.subject,
    description: ticket.description,
  };
}

// ── Dialog ────────────────────────────────────────────────────────────────
// Parent renders this with `key={editingTicket?.alias}`, so a fresh instance
// mounts per ticket — no need to sync state via effects for the form fields.
// The file re-fetch below still needs an effect since it's async.

const UpdateSupportTicketDialog: React.FC<UpdateSupportTicketDialogProps> = ({
  ticket,
  open,
  onClose,
  onSuccess,
}) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<SupportTicketForm>(() => mapToForm(ticket));

  // New files the user is adding in this edit session
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialFormRef = useRef<SupportTicketForm>(mapToForm(ticket));

  // Files still "kept" from the original ticket (for display + removal)
  const [existingFiles, setExistingFiles] = useState<ApiSupportTicketFile[]>(
    ticket?.files ?? [],
  );

  // Re-fetched blobs of the ORIGINAL files, turned back into File objects
  // so they can be re-uploaded — backend replaces the whole set on update.
  const [cachedExistingFiles, setCachedExistingFiles] = useState<
    Record<string, File>
  >({});
  const [filesLoading, setFilesLoading] = useState(false);

  function set<K extends keyof SupportTicketForm>(
    key: K,
    value: SupportTicketForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: '' }));
  }

  // ── Prefetch existing files as File objects ─────────────────────────────
  useEffect(() => {
    if (!open || !ticket?.files?.length) return;

    let cancelled = false;

    const prefetch = async () => {
      setFilesLoading(true);
      try {
        const entries = await Promise.all(
          ticket.files.map(async (f) => {
            const res = await fetch(
              `/api/fetch-remote-files?url=${encodeURIComponent(f.file)}`,
            );
            if (!res.ok) {
              throw new Error(
                `Failed to fetch file ${f.alias} (${res.status})`,
              );
            }
            const blob = await res.blob();
            const filename = f.file.split('/').pop() || `file-${f.alias}`;
            return [
              f.alias,
              new File([blob], filename, { type: blob.type }),
            ] as const;
          }),
        );
        if (!cancelled) setCachedExistingFiles(Object.fromEntries(entries));
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to prefetch existing files', err);
          toast.error(
            'Could not load one or more existing files. Removing/keeping them may not work correctly.',
          );
        }
      } finally {
        if (!cancelled) setFilesLoading(false);
      }
    };

    prefetch();

    return () => {
      cancelled = true;
    };
  }, [open, ticket?.alias, ticket?.files]);

  // ── File helpers ──────────────────────────────────────────────────────────
  function addFiles(incoming: FileList | null) {
    if (!incoming?.length) return;
    setNewFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      return [
        ...prev,
        ...Array.from(incoming).filter((f) => !existing.has(f.name + f.size)),
      ];
    });
    setFieldErrors((prev) => ({ ...prev, uploadFiles: '' }));
  }

  function removeNewFile(index: number) {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removeExistingFile(alias: string) {
    setExistingFiles((prev) => prev.filter((f) => f.alias !== alias));
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  function handleClose() {
    setFieldErrors({});
    setNewFiles([]);
    setExistingFiles(ticket?.files ?? []);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  }

  // ── RTK Query ─────────────────────────────────────────────────────────────
  const [updateSupportTicket, { isLoading: submitting }] =
    useUpdateSupportTicketsMutation();
  const loading = submitting || filesLoading;

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!ticket) return;

    if (!form.ticketType) {
      setFieldErrors((prev) => ({
        ...prev,
        ticketType: 'Please select a ticket type.',
      }));
      return;
    }

    const payload = new FormData();
    if (form.ticketType !== initialFormRef.current.ticketType) {
      payload.append('ticket_type', form.ticketType);
    }
    if (form.priority !== initialFormRef.current.priority) {
      payload.append('priority', form.priority);
    }
    if (form.subject.trim() !== initialFormRef.current.subject) {
      payload.append('subject', form.subject.trim());
    }
    if (form.description.trim() !== initialFormRef.current.description) {
      payload.append('description', form.description.trim());
    }

    // Backend replaces the whole file set on update, so re-send every
    // file the user still wants to keep, plus any newly added ones —
    // all under 'upload_files', which is the field the backend actually
    // reads on write (`files` in the GET response is output-only).

    existingFiles.forEach((f) => {
      const file = cachedExistingFiles[f.alias];
      if (file) payload.append('upload_files', file);
    });
    newFiles.forEach((file) => payload.append('upload_files', file));

    try {
      await updateSupportTicket({
        ticket_alias: ticket.alias,
        payload,
      }).unwrap();
      toast.success('Support ticket updated.');
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
        toast.error('Failed to update ticket. Please try again.');
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
        <DialogHeader className='shrink-0 border-b px-6 pt-6 pb-5'>
          <DialogTitle className='text-foreground text-xl font-bold'>
            Update Support Ticket
          </DialogTitle>
          <DialogDescription>
            Update the details of this support ticket.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='contents'>
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
                rows={4}
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

            {/* Attachments */}
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
                  'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors',
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

              {/* Existing files (still-kept, re-uploaded on save) */}
              {existingFiles.length > 0 && (
                <div className='space-y-2'>
                  <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                    Existing Attachments
                    {filesLoading && ' (preparing...)'}
                  </p>
                  <ul className='space-y-2'>
                    {existingFiles.map((f) => (
                      <li
                        key={f.alias}
                        className='bg-muted flex items-center justify-between rounded-md px-4 py-2.5'
                      >
                        <a
                          href={f.file}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='max-w-[80%] truncate text-sm underline'
                        >
                          {f.file.split('/').pop()}
                        </a>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          onClick={() => removeExistingFile(f.alias)}
                          className='text-muted-foreground hover:text-danger ml-2 h-6 w-6 shrink-0'
                          aria-label='Remove file'
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Newly added files pending upload */}
              {newFiles.length > 0 && (
                <div className='space-y-2'>
                  <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                    New Uploads
                  </p>
                  <ul className='space-y-2'>
                    {newFiles.map((f, index) => (
                      <li
                        key={`${f.name}-${f.size}-${index}`}
                        className='bg-muted flex items-center justify-between rounded-md px-4 py-2.5'
                      >
                        <Badge
                          variant='secondary'
                          className='max-w-[80%] truncate font-normal'
                        >
                          {f.name}
                        </Badge>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          onClick={() => removeNewFile(index)}
                          className='text-muted-foreground hover:text-danger ml-2 h-6 w-6 shrink-0'
                          aria-label={`Remove ${f.name}`}
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Field>
          </div>

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
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSupportTicketDialog;
