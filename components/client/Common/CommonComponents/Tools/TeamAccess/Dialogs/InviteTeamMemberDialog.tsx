'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { EMPTY_FORM } from '@/data/client/common/tools/teamAccess/TeamAccessData';
import { RoleOptions } from '@/data/common/RoleOptions';
import { useInviteTeamMemberMutation } from '@/store/api/endpoints/client/Common/Tools/TeamAccess/TeamAccessApi';
import {
  ApiError,
  FormErrors,
  InviteTeamMemberForm,
  InviteTeamMemberModalProps,
} from '@/types/client/Common/Tools/TeamAccess/TeamAccessTypes';
import { useState } from 'react';
import { toast } from 'sonner';

const InviteTeamMemberDialog: React.FC<InviteTeamMemberModalProps> = ({
  open,
  onClose,
}) => {
  const [form, setForm] = useState<InviteTeamMemberForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [nonFieldError, setNonFieldError] = useState<string>('');

  const [inviteTeamMember, { isLoading }] = useInviteTeamMemberMutation();

  function set<K extends keyof InviteTeamMemberForm>(
    key: K,
    value: InviteTeamMemberForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));

    setErrors((prev) => ({
      ...prev,
      [key]: '',
    }));
  }

  // ── Reset ───────────────────────────────────────────────────────────────────
  function handleClose() {
    setForm(EMPTY_FORM);
    setErrors({});
    setNonFieldError('');
    onClose();
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    try {
      setErrors({});
      setNonFieldError('');

      const response = await inviteTeamMember(form).unwrap();

      toast.success(response?.message || 'Invitation sent successfully!');
      handleClose();
    } catch (err: unknown) {
      const error = err as ApiError;

      console.log(error);

      if (error.data && typeof error.data === 'object') {
        const fieldErrors: FormErrors = {};
        const knownFields = Object.keys(EMPTY_FORM);

        Object.entries(error.data).forEach(([key, value]) => {
          if (key === 'message') return;

          const isNonFieldKey =
            key === 'non_field_errors' ||
            key === 'nonFieldErrors' ||
            key === 'detail' ||
            key === 'error' ||
            !knownFields.includes(key);

          const message = Array.isArray(value) ? String(value[0]) : value;

          if (isNonFieldKey && typeof message === 'string') {
            setNonFieldError((prev) => prev || message);
            return;
          }

          if (Array.isArray(value)) {
            fieldErrors[key as keyof InviteTeamMemberForm] = String(value[0]);
          } else if (typeof value === 'string') {
            fieldErrors[key as keyof InviteTeamMemberForm] = value;
          }
        });

        setErrors(fieldErrors);

        if (error.data.message) {
          toast.error(error.data.message);
        }

        return;
      }

      const fallbackMessage = error.error ?? 'Failed to invite team member.';
      setNonFieldError(fallbackMessage);
      toast.error(fallbackMessage);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className='flex max-h-[90vh] w-full flex-col overflow-hidden p-0 sm:max-w-135'>
        {/* Header */}
        <DialogHeader className='shrink-0 border-b px-6 pt-6 pb-5'>
          <DialogTitle className='text-foreground text-xl font-bold'>
            Invite Team Member
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable body */}
        <form
          className='flex-1 space-y-5 overflow-y-auto px-6 py-5'
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          id='invite-team-member-form'
        >
          {/* Non-field error */}
          {nonFieldError && (
            <div className='bg-danger/10 border-danger/30 text-danger rounded-md border px-3 py-2 text-sm'>
              {nonFieldError}
            </div>
          )}

          {/* Email Address */}
          <Field>
            <FieldLabel className='text-sm font-semibold'>
              Email Address<span className='text-danger'>*</span>
            </FieldLabel>
            <Input
              type='email'
              placeholder='colleague@email.com'
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              required
            />
            {errors.email && (
              <p className='mt-1 text-sm text-red-500'>{errors.email}</p>
            )}
          </Field>

          {/* Role */}
          <Field>
            <FieldLabel className='text-sm font-semibold'>
              Role<span className='text-danger'>*</span>
            </FieldLabel>
            <Select
              value={form.role}
              onValueChange={(v) => set('role', v)}
              required
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RoleOptions.map((role, idx) => (
                  <SelectItem key={idx} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className='mt-1 text-sm text-red-500'>{errors.role}</p>
            )}
          </Field>

          {/* Message */}
          <Field>
            <FieldLabel className='text-sm font-semibold'>
              Message (Optional)
            </FieldLabel>
            <Textarea
              placeholder='Personal message...'
              rows={4}
              value={form.message}
              onChange={(e) => set('message', e.target.value)}
            />
            {errors.message && (
              <p className='mt-1 text-sm text-red-500'>{errors.message}</p>
            )}
          </Field>
        </form>

        {/* Footer */}
        <div className='flex shrink-0 items-center justify-end gap-3 border-t px-6 py-4'>
          <Button variant='outline' onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type='submit'
            form='invite-team-member-form'
            disabled={isLoading}
          >
            {isLoading && <Loading className='text-white!' />}
            Send Invitation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteTeamMemberDialog;