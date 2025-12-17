# Phase 3: MVP3 - Advanced Features

> **Duration**: 6-8 weeks
> **Priority**: Medium
> **Status**: Pending
> **Dependencies**: Phase 2 (MVP2) Complete

## Context Links

- [Main Plan](./plan.md)
- [Phase 2: MVP2](./phase-02-mvp2-deal-workflow.md)
- [AI Service Reference](file:///C:/Users/Admin/Desktop/AI_Agent/sanBDS/codex/realestate-vietnam/backend/src/modules/ai/ai.service.ts)
- [Search Service Reference](file:///C:/Users/Admin/Desktop/AI_Agent/sanBDS/codex/realestate-vietnam/backend/src/modules/search/search.service.ts)

---

## Overview

Add intelligent features: AI-powered assistant with RAG for legal/property advice, OpenSearch for advanced full-text and geospatial search, digital signature integration, commission system for agents, and comprehensive analytics. Transforms platform into intelligent real estate ecosystem.

---

## Key Insights

1. RAG (Retrieval Augmented Generation) optimal for domain-specific Q&A
2. OpenSearch provides Vietnamese analyzer and geospatial queries
3. pgvector enables vector search within PostgreSQL
4. Commission rules vary by transaction type and price range
5. Analytics crucial for business insights and agent performance

---

## Requirements

### Module 3.1: AI Assistant with RAG (Week 1-3)

**AI Capabilities:**
1. **Property Advisor**: Analyze listings, suggest improvements, price recommendations
2. **Legal Advisor**: Answer legal questions from knowledge base
3. **Market Insights**: Provide area statistics, market trends
4. **Contract Assistant**: Help fill contract variables, explain terms

**RAG Architecture:**
```
User Query
    |
    v
[Query Embedding] --> [Vector Search] --> [Knowledge Base]
    |                       |
    |                       v
    |               [Relevant Chunks]
    |                       |
    v                       v
[LLM (GPT-4/Claude)] <-- [Context + Query]
    |
    v
[Response]
```

**Knowledge Base Sources:**
- Vietnamese real estate law documents
- Contract explanations
- Property buying guides
- Tax and fee information
- Notarization procedures
- District/area information

**API Endpoints:**
```
POST /ai/chat                      - Chat with AI assistant
POST /ai/listing-analyze           - Analyze listing quality
POST /ai/price-estimate            - Estimate property price
POST /ai/legal-advice              - Legal Q&A
GET  /ai/conversations             - User's chat history
GET  /ai/conversations/:id         - Conversation detail
POST /ai/feedback                  - Rate AI response
```

**Chat Request:**
```typescript
interface ChatRequest {
  message: string;
  session_id?: string;
  context?: {
    listing_id?: string;
    deal_id?: string;
    intent?: 'general' | 'legal' | 'property' | 'market';
  };
}

interface ChatResponse {
  message: string;
  intent: string;
  suggestions: string[];
  sources?: { title: string; relevance: number }[];
  session_id: string;
}
```

**Database Tables:**
- kb_articles (knowledge base)
- kb_chunks (text chunks with embeddings)
- ai_conversations

### Module 3.2: Knowledge Base Management (Week 2)

**Functional:**
- CRUD for knowledge base articles
- Automatic chunking and embedding
- Category and tag management
- Version control
- Search within KB

**Article Categories:**
- `legal` - Laws, regulations, procedures
- `guide` - Buying/selling guides
- `market` - Market information
- `contract` - Contract explanations
- `tax` - Tax and fees
- `area` - District information

**API Endpoints:**
```
GET  /kb/articles                  - List articles
GET  /kb/articles/:id              - Article detail
POST /kb/articles                  - Create article
PATCH /kb/articles/:id             - Update article
DELETE /kb/articles/:id            - Delete article
POST /kb/articles/:id/publish      - Publish article
POST /kb/articles/embed            - Re-embed all articles
GET  /kb/search                    - Search KB
```

**Embedding Pipeline:**
```typescript
async function processArticle(article: KbArticle): Promise<void> {
  // 1. Chunk article into segments (500-1000 tokens)
  const chunks = chunkText(article.content, 800);

  // 2. Generate embeddings for each chunk
  for (const [index, chunk] of chunks.entries()) {
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: chunk
    });

    // 3. Store chunk with embedding in pgvector
    await db.query(`
      INSERT INTO kb_chunks (article_id, chunk_index, chunk_text, embedding)
      VALUES ($1, $2, $3, $4)
    `, [article.id, index, chunk, embedding.data[0].embedding]);
  }
}
```

### Module 3.3: OpenSearch Integration (Week 3-4)

**Functional:**
- Full-text search with Vietnamese analyzer
- Geospatial search (bounding box, radius)
- Faceted search (aggregations)
- Autocomplete suggestions
- Search analytics

**OpenSearch Index Mapping:**
```json
{
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "title": {
        "type": "text",
        "analyzer": "vietnamese",
        "fields": {
          "keyword": { "type": "keyword" },
          "suggest": { "type": "completion" }
        }
      },
      "description": { "type": "text", "analyzer": "vietnamese" },
      "transaction_type": { "type": "keyword" },
      "property_type": { "type": "keyword" },
      "status": { "type": "keyword" },
      "price": { "type": "long" },
      "area_land": { "type": "float" },
      "area_floor": { "type": "float" },
      "bedrooms": { "type": "integer" },
      "bathrooms": { "type": "integer" },
      "province_code": { "type": "keyword" },
      "district_code": { "type": "keyword" },
      "location": { "type": "geo_point" },
      "amenities": { "type": "keyword" },
      "created_at": { "type": "date" },
      "quality_score": { "type": "float" }
    }
  }
}
```

**Vietnamese Analyzer:**
```json
{
  "settings": {
    "analysis": {
      "analyzer": {
        "vietnamese": {
          "type": "custom",
          "tokenizer": "icu_tokenizer",
          "filter": ["lowercase", "icu_folding", "vietnamese_stop"]
        }
      },
      "filter": {
        "vietnamese_stop": {
          "type": "stop",
          "stopwords": ["la", "va", "cua", "cho", "trong", "voi", "den", "tu"]
        }
      }
    }
  }
}
```

**API Endpoints:**
```
GET /search/listings              - Advanced search
GET /search/suggest               - Autocomplete
GET /search/geo                   - Geospatial search
GET /search/aggregations          - Facets/filters
GET /search/similar/:id           - Similar listings
```

**Search Query Builder:**
```typescript
function buildSearchQuery(filters: SearchFilters): object {
  const must = [];
  const filter = [];

  // Full-text search
  if (filters.q) {
    must.push({
      multi_match: {
        query: filters.q,
        fields: ['title^3', 'description', 'address'],
        fuzziness: 'AUTO'
      }
    });
  }

  // Filters
  if (filters.transaction_type) {
    filter.push({ term: { transaction_type: filters.transaction_type } });
  }
  if (filters.property_type) {
    filter.push({ term: { property_type: filters.property_type } });
  }
  if (filters.price_min || filters.price_max) {
    filter.push({
      range: {
        price: {
          gte: filters.price_min,
          lte: filters.price_max
        }
      }
    });
  }

  // Geo bounding box
  if (filters.bounds) {
    filter.push({
      geo_bounding_box: {
        location: {
          top_left: { lat: filters.bounds.ne_lat, lon: filters.bounds.sw_lng },
          bottom_right: { lat: filters.bounds.sw_lat, lon: filters.bounds.ne_lng }
        }
      }
    });
  }

  return {
    query: {
      bool: { must, filter }
    },
    aggs: {
      by_property_type: { terms: { field: 'property_type' } },
      by_province: { terms: { field: 'province_code' } },
      price_ranges: {
        range: {
          field: 'price',
          ranges: [
            { to: 1000000000 },
            { from: 1000000000, to: 3000000000 },
            { from: 3000000000, to: 5000000000 },
            { from: 5000000000 }
          ]
        }
      }
    }
  };
}
```

### Module 3.4: Enhanced E-Signature (Week 4-5)

**Digital Signature Options:**
1. **OTP Signature** (existing MVP2)
2. **Digital Certificate** (Vietnam CA integration)
3. **Biometric Signature** (future - FPT.AI integration)

**Vietnam CA Integration:**
- VNPT-CA or Viettel-CA
- USB token or remote signing
- PKI-based signature
- Legal validity for real estate transactions

**API Additions:**
```
GET  /signature/methods            - Available signing methods
POST /signature/:id/sign-digital   - Sign with digital certificate
POST /signature/:id/verify         - Verify signature validity
GET  /signature/:id/certificate    - Get signing certificate info
```

**Digital Signature Flow:**
```
1. User selects digital signature method
2. System prepares hash of document
3. User connects certificate (USB token or remote)
4. User authenticates with certificate PIN
5. Certificate signs document hash
6. System verifies signature
7. Embed signature in PDF
8. Store signature certificate info
```

### Module 3.5: Commission System (Week 5-6)

**Commission Rules:**
- Variable rates by transaction type and price range
- Platform fee + agent commission
- Referral bonus (optional)
- Agent performance tiers

**Commission Structure:**
```typescript
interface CommissionRule {
  id: string;
  name: string;
  scope: {
    transaction_type?: 'sell' | 'rent';
    property_types?: string[];
    price_min?: number;
    price_max?: number;
  };
  platform_percent: number;  // Platform takes
  agent_percent: number;     // Agent earns
  referral_percent: number;  // Referral bonus
  effective_from: Date;
  effective_to?: Date;
}

// Default rules
const COMMISSION_RULES = [
  {
    name: 'Standard Sale',
    scope: { transaction_type: 'sell', price_max: 10_000_000_000 },
    platform_percent: 1.0,
    agent_percent: 1.5,
    referral_percent: 0.5
  },
  {
    name: 'Premium Sale (>10B)',
    scope: { transaction_type: 'sell', price_min: 10_000_000_000 },
    platform_percent: 0.8,
    agent_percent: 1.2,
    referral_percent: 0.5
  },
  {
    name: 'Rental',
    scope: { transaction_type: 'rent' },
    platform_percent: 50,  // % of first month
    agent_percent: 50,
    referral_percent: 0
  }
];
```

**API Endpoints:**
```
GET  /commission-rules                      - List rules
POST /commission-rules                      - Create rule (admin)
PATCH /commission-rules/:id                 - Update rule
POST /deals/:id/calculate-commission        - Calculate commission
GET  /commissions                           - List commissions (agent)
GET  /commissions/:id                       - Commission detail
POST /commissions/:id/payout                - Process payout (admin)
GET  /agents/:id/earnings                   - Agent earnings summary
```

**Database Tables:**
- commission_rules
- commissions

### Module 3.6: Agent Management (Week 6)

**Agent Features:**
- Agent profile with specializations
- Performance metrics
- Rating and reviews
- Service areas
- Listing assignment
- Commission tracking

**Agent Profile:**
```typescript
interface AgentProfile {
  id: string;
  user_id: string;
  license_number?: string;
  company_name?: string;
  experience_years: number;
  specializations: string[];  // ['apartment', 'villa', ...]
  service_areas: string[];    // Province codes
  commission_rate: number;    // Override rate if any
  total_listings: number;
  total_deals: number;
  rating_avg: number;
  status: 'pending' | 'active' | 'suspended';
}
```

**API Endpoints:**
```
POST /agents/register              - Register as agent
GET  /agents                       - List agents
GET  /agents/:id                   - Agent profile
PATCH /agents/:id                  - Update profile
GET  /agents/:id/listings          - Agent's listings
GET  /agents/:id/deals             - Agent's deals
GET  /agents/:id/reviews           - Agent reviews
POST /agents/:id/reviews           - Leave review
GET  /agents/:id/statistics        - Performance stats
```

**Database Tables:**
- agents (existing, extend)
- agent_reviews (new)

### Module 3.7: Analytics & Reporting (Week 6-7)

**Dashboard Metrics:**
- Total users, listings, deals
- Revenue by period
- Top performing agents
- Popular locations
- Conversion rates (lead -> deal)
- Average deal time

**Report Types:**
1. **Admin Dashboard**: Platform overview
2. **Agent Dashboard**: Personal performance
3. **Seller Dashboard**: Listing analytics
4. **Financial Reports**: Revenue, commissions

**API Endpoints:**
```
GET /admin/statistics                       - Platform stats
GET /admin/reports/revenue                  - Revenue report
GET /admin/reports/agents                   - Agent performance
GET /admin/reports/locations                - Location trends
GET /admin/reports/deals                    - Deal analytics
GET /admin/reports/export                   - Export CSV/Excel
```

**Analytics Events:**
```typescript
// Track in analytics_events table
enum AnalyticsEventType {
  LISTING_VIEW = 'listing_view',
  LISTING_SAVE = 'listing_save',
  LISTING_CONTACT = 'listing_contact',
  SEARCH_PERFORMED = 'search_performed',
  DEAL_CREATED = 'deal_created',
  DEAL_COMPLETED = 'deal_completed',
  PAYMENT_COMPLETED = 'payment_completed',
  AI_CHAT = 'ai_chat'
}
```

**Database Tables:**
- analytics_events (existing)
- reports (new, for scheduled reports)

### Module 3.8: Success Fees & Automated Billing (Week 7-8)

**Success Fee Model:**
- Fee calculated on deal completion
- Invoice generated automatically
- Payment required before deal marked complete
- Split between platform and agent

**Success Fee Flow:**
```
1. Deal reaches COMPLETED stage
2. System calculates commission based on rules
3. Generate invoice for platform fee
4. Generate payout record for agent
5. Notify parties
6. Process payments
7. Update deal with fee records
```

**API Endpoints:**
```
GET  /deals/:id/fees                - Deal fees breakdown
POST /deals/:id/fees/invoice        - Generate fee invoice
GET  /agents/:id/payouts            - Agent payouts
POST /agents/:id/payouts/:id/process - Process payout
```

---

## Architecture Decisions

### ADR-012: LLM Provider Selection
- Primary: OpenAI GPT-4 (best Vietnamese support)
- Fallback: Claude 3.5 Sonnet
- Embedding: text-embedding-3-small (cost-effective)
- Consider local model for cost reduction (MVP4)

### ADR-013: Vector Storage
- Use pgvector extension in PostgreSQL
- Single database simplifies architecture
- Good enough for 100K+ documents
- Scale to dedicated vector DB if needed

### ADR-014: OpenSearch Deployment
- Single-node for MVP3 (disable security for simplicity)
- Enable security and clustering for production
- Use managed service (AWS OpenSearch) for production

### ADR-015: Commission Calculation
- Calculate at deal completion (not earlier)
- Store calculation snapshot with deal
- Allow manual override by admin
- Audit all changes

---

## Related Reference Files

| File | Purpose |
|------|---------|
| `backend/src/modules/ai/ai.service.ts` | AI service implementation |
| `backend/src/modules/search/search.service.ts` | OpenSearch integration |
| `database/schema.sql` | Commission and KB tables |
| `monitoring/grafana/` | Analytics dashboards |

---

## Implementation Steps

### Week 1-3: AI Assistant

1. **RAG Pipeline Setup**
   - Install LangChain dependencies
   - Setup pgvector extension
   - Create embedding service
   - Build retrieval chain

2. **Knowledge Base**
   - Create KB module
   - Implement chunking logic
   - Build embedding pipeline
   - Seed initial content

3. **Chat Interface**
   - Create AI module
   - Implement chat endpoint
   - Build context injection
   - Add conversation memory

4. **Frontend AI Chat**
   - Chat widget component
   - Conversation history
   - Suggestion chips

### Week 3-4: OpenSearch

5. **OpenSearch Setup**
   - Configure Docker container
   - Create index mappings
   - Setup Vietnamese analyzer

6. **Search Service**
   - Implement indexing
   - Build query builder
   - Add aggregations

7. **Sync Pipeline**
   - Real-time sync on listing changes
   - Bulk reindex capability
   - Error handling

### Week 4-5: Enhanced Signature

8. **Digital Signature**
   - Research Vietnam CA options
   - Implement certificate signing
   - Build verification

### Week 5-6: Commission System

9. **Commission Module**
   - Create commission rules
   - Implement calculation
   - Build payout tracking

10. **Agent Module**
    - Extend agent profile
    - Add performance metrics
    - Build reviews system

### Week 6-7: Analytics

11. **Analytics Service**
    - Event tracking
    - Report generation
    - Dashboard APIs

12. **Admin Dashboard**
    - Statistics pages
    - Report exports
    - Performance charts

### Week 7-8: Success Fees & Polish

13. **Automated Billing**
    - Fee calculation
    - Invoice generation
    - Payout processing

14. **Testing & Optimization**
    - Load testing search
    - AI response quality
    - Bug fixes

---

## Todo List

### AI Assistant
- [ ] Setup LangChain with OpenAI
- [ ] Install pgvector extension
- [ ] Create embedding service
- [ ] Build knowledge base module
- [ ] Implement chunking and embedding
- [ ] Seed Vietnamese legal content
- [ ] Create AI chat endpoint
- [ ] Build context injection
- [ ] Add conversation memory
- [ ] Frontend: Chat widget
- [ ] Frontend: Suggestion chips

### OpenSearch
- [ ] Configure OpenSearch container
- [ ] Create Vietnamese analyzer
- [ ] Define index mappings
- [ ] Build indexing service
- [ ] Implement search query builder
- [ ] Add aggregations for facets
- [ ] Setup real-time sync
- [ ] Frontend: Enhanced search UI
- [ ] Frontend: Faceted filters

### Enhanced Signature
- [ ] Research Vietnam CA options
- [ ] Implement digital signing API
- [ ] Build signature verification
- [ ] Frontend: Certificate selection

### Commission System
- [ ] Create commission rules module
- [ ] Implement calculation logic
- [ ] Build payout tracking
- [ ] Extend agent profiles
- [ ] Add performance metrics
- [ ] Create reviews system
- [ ] Frontend: Agent dashboard
- [ ] Frontend: Commission report

### Analytics
- [ ] Create analytics module
- [ ] Implement event tracking
- [ ] Build report generator
- [ ] Create admin dashboard API
- [ ] Frontend: Statistics dashboard
- [ ] Frontend: Report exports

### Success Fees
- [ ] Implement fee calculation
- [ ] Automated invoice generation
- [ ] Payout processing
- [ ] Agent earnings dashboard

---

## Success Criteria

1. **AI Chat**: User can ask legal questions, get relevant answers
2. **Search**: Sub-second search with Vietnamese text
3. **Geo Search**: Find listings within map bounds
4. **Commission**: Auto-calculate and track commissions
5. **Agent**: View agent profiles with ratings
6. **Analytics**: Admin sees platform statistics
7. **Reports**: Export financial reports

**Performance Targets:**
- AI response < 3s (with context)
- OpenSearch query < 200ms
- Embedding generation < 2s per article
- Dashboard load < 2s

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| LLM API costs high | Medium | High | Implement caching, use cheaper models for simple queries |
| AI hallucination | High | Medium | RAG with strict retrieval, add disclaimers |
| OpenSearch complexity | Medium | Medium | Start simple, add features incrementally |
| Vietnam CA integration | Medium | High | Keep OTP as fallback, document limitations |
| Analytics data volume | Low | Medium | Implement retention policy, aggregate old data |

---

## Security Considerations

1. **AI Security**
   - Sanitize user input before LLM
   - Rate limit AI endpoints
   - Log all AI interactions
   - Implement content filters

2. **Search Security**
   - Don't expose internal IDs
   - Validate geo bounds
   - Rate limit search queries

3. **Commission Security**
   - Audit all calculations
   - Require admin approval for payouts
   - Log all changes

4. **Data Privacy**
   - Anonymize analytics where possible
   - Comply with data protection laws
   - Clear retention policies

---

## Post-MVP3 Considerations

After completing MVP3, potential next steps:

1. **Mobile Apps** (React Native)
2. **Advanced AI** (Property valuation model)
3. **Blockchain** (Title verification)
4. **Mortgage Integration** (Bank partnerships)
5. **Virtual Tours** (360/VR integration)
6. **International Expansion** (Multi-language)

---

## Appendix: Technical Dependencies

**AI/ML:**
```json
{
  "langchain": "^0.1.0",
  "@langchain/openai": "^0.0.10",
  "pgvector": "^0.1.0",
  "tiktoken": "^1.0.0"
}
```

**OpenSearch:**
```json
{
  "@opensearch-project/opensearch": "^2.5.0"
}
```

**Analytics:**
```json
{
  "recharts": "^2.10.0",
  "xlsx": "^0.18.5",
  "papaparse": "^5.4.0"
}
```
