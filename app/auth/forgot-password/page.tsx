'use client';

import AuthPageLeftPanel from '@/components/common/AuthPageLeftPanel/AuthPageLeftPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LoaderPinwheel } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resolvedTheme, theme } = useTheme();

  const isDark = theme === 'dark' || resolvedTheme === 'dark';
  const logoSrc = isDark ? '/images/logo-white.png' : '/images/logo-black.png';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Replace with actual password reset API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubmitted(true);
      toast.success('Password reset link sent to your email');
    } catch {
      toast.error('Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
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
          <div className='mb-2 flex items-center justify-center gap-2 lg:hidden'>
            <Image
              src={logoSrc}
              alt='Landkeeper'
              width={400}
              height={150}
              className='h-12 w-40 rounded-xl'
              suppressHydrationWarning
            />
          </div>

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
                  <span className='font-medium'>{email}</span>. Please check
                  your inbox (and spam folder).
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
                  placeholder='you@organisation.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type='submit'
                disabled={isLoading}
                className='bg-primary hover:bg-primary/80 mt-2 h-11 w-full font-medium text-white'
              >
                {isLoading ? (
                  <>
                    <LoaderPinwheel className='h-4 w-4 animate-spin' />
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
