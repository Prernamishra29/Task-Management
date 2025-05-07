'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="hidden border-r bg-muted/40 lg:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Icons.logo className="h-6 w-6" />
            <span>TaskFlow</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-all",
                pathname === "/dashboard" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )}
            >
              <Icons.dashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/tasks"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-all",
                pathname === "/dashboard/tasks" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )}
            >
              <Icons.tasks className="h-4 w-4" />
              All Tasks
            </Link>
            <Link
              href="/dashboard/tasks/create"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-all",
                pathname === "/dashboard/tasks/create" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )}
            >
              <Icons.add className="h-4 w-4" />
              Create Task
            </Link>
            <div className="my-2 border-t"></div>
            <Link
              href="/dashboard/profile"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-all",
                pathname === "/dashboard/profile" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )}
            >
              <Icons.user className="h-4 w-4" />
              Profile
            </Link>
            <Link
              href="/dashboard/settings"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-all",
                pathname === "/dashboard/settings" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )}
            >
              <Icons.settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={logout}
          >
            <Icons.logout className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}