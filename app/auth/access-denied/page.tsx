'use client';

import { Button } from '@/components/ui/button';
import { Home, LogOut, ShieldAlert } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function AccessDeniedPage() {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: '/auth/signin',
      redirect: true,
    });
  };

  return (
    <div className='bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-6'>
      {/* Background Pattern */}{' '}
      <div className='absolute inset-0 opacity-5'>
        <div
          className='h-full w-full'
          style={{
            backgroundImage:
              'radial-gradient(circle at 25px 25px, currentColor 2px, transparent 0)',
            backgroundSize: '50px 50px',
          }}
        />{' '}
      </div>
      {/* Decorative Blur */}
      <div className='absolute top-20 left-20 h-72 w-72 rounded-full bg-red-500/10 blur-3xl' />
      <div className='bg-primary/10 absolute right-20 bottom-20 h-72 w-72 rounded-full blur-3xl' />
      <div className='relative w-full max-w-lg'>
        <div className='bg-card/80 rounded-3xl border p-10 text-center shadow-xl backdrop-blur'>
          {/* Icon */}
          <div className='mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10'>
            <ShieldAlert className='h-12 w-12 text-red-500' />
          </div>

          {/* Status */}
          <div className='mb-2 text-sm font-semibold tracking-wider text-red-500 uppercase'>
            Access Restricted
          </div>

          {/* Title */}
          <h1 className='mb-4 text-4xl font-bold tracking-tight'>
            Access Denied
          </h1>

          {/* Description */}
          <p className='text-muted-foreground mx-auto mb-8 max-w-md leading-relaxed'>
            Your account does not have permission to access this page or
            resource. If you believe this is a mistake, please contact your
            administrator.
          </p>

          {/* Actions */}
          <div className='flex flex-col gap-3 sm:flex-row sm:justify-center'>
            <Button
              onClick={handleLogout}
              variant='destructive'
              className='min-w-[150px]'
            >
              <LogOut />
              Logout
            </Button>

            <Button asChild variant='outline' className='min-w-[150px]'>
              <Link href='/'>
                <Home />
                Dashboard
              </Link>
            </Button>
          </div>

          {/* Footer */}
          <div className='mt-8 border-t pt-6'>
            <p className='text-muted-foreground text-xs'>
              Error Code: 403 • Insufficient Permissions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
