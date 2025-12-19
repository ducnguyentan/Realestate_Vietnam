import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-dark text-white">
      <div className="mx-auto max-w-wide px-md py-xl tablet:px-lg desktop:px-xl">
        <div className="grid gap-lg tablet:grid-cols-2 desktop:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="mb-md font-heading text-xl font-semibold">Sàn Giao Dịch BĐS Việt Nam</h3>
            <p className="mb-md text-sm leading-relaxed text-gray-light">
              Nền tảng giao dịch bất động sản hàng đầu tại Việt Nam. Mua bán, cho thuê nhà đất uy
              tín và minh bạch.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
                aria-label="Facebook"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
                aria-label="Zalo"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
                aria-label="YouTube"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-md font-heading text-lg font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/ve-chung-toi"
                  className="transition-colors hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  href="/dieu-khoan"
                  className="transition-colors hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
                >
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach"
                  className="transition-colors hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  href="/quy-che-hoat-dong"
                  className="transition-colors hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
                >
                  Quy chế hoạt động
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-md font-heading text-lg font-semibold">Dịch vụ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/mua-ban"
                  className="transition-colors hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
                >
                  Mua bán nhà đất
                </Link>
              </li>
              <li>
                <Link
                  href="/cho-thue"
                  className="transition-colors hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
                >
                  Cho thuê bất động sản
                </Link>
              </li>
              <li>
                <Link
                  href="/tu-van"
                  className="transition-colors hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
                >
                  Tư vấn đầu tư
                </Link>
              </li>
              <li>
                <Link
                  href="/tin-tuc"
                  className="transition-colors hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
                >
                  Tin tức thị trường
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="mb-md font-heading text-lg font-semibold">Liên hệ</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <svg
                  className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary-light"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="leading-relaxed">123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-2 h-5 w-5 flex-shrink-0 text-primary-light"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href="tel:+84123456789"
                  className="font-mono transition-colors hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
                >
                  +84 123 456 789
                </a>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-2 h-5 w-5 flex-shrink-0 text-primary-light"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:contact@realestate-vietnam.local"
                  className="transition-colors hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
                >
                  contact@realestate-vietnam.local
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-lg border-t border-gray-medium pt-lg text-center text-sm text-gray-light">
          <p>© {currentYear} Sàn Giao Dịch BĐS Việt Nam. Bảo lưu mọi quyền.</p>
        </div>
      </div>
    </footer>
  );
}
