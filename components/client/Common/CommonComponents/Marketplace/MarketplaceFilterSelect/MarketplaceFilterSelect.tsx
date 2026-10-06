'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MarketplaceBooleanFilter,
  MarketplaceFilterSelectProps,
} from '@/types/super-admin/Marketplace/MarketplaceTypes';

const MarketplaceFilterSelect: React.FC<MarketplaceFilterSelectProps> = ({
  label,
  value,
  options,
  onChange,
}) => (
  <Select
    value={value}
    onValueChange={(v) => onChange(v as MarketplaceBooleanFilter)}
  >
    <SelectTrigger className='bg-card h-10! w-full lg:w-40'>
      <span className='text-muted-foreground'>{label}:</span>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {options.map((o) => (
        <SelectItem key={o.value} value={o.value}>
          {o.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export default MarketplaceFilterSelect;
