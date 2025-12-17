-- =============================================
-- SEED DATA: Property Types, Packages, Sample Listings
-- Sàn Giao Dịch Bất Động Sản Việt Nam
-- =============================================

-- =============================================
-- 1. PROPERTY TYPES (Loại bất động sản)
-- =============================================

INSERT INTO property_types (id, code, name, name_en, icon, sort_order, is_active) VALUES
(gen_random_uuid(), 'apartment', 'Căn hộ chung cư', 'Apartment', 'building', 1, true),
(gen_random_uuid(), 'house', 'Nhà riêng', 'House', 'home', 2, true),
(gen_random_uuid(), 'villa', 'Biệt thự', 'Villa', 'castle', 3, true),
(gen_random_uuid(), 'townhouse', 'Nhà phố', 'Townhouse', 'building-2', 4, true),
(gen_random_uuid(), 'land', 'Đất nền', 'Land', 'map', 5, true),
(gen_random_uuid(), 'office', 'Văn phòng', 'Office', 'briefcase', 6, true),
(gen_random_uuid(), 'shophouse', 'Shophouse', 'Shophouse', 'store', 7, true),
(gen_random_uuid(), 'warehouse', 'Kho xưởng', 'Warehouse', 'warehouse', 8, true),
(gen_random_uuid(), 'hotel', 'Khách sạn', 'Hotel', 'hotel', 9, true),
(gen_random_uuid(), 'farm', 'Trang trại', 'Farm', 'trees', 10, true)
ON CONFLICT (code) DO NOTHING;

-- =============================================
-- 2. LISTING PACKAGES (Gói đăng tin)
-- =============================================

INSERT INTO listing_packages (id, code, name, description, duration_days, price, features, max_images, is_featured, sort_order, is_active) VALUES
(gen_random_uuid(), 'free', 'Miễn phí', 'Gói đăng tin cơ bản', 30, 0, 
 '["Hiển thị trong danh sách", "Tối đa 5 ảnh", "Hỗ trợ qua chat"]'::jsonb, 
 5, false, 1, true),

(gen_random_uuid(), 'standard', 'Tiêu chuẩn', 'Gói đăng tin phổ biến', 60, 200000, 
 '["Hiển thị trong danh sách", "Tối đa 15 ảnh", "Hỗ trợ qua chat", "Hiển thị số điện thoại", "Badge xác thực"]'::jsonb, 
 15, false, 2, true),

(gen_random_uuid(), 'premium', 'Cao cấp', 'Gói đăng tin nổi bật', 90, 500000, 
 '["Tin nổi bật", "Tối đa 30 ảnh", "Hỗ trợ 24/7", "Hiển thị số điện thoại", "Badge xác thực", "Ưu tiên tìm kiếm", "Hiển thị trên trang chủ"]'::jsonb, 
 30, true, 3, true),

(gen_random_uuid(), 'vip', 'VIP', 'Gói đăng tin VIP', 120, 1000000, 
 '["Tin VIP", "Không giới hạn ảnh", "Hỗ trợ 24/7 ưu tiên", "Hiển thị số điện thoại", "Badge VIP", "Ưu tiên tìm kiếm cao nhất", "Banner quảng cáo", "Video tour", "AI phân tích"]'::jsonb, 
 100, true, 4, true)
ON CONFLICT (code) DO NOTHING;

-- =============================================
-- 3. COMMISSION RULES (Quy tắc hoa hồng)
-- =============================================

INSERT INTO commission_rules (id, name, transaction_type, property_type, min_price, max_price, rate_percent, fixed_amount, is_active) VALUES
(gen_random_uuid(), 'Hoa hồng bán dưới 2 tỷ', 'sell', NULL, 0, 2000000000, 2.5, 0, true),
(gen_random_uuid(), 'Hoa hồng bán 2-10 tỷ', 'sell', NULL, 2000000000, 10000000000, 2.0, 0, true),
(gen_random_uuid(), 'Hoa hồng bán 10-50 tỷ', 'sell', NULL, 10000000000, 50000000000, 1.5, 0, true),
(gen_random_uuid(), 'Hoa hồng bán trên 50 tỷ', 'sell', NULL, 50000000000, NULL, 1.0, 0, true),
(gen_random_uuid(), 'Hoa hồng cho thuê', 'rent', NULL, 0, NULL, 0, 0, true) -- 1 tháng tiền thuê
ON CONFLICT DO NOTHING;

-- =============================================
-- 4. SAMPLE USERS (Người dùng mẫu)
-- =============================================

-- Admin user
INSERT INTO users (id, phone, email, full_name, password_hash, role, phone_verified, email_verified, is_active)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  '0900000001',
  'admin@batdongsan.vn',
  'System Admin',
  '$2b$10$rQZ9Y2HxVL3g.9Xy8Df6Ie6X7GQ3k8eQZ1Y2HxVL3g.9Xy8Df6Ie', -- password: Admin@123
  'admin',
  true,
  true,
  true
) ON CONFLICT (phone) DO NOTHING;

-- Sample seller
INSERT INTO users (id, phone, email, full_name, password_hash, role, phone_verified, email_verified, is_active)
VALUES (
  'b0000000-0000-0000-0000-000000000002',
  '0901234567',
  'seller@example.com',
  'Nguyễn Văn Bán',
  '$2b$10$rQZ9Y2HxVL3g.9Xy8Df6Ie6X7GQ3k8eQZ1Y2HxVL3g.9Xy8Df6Ie',
  'seller',
  true,
  false,
  true
) ON CONFLICT (phone) DO NOTHING;

-- Sample buyer
INSERT INTO users (id, phone, email, full_name, password_hash, role, phone_verified, email_verified, is_active)
VALUES (
  'c0000000-0000-0000-0000-000000000003',
  '0909876543',
  'buyer@example.com',
  'Trần Thị Mua',
  '$2b$10$rQZ9Y2HxVL3g.9Xy8Df6Ie6X7GQ3k8eQZ1Y2HxVL3g.9Xy8Df6Ie',
  'buyer',
  true,
  false,
  true
) ON CONFLICT (phone) DO NOTHING;

-- Sample agent
INSERT INTO users (id, phone, email, full_name, password_hash, role, phone_verified, email_verified, identity_verified, is_active)
VALUES (
  'd0000000-0000-0000-0000-000000000004',
  '0912345678',
  'agent@example.com',
  'Lê Văn Môi Giới',
  '$2b$10$rQZ9Y2HxVL3g.9Xy8Df6Ie6X7GQ3k8eQZ1Y2HxVL3g.9Xy8Df6Ie',
  'agent',
  true,
  true,
  true,
  true
) ON CONFLICT (phone) DO NOTHING;

-- =============================================
-- 5. SAMPLE LISTINGS (Tin đăng mẫu)
-- =============================================

-- Listing 1: Apartment in HCMC
INSERT INTO listings (
  id, code, title, description, transaction_type, property_type,
  price, price_per_m2, province_code, district_code, address,
  latitude, longitude, area_floor, bedrooms, bathrooms, floors, direction,
  legal_status, status, is_featured, verified, quality_score,
  seller_id, created_at, approved_at, expires_at
) VALUES (
  'l0000000-0000-0000-0000-000000000001',
  'BDS-HCM-001001',
  'Căn hộ cao cấp Vinhomes Central Park - 3PN view sông Sài Gòn',
  'Căn hộ cao cấp tại Vinhomes Central Park, Bình Thạnh. View trực diện sông Sài Gòn tuyệt đẹp.
  
  **Đặc điểm nổi bật:**
  - Diện tích: 120m² sử dụng
  - 3 phòng ngủ, 2 phòng tắm
  - Full nội thất cao cấp nhập khẩu
  - Hướng Đông Nam mát mẻ
  - Tầng 25, view sông panorama
  
  **Tiện ích:**
  - Hồ bơi vô cực
  - Gym hiện đại
  - Công viên 14ha
  - Trung tâm thương mại Vincom
  - Trường quốc tế
  
  Pháp lý: Sổ hồng chính chủ, sang tên ngay.',
  'sell', 'apartment',
  8500000000, 70833333,
  'HCM', 'HCM-BTh',
  'Landmark 81, 720A Điện Biên Phủ, Phường 22, Bình Thạnh',
  10.7942, 106.7214,
  120, 3, 2, 1, 'Đông Nam',
  'pink_book', 'approved', true, true, 0.95,
  'b0000000-0000-0000-0000-000000000002',
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '6 days',
  NOW() + INTERVAL '83 days'
) ON CONFLICT (code) DO NOTHING;

-- Listing 2: House in Hanoi
INSERT INTO listings (
  id, code, title, description, transaction_type, property_type,
  price, province_code, district_code, address,
  latitude, longitude, area_land, area_floor, bedrooms, bathrooms, floors, frontage, direction,
  legal_status, status, is_featured, verified, quality_score,
  seller_id, created_at, approved_at, expires_at
) VALUES (
  'l0000000-0000-0000-0000-000000000002',
  'BDS-HN-001002',
  'Nhà phố 5 tầng mặt tiền Cầu Giấy - Kinh doanh sầm uất',
  'Nhà phố mặt tiền đường lớn tại Cầu Giấy, vị trí kinh doanh cực đẹp.
  
  **Thông tin:**
  - Diện tích đất: 80m²
  - Diện tích xây dựng: 350m²
  - 5 tầng, mặt tiền 5m
  - 6 phòng ngủ, 5 phòng tắm
  
  **Vị trí:**
  - Mặt tiền đường lớn 15m
  - Gần Keangnam, Big C
  - Đông dân cư, kinh doanh tốt
  
  Phù hợp: Kinh doanh, văn phòng, nhà ở kết hợp kinh doanh.',
  'sell', 'townhouse',
  25000000000,
  'HN', 'HN-CG',
  '268 Cầu Giấy, Dịch Vọng, Cầu Giấy',
  21.0318, 105.7980,
  80, 350, 6, 5, 5, 5, 'Tây',
  'red_book', 'approved', true, true, 0.92,
  'b0000000-0000-0000-0000-000000000002',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '4 days',
  NOW() + INTERVAL '85 days'
) ON CONFLICT (code) DO NOTHING;

-- Listing 3: Land in Da Nang
INSERT INTO listings (
  id, code, title, description, transaction_type, property_type,
  price, price_per_m2, province_code, district_code, address,
  latitude, longitude, area_land, frontage, depth, direction,
  legal_status, status, verified, quality_score,
  seller_id, created_at, approved_at, expires_at
) VALUES (
  'l0000000-0000-0000-0000-000000000003',
  'BDS-DN-001003',
  'Đất nền ven biển Ngũ Hành Sơn - Tiềm năng tăng giá cao',
  'Đất nền đẹp tại Ngũ Hành Sơn, cách biển Mỹ Khê chỉ 500m.
  
  **Thông tin:**
  - Diện tích: 200m²
  - Mặt tiền: 10m, sâu 20m
  - Hướng Đông, đón gió biển
  
  **Vị trí:**
  - Cách biển Mỹ Khê 500m
  - Gần sân bay quốc tế
  - Khu vực phát triển du lịch
  
  **Pháp lý:**
  - Sổ đỏ chính chủ
  - Đất ở đô thị lâu dài
  - Quy hoạch ổn định',
  'sell', 'land',
  6000000000, 30000000,
  'DN', 'DN-NHS',
  'Đường Lê Văn Hiến, Khuê Mỹ, Ngũ Hành Sơn',
  16.0210, 108.2490,
  200, 10, 20, 'Đông',
  'red_book', 'approved', true, 0.88,
  'd0000000-0000-0000-0000-000000000004',
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '2 days',
  NOW() + INTERVAL '87 days'
) ON CONFLICT (code) DO NOTHING;

-- Listing 4: Rental apartment
INSERT INTO listings (
  id, code, title, description, transaction_type, property_type,
  price, province_code, district_code, address,
  latitude, longitude, area_floor, bedrooms, bathrooms, direction,
  legal_status, status, verified, quality_score,
  seller_id, created_at, approved_at, expires_at
) VALUES (
  'l0000000-0000-0000-0000-000000000004',
  'BDS-HCM-001004',
  'Cho thuê căn hộ Masteri Thảo Điền 2PN - Full nội thất',
  'Cho thuê căn hộ Masteri Thảo Điền, đầy đủ nội thất cao cấp.
  
  **Thông tin:**
  - Diện tích: 70m²
  - 2 phòng ngủ, 2 phòng tắm
  - Full nội thất nhập khẩu
  - Tầng 15, view hồ bơi
  
  **Giá thuê:** 18 triệu/tháng (bao phí quản lý)
  
  **Tiện ích:**
  - Hồ bơi, gym
  - Siêu thị, nhà hàng
  - Metro line 1 (sắp hoàn thành)
  
  Liên hệ xem nhà 24/7.',
  'rent', 'apartment',
  18000000,
  'HCM', 'HCM-TDuc',
  'Masteri Thảo Điền, Xa Lộ Hà Nội, Thảo Điền',
  10.8023, 106.7366,
  70, 2, 2, 'Đông Bắc',
  'pink_book', 'approved', true, 0.90,
  'b0000000-0000-0000-0000-000000000002',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '1 day',
  NOW() + INTERVAL '28 days'
) ON CONFLICT (code) DO NOTHING;

-- Listing 5: Villa in HCMC
INSERT INTO listings (
  id, code, title, description, transaction_type, property_type,
  price, province_code, district_code, address,
  latitude, longitude, area_land, area_floor, bedrooms, bathrooms, floors, direction,
  legal_status, status, is_featured, verified, quality_score,
  seller_id, created_at, approved_at, expires_at
) VALUES (
  'l0000000-0000-0000-0000-000000000005',
  'BDS-HCM-001005',
  'Biệt thự Thảo Điền compound - An ninh 24/7, hồ bơi riêng',
  'Biệt thự đơn lập trong compound cao cấp tại Thảo Điền.
  
  **Đặc điểm:**
  - Diện tích đất: 500m²
  - Diện tích xây dựng: 400m²
  - 4 phòng ngủ, 5 phòng tắm
  - 3 tầng + sân thượng
  - Hồ bơi riêng, sân vườn
  
  **Tiện ích compound:**
  - An ninh 24/7
  - Công viên, hồ điều hòa
  - Gần trường quốc tế
  
  **Pháp lý:** Sổ hồng, thanh toán linh hoạt.',
  'sell', 'villa',
  65000000000,
  'HCM', 'HCM-TDuc',
  'Compound Thảo Điền, Phường Thảo Điền, TP Thủ Đức',
  10.8065, 106.7320,
  500, 400, 4, 5, 3, 'Nam',
  'pink_book', 'approved', true, true, 0.98,
  'd0000000-0000-0000-0000-000000000004',
  NOW() - INTERVAL '1 day',
  NOW(),
  NOW() + INTERVAL '89 days'
) ON CONFLICT (code) DO NOTHING;

-- =============================================
-- 6. SAMPLE LISTING IMAGES
-- =============================================

INSERT INTO listing_images (id, listing_id, url, thumbnail_url, caption, sort_order, is_primary) VALUES
-- Images for Listing 1
(gen_random_uuid(), 'l0000000-0000-0000-0000-000000000001', 
 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200', 
 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
 'Phòng khách', 1, true),
(gen_random_uuid(), 'l0000000-0000-0000-0000-000000000001',
 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
 'Phòng ngủ master', 2, false),
(gen_random_uuid(), 'l0000000-0000-0000-0000-000000000001',
 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
 'View sông', 3, false),

-- Images for Listing 2
(gen_random_uuid(), 'l0000000-0000-0000-0000-000000000002',
 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200',
 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400',
 'Mặt tiền', 1, true),
(gen_random_uuid(), 'l0000000-0000-0000-0000-000000000002',
 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
 'Nội thất', 2, false),

-- Images for Listing 3
(gen_random_uuid(), 'l0000000-0000-0000-0000-000000000003',
 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200',
 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400',
 'Đất nền', 1, true),

-- Images for Listing 4
(gen_random_uuid(), 'l0000000-0000-0000-0000-000000000004',
 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200',
 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
 'Phòng khách', 1, true),

-- Images for Listing 5
(gen_random_uuid(), 'l0000000-0000-0000-0000-000000000005',
 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200',
 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
 'Biệt thự', 1, true),
(gen_random_uuid(), 'l0000000-0000-0000-0000-000000000005',
 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
 'Hồ bơi', 2, false)
ON CONFLICT DO NOTHING;

-- =============================================
-- 7. UPDATE STATISTICS
-- =============================================

-- Update listing counts
UPDATE listings SET views = floor(random() * 1000 + 100)::int WHERE status = 'approved';
UPDATE listings SET saves = floor(random() * 100 + 10)::int WHERE status = 'approved';
UPDATE listings SET contacts = floor(random() * 50 + 5)::int WHERE status = 'approved';

-- =============================================
-- COMMIT
-- =============================================

SELECT 'Seed data inserted successfully!' AS status;
