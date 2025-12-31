'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { UploadService } from '@/services/upload.service';
import type { UserType } from '@/types/auth';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [userType, setUserType] = useState<UserType>('buyer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    }

    if (!email && !phone) {
      newErrors.contact = 'Vui lòng nhập email hoặc số điện thoại';
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (phone && !/^(\+84|0)[1-9]\d{8,9}$/.test(phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!termsAccepted) {
      newErrors.terms = 'Vui lòng đồng ý với điều khoản sử dụng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!UploadService.validateFileType(file, ['jpg', 'jpeg', 'png', 'webp'])) {
        setErrors({ ...errors, avatar: 'Chỉ chấp nhận file ảnh (JPG, PNG, WEBP)' });
        return;
      }

      // Validate file size (max 5MB)
      if (!UploadService.validateFileSize(file, 5)) {
        setErrors({ ...errors, avatar: 'Kích thước ảnh tối đa 5MB' });
        return;
      }

      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
      setErrors({ ...errors, avatar: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let avatarUrl: string | undefined;

      // Upload avatar if selected
      if (avatar) {
        setUploadingAvatar(true);
        const uploadResult = await UploadService.uploadSingle(avatar);
        avatarUrl = uploadResult.data.url;
        setUploadingAvatar(false);
      }

      // Register user
      await register({
        fullName,
        email: email || undefined,
        phone: phone || undefined,
        password,
        userType,
        avatar: avatarUrl,
      });

      // Redirect based on user type
      if (userType === 'partner') {
        router.push('/dashboard/partner');
      } else {
        router.push('/dashboard/buyer');
      }
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Đăng ký thất bại. Vui lòng thử lại.',
      });
    } finally {
      setIsSubmitting(false);
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-xl px-md">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl bg-white p-lg shadow-lg tablet:p-xl">
          {/* Header */}
          <div className="mb-lg text-center">
            <h1 className="font-heading text-4xl font-bold text-gray-dark tablet:text-5xl">
              Đăng ký tài khoản
            </h1>
            <p className="mt-sm text-base text-gray-medium">
              Tạo tài khoản để bắt đầu giao dịch bất động sản
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-lg">
            {/* User Type Selector */}
            <div>
              <label className="mb-sm block text-sm font-medium text-gray-dark">
                Loại tài khoản <span className="text-danger">*</span>
              </label>
              <div className="grid grid-cols-2 gap-md">
                <button
                  type="button"
                  onClick={() => setUserType('buyer')}
                  className={`rounded-lg border-2 p-md text-center transition-all ${
                    userType === 'buyer'
                      ? 'border-primary bg-[#E3F2FD] text-primary'
                      : 'border-gray-light bg-white text-gray-medium hover:border-primary-light'
                  }`}
                >
                  <div className="mb-xs text-3xl">👤</div>
                  <div className="font-medium">Khách hàng</div>
                  <div className="mt-xs text-xs text-gray-medium">Tìm kiếm BĐS</div>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('partner')}
                  className={`rounded-lg border-2 p-md text-center transition-all ${
                    userType === 'partner'
                      ? 'border-primary bg-[#E3F2FD] text-primary'
                      : 'border-gray-light bg-white text-gray-medium hover:border-primary-light'
                  }`}
                >
                  <div className="mb-xs text-3xl">🏢</div>
                  <div className="font-medium">Đối tác</div>
                  <div className="mt-xs text-xs text-gray-medium">Đăng ký BĐS lên sàn</div>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="mb-sm block text-sm font-medium text-gray-dark">
                Họ và tên <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full rounded-lg border-2 px-md py-3 text-base transition-colors focus:border-primary-light focus:outline-none focus:ring-3 focus:ring-primary-light focus:ring-opacity-10 ${
                  errors.fullName ? 'border-danger' : 'border-gray-light'
                }`}
                placeholder="Nguyễn Văn A"
              />
              {errors.fullName && <p className="mt-xs text-sm text-danger">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-sm block text-sm font-medium text-gray-dark">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-lg border-2 px-md py-3 text-base transition-colors focus:border-primary-light focus:outline-none focus:ring-3 focus:ring-primary-light focus:ring-opacity-10 ${
                  errors.email ? 'border-danger' : 'border-gray-light'
                }`}
                placeholder="example@email.com"
              />
              {errors.email && <p className="mt-xs text-sm text-danger">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="mb-sm block text-sm font-medium text-gray-dark">
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full rounded-lg border-2 px-md py-3 font-mono text-base transition-colors focus:border-primary-light focus:outline-none focus:ring-3 focus:ring-primary-light focus:ring-opacity-10 ${
                  errors.phone ? 'border-danger' : 'border-gray-light'
                }`}
                placeholder="+84 XXX XXX XXXX"
              />
              {errors.phone && <p className="mt-xs text-sm text-danger">{errors.phone}</p>}
              {errors.contact && <p className="mt-xs text-sm text-danger">{errors.contact}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-sm block text-sm font-medium text-gray-dark">
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
                  placeholder="Tối thiểu 8 ký tự"
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

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-sm block text-sm font-medium text-gray-dark"
              >
                Xác nhận mật khẩu <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full rounded-lg border-2 px-md py-3 pr-12 text-base transition-colors focus:border-primary-light focus:outline-none focus:ring-3 focus:ring-primary-light focus:ring-opacity-10 ${
                    errors.confirmPassword ? 'border-danger' : 'border-gray-light'
                  }`}
                  placeholder="Nhập lại mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-medium hover:text-gray-dark"
                  aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-xs text-sm text-danger">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Avatar Upload */}
            <div>
              <label className="mb-sm block text-sm font-medium text-gray-dark">
                Ảnh đại diện (tùy chọn)
              </label>
              <div className="flex items-center gap-md">
                {avatarPreview ? (
                  <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-gray-light">
                    <Image
                      src={avatarPreview}
                      alt="Avatar preview"
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-gray-light bg-cream text-3xl">
                    👤
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="avatar"
                    className="inline-block cursor-pointer rounded-lg border-2 border-primary-light bg-white px-md py-2 text-sm font-medium text-primary-light transition-all hover:bg-primary-light hover:text-white"
                  >
                    Chọn ảnh
                  </label>
                  <p className="mt-xs text-xs text-gray-medium">JPG, PNG hoặc WEBP (tối đa 5MB)</p>
                  {errors.avatar && <p className="mt-xs text-sm text-danger">{errors.avatar}</p>}
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-sm">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-2 border-gray-light text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
              />
              <label htmlFor="terms" className="text-sm text-gray-dark">
                Tôi đồng ý với{' '}
                <Link href="/terms" className="text-primary-light hover:underline">
                  Điều khoản sử dụng
                </Link>{' '}
                và{' '}
                <Link href="/privacy" className="text-primary-light hover:underline">
                  Chính sách bảo mật
                </Link>
              </label>
            </div>
            {errors.terms && <p className="text-sm text-danger">{errors.terms}</p>}

            {/* Submit Error */}
            {errors.submit && (
              <div className="rounded-lg bg-danger bg-opacity-10 p-md text-sm text-danger">
                {errors.submit}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || uploadingAvatar}
              className="w-full rounded-lg bg-danger py-3 text-base font-medium text-white transition-all hover:bg-[#C62828] hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-medium"
            >
              {isSubmitting
                ? uploadingAvatar
                  ? 'Đang tải ảnh lên...'
                  : 'Đang đăng ký...'
                : 'Đăng ký'}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-medium">
              Đã có tài khoản?{' '}
              <Link href="/login" className="font-medium text-primary-light hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
