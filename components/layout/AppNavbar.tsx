'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, LogOut, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

function getInitials(name?: string | null, email?: string | null) {
  if (name) {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  return email?.slice(0, 2).toUpperCase() ?? 'LK';
}

export default function AppNavbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className='sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <SidebarTrigger className='-ml-1' />
      <Separator orientation='vertical' className='mr-2 h-4' />

      <div className='flex flex-1 items-center justify-between gap-4'>
        <div>
          <p className='text-sm font-medium text-foreground'>Welcome back</p>
          <p className='text-xs text-muted-foreground'>
            {user?.name ?? user?.email ?? 'Landkeeper user'}
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon-sm' aria-label='Notifications'>
            <Bell className='size-4' />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='relative size-8 rounded-full p-0'
              >
                <Avatar size='sm'>
                  <AvatarFallback className='bg-green-900 text-white text-xs'>
                    {getInitials(user?.name, user?.email)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuLabel>
                <div className='flex flex-col gap-1'>
                  <span className='font-medium'>{user?.name ?? 'User'}</span>
                  <span className='text-xs font-normal text-muted-foreground'>
                    {user?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <User className='size-4' />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant='destructive'
                onClick={() => signOut({ callbackUrl: '/auth/login' })}
              >
                <LogOut className='size-4' />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
