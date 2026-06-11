'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2, MapPin } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      router.push('/dashboard');
    }
  };

  return (
    <div className='min-h-screen flex'>
      {/* Left Panel */}
      <div className='hidden lg:flex lg:w-1/2 bg-green-900 flex-col justify-between p-12 relative overflow-hidden'>
        {/* Background pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div
            className='absolute top-0 left-0 w-full h-full'
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, white 2px, transparent 0)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Logo */}
        <div className='relative flex items-center gap-3'>
          <div className='w-10 h-10 bg-white rounded-xl flex items-center justify-center'>
            <MapPin className='w-5 h-5 text-green-900' />
          </div>
          <span className='text-white text-xl font-semibold tracking-tight'>
            Landkeeper
          </span>
        </div>

        {/* Center content */}
        <div className='relative'>
          <h1 className='text-4xl font-bold text-white leading-tight mb-4'>
            Manage your land,
            <br />
            <span className='text-green-300'>effortlessly.</span>
          </h1>
          <p className='text-green-200 text-lg leading-relaxed max-w-sm'>
            Track parcels, monitor applications, and stay on top of every land
            management task — all in one place.
          </p>

          {/* Stats */}
          <div className='mt-10 grid grid-cols-2 gap-6'>
            {[
              { value: '12,400+', label: 'Land parcels tracked' },
              { value: '98%', label: 'Uptime guarantee' },
              { value: '340+', label: 'Organisations' },
              { value: '24/7', label: 'Support available' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className='text-white text-2xl font-bold'>{stat.value}</p>
                <p className='text-green-300 text-sm mt-1'>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer quote */}
        <div className='relative border-l-2 border-green-500 pl-4'>
          <p className='text-green-200 text-sm italic'>
            Landkeeper transformed how we handle our portfolio of 2,000+
            parcels.
          </p>
          <p className='text-green-400 text-xs mt-2'>
            — Director, National Land Authority
          </p>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-white'>
        <div className='w-full max-w-md'>
          {/* Mobile logo */}
          <div className='flex items-center gap-2 mb-10 lg:hidden'>
            <div className='w-8 h-8 bg-green-900 rounded-lg flex items-center justify-center'>
              <MapPin className='w-4 h-4 text-white' />
            </div>
            <span className='text-green-900 text-lg font-semibold'>
              Landkeeper
            </span>
          </div>

          <div className='mb-8'>
            <h2 className='text-2xl font-bold text-gray-900'>Sign in</h2>
            <p className='text-gray-500 mt-1 text-sm'>
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* Email */}
            <div className='space-y-1.5'>
              <Label
                htmlFor='email'
                className='text-sm font-medium text-gray-700'
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
                className='h-11 border-gray-200 focus:border-green-600 focus:ring-green-600'
              />
            </div>

            {/* Password */}
            <div className='space-y-1.5'>
              <div className='flex items-center justify-between'>
                <Label
                  htmlFor='password'
                  className='text-sm font-medium text-gray-700'
                >
                  Password
                </Label>
                <a
                  href='/auth/forgot-password'
                  className='text-xs text-green-700 hover:text-green-900 font-medium'
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
                  className='h-11 border-gray-200 focus:border-green-600 focus:ring-green-600 pr-10'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  {showPassword ? (
                    <EyeOff className='w-4 h-4' />
                  ) : (
                    <Eye className='w-4 h-4' />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type='submit'
              disabled={isLoading}
              className='w-full h-11 bg-green-900 hover:bg-green-800 text-white font-medium mt-2'
            >
              {isLoading ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <p className='text-center text-sm text-gray-500 mt-6'>
            Don&apos;t have an account?{' '}
            <a
              href='/auth/register'
              className='text-green-700 hover:text-green-900 font-medium'
            >
              Contact your administrator
            </a>
          </p>

          <p className='text-center text-xs text-gray-400 mt-8'>
            © {new Date().getFullYear()} Landkeeper. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
