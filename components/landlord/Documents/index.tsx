'use client';

import { Button } from '@/components/ui/button';
import {
  documents,
  filterTabs,
  tabCategoryMap,
} from '@/data/landlord/documents/DocumentsData';
import {
  FilterTab,
  PropertyDocument,
} from '@/types/landlord/Documents/DocumentTypes';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import DocumentFilter from './DocumentFilter/DocumentFilter';
import DocumentList from './DocumentList/DocumentList';

function filterDocuments(
  list: PropertyDocument[],
  tab: FilterTab,
): PropertyDocument[] {
  if (tab === 'All') return list;
  return list.filter((d) => tabCategoryMap[tab].includes(d.category));
}

const DocumentsContainer: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const filtered = filterDocuments(documents, activeFilter);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
            Documents
          </h1>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Manage all property-related documents
          </p>
        </div>
        <Button>
          <Upload />
          Upload Document
        </Button>
      </div>

      <DocumentFilter
        filterTabs={filterTabs}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Document Library */}
      <div className='overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-700/50 dark:bg-gray-800/30'>
        <div className='flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700/50'>
          <h2 className='text-sm font-semibold text-gray-900 dark:text-white'>
            Document Library
          </h2>
          <span className='text-sm text-gray-400 dark:text-gray-500'>
            {filtered.length} documents
          </span>
        </div>
        <DocumentList documents={filtered} activeFilter={activeFilter} />
      </div>
    </div>
  );
};

export default DocumentsContainer;
