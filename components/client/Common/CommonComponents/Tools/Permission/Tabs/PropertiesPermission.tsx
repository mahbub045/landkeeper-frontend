'use client';

import { AuthUser } from '@/types/auth/AuthUsersType';

export interface PropertiesPermissionProps {
  authUsers?: AuthUser;
}

const PropertiesPermission: React.FC<PropertiesPermissionProps> = ({ authUsers }) => {
  return (
    <div>
      <h2 className='mb-2 text-lg font-semibold'>Properties Permission</h2>
      {/* Properties permission content/table goes here */}
    </div>
  );
};

export default PropertiesPermission;
