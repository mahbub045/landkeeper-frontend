'use client';

import AuthPageLeftPanel from '@/components/common/AuthPageLeftPanel/AuthPageLeftPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Eye, EyeOff, LoaderPinwheel } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { resolvedTheme, theme } = useTheme();

  const isDark = theme === 'dark' || resolvedTheme === 'dark';
  const logoSrc = isDark ? '/images/logo-white.png' : '/images/logo-black.png';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      toast.error('Invalid email or password. Please try again.');
    } else {
      toast.success('You have successfully logged in.');
      router.push('/');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    await signIn('google', { callbackUrl: '/' });
    // No need to setIsGoogleLoading(false) — page will redirect on success
    // but reset on failure just in case
    setIsGoogleLoading(false);
  };

  return (
    <div className='flex min-h-screen'>
      {/* Theme Toggle Button */}
      <div className='fixed top-4 right-4 z-50'>
        <ThemeToggle />
      </div>

      {/* Left Panel */}
      <AuthPageLeftPanel />

      {/* Right Panel — Login Form */}
      <div className='flex w-full items-center justify-center bg-white p-8 lg:w-1/2 dark:bg-gray-900'>
        <div className='w-full max-w-md'>
          {/* Mobile logo */}
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
              Sign in
            </h2>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              Enter your credentials to access your account
            </p>
          </div>

          {/* Google Sign-In */}
          <Button
            type='button'
            variant='outline'
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className='mb-6 h-11 w-full font-medium'
          >
            {isGoogleLoading ? (
              <LoaderPinwheel className='h-4 w-4 animate-spin' />
            ) : (
              <svg className='h-4 w-4' viewBox='0 0 24 24' aria-hidden='true'>
                <path
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  fill='#4285F4'
                />
                <path
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  fill='#34A853'
                />
                <path
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z'
                  fill='#FBBC05'
                />
                <path
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  fill='#EA4335'
                />
              </svg>
            )}
            {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
          </Button>

          {/* Divider */}
          <div className='relative mb-6'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-200 dark:border-gray-700' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-white px-2 text-gray-400 dark:bg-gray-900 dark:text-gray-500'>
                or sign in with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* Email */}
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

            {/* Password */}
            <div className='space-y-1.5'>
              <div className='flex items-center justify-between'>
                <Label
                  htmlFor='password'
                  className='text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Password
                </Label>
                <a
                  href='/auth/forgot-password'
                  className='text-primary/80 hover:text-primary text-xs font-medium'
                >
                  Forgot password?
                </a>
              </div>
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

            {/* Submit */}
            <Button
              type='submit'
              disabled={isLoading || isGoogleLoading}
              className='bg-primary hover:bg-primary/80 mt-2 h-11 w-full font-medium text-white'
            >
              {isLoading ? (
                <>
                  <LoaderPinwheel className='h-4 w-4 animate-spin' />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <p className='mt-6 text-center text-sm text-gray-500 dark:text-gray-400'>
            Don&apos;t have an account?{' '}
            <a
              href='/auth/signup'
              className='text-primary/80 hover:text-primary font-medium'
            >
              Sign up
            </a>
          </p>

          <p className='mt-8 text-center text-xs text-gray-400 dark:text-gray-500'>
            © {new Date().getFullYear()} Landkeeper. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
