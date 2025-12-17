# Phase 1: MVP1 - Core Marketplace

> **Duration**: 8-10 weeks
> **Priority**: Critical
> **Status**: Pending
> **Dependencies**: Phase 0 Complete

## Context Links

- [Main Plan](./plan.md)
- [Phase 0: Infrastructure](./phase-00-infrastructure.md)
- [OpenAPI Spec](file:///C:/Users/Admin/Desktop/AI_Agent/sanBDS/codex/realestate-vietnam/backend/openapi.yaml)
- [Listings Service Reference](file:///C:/Users/Admin/Desktop/AI_Agent/sanBDS/codex/realestate-vietnam/backend/src/modules/listings/listings.service.ts)

---

## Overview

Build core marketplace features: user authentication, property listings, search, admin moderation, payments, and basic messaging. This phase delivers a functional real estate listing platform.

---

## Key Insights

1. Phone-first auth (OTP) standard for Vietnamese market - email as secondary
2. Vietnam has 63 provinces, ~700 districts, ~10,000 wards - hierarchical location
3. 8 property types defined in schema (apartment, house, villa, etc.)
4. Listing packages: Basic (free), Standard, Premium, VIP with different durations/features
5. Reference listings.service.ts provides complete CRUD with quality scoring

---

## Requirements

### Module 1.1: Authentication & User Management (Week 1-2)

**Functional:**
- Register with phone number (primary) or email
- OTP verification via SMS/email
- Password login (optional, OTP preferred)
- JWT access + refresh tokens
- User profile CRUD
- Identity verification (CCCD upload - future integration)
- User roles: buyer, seller, agent, admin, moderator

**API Endpoints:**
```
POST /auth/register          - Register new account
POST /auth/verify-otp        - Verify OTP
POST /auth/login             - Login (password or OTP)
POST /auth/refresh           - Refresh access token
POST /auth/logout            - Logout (invalidate refresh)
POST /auth/resend-otp        - Resend OTP
GET  /users/me               - Get current user
PATCH /users/me              - Update profile
POST /users/me/avatar        - Upload avatar
POST /users/me/verify-identity - Submit identity docs
```

**Database Tables:**
- users
- roles
- user_roles

### Module 1.2: Admin Units & Property Types (Week 2)

**Functional:**
- Seed Vietnam administrative units (63 provinces)
- Hierarchical location selection (province > district > ward)
- Property type management
- Location-based filtering

**API Endpoints:**
```
GET /admin-units                    - List provinces
GET /admin-units/:code              - Get unit details
GET /admin-units/:code/children     - Get districts/wards
GET /property-types                 - List property types
```

**Database Tables:**
- admin_units
- property_types

### Module 1.3: Listings CRUD (Week 2-4)

**Functional:**
- Create/edit/delete property listings
- Listing statuses: draft, pending, approved, rejected, expired, sold, rented
- Transaction types: sell, rent
- Property details: area, bedrooms, bathrooms, direction, price
- Location with coordinates (lat/lng)
- Media upload (up to 20 images, 1 video)
- Slug generation for SEO
- View/save/contact counters
- Quality score calculation
- Listing expiration (30-90 days based on package)

**API Endpoints:**
```
GET  /listings                      - List (public, filtered)
GET  /listings/featured             - Featured listings
GET  /listings/recent               - Recent listings
GET  /listings/my                   - User's listings
GET  /listings/:id                  - Detail (increment view)
GET  /listings/code/:code           - By code (BDS-HCM-240101)
POST /listings                      - Create listing
PATCH /listings/:id                 - Update listing
DELETE /listings/:id                - Delete listing
POST /listings/:id/submit           - Submit for approval
POST /listings/:id/media            - Upload media
DELETE /listings/:id/media/:mediaId - Delete media
POST /listings/:id/save             - Save listing
DELETE /listings/:id/save           - Unsave listing
```

**Database Tables:**
- listings
- listing_media
- favorites

### Module 1.4: Search & Filters (Week 4-5)

**Functional:**
- Basic PostgreSQL search (pg_trgm) - MVP1
- Filter by: transaction_type, property_type, location, price range, area range, bedrooms
- Sort by: newest, price_asc, price_desc, views, quality
- Pagination with total count
- Autocomplete suggestions (locations, keywords)
- Bounding box geospatial search (for map)

**API Endpoints:**
```
GET /search/listings     - Advanced search
GET /search/suggest      - Autocomplete suggestions
GET /search/aggregations - Filter counts (facets)
```

**Search Query Builder:**
```typescript
// PostgreSQL full-text search setup
CREATE INDEX idx_listings_search ON listings
USING gin(to_tsvector('simple', title || ' ' || coalesce(description, '')));

// Vietnamese trigram for fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_listings_title_trgm ON listings USING gin(title gin_trgm_ops);
```

### Module 1.5: Map Integration (Week 5)

**Functional:**
- Mapbox GL JS integration
- Property markers on map
- Cluster markers at zoom out
- Bounding box search
- Geocoding for address input
- Reverse geocoding for pin drop

**Frontend Components:**
- `MapView` - Main map component
- `PropertyMarker` - Custom marker with price
- `MapFilters` - Filter controls overlay
- `LocationPicker` - Address input with map picker

**Dependencies:**
```json
{
  "mapbox-gl": "^3.0.0",
  "react-map-gl": "^7.1.0"
}
```

### Module 1.6: Lead Management (Week 5-6)

**Functional:**
- Express interest in listing (creates lead)
- Lead statuses: new, contacted, viewing_scheduled, negotiating, converted, lost
- Priority levels: low, normal, high, urgent
- Notes history
- Messaging between buyer/seller

**API Endpoints:**
```
POST /listings/:id/interest   - Express interest (create lead)
GET  /leads                   - List leads (role-based)
GET  /leads/:id               - Lead detail
PATCH /leads/:id              - Update lead status/priority
POST /leads/:id/messages      - Send message
GET  /leads/:id/messages      - Get messages
POST /leads/:id/messages/read - Mark read
```

**Database Tables:**
- leads
- messages

### Module 1.7: Messaging/Inbox (Week 6)

**Functional:**
- In-app messaging linked to leads
- Real-time with WebSocket (Socket.IO)
- Read receipts
- Notification triggers

**WebSocket Events:**
```typescript
// Server -> Client
'message:new'        - New message received
'message:read'       - Message marked as read
'notification:new'   - New notification

// Client -> Server
'message:send'       - Send message
'message:markRead'   - Mark messages read
'typing:start'       - User started typing
'typing:stop'        - User stopped typing
```

**Frontend Components:**
- `InboxList` - Conversation list
- `ChatWindow` - Message thread
- `MessageBubble` - Individual message
- `NotificationBell` - Notification dropdown

### Module 1.8: Admin Moderation (Week 6-7)

**Functional:**
- Listing approval workflow
- Reject with reason
- User management (ban, verify)
- Report handling
- Dashboard statistics

**API Endpoints:**
```
GET  /admin/listings/pending     - Pending listings
POST /admin/listings/:id/approve - Approve listing
POST /admin/listings/:id/reject  - Reject with reason
POST /admin/listings/:id/feature - Mark as featured
GET  /admin/users                - User list
PATCH /admin/users/:id           - Update user status
GET  /admin/reports              - Violation reports
PATCH /admin/reports/:id         - Resolve report
GET  /admin/statistics           - Dashboard stats
```

**Admin Dashboard Pages:**
- `/admin/dashboard` - Statistics overview
- `/admin/listings` - Listing moderation
- `/admin/users` - User management
- `/admin/reports` - Report handling

### Module 1.9: Payments & Packages (Week 7-8)

**Functional:**
- Listing packages (Basic, Standard, Premium, VIP)
- Invoice generation
- Payment gateway integration (VNPAY primary)
- Payment status tracking
- Promo code support
- Refund handling

**Listing Packages:**
```typescript
const PACKAGES = {
  basic: { price: 0, duration: 30, maxPhotos: 6, featuredDays: 0 },
  standard: { price: 100000, duration: 30, maxPhotos: 12, featuredDays: 7 },
  premium: { price: 300000, duration: 45, maxPhotos: 20, featuredDays: 15 },
  vip: { price: 500000, duration: 60, maxPhotos: 30, featuredDays: 30 }
};
```

**API Endpoints:**
```
GET  /packages                   - List packages
GET  /invoices                   - User invoices
GET  /invoices/:id               - Invoice detail
POST /invoices                   - Create invoice
POST /invoices/:id/pay           - Initiate payment
GET  /payments/:id/status        - Payment status
POST /payments/webhook/vnpay     - VNPAY callback
POST /payments/webhook/momo      - MoMo callback
GET  /promo-codes/:code/validate - Validate promo
```

**VNPAY Integration:**
```typescript
// Payment flow
1. User selects package -> Create invoice
2. User clicks "Pay" -> Call /invoices/:id/pay with gateway=vnpay
3. Backend creates VNPAY URL with signature
4. Redirect user to VNPAY
5. User completes payment on VNPAY
6. VNPAY redirects to callback URL with result
7. Backend webhook validates signature, updates payment status
8. Activate listing package
```

**Database Tables:**
- listing_packages
- promo_codes
- invoices
- payments
- refunds

### Module 1.10: Notifications (Week 8)

**Functional:**
- In-app notifications
- Push notifications (future)
- Email notifications
- Notification preferences
- Read/unread status

**Notification Types:**
- `lead.new` - New lead on your listing
- `message.new` - New message received
- `listing.approved` - Listing approved
- `listing.rejected` - Listing rejected
- `listing.expiring` - Listing expiring soon
- `payment.success` - Payment successful
- `payment.failed` - Payment failed

**API Endpoints:**
```
GET   /notifications           - List notifications
PATCH /notifications/:id/read  - Mark as read
POST  /notifications/read-all  - Mark all as read
GET   /notifications/settings  - Get preferences
PATCH /notifications/settings  - Update preferences
```

**Database Tables:**
- notifications

---

## Architecture Decisions

### ADR-004: OTP Provider Strategy
- Development: Mock OTP (fixed code: 123456)
- Production: Twilio or Vietnamese provider (Stringee, eSMS)
- Rate limiting: 3 OTP requests per 5 minutes per phone

### ADR-005: File Upload Strategy
- Direct upload to MinIO/S3
- Generate presigned URL for client upload
- Validate file type (image/jpeg, image/png, video/mp4)
- Image optimization: Generate thumbnails (100x100, 400x300)
- Max file sizes: Image 5MB, Video 50MB

### ADR-006: Search Strategy (MVP1)
- PostgreSQL pg_trgm for fuzzy text search
- GIN index on title, description
- Composite index on filters (status, type, price)
- No OpenSearch until MVP3

### ADR-007: Caching Strategy
- Redis for session tokens
- Redis for OTP storage (TTL 5 min)
- Redis for frequently accessed data (property types, admin units)
- Cache invalidation on update

---

## Related Reference Files

| File | Purpose |
|------|---------|
| `backend/src/modules/listings/listings.service.ts` | Complete listings CRUD |
| `backend/src/modules/deals/deals.service.ts` | Lead management reference |
| `backend/src/modules/payments/payment.service.ts` | Payment gateway integration |
| `backend/src/modules/notifications/notification.service.ts` | Notification service |
| `backend/openapi.yaml` | Full API specification |
| `frontend/pages/ListingDetail.jsx` | Listing detail page |
| `frontend/pages/SellerDashboard.jsx` | Seller dashboard |

---

## Implementation Steps

### Week 1-2: Authentication

1. **Auth Module Setup**
   - Create `apps/backend/src/modules/auth/`
   - Implement JWT strategy (Passport.js)
   - Create OTP service (mock for dev)
   - Implement rate limiting (throttler)

2. **User Module Setup**
   - Create `apps/backend/src/modules/users/`
   - User CRUD operations
   - Profile management
   - Avatar upload

3. **Frontend Auth**
   - Login/Register pages
   - OTP verification flow
   - Protected routes (middleware)
   - Auth store (Zustand)

### Week 2-4: Listings

4. **Admin Units & Property Types**
   - Seed data migration
   - API endpoints
   - Frontend selectors

5. **Listings Module**
   - Create `apps/backend/src/modules/listings/`
   - CRUD operations
   - Status management
   - Quality score calculation

6. **Media Upload**
   - S3 presigned URL generation
   - Image thumbnail generation
   - Media management

7. **Frontend Listings**
   - Create listing form (multi-step)
   - Listing detail page
   - My listings dashboard
   - Edit listing

### Week 4-5: Search & Map

8. **Search Module**
   - PostgreSQL full-text search
   - Filter query builder
   - Pagination
   - Aggregations

9. **Map Integration**
   - Mapbox setup
   - Map view component
   - Property markers
   - Location picker

### Week 5-6: Leads & Messaging

10. **Leads Module**
    - Create lead from listing interest
    - Lead status management
    - Notes history

11. **Messaging**
    - WebSocket gateway (Socket.IO)
    - Message storage
    - Real-time updates

12. **Frontend Inbox**
    - Conversation list
    - Chat interface
    - Real-time updates

### Week 6-7: Admin

13. **Admin Module**
    - Listing moderation
    - User management
    - Statistics

14. **Admin Frontend**
    - Admin dashboard
    - Moderation queue
    - User management

### Week 7-8: Payments

15. **Packages & Invoices**
    - Package definitions
    - Invoice generation
    - Promo codes

16. **Payment Gateway**
    - VNPAY integration
    - Webhook handling
    - Payment status

17. **Frontend Payments**
    - Package selection
    - Payment flow
    - Invoice history

### Week 8: Notifications & Polish

18. **Notifications**
    - Notification service
    - Event handlers
    - Preferences

19. **Testing & Polish**
    - Integration tests
    - E2E tests (critical paths)
    - Bug fixes
    - Performance optimization

---

## Todo List

### Authentication
- [ ] Create auth module with JWT strategy
- [ ] Implement OTP service (mock + real provider)
- [ ] Create user module with profile management
- [ ] Implement role-based access control (RBAC)
- [ ] Add rate limiting for auth endpoints
- [ ] Frontend: Login/Register pages
- [ ] Frontend: OTP verification flow
- [ ] Frontend: Protected route middleware

### Listings
- [ ] Seed admin units (Vietnam provinces/districts)
- [ ] Seed property types
- [ ] Create listings module
- [ ] Implement listing CRUD
- [ ] Add media upload (S3 presigned URLs)
- [ ] Implement quality score calculation
- [ ] Add listing code generation
- [ ] Frontend: Create listing form (multi-step)
- [ ] Frontend: Listing detail page
- [ ] Frontend: My listings dashboard

### Search
- [ ] Setup PostgreSQL full-text search
- [ ] Implement filter query builder
- [ ] Add pagination with total count
- [ ] Create autocomplete suggestions
- [ ] Frontend: Search page with filters
- [ ] Frontend: Results grid/list view

### Map
- [ ] Setup Mapbox integration
- [ ] Create map view component
- [ ] Implement property markers with clustering
- [ ] Add bounding box search
- [ ] Frontend: Location picker for listings

### Leads & Messaging
- [ ] Create leads module
- [ ] Implement lead status workflow
- [ ] Setup WebSocket gateway
- [ ] Create messaging service
- [ ] Frontend: Inbox page
- [ ] Frontend: Chat interface

### Admin
- [ ] Create admin module
- [ ] Implement listing moderation
- [ ] Add user management
- [ ] Create statistics endpoints
- [ ] Frontend: Admin dashboard
- [ ] Frontend: Moderation queue

### Payments
- [ ] Define listing packages
- [ ] Create invoice service
- [ ] Integrate VNPAY gateway
- [ ] Handle webhooks
- [ ] Frontend: Package selection
- [ ] Frontend: Payment flow

### Notifications
- [ ] Create notification service
- [ ] Setup event handlers
- [ ] Implement preferences
- [ ] Frontend: Notification bell
- [ ] Frontend: Notification settings

---

## Success Criteria

1. **Auth**: User can register with phone, verify OTP, login
2. **Listings**: User can create, edit, submit listing for approval
3. **Search**: User can search by location, price, property type
4. **Map**: Properties displayed on map with markers
5. **Leads**: Buyer can express interest, seller receives notification
6. **Messaging**: Buyer and seller can chat in-app
7. **Admin**: Moderator can approve/reject listings
8. **Payments**: User can purchase listing package via VNPAY
9. **Notifications**: Users receive relevant notifications

**Performance Targets:**
- API response time < 200ms (p95)
- Search results < 500ms
- Page load < 3s (LCP)
- Map renders < 2s

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| VNPAY sandbox unavailable | High | Medium | Use mock payment for dev, defer real integration |
| OTP provider rate limits | Medium | High | Implement exponential backoff, cache OTPs |
| Vietnamese search accuracy | Medium | Medium | Use pg_trgm, defer OpenSearch to MVP3 |
| Large image uploads slow | Medium | Medium | Use presigned URLs, optimize on upload |
| WebSocket scaling | Low | Low | Use Redis adapter, scale horizontally later |

---

## Security Considerations

1. **Authentication**
   - Hash passwords with bcrypt (rounds: 12)
   - JWT short expiry (15min), refresh token (30d)
   - Rate limit OTP requests (3 per 5 min)
   - Invalidate tokens on password change

2. **Authorization**
   - RBAC with guards
   - Resource ownership checks
   - Admin routes protected

3. **Input Validation**
   - class-validator DTOs
   - Sanitize HTML in descriptions
   - Validate file types on upload

4. **Payment Security**
   - Verify VNPAY signature on callback
   - Idempotency keys for payments
   - Secure webhook endpoints

5. **Data Protection**
   - Never expose password hashes
   - Limit personal info in public APIs
   - Log access to sensitive data

---

## Next Steps

After completing MVP1:
1. Proceed to [Phase 2: MVP2 Deal Workflow](./phase-02-mvp2-deal-workflow.md)
2. Begin with deal stage management
3. Implement viewing scheduler
