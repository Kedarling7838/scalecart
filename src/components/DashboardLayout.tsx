import { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { TopBar } from '@/components/TopBar';

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="flex-1 overflow-auto p-4 md:p-6 console-grid">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
