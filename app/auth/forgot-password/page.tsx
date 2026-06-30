'use client';

import AuthPageLeftPanel from '@/components/common/AuthPageLeftPanel/AuthPageLeftPanel';
import AuthPageMobileLogo from '@/components/common/AuthPageMobileLogo/AuthPageMobileLogo';
import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useForgotPasswordMutation } from '@/store/api/endpoints/auth/ForgotPasswordApi';
import { ForgotPasswordApiError } from '@/types/common/auth/ForgotPasswordTypes';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [forgotPassword, { isLoading: forgotPasswordLoading }] =
    useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      // Use the forgotPassword mutation to send the reset link
      await forgotPassword({ email }).unwrap();

      setIsSubmitted(true);
      toast.success('Password reset link sent to your email');
    } catch (error: unknown) {
      let message = 'Failed to send reset link. Please try again.';
      if (error && typeof error === 'object' && 'data' in error) {
        const apiError = error as ForgotPasswordApiError;
        const { data } = apiError;
        if (data) {
          if (typeof data === 'string') {
            message = data;
          } else if (data.email) {
            message = Array.isArray(data.email) ? data.email[0] : data.email;
          } else if (data.detail) {
            message = data.detail;
          } else if (data.message) {
            message = data.message;
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
              Forgot password?
            </h2>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              {isSubmitted
                ? 'Check your email for the reset link'
                : 'Enter your email and we’ll send you a reset link'}
            </p>
          </div>

          {isSubmitted ? (
            <div className='space-y-6'>
              <div className='rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800'>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  A password reset link has been sent to{' '}
                  <span className='text-primary font-medium'>{email}</span>.
                  Please check your inbox (and spam folder).
                </p>
              </div>
              <Button
                type='button'
                onClick={() => setIsSubmitted(false)}
                variant='outline'
                className='h-11 w-full'
              >
                Send to another email
              </Button>
              <Link href='/auth/signin' className='block text-center'>
                <Button
                  type='button'
                  className='bg-primary hover:bg-primary/80 h-11 w-full text-white'
                >
                  Back to login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-5'>
              <div className='space-y-1.5'>
                <Label
                  htmlFor='email'
                  className='text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Email address
                </Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='you@example.com'
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  required
                  className={
                    errorMessage
                      ? 'border-red-500 focus-visible:ring-red-500/50'
                      : ''
                  }
                />
                {errorMessage && (
                  <p className='text-sm text-red-500'>{errorMessage}</p>
                )}
              </div>

              <Button
                type='submit'
                disabled={forgotPasswordLoading}
                className='bg-primary hover:bg-primary/80 mt-2 h-11 w-full font-medium text-white'
              >
                {forgotPasswordLoading ? (
                  <>
                    <Loading className='text-white!' />
                    Sending reset link...
                  </>
                ) : (
                  'Send reset link'
                )}
              </Button>
            </form>
          )}

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
