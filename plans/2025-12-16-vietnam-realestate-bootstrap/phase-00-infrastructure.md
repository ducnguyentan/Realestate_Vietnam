# Phase 0: Project Setup & Infrastructure

> **Duration**: 1-2 weeks
> **Priority**: Critical
> **Status**: COMPLETED (100%)
> **Dependencies**: None
> **Last Review**: 2025-12-18
> **Blocking Issues**: None - All resolved

## Context Links

- [Main Plan](./plan.md)
- [Reference Docker Compose](file:///C:/Users/Admin/Desktop/AI_Agent/sanBDS/codex/realestate-vietnam/docker-compose.yml)
- [Reference Schema](file:///C:/Users/Admin/Desktop/AI_Agent/sanBDS/codex/realestate-vietnam/database/schema.sql)
- [Tech Stack Doc](file:///C:/Users/Admin/Realestate_Vietnam/Realestate_Vietnam/docs/tech-stack.md)

---

## Key Insights

1. Reference implementation provides complete Docker infrastructure (PostgreSQL, Redis, OpenSearch, MinIO)
2. Database schema already defined with 30+ tables - use as foundation
3. Monorepo structure preferred for code sharing between backend/frontend
4. pnpm workspace recommended for faster installs and disk efficiency

---

## Requirements

### Functional

- Working local development environment
- Database initialized with schema and seed data
- Backend API scaffold with health check endpoint
- Frontend scaffold with basic routing
- Docker containers for all services

### Non-Functional

- Hot reload for development
- TypeScript strict mode
- ESLint + Prettier configured
- Git hooks for pre-commit checks

---

## Architecture Decisions

### ADR-001: Monorepo Structure

```
realestate-vietnam/
├── apps/
│   ├── backend/          # NestJS API
│   └── frontend/         # Next.js 14
├── packages/
│   ├── shared/           # Shared types, utils
│   └── database/         # TypeORM entities, migrations
├── docker/
│   └── docker-compose.yml
├── database/
│   ├── schema.sql
│   └── seeds/
├── pnpm-workspace.yaml
└── package.json
```

**Rationale**: Single repo simplifies CI/CD, enables code sharing, easier dependency management.

### ADR-002: TypeORM over Prisma

- Better TypeScript decorator support (NestJS native)
- Migration flexibility
- Existing reference uses TypeORM patterns

### ADR-003: Docker Development

- PostgreSQL 15 Alpine
- Redis 7 Alpine
- MinIO for S3-compatible storage
- OpenSearch disabled initially (MVP3)

---

## Related Reference Files

| File                                                              | Purpose                     |
| ----------------------------------------------------------------- | --------------------------- |
| `codex/realestate-vietnam/docker-compose.yml`                     | Docker services config      |
| `codex/realestate-vietnam/database/schema.sql`                    | Full DB schema              |
| `codex/realestate-vietnam/database/seeds/vietnam_admin_units.sql` | Vietnam provinces/districts |
| `codex/realestate-vietnam/backend/package.json`                   | Backend dependencies        |
| `codex/realestate-vietnam/frontend/package.json`                  | Frontend dependencies       |
| `codex/realestate-vietnam/.env.example`                           | Environment variables       |

---

## Implementation Steps

### Step 0.1: Initialize Monorepo (Day 1)

```bash
# Initialize pnpm workspace
pnpm init
```

**Files to create:**

1. `pnpm-workspace.yaml`

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

2. `package.json` (root)

```json
{
  "name": "realestate-vietnam",
  "private": true,
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "build": "pnpm -r build",
    "lint": "pnpm -r lint",
    "test": "pnpm -r test"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "prettier": "^3.1.0",
    "eslint": "^8.55.0",
    "husky": "^8.0.0",
    "lint-staged": "^15.2.0"
  }
}
```

3. `tsconfig.base.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@realestate/shared": ["packages/shared/src"],
      "@realestate/database": ["packages/database/src"]
    }
  }
}
```

### Step 0.2: Setup Backend Scaffold (Day 1-2)

```bash
# Create NestJS app
cd apps
nest new backend --package-manager pnpm --strict
```

**Backend dependencies to add:**

```json
{
  "dependencies": {
    "@nestjs/config": "^3.1.0",
    "@nestjs/typeorm": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/event-emitter": "^2.0.0",
    "@nestjs/swagger": "^7.1.0",
    "@nestjs/throttler": "^5.1.0",
    "typeorm": "^0.3.17",
    "pg": "^8.11.0",
    "ioredis": "^5.3.0",
    "bcrypt": "^5.1.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "helmet": "^7.1.0",
    "passport-jwt": "^4.0.0"
  }
}
```

**Key files:**

- `apps/backend/src/app.module.ts` - Root module with TypeORM config
- `apps/backend/src/config/` - Environment configs
- `apps/backend/src/common/` - Guards, interceptors, filters

### Step 0.3: Setup Frontend Scaffold (Day 2)

```bash
cd apps
npx create-next-app@14 frontend --typescript --tailwind --eslint --app --src-dir
```

**Frontend dependencies to add:**

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.17.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "date-fns": "^3.0.0",
    "mapbox-gl": "^3.0.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.309.0"
  },
  "devDependencies": {
    "@types/mapbox-gl": "^2.7.0"
  }
}
```

**Key files:**

- `apps/frontend/src/app/layout.tsx` - Root layout with providers
- `apps/frontend/src/lib/api.ts` - API client (fetch wrapper)
- `apps/frontend/src/lib/stores/` - Zustand stores

### Step 0.4: Docker Environment (Day 2-3)

Create `docker/docker-compose.yml` (copy from reference with modifications):

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: realestate_postgres
    environment:
      POSTGRES_USER: ${DB_USER:-realestate}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-realestate_secret}
      POSTGRES_DB: ${DB_NAME:-realestate_db}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ../database/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
      - ../database/seeds/vietnam_admin_units.sql:/docker-entrypoint-initdb.d/02-seeds.sql
    ports:
      - '5432:5432'

  redis:
    image: redis:7-alpine
    container_name: realestate_redis
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - '6379:6379'

  minio:
    image: minio/minio:latest
    container_name: realestate_minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY:-minioadmin}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY:-minio_secret}
    volumes:
      - minio_data:/data
    ports:
      - '9000:9000'
      - '9001:9001'

volumes:
  postgres_data:
  redis_data:
  minio_data:
```

### Step 0.5: Database Setup (Day 3)

1. Copy `database/schema.sql` from reference
2. Copy `database/seeds/vietnam_admin_units.sql` from reference
3. Create TypeORM entities based on schema

**Entity directory structure:**

```
packages/database/src/
├── entities/
│   ├── user.entity.ts
│   ├── role.entity.ts
│   ├── listing.entity.ts
│   ├── admin-unit.entity.ts
│   ├── property-type.entity.ts
│   └── index.ts
├── migrations/
└── index.ts
```

### Step 0.6: Shared Package (Day 3-4)

```
packages/shared/src/
├── types/
│   ├── user.types.ts
│   ├── listing.types.ts
│   └── api.types.ts
├── constants/
│   ├── roles.ts
│   ├── listing-status.ts
│   └── transaction-types.ts
├── utils/
│   ├── format.ts
│   └── validation.ts
└── index.ts
```

**Key constants:**

```typescript
// packages/shared/src/constants/listing-status.ts
export enum ListingStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  SOLD = 'sold',
  RENTED = 'rented',
}

export enum TransactionType {
  SELL = 'sell',
  RENT = 'rent',
}

export enum PropertyType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  VILLA = 'villa',
  TOWNHOUSE = 'townhouse',
  LAND = 'land',
  OFFICE = 'office',
  SHOPHOUSE = 'shophouse',
  WAREHOUSE = 'warehouse',
}
```

### Step 0.7: Environment Configuration (Day 4)

Create `.env.example`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=realestate
DB_PASSWORD=realestate_secret
DB_NAME=realestate_db
DATABASE_URL=postgresql://realestate:realestate_secret@localhost:5432/realestate_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# MinIO / S3
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minio_secret
S3_BUCKET=realestate-uploads
S3_REGION=us-east-1

# OTP (Twilio or local provider)
OTP_PROVIDER=mock
OTP_EXPIRY_MINUTES=5
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Payment (VNPAY)
VNPAY_TMN_CODE=
VNPAY_HASH_SECRET=
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3001/payment/callback

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_MAPBOX_TOKEN=
```

### Step 0.8: Development Scripts (Day 4)

Root `package.json` scripts:

```json
{
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "dev:backend": "pnpm --filter backend dev",
    "dev:frontend": "pnpm --filter frontend dev",
    "build": "pnpm -r build",
    "db:up": "docker compose -f docker/docker-compose.yml up -d postgres redis minio",
    "db:down": "docker compose -f docker/docker-compose.yml down",
    "db:reset": "docker compose -f docker/docker-compose.yml down -v && pnpm db:up",
    "db:seed": "pnpm --filter database seed",
    "lint": "pnpm -r lint",
    "lint:fix": "pnpm -r lint --fix",
    "test": "pnpm -r test",
    "prepare": "husky install"
  }
}
```

### Step 0.9: Git Hooks & Linting (Day 4-5)

1. Initialize Husky:

```bash
pnpm husky install
```

2. Add pre-commit hook `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
pnpm lint-staged
```

3. Configure lint-staged in root `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml}": ["prettier --write"]
  }
}
```

4. Create `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

## Todo List

- [x] Initialize pnpm workspace
- [x] Create directory structure (apps/, packages/, docker/, database/)
- [x] Setup NestJS backend scaffold
- [x] Setup Next.js 14 frontend scaffold (build fixed 2025-12-17)
- [x] Create shared package with types/constants
- [x] Create database package with entities (COMPLETED 2025-12-17)
- [x] Configure Docker compose
- [x] Copy and adapt database schema from reference
- [x] Setup environment configuration
- [x] Configure ESLint + Prettier (all v9 migration complete)
- [x] Setup Husky git hooks (verified and working)
- [x] Test local development workflow (all passing 2025-12-17)
- [x] Verify health check endpoint works
- [x] Document setup instructions in README

**Review Date**: 2025-12-18
**Review Reports**:

- [code-reviewer-2025-12-18-phase-0-production-readiness.md](../reports/code-reviewer-2025-12-18-phase-0-production-readiness.md)
- [debugger-2025-12-18-eslint-fix.md](../reports/debugger-2025-12-18-eslint-fix.md)

**Blocking Issues**: NONE - ALL RESOLVED

- ✅ Frontend build - FIXED (baseUrl configuration)
- ✅ ESLint config - FIXED (v9 migration complete)
- ✅ Database package - FIXED (10 entities implemented)
- ✅ Typecheck scripts - FIXED (unified across monorepo)

---

## Success Criteria - ALL MET ✅

1. ✅ `pnpm dev` starts both backend (3000) and frontend (3001)
2. ✅ `pnpm db:up` starts PostgreSQL, Redis, MinIO containers
3. ✅ Backend `/health` endpoint returns 200
4. ✅ Frontend loads at localhost:3001 with 106KB first load
5. ✅ TypeScript compilation passes with strict mode (0 errors)
6. ✅ Lint passes with 0 errors, 0 warnings
7. ✅ Database tables created from schema.sql
8. ✅ Vietnam admin units seeded (63 provinces, districts)

---

## Risk Assessment

| Risk                        | Impact | Probability | Mitigation                                         |
| --------------------------- | ------ | ----------- | -------------------------------------------------- |
| Docker compatibility issues | Medium | Low         | Test on clean machine, document requirements       |
| TypeORM migration conflicts | Medium | Medium      | Start with sync:true for dev, add migrations later |
| pnpm workspace issues       | Low    | Low         | Fall back to npm workspaces if needed              |
| Port conflicts              | Low    | Medium      | Make ports configurable via .env                   |

---

## Security Considerations

- Store secrets in .env (never commit)
- Use .gitignore for node_modules, .env, dist
- Enable TypeScript strict mode to catch type errors
- Setup CORS properly in backend
- Use helmet middleware in NestJS

---

## Completion Summary

**Phase 0 Completion**: 2025-12-17 (4 hours after infrastructure review)

### Key Deliverables Completed

- Frontend: Landing page, responsive components, Tailwind design system
- Backend: Health check, 33 tests passing, 0 errors
- Database: 10 TypeORM entities, proper relationships
- Tooling: ESLint v9, TypeScript strict, Prettier, git hooks
- CI/CD: All packages build successfully

### Quality Metrics - PRODUCTION READY

- Security Grade: A-
- Performance Grade: A
- Build Status: 100% Success
- Test Coverage: 33/33 passing
- Code Review: 0 critical issues
- Linting: 0 errors, 0 warnings

---

## Next Steps

**Phase 1: MVP1 Authentication & Marketplace Core**
Ready to proceed with:

1. User registration (phone/email + SMS OTP)
2. JWT authentication & RBAC
3. Listing creation & management
4. Marketplace search & filters
5. Staging deployment

**Target**: Phase 1 completion by 2026-01-31
