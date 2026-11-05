'use client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setActiveTab } from '@/store/slices/permissionTabsSlice';
import { PermissionTab } from '@/types/client/Common/Tools/Permission/PermissionTypes';
import { Building2, Landmark } from 'lucide-react';
import MortgagesPermission from './Tabs/MortgagesPermission/MortgagesPermission';
import PropertiesPermission from './Tabs/PropertiesPermission/PropertiesPermission';

const Permission: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(
    (state) => state.permissionAccessTabs.activeTab,
  );

  const tabs: PermissionTab[] = [
    { key: 'properties', label: 'Properties Permission', icon: Building2 },
    { key: 'mortgages', label: 'Mortgages Permission', icon: Landmark },
  ];

  return (
    <div>
      <div className='flex border-b border-gray-200'>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => dispatch(setActiveTab(tab.key))}
            className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className='size-4' />
            {tab.label}
          </button>
        ))}
      </div>

      <div className='mt-4'>
        {activeTab === 'properties' && <PropertiesPermission />}
        {activeTab === 'mortgages' && <MortgagesPermission />}
      </div>
    </div>
  );
};

export default Permission;
