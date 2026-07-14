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

interface SupportTicketCommentsProps {
  ticketAlias: string;
}

function getFileName(url: string) {
  return url.split('/').pop() || 'Unknown file';
}

const SupportTicketComments: React.FC<SupportTicketCommentsProps> = ({
  ticketAlias,
}) => {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

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
  function startEdit(comment: ApiSupportTicketComment) {
    setEditingAlias(comment.alias);
    setEditText((prev) => ({ ...prev, [comment.alias]: comment.message }));
  }

  async function handleSaveEdit(alias: string) {
    const message = editText[alias];
    if (!message?.trim()) {
      toast.warning('Please enter a message.');
      return;
    }

    try {
      await updateComment({
        ticket_alias: ticketAlias,
        comment_alias: alias,
        payload: { message: message.trim() },
      }).unwrap();
      setEditingAlias(null);
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

              {editingAlias === node.alias ? (
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
                    disabled={isUpdateLoading}
                    onChange={(e) =>
                      setEditText((prev) => ({
                        ...prev,
                        [node.alias]: e.target.value,
                      }))
                    }
                  />
                  <div className='flex gap-2'>
                    <Button
                      type='submit'
                      size='sm'
                      disabled={
                        isUpdateLoading || !editText[node.alias]?.trim()
                      }
                    >
                      {isUpdateLoading && <Loader2 className='animate-spin' />}
                      Save
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => setEditingAlias(null)}
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
                      {node.files.map((f) => (
                        <a
                          key={f.alias}
                          href={f.file}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='bg-background hover:bg-muted flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs'
                        >
                          <FileText className='text-primary size-3.5' />
                          {getFileName(f.file)}
                        </a>
                      ))}
                    </div>
                  )}

                  <div className='mt-2 flex items-center gap-4'>
                    {!isReply && (
                      <button
                        type='button'
                        className='text-primary flex items-center gap-1 text-xs font-medium hover:underline'
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
                          className='flex items-center gap-1 text-xs font-medium text-amber-600 hover:underline'
                          onClick={() => startEdit(node)}
                        >
                          <Pencil className='size-3.5' />
                          Edit
                        </button>
                        <button
                          type='button'
                          className='text-danger flex items-center gap-1 text-xs font-medium hover:underline'
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
                          {file.name}
                          <button
                            type='button'
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

                  <div className='flex items-center gap-2'>
                    <input
                      type='file'
                      multiple
                      accept='image/*,.pdf,.doc,.docx'
                      disabled={replyLoadingId === node.id}
                      onChange={(e) =>
                        setReplyFiles((prev) => ({
                          ...prev,
                          [node.id]: [
                            ...(prev[node.id] ?? []),
                            ...Array.from(e.target.files ?? []),
                          ],
                        }))
                      }
                      className='text-muted-foreground max-w-52 text-xs'
                    />
                    <Button
                      size='sm'
                      disabled={
                        replyLoadingId === node.id ||
                        !replyText[node.id]?.trim()
                      }
                      onClick={() => handleSubmitReply(node.id)}
                    >
                      {replyLoadingId === node.id ? (
                        <Loader2 className='animate-spin' />
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
          className='border-primary rounded-xl border p-4'
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
                      {file.name}
                      <button
                        type='button'
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

              <div className='flex items-center gap-3'>
                <input
                  ref={fileInputRef}
                  type='file'
                  multiple
                  accept='image/*,.pdf,.doc,.docx'
                  disabled={isCommentLoading}
                  onChange={(e) =>
                    setSelectedFiles((prev) => [
                      ...prev,
                      ...Array.from(e.target.files ?? []),
                    ])
                  }
                  className='hidden'
                />

                <button
                  type='button'
                  disabled={isCommentLoading}
                  onClick={() => fileInputRef.current?.click()}
                  className='border-border bg-background hover:bg-muted flex h-10 max-w-60 items-center gap-2 rounded-lg border px-4 text-xs font-semibold disabled:opacity-50'
                >
                  <Paperclip className='size-3.5' />
                  {selectedFiles.length > 0
                    ? `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected`
                    : 'Choose files'}
                </button>

                <Button
                  type='submit'
                  disabled={isCommentLoading || !newComment.trim()}
                >
                  {isCommentLoading ? (
                    <Loader2 className='animate-spin' />
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
              {isDeleteLoading && <Loader2 className='animate-spin' />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default SupportTicketComments;
