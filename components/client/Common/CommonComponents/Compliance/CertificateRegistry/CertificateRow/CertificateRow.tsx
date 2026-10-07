'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  CERT_STATUS_CONFIG,
  getCertStatus,
} from '@/data/client/Common/Compliance/ComplianceData';
import { useAppSelector } from '@/store/hooks';
import { CertificateRowProps } from '@/types/client/Common/Compliance/ComplianceTypes';
import { formatDate } from '@/utils/formatters';
import { getComplianceDetailsUrl } from '@/utils/redirectPath';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const humanizeCertType = (type: string) =>
  type
    .toLowerCase()
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');

const CertificateRow: React.FC<CertificateRowProps> = ({ cert, index }) => {
  const { data: session } = useSession();
  const landlordAlias = useAppSelector(
    (state) => state.landlordAlias.landlordAlias,
  );
  const status = getCertStatus(cert.expiry_date);
  const { color, dot } = CERT_STATUS_CONFIG[status];

  return (
    <>
      <TableRow className='text-centers'>
        <TableCell className='text-sm'>{index + 1}.</TableCell>
        <TableCell className='text-sm'>
          <Link
            href={getComplianceDetailsUrl(session, cert.alias, landlordAlias)}
            className='text_decoration_hover flex items-center justify-start gap-2'
          >
            <span className='text-primary'>✳</span>
            {cert.certificate_type ? (
              humanizeCertType(cert.certificate_type)
            ) : (
              <span className='text-muted-foreground text-xs'>
                Not Available
              </span>
            )}
          </Link>
        </TableCell>
        <TableCell className='text-sm'>
          {cert.property?.property_name || (
            <span className='text-muted-foreground text-xs'>Not Available</span>
          )}
        </TableCell>

        <TableCell className='text-sm'>
          {cert.certificate_number || (
            <span className='text-muted-foreground text-xs'>Not Available</span>
          )}
        </TableCell>
        <TableCell className='text-sm'>
          <div className='flex flex-col gap-0.5'>
            <span>
              Issue:{' '}
              {formatDate(cert.issue_date) || (
                <span className='text-muted-foreground text-xs'>
                  Not Available
                </span>
              )}
            </span>
            <span>
              Expiry:{' '}
              {formatDate(cert.expiry_date) || (
                <span className='text-muted-foreground text-xs'>
                  Not Available
                </span>
              )}
            </span>
          </div>
        </TableCell>
        <TableCell className='text-center'>
          {cert.certificate_file ? (
            <Button variant='outline' size='sm' className='rounded-lg' asChild>
              <a
                href={cert.certificate_file}
                target='_blank'
                rel='noopener noreferrer'
              >
                View
              </a>
            </Button>
          ) : (
            <span className='text-muted-foreground text-xs'>Not Available</span>
          )}
        </TableCell>
        <TableCell className='text-center'>
          <Badge
            className={`gap-1.5 rounded-full px-3 py-1 text-xs font-semibold hover:bg-inherit ${color}`}
          >
            <span className={`inline-block size-1.5 rounded-full ${dot}`} />
            {status ?? (
              <span className='text-muted-foreground text-xs'>
                Not Available
              </span>
            )}
          </Badge>
        </TableCell>
      </TableRow>
    </>
  );
};

export default CertificateRow;
