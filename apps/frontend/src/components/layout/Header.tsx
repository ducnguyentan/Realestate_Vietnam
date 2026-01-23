'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: '/', label: 'Trang chủ' },
    { href: '/mua-ban', label: 'Mua bán' },
    { href: '/cho-thue', label: 'Cho thuê' },
    { href: '/tin-tuc', label: 'Tin tức' },
    { href: '/lien-he', label: 'Liên hệ' },
  ];

  const getDashboardLink = () => {
    if (!user) return '/';
    return user.userType === 'partner' ? '/dashboard/partner' : '/dashboard/buyer';
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    router.push('/');
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <header className="sticky top-0 z-[1100] bg-primary shadow-md">
      <div className="mx-auto max-w-wide px-md tablet:px-lg desktop:px-xl">
        <div className="flex h-16 items-center justify-between tablet:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <span className="font-heading text-lg font-semibold text-white tablet:text-xl">
              Sàn Giao Dịch BĐS Việt Nam
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden tablet:flex tablet:items-center tablet:space-x-8"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b-2 border-transparent py-2 text-base font-medium text-white transition-colors hover:border-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden tablet:flex tablet:items-center tablet:space-x-4">
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-white transition-colors hover:bg-primary-dark"
                  aria-label="User menu"
                  aria-expanded={isUserMenuOpen}
                >
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.fullName}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-sm font-medium">
                      {user.fullName?.charAt(0) || '?'}
                    </div>
                  )}
                  <span className="font-medium">{user.fullName || 'User'}</span>
                  <svg
                    className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white py-2 shadow-xl">
                    <div className="border-b border-gray-light px-4 py-2">
                      <p className="text-sm font-medium text-gray-dark">{user.fullName}</p>
                      <p className="text-xs text-gray-medium">
                        {user.userType === 'partner' ? 'Đối tác' : 'Khách hàng'}
                      </p>
                    </div>
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-dark transition-colors hover:bg-cream"
                    >
                      <span>📊</span>
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-dark transition-colors hover:bg-cream"
                    >
                      <span>👤</span>
                      <span>Hồ sơ</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 border-t border-gray-light px-4 py-2 text-left text-sm text-danger transition-colors hover:bg-cream"
                    >
                      <span>🚪</span>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md px-4 py-2 text-base font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-danger px-4 py-2 text-base font-medium text-white transition-all hover:bg-[#C62828] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-white transition-colors hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white tablet:hidden"
            aria-label="Menu điều hướng"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-primary-dark tablet:hidden">
          <nav className="space-y-1 px-md py-sm" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-white transition-colors hover:bg-primary-dark"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-primary-dark pt-4">
              {isAuthenticated && user ? (
                <>
                  <div className="mb-3 flex items-center gap-2 px-3 py-2">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.fullName}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-white">
                        {user.fullName?.charAt(0) || '?'}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-white">{user.fullName || 'User'}</p>
                      <p className="text-xs text-white text-opacity-70">
                        {user.userType === 'partner' ? 'Đối tác' : 'Khách hàng'}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={getDashboardLink()}
                    className="block rounded-md px-3 py-2 text-base font-medium text-white transition-colors hover:bg-primary-dark"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    📊 Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block rounded-md px-3 py-2 text-base font-medium text-white transition-colors hover:bg-primary-dark"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    👤 Hồ sơ
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="mt-2 block w-full rounded-md bg-danger px-3 py-2 text-left text-base font-medium text-white transition-colors hover:bg-[#C62828]"
                  >
                    🚪 Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block rounded-md px-3 py-2 text-base font-medium text-white transition-colors hover:bg-primary-dark"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    className="mt-2 block rounded-md bg-danger px-3 py-2 text-base font-medium text-white transition-colors hover:bg-[#C62828]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
