import type { UserRole } from '@/types/next-auth';
import {
  Banknote,
  BarChart3,
  Calculator,
  ChartNoAxesCombined,
  FileSpreadsheet,
  FileText,
  Files,
  Hammer,
  Handshake,
  House,
  Landmark,
  LayoutDashboard,
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
        label: 'Documents & Templates',
        href: '/client/landlord/documents-and-templates',
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
        label: 'Property Maintenance',
        href: '/client/landlord/property-maintenance',
        icon: Wrench,
      },
      {
        label: 'Reports & Analytics',
        href: '/client/landlord/reports-and-analytics',
        icon: BarChart3,
      },
      // {
      //   label: 'Integrations',
      //   href: '/client/landlord/integrations',
      //   icon: Link2,
      // },
      {
        label: 'Marketplace',
        href: '/client/landlord/marketplace',
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
            label: 'Permission',
            href: '/client/landlord/tools/permission',
            icon: ShieldUser,
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
        label: 'Documents & Templates',
        href: '/client/admin/documents-and-templates',
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
        label: 'Property Maintenance',
        href: '/client/admin/property-maintenance',
        icon: Wrench,
      },
      {
        label: 'Reports & Analytics',
        href: '/client/admin/reports-and-analytics',
        icon: BarChart3,
      },
      // {
      //   label: 'Integrations',
      //   href: '/client/admin/integrations',
      //   icon: Link2,
      // },
      {
        label: 'Marketplace',
        href: '/client/admin/marketplace',
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
  if (role === 'MORTGAGE_ADVISER') {
    return [
      {
        label: 'Dashboard',
        href: '/client/mortgage-adviser/dashboard',
        icon: LayoutDashboard,
      },
      {
        label: 'Properties',
        href: '/client/mortgage-adviser/properties',
        icon: House,
      },
      {
        label: 'Mortgages',
        href: '/client/mortgage-adviser/mortgages',
        icon: Landmark,
      },
      {
        label: 'Tools',
        icon: Hammer,
        children: [
          {
            label: 'Calculators',
            href: '/client/mortgage-adviser/tools/calculators',
            icon: Calculator,
          },
        ],
      },
      {
        label: 'Support Tickets',
        href: '/client/mortgage-adviser/support-tickets',
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
        label: 'Rent & Payments',
        href: '/client/tenant/rent-and-payments',
        icon: Banknote,
      },
      {
        label: 'Maintenance Requests',
        href: '/client/tenant/maintenance-requests',
        icon: Wrench,
      },
      {
        label: 'Documents',
        href: '/client/tenant/documents',
        icon: FileText,
      },
      // {
      //   label: 'Tenancy Renewals',
      //   href: '/client/tenant/tenancy-renewals',
      //   icon: RotateCw,
      // },
      // {
      //   label: 'Utilities',
      //   href: '/client/tenant/utilities',
      //   icon: Zap,
      // },
    ];
  }

  return [];
};
