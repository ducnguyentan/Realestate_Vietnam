'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream py-xl px-md">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-heading text-4xl font-bold text-gray-dark mb-md">
            Chính sách bảo mật
          </h1>
          <p className="text-lg text-gray-medium mb-lg">
            Nội dung chính sách bảo mật đang được hoàn thiện.
          </p>
          <div className="rounded-xl bg-white p-xl shadow-md">
            <div className="text-center mb-lg">
              <div className="text-6xl mb-md">🔒</div>
              <h2 className="font-heading text-2xl font-semibold text-gray-dark mb-sm">
                Chính sách bảo mật
              </h2>
              <p className="text-gray-medium">
                Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Nội dung chi tiết đang được cập
                nhật.
              </p>
            </div>
            <div className="prose max-w-none">
              <h3 className="font-heading text-xl font-semibold text-gray-dark mb-md">Tạm thời</h3>
              <p className="text-gray-dark mb-md">
                Thông tin cá nhân của bạn được bảo vệ và sử dụng theo quy định pháp luật. Chúng tôi
                không chia sẻ thông tin của bạn với bên thứ ba mà không có sự đồng ý của bạn.
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
