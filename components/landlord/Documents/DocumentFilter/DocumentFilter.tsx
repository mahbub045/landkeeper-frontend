'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { FilterTab } from '@/types/landlord/Documents/DocumentTypes';

interface DocumentFilterProps {
  filterTabs: FilterTab[];
  activeFilter: FilterTab;
  onFilterChange: (tab: FilterTab) => void;
}

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
          key={tab}
          value={tab}
          className='data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground border-border text-muted-foreground hover:border-primary/50 hover:text-foreground rounded-full border px-4 py-1.5 text-sm font-medium'
        >
          {tab}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default DocumentFilter;
