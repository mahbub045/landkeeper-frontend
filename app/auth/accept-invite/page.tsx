'use client';

import AuthPageLeftPanel from '@/components/common/AuthPageLeftPanel/AuthPageLeftPanel';
import AuthPageMobileLogo from '@/components/common/AuthPageMobileLogo/AuthPageMobileLogo';
import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAcceptTeamMemberInviteMutation } from '@/store/api/endpoints/auth/TeamMemberAcceptInviteApi';
import { AcceptInviteApiError } from '@/types/client/Common/Tools/TeamAccess/TeamAccessTypes';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { toast } from 'sonner';

// ✅ Inner component uses useSearchParams
function AcceptInviteContent() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [acceptInviteMutation, { isLoading: acceptInviteLoading }] =
    useAcceptTeamMemberInviteMutation();

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!token) {
      toast.error('Invalid or expired invite link');
      return;
    }

    const payload = {
      first_name: firstName,
      last_name: lastName,
      password: password,
      confirm_password: confirmPassword,
    };

    try {
      await acceptInviteMutation({ payload, token }).unwrap();
      toast.success('Invite accepted successfully');
      router.push('/auth/signin');
    } catch (error: unknown) {
      let message = 'Failed to accept invite. Please try again.';
      if (error && typeof error === 'object' && 'data' in error) {
        const apiError = error as AcceptInviteApiError;
        const { data } = apiError;
        if (data) {
          if (typeof data === 'string') {
            message = data;
          } else if (data.detail) {
            message = data.detail;
          } else if (data.message) {
            message = data.message;
          } else if (
            data.password ||
            data.confirm_password ||
            data.first_name ||
            data.last_name
          ) {
            const newFieldErrors: Record<string, string> = {};
            if (data.first_name) {
              newFieldErrors.firstName = Array.isArray(data.first_name)
                ? data.first_name[0]
                : data.first_name;
            }
            if (data.last_name) {
              newFieldErrors.lastName = Array.isArray(data.last_name)
                ? data.last_name[0]
                : data.last_name;
            }
            if (data.password) {
              newFieldErrors.password = Array.isArray(data.password)
                ? data.password[0]
                : data.password;
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
              Accept invite
            </h2>
          </div>

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div className='flex gap-4'>
              <div className='w-1/2 space-y-1.5'>
                <Label
                  htmlFor='firstName'
                  className='text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  First name<span className='text-danger'>*</span>
                </Label>
                <Input
                  id='firstName'
                  type='text'
                  placeholder='Enter your first name'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                {fieldErrors.firstName && (
                  <p className='text-danger text-xs'>{fieldErrors.firstName}</p>
                )}
              </div>

              <div className='w-1/2 space-y-1.5'>
                <Label
                  htmlFor='lastName'
                  className='text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Last name<span className='text-danger'>*</span>
                </Label>
                <Input
                  id='lastName'
                  type='text'
                  placeholder='Enter your last name'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                {fieldErrors.lastName && (
                  <p className='text-danger text-xs'>{fieldErrors.lastName}</p>
                )}
              </div>
            </div>

            <div className='space-y-1.5'>
              <Label
                htmlFor='password'
                className='text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Password<span className='text-danger'>*</span>
              </Label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                <p className='text-danger text-xs'>{fieldErrors.password}</p>
              )}
            </div>

            <div className='space-y-1.5'>
              <Label
                htmlFor='confirmPassword'
                className='text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                Confirm password<span className='text-danger'>*</span>
              </Label>
              <div className='relative'>
                <Input
                  id='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Confirm your password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
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
                <p className='text-danger text-xs'>
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            {errorMessage && (
              <p className='text-danger text-sm'>{errorMessage}</p>
            )}

            <Button
              type='submit'
              disabled={acceptInviteLoading}
              className='bg-primary hover:bg-primary/80 mt-2 h-11 w-full font-medium text-white'
            >
              {acceptInviteLoading ? (
                <>
                  <Loading className='text-white!' />
                  Accepting invite...
                </>
              ) : (
                'Accept invite'
              )}
            </Button>
          </form>

          <p className='mt-6 text-center text-sm text-gray-500 dark:text-gray-400'>
            Already have an account?{' '}
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
export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center'>
          Loading...
        </div>
      }
    >
      <AcceptInviteContent />
    </Suspense>
  );
}
