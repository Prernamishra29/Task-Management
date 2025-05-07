'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { Icons } from '@/components/ui/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NotificationPopover } from '@/components/dashboard/notification-popover';
import { usePathname } from 'next/navigation';

export function Header() {
  const { user, logout } = useAuth();
  const { setTheme } = useTheme();
  const pathname = usePathname();
  
  // Get page title based on pathname
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/dashboard/tasks') return 'All Tasks';
    if (pathname === '/dashboard/tasks/create') return 'Create Task';
    if (pathname.startsWith('/dashboard/tasks/') && pathname !== '/dashboard/tasks/create') 
      return 'Task Details';
    if (pathname === '/dashboard/profile') return 'Your Profile';
    
    return 'Dashboard';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-6">
        <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
        
        <div className="flex items-center gap-4">
          <NotificationPopover />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src="" alt={user?.name || 'User'} />
                  <AvatarFallback>{user ? getInitials(user.name) : 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="cursor-pointer flex w-full items-center">
                  <Icons.user className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer flex w-full items-center">
                  <Icons.settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Icons.circle className="mr-2 h-4 w-4" />
                Light Theme
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Icons.circle className="mr-2 h-4 w-4" />
                Dark Theme
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <Icons.logout className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
export default Header;