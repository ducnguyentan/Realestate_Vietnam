'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-xl px-md">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-heading text-4xl font-bold text-gray-dark mb-md">
            Điều khoản sử dụng
          </h1>
          <p className="text-lg text-gray-medium mb-lg">
            Nội dung điều khoản sử dụng đang được hoàn thiện.
          </p>
          <div className="rounded-xl bg-white p-xl shadow-md">
            <div className="text-center mb-lg">
              <div className="text-6xl mb-md">📜</div>
              <h2 className="font-heading text-2xl font-semibold text-gray-dark mb-sm">
                Điều khoản sử dụng
              </h2>
              <p className="text-gray-medium">
                Chúng tôi đang cập nhật nội dung điều khoản sử dụng đầy đủ và chi tiết.
              </p>
            </div>
            <div className="prose max-w-none">
              <h3 className="font-heading text-xl font-semibold text-gray-dark mb-md">Tạm thời</h3>
              <p className="text-gray-dark mb-md">
                Khi sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện
                được nêu tại đây. Nội dung chi tiết sẽ được cập nhật sớm nhất.
              </p>
              <p className="text-gray-medium">
                Vui lòng quay lại sau để xem nội dung đầy đủ hoặc liên hệ với chúng tôi để được hỗ
                trợ.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
