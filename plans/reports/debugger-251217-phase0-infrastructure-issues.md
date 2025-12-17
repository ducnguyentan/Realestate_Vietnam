# Phase 0 Infrastructure Issues - Diagnostic Report

**Generated**: 2025-12-17
**Project**: Real Estate Vietnam
**Scope**: Frontend build, ESLint config, database package, typecheck scripts

---

## Executive Summary

Investigated 4 critical infrastructure issues in Phase 0. Found 1 critical bug (frontend build), 1 architectural gap (ESLint v9 migration incomplete), 1 missing implementation (database package), and 1 minor tooling gap (typecheck scripts).

**Priority order**:
1. Frontend Build Failure (CRITICAL - blocks development)
2. Missing Typecheck Scripts (HIGH - required for CI/CD)
3. ESLint Config Missing (MEDIUM - blocks lint command)
4. Database Package Not Implemented (LOW - planned gap, not blocking)

---

## Issue 1: Frontend Build Failure

### Root Cause
**CONFIRMED BUG**: Next.js webpack fails to resolve `@/lib/providers` despite correct tsconfig path mapping.

**Evidence**:
- File exists: `apps/frontend/src/lib/providers.tsx` (verified with `file` command)
- tsconfig.json has correct path: `"@/*": ["./src/*"]`
- TypeScript compiler can't find it: `error TS2307: Cannot find module '@/lib/providers'`
- Next.js build fails: `Module not found: Can't resolve '@/lib/providers'`
- Clean build (.next deletion) doesn't resolve
- pnpm install completed successfully

**Conflict identified**:
```json
// apps/frontend/tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "bundler",  // Next.js 14 default
    "baseUrl": "../..",              // ISSUE: Points to monorepo root
    "paths": {
      "@/*": ["./src/*"]             // Relative to baseUrl (wrong)
    }
  }
}
```

**Test results**:
- Direct Node import fails: `Cannot find module 'C:\...\src\lib\providers'` (missing .tsx extension)
- TypeScript shows baseUrl resolves to: `C:\Users\Admin\Realestate_Vietnam\Realestate_Vietnam`
- Path resolves to: `../../src/*` from monorepo root (incorrect)

### Recommended Fix

**Option A - Fix baseUrl (RECOMMENDED)**:
```json
{
  "compilerOptions": {
    "baseUrl": ".",  // Change from "../.." to "."
    "paths": {
      "@/*": ["./src/*"]  // Now resolves correctly
    }
  }
}
```

**Option B - Adjust paths to match current baseUrl**:
```json
{
  "compilerOptions": {
    "baseUrl": "../..",
    "paths": {
      "@/*": ["./apps/frontend/src/*"]  // Explicit from root
    }
  }
}
```

**Validation required**:
- After fix: `pnpm tsc --noEmit` (should pass)
- After fix: `pnpm build` (should compile)
- Verify other path aliases still work (`@realestate/shared`, `@realestate/database`)

---

## Issue 2: Missing Typecheck Scripts

### Root Cause
**GAP**: Monorepo requires typecheck scripts in each package for `pnpm -r typecheck` to work. Currently only root defines the command.

**Evidence**:
- Root package.json: `"typecheck": "pnpm -r typecheck"` (recursive)
- Backend package.json: No typecheck script (but `tsc --noEmit` works)
- Frontend package.json: No typecheck script (currently fails due to Issue #1)
- Shared package.json: Has `"type-check": "tsc --noEmit"` (inconsistent naming)

**Current status**:
- Backend typecheck: ✅ `tsc --noEmit` runs successfully (no errors)
- Frontend typecheck: ❌ Fails with `Cannot find module '@/lib/providers'`
- Shared typecheck: ⚠️ Has script but named `type-check` instead of `typecheck`

### Recommended Fix

Add to each package.json:

**apps/backend/package.json**:
```json
{
  "scripts": {
    "typecheck": "tsc --noEmit"
  }
}
```

**apps/frontend/package.json**:
```json
{
  "scripts": {
    "typecheck": "tsc --noEmit"
  }
}
```

**packages/shared/package.json** (rename existing):
```json
{
  "scripts": {
    "typecheck": "tsc --noEmit"  // Change from "type-check"
  }
}
```

**Validation**:
- After Issue #1 fixed: `pnpm -r typecheck` should pass for all packages
- CI/CD pipeline can use this for pre-commit/PR checks

---

## Issue 3: Shared Package ESLint Config Missing

### Root Cause
**ARCHITECTURAL GAP**: ESLint v9.39.2 requires flat config (`eslint.config.js`) but project uses legacy `.eslintrc.json`.

**Evidence**:
```
ESLint: 9.39.2
ESLint couldn't find an eslint.config.(js|mjs|cjs) file.
From ESLint v9.0.0, the default configuration file is now eslint.config.js.
```

**Current state**:
- Root has `.eslintrc.json` (legacy format)
- ESLint v9 installed: `"eslint": "^9.0.0"` (root), `"eslint": "^9.18.0"` (backend)
- Frontend uses ESLint v8: `"eslint": "^8"` with `eslint-config-next`
- Backend uses ESLint v9 with flat config support

**Migration not complete**:
- Root config incompatible with ESLint v9 in packages
- Shared package inherits root config but ESLint v9 can't read it
- Backend likely has own eslint.config.js (not visible in investigation)

### Recommended Fix

**Option A - Migrate all to ESLint v9 flat config (RECOMMENDED)**:

1. Create root `eslint.config.js`:
```js
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  prettier,
];
```

2. Update packages/shared to extend root config
3. Keep frontend on ESLint v8 (Next.js compatibility)

**Option B - Downgrade shared package to ESLint v8**:
- Add `"eslint": "^8"` to packages/shared/devDependencies
- Less future-proof

**Option C - Create package-specific flat config**:
- Add `eslint.config.js` to packages/shared
- Duplicate config (maintenance burden)

### Additional Discovery

**Inconsistency across packages**:
- Root: `.eslintrc.json` + ESLint v9
- Backend: ESLint v9.18.0 (likely has flat config)
- Frontend: ESLint v8 + `eslint-config-next`
- Shared: No config + ESLint inherited from root (breaks)

**Recommendation**: Standardize on ESLint v9 flat config at root, extend in packages, keep frontend on v8 for Next.js.

---

## Issue 4: Database Package Not Implemented

### Root Cause
**PLANNED GAP**: Database entities directory structure doesn't exist. Schema defined but TypeORM entities not generated.

**Evidence**:
- `database/schema.sql`: 673 lines, 34 tables
- `packages/database/src`: Directory doesn't exist
- `tsconfig.base.json`: Has path alias `"@realestate/database": ["packages/database/src"]`
- Backend has TypeORM: `"typeorm": "^0.3.28"`, `"@nestjs/typeorm": "^11.0.0"`

**Schema analysis** (34 tables):
```
Core entities (highest priority):
- users, roles, user_roles
- agents
- property_types
- listings, listing_media
- leads, messages
- deals, deal_events
- viewings, deposits

Supporting entities:
- admin_units (Vietnam administrative divisions)
- contract_templates, legal_documents
- signature_requests, signature_parties
- invoices, payments, refunds
- commission_rules, commissions

Advanced features:
- kb_articles, kb_chunks (knowledge base + vector search)
- ai_conversations
- notifications
- audit_logs
- reports, analytics_events
- saved_searches, favorites
- listing_packages, promo_codes
```

### Recommended Fix

**Phase 1 - Critical entities only**:

1. Create directory structure:
```
packages/database/
├── src/
│   ├── entities/
│   │   ├── user.entity.ts
│   │   ├── role.entity.ts
│   │   ├── agent.entity.ts
│   │   ├── property-type.entity.ts
│   │   ├── listing.entity.ts
│   │   ├── lead.entity.ts
│   │   └── index.ts
│   ├── migrations/
│   ├── config/
│   │   └── typeorm.config.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

2. Entity generation strategy:

**Option A - Manual creation** (RECOMMENDED for critical entities):
- Write TypeORM decorators by hand
- Map from schema.sql (already well-structured)
- Full control over relations, validations

**Option B - Auto-generation**:
```bash
typeorm-model-generator -h localhost -d realestate_vn -u postgres -p password -e postgres -o packages/database/src/entities
```
- Faster but requires cleanup
- May miss complex relations

**Option C - Schema-first with Prisma then migrate**:
- Use Prisma for quick prototyping
- Migrate to TypeORM later
- Not recommended (adds dependency)

3. Minimum viable entities (7 entities):
   - User, Role, UserRole
   - Agent
   - PropertyType
   - Listing
   - Lead

4. Add to packages/database/package.json:
```json
{
  "name": "@realestate/database",
  "version": "1.0.0",
  "main": "src/index.ts",
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "typeorm": "^0.3.28",
    "pg": "^8.16.3"
  },
  "devDependencies": {
    "typescript": "^5.6.0"
  }
}
```

### Status
**NOT BLOCKING** - This is architectural gap, not a bug. Backend can connect to database without entities (raw SQL). Entities needed for Phase 1 features (user auth, listings).

---

## Additional Issues Discovered

### 1. pnpm Workspace Dependencies Not Installed

**Observation**:
```
WARN  Local package.json exists, but node_modules missing, did you mean to install?
```

**Impact**: Shared package has no node_modules (but works via workspace hoisting).

**Fix**: Already resolved by `pnpm install` at root.

### 2. ESLint Version Mismatch

**Conflict**:
- Root: `"eslint": "^9.0.0"`
- Backend: `"eslint": "^9.18.0"`
- Frontend: `"eslint": "^8"`

**Recommendation**: Document this intentional split in README (Next.js requires v8).

### 3. Build Script Warnings

**Ignored build scripts**:
```
@nestjs/core@11.1.9, @scarf/scarf@1.4.0, bcrypt@5.1.1, unrs-resolver@1.11.1
```

**Fix**: Run `pnpm approve-builds` to allow bcrypt native compilation.

---

## Validation Checklist

After fixes applied:

- [ ] Frontend build succeeds: `pnpm --filter frontend build`
- [ ] All typechecks pass: `pnpm -r typecheck`
- [ ] Backend typecheck: `pnpm --filter backend typecheck`
- [ ] Frontend typecheck: `pnpm --filter frontend typecheck`
- [ ] Shared typecheck: `pnpm --filter @realestate/shared typecheck`
- [ ] Lint passes: `pnpm -r lint`
- [ ] Dev mode works: `pnpm dev`
- [ ] Database entities accessible: `import { User } from '@realestate/database'`

---

## Priority Execution Order

1. **CRITICAL** - Fix Issue #1 (Frontend Build):
   - Change baseUrl in apps/frontend/tsconfig.json
   - Test: `pnpm --filter frontend build`
   - ETA: 5 minutes

2. **HIGH** - Fix Issue #2 (Typecheck Scripts):
   - Add typecheck scripts to all package.json files
   - Test: `pnpm -r typecheck`
   - ETA: 5 minutes

3. **MEDIUM** - Fix Issue #3 (ESLint Migration):
   - Create root eslint.config.js
   - Migrate shared package
   - Test: `pnpm --filter @realestate/shared lint`
   - ETA: 20 minutes

4. **LOW** - Implement Issue #4 (Database Entities):
   - Create directory structure
   - Generate 7 critical entities
   - Test: Import and use in backend
   - ETA: 2-3 hours

---

## Unresolved Questions

1. **Frontend baseUrl**: Does changing baseUrl break other imports in the app?
   - Need to verify all `@/` imports after fix
   - Check if stores, api modules resolve correctly

2. **ESLint strategy**: Should frontend migrate to v9 or stay on v8?
   - Next.js 14 works with both
   - v9 requires more config but future-proof

3. **Database ORM**: Stick with TypeORM or consider alternatives?
   - Prisma has better DX but schema.sql already written
   - TypeORM better for NestJS integration

4. **Entity validation**: Should use class-validator decorators in entities?
   - Backend already has class-validator
   - Can reuse validators in DTOs and entities

5. **Migration strategy**: How to sync schema.sql with TypeORM entities?
   - Run schema.sql first, then generate entities? OR
   - Create entities, generate migrations?
