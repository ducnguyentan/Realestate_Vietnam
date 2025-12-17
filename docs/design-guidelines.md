# Design Guidelines
## Vietnamese Real Estate Exchange Platform

**Version:** 1.0
**Last Updated:** 2025-12-16
**Project:** Sàn Giao Dịch Bất Động Sản Việt Nam

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Typography System](#typography-system)
3. [Color Palette](#color-palette)
4. [Spacing & Grid System](#spacing--grid-system)
5. [Component Library](#component-library)
6. [Vietnamese-Specific Considerations](#vietnamese-specific-considerations)
7. [Mobile-First Responsive Approach](#mobile-first-responsive-approach)
8. [Accessibility Requirements](#accessibility-requirements)
9. [Design Tokens (CSS Variables)](#design-tokens-css-variables)

---

## Design Philosophy

**Core Principles:**
- **Trust First:** Every design decision reinforces credibility and security
- **Mobile-First:** 67% of Vietnamese users access via mobile
- **Vietnamese-Centric:** Optimized for Vietnamese language, culture, and payment methods
- **Performance:** Fast loading, smooth interactions, optimized for 3G/4G networks
- **Clarity:** Clear information hierarchy, easy navigation, intuitive actions

**Target Audience:**
- Primary: Vietnamese home buyers/sellers (25-45 years old)
- Secondary: Real estate agents, property developers
- Device Split: 67% mobile, 33% desktop/tablet
- Network: Optimize for 3G/4G connections

---

## Typography System

### Font Stack

**Primary Heading Font:**
```css
font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Body Text Font:**
```css
font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Google Fonts Import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
```

### Type Scale

| Element | Font | Size | Weight | Line Height | Use Case |
|---------|------|------|--------|-------------|----------|
| **H1** | Be Vietnam Pro | 32px (mobile) / 48px (desktop) | 700 | 1.2 | Page titles |
| **H2** | Be Vietnam Pro | 28px (mobile) / 36px (desktop) | 700 | 1.3 | Section headers |
| **H3** | Be Vietnam Pro | 24px (mobile) / 28px (desktop) | 600 | 1.3 | Subsection titles |
| **H4** | Be Vietnam Pro | 20px | 600 | 1.4 | Card titles |
| **Body Large** | Roboto | 18px | 400 | 1.7 | Lead paragraphs |
| **Body Regular** | Roboto | 16px | 400 | 1.7 | Standard text |
| **Body Small** | Roboto | 14px | 400 | 1.6 | Secondary info |
| **Caption** | Roboto | 12px | 400 | 1.5 | Metadata, labels |
| **Button** | Roboto | 16px | 500 | 1.0 | CTA buttons |

### Vietnamese-Specific Typography Rules

1. **Line Height:** Minimum 1.6 for body text (1.7 recommended) to prevent diacritic collision
2. **Letter Spacing:** Default (0) - do not reduce for Vietnamese text
3. **Word Breaking:** Allow natural Vietnamese word breaks
4. **Diacritics Testing:** Test all headings with: Ầ, Ế, Ỳ, Ơ, Ư, Ă, Â, Ê, Ô
5. **Font Size Minimum:** 16px body, 24px headings for mobile readability

---

## Color Palette

### Primary Colors

| Color Name | Hex Code | RGB | Usage | Psychology |
|------------|----------|-----|-------|------------|
| **Navy Blue** | `#0D47A1` | rgb(13, 71, 161) | Primary brand, headers, navigation | Trust, stability, professionalism |
| **Light Blue** | `#42A5F5` | rgb(66, 165, 245) | Secondary accents, links, hover states | Calm, approachable, modern |

### Semantic Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Forest Green** | `#28A745` | rgb(40, 167, 69) | Success states, available properties, verification badges |
| **Mint Green** | `#81C784` | rgb(129, 199, 132) | Soft success indicators, positive feedback |
| **Crimson Red** | `#E53935` | rgb(229, 57, 53) | Primary CTA, urgent actions, "Contact Now" |
| **Coral** | `#FF6F61` | rgb(255, 111, 97) | Secondary CTA, discount badges, limited offers |
| **Gold** | `#C5A880` | rgb(197, 168, 128) | Premium/luxury property accents |

### Neutral Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Cream** | `#F5F5F5` | rgb(245, 245, 245) | Background, card surfaces |
| **Light Gray** | `#E0E0E0` | rgb(224, 224, 224) | Borders, dividers |
| **Medium Gray** | `#9E9E9E` | rgb(158, 158, 158) | Secondary text, placeholders |
| **Charcoal** | `#2C3E50` | rgb(44, 62, 80) | Primary text, dark UI elements |
| **White** | `#FFFFFF` | rgb(255, 255, 255) | Card backgrounds, input fields |

### Color Usage Guidelines

**60-30-10 Rule:**
- 60% Navy Blue (primary brand, headers, navigation)
- 30% Neutral tones (backgrounds, text)
- 10% Accent colors (CTA, success/error states)

**Contrast Requirements:**
- Body text on background: 4.5:1 minimum (WCAG AA)
- Large text (24px+) on background: 3:1 minimum
- Interactive elements: 3:1 minimum against adjacent colors

---

## Spacing & Grid System

### Base Unit System

**Base Unit:** 8px

| Token | Value | Use Case |
|-------|-------|----------|
| `xs` | 4px | Icon margins, micro spacing |
| `sm` | 8px | Tight spacing, button padding |
| `md` | 16px | Component padding, card spacing |
| `lg` | 24px | Section spacing |
| `xl` | 32px | Large section spacing |
| `2xl` | 48px | Page section dividers |
| `3xl` | 64px | Hero sections |

### Responsive Breakpoints

| Breakpoint | Width | Target Device |
|------------|-------|---------------|
| **Mobile** | 375px - 767px | iPhone SE, standard phones |
| **Tablet** | 768px - 1023px | iPad, tablets |
| **Desktop** | 1024px - 1439px | Laptops, small desktops |
| **Wide** | 1440px+ | Large desktops, 4K |

### Grid Layout

**Mobile (375px):**
- 1 column layout
- 16px side margins
- Full-width cards

**Tablet (768px):**
- 2 column grid for property cards
- 24px side margins
- 16px gap between columns

**Desktop (1024px+):**
- 3-4 column grid for property cards
- 32px side margins (max-width: 1440px)
- 24px gap between columns

---

## Component Library

### 1. Buttons

#### Primary Button
```css
/* Crimson Red CTA */
background: #E53935;
color: #FFFFFF;
padding: 12px 24px;
border-radius: 8px;
font-size: 16px;
font-weight: 500;
min-height: 48px; /* Touch-friendly */
transition: all 0.2s ease;

/* Hover */
background: #C62828;
box-shadow: 0 4px 12px rgba(229, 57, 53, 0.3);

/* Active */
background: #B71C1C;
```

**Usage:** "Liên hệ ngay" (Contact Now), "Gửi tin nhắn" (Send Message)

#### Secondary Button
```css
/* Light Blue Outlined */
background: transparent;
color: #42A5F5;
border: 2px solid #42A5F5;
padding: 12px 24px;
border-radius: 8px;
min-height: 48px;

/* Hover */
background: #42A5F5;
color: #FFFFFF;
```

**Usage:** "Lưu tin" (Save), "Chia sẻ" (Share)

#### Ghost Button
```css
/* Navy Text Only */
background: transparent;
color: #0D47A1;
padding: 12px 16px;
border: none;
text-decoration: underline;
text-underline-offset: 4px;

/* Hover */
color: #42A5F5;
```

**Usage:** "Xem chi tiết" (View Details), tertiary actions

### 2. Property Card Component

**Card Structure:**
```
┌─────────────────────────┐
│  Image (16:9)           │ ← Lazy-loaded, 16:9 aspect ratio
│  [Favorite ♡]           │ ← Top-right corner
│  [Price Badge]          │ ← Top-left corner
├─────────────────────────┤
│  Property Type Tag      │ ← Small badge
│  Title (2 lines max)    │ ← Truncated with ellipsis
│  📍 Location            │ ← Icon + District, City
│  🛏️ 3  🛁 2  📐 120m²   │ ← Key stats inline
│  Brief description...   │ ← 1 line truncated
│  ─────────────────────  │
│  [Agent CTA Button]     │ ← Secondary button
└─────────────────────────┘
```

**CSS Specifications:**
```css
.property-card {
  background: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.property-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.property-card-image {
  aspect-ratio: 16 / 9;
  object-fit: cover;
  width: 100%;
  transition: transform 0.3s ease;
}

.property-card:hover .property-card-image {
  transform: scale(1.05);
}

.price-badge {
  background: #E53935;
  color: #FFFFFF;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 18px;
  position: absolute;
  top: 12px;
  left: 12px;
}

.favorite-btn {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.favorite-btn:hover {
  background: #FFFFFF;
  transform: scale(1.1);
}
```

### 3. Form Inputs

**Text Input:**
```css
input[type="text"],
input[type="tel"],
input[type="email"],
textarea {
  width: 100%;
  padding: 12px 16px;
  min-height: 48px; /* Touch-friendly */
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  font-family: 'Roboto', sans-serif;
  font-size: 16px; /* Prevents zoom on iOS */
  line-height: 1.5;
  transition: border-color 0.2s ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #42A5F5;
  box-shadow: 0 0 0 3px rgba(66, 165, 245, 0.1);
}

/* Vietnamese phone number input */
input[type="tel"] {
  font-family: 'Courier New', monospace;
  letter-spacing: 0.05em;
}
```

**Labels:**
```css
label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #2C3E50;
  margin-bottom: 8px;
}

.required::after {
  content: " *";
  color: #E53935;
}
```

### 4. Navigation Components

**Mobile Bottom Navigation (Primary):**
```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px;
  min-width: 48px; /* Touch target */
  color: #9E9E9E;
  text-decoration: none;
  font-size: 12px;
  transition: color 0.2s ease;
}

.nav-item.active {
  color: #0D47A1;
}

.nav-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
}
```

**Desktop Header:**
```css
.header {
  background: #0D47A1;
  color: #FFFFFF;
  padding: 16px 32px;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-nav {
  display: flex;
  gap: 32px;
  align-items: center;
}

.header-nav a {
  color: #FFFFFF;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 0;
  border-bottom: 2px solid transparent;
  transition: border-color 0.2s ease;
}

.header-nav a:hover,
.header-nav a.active {
  border-bottom-color: #42A5F5;
}
```

### 5. Verification & Trust Badges

**Verified Badge:**
```css
.verified-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #28A745;
  color: #FFFFFF;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.verified-badge::before {
  content: "✓";
  font-weight: 700;
}
```

**Security Badge (Checkout):**
```css
.security-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #F5F5F5;
  border-radius: 8px;
  margin: 16px 0;
}

.security-icon {
  width: 24px;
  height: 24px;
  color: #28A745;
}
```

### 6. Filter UI Components

**Filter Sidebar (Desktop):**
```css
.filter-sidebar {
  width: 280px;
  background: #FFFFFF;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.filter-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #E0E0E0;
}

.filter-section:last-child {
  border-bottom: none;
}

.filter-title {
  font-size: 16px;
  font-weight: 600;
  color: #2C3E50;
  margin-bottom: 12px;
}
```

**Filter Drawer (Mobile):**
```css
.filter-drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  max-height: 80vh;
  border-radius: 16px 16px 0 0;
  padding: 24px 16px;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.2);
  transform: translateY(100%);
  transition: transform 0.3s ease;
  z-index: 2000;
}

.filter-drawer.open {
  transform: translateY(0);
}

.filter-drawer-handle {
  width: 40px;
  height: 4px;
  background: #E0E0E0;
  border-radius: 2px;
  margin: 0 auto 16px;
}
```

---

## Vietnamese-Specific Considerations

### 1. Language Rendering

**Diacritics Support:**
- Test all fonts with: Ầ, Ế, Ỳ, Ơ, Ư, Ă, Â, Ê, Ô + tone marks (`, ´, ̉, ̃, ̣)
- Line-height minimum: 1.6 (body), 1.3 (headings)
- Never use font-size < 14px with Vietnamese text
- Enable locale-specific forms: `font-feature-settings: 'locl';`

**Text Truncation:**
```css
.truncate-vietnamese {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 85%; /* Account for wider Vietnamese characters */
}

.truncate-multiline {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.7; /* Critical for Vietnamese */
}
```

### 2. Phone Number Formatting

**Standard Format:** +84 XXX XXX XXXX

```css
/* Phone input styling */
input[type="tel"] {
  font-family: 'Courier New', monospace;
  letter-spacing: 0.05em;
  direction: ltr;
}
```

**Validation Pattern:**
```javascript
// Accept: +84 followed by 9-10 digits
const vietnamPhoneRegex = /^\+84\s?\d{3}\s?\d{3}\s?\d{3,4}$/;
```

### 3. Payment Method Display

**Required Payment Options (Priority Order):**
1. MoMo (25M+ users)
2. ZaloPay (25M+ users, integrated with Zalo)
3. VietQR (bank wallet compatibility)
4. VNPAY (direct bank integration)

**UI Pattern:**
```html
<div class="payment-methods">
  <button class="payment-option">
    <img src="momo-logo.svg" alt="MoMo" width="40" height="40">
    <span>MoMo</span>
  </button>
  <button class="payment-option">
    <img src="zalopay-logo.svg" alt="ZaloPay" width="40" height="40">
    <span>ZaloPay</span>
  </button>
  <button class="payment-option">
    <img src="qr-icon.svg" alt="QR Code" width="40" height="40">
    <span>QR Code</span>
  </button>
  <button class="payment-option">
    <img src="vnpay-logo.svg" alt="VNPAY" width="40" height="40">
    <span>VNPAY</span>
  </button>
</div>
```

```css
.payment-methods {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 24px 0;
}

.payment-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  background: #FFFFFF;
  min-height: 100px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.payment-option:hover {
  border-color: #42A5F5;
  background: #F0F8FF;
}

.payment-option.selected {
  border-color: #0D47A1;
  background: #E3F2FD;
}
```

### 4. Trust Elements

**Essential Trust Signals (Real Estate Context):**

1. **Agent Verification Badge**
   - Display prominently on property cards and detail pages
   - Include "✓ Xác minh" (Verified) label

2. **Business Credentials**
   - Business license number (Giấy phép kinh doanh)
   - Real estate agency certification
   - Office address (District, City)

3. **Response Time Guarantee**
   - "Phản hồi trong 2 giờ" (Response within 2 hours)
   - Display on agent cards

4. **Ratings & Reviews**
   - 5-star rating system
   - Review count (minimum 10 reviews for credibility)
   - Target: 4.5+ stars

**Trust Section Component:**
```css
.trust-section {
  background: #F5F5F5;
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #2C3E50;
}

.trust-item:last-child {
  margin-bottom: 0;
}

.trust-icon {
  width: 20px;
  height: 20px;
  color: #28A745;
}
```

---

## Mobile-First Responsive Approach

### Strategy

1. **Design for 375px first** (iPhone SE baseline)
2. **Touch targets minimum 48x48px** (iOS/Android standard)
3. **Thumb-friendly zones:** Place primary CTAs in lower 2/3 of screen
4. **Progressive enhancement:** Add features for larger screens

### Mobile Optimizations

**Touch Target Sizing:**
```css
/* Minimum touch targets */
button, a.clickable, input, select {
  min-width: 48px;
  min-height: 48px;
}

/* Larger for critical actions */
.primary-cta {
  min-height: 56px;
  padding: 16px 32px;
}
```

**Viewport Meta Tag:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

**Mobile-Specific CSS:**
```css
/* Prevent text zoom on iOS */
input, textarea, select {
  font-size: 16px; /* Minimum to prevent auto-zoom */
}

/* Safe area insets for notch devices */
.bottom-nav {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Disable hover effects on touch devices */
@media (hover: none) and (pointer: coarse) {
  .property-card:hover {
    transform: none;
  }
}
```

### Responsive Images

**Property Image Optimization:**
```html
<img
  src="property-small.jpg"
  srcset="property-small.jpg 375w,
          property-medium.jpg 768w,
          property-large.jpg 1440w"
  sizes="(max-width: 767px) 100vw,
         (max-width: 1023px) 50vw,
         33vw"
  alt="Property description"
  loading="lazy"
  decoding="async"
>
```

**Aspect Ratio Containers:**
```css
.property-image-container {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #E0E0E0; /* Placeholder color */
}

.property-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### Breakpoint-Specific Layouts

**Mobile (375px - 767px):**
- Single column layout
- Bottom navigation (sticky)
- Full-width property cards
- Drawer-based filters
- Stacked form fields

**Tablet (768px - 1023px):**
- 2-column property grid
- Sidebar filters (toggleable)
- Horizontal form layouts
- Desktop-style header

**Desktop (1024px+):**
- 3-4 column property grid
- Persistent sidebar filters
- Advanced hover states
- Multi-column forms

---

## Accessibility Requirements

### WCAG 2.1 Level AA Compliance

**1. Color Contrast**
- Body text (#2C3E50) on white (#FFFFFF): 12.6:1 ✓
- Primary button (#E53935) white text: 4.9:1 ✓
- Light Blue (#42A5F5) on white: 3.1:1 (large text only)

**2. Keyboard Navigation**
```css
/* Focus visible styles */
*:focus-visible {
  outline: 3px solid #42A5F5;
  outline-offset: 2px;
}

/* Skip to main content link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #0D47A1;
  color: #FFFFFF;
  padding: 8px 16px;
  text-decoration: none;
  z-index: 10000;
}

.skip-link:focus {
  top: 0;
}
```

**3. Semantic HTML**
```html
<nav aria-label="Main navigation">
<main>
<article>
<section aria-labelledby="property-details">
<h2 id="property-details">Chi tiết căn hộ</h2>
```

**4. Alt Text for Images**
```html
<!-- Property images -->
<img src="property.jpg" alt="Căn hộ 2 phòng ngủ, 120m², Quận 1, TP. Hồ Chí Minh">

<!-- Decorative images -->
<img src="pattern.svg" alt="" role="presentation">

<!-- Icons with context -->
<button aria-label="Lưu tin đăng">
  <svg aria-hidden="true">...</svg>
</button>
```

**5. Form Accessibility**
```html
<label for="phone-input">Số điện thoại <span class="required">*</span></label>
<input
  type="tel"
  id="phone-input"
  name="phone"
  required
  aria-required="true"
  aria-describedby="phone-hint"
  autocomplete="tel"
>
<span id="phone-hint" class="hint-text">Định dạng: +84 XXX XXX XXXX</span>
```

**6. ARIA Labels for Vietnamese Screen Readers**
```html
<button aria-label="Liên hệ người bán">
  <span aria-hidden="true">📞</span> Liên hệ
</button>

<div role="alert" aria-live="polite">
  Tìm thấy 156 kết quả
</div>
```

**7. Responsive Text Resizing**
```css
/* Support up to 200% text zoom */
html {
  font-size: 100%; /* 16px base */
}

body {
  font-size: 1rem; /* Relative units */
  line-height: 1.7;
}

/* Prevent text overflow */
* {
  max-width: 100%;
  overflow-wrap: break-word;
}
```

---

## Design Tokens (CSS Variables)

### Complete Token System

```css
:root {
  /* ========== COLORS ========== */

  /* Primary */
  --color-primary: #0D47A1;
  --color-primary-light: #42A5F5;
  --color-primary-dark: #01579B;

  /* Semantic */
  --color-success: #28A745;
  --color-success-light: #81C784;
  --color-danger: #E53935;
  --color-warning: #FF6F61;
  --color-gold: #C5A880;

  /* Neutral */
  --color-white: #FFFFFF;
  --color-cream: #F5F5F5;
  --color-gray-light: #E0E0E0;
  --color-gray-medium: #9E9E9E;
  --color-gray-dark: #2C3E50;
  --color-black: #000000;

  /* ========== TYPOGRAPHY ========== */

  /* Font Families */
  --font-heading: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-body: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'Courier New', monospace;

  /* Font Sizes */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 28px;
  --font-size-4xl: 32px;
  --font-size-5xl: 36px;
  --font-size-6xl: 48px;

  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Line Heights */
  --line-height-tight: 1.2;
  --line-height-snug: 1.3;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.6;
  --line-height-loose: 1.7;

  /* ========== SPACING ========== */

  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;

  /* ========== BORDERS ========== */

  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-xl: 16px;
  --border-radius-full: 9999px;

  --border-width-thin: 1px;
  --border-width-medium: 2px;
  --border-width-thick: 3px;

  /* ========== SHADOWS ========== */

  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 8px 24px rgba(0, 0, 0, 0.12);
  --shadow-2xl: 0 16px 48px rgba(0, 0, 0, 0.15);

  /* ========== TRANSITIONS ========== */

  --transition-fast: 0.15s ease;
  --transition-base: 0.2s ease;
  --transition-slow: 0.3s ease;

  /* ========== Z-INDEX ========== */

  --z-dropdown: 1000;
  --z-sticky: 1100;
  --z-fixed: 1200;
  --z-modal-backdrop: 1300;
  --z-modal: 1400;
  --z-popover: 1500;
  --z-tooltip: 1600;

  /* ========== BREAKPOINTS ========== */

  --breakpoint-mobile: 375px;
  --breakpoint-tablet: 768px;
  --breakpoint-desktop: 1024px;
  --breakpoint-wide: 1440px;

  /* ========== COMPONENT-SPECIFIC ========== */

  /* Buttons */
  --button-height-sm: 36px;
  --button-height-md: 48px;
  --button-height-lg: 56px;

  /* Input */
  --input-height: 48px;
  --input-border-color: var(--color-gray-light);
  --input-focus-border-color: var(--color-primary-light);

  /* Cards */
  --card-padding: var(--space-md);
  --card-border-radius: var(--border-radius-lg);
  --card-shadow: var(--shadow-md);

  /* Property Images */
  --property-image-aspect-ratio: 16 / 9;
}

/* ========== RESPONSIVE FONT SIZES ========== */

@media (max-width: 767px) {
  :root {
    --font-size-4xl: 28px;
    --font-size-5xl: 32px;
    --font-size-6xl: 36px;
  }
}

/* ========== DARK MODE (Future) ========== */

@media (prefers-color-scheme: dark) {
  :root {
    /* Reserved for future dark mode implementation */
    /* --color-background: #1A1A1A; */
    /* --color-text: #FFFFFF; */
  }
}
```

---

## Usage Examples

### Example 1: Property Card with Tokens

```html
<div class="property-card">
  <div class="property-image-container">
    <img src="property.jpg" alt="Property description" loading="lazy">
    <div class="price-badge">5.2 tỷ</div>
    <button class="favorite-btn" aria-label="Lưu tin đăng">
      <svg>...</svg>
    </button>
  </div>
  <div class="property-content">
    <span class="property-type">Căn hộ</span>
    <h3 class="property-title">Căn hộ cao cấp view sông Sài Gòn</h3>
    <p class="property-location">📍 Quận 1, TP. Hồ Chí Minh</p>
    <div class="property-stats">
      <span>🛏️ 3</span>
      <span>🛁 2</span>
      <span>📐 120m²</span>
    </div>
    <p class="property-description">Vị trí đắc địa, nội thất cao cấp...</p>
    <button class="btn-secondary">Liên hệ</button>
  </div>
</div>
```

```css
.property-card {
  background: var(--color-white);
  border-radius: var(--card-border-radius);
  box-shadow: var(--card-shadow);
  overflow: hidden;
  transition: var(--transition-slow);
}

.property-content {
  padding: var(--card-padding);
}

.property-title {
  font-family: var(--font-heading);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-snug);
  color: var(--color-gray-dark);
  margin: var(--space-sm) 0;
}

.property-location {
  font-size: var(--font-size-sm);
  color: var(--color-gray-medium);
  margin-bottom: var(--space-sm);
}

.btn-secondary {
  width: 100%;
  height: var(--button-height-md);
  background: transparent;
  color: var(--color-primary-light);
  border: var(--border-width-medium) solid var(--color-primary-light);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-base);
}
```

### Example 2: Responsive Container

```css
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-md);
}

@media (min-width: 768px) {
  .container {
    padding: 0 var(--space-lg);
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: var(--breakpoint-wide);
    padding: 0 var(--space-xl);
  }
}
```

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Import Google Fonts (Be Vietnam Pro + Roboto)
- [ ] Implement CSS design tokens
- [ ] Set up responsive breakpoints
- [ ] Configure viewport meta tag
- [ ] Test Vietnamese diacritics rendering

### Phase 2: Components
- [ ] Build button system (primary, secondary, ghost)
- [ ] Create property card component
- [ ] Implement form input styles
- [ ] Build navigation (mobile bottom nav + desktop header)
- [ ] Create filter UI (sidebar + drawer)

### Phase 3: Accessibility
- [ ] Add focus visible styles
- [ ] Implement skip links
- [ ] Add ARIA labels for Vietnamese
- [ ] Test keyboard navigation
- [ ] Verify color contrast ratios

### Phase 4: Mobile Optimization
- [ ] Ensure 48px minimum touch targets
- [ ] Prevent iOS auto-zoom (16px font minimum)
- [ ] Add safe area insets for notch devices
- [ ] Test on 375px, 768px, 1024px viewports
- [ ] Optimize image lazy loading

### Phase 5: Vietnamese Localization
- [ ] Add payment method logos (MoMo, ZaloPay, VietQR, VNPAY)
- [ ] Implement trust badges (verification, ratings)
- [ ] Format phone numbers (+84 XXX XXX XXXX)
- [ ] Test line-height with stacked diacritics
- [ ] Add Vietnamese screen reader support

---

## Maintenance & Updates

**Version Control:**
- Update version number on major changes
- Document breaking changes in changelog
- Communicate updates to development team

**Design Review Frequency:**
- Quarterly: Review analytics, user feedback
- Bi-annually: Update color palette, typography
- Annually: Major redesign considerations

**Browser Testing:**
- Chrome/Edge (Windows, macOS, Android)
- Safari (iOS, macOS)
- Firefox
- Target: Latest 2 versions + 95%+ market share browsers

**Performance Benchmarks:**
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1
- Time to Interactive: <3s (3G network)

---

## Questions & Support

**For Design Questions:**
- Reference this document first
- Check research reports in `plans/2025-12-16-vietnam-realestate-bootstrap/`
- Consult project tech stack: `docs/tech-stack.md`

**Unresolved Design Decisions:**
1. Map marker clustering strategy (Supercluster vs. Mapbox native)
2. Offline support requirements for rural Vietnam
3. Custom Vietnamese map tiles vs. Mapbox default
4. Dark mode implementation priority

---

**Document Status:** Complete
**Next Review Date:** 2026-03-16
**Owner:** UI/UX Design Team
