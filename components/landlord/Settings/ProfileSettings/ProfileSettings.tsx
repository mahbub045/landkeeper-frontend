'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { FormField } from '../Settingscontrols/Settingscontrols';

const ProfileSettings: React.FC = () => {
  const [fullName, setFullName] = useState('John Davidson');
  const [email, setEmail] = useState('john.davidson@email.com');
  const [phone, setPhone] = useState('+44 7700 900123');
  const [company, setCompany] = useState('Davidson Property Holdings Ltd');

  return (
    <div className='space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700/50 dark:bg-gray-800/50'>
      <h2 className='text-sm font-semibold text-gray-900 dark:text-white'>
        Profile Settings
      </h2>
      <div className='space-y-4'>
        <FormField label='Full Name' value={fullName} onChange={setFullName} />
        <FormField
          label='Email'
          value={email}
          onChange={setEmail}
          type='email'
        />
        <FormField label='Phone' value={phone} onChange={setPhone} type='tel' />
        <FormField label='Company Name' value={company} onChange={setCompany} />
      </div>
      <Button>Save Changes</Button>
    </div>
  );
};

export default ProfileSettings;
