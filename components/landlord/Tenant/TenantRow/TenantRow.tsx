import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { avatarColors } from '@/data/landlord/tenant/TenantData';
import { Tenant } from '@/types/landlord/Tenant/TenantTypes';
import { getCurrencySign, getInitials } from '@/utils/formatters';
import { Eye, Mail } from 'lucide-react';

function avatarColor(idx: number) {
  return avatarColors[idx % avatarColors.length];
}

const TenantRow: React.FC<{ tenant: Tenant; idx: number }> = ({
  tenant,
  idx,
}) => {
  const isActive = tenant.status === 'Active';

  return (
    <TableRow className='text-center'>
      <TableCell>
        <div className='flex items-center justify-center gap-3'>
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(idx)}`}
          >
            {getInitials(tenant.name)}
          </div>
          <div>
            <p className='text-foreground text-sm font-semibold'>
              {tenant.name}
            </p>
            <p className='text-muted-foreground text-xs'>{tenant.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className='text-muted-foreground text-sm'>
        {tenant.property}
      </TableCell>
      <TableCell className='text-foreground text-sm font-bold'>
        {getCurrencySign()}
        {tenant.rent.toLocaleString('en-GB')}
      </TableCell>
      <TableCell className='text-muted-foreground text-sm'>
        {tenant.startDate}
      </TableCell>
      <TableCell className='text-muted-foreground text-sm'>
        {tenant.endDate}
      </TableCell>
      <TableCell>
        <Badge
          className={`gap-1.5 rounded-full px-3 py-1 text-xs font-semibold hover:bg-inherit ${isActive ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}
        >
          <span
            className={`inline-block size-1.5 rounded-full ${isActive ? 'bg-success' : 'bg-warning'}`}
          />
          {tenant.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className='flex items-center justify-center gap-2'>
          <Button variant='outline' size='icon' className='rounded-lg'>
            <Eye />
          </Button>
          <Button variant='outline' size='icon' className='rounded-lg'>
            <Mail />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TenantRow;
