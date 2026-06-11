"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { buildItems, getRoleDisplayName, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Building2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/types/next-auth";

function getInitials(name?: string | null, email?: string | null) {
  if (name) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return email?.slice(0, 2).toUpperCase() ?? "LK";
}

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavMenu({ items, pathname }: { items: NavItem[]; pathname: string }) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
          asChild
          isActive={isNavActive(pathname, item.href)}
          tooltip={item.label}
          className="h-9 rounded-lg text-white/90 hover:bg-white/5 hover:text-white data-active:bg-[#2563eb] data-active:text-white data-active:shadow-none"
        >
          <Link href={item.href}>
            <item.icon />
            <span>{item.label}</span>
          </Link>
        </SidebarMenuButton>
        {item.badge ? (
          <SidebarMenuBadge className="bg-danger rounded-full px-1.5 text-[10px] font-semibold text-white">
            {item.badge}
          </SidebarMenuBadge>
        ) : null}
      </SidebarMenuItem>
    ))}
    </SidebarMenu>
  );
}

export default function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const userRole = user?.role as UserRole | undefined;
  const navItems = buildItems({ role: userRole });

  return (
    <Sidebar
      collapsible="icon"
      className="**:data-[sidebar=sidebar]:border-[#1a2744] **:data-[sidebar=sidebar]:bg-[#0b1426] **:data-[sidebar=sidebar]:text-white"
    >
      <SidebarHeader className="gap-3 px-4 py-4 group-data-[collapsible=icon]:px-2">
        <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#2563eb] text-white">
            <Building2 className="size-4" />
          </div>
          <span className="truncate text-base font-bold group-data-[collapsible=icon]:hidden">
            Landkeeper
          </span>
        </div>
        <span
          className={cn(
            "bg-warning text-warning-foreground inline-flex w-fit items-center rounded-full px-3 py-0.5 text-xs font-semibold",
            "group-data-[collapsible=icon]:hidden",
          )}
        >
          Premium Plan
        </span>
      </SidebarHeader>

      <SidebarSeparator className="mx-0 h-px! bg-[#1a2744]!" />

      <SidebarContent className="gap-1 px-2 py-2">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-3 text-[11px] font-semibold tracking-wider text-white/40 uppercase">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <NavMenu items={navItems} pathname={pathname} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="mx-0 h-px! bg-[#1a2744]!" />

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <Avatar size="sm">
            <AvatarFallback className="bg-linear-to-br from-[#3b82f6] to-[#8b5cf6] text-xs font-semibold text-white">
              {getInitials(user?.name, user?.email)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold text-white">
              {user?.name ?? "User"}
            </p>
            <p className="truncate text-xs text-white/50">
              {getRoleDisplayName(userRole)}
            </p>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
