import { TenantStatus } from '@/types/landlord/Tenant/TenantTypes';

const StatusBadge: React.FC<{ status: TenantStatus }> = ({ status }) => {
  if (status === 'Active') {
    return (
      <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'>
        <span className='inline-block size-1.5 rounded-full bg-emerald-500' />
        Active
      </span>
    );
  }
  return (
    <span className='inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'>
      <span className='inline-block size-1.5 rounded-full bg-amber-500' />
      Renewal Due
    </span>
  );
};

export default StatusBadge;
