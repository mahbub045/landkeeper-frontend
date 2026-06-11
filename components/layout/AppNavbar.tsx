"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, LogOut, Moon, Sun, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Input } from "../ui/input";
import { useTheme } from 'next-themes';

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

export default function AppNavbar() {
  const { data: session } = useSession();
  const user = session?.user;
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" />

      <div className="flex flex-1 items-center justify-between gap-4">
        <div>
          <Input
            className="min-w-sm"
            placeholder="Search properties, tenants, or documents..."
          />
        </div>

        <div className="flex items-center gap-2">
           {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="dark:shadow-gray-600"
            >
              <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>

          <Button variant="ghost" size="icon-sm" aria-label="Notifications">
            <Bell className="size-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative size-8 rounded-full p-0"
              >
                <Avatar size="sm">
                  <AvatarFallback className="bg-green-900 text-xs text-white">
                    {getInitials(user?.name, user?.email)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{user?.name ?? "User"}</span>
                  <span className="text-muted-foreground text-xs font-normal">
                    {user?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <User className="size-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
              >
                <LogOut className="size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
