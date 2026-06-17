'use client';

import AppFooter from '@/components/layout/AppFooter';
import AppNavbar from '@/components/layout/AppNavbar';
import AppSidebar from '@/components/layout/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

const MainBodyShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <SidebarProvider>
      <TooltipProvider>
        <AppSidebar />
        <SidebarInset className='flex min-h-svh flex-col'>
          <AppNavbar />
          <div className='flex-1 p-4 md:p-6'>{children}</div>
          <AppFooter />
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
};

export default MainBodyShell;
