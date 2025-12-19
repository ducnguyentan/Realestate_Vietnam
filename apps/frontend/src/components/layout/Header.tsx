'use client';

import { useState } from 'react';
import Link from 'next/link';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Trang chủ' },
    { href: '/mua-ban', label: 'Mua bán' },
    { href: '/cho-thue', label: 'Cho thuê' },
    { href: '/tin-tuc', label: 'Tin tức' },
    { href: '/lien-he', label: 'Liên hệ' },
  ];

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
            <Link
              href="/dang-nhap"
              className="rounded-md px-4 py-2 text-base font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Đăng nhập
            </Link>
            <Link
              href="/dang-ky"
              className="rounded-md bg-danger px-4 py-2 text-base font-medium text-white transition-all hover:bg-[#C62828] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
            >
              Đăng ký
            </Link>
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
              <Link
                href="/dang-nhap"
                className="block rounded-md px-3 py-2 text-base font-medium text-white transition-colors hover:bg-primary-dark"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Đăng nhập
              </Link>
              <Link
                href="/dang-ky"
                className="mt-2 block rounded-md bg-danger px-3 py-2 text-base font-medium text-white transition-colors hover:bg-[#C62828]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Đăng ký
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
