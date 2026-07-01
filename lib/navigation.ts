import type { UserRole } from '@/types/next-auth';
import {
  ChartNoAxesCombined,
  FileText,
  Files,
  House,
  Landmark,
  LayoutDashboard,
  ShieldUser,
  UserKey,
  UsersRound,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = {
  label: string;
  href?: string;
  icon: LucideIcon;
  badge?: number;
  children?: NavItem[];
};

interface BuildItemsOptions {
  role: UserRole | undefined;
}

export const buildItems = ({ role }: BuildItemsOptions): NavItem[] => {
  if (role === 'SUPER_ADMIN') {
    return [
      {
        label: 'Dashboard',
        href: '/super-admin/dashboard',
        icon: LayoutDashboard,
      },
    ];
  }

  if (role === 'LANDLORD') {
    return [
      {
        label: 'Dashboard',
        href: '/client/landlord/dashboard',
        icon: LayoutDashboard,
      },
      {
        label: 'Properties',
        href: '/client/landlord/properties',
        icon: House,
      },
      {
        label: 'Mortgages',
        href: '/client/landlord/mortgages',
        icon: Landmark,
      },
      {
        label: 'Tenants',
        href: '/client/landlord/tenants',
        icon: UsersRound,
      },
      {
        label: 'Compliance',
        href: '/client/landlord/compliance',
        icon: ShieldUser,
      },
      {
        label: 'Documents',
        href: '/client/landlord/documents',
        icon: Files,
      },
      {
        label: 'Finance',
        href: '/client/landlord/finance',
        icon: ChartNoAxesCombined,
      },
      {
        label: 'Tools',
        icon: Wrench,
        children: [
          {
            label: 'Reports',
            href: '/client/landlord/tools/reports',
            icon: FileText,
          },
          {
            label: 'Team Access',
            href: '/client/landlord/tools/team-access',
            icon: UserKey,
          },
        ],
      },
    ];
  }

  if (role === 'ADMIN') {
    return [
      {
        label: 'Dashboard',
        href: '/client/admin/dashboard',
        icon: LayoutDashboard,
      },
      {
        label: 'Properties',
        href: '/client/admin/properties',
        icon: House,
      },
      {
        label: 'Mortgages',
        href: '/client/admin/mortgages',
        icon: Landmark,
      },
      {
        label: 'Tenants',
        href: '/client/admin/tenants',
        icon: UsersRound,
      },
      {
        label: 'Compliance',
        href: '/client/admin/compliance',
        icon: ShieldUser,
      },
      {
        label: 'Documents',
        href: '/client/admin/documents',
        icon: Files,
      },
      {
        label: 'Finance',
        href: '/client/admin/finance',
        icon: ChartNoAxesCombined,
      },
    ];
  }
  if (role === 'LETTING_AGENT') {
    return [
      {
        label: 'Dashboard',
        href: '/client/letting-agent/dashboard',
        icon: LayoutDashboard,
      },
      {
        label: 'Properties',
        href: '/client/letting-agent/properties',
        icon: House,
      },
      {
        label: 'Mortgages',
        href: '/client/letting-agent/mortgages',
        icon: Landmark,
      },

      {
        label: 'Compliance',
        href: '/client/letting-agent/compliance',
        icon: ShieldUser,
      },
    ];
  }

  return [];
};
