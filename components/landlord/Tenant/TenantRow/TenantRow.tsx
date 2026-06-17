import { getInitials } from '@/data/landlord/teamAccess/TeamAccessData';
import { avatarColor } from '@/data/landlord/tenant/TenantData';
import { Tenant } from '@/types/landlord/Tenant/TenantTypes';
import { Eye, Mail } from 'lucide-react';
import StatusBadge from '../StatusBadge/StatusBadge';

const TenantRow: React.FC<{ tenant: Tenant; idx: number }> = ({
  tenant,
  idx,
}) => {
  return (
    <tr className='transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40'>
      {/* Tenant */}
      <td className='px-6 py-4'>
        <div className='flex items-center gap-3'>
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(idx)}`}
          >
            {getInitials(tenant.name)}
          </div>
          <div>
            <p className='text-sm font-semibold text-gray-900 dark:text-white'>
              {tenant.name}
            </p>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              {tenant.email}
            </p>
          </div>
        </div>
      </td>

      {/* Property */}
      <td className='px-6 py-4 text-sm text-gray-700 dark:text-gray-300'>
        {tenant.property}
      </td>

      {/* Rent */}
      <td className='px-6 py-4 text-sm font-bold text-gray-900 dark:text-white'>
        £{tenant.rent.toLocaleString('en-GB')}
      </td>

      {/* Start Date */}
      <td className='px-6 py-4 text-sm text-gray-700 dark:text-gray-300'>
        {tenant.startDate}
      </td>

      {/* End Date */}
      <td className='px-6 py-4 text-sm text-gray-700 dark:text-gray-300'>
        {tenant.endDate}
      </td>

      {/* Status */}
      <td className='px-6 py-4'>
        <StatusBadge status={tenant.status} />
      </td>

      {/* Actions */}
      <td className='px-6 py-4'>
        <div className='flex items-center gap-2'>
          <button className='rounded-lg border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'>
            <Eye className='size-4' />
          </button>
          <button className='rounded-lg border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'>
            <Mail className='size-4' />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TenantRow;
