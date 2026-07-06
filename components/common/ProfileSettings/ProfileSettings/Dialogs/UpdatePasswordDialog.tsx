'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useUpdatePasswordMutation } from '@/store/api/endpoints/common/ProfileSettings/UpdatePasswordApi';
import {
  ApiError,
  UpdatePasswordDialogProps,
} from '@/types/common/ProfileSettings/UpdatePasswordTypes';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const UpdatePasswordDialog: React.FC<UpdatePasswordDialogProps> = ({
  open,
  onClose,
  onSuccess,
  profileData,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [bannerError, setBannerError] = useState<string | null>(null);

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  function handleClose() {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setFieldErrors({});
    setBannerError(null);
    onClose();
  }

  async function handleSubmit() {
    setFieldErrors({});
    setBannerError(null);

    try {
      await updatePassword({
        old_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }).unwrap();

      toast.success('Password changed successfully!');
      onSuccess?.();
      handleClose();
    } catch (error: unknown) {
      // Handle RTK Query error object
      let errorMessage = 'Failed to change password';
      if (error && typeof error === 'object' && 'data' in error) {
        const apiError = error as ApiError;
        const { data } = apiError;

        if (typeof data === 'string') {
          errorMessage = data;
        } else if (data) {
          // Check for various error formats
          if (data.detail) {
            errorMessage = data.detail;
          } else if (data.message) {
            errorMessage = data.message;
          } else if (data.errors) {
            // Handle validation errors
            const errors = data.errors;
            if (Array.isArray(errors)) {
              errorMessage = errors.join(', ');
            } else if (typeof errors === 'string') {
              errorMessage = errors;
            } else if (typeof errors === 'object') {
              // Set field errors if present
              const newFieldErrors: Record<string, string> = {};
              // Map API keys to form field names
              const keyMap: Record<string, string> = {
                old_password: 'currentPassword',
                new_password: 'newPassword',
                confirm_password: 'confirmPassword',
              };
              for (const [key, value] of Object.entries(errors)) {
                const formKey = keyMap[key] || key;
                if (Array.isArray(value) && value.length > 0) {
                  newFieldErrors[formKey] = value[0];
                } else if (typeof value === 'string') {
                  newFieldErrors[formKey] = value;
                }
              }
              if (Object.keys(newFieldErrors).length > 0) {
                setFieldErrors(newFieldErrors);
                return;
              }
            }
          }
        }
      }
      setBannerError(errorMessage);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className='flex max-h-[90vh] w-full flex-col overflow-hidden p-0 sm:max-w-lg'>
        <DialogHeader className='shrink-0 border-b px-6 pt-6 pb-5'>
          <DialogTitle className='text-foreground text-xl font-bold'>
            {profileData.is_password_available
              ? 'Change Password'
              : 'Set Password'}
          </DialogTitle>
        </DialogHeader>

        <form
          className='flex flex-1 flex-col overflow-hidden'
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className='flex-1 space-y-5 overflow-y-auto px-6 py-5'>
            {bannerError && (
              <p className='text-danger rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm dark:border-red-900/40 dark:bg-red-950/30'>
                {bannerError}
              </p>
            )}

            {profileData.is_password_available === true && (
              <Field data-invalid={!!fieldErrors.currentPassword}>
                <FieldLabel className='text-sm font-semibold'>
                  Current Password<span className='text-danger'>*</span>
                </FieldLabel>
                <div className='relative'>
                  <Input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    aria-invalid={!!fieldErrors.currentPassword}
                    className={
                      fieldErrors.currentPassword
                        ? 'border-danger focus-visible:ring-danger/50 pr-10'
                        : 'pr-10'
                    }
                  />
                  <button
                    type='button'
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className='text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer'
                    aria-label={
                      showCurrentPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showCurrentPassword ? (
                      <EyeOff className='size-4' />
                    ) : (
                      <Eye className='size-4' />
                    )}
                  </button>
                </div>
                <FieldError
                  errors={[{ message: fieldErrors.currentPassword }]}
                />
              </Field>
            )}

            <Field data-invalid={!!fieldErrors.newPassword}>
              <FieldLabel className='text-sm font-semibold'>
                New Password<span className='text-danger'>*</span>
              </FieldLabel>
              <div className='relative'>
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  aria-invalid={!!fieldErrors.newPassword}
                  className={
                    fieldErrors.newPassword
                      ? 'border-danger focus-visible:ring-danger/50 pr-10'
                      : 'pr-10'
                  }
                />
                <button
                  type='button'
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className='text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer'
                  aria-label={
                    showNewPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showNewPassword ? (
                    <EyeOff className='size-4' />
                  ) : (
                    <Eye className='size-4' />
                  )}
                </button>
              </div>
              <FieldError errors={[{ message: fieldErrors.newPassword }]} />
            </Field>

            <Field data-invalid={!!fieldErrors.confirmPassword}>
              <FieldLabel className='text-sm font-semibold'>
                Confirm New Password<span className='text-danger'>*</span>
              </FieldLabel>
              <div className='relative'>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  aria-invalid={!!fieldErrors.confirmPassword}
                  className={
                    fieldErrors.confirmPassword
                      ? 'border-danger focus-visible:ring-danger/50 pr-10'
                      : 'pr-10'
                  }
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer'
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className='size-4' />
                  ) : (
                    <Eye className='size-4' />
                  )}
                </button>
              </div>
              <FieldError errors={[{ message: fieldErrors.confirmPassword }]} />
            </Field>
          </div>

          <div className='flex shrink-0 items-center justify-end gap-3 border-t px-6 py-4'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            {profileData.is_password_available ? (
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Changing Password...' : 'Change Password'}
              </Button>
            ) : (
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Setting Password...' : 'Set Password'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePasswordDialog;
