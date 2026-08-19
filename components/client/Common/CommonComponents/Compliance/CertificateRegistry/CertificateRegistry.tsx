'use client';

import HoverInfoPopover from '@/components/common/HoverInfoPopover/HoverInfoPopover';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  ApiCertificate,
  CertificateRegistryProps,
} from '@/types/client/Common/Compliance/ComplianceTypes';
import { FileBadge, Plus, Search } from 'lucide-react';
import CertificateRow from '../CertificateRow/CertificateRow';

const TABLE_COLUMNS = [
  'Property',
  'Type',
  'Certificate No',
  'Issue & Expiry Date',
  'Documents',
  'Status',
  'Actions',
];

interface CertificateRegistryComponentProps extends CertificateRegistryProps {
  isLoading?: boolean;
  search: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddClick: () => void;
}

const CertificateRegistry: React.FC<CertificateRegistryComponentProps> = ({
  certificates,
  isLoading,
  search,
  onSearchChange,
  onAddClick,
}) => {
  return (
    <Card className='border-border overflow-hidden rounded-2xl pt-0 shadow-sm'>
      <CardHeader className='border-border flex flex-col gap-4 border-b pb-3 sm:flex-row sm:items-center sm:justify-between'>
        <CardTitle className='text-foreground pt-3 text-base font-semibold'>
          Certificate Registry
        </CardTitle>

        <div className='flex items-center gap-2 pt-4'>
          <div className='relative w-64'>
            <Search className='text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2' />
            <Input
              type='text'
              placeholder='Search...'
              value={search}
              onChange={onSearchChange}
              className='h-8! w-64 pr-8! pl-7!'
            />
            <HoverInfoPopover text='You can search using Property Name and Certificate Type.' />
          </div>

          <Button onClick={onAddClick}>
            <Plus />
            Add Certificate
          </Button>
        </div>
      </CardHeader>

      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              {TABLE_COLUMNS.map((col) => (
                <TableHead
                  key={col}
                  className='px-6 text-center font-semibold tracking-wider'
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={TABLE_COLUMNS.length}
                  className='text-muted-foreground py-6 text-center text-sm'
                >
                  <div className='flex flex-col gap-3'>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className='h-14 w-full rounded-xl' />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ) : certificates.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={TABLE_COLUMNS.length}
                  className='text-muted-foreground py-30 text-center text-sm'
                >
                  <div className='text-muted-foreground flex flex-col items-center justify-center gap-2'>
                    <FileBadge className='size-10' />
                    <span className='text-sm'>No certificates found</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              certificates.map((cert: ApiCertificate) => {
                return <CertificateRow key={cert.alias} cert={cert} />;
              })
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default CertificateRegistry;
