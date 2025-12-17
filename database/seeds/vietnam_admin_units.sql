-- ============================================
-- DỮ LIỆU ĐỊA GIỚI HÀNH CHÍNH VIỆT NAM
-- 63 Tỉnh/Thành phố theo địa giới hành chính mới 2024
-- ============================================

-- Xóa dữ liệu cũ (nếu có)
DELETE FROM admin_units WHERE level = 1;

-- ============================================
-- CẤP 1: TỈNH/THÀNH PHỐ TRỰC THUỘC TRUNG ƯƠNG
-- ============================================

-- 5 Thành phố trực thuộc Trung ương
INSERT INTO admin_units (code, name, name_en, level, region, latitude, longitude, is_active) VALUES
('HN', 'Thành phố Hà Nội', 'Hanoi', 1, 'north', 21.0285, 105.8542, true),
('HCM', 'Thành phố Hồ Chí Minh', 'Ho Chi Minh City', 1, 'south', 10.8231, 106.6297, true),
('DN', 'Thành phố Đà Nẵng', 'Da Nang', 1, 'central', 16.0544, 108.2022, true),
('HP', 'Thành phố Hải Phòng', 'Hai Phong', 1, 'north', 20.8449, 106.6881, true),
('CT', 'Thành phố Cần Thơ', 'Can Tho', 1, 'south', 10.0452, 105.7469, true);

-- Miền Bắc (25 tỉnh)
INSERT INTO admin_units (code, name, name_en, level, region, latitude, longitude, is_active) VALUES
('HG', 'Tỉnh Hà Giang', 'Ha Giang', 1, 'north', 22.8233, 104.9836, true),
('CB', 'Tỉnh Cao Bằng', 'Cao Bang', 1, 'north', 22.6666, 106.2522, true),
('BK', 'Tỉnh Bắc Kạn', 'Bac Kan', 1, 'north', 22.1470, 105.8348, true),
('TQ', 'Tỉnh Tuyên Quang', 'Tuyen Quang', 1, 'north', 21.8233, 105.2180, true),
('LC', 'Tỉnh Lào Cai', 'Lao Cai', 1, 'north', 22.4856, 103.9707, true),
('DB', 'Tỉnh Điện Biên', 'Dien Bien', 1, 'north', 21.3860, 103.0163, true),
('LS', 'Tỉnh Lai Châu', 'Lai Chau', 1, 'north', 22.3862, 103.4703, true),
('SL', 'Tỉnh Sơn La', 'Son La', 1, 'north', 21.3269, 103.9144, true),
('YB', 'Tỉnh Yên Bái', 'Yen Bai', 1, 'north', 21.7051, 104.8702, true),
('HB', 'Tỉnh Hòa Bình', 'Hoa Binh', 1, 'north', 20.8133, 105.3383, true),
('TN', 'Tỉnh Thái Nguyên', 'Thai Nguyen', 1, 'north', 21.5928, 105.8448, true),
('LG', 'Tỉnh Lạng Sơn', 'Lang Son', 1, 'north', 21.8460, 106.7576, true),
('QN', 'Tỉnh Quảng Ninh', 'Quang Ninh', 1, 'north', 21.0064, 107.2925, true),
('BG', 'Tỉnh Bắc Giang', 'Bac Giang', 1, 'north', 21.2820, 106.1974, true),
('PT', 'Tỉnh Phú Thọ', 'Phu Tho', 1, 'north', 21.3227, 105.4019, true),
('VP', 'Tỉnh Vĩnh Phúc', 'Vinh Phuc', 1, 'north', 21.3089, 105.6047, true),
('BN', 'Tỉnh Bắc Ninh', 'Bac Ninh', 1, 'north', 21.1861, 106.0763, true),
('HD', 'Tỉnh Hải Dương', 'Hai Duong', 1, 'north', 20.9373, 106.3147, true),
('HY', 'Tỉnh Hưng Yên', 'Hung Yen', 1, 'north', 20.6464, 106.0511, true),
('TB', 'Tỉnh Thái Bình', 'Thai Binh', 1, 'north', 20.4463, 106.3365, true),
('HNA', 'Tỉnh Hà Nam', 'Ha Nam', 1, 'north', 20.5835, 105.9230, true),
('ND', 'Tỉnh Nam Định', 'Nam Dinh', 1, 'north', 20.4388, 106.1621, true),
('NB', 'Tỉnh Ninh Bình', 'Ninh Binh', 1, 'north', 20.2506, 105.9745, true);

-- Miền Trung (14 tỉnh)
INSERT INTO admin_units (code, name, name_en, level, region, latitude, longitude, is_active) VALUES
('TH', 'Tỉnh Thanh Hóa', 'Thanh Hoa', 1, 'central', 19.8066, 105.7852, true),
('NA', 'Tỉnh Nghệ An', 'Nghe An', 1, 'central', 18.6790, 105.6813, true),
('HT', 'Tỉnh Hà Tĩnh', 'Ha Tinh', 1, 'central', 18.3559, 105.8877, true),
('QB', 'Tỉnh Quảng Bình', 'Quang Binh', 1, 'central', 17.4688, 106.6224, true),
('QT', 'Tỉnh Quảng Trị', 'Quang Tri', 1, 'central', 16.7563, 107.1854, true),
('TTH', 'Tỉnh Thừa Thiên Huế', 'Thua Thien Hue', 1, 'central', 16.4674, 107.5905, true),
('QNA', 'Tỉnh Quảng Nam', 'Quang Nam', 1, 'central', 15.5394, 108.0191, true),
('QNI', 'Tỉnh Quảng Ngãi', 'Quang Ngai', 1, 'central', 15.1214, 108.8044, true),
('BD', 'Tỉnh Bình Định', 'Binh Dinh', 1, 'central', 13.7829, 109.2196, true),
('PY', 'Tỉnh Phú Yên', 'Phu Yen', 1, 'central', 13.0882, 109.0929, true),
('KH', 'Tỉnh Khánh Hòa', 'Khanh Hoa', 1, 'central', 12.2585, 109.0526, true),
('NT', 'Tỉnh Ninh Thuận', 'Ninh Thuan', 1, 'central', 11.5752, 108.9880, true),
('BTH', 'Tỉnh Bình Thuận', 'Binh Thuan', 1, 'central', 10.9280, 108.1002, true);

-- Tây Nguyên (5 tỉnh)
INSERT INTO admin_units (code, name, name_en, level, region, latitude, longitude, is_active) VALUES
('KT', 'Tỉnh Kon Tum', 'Kon Tum', 1, 'highland', 14.3497, 108.0005, true),
('GL', 'Tỉnh Gia Lai', 'Gia Lai', 1, 'highland', 13.9833, 108.0000, true),
('DL', 'Tỉnh Đắk Lắk', 'Dak Lak', 1, 'highland', 12.6667, 108.0500, true),
('DNO', 'Tỉnh Đắk Nông', 'Dak Nong', 1, 'highland', 12.0000, 107.6833, true),
('LDO', 'Tỉnh Lâm Đồng', 'Lam Dong', 1, 'highland', 11.9465, 108.4419, true);

-- Miền Nam (17 tỉnh)
INSERT INTO admin_units (code, name, name_en, level, region, latitude, longitude, is_active) VALUES
('BP', 'Tỉnh Bình Phước', 'Binh Phuoc', 1, 'south', 11.7512, 106.7235, true),
('TN', 'Tỉnh Tây Ninh', 'Tay Ninh', 1, 'south', 11.3102, 106.0986, true),
('BDU', 'Tỉnh Bình Dương', 'Binh Duong', 1, 'south', 11.1671, 106.6504, true),
('DNA', 'Tỉnh Đồng Nai', 'Dong Nai', 1, 'south', 10.9453, 106.8243, true),
('BR', 'Tỉnh Bà Rịa - Vũng Tàu', 'Ba Ria - Vung Tau', 1, 'south', 10.5417, 107.2429, true),
('LA', 'Tỉnh Long An', 'Long An', 1, 'south', 10.5360, 106.4130, true),
('TG', 'Tỉnh Tiền Giang', 'Tien Giang', 1, 'south', 10.4493, 106.3420, true),
('BT', 'Tỉnh Bến Tre', 'Ben Tre', 1, 'south', 10.2434, 106.3756, true),
('TV', 'Tỉnh Trà Vinh', 'Tra Vinh', 1, 'south', 9.9347, 106.3456, true),
('VL', 'Tỉnh Vĩnh Long', 'Vinh Long', 1, 'south', 10.2397, 105.9572, true),
('DT', 'Tỉnh Đồng Tháp', 'Dong Thap', 1, 'south', 10.4933, 105.6882, true),
('AG', 'Tỉnh An Giang', 'An Giang', 1, 'south', 10.5216, 105.1259, true),
('KG', 'Tỉnh Kiên Giang', 'Kien Giang', 1, 'south', 10.0125, 105.0809, true),
('HGI', 'Tỉnh Hậu Giang', 'Hau Giang', 1, 'south', 9.7579, 105.6413, true),
('ST', 'Tỉnh Sóc Trăng', 'Soc Trang', 1, 'south', 9.6025, 105.9739, true),
('BL', 'Tỉnh Bạc Liêu', 'Bac Lieu', 1, 'south', 9.2941, 105.7217, true),
('CM', 'Tỉnh Cà Mau', 'Ca Mau', 1, 'south', 9.1527, 105.1961, true);

-- ============================================
-- CẤP 2: QUẬN/HUYỆN (Mẫu cho HN và HCM)
-- ============================================

-- Quận/Huyện Hà Nội
INSERT INTO admin_units (code, name, name_en, level, parent_code, region, is_active) VALUES
('HN-HK', 'Quận Hoàn Kiếm', 'Hoan Kiem District', 2, 'HN', 'north', true),
('HN-BD', 'Quận Ba Đình', 'Ba Dinh District', 2, 'HN', 'north', true),
('HN-DD', 'Quận Đống Đa', 'Dong Da District', 2, 'HN', 'north', true),
('HN-HBT', 'Quận Hai Bà Trưng', 'Hai Ba Trung District', 2, 'HN', 'north', true),
('HN-HM', 'Quận Hoàng Mai', 'Hoang Mai District', 2, 'HN', 'north', true),
('HN-TX', 'Quận Thanh Xuân', 'Thanh Xuan District', 2, 'HN', 'north', true),
('HN-LB', 'Quận Long Biên', 'Long Bien District', 2, 'HN', 'north', true),
('HN-CG', 'Quận Cầu Giấy', 'Cau Giay District', 2, 'HN', 'north', true),
('HN-TH', 'Quận Tây Hồ', 'Tay Ho District', 2, 'HN', 'north', true),
('HN-BTL', 'Quận Bắc Từ Liêm', 'Bac Tu Liem District', 2, 'HN', 'north', true),
('HN-NTL', 'Quận Nam Từ Liêm', 'Nam Tu Liem District', 2, 'HN', 'north', true),
('HN-HĐ', 'Quận Hà Đông', 'Ha Dong District', 2, 'HN', 'north', true),
('HN-ST', 'Huyện Sóc Sơn', 'Soc Son District', 2, 'HN', 'north', true),
('HN-ĐA', 'Huyện Đông Anh', 'Dong Anh District', 2, 'HN', 'north', true),
('HN-GL', 'Huyện Gia Lâm', 'Gia Lam District', 2, 'HN', 'north', true),
('HN-TT', 'Huyện Thanh Trì', 'Thanh Tri District', 2, 'HN', 'north', true),
('HN-ML', 'Huyện Mê Linh', 'Me Linh District', 2, 'HN', 'north', true),
('HN-HT', 'Huyện Hoài Đức', 'Hoai Duc District', 2, 'HN', 'north', true);

-- Quận/Huyện TP. Hồ Chí Minh
INSERT INTO admin_units (code, name, name_en, level, parent_code, region, is_active) VALUES
('HCM-Q1', 'Quận 1', 'District 1', 2, 'HCM', 'south', true),
('HCM-Q3', 'Quận 3', 'District 3', 2, 'HCM', 'south', true),
('HCM-Q4', 'Quận 4', 'District 4', 2, 'HCM', 'south', true),
('HCM-Q5', 'Quận 5', 'District 5', 2, 'HCM', 'south', true),
('HCM-Q6', 'Quận 6', 'District 6', 2, 'HCM', 'south', true),
('HCM-Q7', 'Quận 7', 'District 7', 2, 'HCM', 'south', true),
('HCM-Q8', 'Quận 8', 'District 8', 2, 'HCM', 'south', true),
('HCM-Q10', 'Quận 10', 'District 10', 2, 'HCM', 'south', true),
('HCM-Q11', 'Quận 11', 'District 11', 2, 'HCM', 'south', true),
('HCM-Q12', 'Quận 12', 'District 12', 2, 'HCM', 'south', true),
('HCM-TD', 'Thành phố Thủ Đức', 'Thu Duc City', 2, 'HCM', 'south', true),
('HCM-BTH', 'Quận Bình Thạnh', 'Binh Thanh District', 2, 'HCM', 'south', true),
('HCM-TB', 'Quận Tân Bình', 'Tan Binh District', 2, 'HCM', 'south', true),
('HCM-TP', 'Quận Tân Phú', 'Tan Phu District', 2, 'HCM', 'south', true),
('HCM-PN', 'Quận Phú Nhuận', 'Phu Nhuan District', 2, 'HCM', 'south', true),
('HCM-GV', 'Quận Gò Vấp', 'Go Vap District', 2, 'HCM', 'south', true),
('HCM-BC', 'Huyện Bình Chánh', 'Binh Chanh District', 2, 'HCM', 'south', true),
('HCM-HM', 'Huyện Hóc Môn', 'Hoc Mon District', 2, 'HCM', 'south', true),
('HCM-CC', 'Huyện Củ Chi', 'Cu Chi District', 2, 'HCM', 'south', true),
('HCM-CG', 'Huyện Cần Giờ', 'Can Gio District', 2, 'HCM', 'south', true),
('HCM-NB', 'Huyện Nhà Bè', 'Nha Be District', 2, 'HCM', 'south', true);

-- Quận/Huyện Đà Nẵng
INSERT INTO admin_units (code, name, name_en, level, parent_code, region, is_active) VALUES
('DN-HC', 'Quận Hải Châu', 'Hai Chau District', 2, 'DN', 'central', true),
('DN-TC', 'Quận Thanh Khê', 'Thanh Khe District', 2, 'DN', 'central', true),
('DN-ST', 'Quận Sơn Trà', 'Son Tra District', 2, 'DN', 'central', true),
('DN-NK', 'Quận Ngũ Hành Sơn', 'Ngu Hanh Son District', 2, 'DN', 'central', true),
('DN-LC', 'Quận Liên Chiểu', 'Lien Chieu District', 2, 'DN', 'central', true),
('DN-CM', 'Quận Cẩm Lệ', 'Cam Le District', 2, 'DN', 'central', true),
('DN-HV', 'Huyện Hòa Vang', 'Hoa Vang District', 2, 'DN', 'central', true),
('DN-HS', 'Huyện Hoàng Sa', 'Hoang Sa District', 2, 'DN', 'central', true);

-- ============================================
-- END OF DATA
-- ============================================
