'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [useOTP, setUseOTP] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!identifier.trim()) {
      newErrors.identifier = 'Vui lòng nhập email hoặc số điện thoại';
    }

    if (!useOTP && !password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (useOTP) {
        // TODO: Implement OTP login flow
        setErrors({
          submit: 'Đăng nhập OTP sẽ được triển khai trong phiên bản tiếp theo',
        });
        setIsSubmitting(false);
        return;
      }

      // Login with password
      await login({
        identifier,
        password,
        rememberMe,
      });

      // Get user type from response and redirect
      // Note: We need to access the user from context after login
      // For now, we'll redirect to a general dashboard
      router.push('/dashboard');
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Đăng nhập thất bại. Vui lòng thử lại.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-xl px-md">
      <div className="mx-auto max-w-md">
        <div className="rounded-xl bg-white p-lg shadow-lg tablet:p-xl">
          {/* Header */}
          <div className="mb-lg text-center">
            <h1 className="font-heading text-4xl font-bold text-gray-dark tablet:text-5xl">
              Đăng nhập
            </h1>
            <p className="mt-sm text-base text-gray-medium">Chào mừng bạn quay trở lại</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-lg">
            {/* Email or Phone */}
            <div>
              <label
                htmlFor="identifier"
                className="mb-sm block text-sm font-medium text-gray-dark"
              >
                Email hoặc số điện thoại <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className={`w-full rounded-lg border-2 px-md py-3 text-base transition-colors focus:border-primary-light focus:outline-none focus:ring-3 focus:ring-primary-light focus:ring-opacity-10 ${
                  errors.identifier ? 'border-danger' : 'border-gray-light'
                }`}
                placeholder="example@email.com hoặc +84 XXX XXX XXXX"
              />
              {errors.identifier && (
                <p className="mt-xs text-sm text-danger">{errors.identifier}</p>
              )}
            </div>

            {/* Login Method Toggle */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setUseOTP(!useOTP)}
                className="text-sm font-medium text-primary-light hover:underline"
              >
                {useOTP ? 'Đăng nhập bằng mật khẩu' : 'Đăng nhập bằng OTP'}
              </button>
            </div>

            {/* Password */}
            {!useOTP && (
              <div>
                <label
                  htmlFor="password"
                  className="mb-sm block text-sm font-medium text-gray-dark"
                >
                  Mật khẩu <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full rounded-lg border-2 px-md py-3 pr-12 text-base transition-colors focus:border-primary-light focus:outline-none focus:ring-3 focus:ring-primary-light focus:ring-opacity-10 ${
                      errors.password ? 'border-danger' : 'border-gray-light'
                    }`}
                    placeholder="Nhập mật khẩu"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-medium hover:text-gray-dark"
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && <p className="mt-xs text-sm text-danger">{errors.password}</p>}
              </div>
            )}

            {/* OTP Message */}
            {useOTP && (
              <div className="rounded-lg bg-primary-light bg-opacity-10 p-md text-sm text-primary">
                Mã OTP sẽ được gửi đến email hoặc số điện thoại của bạn
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            {!useOTP && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-sm">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-2 border-gray-light text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
                  />
                  <label htmlFor="rememberMe" className="text-sm text-gray-dark">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary-light hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="rounded-lg bg-danger bg-opacity-10 p-md text-sm text-danger">
                {errors.submit}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-danger py-3 text-base font-medium text-white transition-all hover:bg-[#C62828] hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-medium"
            >
              {isSubmitting ? 'Đang đăng nhập...' : useOTP ? 'Gửi mã OTP' : 'Đăng nhập'}
            </button>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-medium">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="font-medium text-primary-light hover:underline">
                Đăng ký ngay
              </Link>
            </p>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-light"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-medium">Hoặc đăng nhập với</span>
              </div>
            </div>

            {/* Social Login (Future) */}
            <div className="grid grid-cols-2 gap-md">
              <button
                type="button"
                disabled
                className="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-light bg-white py-2 text-sm font-medium text-gray-dark transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button
                type="button"
                disabled
                className="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-light bg-white py-2 text-sm font-medium text-gray-dark transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
