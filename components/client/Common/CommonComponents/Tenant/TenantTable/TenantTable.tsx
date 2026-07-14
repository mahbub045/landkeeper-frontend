'use client';

import HoverInfoPopover from '@/components/common/HoverInfoPopover/HoverInfoPopover';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TenantTableProps } from '@/types/client/Common/Tenant/TenantTypes';
import { Search, User } from 'lucide-react';
import TenantRow from './TenantRow';

const TABLE_COLUMNS = [
  'Tenant',
  'Property',
  'Rent',
  'Start Date',
  'End Date',
  'Status',
  'Actions',
];

const TenantTable: React.FC<TenantTableProps> = ({
  tenants,
  search,
  apiTenants,
  onSearchChange,
  isLoading,
}) => {
  const apiTenantByAlias = new Map(apiTenants.map((t) => [t.alias, t]));

  return (
    <Card className='border-border overflow-hidden rounded-2xl pt-0 shadow-sm'>
      <div className='border-border flex items-center justify-between gap-1 border-b px-6 py-4'>
        <h2 className='text-foreground text-base font-semibold'>All Tenants</h2>
        <div className='flex items-center gap-1'>
          <div className='relative w-64'>
            <Search className='text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2' />
            <Input
              type='text'
              placeholder='Search tenants...'
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className='h-9! w-64 rounded-xl pr-8! pl-7!'
            />
            <HoverInfoPopover text='You can search using First Name, Last Name, Email and Phone.' />
          </div>

          {/* <Button variant='outline' size='lg' className='rounded-lg'>
            <Download />
          </Button> */}
        </div>
      </div>

      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              {TABLE_COLUMNS.map((col) => (
                <TableHead
                  key={col}
                  className='px-6 text-center text-xs font-semibold tracking-wider uppercase'
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className='p-0'>
                  <div className='space-y-3 p-6'>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className='h-14 w-full rounded-xl' />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ) : tenants.length > 0 ? (
              tenants.map((tenant, idx) => {
                const apiTenant = apiTenantByAlias.get(tenant.alias);
                if (!apiTenant) return null; // shouldn't happen, but keeps TS happy and avoids a crash
                return (
                  <TenantRow
                    key={tenant.alias}
                    tenant={tenant}
                    apiTenant={apiTenant}
                    idx={idx}
                  />
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className='py-16 text-center'>
                  <div className='text-muted-foreground flex flex-col items-center justify-center gap-2'>
                    <User className='size-10' />
                    <span className='text-sm'>No tenants found</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default TenantTable;
