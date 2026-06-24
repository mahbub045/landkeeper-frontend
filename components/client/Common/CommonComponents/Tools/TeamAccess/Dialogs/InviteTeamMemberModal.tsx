'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
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
  ACCESS_DURATIONS,
  ACCESS_LEVEL_OPTIONS,
  EMPTY_FORM,
  ROLES,
} from '@/data/client/common/tools/teamAccess/TeamAccessData';
import {
  AccessLevelKey,
  InviteTeamMemberForm,
  InviteTeamMemberModalProps,
} from '@/types/client/Common/Tools/TeamAccess/TeamAccessTypes';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';

// ── Validation ───────────────────────────────────────────────────────────────

function validate(form: InviteTeamMemberForm): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.email.trim()) errors.email = 'Email address is required.';
  else if (!/^\S+@\S+\.\S+$/.test(form.email))
    errors.email = 'Enter a valid email address.';

  if (!form.role) errors.role = 'Please select a role.';

  return errors;
}

// ── Modal ─────────────────────────────────────────────────────────────────────

const InviteTeamMemberDialog: React.FC<InviteTeamMemberModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<InviteTeamMemberForm>(EMPTY_FORM);

  function set<K extends keyof InviteTeamMemberForm>(
    key: K,
    value: InviteTeamMemberForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleAccess(key: AccessLevelKey, checked: boolean) {
    setForm((prev) => ({
      ...prev,
      accessLevel: { ...prev.accessLevel, [key]: checked },
    }));
  }

  // ── Reset ───────────────────────────────────────────────────────────────────
  function handleClose() {
    setFieldErrors({});
    setLoading(false);
    setForm(EMPTY_FORM);
    onClose();
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    const errors = validate(form);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    // RTK Query mutation goes here
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
        <div className='flex-1 space-y-5 overflow-y-auto px-6 py-5'>
          {/* Email Address */}
          <Field data-invalid={!!fieldErrors.email}>
            <FieldLabel className='text-sm font-semibold'>
              Email Address
            </FieldLabel>
            <Input
              type='email'
              placeholder='colleague@email.com'
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              aria-invalid={!!fieldErrors.email}
              className={
                fieldErrors.email
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: fieldErrors.email }]} />
          </Field>

          {/* Role */}
          <Field data-invalid={!!fieldErrors.role}>
            <FieldLabel className='text-sm font-semibold'>Role</FieldLabel>
            <Select value={form.role} onValueChange={(v) => set('role', v)}>
              <SelectTrigger
                className={fieldErrors.role ? 'border-danger' : ''}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[{ message: fieldErrors.role }]} />
          </Field>

          {/* Access Level */}
          <Field data-invalid={!!fieldErrors.accessLevel}>
            <FieldLabel className='text-sm font-semibold'>
              Access Level
            </FieldLabel>
            <div className='space-y-3 pt-1'>
              {ACCESS_LEVEL_OPTIONS.map(({ key, label }) => (
                <label key={key} className='flex items-center gap-2.5 text-sm'>
                  <Checkbox
                    checked={form.accessLevel[key]}
                    onCheckedChange={(checked) =>
                      toggleAccess(key, checked === true)
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
            <FieldError errors={[{ message: fieldErrors.accessLevel }]} />
          </Field>

          {/* Access Duration */}
          <Field data-invalid={!!fieldErrors.accessDuration}>
            <FieldLabel className='text-sm font-semibold'>
              Access Duration
            </FieldLabel>
            <Select
              value={form.accessDuration}
              onValueChange={(v) => set('accessDuration', v)}
            >
              <SelectTrigger
                className={fieldErrors.accessDuration ? 'border-danger' : ''}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACCESS_DURATIONS.map((duration) => (
                  <SelectItem key={duration} value={duration}>
                    {duration}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[{ message: fieldErrors.accessDuration }]} />
          </Field>

          {/* Message */}
          <Field data-invalid={!!fieldErrors.message}>
            <FieldLabel className='text-sm font-semibold'>
              Message (Optional)
            </FieldLabel>
            <Textarea
              placeholder='Personal message...'
              rows={4}
              value={form.message}
              onChange={(e) => set('message', e.target.value)}
              aria-invalid={!!fieldErrors.message}
              className={
                fieldErrors.message
                  ? 'border-danger focus-visible:ring-danger/50'
                  : ''
              }
            />
            <FieldError errors={[{ message: fieldErrors.message }]} />
          </Field>
        </div>

        {/* Footer */}
        <div className='flex shrink-0 items-center justify-end gap-3 border-t px-6 py-4'>
          <Button variant='outline' onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Send Invitation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteTeamMemberDialog;
