import { members } from '@/data/landlord/teamAccess/TeamAccessData';
import { MemberList } from '../MemberList/MemberList';

const Members: React.FC = () => {
  return (
    <div className='bg-white dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-5 space-y-3'>
        <h2 className='text-sm font-semibold text-gray-900 dark:text-white mb-4'>Active Team Members</h2>
        {members.map((member) => (
          <MemberList key={member.id} member={member} />
        ))}
      </div>
  );
};

export default Members;