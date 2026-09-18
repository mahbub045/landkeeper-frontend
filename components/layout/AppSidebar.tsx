'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { pricingPlanBadgeStyles } from '@/data/client/Landlord/BillingAndPlans/PricingPlanData';
import { buildItems, type NavItem } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { useGetProfileInfoQuery } from '@/store/api/endpoints/common/ProfileSettings/ProfileApi';
import { UserRole } from '@/types/next-auth';
import formatChoiceFieldValue, { getInitials } from '@/utils/formatters';
import { getStartNewJourneyUrl } from '@/utils/redirectPath';
import { isLandlord_Admin_LettingAgent } from '@/utils/rolePermissions';
import {
  ChevronRight,
  LogOut,
  Package,
  Plus,
  ReceiptText,
  Settings,
  User,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import Loading from '../common/CustomLoader/Loading';
import { handleSignOut } from '../SignOut';
import { Badge } from '../ui/badge';

// Paths that stay usable even without an active subscription — keep this
// in sync with LANDLORD_ALLOWED_PATHS_WITHOUT_SUBSCRIPTION in middleware.ts
const LANDLORD_ALLOWED_PATHS_WITHOUT_SUBSCRIPTION = [
  '/client/landlord/billing-and-plans/billing',
  '/client/landlord/billing-and-plans/pricing-plans',
  '/client/profile-settings',
];

function isSubscribed(user?: {
  has_subscription?: boolean;
  subscription_status?: string;
}): boolean {
  return (
    user?.has_subscription === true &&
    (user?.subscription_status === 'ACTIVE' ||
      user?.subscription_status === 'TRIALING')
  );
}

function isAllowedWithoutSubscription(href?: string): boolean {
  if (!href) return false;
  return LANDLORD_ALLOWED_PATHS_WITHOUT_SUBSCRIPTION.some((p) =>
    href.startsWith(p),
  );
}

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Returns the labels of all parent items that have an active child for the
// given pathname. Used to auto-expand the correct submenu on mount and
// whenever the route changes.
function getActiveParentLabels(items: NavItem[], pathname: string): string[] {
  const labels: string[] = [];
  for (const item of items) {
    if (Array.isArray(item.children) && item.children.length > 0) {
      const hasActiveChild = item.children.some(
        (child) => child.href && isNavActive(pathname, child.href),
      );
      if (hasActiveChild) {
        labels.push(item.label);
      }
    }
  }
  return labels;
}

// Unique, deterministic colors for icons — same label always maps to the same
// color, regardless of active/inactive state. Defined at module scope so the
// array/function identity is stable across renders.
const ICON_COLORS = [
  '#6366f1', // indigo
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ef4444', // red
  '#22c55e', // green
  '#06b6d4', // cyan
  '#f97316', // orange
  '#0ea5e9', // sky
  '#a855f7', // purple
  '#84cc16', // lime
  '#f43f5e', // rose
  '#10b981', // emerald
  '#eab308', // yellow
  '#3b82f6', // blue
  '#d946ef', // fuchsia
  '#0d9488', // teal-dark
  '#dc2626', // red-dark
  '#65a30d', // lime-dark
  '#ea580c', // orange-dark
  '#7c3aed', // violet-dark
  '#0891b2', // cyan-dark
  '#db2777', // pink-dark
  '#059669', // emerald-dark
  '#4f46e5', // indigo-dark
  '#9333ea', // purple-dark
  '#ca8a04', // amber-dark
  '#e11d48', // rose-dark
  '#2563eb', // blue-dark
  '#16a34a', // green-dark
  '#c026d3', // fuchsia-dark
  '#0284c7', // sky-dark
  '#b91c1c', // red-darker
  '#15803d', // green-darker
  '#6d28d9', // violet-darker
  '#be185d', // pink-darker
  '#a16207', // yellow-dark
  '#0e7490', // cyan-darker
  '#4338ca', // indigo-darker
  '#c2410c', // orange-darker
];

function getIconColor(key: string) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ICON_COLORS[Math.abs(hash) % ICON_COLORS.length];
}

function NavMenu({
  items,
  pathname,
  locked,
}: {
  items: NavItem[];
  pathname: string;
  locked: boolean;
}) {
  // Initialize from the current route instead of always starting empty, so
  // a hard reload lands with the correct submenu already expanded.
  const [openItems, setOpenItems] = React.useState<Set<string>>(
    () => new Set(getActiveParentLabels(items, pathname)),
  );

  // Track the pathname we last synced against. When it changes (e.g.
  // client-side navigation into a submenu item without the sidebar
  // remounting), adjust openItems during render instead of in an effect —
  // this is React's recommended pattern for deriving state from a changed
  // prop, and avoids the extra "commit -> effect -> setState -> re-render"
  // round trip. This only ever adds labels, so it never collapses a
  // submenu the user has manually toggled.
  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);

    const activeLabels = getActiveParentLabels(items, pathname);
    const missing = activeLabels.filter((label) => !openItems.has(label));
    if (missing.length > 0) {
      const next = new Set(openItems);
      missing.forEach((label) => next.add(label));
      setOpenItems(next);
    }
  }

  const toggleOpen = (label: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const isParentActive = (item: NavItem): boolean => {
    if (Array.isArray(item.children)) {
      return item.children.some(
        (child) => child.href && isNavActive(pathname, child.href),
      );
    }
    return item.href ? isNavActive(pathname, item.href) : false;
  };

  return (
    <SidebarMenu>
      {items.map((item, index) => {
        const key = item.href || `${item.label}-${index}`;
        const hasChildren =
          Array.isArray(item.children) && item.children.length > 0;
        const isActive = isParentActive(item);

        // A parent group is unlocked if it itself is an allowed path, or has
        // at least one allowed child — otherwise the whole group is disabled.
        const parentUnlocked =
          isAllowedWithoutSubscription(item.href) ||
          (hasChildren &&
            item.children!.some((c) => isAllowedWithoutSubscription(c.href)));
        const parentDisabled = locked && !parentUnlocked;

        return (
          <SidebarMenuItem key={key}>
            {hasChildren ? (
              <>
                {parentDisabled ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        isActive={isActive}
                        aria-disabled={parentDisabled}
                        className='h-9 cursor-not-allowed rounded-lg border-b-2 border-transparent opacity-40'
                      >
                        <item.icon
                          style={{ color: getIconColor(item.label) }}
                        />
                        <span>{item.label}</span>
                        <ChevronRight className='ml-auto' />
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent side='right'>
                      Subscribe to unlock this section
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <SidebarMenuButton
                    onClick={() => toggleOpen(item.label)}
                    isActive={isActive}
                    tooltip={item.label}
                    style={
                      isActive
                        ? { borderBottomColor: getIconColor(item.label) }
                        : undefined
                    }
                    className='h-9 cursor-pointer rounded-lg border-b-2 border-transparent data-active:bg-black/10 data-active:shadow-none data-active:hover:bg-black/15 dark:data-active:bg-white/15 dark:data-active:hover:bg-white/20'
                  >
                    <item.icon style={{ color: getIconColor(item.label) }} />
                    <span>{item.label}</span>
                    <ChevronRight
                      className={cn(
                        'ml-auto transition-transform',
                        openItems.has(item.label) && 'rotate-90',
                      )}
                    />
                  </SidebarMenuButton>
                )}
                {openItems.has(item.label) && (
                  <SidebarMenuSub>
                    {item.children!.map((child) => {
                      const childActive = child.href
                        ? isNavActive(pathname, child.href)
                        : false;
                      const childDisabled =
                        locked && !isAllowedWithoutSubscription(child.href);

                      return (
                        <SidebarMenuSubItem key={child.href || child.label}>
                          {childDisabled ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SidebarMenuSubButton
                                  isActive={childActive}
                                  aria-disabled={childDisabled}
                                  className='h-9 cursor-not-allowed rounded-lg border-b-2 border-transparent opacity-40'
                                >
                                  <child.icon
                                    style={{
                                      color: getIconColor(child.label),
                                    }}
                                    className='h-4 w-4'
                                  />
                                  <span>{child.label}</span>
                                </SidebarMenuSubButton>
                              </TooltipTrigger>
                              <TooltipContent side='right'>
                                Subscribe to unlock this section
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <SidebarMenuSubButton
                              asChild
                              isActive={childActive}
                              style={
                                childActive
                                  ? {
                                      borderBottomColor: getIconColor(
                                        child.label,
                                      ),
                                    }
                                  : undefined
                              }
                              className='h-9 rounded-lg border-b-2 border-transparent data-active:bg-black/5 data-active:shadow-none data-active:hover:bg-black/10 dark:data-active:bg-white/10 dark:data-active:hover:bg-white/15'
                            >
                              <Link href={child.href || '#'}>
                                <child.icon
                                  style={{ color: getIconColor(child.label) }}
                                  className='h-4 w-4'
                                />
                                <span>{child.label}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          )}
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                )}
              </>
            ) : (
              item.href &&
              (() => {
                const itemDisabled =
                  locked && !isAllowedWithoutSubscription(item.href);

                if (itemDisabled) {
                  return (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          isActive={isNavActive(pathname, item.href)}
                          aria-disabled={itemDisabled}
                          className='h-9 cursor-not-allowed rounded-lg border-b-2 border-transparent opacity-40'
                        >
                          <item.icon
                            style={{ color: getIconColor(item.label) }}
                          />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side='right'>
                        Subscribe to unlock this section
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return (
                  <>
                    <SidebarMenuButton
                      asChild
                      isActive={isNavActive(pathname, item.href)}
                      tooltip={item.label}
                      style={
                        isNavActive(pathname, item.href)
                          ? { borderBottomColor: getIconColor(item.label) }
                          : undefined
                      }
                      className='h-9 rounded-lg border-b-2 border-transparent data-active:bg-black/10 data-active:hover:bg-black/15 dark:data-active:bg-white/10 dark:data-active:hover:bg-white/15'
                    >
                      <Link href={item.href}>
                        <item.icon
                          style={{ color: getIconColor(item.label) }}
                        />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.badge ? (
                      <SidebarMenuBadge className='bg-danger rounded-full px-1.5 text-[10px] font-semibold text-white!'>
                        {item.badge}
                      </SidebarMenuBadge>
                    ) : null}
                  </>
                );
              })()
            )}
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

const AppSidebar: React.FC = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const userRole = user?.role as UserRole | undefined;

  const { data: profileData, isLoading } = useGetProfileInfoQuery(undefined);

  // navItems now depends on profileData.plan, so it's built after the
  // profile query instead of immediately after session resolves.
  const navItems = buildItems({ role: userRole, plan: profileData?.plan });

  // Landlords without an active/trialing subscription get a locked sidebar —
  // only the paths in LANDLORD_ALLOWED_PATHS_WITHOUT_SUBSCRIPTION stay usable.
  // Sourced from useGetProfileInfoQuery (live data) rather than the
  // session/JWT, since the JWT's has_subscription/subscription_status only
  // update when update() is explicitly called and can go stale otherwise.
  const sidebarLocked = userRole === 'LANDLORD' && !isSubscribed(profileData);

  if (isLoading) {
    return (
      <Sidebar collapsible='icon'>
        <div className='flex h-full items-center justify-center'>
          <Loading />
        </div>
      </Sidebar>
    );
  }

  const getProfilePath = () => {
    if (userRole === 'SUPER_ADMIN') {
      return '/super-admin/profile';
    }
    return '/client/profile-settings';
  };

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader className='gap-0 px-4 py-3 group-data-[collapsible=icon]:px-2'>
        <div className='flex items-center gap-1 group-data-[collapsible=icon]:hidden'>
          <Image
            src='/images/logo-black.png'
            alt='Landkeeper'
            width={400}
            height={150}
            className='h-12 w-40 rounded-xl dark:hidden'
            loading='eager'
          />
          <Image
            src='/images/logo-white.png'
            alt='Landkeeper'
            width={400}
            height={150}
            className='hidden h-12 w-40 rounded-xl dark:block'
            loading='eager'
          />
        </div>

        <div className='hidden items-center group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:text-center'>
          <Image
            src='/images/logo-black-icon.png'
            alt='Sebagriho'
            width={200}
            height={150}
            className='h-5.5 w-6 dark:hidden'
            loading='eager'
          />
          <Image
            src='/images/logo-white-icon.png'
            alt='Sebagriho'
            width={200}
            height={150}
            className='hidden h-5.5 w-6 dark:block'
            loading='eager'
          />
        </div>

        {session?.user?.role !== 'SUPER_ADMIN' && (
          <div className='group-data-[collapsible=icon]:hidden'>
            {sidebarLocked ? (
              <Link href='/client/landlord/billing-and-plans/billing'>
                <Badge
                  variant='destructive'
                  className='w-full cursor-pointer justify-center py-1.5 text-xs font-medium'
                >
                  Subscribe to unlock
                </Badge>
              </Link>
            ) : (
              <Badge
                variant='secondary'
                className={
                  pricingPlanBadgeStyles[
                    profileData?.plan as keyof typeof pricingPlanBadgeStyles
                  ] ||
                  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }
              >
                {formatChoiceFieldValue(profileData?.plan) || 'Unknown'} Plan
              </Badge>
            )}
          </div>
        )}
      </SidebarHeader>

      <SidebarSeparator className='mx-0 h-px!' />

      {isLandlord_Admin_LettingAgent(session?.user?.role ?? null) && (
        <Link
          href={sidebarLocked ? '#' : getStartNewJourneyUrl(session)}
          passHref
          aria-disabled={sidebarLocked}
          onClick={(e) => {
            if (sidebarLocked) e.preventDefault();
          }}
          className={cn(
            'flex justify-center px-3',
            sidebarLocked && 'pointer-events-none',
          )}
        >
          <Button
            type='button'
            size='lg'
            variant='secondary'
            disabled={sidebarLocked}
            className='rounded-xlf mt-3 w-full gap-2 group-data-[collapsible=icon]:mb-0 group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:px-0'
          >
            <Plus className='size-4' />
            <span className='group-data-[collapsible=icon]:hidden'>
              Start New Journey
            </span>
          </Button>
        </Link>
      )}

      <SidebarContent className='gap-1 px-2 py-2'>
        <SidebarGroup className='p-0'>
          <SidebarGroupLabel className='px-3 text-[11px] font-semibold tracking-wider uppercase'>
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <NavMenu
              items={navItems}
              pathname={pathname}
              locked={sidebarLocked}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className='p-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:p-2'>
        <SidebarSeparator className='mx-0 h-px!' />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type='button'
              className='flex w-full cursor-pointer items-center gap-3 rounded-lg p-1 text-left transition-colors outline-none group-data-[collapsible=icon]:justify-center'
            >
              <Avatar size='lg'>
                <AvatarImage
                  src={profileData?.profile_image ?? undefined}
                  alt='User profile picture'
                />
                <AvatarFallback className='bg-primary text-xs font-semibold text-white'>
                  {getInitials(profileData?.first_name) ?? 'U'}
                </AvatarFallback>
              </Avatar>
              <div className='min-w-0 group-data-[collapsible=icon]:hidden'>
                <p className='truncate text-sm font-semibold'>
                  {formatChoiceFieldValue(profileData?.title) ?? ''}{' '}
                  {profileData?.first_name} {profileData?.middle_name}{' '}
                  {profileData?.last_name}
                </p>
                <Badge className='truncate text-xs'>
                  {formatChoiceFieldValue(userRole)}
                </Badge>
              </div>
              <Settings size={16} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='end' className='w-56'>
            <DropdownMenuLabel>
              <div className='flex flex-col gap-1'>
                <span className='font-medium'>
                  {formatChoiceFieldValue(profileData?.title) ?? ''}{' '}
                  {profileData?.first_name} {profileData?.middle_name}{' '}
                  {profileData?.last_name}
                </span>
                <span className='text-muted-foreground text-xs font-normal'>
                  {profileData?.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={getProfilePath()} passHref>
              <DropdownMenuItem className='cursor-pointer'>
                <User className='size-4' />
                {userRole === 'SUPER_ADMIN' ? 'Profile' : 'Profile Settings'}
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            {userRole === 'LANDLORD' && (
              <>
                <Link
                  href='/client/landlord/billing-and-plans/billing'
                  passHref
                >
                  <DropdownMenuItem className='cursor-pointer'>
                    <ReceiptText className='size-4' />
                    Billing
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link
                  href='/client/landlord/billing-and-plans/pricing-plans'
                  passHref
                >
                  <DropdownMenuItem className='cursor-pointer'>
                    <Package className='size-4' />
                    Pricing Plans
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem
              variant='destructive'
              onClick={() => handleSignOut()}
              className='cursor-pointer'
            >
              <LogOut className='size-4' />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
