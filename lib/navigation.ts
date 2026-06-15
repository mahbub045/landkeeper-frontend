import type { UserRole } from "@/types/next-auth";
import { ChartNoAxesCombined, Files, FileText, House, Landmark, LayoutDashboard, Settings, ShieldUser, UserKey, UsersRound, type LucideIcon } from "lucide-react";

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
      {
        label: "Properties",
        href: "/client/landlord/properties",
        icon: House,
      },
      {
        label: "Mortgages",
        href: "/client/landlord/mortgages",
        icon: Landmark,
      },
      {
        label: "Tenants",
        href: "/client/landlord/tenants",
        icon: UsersRound,
      },
      {
        label: "Compliance",
        href: "/client/landlord/compliance",
        icon: ShieldUser,
      },
      {
        label: "Documents",
        href: "/client/landlord/documents",
        icon: Files,
      },
      {
        label: "Finance",
        href: "/client/landlord/finance",
        icon: ChartNoAxesCombined,
      },
      {
        label: "Reports",
        href: "/client/landlord/reports",
        icon: FileText,
      },
      {
        label: "Team Access",
        href: "/client/landlord/team-access",
        icon: UserKey,
      },
      {
        label: "Settings",
        href: "/client/landlord/settings",
        icon: Settings,
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
