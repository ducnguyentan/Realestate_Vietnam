-- =============================================
-- SEED DATA: 63 TỈNH/THÀNH PHỐ VIỆT NAM
-- Theo địa giới hành chính mới 2024
-- =============================================

-- Xóa dữ liệu cũ (nếu có)
DELETE FROM admin_units WHERE level = 1;

-- =============================================
-- MIỀN BẮC (25 tỉnh/thành)
-- =============================================

-- Thành phố trực thuộc Trung ương
INSERT INTO admin_units (code, name, name_en, level, region, latitude, longitude, is_active) VALUES
('HN', 'Thành phố Hà Nội', 'Hanoi', 1, 'north', 21.0285, 105.8542, true),
('HP', 'Thành phố Hải Phòng', 'Hai Phong', 1, 'north', 20.8449, 106.6881, true);

-- Đông Bắc Bộ
INSERT INTO admin_units (code, name, name_en, level, region, latitude, longitude, is_active) VALUES
('QN', 'Tỉnh Quảng Ninh', 'Quang Ninh', 1, 'north', 21.0064, 107.2925, true),
('BG', 'Tỉnh Bắc Giang', 'Bac Giang', 1, 'north', 21.2731, 106.1946, true),
('BK', 'Tỉnh Bắc Kạn', 'Bac Kan', 1, 'north', 22.1473, 105.8348, true),
('CB', 'Tỉnh Cao Bằng', 'Cao Bang', 1, 'north', 22.6666, 106.2640, true),
('HG', 'Tỉnh Hà Giang', 'Ha Giang', 1, 'north', 22.8233, 104.9837, true),
('LS', 'Tỉnh Lạng Sơn', 'Lang Son', 1, 'north', 21.8537, 106.7615, true),
('TQ', 'Tỉnh Tuyên Quang', 'Tuyen Quang', 1, 'north', 21.8237, 105.2140, true),
('TN', 'Tỉnh Thái Nguyên', 'Thai Nguyen', 1, 'north', 21.5928, 105.8442, true);

-- Tây Bắc Bộ
INSERT INTO admin_units (code, name, name_en, level, region, latitude, longitude, is_active) VALUES
('LC', 'Tỉnh Lào Cai', 'Lao Cai', 1, 'north', 22.4809, 103.9755, true),
('YB', 'Tỉnh Yên Bái', 'Yen Bai', 1, 'north', 21.7168, 104.8986, true),
('DB', 'Tỉnh Điện Biên', 'Dien Bien', 1, 'north', 21.3860, 103.0230, true),
('HB', 'Tỉnh Hòa Bình', 'Hoa Binh', 1, 'north', 20.8171, 105.3378, true),
('LA', 'Tỉnh Lai Châu', 'Lai Chau', 1, 'north', 22.3864, 103.4708, true),
('SL', 'Tỉnh Sơn La', 'Son La', 1, 'north', 21.3256, 103.9188, true),
('PT', 'Tỉnh Phú Thọ', 'Phu Tho', 1, 'north', 21.4225, 105.2297, true);

-- Đồng bằng sông Hồng
INSERT INTO admin_units (code, name, name_en, level, region, latitude, longitude, is_active) VALUES
('VP', 'Tỉnh Vĩnh Phúc', 'Vinh Phuc', 1, 'north', 21.3609, 105.5474, true),
('BN', 'Tỉnh Bắc Ninh', 'Bac Ninh', 1, 'north', 21.1861, 106.0763, true),
('HD', 'Tỉnh Hải Dương', 'Hai Duong', 1, 'north', 20.9385, 106.3206, true),
('HY', 'Tỉnh Hưng Yên', 'Hung Yen', 1, 'north', 20.6464, 106.0511, true),
('HNam', 'Tỉnh Hà Nam', 'Ha Nam', 1, 'north', 20.5835, 105.9230, true),
('NĐ', 'Tỉnh Nam Định', 'Nam Dinh', 1, 'north', 20.4388, 106.1621, true),
('NB', 'Tỉnh Ninh Bình', 'Ninh Binh', 1, 'north', 20.2539, 105.9750, true),
('TB', 'Tỉnh Thái Bình', 'Thai Binh', 1, 'north', 20.4463, 106.3365, true);

-- =============================================
-- MIỀN TRUNG (19 tỉnh/thành)
-- =============================================

-- Bắc Trung Bộ
INSERT INTO admin_units (code, name, name_en, level, region, latitude, longitude, is_active) VALUES
('TH', 'Tỉnh Thanh Hóa', 'Thanh Hoa', 1, 'central', 19.8066, 105.7852, true),
('NA', 'Tỉnh Nghệ An', 'Nghe An', 1, 'central', 19.2342, 104.9200, true),
('HT', 'Tỉnh Hà Tĩnh', 'Ha Tinh', 1, 'central', 18.3559, 105.8877, true),
('QB', 'Tỉnh Quảng Bình', 'Quang Binh', 1, 'central', 17.4690, 106.6220, true),
('QT', 'Tỉnh Quảng Trị', 'Quang Tri', 1, 'central', 16.7543, 107.1857, true),
('TTH', 'Tỉnh Thừa Thiên Huế', 'Thua Thien Hue', 1, 'central', 16.4637, 107.5909, true);

-- Thành phố trực thuộc Trung ương
INSERT INTO admin_units (code, name, name_en, level, region, latitude, longitude, is_active) VALUES
('DN', 'Thành phố Đà Nẵng', 'Da Nang', 1, 'central', 16.0544, 108.2022, true);

-- Nam Trung Bộ
INSERT INTO admin_units (code, name, name_en, level, region, latitude, longitude, is_active) VALUES
('QNam', 'Tỉnh Quảng Nam', 'Quang Nam', 1, 'central', 15.5393, 108.0191, true),
('QNgai', 'Tỉnh Quảng Ngãi', 'Quang Ngai', 1, 'central', 15.1214, 108.8044, true),
('BD', 'Tỉnh Bình Định', 'Binh Dinh', 1, 'central', 13.7830, 109.2197, true),
('PY', 'Tỉnh Phú Yên', 'Phu Yen', 1, 'central', 13.0882, 109.0929, true),
('KH', 'Tỉnh Khánh Hòa', 'Khanh Hoa', 1, 'central', 12.2585, 109.0526, true),
('NT', 'Tỉnh Ninh Thuận', 'Ninh Thuan', 1, 'central', 11.5752, 108.9829, true),
('BTh', 'Tỉnh Bình Thuận', 'Binh Thuan', 1, 'central', 10.9804, 108.2615, true);

-- Tây Nguyên
INSERT INTO admin_units (code, name, name_en, level, region, latitude, longitude, is_active) VALUES
('KT', 'Tỉnh Kon Tum', 'Kon Tum', 1, 'central', 14.3545, 108.0077, true),
('GL', 'Tỉnh Gia Lai', 'Gia Lai', 1, 'central', 13.9833, 108.0000, true),
('DL', 'Tỉnh Đắk Lắk', 'Dak Lak', 1, 'central', 12.7100, 108.2378, true),
('DNong', 'Tỉnh Đắk Nông', 'Dak Nong', 1, 'central', 12.0020, 107.6878, true),
('LDong', 'Tỉnh Lâm Đồng', 'Lam Dong', 1, 'central', 11.9465, 108.4419, true);

-- =============================================
-- MIỀN NAM (19 tỉnh/thành)
-- =============================================

-- Thành phố trực thuộc Trung ương
INSERT INTO admin_units (code, name, name_en, level, region, latitude, longitude, is_active) VALUES
('HCM', 'Thành phố Hồ Chí Minh', 'Ho Chi Minh City', 1, 'south', 10.8231, 106.6297, true),
('CT', 'Thành phố Cần Thơ', 'Can Tho', 1, 'south', 10.0452, 105.7469, true);

-- Đông Nam Bộ
INSERT INTO admin_units (code, name, name_en, level, region, latitude, longitude, is_active) VALUES
('BDuong', 'Tỉnh Bình Dương', 'Binh Duong', 1, 'south', 11.0753, 106.6519, true),
('DNai', 'Tỉnh Đồng Nai', 'Dong Nai', 1, 'south', 10.9452, 106.8243, true),
('BR_VT', 'Tỉnh Bà Rịa - Vũng Tàu', 'Ba Ria - Vung Tau', 1, 'south', 10.5417, 107.2429, true),
('BP', 'Tỉnh Bình Phước', 'Binh Phuoc', 1, 'south', 11.7512, 106.7235, true),
('TN', 'Tỉnh Tây Ninh', 'Tay Ninh', 1, 'south', 11.3351, 106.0988, true);

-- Đồng bằng sông Cửu Long
INSERT INTO admin_units (code, name, name_en, level, region, latitude, longitude, is_active) VALUES
('LA', 'Tỉnh Long An', 'Long An', 1, 'south', 10.5360, 106.4111, true),
('TG', 'Tỉnh Tiền Giang', 'Tien Giang', 1, 'south', 10.3598, 106.3631, true),
('BT', 'Tỉnh Bến Tre', 'Ben Tre', 1, 'south', 10.2433, 106.3758, true),
('TV', 'Tỉnh Trà Vinh', 'Tra Vinh', 1, 'south', 9.8127, 106.2993, true),
('VL', 'Tỉnh Vĩnh Long', 'Vinh Long', 1, 'south', 10.2396, 105.9722, true),
('DT', 'Tỉnh Đồng Tháp', 'Dong Thap', 1, 'south', 10.4938, 105.6882, true),
('AG', 'Tỉnh An Giang', 'An Giang', 1, 'south', 10.3899, 105.4356, true),
('KG', 'Tỉnh Kiên Giang', 'Kien Giang', 1, 'south', 10.0125, 105.0809, true),
('HG', 'Tỉnh Hậu Giang', 'Hau Giang', 1, 'south', 9.7579, 105.6413, true),
('ST', 'Tỉnh Sóc Trăng', 'Soc Trang', 1, 'south', 9.6025, 105.9800, true),
('BL', 'Tỉnh Bạc Liêu', 'Bac Lieu', 1, 'south', 9.2940, 105.7276, true),
('CM', 'Tỉnh Cà Mau', 'Ca Mau', 1, 'south', 9.1769, 105.1500, true);

-- =============================================
-- QUẬN/HUYỆN CHỦ YẾU CHO CÁC THÀNH PHỐ LỚN
-- =============================================

-- HÀ NỘI - QUẬN NỘI THÀNH
INSERT INTO admin_units (code, name, name_en, level, parent_code, region, latitude, longitude, is_active) VALUES
('HN-HK', 'Quận Hoàn Kiếm', 'Hoan Kiem District', 2, 'HN', 'north', 21.0285, 105.8542, true),
('HN-BD', 'Quận Ba Đình', 'Ba Dinh District', 2, 'HN', 'north', 21.0340, 105.8194, true),
('HN-DD', 'Quận Đống Đa', 'Dong Da District', 2, 'HN', 'north', 21.0167, 105.8283, true),
('HN-HBT', 'Quận Hai Bà Trưng', 'Hai Ba Trung District', 2, 'HN', 'north', 21.0116, 105.8567, true),
('HN-TX', 'Quận Thanh Xuân', 'Thanh Xuan District', 2, 'HN', 'north', 20.9917, 105.8117, true),
('HN-CG', 'Quận Cầu Giấy', 'Cau Giay District', 2, 'HN', 'north', 21.0328, 105.7847, true),
('HN-TH', 'Quận Tây Hồ', 'Tay Ho District', 2, 'HN', 'north', 21.0667, 105.8167, true),
('HN-LB', 'Quận Long Biên', 'Long Bien District', 2, 'HN', 'north', 21.0386, 105.8914, true),
('HN-HM', 'Quận Hoàng Mai', 'Hoang Mai District', 2, 'HN', 'north', 20.9800, 105.8633, true),
('HN-BTL', 'Quận Bắc Từ Liêm', 'Bac Tu Liem District', 2, 'HN', 'north', 21.0711, 105.7639, true),
('HN-NTL', 'Quận Nam Từ Liêm', 'Nam Tu Liem District', 2, 'HN', 'north', 21.0200, 105.7600, true),
('HN-HD', 'Quận Hà Đông', 'Ha Dong District', 2, 'HN', 'north', 20.9719, 105.7800, true);

-- TP. HỒ CHÍ MINH - QUẬN/THÀNH PHỐ TRỰC THUỘC
INSERT INTO admin_units (code, name, name_en, level, parent_code, region, latitude, longitude, is_active) VALUES
('HCM-Q1', 'Quận 1', 'District 1', 2, 'HCM', 'south', 10.7769, 106.7009, true),
('HCM-Q3', 'Quận 3', 'District 3', 2, 'HCM', 'south', 10.7846, 106.6864, true),
('HCM-Q4', 'Quận 4', 'District 4', 2, 'HCM', 'south', 10.7585, 106.7059, true),
('HCM-Q5', 'Quận 5', 'District 5', 2, 'HCM', 'south', 10.7540, 106.6633, true),
('HCM-Q6', 'Quận 6', 'District 6', 2, 'HCM', 'south', 10.7460, 106.6357, true),
('HCM-Q7', 'Quận 7', 'District 7', 2, 'HCM', 'south', 10.7340, 106.7220, true),
('HCM-Q8', 'Quận 8', 'District 8', 2, 'HCM', 'south', 10.7240, 106.6280, true),
('HCM-Q10', 'Quận 10', 'District 10', 2, 'HCM', 'south', 10.7725, 106.6670, true),
('HCM-Q11', 'Quận 11', 'District 11', 2, 'HCM', 'south', 10.7628, 106.6504, true),
('HCM-Q12', 'Quận 12', 'District 12', 2, 'HCM', 'south', 10.8671, 106.6413, true),
('HCM-TD', 'Thành phố Thủ Đức', 'Thu Duc City', 2, 'HCM', 'south', 10.8514, 106.7539, true),
('HCM-BTh', 'Quận Bình Thạnh', 'Binh Thanh District', 2, 'HCM', 'south', 10.8105, 106.7091, true),
('HCM-PN', 'Quận Phú Nhuận', 'Phu Nhuan District', 2, 'HCM', 'south', 10.7995, 106.6791, true),
('HCM-GV', 'Quận Gò Vấp', 'Go Vap District', 2, 'HCM', 'south', 10.8388, 106.6519, true),
('HCM-TB', 'Quận Tân Bình', 'Tan Binh District', 2, 'HCM', 'south', 10.8017, 106.6528, true),
('HCM-TP', 'Quận Tân Phú', 'Tan Phu District', 2, 'HCM', 'south', 10.7905, 106.6281, true),
('HCM-BTan', 'Quận Bình Tân', 'Binh Tan District', 2, 'HCM', 'south', 10.7653, 106.6037, true),
('HCM-BC', 'Huyện Bình Chánh', 'Binh Chanh District', 2, 'HCM', 'south', 10.6873, 106.5942, true),
('HCM-CG', 'Huyện Củ Chi', 'Cu Chi District', 2, 'HCM', 'south', 10.9738, 106.4932, true),
('HCM-HM', 'Huyện Hóc Môn', 'Hoc Mon District', 2, 'HCM', 'south', 10.8853, 106.5914, true),
('HCM-NB', 'Huyện Nhà Bè', 'Nha Be District', 2, 'HCM', 'south', 10.6897, 106.7373, true),
('HCM-CG2', 'Huyện Cần Giờ', 'Can Gio District', 2, 'HCM', 'south', 10.4113, 106.9532, true);

-- ĐÀ NẴNG - QUẬN/HUYỆN
INSERT INTO admin_units (code, name, name_en, level, parent_code, region, latitude, longitude, is_active) VALUES
('DN-HC', 'Quận Hải Châu', 'Hai Chau District', 2, 'DN', 'central', 16.0678, 108.2208, true),
('DN-TK', 'Quận Thanh Khê', 'Thanh Khe District', 2, 'DN', 'central', 16.0667, 108.1917, true),
('DN-ST', 'Quận Sơn Trà', 'Son Tra District', 2, 'DN', 'central', 16.1117, 108.2442, true),
('DN-NHSon', 'Quận Ngũ Hành Sơn', 'Ngu Hanh Son District', 2, 'DN', 'central', 16.0333, 108.2500, true),
('DN-LC', 'Quận Liên Chiểu', 'Lien Chieu District', 2, 'DN', 'central', 16.0833, 108.1417, true),
('DN-CM', 'Quận Cẩm Lệ', 'Cam Le District', 2, 'DN', 'central', 16.0194, 108.2056, true),
('DN-HV', 'Huyện Hòa Vang', 'Hoa Vang District', 2, 'DN', 'central', 15.9833, 108.0667, true),
('DN-HS', 'Huyện Hoàng Sa', 'Hoang Sa District', 2, 'DN', 'central', 16.5333, 111.6333, true);

-- CẦN THƠ - QUẬN/HUYỆN  
INSERT INTO admin_units (code, name, name_en, level, parent_code, region, latitude, longitude, is_active) VALUES
('CT-NK', 'Quận Ninh Kiều', 'Ninh Kieu District', 2, 'CT', 'south', 10.0359, 105.7676, true),
('CT-BT', 'Quận Bình Thủy', 'Binh Thuy District', 2, 'CT', 'south', 10.0667, 105.7333, true),
('CT-CT', 'Quận Cái Răng', 'Cai Rang District', 2, 'CT', 'south', 10.0167, 105.7833, true),
('CT-OD', 'Quận Ô Môn', 'O Mon District', 2, 'CT', 'south', 10.1167, 105.6333, true),
('CT-TN', 'Quận Thốt Nốt', 'Thot Not District', 2, 'CT', 'south', 10.2333, 105.5500, true),
('CT-VT', 'Huyện Vĩnh Thạnh', 'Vinh Thanh District', 2, 'CT', 'south', 10.2167, 105.4333, true),
('CT-CL', 'Huyện Cờ Đỏ', 'Co Do District', 2, 'CT', 'south', 10.0833, 105.5167, true),
('CT-PD', 'Huyện Phong Điền', 'Phong Dien District', 2, 'CT', 'south', 10.0667, 105.6167, true),
('CT-TL', 'Huyện Thới Lai', 'Thoi Lai District', 2, 'CT', 'south', 9.9833, 105.5667, true);

-- =============================================
-- VERIFICATION
-- =============================================
-- Kiểm tra số lượng tỉnh/thành
-- SELECT COUNT(*) FROM admin_units WHERE level = 1; -- Should be 63

-- Kiểm tra theo vùng
-- SELECT region, COUNT(*) FROM admin_units WHERE level = 1 GROUP BY region;
-- north: 25, central: 19, south: 19
