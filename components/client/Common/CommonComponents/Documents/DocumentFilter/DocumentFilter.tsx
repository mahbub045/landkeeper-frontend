'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  DocumentFilterProps,
  FilterTab,
} from '@/types/client/Common/Documents/DocumentTypes';

const DocumentFilter: React.FC<DocumentFilterProps> = ({
  filterTabs,
  activeFilter,
  onFilterChange,
}) => {
  return (
    <ToggleGroup
      type='single'
      value={activeFilter}
      onValueChange={(value) => {
        if (value) onFilterChange(value as FilterTab);
      }}
      className='flex flex-wrap justify-start gap-2'
    >
      {filterTabs.map((tab) => (
        <ToggleGroupItem
          key={tab.value}
          value={tab.value}
          className='data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground border-border text-muted-foreground hover:border-primary/50 hover:text-foreground rounded-full border px-4 py-1.5 text-sm font-medium'
        >
          {tab.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default DocumentFilter;