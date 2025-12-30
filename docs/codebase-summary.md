# Codebase Summary

**Project**: Realestate_Vietnam - Vietnamese Real Estate Marketplace Platform
**Status**: MVP1 Phase - Authentication system 100% complete
**Last Updated**: 2025-12-30 (Auth Implementation Complete)
**Frontend Status**: Phase 0 complete + Authentication UI (Login, Register, Protected Routes, Dashboards)
**Backend Status**: MVP1 complete (Auth, Users, Listings with 33 tests passing)
**Overall Status**: Phase 1 Authentication ✅ Complete, Security hardening required

## Overview

Realestate_Vietnam is a full-stack real estate marketplace platform targeting the Vietnamese market. The project uses a monorepo structure with NestJS backend, Next.js 14 frontend, and shared packages for database entities and utilities.

## Technology Stack

### Backend

- **Framework**: NestJS 14
- **Language**: TypeScript
- **Database**: PostgreSQL 15 with TypeORM
- **Authentication**: JWT + OTP (mock service for MVP)
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest (33 tests, 5 suites)

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS 3.4.1 with dark mode support
- **State Management**: React Query (TanStack Query) + Zustand
- **Forms**: React Hook Form + Zod validation
- **UI Components**: In progress (foundation only)
- **Icons**: Lucide React
- **Date Handling**: date-fns

### Infrastructure

- **Container**: Docker Compose
- **Services**: PostgreSQL, Redis, MinIO (object storage)
- **Package Manager**: pnpm workspaces
- **Linting**: ESLint
- **Formatting**: Prettier
- **Git Hooks**: Husky + lint-staged

## Project Structure

```
realestate_vietnam/
├── apps/
│   ├── backend/               # NestJS application
│   │   ├── src/
│   │   │   ├── config/        # Configuration files (database, JWT, Redis, app)
│   │   │   ├── modules/
│   │   │   │   ├── auth/      # Authentication & JWT/OTP
│   │   │   │   ├── users/     # User profile & KYC
│   │   │   │   └── listings/  # Property listings & quality scoring
│   │   │   └── database/
│   │   │       └── seeds/     # Database seeding (property types, admin units)
│   │   └── test/              # E2E tests
│   │
│   └── frontend/              # Next.js application
│       ├── src/
│       │   ├── app/           # App Router pages & layout
│       │   └── lib/           # Utilities (API client, providers)
│       └── public/            # Static assets
│
├── packages/
│   ├── database/              # TypeORM entities & database layer
│   │   └── src/entities/      # 9 entities (User, Role, Listing, etc.)
│   │
│   └── shared/                # Shared types & utilities
│       └── src/
│           ├── types/         # TypeScript interfaces
│           ├── constants/     # Enums & constants
│           └── utils/         # Validation & formatting
│
├── database/
│   ├── schema.sql             # PostgreSQL schema (674 lines)
│   └── seeds/                 # SQL seed files
│
├── docker/
│   └── docker-compose.yml     # Service composition
│
└── docs/                      # Documentation
    ├── design-guidelines.md
    ├── project-roadmap.md
    └── wireframes/            # Interactive mockups
```

## Core Modules

### Authentication Module (`apps/backend/src/modules/auth`)

**Purpose**: User authentication and authorization

**Features**:

- JWT-based authentication (15min access token, 30d refresh token)
- OTP verification (mock service returns `123456` for MVP)
- Password encryption with bcrypt
- Role-based access control (RBAC)

**Key Files**:

- `auth.service.ts`: Core authentication logic
- `auth.controller.ts`: Auth endpoints (login, register, refresh, verify-otp)
- `token.service.ts`: JWT token generation and validation
- `otp.service.ts`: OTP generation and verification
- `jwt.strategy.ts`: Passport JWT strategy
- `local.strategy.ts`: Local strategy for email/password

**Key Features**:

- User type support: Partner (Đăng ký BĐS) vs Buyer (Tìm kiếm BĐS)
- UserType enum stored in user.settings for persistent role differentiation
- Dual authentication: email or phone registration
- Avatar upload to S3 (signed URLs, max 5MB)
- Token pair with userType included in JWT payload

**Endpoints** (8):

- `POST /auth/register` - Register new user with userType
- `POST /auth/login` - User login (returns userType in token)
- `POST /auth/refresh` - Refresh access token
- `POST /auth/verify-otp` - Verify OTP
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user profile
- `POST /auth/validate` - Validate token
- `POST /auth/upload-avatar` - Upload avatar to S3

### Users Module (`apps/backend/src/modules/users`)

**Purpose**: User profile management and KYC (Know Your Customer)

**Features**:

- Profile management (name, email, phone, avatar)
- KYC verification (identity documents, business registration)
- Password change
- Account status management

**Endpoints** (6):

- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update profile
- `POST /users/verify-identity` - Submit KYC documents
- `GET /users/verify-identity` - Get KYC status
- `PUT /users/change-password` - Change password
- `GET /users/:id` - Get user details

### Listings Module (`apps/backend/src/modules/listings`)

**Purpose**: Property listing management with quality scoring

**Features**:

- CRUD operations for property listings
- Automatic listing code generation: `BDS-{CITY}-{DATE}{COUNTER}`
- SEO slug generation with Vietnamese tone removal
- Quality scoring (0-10 scale, min 4.0 to publish)
- Listing filtering and search
- Advanced filtering by location, price, property type

**Quality Scoring Criteria**:

- Title completeness: 0-2 points
- Description quality: 0-3 points
- Image coverage: 0-2 points
- Contact info completeness: 0-1 points
- Location accuracy: 0-2 points

**Endpoints** (11):

- `GET /listings` - List all listings (paginated, filtered)
- `GET /listings/:id` - Get listing details
- `POST /listings` - Create new listing
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing
- `GET /listings/:id/quality-score` - Get quality score
- `GET /listings/search` - Advanced search
- `GET /listings/city/:city` - Filter by city
- `POST /listings/:id/publish` - Publish listing
- `POST /listings/:id/draft` - Save as draft
- `GET /listings/user/:userId` - Get user listings

## Database Entities

### 11 Core Entities

**User** (`User`)

- id, email, passwordHash, phone, avatar, isKycVerified, roles, createdAt, updatedAt
- Relationships: has-many Listings, Leads, Deals

**Role** (`Role`)

- id, name (Admin, Agent, Buyer, Seller)
- Relationships: many-to-many with User via UserRole

**UserRole** (`UserRole`)

- Mapping table for many-to-many relationship between User and Role

**AdminUnit** (`AdminUnit`)

- Hierarchical provinces/districts/wards (63 seeded Vietnamese provinces)
- code, name, nameEn, level, parentCode, isActive

**PropertyType** (`PropertyType`)

- 8 seeded types: Apartment, House, Villa, Land, Commercial, Industrial, Farm, Other
- code, name, nameEn, icon, sortOrder, isActive

**Listing** (`Listing`)

- Property listing details (title, description, price, area, images, etc.)
- Auto-generated code, SEO slug
- Relationships: belongs-to User, AdminUnit, PropertyType

**Lead** (`Lead`)

- Customer inquiry/interest in property
- Relationships: belongs-to User (agent), Listing

**Deal** (`Deal`)

- Transaction record
- Relationships: belongs-to User (buyer), User (seller), Listing

**Agent** (`Agent`)

- Licensed real estate agent information
- licenseNumber, licenseIssueDate, licenseExpiryDate

**Base Fields** (all entities):

- id (UUID, primary key)
- createdAt, updatedAt (timestamps)
- isActive, deletedAt (soft delete support)

## API Endpoints Summary

Total: 28 endpoints

**Authentication (7)**

- login, register, refresh, verify-otp, logout, get-me, validate-token

**Users (6)**

- profile management, KYC verification, password change, user details

**Listings (11)**

- CRUD, quality scoring, search, filtering, publish/draft

**Public (4)**

- health check, admin units, property types, search

## Configuration Management

**Config Files** (`apps/backend/src/config/`):

- `app.config.ts` - App settings (port, version, environment)
- `database.config.ts` - PostgreSQL connection and TypeORM options
- `jwt.config.ts` - JWT secrets and token expiry (15m access, 30d refresh)
- `redis.config.ts` - Redis connection for caching/sessions

**Environment Variables** (`.env`):

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for token signing
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `REDIS_URL` - Redis connection
- `NODE_ENV` - Environment (development, production)

## Database Schema Highlights

**PostgreSQL 15** with comprehensive schema:

- UUID primary keys
- Timestamps (createdAt, updatedAt)
- Hierarchical admin units (provinces → districts → wards)
- Foreign key constraints with ON DELETE CASCADE
- Indexes on frequently queried columns (email, listing code, user-id)
- Soft delete support (deletedAt column on relevant entities)

## Frontend Architecture

**State Management**:

- React Query: Server state (API data fetching, caching)
- Zustand: Client state (UI, authentication, user preferences)

**API Client** (`apps/frontend/src/lib/api.ts`):

- Generic typed HTTP client
- Bearer token authentication
- Error handling and response transformation
- Built on Fetch API

**Styling**:

- Tailwind CSS 3.4.1 with dark mode support
- Custom color schemes: Navy Blue primary (#0D47A1), Crimson Red danger (#E53935)
- Vietnamese fonts: Be Vietnam Pro (headings), Roboto (body)
- Responsive design with 4 breakpoints (375px, 768px, 1024px, 1440px)
- 8px base spacing unit system

**Phase 0 Completed Components**:

### Layout Components

**Header** (`apps/frontend/src/components/layout/Header.tsx`)

- Sticky navigation bar with logo
- Desktop navigation: Trang chủ, Mua bán, Cho thuê, Tin tức, Liên hệ
- Mobile hamburger menu (responsive <768px)
- User menu: Đăng nhập, Đăng ký buttons
- WCAG 2.1 AA accessibility compliance
- Features: state management, focus visible, keyboard nav

**Footer** (`apps/frontend/src/components/layout/Footer.tsx`)

- 4-column grid layout (responsive: 1 col mobile, 2 col tablet, 4 col desktop)
- Company info + social media (Facebook, Zalo, YouTube)
- Quick links section (5 links)
- Services section (4 links)
- Contact information (address, phone, email)
- Dynamic copyright year calculation
- Dynamic year in copyright notice

### Property Components

**PropertyCard** (`apps/frontend/src/components/property/PropertyCard.tsx`)

- Responsive property listing card with 16:9 aspect ratio
- Image with lazy loading and hover scale effect
- Price badge (top-left overlay)
- Favorite toggle button (heart icon, interactive state)
- Property type badge
- Title (2-line truncate), location (with icon)
- Property stats: bedrooms, bathrooms, area (with icons)
- Description preview (1-line truncate, optional)
- "Xem chi tiết" CTA button
- Hover effects: -4px translateY, shadow-xl
- Full TypeScript interface with optional props
- Touch-friendly for mobile (48px minimum buttons)

### Landing Page

**Page** (`apps/frontend/src/app/page.tsx`)

- Hero section: Gradient background, search bar, quick filters
- Featured Properties section: 3-column grid (responsive)
- Trust Indicators section: 4 trust signals with icons
- CTA section: "Bạn Muốn Đăng Tin Bất Động Sản?"
- Responsive: 1 col mobile, 2 col tablet, 3 col desktop

**Root Layout** (`apps/frontend/src/app/layout.tsx`)

- Google Fonts integration (Be Vietnam Pro, Roboto)
- Vietnamese language support (lang="vi")
- SEO metadata (Vietnamese title, description, keywords)
- Global Tailwind styles (cream background #F5F5F5)
- React Query provider wrapper

**Tailwind Config** (`apps/frontend/tailwind.config.ts`)

- Design system tokens: colors, typography, spacing
- Custom aspects: 16/9 for property cards
- Theme extensions: shadows, borders, line-heights

### Authentication Components (Phase 1)

**Auth Service** (`apps/frontend/src/services/auth.service.ts`)

- API client for authentication endpoints
- Methods: register(), login(), refresh(), logout(), getCurrentUser()
- Token management (get/set/clear access and refresh tokens)
- Error handling and response transformation

**Auth Context** (`apps/frontend/src/contexts/AuthContext.tsx`)

- Global authentication state management
- useAuth() hook for consuming auth state
- State: user, isLoading, error, isAuthenticated
- Methods: login(), logout(), register()
- Automatic token refresh on mount

**Protected Route Component** (`apps/frontend/src/components/auth/ProtectedRoute.tsx`)

- Wrapper for routes requiring authentication
- Checks user type (partner vs buyer)
- Checks required roles
- Redirects to login if not authenticated
- Shows loading spinner during auth verification
- Prevents unauthorized access to dashboards

**Auth Pages** (11 new pages)

- `/login` - Login form with email/password
- `/register` - Registration with user type selector (Partner/Buyer)
- `/dashboard/partner` - Partner dashboard (list properties, view leads)
- `/dashboard/buyer` - Buyer dashboard (search properties, view favorites)
- `/profile` - User profile management with avatar upload
- Additional views: listings, leads, search, favorites

**Frontend Progress**: 50% complete (Phase 1 Auth)

- Foundation: ✅ Complete
- Core layouts & components: ✅ Complete
- Authentication pages: ✅ Complete (Login, Register, Dashboards)
- Protected routes: ✅ Complete
- Avatar upload: ✅ Complete (S3 integration)
- Remaining: Listing creation, advanced search, admin features

## Testing Strategy

**Backend Tests**: 33 passing tests across 5 suites

- Auth service tests
- Auth controller tests
- Listings service tests
- Quality scoring tests
- OTP service tests

**Test Configuration**:

- Jest with 4GB memory limit
- E2E tests in `apps/backend/test/`
- Unit tests co-located with source code (\*.spec.ts)

**Coverage Areas**:

- Authentication logic (JWT, OTP, password)
- Listing CRUD operations
- Quality score calculation
- Database transactions

## Seeding Strategy

**Pre-seeded Data**:

1. **63 Vietnamese Provinces/Cities** - All administrative units (code, name, English name)
2. **8 Property Types** - Apartment, House, Villa, Land, Commercial, Industrial, Farm, Other
3. **7 User Roles** - Admin, Agent, Buyer, Seller, Broker, Investor, Tenant
4. **4 Subscription Packages** - Tiers for premium features

**Seeding Execution**:

```bash
npm run seed  # Runs apps/backend/src/database/seeds/run-seeds.ts
```

## Development Workflow

**Monorepo Structure** (`pnpm workspaces`):

```
workspace:* # Shared package references
```

**Root Scripts**:

- `pnpm install` - Install all dependencies
- `pnpm run dev` - Run backend + frontend in development
- `pnpm run build` - Build all packages
- `pnpm run test` - Run all tests
- `pnpm run lint` - Lint all packages

**Git Hooks**:

- Pre-commit: Husky + lint-staged (lints staged files)
- Prevents committing files with linting errors

## Deployment Architecture

**Docker Services** (`docker/docker-compose.yml`):

1. PostgreSQL 15 - Primary database
2. Redis - Caching and session storage
3. MinIO - Object storage (S3-compatible)

**Service Dependencies**:

- Backend → PostgreSQL, Redis
- Frontend → Backend API

## Known Limitations (Phase 0 Complete, Phase 1 In Progress)

**Backend** (MVP1 Complete):

1. OTP is mock service (returns 123456) - Real SMS provider pending
2. Payment integration not implemented - Planned for Phase 2
3. Email notifications not enabled - Planned for Phase 2
4. Advanced search features limited - Pagination and basic filters only
5. Image upload via MinIO not yet implemented - Frontend UI ready

**Frontend** (Phase 0 Complete, Phase 1 25%):

1. Landing page complete (25% of full UI)
2. Authentication pages not yet implemented (Phase 1)
3. Listing creation/editing forms not yet built (Phase 1)
4. Search results page not yet built (Phase 1)
5. User dashboard not yet built (Phase 1)
6. Map integration prepared but not used
7. Mock data on landing page - needs API integration

## Performance Considerations

**Caching Strategy**:

- Redis for session storage
- Query result caching (configurable)
- Frontend: React Query caching

**Database Optimization**:

- Indexed columns on User.email, Listing.code, Listing.userId
- Hierarchical queries for admin units
- Pagination on listing endpoints

**Frontend Performance**:

- Next.js 14: Automatic code splitting, SSR ready
- Tailwind CSS: Tree-shaken unused styles
- React Query: Request deduplication, background updates

## Internationalization (i18n)

**Currently Supported**:

- Vietnamese (primary)
- English (entity translations via nameEn fields)

**Admin Units**: Bilingual support (name, nameEn)
**Property Types**: Bilingual support (name, nameEn)

## Security Measures

**Authentication**:

- JWT tokens with expiry
- Refresh token rotation
- Password hashing with bcrypt
- OTP verification (mock for MVP)

**Database**:

- Foreign key constraints
- User-specific data access (listings belong to users)
- Soft deletes for audit trail

**API**:

- CORS configuration
- Rate limiting preparation
- Bearer token validation

## Next Steps

**Phase 1 (MVP1 - Q1 2025)**:

1. Frontend authentication pages (login, register, OTP verification)
2. Listing creation form with image upload
3. Search results page with filtering
4. User dashboard/profile management
5. API integration with mock data removal

**Phase 2 (Advanced - Q1-Q2 2025)**:

1. Payment integration (SePay.vn, VietQR)
2. Real OTP via SMS provider
3. Email notification system
4. Deal workflow implementation
5. Lead management system

**Phase 3+ (Future)**:

1. Advanced search with Elasticsearch
2. Map integration (Mapbox/Leaflet)
3. Admin dashboard & analytics
4. Flutter mobile app
5. Production compliance & launch

---

**Total Lines**: ~2,350 TypeScript (backend), ~615 SQL (database schema)
**Total Endpoints**: 28 API routes
**Test Coverage**: 33 passing tests
**Deployment Ready**: Yes (Docker Compose)
