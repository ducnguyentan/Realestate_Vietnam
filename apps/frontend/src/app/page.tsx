'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PropertyCard } from '@/components/property/PropertyCard';

// Mock data for featured properties
const featuredProperties = [
  {
    id: '1',
    title: 'Căn hộ cao cấp view sông Sài Gòn',
    price: '5.2 tỷ',
    location: 'Quận 1, TP. Hồ Chí Minh',
    area: 120,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: 'Căn hộ',
    description: 'Vị trí đắc địa, nội thất cao cấp, view sông thoáng mát',
    slug: 'can-ho-cao-cap-view-song-sai-gon',
  },
  {
    id: '2',
    title: 'Nhà phố hiện đại 3 tầng khu Thảo Điền',
    price: '12.5 tỷ',
    location: 'Quận 2, TP. Hồ Chí Minh',
    area: 200,
    bedrooms: 4,
    bathrooms: 3,
    propertyType: 'Nhà phố',
    description: 'Thiết kế hiện đại, khu an ninh 24/7, gần trường quốc tế',
    slug: 'nha-pho-hien-dai-3-tang-khu-thao-dien',
  },
  {
    id: '3',
    title: 'Biệt thự vườn 2 mặt tiền đường lớn',
    price: '25 tỷ',
    location: 'Quận 7, TP. Hồ Chí Minh',
    area: 500,
    bedrooms: 5,
    bathrooms: 4,
    propertyType: 'Biệt thự',
    description: 'Khuôn viên rộng rãi, sân vườn đẹp, hồ bơi riêng',
    slug: 'biet-thu-vuon-2-mat-tien-duong-lon',
  },
];

export default function Home() {
  return (
    <>
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-primary-dark py-3xl text-white">
          <div className="mx-auto max-w-wide px-md tablet:px-lg desktop:px-xl">
            <div className="text-center">
              <h1 className="font-heading text-4xl font-bold leading-tight tablet:text-5xl desktop:text-6xl">
                Tìm Ngôi Nhà Mơ Ước
                <br />
                Của Bạn Tại Việt Nam
              </h1>
              <p className="mx-auto mt-lg max-w-2xl text-lg leading-loose tablet:text-xl">
                Nền tảng giao dịch bất động sản hàng đầu. Mua bán, cho thuê nhà đất uy tín và minh
                bạch.
              </p>

              {/* Search Bar */}
              <div className="mx-auto mt-xl max-w-3xl">
                <div className="flex flex-col gap-sm rounded-lg bg-white p-sm shadow-xl tablet:flex-row">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo địa điểm, dự án..."
                    className="flex-1 rounded-md border-2 border-gray-light px-4 py-3 text-base text-gray-dark placeholder:text-gray-medium focus:border-primary-light focus:outline-none"
                  />
                  <button
                    type="button"
                    className="rounded-md bg-danger px-8 py-3 text-base font-medium text-white transition-all hover:bg-[#C62828] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
                  >
                    <span className="flex items-center justify-center">
                      <svg
                        className="mr-2 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      Tìm kiếm
                    </span>
                  </button>
                </div>

                {/* Quick Filters */}
                <div className="mt-md flex flex-wrap justify-center gap-sm">
                  <Link
                    href="/mua-ban/can-ho"
                    className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all hover:bg-white/30"
                  >
                    Căn hộ
                  </Link>
                  <Link
                    href="/mua-ban/nha-pho"
                    className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all hover:bg-white/30"
                  >
                    Nhà phố
                  </Link>
                  <Link
                    href="/mua-ban/biet-thu"
                    className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all hover:bg-white/30"
                  >
                    Biệt thự
                  </Link>
                  <Link
                    href="/cho-thue"
                    className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all hover:bg-white/30"
                  >
                    Cho thuê
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Properties Section */}
        <section className="py-2xl">
          <div className="mx-auto max-w-wide px-md tablet:px-lg desktop:px-xl">
            <div className="mb-xl text-center">
              <h2 className="font-heading text-3xl font-bold text-gray-dark tablet:text-4xl">
                Bất Động Sản Nổi Bật
              </h2>
              <p className="mt-sm text-lg text-gray-medium">
                Khám phá những bất động sản được quan tâm nhiều nhất
              </p>
            </div>

            <div className="grid gap-lg tablet:grid-cols-2 desktop:grid-cols-3">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>

            <div className="mt-xl text-center">
              <Link
                href="/mua-ban"
                className="inline-block rounded-md border-2 border-primary bg-transparent px-8 py-3 text-base font-medium text-primary transition-all hover:bg-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Xem tất cả bất động sản
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Indicators Section */}
        <section className="bg-white py-2xl">
          <div className="mx-auto max-w-wide px-md tablet:px-lg desktop:px-xl">
            <div className="mb-xl text-center">
              <h2 className="font-heading text-3xl font-bold text-gray-dark tablet:text-4xl">
                Tại Sao Chọn Chúng Tôi?
              </h2>
            </div>

            <div className="grid gap-lg tablet:grid-cols-2 desktop:grid-cols-4">
              {/* Trust Indicator 1 */}
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <svg
                    className="h-8 w-8 text-success"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="mt-md font-heading text-xl font-semibold text-gray-dark">
                  Xác Minh Danh Tính
                </h3>
                <p className="mt-sm text-sm leading-relaxed text-gray-medium">
                  Tất cả người bán được xác minh danh tính và chứng nhận hợp pháp
                </p>
              </div>

              {/* Trust Indicator 2 */}
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-light/10">
                  <svg
                    className="h-8 w-8 text-primary-light"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mt-md font-heading text-xl font-semibold text-gray-dark">
                  Phản Hồi Nhanh Chóng
                </h3>
                <p className="mt-sm text-sm leading-relaxed text-gray-medium">
                  Cam kết phản hồi trong vòng 2 giờ từ các môi giới uy tín
                </p>
              </div>

              {/* Trust Indicator 3 */}
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
                  <svg
                    className="h-8 w-8 text-gold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <h3 className="mt-md font-heading text-xl font-semibold text-gray-dark">
                  Đánh Giá Cao
                </h3>
                <p className="mt-sm text-sm leading-relaxed text-gray-medium">
                  Hơn 10,000 đánh giá 5 sao từ khách hàng hài lòng
                </p>
              </div>

              {/* Trust Indicator 4 */}
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
                  <svg
                    className="h-8 w-8 text-danger"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <h3 className="mt-md font-heading text-xl font-semibold text-gray-dark">
                  Thanh Toán An Toàn
                </h3>
                <p className="mt-sm text-sm leading-relaxed text-gray-medium">
                  Hỗ trợ MoMo, ZaloPay, VietQR và các phương thức phổ biến
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-primary-light py-2xl text-white">
          <div className="mx-auto max-w-3xl px-md text-center tablet:px-lg desktop:px-xl">
            <h2 className="font-heading text-3xl font-bold tablet:text-4xl">
              Bạn Muốn Đăng Tin Bất Động Sản?
            </h2>
            <p className="mt-lg text-lg leading-loose">
              Tiếp cận hàng triệu khách hàng tiềm năng. Đăng tin miễn phí, dễ dàng và nhanh chóng.
            </p>
            <div className="mt-xl flex flex-col gap-sm tablet:flex-row tablet:justify-center">
              <Link
                href="/dang-tin"
                className="inline-block rounded-md bg-danger px-8 py-4 text-lg font-medium text-white transition-all hover:bg-[#C62828] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Đăng tin ngay
              </Link>
              <Link
                href="/lien-he"
                className="inline-block rounded-md border-2 border-white bg-transparent px-8 py-4 text-lg font-medium text-white transition-all hover:bg-white hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Liên hệ tư vấn
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
