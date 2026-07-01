'use client';

import { Button } from '@/components/ui/button';
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
import { Download } from 'lucide-react';
import TenantRow from '../TenantRow/TenantRow';

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
      <div className='border-border flex items-center justify-between border-b px-6 py-4'>
        <h2 className='text-foreground text-base font-semibold'>All Tenants</h2>
        <div className='flex items-center gap-2'>
          <Input
            type='text'
            placeholder='Search tenants...'
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className='h-9! w-56 rounded-xl'
          />
          <Button variant='outline' size='lg' className='rounded-lg'>
            <Download />
          </Button>
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
                const apiTenant = apiTenantByAlias.get(tenant.id);
                if (!apiTenant) return null; // shouldn't happen, but keeps TS happy and avoids a crash
                return (
                  <TenantRow
                    key={tenant.id}
                    tenant={tenant}
                    apiTenant={apiTenant}
                    idx={idx}
                  />
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className='text-muted-foreground py-16 text-center text-sm'
                >
                  No tenants found for &quot;{search}&quot;
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
