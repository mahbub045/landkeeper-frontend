import type { UserRole } from '@/types/next-auth';
import {
  BarChart3,
  Calculator,
  ChartNoAxesCombined,
  FileSpreadsheet,
  Files,
  Hammer,
  Handshake,
  House,
  Landmark,
  LayoutDashboard,
  Link2,
  Package,
  Podcast,
  ShieldUser,
  Ticket,
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
      {
        label: 'Pricing Plans',
        href: '/super-admin/pricing-plans',
        icon: Package,
      },
      {
        label: 'Subscriptions',
        href: '/super-admin/subscriptions',
        icon: Podcast,
      },
      {
        label: 'Support Tickets',
        href: '/super-admin/support-tickets',
        icon: Ticket,
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
        label: 'Tenants',
        href: '/client/landlord/tenants',
        icon: UsersRound,
      },
      {
        label: 'Property Maintenance',
        href: '/client/landlord/property-maintenance',
        icon: Wrench,
      },
      {
        label: 'Mortgages',
        href: '/client/landlord/mortgages',
        icon: Landmark,
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
        label: 'Making Tax Digital (MTD)',
        href: '/client/landlord/making-tax-digital',
        icon: FileSpreadsheet,
      },
      {
        label: 'Reports & Analytics',
        href: '/client/landlord/reports-and-analytics',
        icon: BarChart3,
      },
      {
        label: 'Integrations',
        href: '/client/landlord/integrations',
        icon: Link2,
      },
      {
        label: 'Contractor Marketplace',
        href: '/client/landlord/contractor-marketplace',
        icon: Handshake,
      },
      {
        label: 'Tools',
        icon: Hammer,
        children: [
          {
            label: 'Team Access',
            href: '/client/landlord/tools/team-access',
            icon: UserKey,
          },
          {
            label: 'Calculators',
            href: '/client/landlord/tools/calculators',
            icon: Calculator,
          },
        ],
      },
      {
        label: 'Support Tickets',
        href: '/client/landlord/support-tickets',
        icon: Ticket,
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
        label: 'Tenants',
        href: '/client/admin/tenants',
        icon: UsersRound,
      },
      {
        label: 'Property Maintenance',
        href: '/client/admin/property-maintenance',
        icon: Wrench,
      },
      {
        label: 'Mortgages',
        href: '/client/admin/mortgages',
        icon: Landmark,
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
      {
        label: 'Making Tax Digital (MTD)',
        href: '/client/admin/making-tax-digital',
        icon: FileSpreadsheet,
      },
      {
        label: 'Reports & Analytics',
        href: '/client/admin/reports-and-analytics',
        icon: BarChart3,
      },
      {
        label: 'Integrations',
        href: '/client/admin/integrations',
        icon: Link2,
      },
      {
        label: 'Contractor Marketplace',
        href: '/client/admin/contractor-marketplace',
        icon: Handshake,
      },
      {
        label: 'Tools',
        icon: Hammer,
        children: [
          {
            label: 'Calculators',
            href: '/client/admin/tools/calculators',
            icon: Calculator,
          },
        ],
      },
      {
        label: 'Support Tickets',
        href: '/client/admin/support-tickets',
        icon: Ticket,
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
        label: 'Tenants',
        href: '/client/letting-agent/tenants',
        icon: UsersRound,
      },
      {
        label: 'Compliance',
        href: '/client/letting-agent/compliance',
        icon: ShieldUser,
      },
      {
        label: 'Tools',
        icon: Hammer,
        children: [
          {
            label: 'Calculators',
            href: '/client/letting-agent/tools/calculators',
            icon: Calculator,
          },
        ],
      },
      {
        label: 'Support Tickets',
        href: '/client/letting-agent/support-tickets',
        icon: Ticket,
      },
    ];
  }
  if (role === 'TENANT') {
    return [
      {
        label: 'Dashboard',
        href: '/client/tenant/dashboard',
        icon: LayoutDashboard,
      },
      {
        label: 'Properties',
        href: '/client/tenant/properties',
        icon: House,
      },
      {
        label: 'Support Tickets',
        href: '/client/tenant/support-tickets',
        icon: Ticket,
      },
    ];
  }

  return [];
};
