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
  Building2,
  ChartColumn,
  FileText,
  Landmark,
  LayoutDashboard,
  LucideIcon,
  Receipt,
  ShieldCheck,
  Store,
  UserCog,
  Users,
  Wallet,
  Wrench,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import OverviewTab from './LandlordDetailsContent/OverviewTab/OverviewTab';

type TabItem = {
  key: LandlordDetailsTab;
  label: string;
  icon: LucideIcon;
  /** Icon tile colours */
  color: string;
};

const TAB_GROUPS: { label: string; tabs: TabItem[] }[] = [
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
        key: 'tenants',
        label: 'Tenants',
        icon: Users,
        color:
          'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
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
        label: 'MTD',
        icon: Receipt,
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
        key: 'marketplace',
        label: 'Marketplace',
        icon: Store,
        color:
          'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
      },
      {
        key: 'team-access',
        label: 'Team Access',
        icon: UserCog,
        color:
          'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
      },
    ],
  },
];

const ALL_TABS = TAB_GROUPS.flatMap((group) => group.tabs);

const SuperAdminLandlordDetailsContainer: React.FC = () => {
  const { landlord_uid } = useParams<{ landlord_uid: string }>();

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
                {group.tabs.map(({ key, label, icon: Icon, color }) => (
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
        <Card className='sticky top-6 gap-5 p-3'>
          {TAB_GROUPS.map((group) => (
            <nav key={group.label} className='space-y-1'>
              <p className='text-muted-foreground px-3 pb-1 text-[11px] font-semibold tracking-wider uppercase'>
                {group.label}
              </p>
              {group.tabs.map(({ key, label, icon: Icon, color }) => {
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
                        'flex size-7 shrink-0 items-center justify-center rounded-md',
                        color,
                      )}
                    >
                      <Icon className='size-4' />
                    </span>
                    <span className='truncate'>{label}</span>
                  </button>
                );
              })}
            </nav>
          ))}
        </Card>
      </aside>

      {/* Content */}
      <Card className='min-w-0 gap-0 p-0'>
        <div className='flex items-center gap-3 border-b px-6 py-4'>
          <div
            className={cn(
              'flex size-9 items-center justify-center rounded-lg',
              active.color,
            )}
          >
            <ActiveIcon className='size-4' />
          </div>
          <h2 className='text-lg font-semibold'>{active.label}</h2>
        </div>
        <div className='p-6'>
          {activeTab === 'overview' && (
            <OverviewTab landlord_uid={landlord_uid} />
          )}
          {activeTab === 'properties' && <div>Properties content</div>}
          {activeTab === 'mortgages' && <div>Mortgages content</div>}
          {activeTab === 'tenants' && <div>Tenants content</div>}
          {activeTab === 'compliance' && <div>Compliance content</div>}
          {activeTab === 'documents' && <div>Documents content</div>}
          {activeTab === 'finance' && <div>Finance content</div>}
          {activeTab === 'mtd' && <div>MTD content</div>}
          {activeTab === 'reports-analytics' && (
            <div>Reports & Analytics content</div>
          )}
          {activeTab === 'property-maintenance' && (
            <div>Property Maintenance content</div>
          )}
          {activeTab === 'marketplace' && <div>Marketplace content</div>}
          {activeTab === 'team-access' && <div>Team Access content</div>}
        </div>
      </Card>
    </div>
  );
};

export default SuperAdminLandlordDetailsContainer;
