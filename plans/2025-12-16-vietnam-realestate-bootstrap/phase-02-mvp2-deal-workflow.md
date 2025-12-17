# Phase 2: MVP2 - Deal Workflow & Legal

> **Duration**: 6-8 weeks
> **Priority**: High
> **Status**: Pending
> **Dependencies**: Phase 1 (MVP1) Complete

## Context Links

- [Main Plan](./plan.md)
- [Phase 1: MVP1](./phase-01-mvp1-marketplace.md)
- [Deals Service Reference](file:///C:/Users/Admin/Desktop/AI_Agent/sanBDS/codex/realestate-vietnam/backend/src/modules/deals/deals.service.ts)
- [Contract Template (Deposit)](file:///C:/Users/Admin/Desktop/AI_Agent/sanBDS/codex/realestate-vietnam/contracts/hop-dong-dat-coc.md)

---

## Overview

Implement complete deal transaction workflow from lead conversion to closing. Includes viewing scheduler, deposit management, contract templates with variable filling, and OTP-based e-signature. Transforms marketplace into full transaction platform.

---

## Key Insights

1. 8-stage deal workflow maps to Vietnamese real estate transaction process
2. Contract templates use variable substitution ({{buyer_name}}, {{property_address}})
3. Reference provides complete deal stage transition validation
4. OTP-based e-signature sufficient for MVP2, digital signature in MVP3
5. Deposits require careful tracking due to legal implications

---

## Requirements

### Module 2.1: Deal Workflow Engine (Week 1-2)

**8 Deal Stages:**
```
1. INITIATED      - Deal created from lead
2. VIEWING_SCHEDULED - Property viewing scheduled
3. NEGOTIATING    - Price/terms negotiation
4. DEPOSIT_PENDING - Waiting for deposit
5. DEPOSIT_PAID   - Deposit received
6. CONTRACT_DRAFTING - Contract being prepared
7. CONTRACT_SIGNING - Awaiting signatures
8. COMPLETED      - Deal closed successfully
```

**Additional States:**
- `CANCELLED` - Deal cancelled (from any stage)
- Each transition requires validation and can include notes

**Stage Transition Rules:**
```typescript
const VALID_TRANSITIONS = {
  INITIATED: ['VIEWING_SCHEDULED', 'CANCELLED'],
  VIEWING_SCHEDULED: ['NEGOTIATING', 'CANCELLED'],
  NEGOTIATING: ['DEPOSIT_PENDING', 'CANCELLED'],
  DEPOSIT_PENDING: ['DEPOSIT_PAID', 'CANCELLED'],
  DEPOSIT_PAID: ['CONTRACT_DRAFTING', 'CANCELLED'],
  CONTRACT_DRAFTING: ['CONTRACT_SIGNING', 'CANCELLED'],
  CONTRACT_SIGNING: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: []
};
```

**API Endpoints:**
```
POST /deals                     - Create deal (from lead)
GET  /deals                     - List deals (role-filtered)
GET  /deals/:id                 - Deal detail with history
PATCH /deals/:id                - Update deal details
POST /deals/:id/transition      - Change stage
GET  /deals/:id/timeline        - Stage history timeline
GET  /deals/statistics          - Deal statistics
```

**Database Tables:**
- deals
- deal_events

### Module 2.2: Viewing Scheduler (Week 2-3)

**Functional:**
- Schedule property viewings within a deal
- Calendar integration (client-side)
- Viewing status: scheduled, completed, cancelled, no_show
- Feedback and rating after viewing
- Reminder notifications

**API Endpoints:**
```
POST /deals/:id/viewings            - Schedule viewing
GET  /deals/:id/viewings            - List viewings for deal
PATCH /viewings/:id                 - Update viewing
POST /viewings/:id/feedback         - Submit feedback
GET  /calendar/viewings             - User's viewing calendar
```

**Viewing Data:**
```typescript
interface Viewing {
  id: string;
  deal_id: string;
  scheduled_at: Date;
  duration_minutes: number;  // default 60
  location_note?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  feedback?: string;
  rating?: number;  // 1-5
  created_at: Date;
}
```

**Frontend Components:**
- `ViewingScheduler` - Date/time picker with availability
- `ViewingCalendar` - Monthly calendar view
- `ViewingCard` - Viewing summary card
- `FeedbackForm` - Post-viewing feedback

**Database Tables:**
- viewings

### Module 2.3: Deposit Management (Week 3-4)

**Functional:**
- Create deposit request with amount and terms
- Track deposit status: pending, paid, refunded, forfeited
- Payment integration (linked to invoice)
- Deposit receipt generation
- Escrow tracking (future)

**Deposit Flow:**
```
1. Seller creates deposit request (amount, terms, due date)
2. System creates invoice
3. Buyer pays via payment gateway
4. System updates deposit status
5. Deal transitions to DEPOSIT_PAID
6. Generate deposit receipt
```

**API Endpoints:**
```
POST /deals/:id/deposits            - Create deposit request
GET  /deals/:id/deposits            - List deposits
PATCH /deposits/:id                 - Update deposit
POST /deposits/:id/confirm          - Confirm deposit received
POST /deposits/:id/refund           - Process refund
GET  /deposits/:id/receipt          - Generate receipt PDF
```

**Deposit Terms (Vietnamese Standard):**
```typescript
interface Deposit {
  id: string;
  deal_id: string;
  amount: number;
  terms: string;
  due_at: Date;
  status: 'pending' | 'paid' | 'refunded' | 'forfeited';
  payment_id?: string;
  paid_at?: Date;
  receipt_url?: string;
}
```

**Database Tables:**
- deposits

### Module 2.4: Contract Template Library (Week 4-5)

**Contract Types:**
1. **Hop Dong Dat Coc** (Deposit Agreement)
2. **Hop Dong Mua Ban** (Sale Contract)
3. **Hop Dong Thue Nha** (Rental Contract)
4. **Bien Ban Ban Giao** (Handover Minutes)
5. **Uy Quyen** (Power of Attorney) - optional

**Template Variables:**
```typescript
// Common variables
const COMMON_VARS = {
  contract_number: 'Auto-generated',
  contract_date: 'Date of signing',
  contract_location: 'Signing location',

  // Buyer
  buyer_name: 'Full legal name',
  buyer_dob: 'Date of birth',
  buyer_id_number: 'CCCD/CMND number',
  buyer_id_date: 'ID issue date',
  buyer_id_place: 'ID issue place',
  buyer_address: 'Permanent address',
  buyer_phone: 'Phone number',

  // Seller
  seller_name: 'Full legal name',
  seller_dob: 'Date of birth',
  seller_id_number: 'CCCD/CMND',
  // ... same fields

  // Property
  property_type: 'Property type',
  property_address: 'Full address',
  land_area: 'Land area m2',
  floor_area: 'Floor area m2',
  legal_document: 'Ownership doc type',
  legal_document_number: 'Doc number',

  // Transaction
  total_price: 'Total price VND',
  deposit_amount: 'Deposit amount VND'
};
```

**API Endpoints:**
```
GET  /contract-templates                    - List templates
GET  /contract-templates/:id                - Template detail with variables
GET  /contract-templates/:id/preview        - Preview with sample data
POST /contract-templates/:id/validate       - Validate variables
```

**Database Tables:**
- contract_templates

### Module 2.5: Contract Wizard & Generation (Week 5-6)

**Functional:**
- Step-by-step variable filling
- Auto-fill from deal/user data
- Preview before generation
- PDF generation from HTML template
- Version control for contracts
- Document hash for integrity

**API Endpoints:**
```
POST /legal-documents/generate              - Generate from template
GET  /legal-documents/:id                   - Document detail
GET  /legal-documents/:id/preview           - HTML preview
GET  /legal-documents/:id/pdf               - Download PDF
PATCH /legal-documents/:id                  - Update (if draft)
GET  /deals/:id/documents                   - List deal documents
```

**Generation Flow:**
```
1. Select template based on deal type
2. Auto-populate from deal + user data
3. User fills remaining variables
4. Validate all required fields
5. Generate HTML from template
6. Convert to PDF (puppeteer)
7. Calculate SHA256 hash
8. Store document with metadata
```

**Legal Document Status:**
```typescript
enum DocumentStatus {
  DRAFT = 'draft',           // Being edited
  PENDING_REVIEW = 'pending_review',  // Submitted for review
  APPROVED = 'approved',     // Ready for signing
  SIGNING = 'signing',       // Signature in progress
  SIGNED = 'signed',         // All parties signed
  REJECTED = 'rejected'      // Rejected, needs revision
}
```

**Database Tables:**
- legal_documents

### Module 2.6: E-Signature (OTP-based MVP2) (Week 6-7)

**Functional:**
- Create signature request for document
- Multiple signers with order
- OTP verification for each signer
- Signature image upload (optional)
- Timestamp and IP logging
- Signed document generation

**Signature Flow:**
```
1. Document owner creates signature request
2. System sends notification to signers
3. Signer reviews document
4. Signer requests OTP (sent to verified phone)
5. Signer enters OTP + optional signature image
6. System validates OTP
7. System records signature with metadata
8. If all signed, mark document complete
9. Generate signed PDF with signature marks
```

**API Endpoints:**
```
POST /signature-requests                    - Create request
GET  /signature-requests/:id                - Request detail
GET  /signature-requests/pending            - Pending signatures
POST /signature-requests/:id/sign           - Sign with OTP
POST /signature-requests/:id/request-otp    - Request signing OTP
POST /signature-requests/:id/reject         - Reject signing
GET  /signature-requests/:id/status         - Signing status
```

**Signature Party Data:**
```typescript
interface SignatureParty {
  id: string;
  request_id: string;
  user_id: string;
  role: 'buyer' | 'seller' | 'witness' | 'agent';
  order_index: number;
  status: 'pending' | 'signed' | 'rejected';
  signed_at?: Date;
  signature_method: 'otp';
  signature_image_url?: string;
  signature_meta: {
    ip_address: string;
    user_agent: string;
    otp_verified_at: Date;
  };
}
```

**Database Tables:**
- signature_requests
- signature_parties

### Module 2.7: PDF Generation Service (Week 7)

**Functional:**
- Convert HTML contracts to PDF
- Embed signature images
- Page numbering
- Watermarks (draft vs signed)
- QR code with verification link
- Document hash in footer

**Implementation:**
```typescript
// Using Puppeteer for HTML -> PDF
import puppeteer from 'puppeteer';

async function generatePDF(html: string, options: PDFOptions): Promise<Buffer> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `
      <div style="font-size:10px; width:100%; text-align:center;">
        Trang <span class="pageNumber"></span>/<span class="totalPages"></span>
        | Hash: ${options.documentHash}
      </div>
    `
  });

  await browser.close();
  return pdf;
}
```

**Dependencies:**
```json
{
  "puppeteer": "^21.6.0",
  "qrcode": "^1.5.0"
}
```

### Module 2.8: Deal Events & Timeline (Week 7-8)

**Functional:**
- Track all deal activities
- Stage transitions
- Document uploads
- Messages
- Viewing records
- Payment events

**Event Types:**
```typescript
enum DealEventType {
  STAGE_CHANGED = 'stage_changed',
  VIEWING_SCHEDULED = 'viewing_scheduled',
  VIEWING_COMPLETED = 'viewing_completed',
  DEPOSIT_REQUESTED = 'deposit_requested',
  DEPOSIT_PAID = 'deposit_paid',
  DOCUMENT_CREATED = 'document_created',
  SIGNATURE_REQUESTED = 'signature_requested',
  SIGNATURE_COMPLETED = 'signature_completed',
  MESSAGE_SENT = 'message_sent',
  NOTE_ADDED = 'note_added'
}
```

**Timeline API:**
```
GET /deals/:id/timeline         - Full timeline
GET /deals/:id/events           - Paginated events
```

---

## Architecture Decisions

### ADR-008: Contract Template Format
- Store templates as HTML with Handlebars syntax
- Variables use {{variable_name}} format
- Support Vietnamese language fully
- Store both HTML and Markdown versions

### ADR-009: PDF Generation
- Server-side generation with Puppeteer
- Async job for large documents
- Cache generated PDFs in S3
- Regenerate on variable changes

### ADR-010: Signature Legal Validity
- OTP-based signature valid for internal transactions
- Log all signature metadata for audit
- Consider qualified digital signature for MVP3 (Vietnam CA)

### ADR-011: Stage Machine Pattern
- Use state machine library (xstate or custom)
- Validate transitions server-side
- Record all transitions with actor and timestamp

---

## Related Reference Files

| File | Purpose |
|------|---------|
| `backend/src/modules/deals/deals.service.ts` | Deal service with stage management |
| `contracts/hop-dong-dat-coc.md` | Deposit contract template |
| `contracts/hop-dong-mua-ban.md` | Sale contract template |
| `contracts/hop-dong-thue-nha.md` | Rental contract template |
| `backend/src/modules/legal/legal.service.ts` | Legal document service |

---

## Implementation Steps

### Week 1-2: Deal Workflow

1. **Deal Module Setup**
   - Create `apps/backend/src/modules/deals/`
   - Implement deal entity and DTOs
   - Create stage transition logic
   - Add validation guards

2. **Deal Events**
   - Create deal_events table
   - Implement event recording
   - Build timeline endpoint

3. **Frontend Deal Management**
   - Deal list page (by role)
   - Deal detail page
   - Stage transition UI
   - Timeline component

### Week 2-3: Viewing Scheduler

4. **Viewing Module**
   - Create viewing entity
   - Implement scheduling logic
   - Add notification triggers

5. **Frontend Calendar**
   - Viewing scheduler component
   - Calendar view
   - Feedback form

### Week 3-4: Deposit Management

6. **Deposit Module**
   - Create deposit entity
   - Link to payment system
   - Implement status tracking

7. **Frontend Deposits**
   - Deposit request form
   - Payment flow integration
   - Receipt display

### Week 4-5: Contract Templates

8. **Template Module**
   - Create template entity
   - Implement variable extraction
   - Build template preview

9. **Template Management**
   - Seed Vietnamese contract templates
   - Variable validation

### Week 5-6: Contract Wizard

10. **Document Generation**
    - HTML template engine
    - Variable substitution
    - Auto-fill logic

11. **Frontend Wizard**
    - Step-by-step form
    - Preview modal
    - Variable editor

### Week 6-7: E-Signature

12. **Signature Module**
    - Signature request entity
    - OTP integration
    - Signing flow

13. **Frontend Signing**
    - Signature request page
    - OTP verification
    - Signature pad (optional)

### Week 7-8: PDF & Polish

14. **PDF Service**
    - Puppeteer setup
    - PDF generation
    - Signature embedding

15. **Testing & Polish**
    - Integration tests
    - E2E signing flow
    - Bug fixes

---

## Todo List

### Deal Workflow
- [ ] Create deals module with entities
- [ ] Implement stage transition validation
- [ ] Create deal events tracking
- [ ] Build timeline endpoint
- [ ] Frontend: Deal list page
- [ ] Frontend: Deal detail with timeline
- [ ] Frontend: Stage transition UI

### Viewing Scheduler
- [ ] Create viewings module
- [ ] Implement scheduling logic
- [ ] Add reminder notifications
- [ ] Frontend: Viewing scheduler
- [ ] Frontend: Calendar view
- [ ] Frontend: Feedback form

### Deposit Management
- [ ] Create deposits module
- [ ] Link to payment system
- [ ] Implement receipt generation
- [ ] Frontend: Deposit request form
- [ ] Frontend: Payment integration
- [ ] Frontend: Receipt download

### Contract Templates
- [ ] Create contract_templates entity
- [ ] Seed Vietnamese templates (deposit, sale, rental)
- [ ] Implement variable extraction
- [ ] Build template preview
- [ ] Frontend: Template browser

### Contract Generation
- [ ] Build HTML template engine
- [ ] Implement auto-fill logic
- [ ] Create document generation service
- [ ] Frontend: Contract wizard
- [ ] Frontend: Variable editor
- [ ] Frontend: Preview modal

### E-Signature
- [ ] Create signature module
- [ ] Implement OTP signing flow
- [ ] Add signature image support
- [ ] Build audit logging
- [ ] Frontend: Signature request page
- [ ] Frontend: OTP verification
- [ ] Frontend: Signature pad

### PDF Generation
- [ ] Setup Puppeteer service
- [ ] Implement PDF generation
- [ ] Add watermarks and QR codes
- [ ] Embed signatures in PDF
- [ ] Generate hash verification

---

## Success Criteria

1. **Deals**: Create deal from lead, progress through stages
2. **Viewings**: Schedule viewing, complete with feedback
3. **Deposits**: Create deposit request, process payment
4. **Templates**: View and select contract templates
5. **Wizard**: Fill contract variables, preview contract
6. **Signature**: Sign document with OTP verification
7. **PDF**: Download signed contract as PDF
8. **Timeline**: View complete deal history

**Performance Targets:**
- Stage transition < 500ms
- PDF generation < 5s
- Signature verification < 1s

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| PDF generation memory issues | High | Medium | Use worker threads, limit concurrent |
| OTP delivery delays | Medium | Medium | Retry logic, fallback to email |
| Contract template errors | High | Low | Extensive testing, preview validation |
| Signature legal questions | Medium | Medium | Add disclaimer, document audit trail |
| Complex state transitions | Medium | Medium | Use state machine library |

---

## Security Considerations

1. **Document Security**
   - Hash all documents (SHA256)
   - Store original and signed versions
   - Encrypt sensitive fields in database
   - Audit all document access

2. **Signature Security**
   - Short OTP expiry (5 min)
   - Rate limit OTP requests
   - Log IP and user agent
   - Prevent replay attacks

3. **Access Control**
   - Only deal parties can access documents
   - Stage-based permissions
   - Audit all transitions

4. **Data Privacy**
   - Mask personal info in logs
   - Secure file storage (S3 encryption)
   - GDPR-like data handling

---

## Next Steps

After completing MVP2:
1. Proceed to [Phase 3: MVP3 Advanced Features](./phase-03-mvp3-advanced.md)
2. Begin with AI Assistant integration
3. Implement OpenSearch for advanced search
