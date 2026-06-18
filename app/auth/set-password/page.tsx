'use client';

import AuthPageLeftPanel from '@/components/common/AuthPageLeftPanel/AuthPageLeftPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Eye, EyeOff, LoaderPinwheel } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { resolvedTheme, theme } = useTheme();

  const isDark = theme === 'dark' || resolvedTheme === 'dark';
  const logoSrc = isDark ? '/images/logo-white.png' : '/images/logo-black.png';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Replace with actual password set API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('Password set successfully');
      router.push('/auth/signin');
    } catch {
      toast.error('Failed to set password. Please try again.');
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
              Set new password
            </h2>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              Enter your new password
            </p>
          </div>

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
            </div>

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
            </div>

            <Button
              type='submit'
              disabled={isLoading}
              className='bg-primary hover:bg-primary/80 mt-2 h-11 w-full font-medium text-white'
            >
              {isLoading ? (
                <>
                  <LoaderPinwheel className='h-4 w-4 animate-spin' />
                  Setting password...
                </>
              ) : (
                'Set password'
              )}
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
