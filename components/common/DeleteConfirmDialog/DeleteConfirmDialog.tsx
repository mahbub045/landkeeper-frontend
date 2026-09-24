'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { DeleteConfirmDialogProps } from '@/types/common/DeleteConfirmDialog/DeleteConfirmDialogTypes';
import { AlertTriangle, CheckCircle2, Trash2 } from 'lucide-react';
import { useState } from 'react';

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  isLoading = false,
  confirmDisabled = false,
  title,
  description = 'This action is permanent and cannot be undone.',
  icon: HeaderIcon = Trash2,
  targetLabel,
  targetName,
  targetSubtext,
  targetIcon: TargetIcon,
  targetMedia,
  badge = 'Permanent',
  impactTitle = 'What will be removed',
  impactItems,
  impactNote,
  error,
  confirmText,
  cancelLabel = 'Cancel',
  confirmLabel,
}) => {
  const [typedText, setTypedText] = useState('');
  const [prevOpen, setPrevOpen] = useState(open);

  // Reset the typed confirmation each time the dialog opens
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setTypedText('');
  }

  const hasTarget = Boolean(targetName);
  const hasImpact = Boolean(impactItems?.length || impactNote);
  const isConfirmTextMatched =
    !confirmText || typedText.trim() === confirmText.trim();
  const canConfirm = !isLoading && !confirmDisabled && isConfirmTextMatched;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !isLoading && onClose()}>
      <DialogContent className='grid-cols-[minmax(0,1fr)] gap-0 overflow-hidden rounded-3xl border border-red-500/20 p-0 shadow-2xl shadow-red-950/20 sm:max-w-md'>
        {/* Header */}
        <DialogHeader className='relative flex flex-col items-center overflow-hidden px-6 pt-8 pb-6'>
          {/* Glow backdrop */}
          <div className='pointer-events-none absolute -top-24 left-1/2 h-56 w-72 -translate-x-1/2 rounded-full bg-red-500/20 blur-3xl' />
          <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.08)_1px,transparent_1px)] mask-[linear-gradient(to_bottom,black,transparent)] bg-size-[14px_14px]' />

          {/* Icon with pulse rings */}
          <div className='relative mb-5 flex h-20 w-20 items-center justify-center'>
            <span className='animation-duration-[2s] absolute inset-0 animate-ping rounded-full bg-red-500/20' />
            <span className='absolute inset-2 rounded-full bg-red-500/15 ring-1 ring-red-500/30' />
            <div className='relative flex h-14 w-14 rotate-45 items-center justify-center rounded-2xl bg-linear-to-br from-red-500 to-rose-700 shadow-lg shadow-red-600/40'>
              <HeaderIcon className='h-6 w-6 -rotate-45 text-white' />
            </div>
          </div>

          <DialogTitle className='relative text-center text-2xl font-bold tracking-tight'>
            {title}
          </DialogTitle>

          <DialogDescription className='relative mt-2 flex items-center justify-center gap-1.5 text-center text-sm'>
            <AlertTriangle className='h-3.5 w-3.5 shrink-0 text-red-500' />
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        {(hasTarget || hasImpact || confirmText || error) && (
          <div className='space-y-4 px-6 pb-6'>
            {/* Target ticket */}
            {hasTarget && (
              <div className='relative flex items-center gap-4 overflow-hidden rounded-2xl border border-red-500/25 bg-linear-to-r from-red-500/10 via-red-500/5 to-transparent p-4'>
                {targetMedia ??
                  (TargetIcon && (
                    <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/15 ring-1 ring-red-500/30'>
                      <TargetIcon className='h-6 w-6 text-red-500' />
                    </div>
                  ))}
                <div className='min-w-0 flex-1'>
                  {targetLabel && (
                    <p className='text-muted-foreground text-[11px] font-medium tracking-widest uppercase'>
                      {targetLabel}
                    </p>
                  )}
                  <p className='truncate text-lg font-semibold text-red-600 dark:text-red-400'>
                    {targetName}
                  </p>
                  {targetSubtext && (
                    <p className='text-muted-foreground truncate text-xs'>
                      {targetSubtext}
                    </p>
                  )}
                </div>
                {badge && (
                  <span className='shrink-0 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-red-600 uppercase dark:text-red-400'>
                    {badge}
                  </span>
                )}
              </div>
            )}

            {/* Impact */}
            {hasImpact && (
              <div className='rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4'>
                <p className='mb-3 text-xs font-semibold tracking-wider text-amber-700 uppercase dark:text-amber-400'>
                  {impactTitle}
                </p>
                {impactItems && impactItems.length > 0 && (
                  <ul className='flex gap-2'>
                    {impactItems.map(({ icon: Icon, label }) => (
                      <li
                        key={label}
                        className='bg-background/60 flex flex-1 flex-col items-center gap-1.5 rounded-xl border border-amber-500/15 px-2 py-3 text-center'
                      >
                        <Icon className='h-5 w-5 text-amber-600 dark:text-amber-400' />
                        <span className='text-xs font-medium'>{label}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {impactNote && (
                  <p
                    className={`text-sm leading-6 text-amber-800 dark:text-amber-200/90 ${impactItems?.length ? 'mt-3' : ''}`}
                  >
                    {impactNote}
                  </p>
                )}
              </div>
            )}

            {/* Type-to-confirm */}
            {confirmText && (
              <div className='space-y-2'>
                <label
                  htmlFor='delete-confirm-input'
                  className='text-muted-foreground block text-sm'
                >
                  Type{' '}
                  <span className='text-foreground rounded-md bg-red-500/10 px-1.5 py-0.5 font-mono text-[13px] font-semibold select-all'>
                    {confirmText}
                  </span>{' '}
                  to confirm
                </label>
                <div className='relative'>
                  <Input
                    type='text'
                    id='delete-confirm-input'
                    value={typedText}
                    onChange={(e) => setTypedText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && canConfirm) onConfirm();
                    }}
                    placeholder='Type to confirm'
                    autoComplete='off'
                    spellCheck={false}
                    disabled={isLoading}
                    aria-invalid={typedText.length > 0 && !isConfirmTextMatched}
                    className={`border-danger! h-11 rounded-xl pr-10 transition-colors focus:ring-0! ${
                      isConfirmTextMatched
                        ? 'border-red-500 focus-visible:ring-red-500/30'
                        : ''
                    }`}
                  />
                  {isConfirmTextMatched && (
                    <CheckCircle2 className='absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-red-500' />
                  )}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className='flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400'>
                <AlertTriangle className='mt-0.5 h-4 w-4 shrink-0' />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className='bg-muted/30 flex justify-end gap-3 border-t px-6 py-4'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={isLoading}
            className='min-w-24 rounded-xl'
          >
            {cancelLabel}
          </Button>

          <Button
            type='button'
            onClick={onConfirm}
            disabled={!canConfirm}
            className='group min-w-40 rounded-xl bg-linear-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30 transition-all hover:from-red-500 hover:to-rose-500 hover:shadow-red-600/50'
          >
            {isLoading ? (
              <Loading className='mr-2 text-white!' />
            ) : (
              <HeaderIcon className='h-4 w-4 transition-transform group-hover:-rotate-12' />
            )}
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
