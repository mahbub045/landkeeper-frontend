'use client';

import {
  Download,
  FileImage,
  Files,
  FileText,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

import Loading from '@/components/common/CustomLoader/Loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

function parseTags(tags: string): string[] {
  return tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
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
        const tags = parseTags(doc.tags);

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

                {tags.length > 0 && (
                  <div className='mt-2 flex flex-wrap gap-1.5'>
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        className='rounded-full bg-gray-200/70 px-2.5 py-0.5 text-xs text-black'
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className='flex shrink-0 items-center gap-2'>
                <Button
                  variant='outline'
                  size='icon'
                  aria-label='Download'
                  onClick={() => handleDownload(doc)}
                  disabled={
                    doc.files.length === 0 || downloadingAlias === doc.alias
                  }
                >
                  {downloadingAlias === doc.alias ? (
                    <Loading className='text-black!' />
                  ) : (
                    <Download />
                  )}
                </Button>

                <Button
                  variant='outline'
                  size='icon'
                  aria-label='Edit'
                  onClick={() => setEditingDoc(doc)}
                >
                  <Pencil />
                </Button>

                <Button
                  variant='destructive'
                  size='icon'
                  aria-label='Delete'
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
