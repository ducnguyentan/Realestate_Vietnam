# Vietnam Real Estate Exchange Platform - Implementation Plan

> **Project**: San Giao Dich Bat Dong San Viet Nam
> **Created**: 2025-12-16
> **Duration**: ~20-26 weeks (3 MVPs)
> **Stack**: NestJS + Next.js 14 + PostgreSQL + Redis + OpenSearch

## Overview

Full-featured Vietnamese real estate marketplace with deal workflow, legal contracts, and AI-powered assistance. Progressive build from core marketplace (MVP1) to complete transaction platform (MVP3).

## Plan Structure

| Phase | Name | Duration | Status | Link |
|-------|------|----------|--------|------|
| 0 | Project Setup & Infrastructure | 1-2 weeks | pending | [phase-00-infrastructure.md](./phase-00-infrastructure.md) |
| 1 | MVP1: Core Marketplace | 8-10 weeks | pending | [phase-01-mvp1-marketplace.md](./phase-01-mvp1-marketplace.md) |
| 2 | MVP2: Deal Workflow & Legal | 6-8 weeks | pending | [phase-02-mvp2-deal-workflow.md](./phase-02-mvp2-deal-workflow.md) |
| 3 | MVP3: Advanced Features | 6-8 weeks | pending | [phase-03-mvp3-advanced.md](./phase-03-mvp3-advanced.md) |

## Architecture Summary

```
[Next.js Frontend] --> [NestJS API] --> [PostgreSQL]
         |                   |              |
         v                   v              v
     [Mapbox]           [Redis]     [OpenSearch MVP3]
                            |
                       [Bull Queue]
```

## Key Technical Decisions

1. **Monorepo Structure**: pnpm workspaces for backend/frontend/shared
2. **Database**: PostgreSQL 15 with TypeORM, existing schema from reference
3. **Auth**: JWT + OTP (phone-first, Vietnamese market standard)
4. **Files**: MinIO (S3-compatible) for images/documents
5. **Search**: PostgreSQL pg_trgm (MVP1), OpenSearch (MVP3)
6. **Payments**: VNPAY primary, MoMo/ZaloPay secondary
7. **AI (MVP3)**: LangChain + pgvector for RAG

## Reference Implementation

Located at: `C:\Users\Admin\Desktop\AI_Agent\sanBDS\codex\realestate-vietnam\`

- Database schema: `database/schema.sql` (30+ tables)
- OpenAPI spec: `backend/openapi.yaml` (1500+ lines)
- Backend services: `backend/src/modules/`
- Contract templates: `contracts/` (Vietnamese legal docs)
- Docker configs: `docker-compose.yml`

## MVP Scope Summary

**MVP1** (Core): Auth, Listings CRUD, Search, Admin moderation, Payments, Messaging
**MVP2** (Deals): 8-stage workflow, Viewings, Deposits, Contracts, E-signature
**MVP3** (AI): RAG assistant, OpenSearch, Commission system, Analytics

## Risk Factors

- Payment gateway integration complexity (VNPAY sandbox availability)
- Vietnamese text search optimization
- Legal contract compliance requirements
- OTP provider rate limits and costs

---

**Next Step**: Begin with [Phase 0: Infrastructure](./phase-00-infrastructure.md)
