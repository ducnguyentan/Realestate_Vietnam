'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UploadService } from '@/services/upload.service';

function ProfileContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'avatar' | 'password' | 'kyc'>('info');

  // Personal Info State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');

  // Avatar State
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // KYC State
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [idFrontPreview, setIdFrontPreview] = useState<string | null>(null);
  const [idBackPreview, setIdBackPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tabs = [
    { id: 'info' as const, label: 'Thông tin cá nhân', icon: '👤' },
    { id: 'avatar' as const, label: 'Ảnh đại diện', icon: '📷' },
    { id: 'password' as const, label: 'Đổi mật khẩu', icon: '🔒' },
    ...(user?.userType === 'partner'
      ? [{ id: 'kyc' as const, label: 'Xác thực danh tính', icon: '✓' }]
      : []),
  ];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!UploadService.validateFileType(file, ['jpg', 'jpeg', 'png', 'webp'])) {
        setErrors({ avatar: 'Chỉ chấp nhận file ảnh (JPG, PNG, WEBP)' });
        return;
      }

      if (!UploadService.validateFileSize(file, 5)) {
        setErrors({ avatar: 'Kích thước ảnh tối đa 5MB' });
        return;
      }

      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
      setErrors({});
    }
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      if (!UploadService.validateFileType(file, ['jpg', 'jpeg', 'png', 'pdf'])) {
        setErrors({ [`id${side}`]: 'Chỉ chấp nhận file ảnh hoặc PDF' });
        return;
      }

      if (!UploadService.validateFileSize(file, 10)) {
        setErrors({ [`id${side}`]: 'Kích thước file tối đa 10MB' });
        return;
      }

      if (side === 'front') {
        setIdFront(file);
        setIdFrontPreview(URL.createObjectURL(file));
      } else {
        setIdBack(file);
        setIdBackPreview(URL.createObjectURL(file));
      }

      setErrors({ ...errors, [`id${side}`]: '' });
    }
  };

  const handleUpdateInfo = async () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (phone && !/^(\+84|0)[1-9]\d{8,9}$/.test(phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    // TODO: Call API to update user info
    setTimeout(() => {
      setSuccessMessage('Cập nhật thông tin thành công');
      setIsSubmitting(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const handleUploadAvatar = async () => {
    if (!avatar) {
      setErrors({ avatar: 'Vui lòng chọn ảnh' });
      return;
    }

    setUploadingAvatar(true);
    try {
      await UploadService.uploadSingle(avatar);
      // TODO: Call API to update user avatar
      setSuccessMessage('Cập nhật ảnh đại diện thành công');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({
        avatar: error instanceof Error ? error.message : 'Tải ảnh thất bại',
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleChangePassword = async () => {
    const newErrors: Record<string, string> = {};

    if (!oldPassword) {
      newErrors.oldPassword = 'Vui lòng nhập mật khẩu cũ';
    }

    if (!newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự';
    }

    if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    // TODO: Call API to change password
    setTimeout(() => {
      setSuccessMessage('Đổi mật khẩu thành công');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setIsSubmitting(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const handleSubmitKYC = async () => {
    if (!idFront || !idBack) {
      setErrors({ kyc: 'Vui lòng tải lên ảnh CMND/CCCD mặt trước và mặt sau' });
      return;
    }

    setIsSubmitting(true);
    try {
      await UploadService.uploadDocument(idFront);
      await UploadService.uploadDocument(idBack);
      // TODO: Call API to submit KYC
      setSuccessMessage('Gửi hồ sơ xác thực thành công. Chúng tôi sẽ xem xét trong 24-48 giờ.');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setErrors({
        kyc: error instanceof Error ? error.message : 'Gửi hồ sơ thất bại',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-lg px-md">
      <div className="mx-auto max-w-4xl">
        <div className="mb-lg">
          <h1 className="font-heading text-3xl font-bold text-gray-dark tablet:text-4xl">
            Hồ sơ cá nhân
          </h1>
          <p className="mt-xs text-base text-gray-medium">Quản lý thông tin tài khoản của bạn</p>
        </div>

        {successMessage && (
          <div className="mb-lg rounded-lg bg-success bg-opacity-10 p-md text-success">
            {successMessage}
          </div>
        )}

        <div className="rounded-xl bg-white shadow-lg">
          {/* Tabs */}
          <div className="border-b border-gray-light">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-sm whitespace-nowrap px-lg py-md font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-medium hover:text-gray-dark'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="hidden tablet:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-lg">
            {/* Personal Info Tab */}
            {activeTab === 'info' && (
              <div className="space-y-lg">
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-sm block text-sm font-medium text-gray-dark"
                  >
                    Họ và tên <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full rounded-lg border-2 px-md py-3 text-base transition-colors focus:border-primary-light focus:outline-none ${
                      errors.fullName ? 'border-danger' : 'border-gray-light'
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-xs text-sm text-danger">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="mb-sm block text-sm font-medium text-gray-dark">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-lg border-2 px-md py-3 text-base transition-colors focus:border-primary-light focus:outline-none ${
                      errors.email ? 'border-danger' : 'border-gray-light'
                    }`}
                  />
                  {errors.email && <p className="mt-xs text-sm text-danger">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="mb-sm block text-sm font-medium text-gray-dark">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full rounded-lg border-2 px-md py-3 font-mono text-base transition-colors focus:border-primary-light focus:outline-none ${
                      errors.phone ? 'border-danger' : 'border-gray-light'
                    }`}
                    placeholder="+84 XXX XXX XXXX"
                  />
                  {errors.phone && <p className="mt-xs text-sm text-danger">{errors.phone}</p>}
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="mb-sm block text-sm font-medium text-gray-dark"
                  >
                    Địa chỉ
                  </label>
                  <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border-2 border-gray-light px-md py-3 text-base transition-colors focus:border-primary-light focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleUpdateInfo}
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-primary py-3 text-base font-medium text-white transition-all hover:bg-primary-dark disabled:bg-gray-medium"
                >
                  {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                </button>
              </div>
            )}

            {/* Avatar Tab */}
            {activeTab === 'avatar' && (
              <div className="space-y-lg">
                <div className="flex flex-col items-center gap-lg">
                  {avatarPreview ? (
                    <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-gray-light">
                      <Image
                        src={avatarPreview}
                        alt="Avatar"
                        width={160}
                        height={160}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-dashed border-gray-light bg-cream text-6xl">
                      👤
                    </div>
                  )}

                  <div className="text-center">
                    <input
                      type="file"
                      id="avatarUpload"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="avatarUpload"
                      className="inline-block cursor-pointer rounded-lg border-2 border-primary-light bg-white px-lg py-sm font-medium text-primary-light transition-all hover:bg-primary-light hover:text-white"
                    >
                      Chọn ảnh mới
                    </label>
                    <p className="mt-sm text-sm text-gray-medium">
                      JPG, PNG hoặc WEBP (tối đa 5MB)
                    </p>
                    {errors.avatar && <p className="mt-xs text-sm text-danger">{errors.avatar}</p>}
                  </div>
                </div>

                <button
                  onClick={handleUploadAvatar}
                  disabled={!avatar || uploadingAvatar}
                  className="w-full rounded-lg bg-primary py-3 text-base font-medium text-white transition-all hover:bg-primary-dark disabled:bg-gray-medium"
                >
                  {uploadingAvatar ? 'Đang tải lên...' : 'Cập nhật ảnh đại diện'}
                </button>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="space-y-lg">
                <div>
                  <label
                    htmlFor="oldPassword"
                    className="mb-sm block text-sm font-medium text-gray-dark"
                  >
                    Mật khẩu cũ <span className="text-danger">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      id="oldPassword"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className={`w-full rounded-lg border-2 px-md py-3 pr-12 text-base transition-colors focus:border-primary-light focus:outline-none ${
                        errors.oldPassword ? 'border-danger' : 'border-gray-light'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-medium"
                    >
                      {showOldPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.oldPassword && (
                    <p className="mt-xs text-sm text-danger">{errors.oldPassword}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="mb-sm block text-sm font-medium text-gray-dark"
                  >
                    Mật khẩu mới <span className="text-danger">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`w-full rounded-lg border-2 px-md py-3 pr-12 text-base transition-colors focus:border-primary-light focus:outline-none ${
                        errors.newPassword ? 'border-danger' : 'border-gray-light'
                      }`}
                      placeholder="Tối thiểu 8 ký tự"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-medium"
                    >
                      {showNewPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="mt-xs text-sm text-danger">{errors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmNewPassword"
                    className="mb-sm block text-sm font-medium text-gray-dark"
                  >
                    Xác nhận mật khẩu mới <span className="text-danger">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmNewPassword"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className={`w-full rounded-lg border-2 px-md py-3 pr-12 text-base transition-colors focus:border-primary-light focus:outline-none ${
                        errors.confirmNewPassword ? 'border-danger' : 'border-gray-light'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-medium"
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.confirmNewPassword && (
                    <p className="mt-xs text-sm text-danger">{errors.confirmNewPassword}</p>
                  )}
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-primary py-3 text-base font-medium text-white transition-all hover:bg-primary-dark disabled:bg-gray-medium"
                >
                  {isSubmitting ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                </button>
              </div>
            )}

            {/* KYC Tab */}
            {activeTab === 'kyc' && user?.userType === 'partner' && (
              <div className="space-y-lg">
                <div className="rounded-lg bg-primary-light bg-opacity-10 p-md text-sm text-primary">
                  Để đăng tin bất động sản, bạn cần xác thực danh tính bằng CMND/CCCD. Thông tin của
                  bạn sẽ được bảo mật tuyệt đối.
                </div>

                <div className="grid gap-lg tablet:grid-cols-2">
                  <div>
                    <label className="mb-sm block text-sm font-medium text-gray-dark">
                      Mặt trước CMND/CCCD <span className="text-danger">*</span>
                    </label>
                    <div className="relative aspect-video overflow-hidden rounded-lg border-2 border-dashed border-gray-light bg-cream">
                      {idFrontPreview ? (
                        <Image src={idFrontPreview} alt="ID Front" fill className="object-cover" />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center text-gray-medium">
                          <span className="text-4xl">📄</span>
                          <span className="mt-sm text-sm">Tải lên mặt trước</span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      id="idFront"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleIdChange(e, 'front')}
                      className="hidden"
                    />
                    <label
                      htmlFor="idFront"
                      className="mt-sm inline-block cursor-pointer rounded-lg border-2 border-primary-light bg-white px-md py-xs text-sm font-medium text-primary-light transition-all hover:bg-primary-light hover:text-white"
                    >
                      Chọn file
                    </label>
                    {errors.idfront && (
                      <p className="mt-xs text-sm text-danger">{errors.idfront}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-sm block text-sm font-medium text-gray-dark">
                      Mặt sau CMND/CCCD <span className="text-danger">*</span>
                    </label>
                    <div className="relative aspect-video overflow-hidden rounded-lg border-2 border-dashed border-gray-light bg-cream">
                      {idBackPreview ? (
                        <Image src={idBackPreview} alt="ID Back" fill className="object-cover" />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center text-gray-medium">
                          <span className="text-4xl">📄</span>
                          <span className="mt-sm text-sm">Tải lên mặt sau</span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      id="idBack"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleIdChange(e, 'back')}
                      className="hidden"
                    />
                    <label
                      htmlFor="idBack"
                      className="mt-sm inline-block cursor-pointer rounded-lg border-2 border-primary-light bg-white px-md py-xs text-sm font-medium text-primary-light transition-all hover:bg-primary-light hover:text-white"
                    >
                      Chọn file
                    </label>
                    {errors.idback && <p className="mt-xs text-sm text-danger">{errors.idback}</p>}
                  </div>
                </div>

                {errors.kyc && (
                  <div className="rounded-lg bg-danger bg-opacity-10 p-md text-sm text-danger">
                    {errors.kyc}
                  </div>
                )}

                <button
                  onClick={handleSubmitKYC}
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-primary py-3 text-base font-medium text-white transition-all hover:bg-primary-dark disabled:bg-gray-medium"
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi hồ sơ xác thực'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
