# Tech Stack - Sàn Giao Dịch Bất Động Sản Việt Nam

## Overview

Production-grade tech stack for Vietnamese real estate exchange platform, optimized for scalability, performance, and Vietnam market requirements.

---

## Frontend Stack

### Core Framework
- **Next.js 14** (App Router)
  - Server-side rendering (SSR) for SEO
  - Static generation (SSG) for performance
  - API routes for BFF pattern
  - Image optimization
  - Internationalization ready

### Language & Type Safety
- **TypeScript 5.x**
  - Full type safety across codebase
  - Enhanced IDE support
  - Reduced runtime errors

### UI & Styling
- **TailwindCSS 3.x**
  - Utility-first styling
  - Custom design system
  - Mobile-first responsive
  - Dark mode support ready

- **shadcn/ui** (Recommended)
  - Accessible components
  - Customizable primitives
  - Tailwind-based

### State Management
- **Zustand**
  - Lightweight (~1KB)
  - Simple API
  - No boilerplate
  - Perfect for client state

- **React Query (TanStack Query)**
  - Server state management
  - Automatic caching
  - Background refetching
  - Optimistic updates

### Maps Integration
- **Mapbox GL JS**
  - Interactive maps
  - Vietnam map tiles
  - Geospatial search
  - Custom markers & polygons

### Form Handling
- **React Hook Form**
  - Performance optimized
  - Built-in validation
  - TypeScript support

### Additional Libraries
- **date-fns** - Date manipulation (Vietnamese locale)
- **zod** - Schema validation
- **react-dropzone** - File uploads
- **recharts** - Analytics charts

---

## Backend Stack

### Core Framework
- **NestJS 10.x**
  - Enterprise-grade Node.js framework
  - TypeScript native
  - Dependency injection
  - Modular architecture
  - Built-in guards, interceptors, pipes

### Language
- **TypeScript 5.x**
  - Full type safety
  - Decorators for clean code
  - Better refactoring

### API Design
- **RESTful API** (Primary)
  - OpenAPI 3.0 specification
  - Auto-generated Swagger docs
  - Standardized responses

- **GraphQL** (Optional for MVP3)
  - Flexible queries
  - Real-time subscriptions

### Authentication & Authorization
- **Passport.js**
  - JWT strategy
  - OTP via SMS (Twilio/local provider)
  - Role-based access control (RBAC)

- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT generation

### Validation
- **class-validator** - DTO validation
- **class-transformer** - Data transformation

---

## Database & Storage

### Primary Database
- **PostgreSQL 15+**
  - ACID compliance
  - JSON/JSONB support
  - Full-text search (pg_trgm)
  - PostGIS for geospatial data
  - Excellent Vietnamese text support

### ORM
- **TypeORM** or **Prisma**
  - Type-safe queries
  - Migration management
  - Relationship handling
  - Active record pattern

### Cache Layer
- **Redis 7+**
  - Session storage
  - API response caching
  - Rate limiting
  - Real-time features (pub/sub)
  - Bull queue for background jobs

### Search Engine
- **OpenSearch** (MVP3)
  - Full-text search
  - Geospatial queries
  - Aggregations for filters
  - Vietnamese analyzer

### Vector Database (for AI)
- **pgvector** extension
  - Vector embeddings in PostgreSQL
  - Semantic search
  - No separate database needed

### File Storage
- **MinIO** (S3-compatible)
  - On-premise object storage
  - Cost-effective
  - S3 API compatibility
  - Or AWS S3 for production

---

## Payment Gateways

### Vietnamese Payment Providers
- **VNPAY**
  - Market leader in Vietnam
  - Bank transfers, cards, wallets
  - Well-documented API

- **MoMo**
  - Popular e-wallet
  - QR code payments
  - Instant transfers

- **ZaloPay**
  - Zalo ecosystem integration
  - Growing user base

### Payment Processing
- **Stripe** (International, optional)
- Webhook handling for async payment confirmation
- Idempotency for payment safety

---

## AI & Machine Learning

### LLM Integration
- **OpenAI GPT-4** or **Claude 3.5**
  - Conversational AI advisor
  - Listing analysis
  - Legal document assistance

### RAG Pipeline
- **LangChain**
  - Document loading & chunking
  - Vector store integration
  - Retrieval & generation

### Embeddings
- **OpenAI text-embedding-3-small**
  - Cost-effective
  - Good Vietnamese support

---

## DevOps & Infrastructure

### Containerization
- **Docker**
  - Consistent environments
  - Easy deployment

- **Docker Compose**
  - Local development
  - Service orchestration

### CI/CD
- **GitHub Actions**
  - Automated testing
  - Build & deploy pipelines
  - Environment-specific workflows

### Orchestration (Production)
- **Kubernetes** (Optional for scale)
  - Auto-scaling
  - Load balancing
  - Rolling updates

### Infrastructure as Code
- **Terraform** (Optional)
  - Cloud resource provisioning
  - Version-controlled infrastructure

### Monitoring & Logging
- **Prometheus** - Metrics collection
- **Grafana** - Visualization dashboards
- **Loki** - Log aggregation
- **Alertmanager** - Alert routing

### Reverse Proxy
- **Nginx**
  - Load balancing
  - SSL termination
  - Static file serving
  - Rate limiting

---

## Communication & Real-time

### WebSockets
- **Socket.IO**
  - Real-time messaging
  - Notifications
  - Live updates

### Email Service
- **Nodemailer**
  - Transactional emails
  - SMTP integration

### SMS Provider
- **Twilio** or Vietnamese provider (Stringee, eSMS)
  - OTP delivery
  - Notifications

---

## Testing

### Unit Testing
- **Jest** - Test runner
- **@nestjs/testing** - NestJS utilities

### Integration Testing
- **Supertest** - HTTP assertions
- **TestContainers** - Database testing

### E2E Testing
- **Playwright** - Browser automation
- Cross-browser testing

### Code Quality
- **ESLint** - Linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit checks

---

## Development Tools

### API Documentation
- **Swagger UI** - Interactive API docs
- **Redoc** - Alternative API docs viewer

### Database Management
- **pgAdmin** - PostgreSQL GUI
- **Redis Commander** - Redis GUI
- **Prisma Studio** (if using Prisma)

### Code Editor
- **VS Code** (recommended)
  - ESLint extension
  - Prettier extension
  - TypeScript support

---

## Security

### Best Practices
- **Helmet.js** - HTTP headers security
- **CORS** - Cross-origin configuration
- **Rate limiting** - DDoS protection
- **Input validation** - XSS prevention
- **SQL injection protection** - Parameterized queries
- **Secrets management** - Environment variables

### SSL/TLS
- **Let's Encrypt** - Free SSL certificates
- Automatic renewal

---

## Package Managers

- **pnpm** (recommended)
  - Fast & disk efficient
  - Strict dependency resolution
- **npm** or **yarn** (alternatives)

---

## Version Control

- **Git**
- **GitHub** - Repository hosting
- **Conventional Commits** - Commit message standard
- **Semantic Versioning** - Release versioning

---

## Why This Stack?

### Strengths
1. **Type Safety**: TypeScript across frontend & backend reduces bugs
2. **Scalability**: Modular NestJS architecture grows with your app
3. **Performance**: Next.js SSR + Redis caching = fast page loads
4. **Developer Experience**: Rich tooling, hot reload, auto-completion
5. **Vietnamese Market**: Payment gateways, SMS providers tailored for VN
6. **Cost-Effective**: Open-source stack, can self-host (MinIO, PostgreSQL)
7. **Production-Ready**: Battle-tested by large companies
8. **AI-Ready**: Easy LangChain + pgvector integration
9. **SEO-Optimized**: Next.js SSR perfect for real estate listings

### Trade-offs
- **Learning Curve**: NestJS requires understanding DI patterns
- **Bundle Size**: Feature-rich frameworks = larger bundles (mitigated by code splitting)
- **Hosting Costs**: Requires more resources than serverless (offset by control & cost predictability)

---

## Tech Stack Decision Summary

| Category | Technology | Rationale |
|----------|-----------|-----------|
| Frontend Framework | Next.js 14 | SSR for SEO, great DX, production-ready |
| Backend Framework | NestJS 10 | Enterprise patterns, TypeScript, scalable |
| Database | PostgreSQL 15 | Relational integrity, JSON support, geospatial |
| Cache | Redis 7 | Fast, versatile, queue management |
| Search | OpenSearch | Full-text + geo search (MVP3) |
| AI/LLM | OpenAI/Claude | Best Vietnamese language support |
| Payments | VNPAY, MoMo, ZaloPay | Vietnamese market dominance |
| Storage | MinIO/S3 | Cost-effective, S3-compatible |
| Testing | Jest, Playwright | Comprehensive test coverage |
| CI/CD | GitHub Actions | Free for open source, easy setup |

---

**Last Updated**: 2025-12-16
**Status**: Approved for implementation
