'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, Store } from 'lucide-react';
import Categories from './Categories/Categories';
import Providers from './Providers/Providers';

const SuperAdminMarketplaceContainer: React.FC = () => {
  return (
    <Tabs defaultValue='categories' className='w-full'>
      <TabsList
        className='bg-primary/5 w-full justify-start gap-1.5 sm:w-auto'
        style={{ height: 'auto', padding: '0.25rem' }}
      >
        <TabsTrigger
          value='categories'
          className='cursor-pointer gap-1.5 px-4 py-2'
        >
          <LayoutGrid className='size-4' />
          Categories
        </TabsTrigger>{' '}
        <TabsTrigger
          value='providers'
          className='cursor-pointer gap-1.5 px-4 py-2'
        >
          <Store className='size-4' />
          Providers
        </TabsTrigger>
      </TabsList>

      <TabsContent value='providers' className='mt-6'>
        <Providers />
      </TabsContent>
      <TabsContent value='categories' className='mt-6'>
        <Categories />
      </TabsContent>
    </Tabs>
  );
};

export default SuperAdminMarketplaceContainer;
