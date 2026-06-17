'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import {
  CertStatus,
  CertificateRegistryProps,
} from '@/types/landlord/Compliance/ComplianceTypes';

import { Download, Pencil } from 'lucide-react';

const TABLE_COLUMNS = [
  'Property',
  'Type',
  'Issue Date',
  'Expiry Date',
  'Status',
  'Actions',
];

function StatusBadge({ status }: { status: CertStatus }) {
  if (status === 'Valid') {
    return (
      <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'>
        <span className='inline-block size-1.5 rounded-full bg-emerald-500' />
        Valid
      </span>
    );
  }
  if (status === 'Expired') {
    return (
      <span className='inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400'>
        <span className='inline-block size-1.5 rounded-full bg-red-500' />
        Expired
      </span>
    );
  }
  return (
    <span className='inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'>
      <span className='inline-block size-1.5 rounded-full bg-amber-500' />
      Expiring Soon
    </span>
  );
}

const CertificateRegistry: React.FC<CertificateRegistryProps> = ({
  certificates,
}) => {
  return (
    <Card className='overflow-hidden rounded-2xl border border-gray-100 shadow-sm dark:border-gray-700/50'>
      <CardHeader className='border-b border-gray-100 pb-3 dark:border-gray-700/50'>
        <CardTitle className='text-base font-semibold text-gray-900 dark:text-white'>
          Certificate Registry
        </CardTitle>
      </CardHeader>

      <div className='overflow-x-auto'>
        <Table className='w-full'>
          <thead>
            <tr className='border-b border-gray-100 dark:border-gray-700/50'>
              {TABLE_COLUMNS.map((col) => (
                <th
                  key={col}
                  className='px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400'
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100 dark:divide-gray-700/50'>
            {certificates.map((cert) => (
              <tr
                key={cert.id}
                className='transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40'
              >
                <td className='px-6 py-4 text-sm text-gray-700 dark:text-gray-300'>
                  {cert.property}
                </td>

                <td className='px-6 py-4 text-sm text-gray-700 dark:text-gray-300'>
                  <span className='flex items-center gap-2'>
                    <span className='text-blue-500'>✳</span>
                    {cert.type}
                  </span>
                </td>

                <td className='px-6 py-4 text-sm text-gray-700 dark:text-gray-300'>
                  {cert.issueDate}
                </td>

                <td className='px-6 py-4 text-sm text-gray-700 dark:text-gray-300'>
                  {cert.expiryDate}
                </td>

                <td className='px-6 py-4'>
                  <StatusBadge status={cert.status} />
                </td>

                <td className='px-6 py-4'>
                  <div className='flex items-center gap-2'>
                    <Button variant='outline'>
                      <Download className='size-4' />
                    </Button>
                    <Button variant='outline'>
                      <Pencil className='size-4' />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default CertificateRegistry;
