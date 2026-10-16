'use client';

import AuthPageLeftPanel from '@/components/common/AuthPageLeftPanel/AuthPageLeftPanel';
import AuthPageMobileLogo from '@/components/common/AuthPageMobileLogo/AuthPageMobileLogo';
import Loading from '@/components/common/CustomLoader/Loading';
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
import { TITLE_OPTIONS } from '@/data/common/TitleOptions';
import { useJoinReferralMutation } from '@/store/api/endpoints/auth/JoinReferralProgramApi';
import { SignupFieldErrors } from '@/types/common/auth/SignUpTypes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

// Helper: extract first error string from a field
function fieldError(errors: SignupFieldErrors, key: keyof SignupFieldErrors) {
  const val = errors[key];
  return val && val.length > 0 ? val[0] : null;
}

// Helper: normalize various API error shapes into a readable string
function extractErrorMessage(data: unknown): string {
  if (data == null) return 'An unknown error occurred';
  if (typeof data === 'string') return data;
  if (Array.isArray(data)) {
    return data.map((d) => extractErrorMessage(d)).join('; ');
  }
  if (typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (obj.non_field_errors && Array.isArray(obj.non_field_errors)) {
      return (obj.non_field_errors as unknown[])
        .map((v) => String(v))
        .join('; ');
    }
    if (typeof obj.detail === 'string') return obj.detail;
    if (typeof obj.message === 'string') return obj.message;
    if (typeof obj.error === 'string') return obj.error;

    // Try to pick the first string-like field value (e.g. { email: ['invalid'] })
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (typeof val === 'string') return val;
      if (Array.isArray(val) && val.length > 0) {
        // prefer arrays of strings
        const flattened = (val as unknown[])
          .map((v) => (typeof v === 'string' ? v : extractErrorMessage(v)))
          .join('; ');
        if (flattened) return flattened;
      }
    }

    try {
      return JSON.stringify(obj);
    } catch {
      return 'An error occurred';
    }
  }
  return String(data);
}

export default function JoinReferralPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Per-field errors from API
  const [fieldErrors, setFieldErrors] = useState<SignupFieldErrors>({});
  // Non-field / general errors (show at top of form)
  const [nonFieldError, setNonFieldError] = useState<string | null>(null);

  const [joinReferral, { isLoading }] = useJoinReferralMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setNonFieldError(null);

    const payload = {
      title,
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      email,
      phone,
    };

    try {
      await joinReferral(payload).unwrap();
      toast.success("You're in! Redirecting to your partner dashboard...");
      router.push(`${process.env.NEXT_PUBLIC_REFERRAL_DASHBOARD_URL}`);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'data' in error) {
        const data = (error as { data: unknown }).data;

        // Normalize message for display
        const message = extractErrorMessage(data);

        // If response contains per-field errors (object), keep them for field highlighting
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          setFieldErrors(data as SignupFieldErrors);
        }

        setNonFieldError(message);
        toast.error(message);
      } else {
        const fallback = 'Failed to join the referral program';
        setNonFieldError(fallback);
        toast.error(fallback);
      }
    }
  };

  // Clears a specific field error when user starts typing
  const clearError = (key: keyof SignupFieldErrors) => {
    if (fieldErrors[key]) {
      setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    // Clear any general non-field error when user edits
    if (nonFieldError) setNonFieldError(null);
  };

  return (
    <div className='flex min-h-screen'>
      <div className='fixed top-4 right-4 z-50'>
        <ThemeToggle />
      </div>

      <AuthPageLeftPanel />

      {/* Right Panel */}
      <div className='flex w-full items-center justify-center overflow-y-auto bg-white p-8 lg:w-1/2 dark:bg-gray-900'>
        <div className='w-full max-w-lg py-8'>
          {/* Mobile Logo */}
          <AuthPageMobileLogo />

          {/* Header */}
          <div className='mb-6'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-50'>
              Join our referral program
            </h2>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              Tell us a little about yourself to start earning rewards
            </p>
          </div>

          <div>
            {nonFieldError && (
              <div className='mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/40 dark:text-red-200'>
                {nonFieldError}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Title + First Name */}
            <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
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
                    {TITLE_OPTIONS.map((option) => (
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
            <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
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

            {/* Submit */}
            <Button
              type='submit'
              disabled={isLoading}
              className='bg-primary hover:bg-primary/80 mt-2 h-11 w-full font-medium text-white'
            >
              {isLoading && <Loading className='text-white!' />}
              Join Referral Program
            </Button>
          </form>

          <p className='mt-5 text-center text-sm text-gray-500 dark:text-gray-400'>
            Already a referral partner?{' '}
            <Link
              target='_blank'
              href={`${process.env.NEXT_PUBLIC_REFERRAL_DASHBOARD_URL}`}
              className='text-primary font-medium hover:underline'
            >
              Sign in to your dashboard
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
