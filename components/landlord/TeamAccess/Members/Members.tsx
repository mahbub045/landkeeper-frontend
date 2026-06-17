import { members } from '@/data/landlord/teamAccess/TeamAccessData';
import MemberList from '../MemberList/MemberList';

const Members: React.FC = () => {
  return (
    <div className='space-y-3 rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-700/50 dark:bg-gray-800/30'>
      <h2 className='mb-4 text-sm font-semibold text-gray-900 dark:text-white'>
        Active Team Members
      </h2>
      {members.map((member) => (
        <MemberList key={member.id} member={member} />
      ))}
    </div>
  );
};

export default Members;
