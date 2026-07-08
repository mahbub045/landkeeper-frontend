import type { UserRole } from '@/types/next-auth';
import {
  ChartNoAxesCombined,
  FileText,
  Files,
  House,
  Landmark,
  LayoutDashboard,
  Package,
  Podcast,
  ReceiptText,
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
      {
        label: 'Billing',
        href: '/client/landlord/billing',
        icon: ReceiptText,
      },
      {
        label: 'Pricing Plans',
        href: '/client/landlord/pricing-plans',
        icon: Package,
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
        label: 'Support Tickets',
        href: '/client/letting-agent/support-tickets',
        icon: Ticket,
      },
    ];
  }

  return [];
};
