'use client';

import { useAuthGuard } from '@/hooks/use-auth';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuthGuard();
  const pathname = usePathname();
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className={cn("flex-1 p-6", pathname === '/dashboard' && "bg-muted/40")}>
          {children}
        </main>
      </div>
    </div>
  );
}