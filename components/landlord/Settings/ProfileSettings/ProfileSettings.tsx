'use client';

import { useState } from 'react';
import { FormField } from '../Settingscontrols/Settingscontrols';


export default function ProfileSettings() {
  const [fullName, setFullName] = useState('John Davidson');
  const [email, setEmail]       = useState('john.davidson@email.com');
  const [phone, setPhone]       = useState('+44 7700 900123');
  const [company, setCompany]   = useState('Davidson Property Holdings Ltd');

  return (
    <div className='bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-6 shadow-sm space-y-5'>
      <h2 className='text-sm font-semibold text-gray-900 dark:text-white'>Profile Settings</h2>
      <div className='space-y-4'>
        <FormField label='Full Name'    value={fullName} onChange={setFullName} />
        <FormField label='Email'        value={email}    onChange={setEmail}   type='email' />
        <FormField label='Phone'        value={phone}    onChange={setPhone}   type='tel' />
        <FormField label='Company Name' value={company}  onChange={setCompany} />
      </div>
      <button className='bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors'>
        Save Changes
      </button>
    </div>
  );
}