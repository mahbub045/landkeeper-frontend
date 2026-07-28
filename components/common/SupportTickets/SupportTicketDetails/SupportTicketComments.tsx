'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  useAddSupportTicketCommentMutation,
  useDeleteSupportTicketCommentMutation,
  useGetSupportTicketCommentsQuery,
  useUpdateSupportTicketCommentMutation,
} from '@/store/api/endpoints/common/SupportTickets/SupportTicketCommentsApi';
import { ApiSupportTicketComment } from '@/types/common/SupportTickets/SupportTicketTypes';
import { formatDate, getInitials } from '@/utils/formatters';
import {
  Download,
  FileText,
  Loader2,
  Paperclip,
  Pencil,
  Reply,
  Send,
  Trash,
  X,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import Loading from '../../CustomLoader/Loading';

interface SupportTicketCommentsProps {
  ticketAlias: string;
}

// ── File constraints ────────────────────────────────────────────────────────
const ACCEPTED_FILE_TYPES = 'image/*,video/*';
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
const MAX_FILE_SIZE_LABEL = '50MB';

function getFileName(url: string) {
  return url.split('/').pop() || 'Unknown file';
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Splits files into those within the size limit and those that exceed it,
// warning about any rejected files.
function filterFilesBySize(files: File[]): File[] {
  const validFiles: File[] = [];
  const oversizedFiles: File[] = [];

  files.forEach((file) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      oversizedFiles.push(file);
    } else {
      validFiles.push(file);
    }
  });

  if (oversizedFiles.length > 0) {
    const names = oversizedFiles
      .map((file) => `${file.name} (${formatFileSize(file.size)})`)
      .join(', ');
    toast.warning(
      `The following file(s) exceed the ${MAX_FILE_SIZE_LABEL} limit and were not added: ${names}`,
    );
  }

  return validFiles;
}

type CommentFile = ApiSupportTicketComment['files'][number];

const SupportTicketComments: React.FC<SupportTicketCommentsProps> = ({
  ticketAlias,
}) => {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replyFileInputRefs = useRef<Record<number, HTMLInputElement | null>>(
    {},
  );
  const [editFiles, setEditFiles] = useState<Record<string, File[]>>({});
  const editFileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const { data: comments, isLoading } = useGetSupportTicketCommentsQuery({
    ticket_alias: ticketAlias,
  });

  const [addComment, { isLoading: isCommentLoading }] =
    useAddSupportTicketCommentMutation();
  const [updateComment, { isLoading: isUpdateLoading }] =
    useUpdateSupportTicketCommentMutation();
  const [deleteComment, { isLoading: isDeleteLoading }] =
    useDeleteSupportTicketCommentMutation();

  // New top-level comment
  const [newComment, setNewComment] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Reply state, keyed by parent comment id
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState<Record<number, string>>({});
  const [replyFiles, setReplyFiles] = useState<Record<number, File[]>>({});
  const [replyLoadingId, setReplyLoadingId] = useState<number | null>(null);

  // Edit state, keyed by comment alias
  const [editingAlias, setEditingAlias] = useState<string | null>(null);
  const [editText, setEditText] = useState<Record<string, string>>({});

  // Existing files still "kept" for a comment being edited (re-uploaded on save,
  // since the backend replaces the whole file set on update — same pattern as
  // UpdateSupportTicketDialog).
  const [editExistingFiles, setEditExistingFiles] = useState<
    Record<string, CommentFile[]>
  >({});
  // Re-fetched blobs of those ORIGINAL files, turned back into File objects.
  const [editCachedFiles, setEditCachedFiles] = useState<
    Record<string, Record<string, File>>
  >({});
  const [editFilesLoading, setEditFilesLoading] = useState<
    Record<string, boolean>
  >({});

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Tracks file identifiers (alias) currently being downloaded, for per-file loading state
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(
    new Set(),
  );

  // ── Download an attachment (instead of opening it in a new tab) ────────────
  async function handleDownloadFile(
    url: string,
    filename: string,
    fileKey: string,
  ) {
    if (downloadingFiles.has(fileKey)) return; // already downloading

    setDownloadingFiles((prev) => new Set(prev).add(fileKey));
    try {
      // Routed through the same proxy used to prefetch files for editing,
      // so this works regardless of the storage host's CORS policy.
      const res = await fetch(
        `/api/fetch-remote-files?url=${encodeURIComponent(url)}`,
      );
      if (!res.ok) throw new Error(`Failed to fetch file (${res.status})`);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Failed to download file', err);
      toast.error('Failed to download file. Please try again.');
    } finally {
      setDownloadingFiles((prev) => {
        const next = new Set(prev);
        next.delete(fileKey);
        return next;
      });
    }
  }

  // ── Top-level comment submit ──────────────────────────────────────────────
  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.warning('Please enter a comment.');
      return;
    }

    const payload = new FormData();
    payload.append('message', newComment.trim());
    selectedFiles.forEach((file) => payload.append('upload_files', file));

    try {
      await addComment({ ticket_alias: ticketAlias, payload }).unwrap();
      setNewComment('');
      setSelectedFiles([]);
      toast.success('Comment added.');
    } catch {
      toast.error('Failed to add comment. Please try again.');
    }
  }

  // ── Reply submit ──────────────────────────────────────────────────────────
  async function handleSubmitReply(parentId: number) {
    const message = replyText[parentId];
    if (!message?.trim()) {
      toast.warning('Please enter a reply.');
      return;
    }

    const payload = new FormData();
    payload.append('message', message.trim());
    payload.append('parent', parentId.toString());
    (replyFiles[parentId] ?? []).forEach((file) =>
      payload.append('upload_files', file),
    );

    setReplyLoadingId(parentId);
    try {
      await addComment({ ticket_alias: ticketAlias, payload }).unwrap();
      setReplyText((prev) => ({ ...prev, [parentId]: '' }));
      setReplyFiles((prev) => ({ ...prev, [parentId]: [] }));
      setReplyTo(null);
      toast.success('Reply added.');
    } catch {
      toast.error('Failed to add reply. Please try again.');
    } finally {
      setReplyLoadingId(null);
    }
  }

  // ── Edit ──────────────────────────────────────────────────────────────────
  async function prefetchExistingFiles(alias: string, files: CommentFile[]) {
    setEditFilesLoading((prev) => ({ ...prev, [alias]: true }));
    try {
      const entries = await Promise.all(
        files.map(async (f) => {
          const res = await fetch(
            `/api/fetch-remote-files?url=${encodeURIComponent(f.file)}`,
          );
          if (!res.ok) {
            throw new Error(`Failed to fetch file ${f.alias} (${res.status})`);
          }
          const blob = await res.blob();
          const filename = f.file.split('/').pop() || `file-${f.alias}`;
          return [
            f.alias,
            new File([blob], filename, { type: blob.type }),
          ] as const;
        }),
      );
      setEditCachedFiles((prev) => ({
        ...prev,
        [alias]: Object.fromEntries(entries),
      }));
    } catch (err) {
      console.error('Failed to prefetch existing files', err);
      toast.error(
        'Could not load one or more existing files. Removing/keeping them may not work correctly.',
      );
    } finally {
      setEditFilesLoading((prev) => ({ ...prev, [alias]: false }));
    }
  }

  function startEdit(comment: ApiSupportTicketComment) {
    setEditingAlias(comment.alias);
    setEditText((prev) => ({ ...prev, [comment.alias]: comment.message }));
    setEditFiles((prev) => ({ ...prev, [comment.alias]: [] }));
    setEditExistingFiles((prev) => ({
      ...prev,
      [comment.alias]: comment.files,
    }));

    if (comment.files.length > 0) {
      prefetchExistingFiles(comment.alias, comment.files);
    }
  }

  function cancelEdit(alias: string) {
    setEditingAlias(null);
    setEditFiles((prev) => ({ ...prev, [alias]: [] }));
    setEditExistingFiles((prev) => ({ ...prev, [alias]: [] }));
    setEditCachedFiles((prev) => ({ ...prev, [alias]: {} }));
  }

  function removeExistingEditFile(alias: string, fileAlias: string) {
    setEditExistingFiles((prev) => ({
      ...prev,
      [alias]: (prev[alias] ?? []).filter((f) => f.alias !== fileAlias),
    }));
  }

  async function handleSaveEdit(alias: string) {
    const message = editText[alias];
    if (!message?.trim()) {
      toast.warning('Please enter a message.');
      return;
    }

    const payload = new FormData();
    payload.append('message', message.trim());

    // Re-send every existing file the user kept, using its prefetched blob...
    (editExistingFiles[alias] ?? []).forEach((f) => {
      const file = editCachedFiles[alias]?.[f.alias];
      if (file) payload.append('upload_files', file);
    });
    // ...plus any newly added files.
    (editFiles[alias] ?? []).forEach((file) =>
      payload.append('upload_files', file),
    );

    try {
      await updateComment({
        ticket_alias: ticketAlias,
        comment_alias: alias,
        payload,
      }).unwrap();
      setEditingAlias(null);
      setEditFiles((prev) => ({ ...prev, [alias]: [] }));
      setEditExistingFiles((prev) => ({ ...prev, [alias]: [] }));
      setEditCachedFiles((prev) => ({ ...prev, [alias]: {} }));
      toast.success('Comment updated.');
    } catch {
      toast.error('Failed to update comment. Please try again.');
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteComment({
        ticket_alias: ticketAlias,
        comment_alias: deleteTarget,
      }).unwrap();
      toast.success('Comment deleted.');
    } catch {
      toast.error('Failed to delete comment. Please try again.');
    } finally {
      setDeleteTarget(null);
    }
  }

  // ── Render a single comment/reply node ──────────────────────────────────────
  function renderNode(node: ApiSupportTicketComment, isReply = false) {
    const canModify =
      session?.user?.email === node.author.email ||
      session?.user?.role === 'ADMIN';
    const isEditingThis = editingAlias === node.alias;
    const editLoading = isUpdateLoading || !!editFilesLoading[node.alias];

    return (
      <div key={node.alias} className={isReply ? 'ml-4' : ''}>
        <div
          className={
            isReply
              ? 'border-primary bg-muted/40 mt-3 rounded-lg border-l-4 p-4'
              : ''
          }
        >
          <div className='flex items-start gap-3'>
            <Avatar className='size-10 shrink-0'>
              <AvatarImage
                src={node.author.profile_image || ''}
                alt={node.author.name}
              />
              <AvatarFallback className='text-xs font-bold'>
                {getInitials(node.author.name)}
              </AvatarFallback>
            </Avatar>

            <div className='min-w-0 flex-1'>
              <div className='flex items-center gap-2'>
                <span className='text-foreground text-sm font-semibold'>
                  {node.author.name}
                </span>
                <span className='text-muted-foreground text-xs'>
                  {formatDate(node.created_at)}
                </span>
              </div>

              {isEditingThis ? (
                <form
                  className='mt-2 space-y-2'
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveEdit(node.alias);
                  }}
                >
                  <Textarea
                    rows={3}
                    value={editText[node.alias] ?? ''}
                    disabled={editLoading}
                    onChange={(e) =>
                      setEditText((prev) => ({
                        ...prev,
                        [node.alias]: e.target.value,
                      }))
                    }
                  />

                  {(editExistingFiles[node.alias] ?? []).length > 0 && (
                    <div className='space-y-1'>
                      <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                        Existing Attachments
                        {editFilesLoading[node.alias] && ' (preparing...)'}
                      </p>
                      <div className='flex flex-wrap gap-2'>
                        {(editExistingFiles[node.alias] ?? []).map((f) => (
                          <div
                            key={f.alias}
                            className='bg-background flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1 text-xs'
                          >
                            <FileText className='text-primary size-3.5' />
                            {getFileName(f.file)}
                            <button
                              type='button'
                              disabled={editLoading}
                              onClick={() =>
                                removeExistingEditFile(node.alias, f.alias)
                              }
                              className='cursor-pointer'
                            >
                              <X className='hover:text-danger size-3.5' />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(editFiles[node.alias] ?? []).length > 0 && (
                    <div className='flex flex-wrap gap-2'>
                      {(editFiles[node.alias] ?? []).map((file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className='bg-background flex items-center gap-2 rounded-md border px-2 py-1 text-xs'
                        >
                          <FileText className='text-muted-foreground size-3.5' />
                          {file.name} ({formatFileSize(file.size)})
                          <button
                            type='button'
                            className='cursor-pointer'
                            onClick={() =>
                              setEditFiles((prev) => ({
                                ...prev,
                                [node.alias]: (prev[node.alias] ?? []).filter(
                                  (_, i) => i !== index,
                                ),
                              }))
                            }
                          >
                            <X className='hover:text-danger size-3.5' />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <input
                    ref={(el) => {
                      editFileInputRefs.current[node.alias] = el;
                    }}
                    type='file'
                    multiple
                    accept={ACCEPTED_FILE_TYPES}
                    disabled={editLoading}
                    onChange={(e) => {
                      const picked = filterFilesBySize(
                        Array.from(e.target.files ?? []),
                      );
                      setEditFiles((prev) => ({
                        ...prev,
                        [node.alias]: [...(prev[node.alias] ?? []), ...picked],
                      }));
                      e.target.value = '';
                    }}
                    className='hidden'
                  />

                  <div className='flex items-center gap-2'>
                    <button
                      type='button'
                      disabled={editLoading}
                      onClick={() =>
                        editFileInputRefs.current[node.alias]?.click()
                      }
                      className='border-border bg-background hover:bg-muted flex h-7 max-w-52 cursor-pointer items-center gap-2 rounded-lg border px-4 text-xs font-semibold disabled:opacity-50'
                    >
                      <Paperclip className='size-3.5' />
                      {(editFiles[node.alias] ?? []).length > 0
                        ? `${(editFiles[node.alias] ?? []).length} file${(editFiles[node.alias] ?? []).length > 1 ? 's' : ''} selected`
                        : 'Add files'}
                    </button>
                    <span className='text-muted-foreground text-xs'>
                      Images & videos, max {MAX_FILE_SIZE_LABEL} each
                    </span>
                  </div>
                  <div className='flex gap-2'>
                    <Button
                      type='submit'
                      size='sm'
                      disabled={editLoading || !editText[node.alias]?.trim()}
                    >
                      {isUpdateLoading && <Loading className='text-white!' />}
                      Save
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      className='cursor-pointer'
                      size='sm'
                      onClick={() => cancelEdit(node.alias)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <p className='text-foreground mt-1 text-sm whitespace-pre-wrap'>
                    {node.message}
                  </p>

                  {node.files.length > 0 && (
                    <div className='mt-2 flex flex-wrap gap-2'>
                      {node.files.map((f) => {
                        const isDownloading = downloadingFiles.has(f.alias);
                        return (
                          <button
                            key={f.alias}
                            type='button'
                            disabled={isDownloading}
                            onClick={() =>
                              handleDownloadFile(
                                f.file,
                                getFileName(f.file),
                                f.alias,
                              )
                            }
                            className='bg-background hover:bg-muted flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-xs disabled:opacity-70'
                          >
                            <FileText className='text-primary size-3.5' />
                            {getFileName(f.file)}
                            {isDownloading ? (
                              <Loader2 className='text-muted-foreground size-3.5 animate-spin' />
                            ) : (
                              <Download className='text-muted-foreground size-3.5' />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className='mt-2 flex items-center gap-4'>
                    {!isReply && (
                      <button
                        type='button'
                        className='text-primary flex cursor-pointer items-center gap-1 text-xs font-medium hover:underline'
                        onClick={() =>
                          setReplyTo(replyTo === node.id ? null : node.id)
                        }
                      >
                        <Reply className='size-3.5' />
                        Reply
                      </button>
                    )}
                    {canModify && (
                      <>
                        <button
                          type='button'
                          className='flex cursor-pointer items-center gap-1 text-xs font-medium text-amber-600 hover:underline'
                          onClick={() => startEdit(node)}
                        >
                          <Pencil className='size-3.5' />
                          Edit
                        </button>
                        <button
                          type='button'
                          className='text-danger flex cursor-pointer items-center gap-1 text-xs font-medium hover:underline'
                          onClick={() => setDeleteTarget(node.alias)}
                        >
                          <Trash className='size-3.5' />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}

              {/* Reply input, only for top-level comments */}
              {!isReply && replyTo === node.id && (
                <div className='bg-muted/40 mt-3 space-y-2 rounded-lg p-3'>
                  <Textarea
                    rows={2}
                    placeholder='Write a reply...'
                    value={replyText[node.id] ?? ''}
                    disabled={replyLoadingId === node.id}
                    onChange={(e) =>
                      setReplyText((prev) => ({
                        ...prev,
                        [node.id]: e.target.value,
                      }))
                    }
                  />

                  {(replyFiles[node.id] ?? []).length > 0 && (
                    <div className='flex flex-wrap gap-2'>
                      {(replyFiles[node.id] ?? []).map((file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className='bg-background flex items-center gap-2 rounded-md border px-2 py-1 text-xs'
                        >
                          <FileText className='text-muted-foreground size-3.5' />
                          {file.name} ({formatFileSize(file.size)})
                          <button
                            type='button'
                            className='cursor-pointer'
                            onClick={() =>
                              setReplyFiles((prev) => ({
                                ...prev,
                                [node.id]: (prev[node.id] ?? []).filter(
                                  (_, i) => i !== index,
                                ),
                              }))
                            }
                          >
                            <X className='hover:text-danger size-3.5' />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className='flex items-start gap-3'>
                    <input
                      ref={(el) => {
                        replyFileInputRefs.current[node.id] = el;
                      }}
                      type='file'
                      multiple
                      accept={ACCEPTED_FILE_TYPES}
                      disabled={replyLoadingId === node.id}
                      onChange={(e) => {
                        const picked = filterFilesBySize(
                          Array.from(e.target.files ?? []),
                        );
                        setReplyFiles((prev) => ({
                          ...prev,
                          [node.id]: [...(prev[node.id] ?? []), ...picked],
                        }));
                        e.target.value = '';
                      }}
                      className='hidden'
                    />

                    <div className='flex flex-col gap-1'>
                      <button
                        type='button'
                        disabled={replyLoadingId === node.id}
                        onClick={() =>
                          replyFileInputRefs.current[node.id]?.click()
                        }
                        className='border-border bg-background hover:bg-muted flex h-7 max-w-52 cursor-pointer items-center gap-2 rounded-lg border px-4 text-xs font-semibold disabled:opacity-50'
                      >
                        <Paperclip className='size-3.5' />
                        {(replyFiles[node.id] ?? []).length > 0
                          ? `${(replyFiles[node.id] ?? []).length} file${(replyFiles[node.id] ?? []).length > 1 ? 's' : ''} selected`
                          : 'Choose files'}
                      </button>
                      <span className='text-muted-foreground text-xs'>
                        Images & videos, max {MAX_FILE_SIZE_LABEL} each
                      </span>
                    </div>

                    <Button
                      size='sm'
                      disabled={
                        replyLoadingId === node.id ||
                        !replyText[node.id]?.trim()
                      }
                      onClick={() => handleSubmitReply(node.id)}
                    >
                      {replyLoadingId === node.id ? (
                        <Loading className='text-white!' />
                      ) : (
                        <Send />
                      )}
                      Send
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        setReplyTo(null);
                        setReplyText((prev) => ({ ...prev, [node.id]: '' }));
                        setReplyFiles((prev) => ({ ...prev, [node.id]: [] }));
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {node.replies?.length > 0 && (
          <div>{node.replies.map((reply) => renderNode(reply, true))}</div>
        )}
      </div>
    );
  }

  return (
    <Card className='border-border rounded-2xl shadow-sm'>
      <CardContent className='space-y-6 p-6'>
        <h2 className='text-foreground text-base font-semibold'>Comments</h2>

        {/* New comment box */}
        <form
          onSubmit={handleSubmitComment}
          className='border-border rounded-xl border p-4'
        >
          <div className='flex items-start gap-3'>
            <Avatar className='size-10 shrink-0'>
              <AvatarFallback className='text-xs font-bold'>
                {session?.user?.email
                  ? session.user.email.charAt(0).toUpperCase()
                  : 'U'}
              </AvatarFallback>
            </Avatar>

            <div className='flex-1 space-y-2'>
              <Textarea
                rows={3}
                placeholder='Write a comment...'
                value={newComment}
                disabled={isCommentLoading}
                onChange={(e) => setNewComment(e.target.value)}
              />

              {selectedFiles.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {selectedFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className='bg-muted flex items-center gap-2 rounded-md border px-2 py-1 text-xs'
                    >
                      <FileText className='text-muted-foreground size-3.5' />
                      {file.name} ({formatFileSize(file.size)})
                      <button
                        type='button'
                        className='cursor-pointer'
                        onClick={() =>
                          setSelectedFiles((prev) =>
                            prev.filter((_, i) => i !== index),
                          )
                        }
                      >
                        <X className='hover:text-danger size-3.5' />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className='flex items-start gap-3'>
                <input
                  ref={fileInputRef}
                  type='file'
                  multiple
                  accept={ACCEPTED_FILE_TYPES}
                  disabled={isCommentLoading}
                  onChange={(e) => {
                    const picked = filterFilesBySize(
                      Array.from(e.target.files ?? []),
                    );
                    setSelectedFiles((prev) => [...prev, ...picked]);
                    e.target.value = '';
                  }}
                  className='hidden'
                />

                <div className='flex flex-col gap-1'>
                  <button
                    type='button'
                    disabled={isCommentLoading}
                    onClick={() => fileInputRef.current?.click()}
                    className='border-border bg-background hover:bg-muted flex h-8 max-w-60 cursor-pointer items-center gap-2 rounded-lg border px-4 text-xs font-semibold disabled:opacity-50'
                  >
                    <Paperclip className='size-3.5' />
                    {selectedFiles.length > 0
                      ? `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected`
                      : 'Choose files'}
                  </button>
                  <span className='text-muted-foreground text-xs'>
                    Images & videos, max {MAX_FILE_SIZE_LABEL} each
                  </span>
                </div>

                <Button
                  type='submit'
                  disabled={isCommentLoading || !newComment.trim()}
                >
                  {isCommentLoading ? (
                    <Loading className='text-white!' />
                  ) : (
                    <Send />
                  )}
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </form>

        {/* Comments list */}
        {isLoading ? (
          <p className='text-muted-foreground text-sm'>Loading comments...</p>
        ) : comments && comments.length > 0 ? (
          <div className='space-y-4'>
            {comments
              .filter((c) => c.parent === null)
              .map((comment) => (
                <Card
                  key={comment.alias}
                  className='border-border p-4 shadow-none'
                >
                  {renderNode(comment)}
                </Card>
              ))}
          </div>
        ) : (
          <p className='text-muted-foreground py-6 text-center text-sm'>
            No comments yet. Be the first to comment!
          </p>
        )}
      </CardContent>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleteLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleteLoading}
              className='bg-danger hover:bg-danger/90'
            >
              {isDeleteLoading && <Loading />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default SupportTicketComments;
