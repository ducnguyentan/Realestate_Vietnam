'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ForgotPasswordPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-xl px-md">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-heading text-4xl font-bold text-gray-dark mb-md">Quên mật khẩu</h1>
          <p className="text-lg text-gray-medium mb-lg">
            Tính năng khôi phục mật khẩu đang được phát triển. Vui lòng quay lại sau.
          </p>
          <div className="rounded-xl bg-white p-xl shadow-md text-center">
            <div className="text-6xl mb-md">🔐</div>
            <h2 className="font-heading text-2xl font-semibold text-gray-dark mb-sm">
              Tính năng đang được xây dựng
            </h2>
            <p className="text-gray-medium mb-lg">
              Chúng tôi đang hoàn thiện tính năng khôi phục mật khẩu để hỗ trợ bạn tốt hơn.
            </p>
            <Link
              href="/login"
              className="inline-block rounded-md bg-primary px-6 py-3 text-base font-medium text-white transition-colors hover:bg-primary-dark"
            >
              Quay lại trang đăng nhập
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
