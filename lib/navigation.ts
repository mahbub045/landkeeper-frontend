import type { UserRole } from "@/types/next-auth";
import { LayoutDashboard, type LucideIcon } from "lucide-react";

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
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ];
  }

  if (role === "LANDLORD") {
    return [
      {
        label: "Dashboard",
        href: "/client/landlord/dashboard",
        icon: LayoutDashboard,
      },
    ];
  }

  if (role === "MORTGAGE_ADVISER") {
    return [
      {
        label: "Dashboard",
        href: "/client/mortgage-adviser/dashboard",
        icon: LayoutDashboard,
      },
    ];
  }

  if (role === "ACCOUNTANT") {
    return [
      {
        label: "Dashboard",
        href: "/client/accountant/dashboard",
        icon: LayoutDashboard,
      },
    ];
  }
  if (role === "LETTING_AGENT") {
    return [
      {
        label: "Dashboard",
        href: "/client/letting-agent/dashboard",
        icon: LayoutDashboard,
      },
    ];
  }

  return [];
};
export function getDashboardPath(role: UserRole | undefined): string {
  const paths: Record<UserRole, string> = {
    ADMIN: "/admin/dashboard",
    LANDLORD: "/client/landlord/dashboard",
    MORTGAGE_ADVISER: "/client/mortgage-adviser/dashboard",
    ACCOUNTANT: "/client/accountant/dashboard",
    LETTING_AGENT: "/client/letting-agent/dashboard",
  };
  return role ? paths[role] : "/auth/login";
}

export function getRoleDisplayName(role: UserRole | undefined): string {
  const names: Record<UserRole, string> = {
    ADMIN: "Administrator",
    LANDLORD: "Landlord",
    MORTGAGE_ADVISER: "Mortgage Adviser",
    ACCOUNTANT: "Accountant",
    LETTING_AGENT: "Letting Agent",
  };
  return role ? names[role] : "User";
}
