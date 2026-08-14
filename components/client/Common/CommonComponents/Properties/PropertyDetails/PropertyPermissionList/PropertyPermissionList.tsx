import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import formatChoiceFieldValue, { getInitials } from '@/utils/formatters';
import { Ban, Eye, Mail, Pencil, Phone } from 'lucide-react';
import React from 'react';

interface User {
  title: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
}

interface PropertyPermission {
  alias: string;
  user: User;
  can_view: boolean;
  can_edit: boolean;
}

interface PropertyPermissionListProps {
  permissions?: PropertyPermission[];
}

const DUMMY_RESULTS: PropertyPermission[] = [
  {
    alias: '6f84a889-58a9-4806-8954-811a075706fa',
    user: {
      title: 'Mr',
      first_name: 'John',
      middle_name: 'A.',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      role: 'Advisor',
    },
    can_view: true,
    can_edit: true,
  },
  {
    alias: 'b3d1e2a4-4c9b-4f2a-8e6d-2a9f7c1b5e3d',
    user: {
      title: 'Ms',
      first_name: 'Priya',
      middle_name: 'R.',
      last_name: 'Sharma',
      email: 'priya.sharma@example.com',
      phone: '987-654-3210',
      role: 'Senior Advisor',
    },
    can_view: true,
    can_edit: false,
  },
  {
    alias: '9a7c5e1f-2b3d-4a8e-9f6c-1d4b8e2a7c5f',
    user: {
      title: 'Mr',
      first_name: 'Michael',
      last_name: 'Chen',
      email: 'michael.chen@example.com',
      phone: '555-123-4567',
      role: 'Advisor',
    },
    can_view: false,
    can_edit: false,
  },
  {
    alias: '1c4e7a2b-5f9d-4e3a-8b6c-3d7f1a9e5c2b',
    user: {
      title: 'Mrs',
      first_name: 'Sarah',
      middle_name: 'L.',
      last_name: 'Williams',
      email: 'sarah.williams@example.com',
      phone: '555-987-6543',
      role: 'Team Lead',
    },
    can_view: true,
    can_edit: true,
  },
];

const PropertyPermissionList: React.FC<PropertyPermissionListProps> = ({
  permissions = DUMMY_RESULTS,
}) => {
  const isEmpty = !permissions || permissions.length === 0;

  return (
    <div className='border-warning space-y-4 rounded-lg border border-dashed p-4'>
      <div>
        <h2 className='text-warning text-lg leading-none font-medium'>
          Property access
        </h2>
        <p className='text-muted-foreground mt-1 text-sm'>
          Mortgage advisers with permission to view or edit this property.
        </p>
      </div>

      {isEmpty ? (
        <div className='flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-12 text-center'>
          <Ban className='text-muted-foreground h-6 w-6' />
          <p className='text-muted-foreground text-sm'>
            No mortgage advisers have been given access to this property.
          </p>
        </div>
      ) : (
        <div className='grid gap-3 sm:grid-cols-2'>
          {permissions.map((permission) => {
            const fullName = `${permission.user.title} ${permission.user.first_name} ${permission.user.middle_name} ${permission.user.last_name}`;

            return (
              <Card key={permission.alias} className='shadow-sm'>
                <CardContent className='flex items-start gap-3 p-4'>
                  <Avatar className='h-10 w-10 shrink-0'>
                    <AvatarFallback className='bg-muted text-sm font-medium'>
                      {getInitials(permission.user.first_name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className='min-w-0 flex-1 space-y-2'>
                    <div>
                      <p className='truncate text-sm leading-none font-medium'>
                        {fullName}
                      </p>
                      <Badge variant='default' className='mt-1'>
                        {formatChoiceFieldValue(permission.user.role)}
                      </Badge>
                    </div>

                    <div className='text-muted-foreground space-y-1 text-xs'>
                      <a
                        href={`mailto:${permission.user.email}`}
                        className='hover:text-foreground flex items-center gap-1.5 truncate hover:underline'
                      >
                        <Mail className='h-3.5 w-3.5 shrink-0' />
                        <span className='truncate'>
                          {permission.user.email}
                        </span>
                      </a>
                      <a
                        href={`tel:${permission.user.phone}`}
                        className='hover:text-foreground flex items-center gap-1.5 hover:underline'
                      >
                        <Phone className='h-3.5 w-3.5 shrink-0' />
                        {permission.user.phone}
                      </a>
                    </div>

                    <div className='flex flex-wrap gap-1.5 pt-1'>
                      <Badge
                        variant={permission.can_view ? 'secondary' : 'outline'}
                        className='flex items-center gap-1 text-xs font-normal'
                      >
                        <Eye className='h-3 w-3' />
                        {permission.can_view ? 'Can view' : 'No view access'}
                      </Badge>
                      <Badge
                        variant={permission.can_edit ? 'secondary' : 'outline'}
                        className='flex items-center gap-1 text-xs font-normal'
                      >
                        <Pencil className='h-3 w-3' />
                        {permission.can_edit ? 'Can edit' : 'No edit access'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PropertyPermissionList;


