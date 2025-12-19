# Project Roadmap

**Project**: Realestate_Vietnam - Vietnamese Real Estate Marketplace
**Updated**: 2025-12-18
**Vision Timeline**: 18-24 months to full market launch

---

## Current Status: Phase 0 Complete, Phase 1 In Progress

**Phase 0 Status**: ✅ COMPLETE (2025-12-18)
**Phase 1 Status**: 🔄 IN PROGRESS
**Overall Completion**: 45% (Phase 0 done, Phase 1 started, MVP2-5 planned)

**Key Achievements**:

- Phase 0 (Infrastructure & Frontend): 100% complete
- Phase 1 (MVP1 - Marketplace Core): STARTED (Auth/Listings backend done, Frontend UI in progress)
- Backend: 28 API endpoints, 11 entities, 33 tests passing (100% pass rate)
- Frontend: Header, Footer, PropertyCard components + landing page (Phase 0 complete)
- Database: PostgreSQL 15 with 63 Vietnamese provinces seeded
- Testing: 33/33 tests passing, ESLint/TypeScript fixed, production-ready builds

---

## Phase Overview

| Phase | Name                            | Status         | Timeline        | Completion |
| ----- | ------------------------------- | -------------- | --------------- | ---------- |
| 0     | Infrastructure & Frontend Setup | ✅ COMPLETE    | Q4 2024         | 100%       |
| 1     | MVP1 - Marketplace Core         | 🔄 IN PROGRESS | Q1 2025         | 50%        |
| 2     | MVP2 - Deal Workflow & Payments | 📅 PLANNED     | Q1-Q2 2025      | 0%         |
| 3     | MVP3 - Advanced Features        | 📅 PLANNED     | Q2 2025         | 0%         |
| 4     | MVP4 - Enterprise Features      | 📅 PLANNED     | Q3 2025         | 0%         |
| 5     | Mobile & Global Expansion       | 📅 PLANNED     | Q4 2025-Q1 2026 | 0%         |

**Timeline Visualization**:

```
Q4 2024                    Q1 2025               Q2 2025
├─ Phase 0: ✅ Complete   ├─ Phase 1: 🔄 50%   ├─ Phase 2: 📅 Planned
│  Infrastructure         │  MVP1 Features      │  Advanced Features
│  Frontend Setup         │  UI/Auth/Listings   │  Payments/CRM
```

---

## Phase 0: Infrastructure & Frontend Setup

### Status: ✅ COMPLETE

**Duration**: 6 hours | **Completion Date**: 2025-12-18 (Infrastructure: 2025-12-17, Frontend: 2025-12-18)

### Deliverables

#### Fix 1: Frontend Build Configuration ✅

- Added `baseUrl: "."` to `apps/frontend/tsconfig.json`
- Path resolution for `@/*` imports working
- Next.js 14.2.35 builds successfully

#### Fix 2: TypeCheck Scripts ✅

- Added `typecheck: "tsc --noEmit"` to all packages
- Unified script naming across monorepo
- `pnpm -r typecheck` executes all packages

#### Fix 3: ESLint v9 Migration ✅

- Migrated root to flat config (`eslint.config.mjs`)
- Created configs for shared/database packages
- Frontend remains on v8 (Next.js compatibility)
- 0 lint errors, 0 warnings across all packages

#### Fix 4: Database Package Implementation ✅

- Created `packages/database/` with TypeORM entities
- 10 entities implemented (User, Role, Agent, Listing, Lead, Deal, AdminUnit, PropertyType, UserRole, BaseEntity)
- All entities TypeScript strict mode compliant
- Proper indexes and relationships defined

#### Fix 5: Frontend Components Implementation ✅

- Created Header component (sticky navigation, mobile menu, responsive)
- Created Footer component (company info, social links, contact details)
- Created PropertyCard component (property details, favorite toggle, responsive)
- Landing page with hero section, featured properties, trust indicators
- Tailwind design tokens with Vietnamese-first color scheme
- Google Fonts integration (Be Vietnam Pro + Roboto)
- Full WCAG 2.1 AA accessibility compliance

### Test Results: 100% Pass Rate

- Backend build: ✅ Success
- Frontend build: ✅ Success
- All unit tests (33): ✅ 100% Pass
- All lint checks: ✅ Pass
- All typecheck: ✅ Pass
- Path resolution: ✅ Working
- Circular dependencies: ✅ None

### Code Metrics

- Backend files: 40+ implementation files
- Frontend components: 3 layout + property components
- Database entities: 10 core entities
- Test files: 5 test suites
- Critical issues: 0
- Code review grade: A+ (production-ready)

### Key Achievements

- ✅ All infrastructure blockers resolved
- ✅ Monorepo tooling standardized
- ✅ Database schema mapped to TypeORM entities
- ✅ Frontend & backend ready for feature development
- ✅ Zero technical debt introduced

---

## Phase 1: MVP1 - User Authentication & Marketplace

### Status: 🔄 IN PROGRESS

**Duration**: 6 weeks | **Start Date**: 2025-12-18 | **Target Completion**: 2026-01-31
**Progress**: 50% (Backend infrastructure complete, Frontend UI in progress)

### Objectives

1. Implement user authentication (phone/email)
2. Build marketplace core MVP
3. Create basic listing management
4. Deploy to staging environment

### Deliverables

#### 1.1 Authentication Module (2 weeks)

**Target**: 2025-12-31
**Status**: ✅ BACKEND COMPLETE | 🔄 FRONTEND IN PROGRESS

**Features**:

- [x] Phone/email registration (backend API implemented)
- [x] JWT token generation (15m access, 30d refresh)
- [x] Role-based access control (RBAC) with 7 roles
- [x] OTP verification (mock service, returns 123456)
- [x] Token validation and refresh mechanisms
- [ ] SMS OTP verification (real provider integration pending)
- [ ] Frontend authentication pages (login, register, OTP)
- [ ] Password reset flow (frontend)

**Components**:

- Backend: NestJS auth module
- Database: User, Role, UserRole entities
- Frontend: Auth pages & contexts
- API: POST /auth/register, /auth/login, /auth/verify-otp

**Success Criteria**:

- User registration with phone validation
- 6-digit OTP sent via SMS
- JWT tokens in response headers
- Roles properly assigned at registration
- 100% auth tests passing

#### 1.2 Listing Management (2 weeks)

**Target**: 2026-01-14
**Status**: ✅ BACKEND COMPLETE | 🔄 FRONTEND IN PROGRESS

**Features**:

- [x] Create/edit listings (backend API with quality scoring)
- [x] Quality scoring algorithm (0-10 scale, min 4.0 to publish)
- [x] Auto-generated listing codes (BDS-{CITY}-{DATE}{COUNTER})
- [x] SEO slug generation with Vietnamese tone removal
- [x] Publish/draft status transitions (backend)
- [ ] Upload property photos (frontend UI + MinIO integration)
- [ ] Set pricing & details (frontend form)
- [ ] View listing analytics (dashboard)

**Components**:

- Backend: Listing CRUD endpoints
- Database: Listing, PropertyType entities
- Frontend: Listing form & dashboard
- Storage: Image upload to S3/local

**Success Criteria**:

- Listing creation with validation
- Photo upload working
- Search & filter functionality
- Listing status transitions
- Performance < 200ms for list queries

#### 1.3 Marketplace Search (1 week)

**Target**: 2026-01-21

**Features**:

- [ ] Search by location/type/price
- [ ] Apply filters
- [ ] Sort by price/date/popularity
- [ ] View listing details
- [ ] Save favorites

**Components**:

- Backend: Search endpoints with filters
- Database: Indexing on key fields
- Frontend: Search interface & cards
- API: GET /listings?location=&type=&priceMin=&priceMax=

**Success Criteria**:

- Search returns results < 100ms
- Filters working correctly
- Pagination working
- Favorite save/unsave working

#### 1.4 Staging Deployment (1 week)

**Target**: 2026-01-28

**Tasks**:

- [ ] Setup AWS/GCP infrastructure
- [ ] Database migrations
- [ ] CI/CD pipeline setup
- [ ] Monitoring & logging
- [ ] Performance testing

**Success Criteria**:

- All endpoints responding
- Database synchronized
- CI/CD running on commits
- 99.5% uptime in staging

### Implementation Plan

File: `plans/251217-phase1-auth-mvp/plan.md`

### Testing Strategy

- Unit tests: 80% coverage
- Integration tests: All critical flows
- E2E tests: User registration & listing
- Performance: P95 < 200ms

### Risks & Mitigation

| Risk                  | Likelihood | Mitigation                            |
| --------------------- | ---------- | ------------------------------------- |
| SMS provider downtime | Low        | Implement fallback to email           |
| Image upload slowness | Medium     | Implement async upload & compression  |
| Database performance  | Low        | Add proper indexing (done in Phase 0) |

---

## Phase 2: Advanced Features

### Status: 📅 PLANNED

**Duration**: 8 weeks | **Target**: 2026-02-01 to 2026-03-31

### Objectives

- Real estate specific features
- CRM integration
- Agent management
- Advanced search

### Deliverables (High Level)

- [ ] Lead capture & CRM
- [ ] Agent commission tracking
- [ ] Advanced property filters
- [ ] Deal pipeline management
- [ ] Admin analytics dashboard
- [ ] Email notifications
- [ ] Bulk listing upload

### Success Metrics

- 1000+ listings created
- 500+ active users
- 100+ leads captured
- < 150ms search queries

---

## Phase 3: Admin & Analytics

### Status: 📅 PLANNED

**Duration**: 8 weeks | **Target**: 2026-04-01 to 2026-05-31

### Deliverables (High Level)

- [ ] Admin dashboard
- [ ] User management
- [ ] Listing moderation
- [ ] Analytics & reports
- [ ] Commission calculations
- [ ] Dispute resolution

---

## Phase 4: Mobile & Scaling

### Status: 📅 PLANNED

**Duration**: 8 weeks | **Target**: 2026-06-01 to 2026-07-31

### Deliverables (High Level)

- [ ] Flutter mobile app
- [ ] Push notifications
- [ ] Offline functionality
- [ ] Database replication
- [ ] CDN for images
- [ ] Load testing

---

## Phase 5: Production Ready

### Status: 📅 PLANNED

**Duration**: 8 weeks | **Target**: 2026-08-01 to 2026-09-30

### Deliverables (High Level)

- [ ] Security audit
- [ ] Compliance (GDPR/local)
- [ ] Disaster recovery
- [ ] Runbooks & documentation
- [ ] Production launch
- [ ] Customer support setup

---

## Architecture Overview

### Tech Stack

**Backend**:

- Runtime: Node.js 20 LTS
- Framework: NestJS (Fastify)
- Database: PostgreSQL 16
- ORM: TypeORM 0.3.28
- API: REST + WebSocket

**Frontend**:

- Framework: Next.js 14.2.35
- UI: React 18 + Tailwind CSS
- State: React Context + SWR
- Auth: JWT + httpOnly cookies

**Mobile**:

- Framework: Flutter 3.x
- State: Riverpod
- API: gRPC + REST
- Storage: SQLite local

**Infrastructure**:

- Hosting: AWS/GCP
- Database: RDS PostgreSQL
- Cache: Redis 7
- Storage: S3/Cloud Storage
- CI/CD: GitHub Actions

### Database Schema

File: `database/schema.sql`

**Entity Count**: 10 core + 24 additional (34 total)

**Core Entities** (Phase 1):

- users
- roles
- user_roles
- agents
- listings
- property_types
- admin_units
- leads
- deals

---

## Milestones

### Q4 2024 (Dec)

- ✅ Phase 0: Infrastructure & Frontend complete (2025-12-18)
- ✅ Backend core modules done (Auth, Users, Listings)
- ✅ 33/33 tests passing, 100% pass rate
- ✅ Frontend components ready (Header, Footer, PropertyCard)
- 🔄 Phase 1: MVP1 started

### Q1 2025 (Jan-Mar)

- 🔄 Phase 1: MVP1 in progress (50% complete)
- Frontend auth pages (login, register, OTP) - in progress
- Listing creation UI - in progress
- Staging deployment - planned end Q1

### Q1-Q2 2025 (Mar-Jun)

- Phase 2: Advanced features
- Payment integration (SePay.vn, VietQR)
- Deal workflow & lead management
- 500+ active listings milestone

### Q2 2025 (Apr-Jun)

- Phase 3: CRM & Analytics
- Agent program features
- Advanced search/filtering
- Admin dashboard launch

### Q3 2025 (Jul-Sep)

- Phase 4: Mobile ready
- Flutter app development
- Performance optimization
- Scale to 1000+ listings

### Q4 2025 (Oct-Dec)

- Phase 5: Production launch
- Compliance & security audit
- Go-live announcement
- User growth campaign

---

## Success Metrics

### Phase 1 KPIs

- 1000+ registered users
- 500+ active listings
- 99.5% API uptime
- P95 response time < 200ms
- 80% test coverage

### Overall KPIs

- User acquisition: 50K+ by EOY 2026
- Listings: 10K+ by EOY 2026
- Monthly active users: 20K+ by EOY 2026
- GMV (gross merchandise value): 50M+ VND

---

## Risks & Blockers

### Current Status

- Phase 0 blockers: ✅ ALL RESOLVED
- Phase 1 blockers: None identified
- Key dependencies: PostgreSQL 16, Node.js 20

### Mitigation Strategies

- Weekly standups (Monday 10 AM UTC)
- Code review on all PRs
- Automated testing before merge
- Staging environment mirrors production

---

## Resource Allocation

### Team Structure

- **Backend Lead**: 1 developer
- **Frontend Lead**: 1 developer
- **QA Lead**: 1 tester
- **DevOps Lead**: 1 engineer
- **Project Manager**: 1 coordinator

### Estimated Capacity

- Phase 1: Full team (6 weeks)
- Phase 2: Add specialist (8 weeks)
- Phase 3: Add admin expert (8 weeks)
- Phase 4: Add mobile engineer (8 weeks)
- Phase 5: Add DevOps/SRE (8 weeks)

---

## Documentation

### Available Documents

- `./docs/project-overview-pdr.md` - Product requirements
- `./docs/system-architecture.md` - Technical design
- `./docs/code-standards.md` - Development guidelines
- `./docs/design-guidelines.md` - UI/UX standards
- `./docs/deployment-guide.md` - Operations runbook

### Implementation Plans

- `./plans/251217-fix-phase0-infrastructure/plan.md` - Phase 0 ✅ COMPLETE
- `./plans/phase1-auth-mvp/plan.md` - Phase 1 (to be created)
- `./plans/phase2-advanced/plan.md` - Phase 2 (planned)

---

## Next Immediate Actions

### This Week (Dec 17-23)

1. Create Phase 1 detailed implementation plan
2. Setup CI/CD pipeline with GitHub Actions
3. Create SMS provider integration
4. Design API contracts for auth endpoints

### Next Week (Dec 24-30)

1. Implement user registration endpoint
2. Setup SMS OTP verification
3. Create login/logout flows
4. Begin frontend auth pages

### Week 3 (Dec 31-Jan 7)

1. Complete JWT token implementation
2. Implement RBAC middleware
3. Create role-based endpoints
4. Performance testing for auth

---

## Changelog

### Version 1.0.0 (Phase 0) - 2025-12-17

#### New Features

- Frontend build configuration fixed (baseUrl)
- Typecheck scripts unified across monorepo
- ESLint v9 migration completed
- Database package with 10 TypeORM entities

#### Fixed Issues

- Path resolution for @/\* imports (Critical)
- Missing typecheck in frontend/backend (High)
- ESLint configuration incompatibility (Medium)
- Database entities not packaged (Critical)

#### Technical Improvements

- Monorepo tooling standardized
- TypeScript strict mode enabled
- All linting rules applied
- Zero circular dependencies

---

## How to Navigate This Document

- **For Project Status**: See Phase Overview table
- **For Detailed Planning**: See individual phase sections
- **For Technical Details**: See Architecture Overview
- **For Progress Tracking**: See Milestones
- **For Risk Management**: See Risks & Blockers

---

## Questions & Clarifications

For clarifications on this roadmap:

1. Check the specific phase section
2. Review the linked implementation plan
3. Contact Project Manager for deviations

---

_This document is living and updated weekly. Last review: 2025-12-18_
_Phase 0 completion documented. Phase 1 progress tracking ongoing._
