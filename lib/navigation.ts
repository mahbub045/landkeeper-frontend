import {
  FileText,
  LayoutDashboard,
  MapPin,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const mainNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Parcels', href: '/parcels', icon: MapPin },
  { title: 'Applications', href: '/applications', icon: FileText },
  { title: 'Settings', href: '/settings', icon: Settings },
];
