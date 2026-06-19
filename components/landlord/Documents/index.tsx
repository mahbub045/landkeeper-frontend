'use client';

import { Upload } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import {
  documents,
  filterTabs,
  tabCategoryMap,
} from '@/data/landlord/documents/DocumentsData';

import {
  FilterTab,
  PropertyDocument,
} from '@/types/landlord/Documents/DocumentTypes';

import DocumentFilter from './DocumentFilter/DocumentFilter';
import DocumentList from './DocumentList/DocumentList';

function filterDocuments(
  list: PropertyDocument[],
  tab: FilterTab,
): PropertyDocument[] {
  if (tab === 'All') return list;

  return list.filter((doc) => tabCategoryMap[tab].includes(doc.category));
}

const DocumentsContainer: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');

  const filteredDocuments = useMemo(
    () => filterDocuments(documents, activeFilter),
    [activeFilter],
  );

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <h1 className='text-foreground text-2xl font-bold'>Documents</h1>

          <p className='text-muted-foreground mt-1 text-sm'>
            Manage all property-related documents
          </p>
        </div>

        <Button>
          <Upload className='size-4' />
          Upload Document
        </Button>
      </div>

      {/* Filters */}
      <DocumentFilter
        filterTabs={filterTabs}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Document Library */}
      <Card className='overflow-hidden'>
        <CardHeader className='flex flex-row items-center justify-between border-b'>
          <h2 className='text-foreground text-sm font-semibold'>
            Document Library
          </h2>

          <span className='text-muted-foreground text-sm'>
            {filteredDocuments.length} documents
          </span>
        </CardHeader>

        <CardContent className='p-0'>
          <DocumentList
            documents={filteredDocuments}
            activeFilter={activeFilter}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsContainer;
