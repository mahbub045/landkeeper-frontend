'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
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
  Certificate,
  CertificateRegistryProps,
} from '@/types/client/Common/Compliance/ComplianceTypes';
import { FileBadge } from 'lucide-react';
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
  apiCertificates: ApiCertificate[];
}

const CertificateRegistry: React.FC<CertificateRegistryComponentProps> = ({
  certificates,
  isLoading,
  apiCertificates,
}) => {
  return (
    <Card className='border-border overflow-hidden rounded-2xl pt-0 shadow-sm'>
      <CardHeader className='border-border border-b pb-3'>
        <CardTitle className='text-foreground pt-3 text-base font-semibold'>
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
                  className='px-6 text-center text-xs font-semibold tracking-wider'
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
              certificates.map((cert: Certificate) => {
                const apiCertificate = apiCertificates.find(
                  (a) => a.alias === cert.alias,
                );
                if (!apiCertificate) return null;

                return (
                  <CertificateRow
                    key={cert.alias}
                    cert={cert}
                    apiCertificate={apiCertificate}
                  />
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default CertificateRegistry;
