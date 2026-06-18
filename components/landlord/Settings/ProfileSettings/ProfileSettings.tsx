'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

const ProfileSettings: React.FC = () => {
  const [fullName, setFullName] = useState('John Davidson');
  const [email, setEmail] = useState('john.davidson@email.com');
  const [phone, setPhone] = useState('+44 7700 900123');
  const [company, setCompany] = useState('Davidson Property Holdings Ltd');

  return (
    <Card className='pt-0'>
      <CardContent className='space-y-5 p-6'>
        <h2 className='text-foreground text-sm font-semibold'>
          Profile Settings
        </h2>
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
        <Button>Save Changes</Button>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
