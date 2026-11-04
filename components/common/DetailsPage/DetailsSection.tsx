import { cn } from '@/lib/utils';
import { DetailsSectionProps } from '@/types/common/DetailsPage/DetailsPageTypes';

const DetailsSection: React.FC<DetailsSectionProps> = ({
  title,
  icon: Icon,
  description,
  action,
  tone = 'default',
  className,
  contentClassName,
  children,
}) => {
  const isDanger = tone === 'danger';

  return (
    <section
      className={cn(
        'bg-card overflow-hidden rounded-2xl border shadow-xs',
        isDanger && 'border-destructive/40',
        className,
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between gap-3 border-b px-5 py-4',
          isDanger && 'border-destructive/20 bg-destructive/5',
        )}
      >
        <div className='flex min-w-0 items-center gap-3'>
          {Icon && (
            <span
              className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-lg',
                isDanger
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-primary/10 text-primary',
              )}
            >
              <Icon className='size-4' />
            </span>
          )}
          <div className='min-w-0'>
            <h2
              className={cn(
                'text-foreground text-sm font-semibold',
                isDanger && 'text-destructive',
              )}
            >
              {title}
            </h2>
            {description && (
              <p className='text-muted-foreground text-xs'>{description}</p>
            )}
          </div>
        </div>
        {action && <div className='shrink-0'>{action}</div>}
      </div>
      <div className={cn('p-5', contentClassName)}>{children}</div>
    </section>
  );
};

export default DetailsSection;
