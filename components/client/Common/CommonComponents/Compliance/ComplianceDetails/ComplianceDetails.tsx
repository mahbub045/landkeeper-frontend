'use client';

import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CERT_STATUS_CONFIG,
  CERTIFICATE_OPTIONS,
  CERTIFICATE_STYLES,
  getCertStatus,
  getDaysUntilExpiry,
} from '@/data/client/Common/Compliance/ComplianceData';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useGetComplianceDetailsQuery } from '@/store/api/endpoints/client/Common/Compliance/ComplianceApi';
import { useAppSelector } from '@/store/hooks';
import { ApiCertificate } from '@/types/client/Common/Compliance/ComplianceTypes';
import formatChoiceFieldValue, {
  formatDate,
  formatDateAndTime,
} from '@/utils/formatters';
import { getComplianceUrl, getPropertyDetailsUrl } from '@/utils/redirectPath';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CalendarCheck,
  CalendarX,
  Check,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  FileX,
  Hash,
  Pencil,
  ShieldUser,
  Trash,
  UserCheck,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import ViewCertificateSharesDialog from '../CertificateRegistry/Dialogs/ViewCertificateSharesDialog';
import DeleteCertificateDialog from '../Dialogs/DeleteCertificateDialog';
import UpdateCertificateDialog from '../Dialogs/UpdateCertificateDialog';

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];

const getFileExtension = (url: string) =>
  url.split('?')[0].split('.').pop()?.toLowerCase() ?? '';

const getCertificateLabel = (type: string) =>
  CERTIFICATE_OPTIONS.find((option) => option.value === type)?.label ??
  formatChoiceFieldValue(type);

const getExpiryText = (daysUntilExpiry: number) => {
  if (daysUntilExpiry < 0)
    return `Expired ${Math.abs(daysUntilExpiry)} day${Math.abs(daysUntilExpiry) === 1 ? '' : 's'} ago`;
  if (daysUntilExpiry === 0) return 'Expires today';
  return `Expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'}`;
};

const ComplianceDetails: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { compliancealias } = useParams<{ compliancealias: string }>();
  const landlordAlias = useAppSelector(
    (state) => state.landlordAlias.landlordAlias,
  );
  const { copy, isCopied } = useCopyToClipboard();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [sharesOpen, setSharesOpen] = useState(false);

  const { data, isLoading, isError } = useGetComplianceDetailsQuery(
    compliancealias,
    { skip: !compliancealias },
  );

  const certificate: ApiCertificate | undefined = data;

  if (isLoading) {
    return (
      <div className='mx-auto'>
        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <Skeleton className='mb-2 h-7 w-64' />
            <Skeleton className='h-4 w-56' />
          </div>
          <div className='flex flex-wrap gap-2'>
            <Skeleton className='h-9 w-20' />
            <Skeleton className='h-9 w-24' />
            <Skeleton className='h-9 w-20' />
            <Skeleton className='h-9 w-20' />
          </div>
        </div>

        <div className='mb-6 rounded-xl border p-5 sm:p-6'>
          <Skeleton className='mb-2 h-5 w-40' />
          <Skeleton className='mb-3 h-7 w-80 max-w-full' />
          <div className='flex gap-2'>
            <Skeleton className='h-5 w-20 rounded-full' />
            <Skeleton className='h-5 w-32 rounded-full' />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            <div className='rounded-xl border p-5 sm:p-6'>
              <Skeleton className='mb-4 h-4 w-40' />
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className='flex items-start gap-3'>
                    <Skeleton className='size-4 shrink-0 rounded' />
                    <div className='min-w-0 flex-1'>
                      <Skeleton className='mb-1 h-3 w-20' />
                      <Skeleton className='h-4 w-32' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className='rounded-xl border p-5 sm:p-6'>
              <Skeleton className='mb-4 h-4 w-24' />
              <Skeleton className='h-80 w-full rounded-lg' />
            </div>
          </div>

          <div className='space-y-6'>
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className='rounded-xl border p-5'>
                <Skeleton className='mb-4 h-4 w-24' />
                <div className='flex items-start gap-3'>
                  <Skeleton className='size-9 shrink-0 rounded-full' />
                  <div className='min-w-0 flex-1'>
                    <Skeleton className='mb-1 h-3 w-16' />
                    <Skeleton className='h-4 w-32' />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !certificate) {
    return (
      <div className='mx-auto w-full max-w-6xl py-16'>
        <CustomErrorMessage title='certificate' />
      </div>
    );
  }

  const status = getCertStatus(certificate.expiry_date);
  const { color, dot } = CERT_STATUS_CONFIG[status];
  const daysUntilExpiry = getDaysUntilExpiry(certificate.expiry_date);
  const fileExtension = certificate.certificate_file
    ? getFileExtension(certificate.certificate_file)
    : '';

  const infoItems = [
    {
      icon: FileText,
      label: 'Certificate Type',
      value: certificate.certificate_type
        ? getCertificateLabel(certificate.certificate_type)
        : null,
    },
    {
      icon: Hash,
      label: 'Certificate Number',
      value: certificate.certificate_number,
    },
    {
      icon: CalendarCheck,
      label: 'Issue Date',
      value: formatDate(certificate.issue_date),
    },
    {
      icon: CalendarX,
      label: 'Expiry Date',
      value: formatDate(certificate.expiry_date),
    },
    { icon: UserCheck, label: 'Issued By', value: certificate.issued_by },
  ];

  return (
    <div className='mx-auto'>
      <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-foreground text-2xl font-bold tracking-tight'>
            Certificate Details
          </h1>
          <p className='text-muted-foreground text-sm'>
            View and manage this compliance certificate
          </p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Button variant='outline' onClick={() => window.history.back()}>
            <ArrowLeft className='size-4' />
            Back
          </Button>
          <Button variant='secondary' onClick={() => setSharesOpen(true)}>
            <ShieldUser />
            Shares
          </Button>
          <Button variant='default' onClick={() => setEditOpen(true)}>
            <Pencil />
            Edit
          </Button>
          <Button variant='destructive' onClick={() => setDeleteOpen(true)}>
            <Trash />
            Delete
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className='mb-6 rounded-xl border p-5 sm:p-6'>
        <div className='mb-2 flex flex-wrap items-center gap-2'>
          <span className='font-mono text-lg font-medium tracking-wide'>
            {certificate.certificate_number || 'No certificate number'}
          </span>
          {certificate.certificate_number && (
            <button
              onClick={() =>
                copy(certificate.alias, certificate.certificate_number, {
                  successMessage: 'Certificate number copied to clipboard.',
                })
              }
              className='cursor-pointer rounded-md transition-colors'
              aria-label='Copy certificate number'
              title='Copy certificate number'
            >
              {isCopied(certificate.alias) ? (
                <Check className='text-success size-4' />
              ) : (
                <Copy className='text-primary size-4' />
              )}
            </button>
          )}
        </div>
        <h2 className='text-xl font-semibold sm:text-2xl'>
          {certificate.certificate_type
            ? getCertificateLabel(certificate.certificate_type)
            : 'Certificate'}
        </h2>
        <div className='mt-2 flex flex-wrap items-center gap-2'>
          <Badge
            className={`gap-1.5 rounded-full px-3 py-1 text-xs font-semibold hover:bg-inherit ${color}`}
          >
            <span className={`inline-block size-1.5 rounded-full ${dot}`} />
            {status}
          </Badge>
          {certificate.certificate_type && (
            <Badge
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                CERTIFICATE_STYLES[certificate.certificate_type] ??
                'bg-gray-100 text-gray-800'
              }`}
            >
              {formatChoiceFieldValue(certificate.certificate_type)}
            </Badge>
          )}
          <span className='text-muted-foreground text-xs'>
            {getExpiryText(daysUntilExpiry)}
          </span>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Main column */}
        <div className='space-y-6 lg:col-span-2'>
          <section className='rounded-xl border p-5 sm:p-6'>
            <h2 className='mb-4 text-sm font-semibold'>
              Certificate Information
            </h2>
            <dl className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              {infoItems.map(({ icon: Icon, label, value }) => (
                <div key={label} className='flex items-start gap-3'>
                  <Icon className='text-primary mt-0.5 size-4 shrink-0' />
                  <div className='min-w-0'>
                    <dt className='text-muted-foreground text-xs'>{label}</dt>
                    <dd className='text-sm font-medium wrap-break-word'>
                      {value || (
                        <span className='text-muted-foreground text-xs font-normal'>
                          Not Available
                        </span>
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          <section className='rounded-xl border p-5 sm:p-6'>
            <div className='mb-4 flex items-center justify-between gap-2'>
              <h2 className='text-sm font-semibold'>Document</h2>
              {certificate.certificate_file && (
                <Button variant='outline' size='sm' asChild>
                  <a
                    href={certificate.certificate_file}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <ExternalLink className='size-4' />
                    Open
                  </a>
                </Button>
              )}
            </div>
            {!certificate.certificate_file ? (
              <div className='flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-10'>
                <FileX className='text-muted-foreground size-6' />
                <p className='text-muted-foreground text-sm'>
                  No document was uploaded
                </p>
              </div>
            ) : IMAGE_EXTENSIONS.includes(fileExtension) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={certificate.certificate_file}
                alt={`Certificate document for ${certificate.certificate_number}`}
                className='max-h-150 w-full rounded-lg border object-contain'
              />
            ) : fileExtension === 'pdf' ? (
              <iframe
                src={certificate.certificate_file}
                title='Certificate document'
                className='h-150 w-full rounded-lg border'
              />
            ) : (
              <div className='flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-10'>
                <FileText className='text-muted-foreground size-6' />
                <p className='text-muted-foreground text-sm'>
                  Preview isn&apos;t available for this file type. Use Open to
                  view it.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          <section className='rounded-xl border p-5'>
            <h2 className='mb-4 text-sm font-semibold'>Property</h2>
            <div className='flex items-start gap-3'>
              <span className='bg-primary/10 flex size-9 shrink-0 items-center justify-center rounded-full'>
                <Building2 className='size-4' />
              </span>
              <div className='min-w-0'>
                <p className='text-muted-foreground text-xs'>Property name</p>
                {certificate.property?.alias ? (
                  <Link
                    href={getPropertyDetailsUrl(
                      session,
                      certificate.property.alias,
                      landlordAlias,
                    )}
                    className='text-primary text-sm font-medium hover:underline'
                  >
                    {certificate.property.property_name}
                  </Link>
                ) : (
                  <span className='text-muted-foreground text-xs'>
                    Not Available
                  </span>
                )}
              </div>
            </div>
          </section>

          <section className='rounded-xl border p-5'>
            <h2 className='mb-4 text-sm font-semibold'>Timeline</h2>
            <dl className='space-y-4'>
              <div className='flex items-start gap-3'>
                <Calendar className='mt-0.5 size-4 shrink-0' />
                <div className='min-w-0'>
                  <dt className='text-muted-foreground text-xs'>Added</dt>
                  <dd className='text-sm font-medium'>
                    {formatDateAndTime(certificate.created_at)}
                  </dd>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <Clock className='mt-0.5 size-4 shrink-0' />
                <div className='min-w-0'>
                  <dt className='text-muted-foreground text-xs'>
                    Last updated
                  </dt>
                  <dd className='text-sm font-medium'>
                    {formatDateAndTime(certificate.updated_at)}
                  </dd>
                </div>
              </div>
            </dl>
          </section>
        </div>
      </div>

      {/* Dialogs */}
      <ViewCertificateSharesDialog
        open={sharesOpen}
        onClose={() => setSharesOpen(false)}
        selectedCertificate={certificate}
        propertyAlias={certificate.property?.alias || ''}
        complianceAlias={certificate.alias}
      />

      <UpdateCertificateDialog
        key={certificate.updated_at}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={() => setEditOpen(false)}
        certificate={certificate}
      />

      <DeleteCertificateDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onSuccess={() => router.push(getComplianceUrl(session, landlordAlias))}
        certificateAlias={certificate.alias}
      />
    </div>
  );
};

export default ComplianceDetails;
