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
import { useChangePasswordMutation } from '@/store/api/endpoints/common/ProfileSettings/ChangePasswordApi';
import {
  ApiError,
  ChangePasswordDialogProps,
} from '@/types/common/ProfileSettings/ChangePasswordTypes';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  open,
  onClose,
  onSuccess,
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

  const [changePassword, { isLoading }] = useChangePasswordMutation();

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

    const errors: Record<string, string> = {};

    if (!currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm password is required';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      await changePassword({
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
            Change Password
          </DialogTitle>
        </DialogHeader>

        <div className='flex-1 space-y-5 overflow-y-auto px-6 py-5'>
          {bannerError && (
            <p className='text-danger rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm dark:border-red-900/40 dark:bg-red-950/30'>
              {bannerError}
            </p>
          )}

          <Field data-invalid={!!fieldErrors.currentPassword}>
            <FieldLabel className='text-sm font-semibold'>
              Current Password
            </FieldLabel>
            <div className='relative'>
              <Input
                type={showCurrentPassword ? 'text' : 'password'}
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
            <FieldError errors={[{ message: fieldErrors.currentPassword }]} />
          </Field>

          <Field data-invalid={!!fieldErrors.newPassword}>
            <FieldLabel className='text-sm font-semibold'>
              New Password
            </FieldLabel>
            <div className='relative'>
              <Input
                type={showNewPassword ? 'text' : 'password'}
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
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
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
              Confirm New Password
            </FieldLabel>
            <div className='relative'>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
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
          <Button variant='outline' onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Changing Password...' : 'Change Password'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
