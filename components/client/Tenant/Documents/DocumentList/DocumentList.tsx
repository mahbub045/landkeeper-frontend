'use client';
import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import Loading from '@/components/common/CustomLoader/Loading';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CERTIFICATE_STYLES } from '@/data/client/common/compliance/ComplianceData';
import { useDownloadFile } from '@/hooks/useDownloadFile';
import { useGetTenantDocumentsQuery } from '@/store/api/endpoints/client/Tenant/Documents/DocumentsApi';
import { CertificateDocument } from '@/types/client/Tenant/Documents/DocumentsType';
import formatChoiceFieldValue, { formatDateAndTime } from '@/utils/formatters';
import { Building2, Calendar, Download, Hash, UserCheck } from 'lucide-react';
import { useState } from 'react';

const DocumentList: React.FC = () => {
  const {
    data: documents,
    isLoading,
    isError,
  } = useGetTenantDocumentsQuery(undefined);

  const results = documents?.results || [];

  const { downloadFile, isDownloading } = useDownloadFile();
  const [downloadingFileAlias, setDownloadingFileAlias] = useState<
    string | null
  >(null);

  // Add this handler (near your other handlers)
  async function handleFileDownload(f: { file: string; alias: string }) {
    setDownloadingFileAlias(f.alias);
    try {
      await downloadFile({
        url: f.file,
        filename: f.file.split('/').pop() || 'certificate',
      });
    } finally {
      setDownloadingFileAlias(null);
    }
  }

  return (
    <div className='mt-8 w-full'>
      {isLoading && (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className='p-5'>
              <div className='h-4 w-24 animate-pulse rounded bg-gray-100' />
              <div className='mt-3 h-5 w-40 animate-pulse rounded bg-gray-100' />
              <div className='mt-4 space-y-2'>
                <div className='h-3 w-full animate-pulse rounded bg-gray-100' />
                <div className='h-3 w-3/4 animate-pulse rounded bg-gray-100' />
              </div>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <Card className='py-10 text-center'>
          <CustomErrorMessage title='documents' />
        </Card>
      )}

      {!isLoading && !isError && results.length === 0 && (
        <Card className='py-10 text-center'>
          <p className='text-sm text-gray-900'>No documents yet</p>
          <p className='mt-1 text-sm text-gray-500'>
            Compliance certificates for your properties will appear here.
          </p>
        </Card>
      )}

      {!isLoading && !isError && results.length > 0 && (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {results.map((doc: CertificateDocument) => (
            <Card key={doc.alias} className='flex flex-col gap-4 p-5 shadow-md'>
              <div className='flex items-start justify-between gap-2'>
                <Badge
                  size='lg'
                  className={
                    CERTIFICATE_STYLES[doc.certificate_type] ||
                    'bg-gray-100 text-gray-800'
                  }
                >
                  {formatChoiceFieldValue(doc.certificate_type)}
                </Badge>
                {doc.certificate_file ? (
                  <button
                    type='button'
                    disabled={downloadingFileAlias === doc.alias}
                    onClick={() =>
                      handleFileDownload({
                        file: doc.certificate_file as string,
                        alias: doc.alias,
                      })
                    }
                    title='Download certificate'
                    className='text-primary shrink-0 cursor-pointer rounded-md transition-colors hover:opacity-80 disabled:opacity-50'
                  >
                    {downloadingFileAlias === doc.alias ? (
                      <Loading className='size-4' />
                    ) : (
                      <Download className='size-4' />
                    )}
                  </button>
                ) : (
                  <div
                    className='text-muted-foreground flex items-center gap-1.5 text-xs'
                    title='No file available'
                  >
                    <Download className='size-4' />
                  </div>
                )}
              </div>

              <div className='flex items-center gap-2 text-sm font-medium'>
                <Building2 className='size-4 shrink-0 text-amber-600' />
                <span className='truncate'>
                  {doc.property?.property_name || '—'}
                </span>
              </div>

              <div className='space-y-2 text-sm'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground flex items-center gap-1.5'>
                    <Calendar className='size-3.5 text-emerald-600' />
                    Issue date
                  </span>
                  <small>
                    {doc.issue_date ? formatDateAndTime(doc.issue_date) : '—'}
                  </small>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground flex items-center gap-1.5'>
                    <Calendar className='size-3.5 text-violet-600' />
                    Expiry date
                  </span>
                  <small>
                    {doc.expiry_date ? formatDateAndTime(doc.expiry_date) : '—'}
                  </small>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground flex items-center gap-1.5'>
                    <Hash className='size-3.5 text-indigo-600' />
                    Certificate no.
                  </span>
                  <small className='truncate'>
                    {doc.certificate_number || '—'}
                  </small>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground flex items-center gap-1.5'>
                    <UserCheck className='size-3.5 text-rose-500' />
                    Issued by
                  </span>
                  <small className='truncate'>{doc.issued_by || '—'}</small>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentList;
