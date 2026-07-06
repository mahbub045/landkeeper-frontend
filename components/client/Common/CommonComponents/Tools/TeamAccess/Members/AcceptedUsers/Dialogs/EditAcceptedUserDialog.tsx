import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RoleOptions } from '@/data/common/RoleOptions';
import { TitleOptions } from '@/data/common/TitleOptions';
import { useEditAcceptedUserMutation } from '@/store/api/endpoints/client/Common/Tools/TeamAccess/TeamAccessApi';
import {
  EditAcceptedUserDialogProps,
  FormState,
} from '@/types/client/Common/Tools/TeamAccess/AcceptedUserTypes';
import { formatChoiceFieldValue } from '@/utils/formatters';
import { AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

const emptyForm: FormState = {
  title: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  phone: '',
  role: '',
  is_active: true,
};

// Shape we expect back from DRF-style validation errors, e.g.:
// { user: { first_name: ["This field is required."] }, role: ["Invalid role"], non_field_errors: ["..."] }
type ApiFieldErrors = {
  user?: Record<string, string[] | string>;
  [key: string]: unknown;
};

const KNOWN_USER_FIELDS = [
  'title',
  'first_name',
  'middle_name',
  'last_name',
  'phone',
  'is_active',
];
const KNOWN_TOP_FIELDS = ['role'];

const toMessage = (value?: string[] | string) => {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
};

const EditAcceptedUserDialog: React.FC<EditAcceptedUserDialogProps> = ({
  isOpen,
  onClose,
  member,
}) => {
  const [editAcceptedUser, { isLoading }] = useEditAcceptedUserMutation();

  const [initialForm, setInitialForm] = useState<FormState>(emptyForm);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [apiErrors, setApiErrors] = useState<ApiFieldErrors | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Track what we last synced from, so we only reset when the dialog
  // freshly opens or a different member is being edited.
  const [syncedKey, setSyncedKey] = useState<string | null>(null);
  const currentKey = isOpen ? (member?.user?.alias ?? '') : null;

  if (isOpen && currentKey !== syncedKey) {
    const next: FormState = {
      title: member?.user?.title ?? '',
      first_name: member?.user?.first_name ?? '',
      middle_name: member?.user?.middle_name ?? '',
      last_name: member?.user?.last_name ?? '',
      phone: member?.user?.phone ?? '',
      is_active: member?.user.is_active ?? true,
      role: member?.role ?? '',
    };
    setForm(next);
    setInitialForm(next);
    setSyncedKey(currentKey);
    setApiErrors(null);
    setGeneralError(null);
  }

  const hasChanged = JSON.stringify(form) !== JSON.stringify(initialForm);

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Field-level error getters
  const getUserFieldError = (key: string) =>
    toMessage(apiErrors?.user?.[key]);
  const getTopFieldError = (key: string) =>
    toMessage(apiErrors?.[key] as string[] | string | undefined);

  // Anything the API returned that we didn't render next to a specific field
  // (e.g. non_field_errors, detail, or a shape we don't recognize)
  const unmatchedErrors: string[] = (() => {
    if (!apiErrors) return [];
    const messages: string[] = [];

    Object.entries(apiErrors).forEach(([key, value]) => {
      if (key === 'user') {
        const userErrors = value as
          | Record<string, string[] | string>
          | undefined;
        if (userErrors) {
          Object.entries(userErrors).forEach(([userKey, userValue]) => {
            if (!KNOWN_USER_FIELDS.includes(userKey)) {
              const msg = toMessage(userValue);
              if (msg) messages.push(msg);
            }
          });
        }
        return;
      }
      if (!KNOWN_TOP_FIELDS.includes(key)) {
        const msg = toMessage(value as string[] | string);
        if (msg) messages.push(msg);
      }
    });

    return messages;
  })();

  // Only show the generic banner for errors that aren't already shown inline
  // next to a specific field.
  const isError = Boolean(generalError) || unmatchedErrors.length > 0;

  const handleSubmit = async () => {
    if (!hasChanged) {
      onClose();
      return;
    }
    setApiErrors(null);
    setGeneralError(null);

    const payload = {
      user: {
        title: form.title,
        first_name: form.first_name,
        middle_name: form.middle_name,
        last_name: form.last_name,
        phone: form.phone,
        is_active: form.is_active,
      },
      role: form.role,
    };
    try {
      await editAcceptedUser({
        alias: member?.user?.alias,
        body: payload,
      }).unwrap();
      toast.success('Team member updated');
      onClose();
    } catch (err: unknown) {
      const data = (err as { data?: ApiFieldErrors })?.data;
      if (data && typeof data === 'object') {
        setApiErrors(data);
      } else {
        setGeneralError('Failed to update member. Please try again.');
      }
      toast.error('Failed to update member. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Edit Team Member</DialogTitle>
          <DialogDescription>
            Update this member&apos;s details and role.
          </DialogDescription>
        </DialogHeader>

        <form
          className='space-y-4'
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className='grid grid-cols-3 gap-3'>
            <div className='space-y-2'>
              <Label htmlFor='title'>
                Title <span className='text-danger'>*</span>
              </Label>
              <Select
                value={form.title}
                onValueChange={(v) => updateField('title', v)}
                required
              >
                <SelectTrigger id='title'>
                  <SelectValue placeholder='Title'>
                    {formatChoiceFieldValue(form.title)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {TitleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getUserFieldError('title') && (
                <p className='text-danger text-xs'>
                  {getUserFieldError('title')}
                </p>
              )}
            </div>

            <div className='col-span-2 space-y-2'>
              <Label htmlFor='first_name'>
                First name <span className='text-danger'>*</span>
              </Label>
              <Input
                id='first_name'
                type='text'
                required
                value={form.first_name}
                onChange={(e) => updateField('first_name', e.target.value)}
                placeholder='First name'
              />
              {getUserFieldError('first_name') && (
                <p className='text-danger text-xs'>
                  {getUserFieldError('first_name')}
                </p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-2'>
              <Label htmlFor='middle_name'>Middle name</Label>
              <Input
                id='middle_name'
                type='text'
                value={form.middle_name}
                onChange={(e) => updateField('middle_name', e.target.value)}
                placeholder='Middle name (optional)'
              />
              {getUserFieldError('middle_name') && (
                <p className='text-danger text-xs'>
                  {getUserFieldError('middle_name')}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='last_name'>
                Last name <span className='text-danger'>*</span>
              </Label>
              <Input
                id='last_name'
                type='text'
                required
                value={form.last_name}
                onChange={(e) => updateField('last_name', e.target.value)}
                placeholder='Last name'
              />
              {getUserFieldError('last_name') && (
                <p className='text-danger text-xs'>
                  {getUserFieldError('last_name')}
                </p>
              )}
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='phone'>
              Phone <span className='text-danger'>*</span>
            </Label>
            <Input
              id='phone'
              type='tel'
              required
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder='Phone number'
            />
            {getUserFieldError('phone') && (
              <p className='text-danger text-xs'>
                {getUserFieldError('phone')}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='role'>
              Role <span className='text-danger'>*</span>
            </Label>
            <Select
              value={form.role}
              onValueChange={(v) => updateField('role', v)}
              required
            >
              <SelectTrigger id='role'>
                <SelectValue placeholder='Select a role'>
                  {formatChoiceFieldValue(form.role)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {RoleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getTopFieldError('role') && (
              <p className='text-danger text-xs'>{getTopFieldError('role')}</p>
            )}
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between rounded-md border px-3 py-2'>
              <Label htmlFor='is_active' className='cursor-pointer'>
                Status
              </Label>
              <Switch
                id='is_active'
                className='cursor-pointer'
                checked={form.is_active}
                onCheckedChange={(checked) =>
                  updateField('is_active', checked)
                }
              />
            </div>
            {getUserFieldError('is_active') && (
              <p className='text-danger text-xs'>
                {getUserFieldError('is_active')}
              </p>
            )}
          </div>

          {isError && (
            <div className='bg-danger/10 text-danger flex flex-col gap-1 rounded-md px-3 py-2 text-xs'>
              <div className='flex items-center gap-2'>
                <AlertCircle className='size-4 shrink-0' />
                {generalError ?? 'Some fields could not be updated:'}
              </div>
              {unmatchedErrors.length > 0 && (
                <ul className='list-disc space-y-0.5 pl-6'>
                  {unmatchedErrors.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <DialogFooter className='gap-2 sm:gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isLoading || !hasChanged}
              className='gap-1.5'
            >
              {isLoading && <Loading className='text-white!' />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAcceptedUserDialog;