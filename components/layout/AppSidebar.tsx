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
import { buildItems, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/next-auth";
import formatChoiceFieldValue from "@/utils/formatters";
import { LoaderPinwheel } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
            className="data-active:bg-primary h-9 rounded-lg data-active:text-white data-active:shadow-none"
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
          {item.badge ? (
            <SidebarMenuBadge className="bg-danger rounded-full px-1.5 text-[10px] font-semibold text-white!">
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
  const { data: session, status } = useSession();
  const user = session?.user;
  const userRole = user?.role as UserRole | undefined;
  const navItems = buildItems({ role: userRole });
  const { resolvedTheme } = useTheme();

  const logoSrc =
    resolvedTheme === "dark"
      ? "/images/logo-white.png"
      : "/images/logo-black.png";

  if (status === "loading") {
    return (
      <Sidebar collapsible="icon">
        <div className="flex h-full items-center justify-center">
          <LoaderPinwheel className="animate-spin" />
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-3 px-4 py-4 group-data-[collapsible=icon]:px-2">
        <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center">
          <Image
            src={logoSrc}
            alt="Landkeeper"
            width={400}
            height={100}
            className="h-12 w-44 rounded-xl"
          />
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

      <SidebarSeparator className="mx-0 h-px!" />

      <SidebarContent className="gap-1 px-2 py-2">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-3 text-[11px] font-semibold tracking-wider uppercase">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <NavMenu items={navItems} pathname={pathname} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="mx-0 h-px!" />

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <Avatar size="sm">
            <AvatarFallback className="from-primary to-secondary bg-linear-to-br text-xs font-semibold text-white">
              {getInitials(user?.name, user?.email)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold">
              {user?.name ?? "User"}
            </p>
            <p className="truncate text-xs">
              {formatChoiceFieldValue(userRole)}
            </p>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
