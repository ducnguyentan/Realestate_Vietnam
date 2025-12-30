'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { UserType } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: UserType[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedUserTypes,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Not authenticated - redirect to login
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // Check if user type is allowed
      if (allowedUserTypes && user && !allowedUserTypes.includes(user.userType)) {
        // Redirect to appropriate dashboard based on user type
        if (user.userType === 'partner') {
          router.push('/dashboard/partner');
        } else {
          router.push('/dashboard/buyer');
        }
      }
    }
  }, [loading, isAuthenticated, user, allowedUserTypes, router, redirectTo]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-md text-base text-gray-medium">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Check user type permission
  if (allowedUserTypes && user && !allowedUserTypes.includes(user.userType)) {
    return null;
  }

  return <>{children}</>;
}
