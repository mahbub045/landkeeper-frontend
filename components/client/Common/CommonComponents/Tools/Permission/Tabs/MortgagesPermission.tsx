'use client';

import { AuthUser } from '@/types/auth/AuthUsersType';

export interface MortgagesPermissionProps {
  authUsers?: AuthUser;
}

const MortgagesPermission: React.FC<MortgagesPermissionProps> = ({
  authUsers,
}) => {
  return (
    <div>
      <h2 className='mb-2 text-lg font-semibold'>Mortgages Permission</h2>
      {/* Mortgages permission content/table goes here */}
    </div>
  );
};

export default MortgagesPermission;
