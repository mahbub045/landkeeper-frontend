'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { buildItems, type NavItem } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { useGetProfileInfoQuery } from '@/store/api/endpoints/common/ProfileSettings/ProfileApi';
import { UserRole } from '@/types/next-auth';
import formatChoiceFieldValue, { getInitials } from '@/utils/formatters';
import { ChevronRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import Loading from '../common/CustomLoader/Loading';
import { Badge } from '../ui/badge';

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavMenu({ items, pathname }: { items: NavItem[]; pathname: string }) {
  const [openItems, setOpenItems] = React.useState<Set<string>>(new Set());

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

        return (
          <SidebarMenuItem key={key}>
            {hasChildren ? (
              <>
                <SidebarMenuButton
                  onClick={() => toggleOpen(item.label)}
                  isActive={isActive}
                  tooltip={item.label}
                  className='data-active:bg-primary/90 data-active:hover:bg-primary h-9 rounded-lg data-active:text-white data-active:shadow-none data-active:hover:text-white'
                >
                  <item.icon />
                  <span>{item.label}</span>
                  <ChevronRight
                    className={cn(
                      'ml-auto transition-transform',
                      openItems.has(item.label) && 'rotate-90',
                    )}
                  />
                </SidebarMenuButton>
                {openItems.has(item.label) && (
                  <SidebarMenuSub>
                    {item.children!.map((child) => (
                      <SidebarMenuSubItem key={child.href || child.label}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={
                            child.href
                              ? isNavActive(pathname, child.href)
                              : false
                          }
                          className='data-active:bg-primary/95 data-active:hover:bg-primary rounded-lg data-active:text-white data-active:shadow-none data-active:hover:text-white'
                        >
                          <Link href={child.href || '#'}>
                            <child.icon
                              className={cn(
                                'h-4 w-4',
                                isNavActive(pathname, child.href || '') &&
                                  'text-white!',
                              )}
                            />
                            <span>{child.label}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </>
            ) : (
              item.href && (
                <>
                  <SidebarMenuButton
                    asChild
                    isActive={isNavActive(pathname, item.href)}
                    tooltip={item.label}
                    className='data-active:bg-primary/90 data-active:hover:bg-primary h-9 rounded-lg data-active:text-white data-active:shadow-none data-active:hover:text-white'
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.badge ? (
                    <SidebarMenuBadge className='bg-danger rounded-full px-1.5 text-[10px] font-semibold text-white!'>
                      {item.badge}
                    </SidebarMenuBadge>
                  ) : null}
                </>
              )
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
  const navItems = buildItems({ role: userRole });

  const { data: profileData, isLoading } = useGetProfileInfoQuery(undefined);

  if (isLoading) {
    return (
      <Sidebar collapsible='icon'>
        <div className='flex h-full items-center justify-center'>
          <Loading />
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader className='gap-0 px-4 py-4 group-data-[collapsible=icon]:px-2'>
        <div className='flex items-center gap-2 group-data-[collapsible=icon]:hidden'>
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
        <span
          className={cn(
            'bg-warning text-warning-foreground inline-flex w-fit items-center rounded-full px-3 py-0.5 text-xs font-semibold',
            'group-data-[collapsible=icon]:hidden',
          )}
        >
          Premium Plan
        </span>
      </SidebarHeader>

      <SidebarSeparator className='mx-0 h-px!' />

      <SidebarContent className='gap-1 px-2 py-2'>
        <SidebarGroup className='p-0'>
          <SidebarGroupLabel className='px-3 text-[11px] font-semibold tracking-wider uppercase'>
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <NavMenu items={navItems} pathname={pathname} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className='mx-0 h-px!' />

      <SidebarFooter className='p-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:p-2'>
        <div className='flex items-center gap-3 group-data-[collapsible=icon]:justify-center'>
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
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
