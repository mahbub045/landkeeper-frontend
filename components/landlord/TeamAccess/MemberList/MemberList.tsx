import { getInitials } from '@/data/landlord/teamAccess/TeamAccessData';
import { TeamMember } from '@/types/landlord/TeamAccess/TeamAccessTypes';
import { Key, Pencil, Trash2 } from 'lucide-react';
import StatusBadge from '../StatusBadge/StatusBadge';

const MemberList: React.FC<{ member: TeamMember }> = ({ member }) => {
  return (
    <div className='flex items-center gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-4 dark:border-gray-700/50 dark:bg-gray-800/50'>
      {/* Avatar */}
      <div className='flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30'>
        <span className='text-sm font-bold text-blue-600 dark:text-blue-400'>
          {getInitials(member.name)}
        </span>
      </div>

      {/* Info */}
      <div className='min-w-0 flex-1'>
        <p className='text-sm font-bold text-gray-900 dark:text-white'>
          {member.name}
        </p>
        <p className='mt-0.5 text-xs text-gray-500 dark:text-gray-400'>
          {member.role} &bull; {member.email}
        </p>
        <p className='mt-0.5 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500'>
          <Key className='size-3 shrink-0' />
          {member.access}
        </p>
      </div>

      {/* Actions */}
      <div className='flex shrink-0 items-center gap-2'>
        <StatusBadge status={member.status} />
        <button
          aria-label='Edit'
          className='flex size-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
        >
          <Pencil className='size-3.5' />
        </button>
        <button
          aria-label='Remove'
          className='flex size-9 items-center justify-center rounded-xl bg-red-500 text-white transition-colors hover:bg-red-600'
        >
          <Trash2 className='size-3.5' />
        </button>
      </div>
    </div>
  );
};

export default MemberList;
