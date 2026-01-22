'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function RentalPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-xl px-md">
        <div className="mx-auto max-w-wide">
          <h1 className="font-heading text-4xl font-bold text-gray-dark mb-md">
            Cho thuê bất động sản
          </h1>
          <p className="text-lg text-gray-medium mb-lg">
            Trang cho thuê bất động sản đang được phát triển. Vui lòng quay lại sau.
          </p>
          <div className="rounded-xl bg-white p-xl shadow-md text-center">
            <div className="text-6xl mb-md">🔑</div>
            <h2 className="font-heading text-2xl font-semibold text-gray-dark mb-sm">
              Tính năng đang được xây dựng
            </h2>
            <p className="text-gray-medium">
              Chúng tôi đang hoàn thiện tính năng cho thuê bất động sản để mang đến trải nghiệm tốt
              nhất cho bạn.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
