'use client';

import AppFooter from '@/components/layout/AppFooter';
import AppNavbar from '@/components/layout/AppNavbar';
import AppSidebar from '@/components/layout/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useIsTablet } from '@/hooks/use-mobile';

const MainBodyShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isTablet = useIsTablet();

  return (
    <SidebarProvider
      key={isTablet ? 'tablet' : 'desktop'}
      defaultOpen={!isTablet}
    >
      <TooltipProvider>
        <AppSidebar />
        <SidebarInset className='flex min-h-svh min-w-0 flex-col'>
          <AppNavbar />
          <div className='flex-1 bg-[#F4F2F2] p-4 md:p-6 dark:bg-[#1a1a1a]'>
            {children}
          </div>
          <AppFooter />
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
};

export default MainBodyShell;
