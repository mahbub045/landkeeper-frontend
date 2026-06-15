'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Bath, Bed, Home, MapPin, Plus } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

type PropertyStatus = 'Occupied' | 'Vacant';
type PropertyType = 'residential' | 'hmo' | 'commercial';
type FilterTab = 'All' | 'Residential' | 'HMO' | 'Commercial' | 'Occupied' | 'Vacant';

interface Property {
  id: number;
  name: string;
  address: string;
  image: string;
  status: PropertyStatus;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  rentPerMonth: number | null; // null = Vacant with no set rent
}

// ── Static Data ──────────────────────────────────────────────────────────────

const properties: Property[] = [
  {
    id: 1,
    name: '14 Oak Street',
    address: '14 Oak Street, London',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
    status: 'Occupied',
    type: 'residential',
    bedrooms: 3,
    bathrooms: 2,
    rentPerMonth: 850,
  },
  {
    id: 2,
    name: '42 Maple Avenue',
    address: '42 Maple Avenue, Manchester',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    status: 'Occupied',
    type: 'hmo',
    bedrooms: 5,
    bathrooms: 3,
    rentPerMonth: 1200,
  },
  {
    id: 3,
    name: '8 Pine Road',
    address: '8 Pine Road, Birmingham',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
    status: 'Occupied',
    type: 'residential',
    bedrooms: 2,
    bathrooms: 1,
    rentPerMonth: 750,
  },
  {
    id: 4,
    name: '23 Elm Drive',
    address: '23 Elm Drive, Bristol',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    status: 'Occupied',
    type: 'commercial',
    bedrooms: 0,
    bathrooms: 2,
    rentPerMonth: 1500,
  },
  {
    id: 5,
    name: '7 Cedar Lane',
    address: '7 Cedar Lane, Leeds',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
    status: 'Vacant',
    type: 'residential',
    bedrooms: 2,
    bathrooms: 1,
    rentPerMonth: null,
  },
];

const filterTabs: FilterTab[] = ['All', 'Residential', 'HMO', 'Commercial', 'Occupied', 'Vacant'];

// ── Filter logic ─────────────────────────────────────────────────────────────

function filterProperties(list: Property[], tab: FilterTab): Property[] {
  if (tab === 'All') return list;
  if (tab === 'Occupied') return list.filter((p) => p.status === 'Occupied');
  if (tab === 'Vacant') return list.filter((p) => p.status === 'Vacant');
  return list.filter((p) => p.type === tab.toLowerCase());
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PropertyStatus }) {
  if (status === 'Occupied') {
    return (
      <span className='flex items-center gap-1.5 bg-emerald-100/90 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm'>
        <span className='size-1.5 rounded-full bg-emerald-700/90 inline-block' />
        Occupied
      </span>
    );
  }
  return (
    <span className='flex items-center gap-1 bg-white/90 text-gray-700 dark:bg-gray-800/90 dark:text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm'>
        <span className='size-1.5 rounded-full bg-gray-400/90 inline-block' />
      Vacant
    </span>
  );
}

function PropertyCard({ property }: { property: Property }) {
  return (
    <Card className='rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow pt-0 pb-3'>
      {/* Image */}
      <div className='relative h-48 w-full'>
        <Image
          src={property.image}
          alt={property.name}
          fill
          className='object-cover'
          sizes='(max-width: 768px) 100vw, 33vw'
        />
        {/* Status badge top-right */}
        <div className='absolute top-3 right-3'>
          <StatusBadge status={property.status} />
        </div>
      </div>

      {/* Info */}
      <CardContent className=''>
        <h3 className='text-base font-bold text-gray-900 dark:text-white'>{property.name}</h3>
        <p className='flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1'>
          <MapPin className='size-3 text-blue-500 shrink-0' />
          {property.address}
        </p>

        {/* Stats row */}
        <div className='flex items-center gap-3 mt-1 text-xs text-gray-600 dark:text-gray-400'>
          <span className='flex items-center gap-1'>
            <Bed className='size-3.5 text-blue-500' />
            {property.bedrooms}
          </span>
          <span className='flex items-center gap-1'>
            <Bath className='size-3.5 text-blue-500' />
            {property.bathrooms}
          </span>
          <span className='flex items-center gap-1'>
            <Home className='size-3.5 text-blue-500' />
            {property.type}
          </span>
        </div>

        {/* Rent */}
        <p className='mt-1 text-lg font-bold text-gray-900 dark:text-white'>
          {property.rentPerMonth ? `£${property.rentPerMonth.toLocaleString()}/mo` : 'Vacant'}
        </p>
      </CardContent>
    </Card>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PropertiesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const filtered = filterProperties(properties, activeFilter);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
            Properties
          </h1>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Manage your property portfolio
          </p>
        </div>
        <button className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors'>
          <Plus className='size-4' />
          Add Property
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

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className='grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
          {filtered.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-20 text-center'>
          <Home className='size-10 text-gray-300 dark:text-gray-600 mb-3' />
          <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
            No properties found for &quot;{activeFilter}&quot;
          </p>
        </div>
      )}
    </div>
  );
}