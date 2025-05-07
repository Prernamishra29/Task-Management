'use client';

import { useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Import from provider
import { useAuth as useAuthFromProvider } from '@/components/providers/auth-provider';

// Export the hook
export const useAuth = useAuthFromProvider;

// Auth guard hook
export function useAuthGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      // Auth routes - redirect to dashboard if already authenticated
      const authRoutes = ['/login', '/register'];
      if (isAuthenticated && authRoutes.includes(pathname)) {
        router.push('/dashboard');
      }
      
      // Protected routes - redirect to login if not authenticated
      const isAuthRoute = authRoutes.includes(pathname);
      const isPublicRoute = ['/', '/about'].includes(pathname);
      
      if (!isAuthenticated && !isAuthRoute && !isPublicRoute) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  return { isLoading };
}