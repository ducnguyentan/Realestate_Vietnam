'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function PartnerDashboardContent() {
  const { user } = useAuth();
  const [activeMenu, setActiveMenu] = useState('overview');

  const menuItems = [
    { id: 'overview', label: 'Tổng quan', icon: '📊', href: '/dashboard/partner' },
    { id: 'create', label: 'Đăng tin', icon: '➕', href: '/dashboard/partner/create' },
    { id: 'listings', label: 'Tin đã đăng', icon: '📋', href: '/dashboard/partner/listings' },
    { id: 'stats', label: 'Thống kê', icon: '📈', href: '/dashboard/partner/stats' },
    { id: 'profile', label: 'Hồ sơ', icon: '👤', href: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-64 bg-white shadow-md tablet:block">
          <div className="p-lg">
            <div className="mb-lg">
              <div className="flex items-center gap-md">
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.fullName}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl text-white">
                    {user?.fullName.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-dark">{user?.fullName}</p>
                  <p className="text-xs text-gray-medium">Đối tác</p>
                </div>
              </div>
            </div>

            <nav className="space-y-xs">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveMenu(item.id)}
                  className={`flex items-center gap-md rounded-lg px-md py-sm transition-colors ${
                    activeMenu === item.id
                      ? 'bg-primary text-white'
                      : 'text-gray-dark hover:bg-cream'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-md tablet:p-lg">
          <div className="mb-lg">
            <h1 className="font-heading text-3xl font-bold text-gray-dark tablet:text-4xl">
              Tổng quan
            </h1>
            <p className="mt-xs text-base text-gray-medium">
              Chào mừng {user?.fullName} quay trở lại
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-lg grid gap-md tablet:grid-cols-2 desktop:grid-cols-4">
            <div className="rounded-xl bg-white p-md shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-medium">Tổng tin đăng</p>
                  <p className="mt-xs font-heading text-3xl font-bold text-gray-dark">12</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary bg-opacity-10 text-2xl">
                  📋
                </div>
              </div>
              <div className="mt-sm flex items-center gap-xs text-xs text-success">
                <span>↑ 8%</span>
                <span className="text-gray-medium">so với tháng trước</span>
              </div>
            </div>

            <div className="rounded-xl bg-white p-md shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-medium">Lượt xem</p>
                  <p className="mt-xs font-heading text-3xl font-bold text-gray-dark">1,284</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light bg-opacity-10 text-2xl">
                  👁️
                </div>
              </div>
              <div className="mt-sm flex items-center gap-xs text-xs text-success">
                <span>↑ 23%</span>
                <span className="text-gray-medium">so với tháng trước</span>
              </div>
            </div>

            <div className="rounded-xl bg-white p-md shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-medium">Liên hệ</p>
                  <p className="mt-xs font-heading text-3xl font-bold text-gray-dark">34</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success bg-opacity-10 text-2xl">
                  📞
                </div>
              </div>
              <div className="mt-sm flex items-center gap-xs text-xs text-success">
                <span>↑ 12%</span>
                <span className="text-gray-medium">so với tháng trước</span>
              </div>
            </div>

            <div className="rounded-xl bg-white p-md shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-medium">Yêu thích</p>
                  <p className="mt-xs font-heading text-3xl font-bold text-gray-dark">89</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger bg-opacity-10 text-2xl">
                  ❤️
                </div>
              </div>
              <div className="mt-sm flex items-center gap-xs text-xs text-success">
                <span>↑ 15%</span>
                <span className="text-gray-medium">so với tháng trước</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-lg rounded-xl bg-white p-lg shadow-md">
            <h2 className="mb-md font-heading text-xl font-semibold text-gray-dark">
              Hành động nhanh
            </h2>
            <div className="grid gap-md tablet:grid-cols-2">
              <Link
                href="/dashboard/partner/create"
                className="flex items-center gap-md rounded-lg border-2 border-dashed border-primary p-md transition-all hover:border-solid hover:bg-primary hover:bg-opacity-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl text-white">
                  ➕
                </div>
                <div>
                  <p className="font-medium text-gray-dark">Đăng tin mới</p>
                  <p className="text-sm text-gray-medium">Tạo tin đăng bất động sản mới</p>
                </div>
              </Link>

              <Link
                href="/dashboard/partner/listings"
                className="flex items-center gap-md rounded-lg border-2 border-gray-light p-md transition-all hover:border-primary-light hover:bg-cream"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light bg-opacity-10 text-2xl">
                  📋
                </div>
                <div>
                  <p className="font-medium text-gray-dark">Quản lý tin đăng</p>
                  <p className="text-sm text-gray-medium">Xem và chỉnh sửa tin đã đăng</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl bg-white p-lg shadow-md">
            <h2 className="mb-md font-heading text-xl font-semibold text-gray-dark">
              Hoạt động gần đây
            </h2>
            <div className="space-y-md">
              <div className="flex items-start gap-md border-b border-gray-light pb-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success bg-opacity-10 text-xl">
                  ✓
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-dark">Tin đăng đã được duyệt</p>
                  <p className="text-sm text-gray-medium">Căn hộ cao cấp Quận 1</p>
                  <p className="mt-xs text-xs text-gray-medium">2 giờ trước</p>
                </div>
              </div>

              <div className="flex items-start gap-md border-b border-gray-light pb-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light bg-opacity-10 text-xl">
                  📞
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-dark">Yêu cầu liên hệ mới</p>
                  <p className="text-sm text-gray-medium">Nguyễn Văn A muốn liên hệ</p>
                  <p className="mt-xs text-xs text-gray-medium">5 giờ trước</p>
                </div>
              </div>

              <div className="flex items-start gap-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger bg-opacity-10 text-xl">
                  ❤️
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-dark">Tin đăng được yêu thích</p>
                  <p className="text-sm text-gray-medium">Nhà phố Quận 2 nhận 3 lượt yêu thích</p>
                  <p className="mt-xs text-xs text-gray-medium">1 ngày trước</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function PartnerDashboardPage() {
  return (
    <ProtectedRoute allowedUserTypes={['partner']}>
      <PartnerDashboardContent />
    </ProtectedRoute>
  );
}
