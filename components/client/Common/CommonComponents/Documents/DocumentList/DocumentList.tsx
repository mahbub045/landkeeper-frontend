'use client';

import {
  Eye,
  File,
  FileImage,
  Files,
  FileText,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { categoryLabelMap } from '@/data/client/common/documents/DocumentsData';
import {
  DocCategory,
  PropertyDocument,
} from '@/types/client/Common/Documents/DocumentTypes';
import DeleteDocumentDialog from '../Dialogs/DeleteDocumentDialog';
import UpdateDocumentDialog from '../Dialogs/UpdateDocumentDialog';

function DocIcon({ category }: { category: DocCategory }) {
  const isPhoto = category === 'PROPERTY_PHOTO';

  return (
    <div
      className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
        isPhoto ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
      }`}
    >
      {isPhoto ? (
        <FileImage className='size-5' />
      ) : (
        <FileText className='size-5' />
      )}
    </div>
  );
}

// Pulls a reasonable filename out of the file URL (strips query
// params, decodes percent-encoding).
function getFileName(url: string): string {
  try {
    const path = new URL(url).pathname;
    const last = path.substring(path.lastIndexOf('/') + 1);
    return decodeURIComponent(last) || 'document';
  } catch {
    return 'document';
  }
}

interface DocumentListProps {
  documents: PropertyDocument[];
  activeFilterLabel: string;
  isLoading?: boolean;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  activeFilterLabel,
  isLoading,
}) => {
  const [downloadingAlias, setDownloadingAlias] = useState<string | null>(null);
  const [editingDoc, setEditingDoc] = useState<PropertyDocument | null>(null);
  const [deletingDoc, setDeletingDoc] = useState<PropertyDocument | null>(null);

  if (isLoading) {
    return (
      <div className='space-y-3 px-6 py-2'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className='h-27 w-full rounded-xl' />
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className='px-4 py-2'>
        <Card className='border-none shadow-none'>
          <CardContent className='py-10 text-center'>
            <div className='text-muted-foreground flex flex-col items-center justify-center gap-2'>
              <Files className='size-10' />
              <span className='text-sm'>
                {activeFilterLabel === 'All'
                  ? 'No documents found'
                  : `No documents found for "${activeFilterLabel}"`}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  function handleDownload(doc: PropertyDocument) {
    const fileUrl = doc.files[0]?.file;
    if (!fileUrl) return;

    const filename = getFileName(fileUrl);

    setDownloadingAlias(doc.alias);

    const proxyUrl = `/api/document-download?url=${encodeURIComponent(
      fileUrl,
    )}&filename=${encodeURIComponent(filename)}`;

    const link = document.createElement('a');
    link.href = proxyUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadingAlias(null), 800);
  }

  return (
    <div className='space-y-3 px-4 py-2'>
      {documents.map((doc) => {
        return (
          <Card
            key={doc.alias}
            className='hover:bg-accent/30 transition-colors'
          >
            <CardContent className='flex items-center gap-4 p-4'>
              <DocIcon category={doc.document_category} />

              <div className='min-w-0 flex-1'>
                <p className='text-foreground truncate text-sm font-semibold'>
                  {doc.document_name}
                </p>

                <p className='text-muted-foreground mt-0.5 text-xs'>
                  {doc.property.property_name} •{' '}
                  {categoryLabelMap[doc.document_category]} • {doc.files.length}{' '}
                  file{doc.files.length === 1 ? '' : 's'}
                </p>
              </div>

              <div className='flex shrink-0 items-center gap-2'>
                <div className='text-center'>
                  {doc.files.length === 0 ? (
                    <Button variant='outline' size='sm' disabled>
                      <Eye />
                      View
                    </Button>
                  ) : doc.files.length === 1 ? (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => window.open(doc.files[0].file, '_blank')}
                    >
                      <Eye />
                      View
                    </Button>
                  ) : (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant='outline' size='sm'>
                          <Eye />
                          View ({doc.files.length})
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-64 p-2' align='center'>
                        <ul className='space-y-1'>
                          {doc.files.map((d) => {
                            const filename =
                              d.file.split('/').pop() || `file-${d.id}`;
                            return (
                              <li key={d.id}>
                                <a
                                  href={d.file}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='hover:bg-muted flex items-center gap-1 rounded-md px-2 py-1.5 text-sm'
                                >
                                  <File size='14' />
                                  <span className='truncate'>{filename}</span>
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>

                <Button
                  variant='outline'
                  size='icon'
                  aria-label='Edit'
                  title='Edit Document'
                  onClick={() => setEditingDoc(doc)}
                >
                  <Pencil />
                </Button>

                <Button
                  variant='destructive'
                  size='icon'
                  aria-label='Delete'
                  title='Delete Document'
                  onClick={() => setDeletingDoc(doc)}
                >
                  <Trash2 />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <UpdateDocumentDialog
        document={editingDoc}
        open={!!editingDoc}
        onClose={() => setEditingDoc(null)}
        onSuccess={() => {}}
      />

      <DeleteDocumentDialog
        open={!!deletingDoc}
        onClose={() => setDeletingDoc(null)}
        onSuccess={() => {}}
        documentAlias={deletingDoc?.alias ?? ''}
        documentName={deletingDoc?.document_name ?? ''}
      />
    </div>
  );
};

export default DocumentList;
