'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CertificateRegistryProps,
  CertStatus,
} from '@/types/client/Landlord/Compliance/ComplianceTypes';

import { Download, Pencil } from 'lucide-react';

const TABLE_COLUMNS = [
  'Property',
  'Type',
  'Issue Date',
  'Expiry Date',
  'Status',
  'Actions',
];

const statusConfig: Record<CertStatus, { color: string; dot: string }> = {
  Valid: { color: 'bg-success/10 text-success', dot: 'bg-success' },
  Expired: { color: 'bg-danger/10 text-danger', dot: 'bg-danger' },
  'Expiring Soon': { color: 'bg-warning/10 text-warning', dot: 'bg-warning' },
};

const CertificateRegistry: React.FC<CertificateRegistryProps> = ({
  certificates,
}) => {
  return (
    <Card className='border-border overflow-hidden rounded-2xl pt-0 shadow-sm'>
      <CardHeader className='border-border border-b pb-3'>
        <CardTitle className='text-foreground text-base font-semibold'>
          Certificate Registry
        </CardTitle>
      </CardHeader>

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
            {certificates.map((cert) => {
              const { color, dot } = statusConfig[cert.status];
              return (
                <TableRow key={cert.id} className='text-center'>
                  <TableCell className='text-muted-foreground px-6 text-sm'>
                    {cert.property}
                  </TableCell>
                  <TableCell className='text-muted-foreground px-6 text-sm'>
                    <span className='flex items-center justify-center gap-2'>
                      <span className='text-primary'>✳</span>
                      {cert.type}
                    </span>
                  </TableCell>
                  <TableCell className='text-muted-foreground px-6 text-sm'>
                    {cert.issueDate}
                  </TableCell>
                  <TableCell className='text-muted-foreground px-6 text-sm'>
                    {cert.expiryDate}
                  </TableCell>
                  <TableCell className='px-6'>
                    <Badge
                      className={`gap-1.5 rounded-full px-3 py-1 text-xs font-semibold hover:bg-inherit ${color}`}
                    >
                      <span
                        className={`inline-block size-1.5 rounded-full ${dot}`}
                      />
                      {cert.status}
                    </Badge>
                  </TableCell>
                  <TableCell className='px-6'>
                    <div className='flex items-center justify-center gap-2'>
                      <Button
                        variant='outline'
                        size='icon'
                        className='rounded-lg'
                      >
                        <Download />
                      </Button>
                      <Button
                        variant='outline'
                        size='icon'
                        className='rounded-lg'
                      >
                        <Pencil />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default CertificateRegistry;
