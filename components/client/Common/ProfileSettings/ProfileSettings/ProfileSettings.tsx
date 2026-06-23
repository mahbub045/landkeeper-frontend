'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useEditProfileInfoMutation,
  useGetProfileInfoQuery,
} from '@/store/api/endpoints/profile-settings/ProfileApi';
import formatChoiceFieldValue, { getInitials } from '@/utils/formatters';
import { Camera, Lock, Pencil } from 'lucide-react';

const ProfileSettings: React.FC = () => {
  const { data: profileData, isLoading } = useGetProfileInfoQuery(undefined);
  const [editProfileInfo, { isLoading: isEditing }] =
    useEditProfileInfoMutation();

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
                src={profileData?.profile_image ?? undefined}
                alt='Profile'
              />
              <AvatarFallback>
                {getInitials(profileData?.first_name) ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <button className='bg-primary text-primary-foreground absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full'>
              <Camera className='size-4' />
            </button>
          </div>
          <div className='flex-1'>
            <h3 className='text-lg font-semibold'>
              {formatChoiceFieldValue(profileData?.title) ?? ''}{' '}
              {profileData?.first_name} {profileData?.middle_name}{' '}
              {profileData?.last_name}
            </h3>
            <p className='text-muted-foreground text-sm'>
              {profileData?.email}
            </p>
          </div>
        </div>

        <div className='space-y-4'>
          <form>
            <div className='grid grid-cols-2 items-center gap-4'>
              <div className='flex flex-col items-start space-y-1.5'>
                <Label htmlFor='title'>Title</Label>
                <Select
                  defaultValue={profileData?.title ?? ''}
                  disabled={isLoading}
                >
                  <SelectTrigger id='title'>
                    <SelectValue placeholder='Select title' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='MR'>Mr</SelectItem>
                    <SelectItem value='MS'>Ms</SelectItem>
                    <SelectItem value='MRS'>Mrs</SelectItem>
                    <SelectItem value='MISS'>Miss</SelectItem>
                    <SelectItem value='DR'>Dr</SelectItem>
                    <SelectItem value='PROFESSOR'>Professor</SelectItem>
                    <SelectItem value='DOCTOR '>Doctor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='flex flex-col items-start space-y-1.5'>
                <Label htmlFor='first_name'>First Name</Label>
                <Input
                  type='text'
                  id='first_name'
                  defaultValue={profileData?.first_name ?? ''}
                  placeholder='First Name'
                  disabled={isLoading}
                />
              </div>
              <div className='flex flex-col items-start space-y-1.5'>
                <Label htmlFor='middle_name'>Middle Name</Label>
                <Input
                  type='text'
                  id='middle_name'
                  defaultValue={profileData?.middle_name ?? ''}
                  placeholder='Middle Name'
                  disabled={isLoading}
                />
              </div>
              <div className='flex flex-col items-start space-y-1.5'>
                <Label htmlFor='last_name'>Last Name</Label>
                <Input
                  type='text'
                  id='last_name'
                  defaultValue={profileData?.last_name ?? ''}
                  placeholder='Last Name'
                  disabled={isLoading}
                />
              </div>
            </div>
          </form>
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
