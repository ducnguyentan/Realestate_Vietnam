'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function BuyerDashboardContent() {
  const { user } = useAuth();
  const [activeMenu, setActiveMenu] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { id: 'overview', label: 'Tổng quan', icon: '🏠', href: '/dashboard/buyer' },
    { id: 'search', label: 'Tìm kiếm', icon: '🔍', href: '/dashboard/buyer/search' },
    { id: 'favorites', label: 'Yêu thích', icon: '❤️', href: '/dashboard/buyer/favorites' },
    { id: 'history', label: 'Lịch sử', icon: '📜', href: '/dashboard/buyer/history' },
    { id: 'profile', label: 'Hồ sơ', icon: '👤', href: '/profile' },
  ];

  const savedSearches = [
    { id: 1, name: 'Căn hộ Quận 1, 2-3 phòng ngủ', count: 23 },
    { id: 2, name: 'Nhà phố Quận 2, giá < 5 tỷ', count: 12 },
    { id: 3, name: 'Đất nền Bình Dương', count: 45 },
  ];

  const recommendedProperties = [
    {
      id: 1,
      title: 'Căn hộ cao cấp view sông',
      location: 'Quận 1, TP. Hồ Chí Minh',
      price: '5.2 tỷ',
      beds: 3,
      baths: 2,
      area: '120m²',
      image: 'https://placehold.co/400x300/0D47A1/FFFFFF/png?text=Property+1',
    },
    {
      id: 2,
      title: 'Nhà phố hiện đại',
      location: 'Quận 2, TP. Hồ Chí Minh',
      price: '8.5 tỷ',
      beds: 4,
      baths: 3,
      area: '200m²',
      image: 'https://placehold.co/400x300/42A5F5/FFFFFF/png?text=Property+2',
    },
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
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl text-white">
                    {user?.fullName.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-dark">{user?.fullName}</p>
                  <p className="text-xs text-gray-medium">Khách hàng</p>
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
              Tìm kiếm bất động sản
            </h1>
            <p className="mt-xs text-base text-gray-medium">
              Chào mừng {user?.fullName} quay trở lại
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-lg rounded-xl bg-white p-lg shadow-md">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo vị trí, loại BĐS, giá..."
                className="w-full rounded-lg border-2 border-gray-light py-3 pl-12 pr-md text-base transition-colors focus:border-primary-light focus:outline-none focus:ring-3 focus:ring-primary-light focus:ring-opacity-10"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
            </div>

            <div className="mt-md flex flex-wrap gap-sm">
              <button className="rounded-full bg-cream px-md py-xs text-sm text-gray-dark transition-colors hover:bg-primary hover:text-white">
                Căn hộ
              </button>
              <button className="rounded-full bg-cream px-md py-xs text-sm text-gray-dark transition-colors hover:bg-primary hover:text-white">
                Nhà phố
              </button>
              <button className="rounded-full bg-cream px-md py-xs text-sm text-gray-dark transition-colors hover:bg-primary hover:text-white">
                Đất nền
              </button>
              <button className="rounded-full bg-cream px-md py-xs text-sm text-gray-dark transition-colors hover:bg-primary hover:text-white">
                Biệt thự
              </button>
            </div>
          </div>

          {/* Saved Searches */}
          <div className="mb-lg rounded-xl bg-white p-lg shadow-md">
            <h2 className="mb-md font-heading text-xl font-semibold text-gray-dark">
              Tìm kiếm đã lưu
            </h2>
            <div className="space-y-md">
              {savedSearches.map((search) => (
                <div
                  key={search.id}
                  className="flex items-center justify-between rounded-lg border border-gray-light p-md transition-colors hover:border-primary-light hover:bg-cream"
                >
                  <div className="flex items-center gap-md">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light bg-opacity-10 text-xl">
                      🔍
                    </div>
                    <div>
                      <p className="font-medium text-gray-dark">{search.name}</p>
                      <p className="text-sm text-gray-medium">{search.count} kết quả mới</p>
                    </div>
                  </div>
                  <button className="rounded-lg bg-primary-light px-md py-xs text-sm font-medium text-white transition-colors hover:bg-primary">
                    Xem
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Properties */}
          <div className="rounded-xl bg-white p-lg shadow-md">
            <div className="mb-md flex items-center justify-between">
              <h2 className="font-heading text-xl font-semibold text-gray-dark">
                Bất động sản đề xuất
              </h2>
              <Link
                href="/search"
                className="text-sm font-medium text-primary-light hover:underline"
              >
                Xem tất cả
              </Link>
            </div>

            <div className="grid gap-md tablet:grid-cols-2">
              {recommendedProperties.map((property) => (
                <div
                  key={property.id}
                  className="overflow-hidden rounded-xl border border-gray-light transition-all hover:shadow-lg"
                >
                  <div className="relative aspect-video">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="h-full w-full object-cover"
                    />
                    <button className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white bg-opacity-90 text-xl transition-all hover:scale-110 hover:bg-opacity-100">
                      ❤️
                    </button>
                    <div className="absolute bottom-3 left-3 rounded-lg bg-danger px-md py-xs font-heading text-lg font-bold text-white">
                      {property.price}
                    </div>
                  </div>

                  <div className="p-md">
                    <h3 className="font-heading text-lg font-semibold text-gray-dark line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="mt-xs text-sm text-gray-medium">📍 {property.location}</p>

                    <div className="mt-md flex items-center gap-md text-sm text-gray-dark">
                      <span>🛏️ {property.beds}</span>
                      <span>🛁 {property.baths}</span>
                      <span>📐 {property.area}</span>
                    </div>

                    <button className="mt-md w-full rounded-lg border-2 border-primary-light py-2 text-sm font-medium text-primary-light transition-all hover:bg-primary-light hover:text-white">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function BuyerDashboardPage() {
  return (
    <ProtectedRoute allowedUserTypes={['buyer']}>
      <BuyerDashboardContent />
    </ProtectedRoute>
  );
}
