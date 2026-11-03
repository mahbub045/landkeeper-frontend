import { cn } from '@/lib/utils';
import { UsageLimitProps } from '@/types/common/Permissions/CommonPermissionsTypes';

const UsageLimit: React.FC<UsageLimitProps> = ({
  icon: Icon,
  label,
  used,
  max,
}) => {
  const percentage = max > 0 ? Math.min((used / max) * 100, 100) : 100;
  const isFull = used >= max;
  const isNearLimit = !isFull && percentage >= 80;

  return (
    <div
      className='bg-card flex h-8 shrink-0 items-center gap-2.5 rounded-lg border px-3 text-sm'
      title={
        isFull
          ? `${label} limit reached. Upgrade your plan to add more.`
          : `${max - used} ${label.toLowerCase()} remaining on your plan`
      }
    >
      <Icon className='text-muted-foreground size-4' />
      <span className='text-muted-foreground hidden sm:inline'>{label}</span>
      <span
        className={cn(
          'font-semibold tabular-nums',
          isFull && 'text-destructive',
          isNearLimit && 'text-amber-600 dark:text-amber-400',
        )}
      >
        {used}/{max}
      </span>
      <div className='bg-muted h-1.5 w-14 overflow-hidden rounded-full'>
        <div
          className={cn(
            'h-full rounded-full transition-all',
            isFull
              ? 'bg-destructive'
              : isNearLimit
                ? 'bg-amber-500'
                : 'bg-primary',
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default UsageLimit;
