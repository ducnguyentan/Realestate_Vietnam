'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not authenticated, redirect to login
        router.push('/login');
      } else if (user.userType === 'partner') {
        router.push('/dashboard/partner');
      } else {
        router.push('/dashboard/buyer');
      }
    }
  }, [user, loading, router]);

  // Show loading while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <div className="text-center">
        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-gray-dark">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}
