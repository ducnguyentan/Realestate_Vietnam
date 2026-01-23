'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ApartmentPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-xl px-md">
        <div className="mx-auto max-w-wide">
          <h1 className="font-heading text-4xl font-bold text-gray-dark mb-md">Mua bán căn hộ</h1>
          <p className="text-lg text-gray-medium mb-lg">
            Trang mua bán căn hộ đang được phát triển. Vui lòng quay lại sau.
          </p>
          <div className="rounded-xl bg-white p-xl shadow-md text-center">
            <div className="text-6xl mb-md">🏢</div>
            <h2 className="font-heading text-2xl font-semibold text-gray-dark mb-sm">
              Tính năng đang được xây dựng
            </h2>
            <p className="text-gray-medium">
              Chúng tôi đang hoàn thiện tính năng tìm kiếm và mua bán căn hộ để mang đến trải nghiệm
              tốt nhất cho bạn.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
