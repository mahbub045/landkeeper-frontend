import { Card, CardContent } from '@/components/ui/card';
import { members } from '@/data/client/Landlord/tools/teamAccess/TeamAccessData';
import MemberList from '../MemberList/MemberList';

const Members: React.FC = () => {
  return (
    <Card>
      <CardContent className='space-y-3 p-5'>
        <h2 className='text-foreground mb-4 text-sm font-semibold'>
          Active Team Members
        </h2>
        {members.map((member) => (
          <MemberList key={member.id} member={member} />
        ))}
      </CardContent>
    </Card>
  );
};

export default Members;
