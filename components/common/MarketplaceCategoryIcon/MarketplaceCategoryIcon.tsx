'use client';

import { getCategoryColor } from '@/data/super-admin/Marketplace/MarketplaceData';
import { cn } from '@/lib/utils';
import { MarketplaceCategoryIconProps } from '@/types/super-admin/Marketplace/MarketplaceTypes';
import { parseLucideIcon } from '@/utils/lucideIcon';
import { LayoutGrid } from 'lucide-react';
import { DynamicIcon } from 'lucide-react/dynamic';

const MarketplaceCategoryIcon: React.FC<MarketplaceCategoryIconProps> = ({
  icon,
  seed,
  className,
  iconClassName,
}) => {
  const color = getCategoryColor(seed);
  const iconName = parseLucideIcon(icon);
  const iconClasses = cn('size-5', color.icon_color, iconClassName);

  return (
    <div
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-xl',
        color.icon_bg,
        className,
      )}
    >
      {iconName ? (
        <DynamicIcon
          name={iconName}
          className={iconClasses}
          fallback={() => <LayoutGrid className={iconClasses} />}
        />
      ) : (
        <LayoutGrid className={iconClasses} />
      )}
    </div>
  );
};

export default MarketplaceCategoryIcon;
