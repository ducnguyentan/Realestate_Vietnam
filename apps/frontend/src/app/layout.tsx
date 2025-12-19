import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Roboto } from 'next/font/google';
import { Providers } from '@/lib/providers';
import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sàn Giao Dịch BĐS Việt Nam - Vietnamese Real Estate Exchange',
  description:
    'Nền tảng giao dịch bất động sản hàng đầu tại Việt Nam. Mua bán, cho thuê nhà đất, căn hộ, chung cư uy tín và minh bạch.',
  keywords: 'bất động sản, mua bán nhà đất, cho thuê căn hộ, real estate vietnam',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${beVietnamPro.variable} ${roboto.variable} font-body antialiased text-gray-dark bg-cream`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
