'use client';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  LandlordDetailsTab,
  setLandlordDetailsTab,
} from '@/store/slices/landlordDetailsTabSlice';
import {
  LandlordDetailsTabGroup,
  LandlordDetailsTabLink,
} from '@/types/super-admin/Landlords/Overview/OverviewType';
import {
  Banknote,
  Building2,
  ChartColumn,
  ChevronRight,
  FileText,
  Hammer,
  Landmark,
  LayoutDashboard,
  ReceiptPoundSterling,
  ShieldCheck,
  ShieldUser,
  UserCog,
  Users,
  Wallet,
  Wrench,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ComplianceTab from './LandlordDetailsContent/ComplianceTab/ComplianceTab';
import DocumentsTab from './LandlordDetailsContent/DocumentsTab/DocumentsTab';
import FinanceTab from './LandlordDetailsContent/FinanceTab/FinanceTab';
import MortgagesTab from './LandlordDetailsContent/MortgagesTab/MortgagesTab';
import MtdTab from './LandlordDetailsContent/MtdTab/MtdTab';
import OverviewTab from './LandlordDetailsContent/OverviewTab/OverviewTab';
import PropertiesTab from './LandlordDetailsContent/PropertiesTab/PropertiesTab';
import PropertyMaintenanceTab from './LandlordDetailsContent/PropertyMaintenanceTab/PropertyMaintenanceTab';
import ReportsAnalyticsTab from './LandlordDetailsContent/ReportsAnalyticsTab/ReportsAnalyticsTab';
import TenantPaymentsTab from './LandlordDetailsContent/TenantTab/TenantPaymentsTab';
import TenantsTab from './LandlordDetailsContent/TenantTab/TenantsTab';
import PermissionTab from './LandlordDetailsContent/ToolsTab/PermissionTab';
import TeamAccessTab from './LandlordDetailsContent/ToolsTab/TeamAccessTab';

const TAB_GROUPS: LandlordDetailsTabGroup[] = [
  {
    label: 'Portfolio',
    tabs: [
      {
        key: 'overview',
        label: 'Overview',
        icon: LayoutDashboard,
        color:
          'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
      },
      {
        key: 'properties',
        label: 'Properties',
        icon: Building2,
        color: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
      },
      {
        key: 'mortgages',
        label: 'Mortgages',
        icon: Landmark,
        color:
          'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
      },
      {
        label: 'Tenant',
        icon: Users,
        color:
          'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
        children: [
          {
            key: 'tenants',
            label: 'Tenants',
            icon: Users,
            color:
              'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
          },
          {
            key: 'tenant-payments',
            label: 'Tenant Payments',
            icon: Banknote,
            color:
              'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
          },
        ],
      },
    ],
  },
  {
    label: 'Compliance & Docs',
    tabs: [
      {
        key: 'compliance',
        label: 'Compliance',
        icon: ShieldCheck,
        color:
          'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      },
      {
        key: 'documents',
        label: 'Documents',
        icon: FileText,
        color:
          'bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400',
      },
    ],
  },
  {
    label: 'Money',
    tabs: [
      {
        key: 'finance',
        label: 'Finance',
        icon: Wallet,
        color:
          'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      },
      {
        key: 'mtd',
        label: 'Making Tax Digital (MTD)',
        icon: ReceiptPoundSterling,
        color:
          'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
      },
      {
        key: 'reports-analytics',
        label: 'Reports & Analytics',
        icon: ChartColumn,
        color:
          'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-400',
      },
    ],
  },
  {
    label: 'Operations',
    tabs: [
      {
        key: 'property-maintenance',
        label: 'Property Maintenance',
        icon: Wrench,
        color:
          'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      },
      {
        label: 'Tools',
        icon: Hammer,
        color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
        children: [
          {
            key: 'team-access',
            label: 'Team Access',
            icon: UserCog,
            color:
              'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
          },
          {
            key: 'permission',
            label: 'Permission',
            icon: ShieldUser,
            color:
              'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
          },
        ],
      },
    ],
  },
];

// Every tab that shows content (sub tabs replace their parent)
const ALL_TABS: LandlordDetailsTabLink[] = TAB_GROUPS.flatMap((group) =>
  group.tabs.flatMap((tab) => (tab.children ? tab.children : [tab])),
);

const SuperAdminLandlordDetailsContainer: React.FC = () => {
  const { landlord_alias } = useParams<{ landlord_alias: string }>();

  // Collapse the app sidebar to icons on this page, restore it on leave
  const { open: sidebarOpen, setOpen: setSidebarOpen } = useSidebar();
  useEffect(() => {
    const wasOpen = sidebarOpen;
    setSidebarOpen(false);
    return () => setSidebarOpen(wasOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(
    (state) => state.landlordDetailsTabs.activeTab,
  );
  const active = ALL_TABS.find((tab) => tab.key === activeTab) ?? ALL_TABS[0];
  const ActiveIcon = active.icon;

  const changeTab = (tab: LandlordDetailsTab) =>
    dispatch(setLandlordDetailsTab(tab));

  // Parent entries start expanded when they hold the active tab
  const [openParents, setOpenParents] = useState<string[]>(() =>
    TAB_GROUPS.flatMap((group) => group.tabs)
      .filter((tab) => tab.children?.some((child) => child.key === activeTab))
      .map((tab) => tab.label),
  );
  const toggleParent = (label: string) =>
    setOpenParents((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );

  const renderTabButton = (
    { key, label, icon: Icon, color }: LandlordDetailsTabLink,
    nested = false,
  ) => {
    const isActive = key === activeTab;
    return (
      <button
        key={key}
        type='button'
        onClick={() => changeTab(key)}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'relative flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
      >
        {isActive && (
          <span className='bg-primary absolute inset-y-1.5 left-0 w-1 rounded-full' />
        )}
        <span
          className={cn(
            'flex shrink-0 items-center justify-center rounded-md',
            nested ? 'size-6' : 'size-7',
            color,
          )}
        >
          <Icon className={nested ? 'size-3.5' : 'size-4'} />
        </span>
        <span className='truncate'>{label}</span>
      </button>
    );
  };

  return (
    <div className='grid gap-6 lg:grid-cols-[240px_1fr]'>
      {/* Mobile: dropdown */}
      <div className='lg:hidden'>
        <Select
          value={activeTab}
          onValueChange={(value) => changeTab(value as LandlordDetailsTab)}
        >
          <SelectTrigger className='bg-card w-full'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TAB_GROUPS.map((group) => (
              <SelectGroup key={group.label}>
                <SelectLabel>{group.label}</SelectLabel>
                {group.tabs
                  .flatMap((tab) => (tab.children ? tab.children : [tab]))
                  .map(({ key, label, icon: Icon, color }) => (
                    <SelectItem key={key} value={key}>
                      <span
                        className={cn(
                          'flex size-6 items-center justify-center rounded-md',
                          color,
                        )}
                      >
                        <Icon className='size-3.5' />
                      </span>
                      {label}
                    </SelectItem>
                  ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop: grouped sidebar */}
      <aside className='hidden lg:block'>
        <Card className='sticky top-6 max-h-[calc(100vh-3rem)] gap-5 overflow-y-auto p-3'>
          {TAB_GROUPS.map((group) => (
            <nav key={group.label} className='space-y-1'>
              <p className='text-muted-foreground px-3 pb-1 text-[11px] font-semibold tracking-wider uppercase'>
                {group.label}
              </p>
              {group.tabs.map((tab) => {
                if (!tab.children) return renderTabButton(tab);

                const { label, icon: Icon, color, children } = tab;
                const isOpen = openParents.includes(label);
                const hasActiveChild = children.some(
                  (child) => child.key === activeTab,
                );
                return (
                  <div key={label}>
                    <button
                      type='button'
                      onClick={() => toggleParent(label)}
                      aria-expanded={isOpen}
                      className={cn(
                        'flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        hasActiveChild
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      <span
                        className={cn(
                          'flex size-7 shrink-0 items-center justify-center rounded-md',
                          color,
                        )}
                      >
                        <Icon className='size-4' />
                      </span>
                      <span className='truncate'>{label}</span>
                      <ChevronRight
                        className={cn(
                          'ml-auto size-4 shrink-0 transition-transform',
                          isOpen && 'rotate-90',
                        )}
                      />
                    </button>
                    {isOpen && (
                      <div className='mt-1 ml-6 space-y-1 border-l pl-2'>
                        {children.map((child) => renderTabButton(child, true))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          ))}
        </Card>
      </aside>

      {/* Content */}
      <Card className='min-w-0 gap-0 p-0'>
        <div className='flex items-center justify-center gap-3 border-b px-6 py-4'>
          <div
            className={cn(
              'flex size-9 items-center justify-center rounded-lg',
              active.color,
            )}
          >
            <ActiveIcon className='size-4' />
          </div>
          <h2 className='text-lg font-semibold'>{active.label} Tab</h2>
        </div>

        <div className='p-6'>
          {activeTab === 'overview' && (
            <OverviewTab landlord_alias={landlord_alias} />
          )}
          {activeTab === 'properties' && (
            <PropertiesTab landlord_alias={landlord_alias} />
          )}
          {activeTab === 'mortgages' && (
            <MortgagesTab landlord_alias={landlord_alias} />
          )}
          {activeTab === 'tenants' && (
            <TenantsTab landlord_alias={landlord_alias} />
          )}
          {activeTab === 'tenant-payments' && (
            <TenantPaymentsTab landlord_alias={landlord_alias} />
          )}
          {activeTab === 'compliance' && (
            <ComplianceTab landlord_alias={landlord_alias} />
          )}
          {activeTab === 'documents' && (
            <DocumentsTab landlord_alias={landlord_alias} />
          )}
          {activeTab === 'finance' && (
            <FinanceTab landlord_alias={landlord_alias} />
          )}
          {activeTab === 'mtd' && <MtdTab landlord_alias={landlord_alias} />}
          {activeTab === 'reports-analytics' && (
            <ReportsAnalyticsTab landlord_alias={landlord_alias} />
          )}
          {activeTab === 'property-maintenance' && (
            <PropertyMaintenanceTab landlord_alias={landlord_alias} />
          )}
          {activeTab === 'team-access' && (
            <TeamAccessTab landlord_alias={landlord_alias} />
          )}
          {activeTab === 'permission' && (
            <PermissionTab landlord_alias={landlord_alias} />
          )}
        </div>
      </Card>
    </div>
  );
};

export default SuperAdminLandlordDetailsContainer;
