'use client';

import AuthPageLeftPanel from '@/components/common/AuthPageLeftPanel/AuthPageLeftPanel';
import AuthPageMobileLogo from '@/components/common/AuthPageMobileLogo/AuthPageMobileLogo';
import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  useEmailVerifyMutation,
  useResendVerifyMutation,
} from '@/store/api/endpoints/auth/SignupApi';
import { Mail, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useRef, useState } from 'react';
import { toast } from 'sonner';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyEmail] = useEmailVerifyMutation();
  const [resendVerify] = useResendVerifyMutation();

  const handleChange = (index: number, value: string) => {
    // Allow only digits
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1); // only last digit
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);
    const newCode = [...code];
    pasted.split('').forEach((char, i) => {
      newCode[i] = char;
    });
    setCode(newCode);
    // Focus last filled or next empty
    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      toast.error('Please enter the 6-digit code');
      return;
    }

    setIsVerifying(true);
    try {
      await verifyEmail({ email, code: fullCode }).unwrap();
      // ✅ Success — unwrap() throws on error, so no res.ok needed
      toast.success('Email verified successfully!');
      router.push('/auth/signin');
    } catch (error: unknown) {
      // ✅ RTK Query error is in error.data
      if (error && typeof error === 'object' && 'data' in error) {
        const data = (error as { data: Record<string, unknown> }).data;
        toast.error(
          (data?.detail as string) ||
            (data?.message as string) ||
            'Invalid or expired code',
        );
      } else {
        toast.error('Invalid or expired code');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await resendVerify({ email }).unwrap();
      // ✅ If we reach here, it was successful (unwrap throws on error)
      toast.success('Verification code resent to your email');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error: unknown) {
      // ✅ RTK Query error shape: error.data
      if (error && typeof error === 'object' && 'data' in error) {
        const data = (error as { data: Record<string, unknown> }).data;
        toast.error(
          (data?.detail as string) ||
            (data?.message as string) ||
            'Failed to resend code',
        );
      } else {
        toast.error('Failed to resend code');
      }
    } finally {
      setIsResending(false);
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

          {/* Icon */}
          <div className='mb-6 flex justify-center'>
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950'>
              <Mail className='h-8 w-8 text-blue-500' />
            </div>
          </div>

          {/* Header */}
          <div className='mb-2 text-center'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-50'>
              Check your email
            </h2>
            <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
              We sent a 6-digit verification code to
            </p>
            <p className='mt-1 text-sm font-semibold text-gray-700 dark:text-gray-300'>
              {email || 'your email address'}
            </p>
          </div>

          {/* Code inputs */}
          <div className='mt-8 flex justify-center gap-3'>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type='text'
                inputMode='numeric'
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`h-12 w-12 rounded-lg border text-center text-lg font-semibold transition-all outline-none ${
                  digit
                    ? 'border-primary bg-primary/5 text-primary dark:bg-primary/10'
                    : 'border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-50'
                } focus:border-primary focus:ring-primary/20 dark:focus:border-primary focus:ring-2`}
              />
            ))}
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={isVerifying || code.join('').length !== 6}
            className='bg-primary hover:bg-primary/80 mt-6 h-11 w-full font-medium text-white'
          >
            {isVerifying ? (
              <>
                <Loading className='text-white!' />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </Button>

          {/* Resend */}
          <div className='mt-4 text-center'>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Didn&apos;t receive the code?{' '}
              <button
                type='button'
                onClick={handleResend}
                disabled={isResending}
                className='text-primary hover:text-primary/80 inline-flex cursor-pointer items-center gap-1 font-medium disabled:opacity-50'
              >
                {isResending ? (
                  <>
                    <Loading size={14} />
                    Resending...
                  </>
                ) : (
                  <>
                    <RotateCcw className='h-3 w-3' />
                    Resend code
                  </>
                )}
              </button>
            </p>
          </div>

          <p className='mt-4 text-center text-sm text-gray-500 dark:text-gray-400'>
            Wrong email?{' '}
            <Link
              href='/auth/signup'
              className='text-primary font-medium hover:underline'
            >
              Go back
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

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center'>
          Loading...
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
