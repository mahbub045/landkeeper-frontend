'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TeamMember } from '@/types/landlord/TeamAccess/TeamAccessTypes';
import { getInitials } from '@/utils/formatters';
import { Key, Pencil, Trash2 } from 'lucide-react';

const MemberList: React.FC<{ member: TeamMember }> = ({ member }) => {
  const isActive = member.status === 'Active';

  return (
    <Card>
      <CardContent className='flex items-center gap-4 px-4 py-4'>
        {/* Avatar */}
        <div className='bg-primary/10 flex size-11 shrink-0 items-center justify-center rounded-full'>
          <span className='text-primary text-sm font-bold'>
            {getInitials(member.name)}
          </span>
        </div>

        {/* Info */}
        <div className='min-w-0 flex-1'>
          <p className='text-foreground text-sm font-bold'>{member.name}</p>
          <p className='text-muted-foreground mt-0.5 text-xs'>
            {member.role} &bull; {member.email}
          </p>
          <p className='text-muted-foreground/70 mt-0.5 flex items-center gap-1 text-xs'>
            <Key className='size-3 shrink-0' />
            {member.access}
          </p>
        </div>

        {/* Actions */}
        <div className='flex shrink-0 items-center gap-2'>
          <Badge
            className={`gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold hover:bg-inherit ${isActive ? 'border-success/30 bg-success/10 text-success' : 'border-warning/30 bg-warning/10 text-warning'}`}
          >
            <span
              className={`inline-block size-1.5 rounded-full ${isActive ? 'bg-success' : 'bg-warning'}`}
            />
            {member.status}
          </Badge>
          <Button
            aria-label='Edit'
            variant='outline'
            size='icon'
            className='rounded-lg'
          >
            <Pencil />
          </Button>
          <Button
            aria-label='Remove'
            variant='danger'
            size='icon'
            className='rounded-lg'
          >
            <Trash2 />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberList;
