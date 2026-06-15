'use client';

import { Download, FileImage, FileText, Share2, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

type DocCategory = 'mortgage' | 'tenancy' | 'certificate' | 'insurance' | 'legal' | 'photo' | 'invoice';
type FilterTab = 'All' | 'Mortgage' | 'Tenancy' | 'Certificates' | 'Insurance' | 'Legal';

interface Document {
  id: number;
  name: string;
  property: string;
  category: DocCategory;
  sizeMB: number;
}

// ── Static Data ───────────────────────────────────────────────────────────────

const documents: Document[] = [
  { id: 1, name: 'Tenancy Agreement - Sarah Johnson', property: '14 Oak Street', category: 'tenancy', sizeMB: 1.2 },
  { id: 2, name: 'Mortgage Offer - Halifax', property: '14 Oak Street', category: 'mortgage', sizeMB: 2.4 },
  { id: 3, name: 'HMO Licence Certificate', property: '42 Maple Avenue', category: 'certificate', sizeMB: 0.8 },
  { id: 4, name: 'Property Inspection Photos', property: '42 Maple Avenue', category: 'photo', sizeMB: 15.6 },
  { id: 5, name: 'Building Insurance Policy', property: '8 Pine Road', category: 'insurance', sizeMB: 3.1 },
  { id: 6, name: 'Commercial Lease Agreement', property: '23 Elm Drive', category: 'legal', sizeMB: 4.5 },
  { id: 7, name: 'Gas Safety Certificate 2024', property: '14 Oak Street', category: 'certificate', sizeMB: 0.5 },
  { id: 8, name: 'Repair Invoice - Boiler', property: '8 Pine Road', category: 'invoice', sizeMB: 0.3 },
  { id: 9, name: 'EPC Certificate', property: '7 Cedar Lane', category: 'certificate', sizeMB: 0.6 },
  { id: 10, name: 'Landlord Insurance Policy', property: '42 Maple Avenue', category: 'insurance', sizeMB: 2.8 },
  { id: 11, name: 'Tenancy Agreement - James Patel', property: '8 Pine Road', category: 'tenancy', sizeMB: 1.4 },
  { id: 12, name: 'Mortgage Statement Q1 2024', property: '23 Elm Drive', category: 'mortgage', sizeMB: 0.9 },
];

const filterTabs: FilterTab[] = ['All', 'Mortgage', 'Tenancy', 'Certificates', 'Insurance', 'Legal'];

// ── Filter logic ──────────────────────────────────────────────────────────────

const tabCategoryMap: Record<FilterTab, DocCategory[]> = {
  All: [],
  Mortgage: ['mortgage'],
  Tenancy: ['tenancy'],
  Certificates: ['certificate'],
  Insurance: ['insurance'],
  Legal: ['legal'],
};

function filterDocuments(list: Document[], tab: FilterTab): Document[] {
  if (tab === 'All') return list;
  return list.filter((d) => tabCategoryMap[tab].includes(d.category));
}

// ── Sub-components ────────────────────────────────────────────────────────────

function DocIcon({ category }: { category: DocCategory }) {
  const isPhoto = category === 'photo';

  return (
    <div
      className={`size-11 rounded-xl flex items-center justify-center shrink-0 ${
        isPhoto ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'
      }`}
    >
      {isPhoto ? (
        <FileImage className='size-5 text-emerald-600 dark:text-emerald-400' />
      ) : (
        <FileText className='size-5 text-red-500 dark:text-red-400' />
      )}
    </div>
  );
}

function DocumentRow({ doc }: { doc: Document }) {
  return (
    <div className='flex items-center gap-4 px-5 py-4 border border-gray-100 dark:border-gray-700/50 rounded-2xl bg-white dark:bg-gray-800/50 hover:shadow-sm transition-shadow'>
      <DocIcon category={doc.category} />

      <div className='flex-1 min-w-0'>
        <p className='text-sm font-semibold text-gray-900 dark:text-white truncate'>{doc.name}</p>
        <p className='text-xs text-gray-400 dark:text-gray-500 mt-0.5'>
          {doc.property} &bull; {doc.category} &bull; {doc.sizeMB} MB
        </p>
      </div>

      <div className='flex items-center gap-2 shrink-0'>
        <button
          aria-label='Download'
          className='size-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
        >
          <Download className='size-3.5' />
        </button>
        <button
          aria-label='Share'
          className='size-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
        >
          <Share2 className='size-3.5' />
        </button>
        <button
          aria-label='Delete'
          className='size-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 hover:border-red-200 dark:hover:border-red-800 transition-colors'
        >
          <Trash2 className='size-3.5' />
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DocumentsPage() {
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
        <button className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors'>
          <Upload className='size-4' />
          Upload Document
        </button>
      </div>

      {/* Filter tabs */}
      <div className='flex items-center gap-2 flex-wrap'>
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeFilter === tab
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-transparent text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Document Library */}
      <div className='border border-gray-100 dark:border-gray-700/50 rounded-2xl bg-white dark:bg-gray-800/30 overflow-hidden'>
        {/* Library header */}
        <div className='flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700/50'>
          <h2 className='text-sm font-semibold text-gray-900 dark:text-white'>Document Library</h2>
          <span className='text-sm text-gray-400 dark:text-gray-500'>{filtered.length} documents</span>
        </div>

        {/* Rows */}
        {filtered.length > 0 ? (
          <div className='divide-y divide-gray-50 dark:divide-gray-700/30 p-4 space-y-2'>
            {filtered.map((doc) => (
              <DocumentRow key={doc.id} doc={doc} />
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-20 text-center'>
            <FileText className='size-10 text-gray-300 dark:text-gray-600 mb-3' />
            <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
              No documents found for &quot;{activeFilter}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}