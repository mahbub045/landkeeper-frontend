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
import { RoleOptions } from '@/data/common/RoleOptions';
import { TitleOptions } from '@/data/common/TitleOptions';
import { useEditAcceptedUserMutation } from '@/store/api/endpoints/client/Common/Tools/TeamAccess/TeamAccessApi';
import { EditAcceptedUserDialogProps } from '@/types/client/Common/Tools/TeamAccess/AcceptedUserTypes';
import { formatChoiceFieldValue } from '@/utils/formatters';
import { AlertCircle, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner'; // swap for your toast lib if different

type FormState = {
  title: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
};

const emptyForm: FormState = {
  title: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  email: '',
  phone: '',
  role: '',
};

const EditAcceptedUserDialog: React.FC<EditAcceptedUserDialogProps> = ({
  isOpen,
  onClose,
  member,
}) => {
  const [editAcceptedUser, { isLoading, isError }] =
    useEditAcceptedUserMutation();

  const [initialForm, setInitialForm] = useState<FormState>(emptyForm);
  const [form, setForm] = useState<FormState>(emptyForm);

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
      email: member?.user?.email ?? '',
      phone: member?.user?.phone ?? '',
      role: member?.role ?? '',
    };
    setForm(next);
    setInitialForm(next);
    setSyncedKey(currentKey);
  }

  const hasChanged = JSON.stringify(form) !== JSON.stringify(initialForm);

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!hasChanged) {
      onClose();
      return;
    }
    const payload = {
      user: {
        title: form.title,
        first_name: form.first_name,
        middle_name: form.middle_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
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
    } catch {
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
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='email'>
              Email <span className='text-danger'>*</span>
            </Label>
            <Input
              id='email'
              type='email'
              required
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder='name@example.com'
            />
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
          </div>

          {isError && (
            <div className='bg-danger/10 text-danger flex items-center gap-2 rounded-md px-3 py-2 text-xs'>
              <AlertCircle className='size-4 shrink-0' />
              Something went wrong while updating this member. Please try
              again.
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
              {isLoading && <Loader2 className='size-4 animate-spin' />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAcceptedUserDialog;