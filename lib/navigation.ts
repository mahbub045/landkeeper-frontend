import {
  FileText,
  FolderOpen,
  Home,
  Landmark,
  LayoutDashboard,
  LineChart,
  Settings,
  Shield,
  Users,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import type { UserRole } from '@/types/next-auth';

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

interface BuildItemsOptions {
  role: UserRole | undefined;
}

export const buildItems = ({ role }: BuildItemsOptions): NavItem[] => {
  if (role === "ADMIN") {
    return [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Properties', href: '/admin/parcels', icon: Home, badge: 5 },
      { label: 'Mortgages', href: '/admin/mortgages', icon: Landmark },
      { label: 'Tenants', href: '/admin/tenants', icon: Users },
      { label: 'Compliance', href: '/admin/compliance', icon: Shield, badge: 2 },
      { label: 'Documents', href: '/admin/applications', icon: FolderOpen },
      { label: 'Finance', href: '/admin/finance', icon: LineChart },
      { label: 'Reports', href: '/admin/reports', icon: FileText },
      { label: 'Team Access', href: '/admin/team', icon: UsersRound },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ];
  }

  if (role === "LANDLORD") {
    return [
      { label: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
      { label: 'Properties', href: '/client/parcels', icon: Home, badge: 5 },
      { label: 'Mortgages', href: '/client/mortgages', icon: Landmark },
      { label: 'Tenants', href: '/client/tenants', icon: Users },
      { label: 'Compliance', href: '/client/compliance', icon: Shield, badge: 2 },
      { label: 'Documents', href: '/client/applications', icon: FolderOpen },
      { label: 'Finance', href: '/client/finance', icon: LineChart },
      { label: 'Reports', href: '/client/reports', icon: FileText },
      { label: 'Settings', href: '/client/settings', icon: Settings },
    ];
  }

  if (role === "TENANT") {
    return [
      { label: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
      { label: 'Documents', href: '/client/applications', icon: FolderOpen },
      { label: 'Settings', href: '/client/settings', icon: Settings },
    ];
  }

  return [];
};

export function getDashboardPath(role: UserRole | undefined): string {
  if (role === "ADMIN") {
    return "/admin/dashboard";
  }
  return "/client/dashboard";
}

export function getRoleDisplayName(role: UserRole | undefined): string {
  const names: Record<UserRole, string> = {
    ADMIN: "Administrator",
    LANDLORD: "Landlord",
    TENANT: "Tenant",
  };
  return role ? names[role] : "User";
}
