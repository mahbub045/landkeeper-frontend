'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getInitials } from '@/utils/formatters';
import { Camera, Lock, Pencil } from 'lucide-react';
import { useState } from 'react';

const ProfileSettings: React.FC = () => {
  const [fullName, setFullName] = useState('John Davidson');
  const [email, setEmail] = useState('john.davidson@email.com');
  const [phone, setPhone] = useState('+44 7700 900123');
  const [company, setCompany] = useState('Davidson Property Holdings Ltd');

  return (
    <Card className='pt-0'>
      <CardContent className='space-y-5 p-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-foreground text-sm font-semibold'>
            Profile Settings
          </h2>
        </div>

        <div className='flex items-center gap-4'>
          <div className='relative'>
            <Avatar size='default' className='size-16'>
              <AvatarImage
                src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
                alt='Profile'
              />
              <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
            </Avatar>
            <button className='bg-primary text-primary-foreground absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full'>
              <Camera className='size-4' />
            </button>
          </div>
          <div className='flex-1'>
            <h3 className='text-lg font-semibold'>{fullName}</h3>
            <p className='text-muted-foreground text-sm'>{email}</p>
          </div>
        </div>

        <div className='space-y-4'>
          {[
            { label: 'Full Name', value: fullName, onChange: setFullName },
            { label: 'Email', value: email, onChange: setEmail, type: 'email' },
            { label: 'Phone', value: phone, onChange: setPhone, type: 'tel' },
            { label: 'Company Name', value: company, onChange: setCompany },
          ].map(({ label, value, onChange, type = 'text' }) => (
            <div key={label} className='space-y-1.5'>
              <Label className='text-sm font-semibold'>{label}</Label>
              <Input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className='rounded-xl'
              />
            </div>
          ))}
        </div>

        <div className='flex gap-3'>
          <Button>
            <Pencil />
            Save Changes
          </Button>
          <Button variant='danger'>
            <Lock />
            Reset Password
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
