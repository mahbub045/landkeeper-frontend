'use client';

import { Download, FileImage, FileText, Share2, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DocCategory,
  PropertyDocument,
} from '@/types/client/Landlord/Documents/DocumentTypes';

function DocIcon({ category }: { category: DocCategory }) {
  const isPhoto = category === 'photo';

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

interface DocumentListProps {
  documents: PropertyDocument[];
  activeFilter: string;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  activeFilter,
}) => {
  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className='py-10 text-center'>
          <p className='text-muted-foreground text-sm'>
            No documents found for &quot;{activeFilter}&quot;
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-3 p-2'>
      {documents.map((doc) => (
        <Card key={doc.id} className='hover:bg-accent/30 transition-colors'>
          <CardContent className='flex items-center gap-4 p-4'>
            <DocIcon category={doc.category} />

            <div className='min-w-0 flex-1'>
              <p className='text-foreground truncate text-sm font-semibold'>
                {doc.name}
              </p>

              <p className='text-muted-foreground mt-0.5 text-xs'>
                {doc.property} • {doc.category} • {doc.sizeMB} MB
              </p>
            </div>

            <div className='flex shrink-0 items-center gap-2'>
              <Button variant='outline' size='icon' aria-label='Download'>
                <Download />
              </Button>

              <Button variant='outline' size='icon' aria-label='Share'>
                <Share2 />
              </Button>

              <Button
                variant='outline'
                size='icon'
                aria-label='Delete'
                className='text-danger hover:bg-danger/10 hover:text-danger'
              >
                <Trash2 />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DocumentList;
