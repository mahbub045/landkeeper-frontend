'use client';

import AuthPageLeftPanel from '@/components/common/AuthPageLeftPanel/AuthPageLeftPanel';
import AuthPageMobileLogo from '@/components/common/AuthPageMobileLogo/AuthPageMobileLogo';
import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useSetPasswordMutation } from '@/store/api/endpoints/auth/ForgotPasswordApi';
import { SetPasswordApiError } from '@/types/common/auth/ForgotPasswordTypes';
import { Check, Eye, EyeOff, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { toast } from 'sonner';

const PASSWORD_REQUIREMENTS: {
  label: string;
  test: (pw: string) => boolean;
}[] = [
  { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'One lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { label: 'One number', test: (pw) => /[0-9]/.test(pw) },
  {
    label: 'One special character (!@#$%^&*)',
    test: (pw) => /[!@#$%^&*]/.test(pw),
  },
];

// ✅ Inner component uses useSearchParams
function SetPasswordContent() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [setPasswordMutation, { isLoading: setPasswordLoading }] =
    useSetPasswordMutation();

  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const uid = searchParams.get('uid');

  const passwordChecks = PASSWORD_REQUIREMENTS.map((req) => ({
    ...req,
    passed: req.test(password),
  }));
  const isPasswordValid = passwordChecks.every((c) => c.passed);
  const showPasswordRequirements = passwordFocused || password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    if (!isPasswordValid) {
      setFieldErrors({ password: 'Password does not meet the requirements' });
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!token || !uid) {
      toast.error('Invalid token or uid');
      return;
    }

    const payload = {
      new_password: password,
      confirm_password: confirmPassword,
    };

    try {
      await setPasswordMutation({ payload, token, uid }).unwrap();
      toast.success('Password set successfully');
      router.push('/auth/signin');
    } catch (error: unknown) {
      let message = 'Failed to set password. Please try again.';
      if (error && typeof error === 'object' && 'data' in error) {
        const apiError = error as SetPasswordApiError;
        const { data } = apiError;
        if (data) {
          if (typeof data === 'string') {
            message = data;
          } else if (data.detail) {
            message = data.detail;
          } else if (data.message) {
            message = data.message;
          } else if (data.new_password || data.confirm_password) {
            const newFieldErrors: Record<string, string> = {};
            if (data.new_password) {
              newFieldErrors.password = Array.isArray(data.new_password)
                ? data.new_password[0]
                : data.new_password;
            }
            if (data.confirm_password) {
              newFieldErrors.confirmPassword = Array.isArray(
                data.confirm_password,
              )
                ? data.confirm_password[0]
                : data.confirm_password;
            }
            if (Object.keys(newFieldErrors).length > 0) {
              setFieldErrors(newFieldErrors);
              return;
            }
          }
        }
      }
      setErrorMessage(message);
      toast.error(message);
    }
  };

  return (
    <div className='flex min-h-screen'>
      <div className='fixed top-4 right-4 z-50'>
        <ThemeToggle />
      </div>

      <AuthPageLeftPanel />

      <div className='flex w-full items-center justify-center bg-white p-8 lg:w-1/2 dark:bg-gray-900'>
        <div className='w-full max-w-md'>
          <AuthPageMobileLogo />

          <div className='mb-8'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-50'>
              Set new password
            </h2>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              Enter your new password
            </p>
          </div>

          {errorMessage && (
            <div className='mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/40 dark:text-red-200'>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div className='space-y-1.5'>
              <Label
                htmlFor='password'
                className='text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                New password
              </Label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => ({ ...prev, password: '' }));
                    }
                  }}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  required
                  className={
                    fieldErrors.password ||
                    (password.length > 0 && !isPasswordValid)
                      ? 'border-red-500 focus-visible:ring-red-500'
                      : ''
                  }
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className='text-xs text-red-500'>{fieldErrors.password}</p>
              )}
            </div>

            {showPasswordRequirements && (
              <div className='rounded-md bg-blue-50 p-3 dark:bg-blue-950/30'>
                <p className='mb-2 text-xs font-semibold text-gray-700 dark:text-gray-300'>
                  Password requirements:
                </p>
                <ul className='space-y-1'>
                  {passwordChecks.map((check) => (
                    <li
                      key={check.label}
                      className={`flex items-center gap-2 text-xs ${
                        check.passed
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {check.passed ? (
                        <Check className='h-3.5 w-3.5 text-green-600 dark:text-green-400' />
                      ) : (
                        <X className='h-3.5 w-3.5 text-red-500' />
                      )}
                      {check.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className='space-y-1.5'>
              <Label
                htmlFor='confirmPassword'
                className='text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Confirm new password
              </Label>
              <div className='relative'>
                <Input
                  id='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Confirm your password'
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (fieldErrors.confirmPassword) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        confirmPassword: '',
                      }));
                    }
                  }}
                  required
                  className={
                    fieldErrors.confirmPassword
                      ? 'border-red-500 focus-visible:ring-red-500'
                      : ''
                  }
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                >
                  {showConfirmPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className='text-xs text-red-500'>
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type='submit'
              disabled={setPasswordLoading}
              className='bg-primary hover:bg-primary/80 mt-2 h-11 w-full font-medium text-white'
            >
              {setPasswordLoading && <Loading className='text-white!' />}
              Set password
            </Button>
          </form>

          <p className='mt-6 text-center text-sm text-gray-500 dark:text-gray-400'>
            Remember your password?{' '}
            <Link
              href='/auth/signin'
              className='text-primary/80 hover:text-primary font-medium'
            >
              Sign in
            </Link>
          </p>

          <p className='mt-8 text-center text-xs text-gray-400 dark:text-gray-500'>
            © {new Date().getFullYear()} Landkeeper. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

// ✅ Default export wraps inner component in Suspense
export default function SetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center'>
          Loading...
        </div>
      }
    >
      <SetPasswordContent />
    </Suspense>
  );
}
