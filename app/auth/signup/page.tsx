'use client';

import AuthPageLeftPanel from '@/components/common/AuthPageLeftPanel/AuthPageLeftPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { TitleOptions } from '@/data/common/TitleOptions';
import { useSignupMutation } from '@/store/api/endpoints/auth/SignupApi';
import { SignupFieldErrors } from '@/types/common/auth/SignUpTypes';
import { Eye, EyeOff, LoaderPinwheel } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

// Helper: extract first error string from a field
function fieldError(errors: SignupFieldErrors, key: keyof SignupFieldErrors) {
  const val = errors[key];
  return val && val.length > 0 ? val[0] : null;
}

export default function SignupPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Per-field errors from API
  const [fieldErrors, setFieldErrors] = useState<SignupFieldErrors>({});

  const [sighUp, { isLoading }] = useSignupMutation();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === 'dark' || resolvedTheme === 'dark';
  const logoSrc = isDark ? '/images/logo-white.png' : '/images/logo-black.png';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (password !== confirmPassword) {
      setFieldErrors({ password: ['Passwords do not match'] });
      return;
    }

    const payload = {
      title,
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      email,
      phone,
      password,
    };

    try {
      await sighUp(payload).unwrap();
      toast.success('Account created successfully');
      router.push('/auth/signin');
    } catch (error: unknown) {
      // RTK Query wraps DRF errors in error.data
      if (error && typeof error === 'object' && 'data' in error) {
        const data = (error as { data: unknown }).data;

        if (data && typeof data === 'object') {
          // DRF field errors: { field_name: string[] }
          setFieldErrors(data as SignupFieldErrors);

          // Show non_field_errors or detail as toast
          const errObj = data as Record<string, unknown>;
          if (
            errObj.non_field_errors &&
            Array.isArray(errObj.non_field_errors)
          ) {
            toast.error(errObj.non_field_errors[0] as string);
          } else if (errObj.detail && typeof errObj.detail === 'string') {
            toast.error(errObj.detail);
          } else {
            toast.error('Please fix the errors below');
          }
        } else {
          toast.error('Failed to create account');
        }
      } else {
        toast.error('Failed to create account');
      }
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    await signIn('google', { callbackUrl: '/' });
    setIsGoogleLoading(false);
  };

  // Clears a specific field error when user starts typing
  const clearError = (key: keyof SignupFieldErrors) => {
    if (fieldErrors[key]) {
      setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  return (
    <div className='flex min-h-screen'>
      <div className='fixed top-4 right-4 z-50'>
        <ThemeToggle />
      </div>

      <AuthPageLeftPanel />

      {/* Right Panel */}
      <div className='flex w-full items-start justify-center overflow-y-auto bg-white p-8 lg:w-1/2 dark:bg-gray-900'>
        <div className='w-full max-w-lg py-8'>
          {/* Mobile Logo */}
          <div className='mb-4 flex justify-center lg:hidden'>
            <Image
              src={logoSrc}
              alt='Landkeeper'
              width={400}
              height={150}
              className='h-12 w-40 rounded-xl'
              loading='eager'
            />
          </div>

          {/* Header */}
          <div className='mb-6'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-50'>
              Create your account
            </h2>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              Fill in your details to get started
            </p>
          </div>

          {/* Google Signup */}
          <Button
            type='button'
            variant='outline'
            onClick={handleGoogleSignup}
            disabled={isGoogleLoading || isLoading}
            className='mb-5 h-11 w-full'
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
            {isGoogleLoading ? 'Creating account...' : 'Continue with Google'}
          </Button>

          {/* Divider */}
          <div className='relative mb-5'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-200 dark:border-gray-700' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-white px-2 text-gray-400 dark:bg-gray-900'>
                or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Title + First Name */}
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-1.5'>
                <Label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Title <span className='text-red-500'>*</span>
                </Label>
                <Select
                  value={title}
                  onValueChange={(val) => {
                    setTitle(val);
                    clearError('title');
                  }}
                  required
                >
                  <SelectTrigger
                    id='title'
                    className={
                      fieldError(fieldErrors, 'title')
                        ? 'border-red-500 focus:ring-red-500'
                        : ''
                    }
                  >
                    <SelectValue placeholder='Select' />
                  </SelectTrigger>
                  <SelectContent>
                    {TitleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldError(fieldErrors, 'title') && (
                  <p className='text-xs text-red-500'>
                    {fieldError(fieldErrors, 'title')}
                  </p>
                )}
              </div>

              <div className='space-y-1.5'>
                <Label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  First Name <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='text'
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    clearError('first_name');
                  }}
                  placeholder='John'
                  required
                  className={
                    fieldError(fieldErrors, 'first_name')
                      ? 'border-red-500 focus-visible:ring-red-500'
                      : ''
                  }
                />
                {fieldError(fieldErrors, 'first_name') && (
                  <p className='text-xs text-red-500'>
                    {fieldError(fieldErrors, 'first_name')}
                  </p>
                )}
              </div>
            </div>

            {/* Middle Name + Last Name */}
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-1.5'>
                <Label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Middle Name{' '}
                  <span className='text-xs font-normal text-gray-400'>
                    (optional)
                  </span>
                </Label>
                <Input
                  type='text'
                  value={middleName}
                  onChange={(e) => {
                    setMiddleName(e.target.value);
                    clearError('middle_name');
                  }}
                  placeholder='Lee'
                  className={
                    fieldError(fieldErrors, 'middle_name')
                      ? 'border-red-500 focus-visible:ring-red-500'
                      : ''
                  }
                />
                {fieldError(fieldErrors, 'middle_name') && (
                  <p className='text-xs text-red-500'>
                    {fieldError(fieldErrors, 'middle_name')}
                  </p>
                )}
              </div>

              <div className='space-y-1.5'>
                <Label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Last Name <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='text'
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    clearError('last_name');
                  }}
                  placeholder='Doe'
                  required
                  className={
                    fieldError(fieldErrors, 'last_name')
                      ? 'border-red-500 focus-visible:ring-red-500'
                      : ''
                  }
                />
                {fieldError(fieldErrors, 'last_name') && (
                  <p className='text-xs text-red-500'>
                    {fieldError(fieldErrors, 'last_name')}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className='space-y-1.5'>
              <Label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Email Address <span className='text-red-500'>*</span>
              </Label>
              <Input
                type='email'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError('email');
                }}
                placeholder='you@example.com'
                required
                className={
                  fieldError(fieldErrors, 'email')
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : ''
                }
              />
              {fieldError(fieldErrors, 'email') && (
                <p className='text-xs text-red-500'>
                  {fieldError(fieldErrors, 'email')}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className='space-y-1.5'>
              <Label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Phone Number
              </Label>
              <Input
                type='tel'
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  clearError('phone');
                }}
                placeholder='+44 123 456 7890'
                className={
                  fieldError(fieldErrors, 'phone')
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : ''
                }
              />
              {fieldError(fieldErrors, 'phone') && (
                <p className='text-xs text-red-500'>
                  {fieldError(fieldErrors, 'phone')}
                </p>
              )}
            </div>

            {/* Password + Confirm Password */}
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-1.5'>
                <Label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Password <span className='text-red-500'>*</span>
                </Label>
                <div className='relative'>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearError('password');
                    }}
                    placeholder='Min. 8 characters'
                    required
                    className={
                      fieldError(fieldErrors, 'password')
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : ''
                    }
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </button>
                </div>
                {fieldError(fieldErrors, 'password') && (
                  <p className='text-xs text-red-500'>
                    {fieldError(fieldErrors, 'password')}
                  </p>
                )}
              </div>

              <div className='space-y-1.5'>
                <Label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Confirm Password <span className='text-red-500'>*</span>
                </Label>
                <div className='relative'>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder='Re-enter password'
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </button>
                </div>
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <p className='mt-5 text-center text-sm text-gray-500 dark:text-gray-400'>
            Already have an account?{' '}
            <Link
              href='/auth/signin'
              className='text-primary font-medium hover:underline'
            >
              Sign in
            </Link>
          </p>

          <p className='mt-6 text-center text-xs text-gray-400 dark:text-gray-500'>
            © {new Date().getFullYear()} Landkeeper. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
