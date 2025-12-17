-- ============================================
-- SÀN GIAO DỊCH BẤT ĐỘNG SẢN VIỆT NAM
-- DATABASE SCHEMA - PostgreSQL
-- Version: 1.0.0
-- ============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- PHẦN 1: ĐƠN VỊ HÀNH CHÍNH VIỆT NAM
-- ============================================

CREATE TABLE admin_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 4),
    parent_code VARCHAR(20) REFERENCES admin_units(code),
    region VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    polygon JSONB,
    population INTEGER,
    area_km2 DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admin_units_parent ON admin_units(parent_code);
CREATE INDEX idx_admin_units_level ON admin_units(level);

-- ============================================
-- PHẦN 2: NGƯỜI DÙNG & PHÂN QUYỀN
-- ============================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(15) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    full_name VARCHAR(100),
    avatar_url VARCHAR(500),
    id_card_number VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10),
    address TEXT,
    admin_unit_code VARCHAR(20) REFERENCES admin_units(code),
    status VARCHAR(20) DEFAULT 'active',
    phone_verified BOOLEAN DEFAULT false,
    email_verified BOOLEAN DEFAULT false,
    identity_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMPTZ,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '[]',
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    granted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, role_id)
);

CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(50),
    company_name VARCHAR(200),
    experience_years INTEGER DEFAULT 0,
    specializations JSONB DEFAULT '[]',
    service_areas JSONB DEFAULT '[]',
    commission_rate DECIMAL(5, 2) DEFAULT 2.00,
    total_listings INTEGER DEFAULT 0,
    total_deals INTEGER DEFAULT 0,
    rating_avg DECIMAL(3, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PHẦN 3: TIN ĐĂNG BẤT ĐỘNG SẢN
-- ============================================

CREATE TABLE property_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    icon VARCHAR(50),
    parent_id UUID REFERENCES property_types(id),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    agent_id UUID REFERENCES agents(id),
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('sell', 'rent')),
    property_type_id UUID NOT NULL REFERENCES property_types(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    highlights JSONB DEFAULT '[]',
    admin_unit_code VARCHAR(20) NOT NULL REFERENCES admin_units(code),
    address TEXT NOT NULL,
    street VARCHAR(200),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    area_land DECIMAL(10, 2),
    area_floor DECIMAL(10, 2),
    frontage DECIMAL(6, 2),
    floors INTEGER,
    bedrooms INTEGER,
    bathrooms INTEGER,
    direction VARCHAR(20),
    price BIGINT NOT NULL,
    price_unit VARCHAR(20) DEFAULT 'total',
    price_negotiable BOOLEAN DEFAULT false,
    legal_status VARCHAR(30),
    ownership_type VARCHAR(30),
    is_mortgaged BOOLEAN DEFAULT false,
    amenities JSONB DEFAULT '[]',
    furniture VARCHAR(30),
    status VARCHAR(20) DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT false,
    featured_until TIMESTAMPTZ,
    slug VARCHAR(300) UNIQUE,
    views INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    contacts INTEGER DEFAULT 0,
    quality_score DECIMAL(3, 2),
    expires_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_listings_user ON listings(user_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_type ON listings(transaction_type, property_type_id);
CREATE INDEX idx_listings_location ON listings(admin_unit_code);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_featured ON listings(is_featured, featured_until);

CREATE TABLE listing_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'video', '360', 'floor_plan')),
    url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PHẦN 4: LEAD & INBOX
-- ============================================

CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id),
    buyer_user_id UUID NOT NULL REFERENCES users(id),
    seller_user_id UUID NOT NULL REFERENCES users(id),
    agent_id UUID REFERENCES agents(id),
    contact_name VARCHAR(100),
    contact_phone VARCHAR(15),
    message TEXT,
    status VARCHAR(20) DEFAULT 'new',
    priority VARCHAR(10) DEFAULT 'normal',
    budget_min BIGINT,
    budget_max BIGINT,
    interest_level INTEGER,
    last_contacted_at TIMESTAMPTZ,
    next_follow_up_at TIMESTAMPTZ,
    source VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL,
    sender_id UUID NOT NULL REFERENCES users(id),
    receiver_id UUID NOT NULL REFERENCES users(id),
    listing_id UUID REFERENCES listings(id),
    lead_id UUID REFERENCES leads(id),
    content TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'text',
    attachments JSONB DEFAULT '[]',
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PHẦN 5: GIAO DỊCH (DEALS)
-- ============================================

CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    listing_id UUID NOT NULL REFERENCES listings(id),
    lead_id UUID REFERENCES leads(id),
    buyer_user_id UUID NOT NULL REFERENCES users(id),
    seller_user_id UUID NOT NULL REFERENCES users(id),
    agent_id UUID REFERENCES agents(id),
    stage VARCHAR(30) DEFAULT 'new',
    stage_history JSONB DEFAULT '[]',
    agreed_price BIGINT,
    deposit_amount BIGINT,
    services JSONB DEFAULT '{}',
    deposit_due_at TIMESTAMPTZ,
    signing_due_at TIMESTAMPTZ,
    closing_due_at TIMESTAMPTZ,
    handover_at TIMESTAMPTZ,
    completion_type VARCHAR(20),
    cancellation_reason TEXT,
    internal_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ
);

CREATE TABLE deal_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    event_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    data JSONB DEFAULT '{}',
    visibility VARCHAR(20) DEFAULT 'all',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE viewings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID NOT NULL REFERENCES deals(id),
    listing_id UUID NOT NULL REFERENCES listings(id),
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status VARCHAR(20) DEFAULT 'pending',
    location TEXT,
    buyer_notes TEXT,
    seller_notes TEXT,
    feedback_rating INTEGER,
    feedback_text TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE deposits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID NOT NULL REFERENCES deals(id),
    amount BIGINT NOT NULL,
    method VARCHAR(20),
    terms TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    due_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    payment_id UUID,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PHẦN 6: PHÁP LÝ & HỢP ĐỒNG
-- ============================================

CREATE TABLE contract_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    transaction_type VARCHAR(20),
    property_types JSONB DEFAULT '[]',
    content_html TEXT NOT NULL,
    content_markdown TEXT,
    variables JSONB DEFAULT '[]',
    version INTEGER DEFAULT 1,
    is_latest BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE legal_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID NOT NULL REFERENCES deals(id),
    template_id UUID REFERENCES contract_templates(id),
    type VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    filled_variables JSONB DEFAULT '{}',
    content_html TEXT,
    output_url VARCHAR(500),
    output_format VARCHAR(10),
    hash_sha256 VARCHAR(64),
    status VARCHAR(20) DEFAULT 'draft',
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE signature_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES legal_documents(id),
    status VARCHAR(20) DEFAULT 'pending',
    expires_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE signature_parties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES signature_requests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    role VARCHAR(30) NOT NULL,
    order_index INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    signed_at TIMESTAMPTZ,
    signature_method VARCHAR(20),
    signature_image_url VARCHAR(500),
    signature_meta JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PHẦN 7: THANH TOÁN
-- ============================================

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(30) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(30) NOT NULL,
    listing_id UUID REFERENCES listings(id),
    deal_id UUID REFERENCES deals(id),
    items JSONB NOT NULL DEFAULT '[]',
    subtotal BIGINT NOT NULL,
    discount_amount BIGINT DEFAULT 0,
    discount_code VARCHAR(50),
    tax_amount BIGINT DEFAULT 0,
    total_amount BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'VND',
    status VARCHAR(20) DEFAULT 'pending',
    due_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    gateway VARCHAR(30) NOT NULL,
    gateway_ref VARCHAR(100) UNIQUE,
    gateway_response JSONB DEFAULT '{}',
    amount BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'VND',
    status VARCHAR(20) DEFAULT 'pending',
    method VARCHAR(30),
    payer_name VARCHAR(100),
    payer_phone VARCHAR(15),
    idempotency_key VARCHAR(100) UNIQUE,
    return_url VARCHAR(500),
    callback_url VARCHAR(500),
    initiated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL REFERENCES payments(id),
    amount BIGINT NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    gateway_ref VARCHAR(100),
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PHẦN 8: HOA HỒNG MÔI GIỚI
-- ============================================

CREATE TABLE commission_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    scope JSONB DEFAULT '{}',
    platform_percent DECIMAL(6, 3) NOT NULL,
    agent_percent DECIMAL(6, 3) NOT NULL,
    referral_percent DECIMAL(6, 3) DEFAULT 0,
    min_amount BIGINT,
    max_amount BIGINT,
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID NOT NULL REFERENCES deals(id),
    rule_id UUID REFERENCES commission_rules(id),
    deal_value BIGINT NOT NULL,
    gross_amount BIGINT NOT NULL,
    platform_amount BIGINT NOT NULL,
    agent_amount BIGINT NOT NULL,
    referral_amount BIGINT DEFAULT 0,
    agent_user_id UUID REFERENCES users(id),
    referral_user_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    payment_reference VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PHẦN 9: AI & KNOWLEDGE BASE
-- ============================================

CREATE TABLE kb_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50) NOT NULL,
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(300) UNIQUE,
    content TEXT NOT NULL,
    summary TEXT,
    tags TEXT[] DEFAULT '{}',
    property_types TEXT[] DEFAULT '{}',
    transaction_types TEXT[] DEFAULT '{}',
    version INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kb_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES kb_articles(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    chunk_text TEXT NOT NULL,
    meta JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(100),
    listing_id UUID REFERENCES listings(id),
    deal_id UUID REFERENCES deals(id),
    intent VARCHAR(50),
    messages JSONB NOT NULL DEFAULT '[]',
    model_used VARCHAR(50),
    tokens_used INTEGER,
    feedback_rating INTEGER,
    feedback_text TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PHẦN 10: VẬN HÀNH & AUDIT
-- ============================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    entity_type VARCHAR(50),
    entity_id UUID,
    action_url VARCHAR(500),
    channels JSONB DEFAULT '["in_app"]',
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    request_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES users(id),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    reported_user_id UUID REFERENCES users(id),
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    evidence_urls JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'pending',
    resolution TEXT,
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    action_taken VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(100),
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB DEFAULT '{}',
    listing_id UUID REFERENCES listings(id),
    page_url VARCHAR(500),
    device_type VARCHAR(20),
    browser VARCHAR(50),
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE saved_searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(100),
    filters JSONB NOT NULL,
    alert_enabled BOOLEAN DEFAULT false,
    alert_frequency VARCHAR(20),
    last_alerted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    listing_id UUID NOT NULL REFERENCES listings(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, listing_id)
);

-- ============================================
-- PHẦN 11: GÓI DỊCH VỤ
-- ============================================

CREATE TABLE listing_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(30) NOT NULL,
    price BIGINT NOT NULL,
    original_price BIGINT,
    duration_days INTEGER NOT NULL,
    max_photos INTEGER DEFAULT 10,
    featured_days INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE promo_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    discount_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    max_discount BIGINT,
    min_order_value BIGINT,
    usage_limit INTEGER,
    usage_per_user INTEGER DEFAULT 1,
    current_usage INTEGER DEFAULT 0,
    starts_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PHẦN 12: DỮ LIỆU MẪU
-- ============================================

INSERT INTO roles (name, display_name, description, is_system) VALUES
('admin', 'Quản trị viên', 'Quản trị toàn bộ hệ thống', true),
('moderator', 'Kiểm duyệt viên', 'Duyệt tin đăng', true),
('seller', 'Người bán', 'Đăng tin bán/cho thuê', true),
('buyer', 'Người mua', 'Tìm mua/thuê BĐS', true),
('agent', 'Môi giới', 'Môi giới chuyên nghiệp', true),
('legal', 'Tư vấn pháp lý', 'Hỗ trợ pháp lý', true),
('finance', 'Tài chính', 'Quản lý thanh toán', true);

INSERT INTO property_types (code, name, name_en, icon, sort_order) VALUES
('apartment', 'Căn hộ chung cư', 'Apartment', 'building', 1),
('house', 'Nhà phố', 'House', 'home', 2),
('villa', 'Biệt thự', 'Villa', 'castle', 3),
('townhouse', 'Nhà liền kề', 'Townhouse', 'home', 4),
('land', 'Đất nền', 'Land', 'map-pin', 5),
('office', 'Văn phòng', 'Office', 'briefcase', 6),
('shophouse', 'Shophouse', 'Shophouse', 'store', 7),
('warehouse', 'Kho xưởng', 'Warehouse', 'warehouse', 8);

INSERT INTO listing_packages (code, name, type, price, duration_days, max_photos, featured_days, sort_order) VALUES
('basic', 'Gói Cơ bản', 'basic', 0, 30, 6, 0, 1),
('standard', 'Gói Tiêu chuẩn', 'featured', 100000, 30, 12, 7, 2),
('premium', 'Gói Cao cấp', 'premium', 300000, 45, 20, 15, 3),
('vip', 'Gói VIP', 'vip', 500000, 60, 30, 30, 4);

INSERT INTO admin_units (code, name, name_en, level, region, is_active) VALUES
('HN', 'Hà Nội', 'Hanoi', 1, 'north', true),
('HCM', 'TP. Hồ Chí Minh', 'Ho Chi Minh City', 1, 'south', true),
('DN', 'Đà Nẵng', 'Da Nang', 1, 'central', true),
('HP', 'Hải Phòng', 'Hai Phong', 1, 'north', true),
('CT', 'Cần Thơ', 'Can Tho', 1, 'south', true),
('BD', 'Bình Dương', 'Binh Duong', 1, 'south', true),
('DL', 'Đồng Nai', 'Dong Nai', 1, 'south', true);

INSERT INTO admin_units (code, name, name_en, level, parent_code, region, is_active) VALUES
('HCM-Q1', 'Quận 1', 'District 1', 2, 'HCM', 'south', true),
('HCM-Q3', 'Quận 3', 'District 3', 2, 'HCM', 'south', true),
('HCM-Q7', 'Quận 7', 'District 7', 2, 'HCM', 'south', true),
('HCM-TD', 'TP. Thủ Đức', 'Thu Duc City', 2, 'HCM', 'south', true),
('HCM-BTH', 'Bình Thạnh', 'Binh Thanh', 2, 'HCM', 'south', true),
('HN-HK', 'Hoàn Kiếm', 'Hoan Kiem', 2, 'HN', 'north', true),
('HN-BD', 'Ba Đình', 'Ba Dinh', 2, 'HN', 'north', true),
('HN-CG', 'Cầu Giấy', 'Cau Giay', 2, 'HN', 'north', true);

INSERT INTO commission_rules (name, scope, platform_percent, agent_percent, referral_percent, effective_from) VALUES
('Mặc định - Bán', '{"transaction_type": "sell"}', 1.000, 1.500, 0.500, '2024-01-01'),
('Mặc định - Thuê', '{"transaction_type": "rent"}', 50.000, 50.000, 0.000, '2024-01-01');

-- ============================================
-- END OF SCHEMA
-- ============================================
