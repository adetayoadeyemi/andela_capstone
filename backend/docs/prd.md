# Product Requirements Document (PRD)
# WhatsApp AI Shopping Assistant (Errand AI)

**Version**: 1.0 (MVP)  
**Last Updated**: April 2026  
**Status**: Planning Phase  
**Tech Stack**: NestJS, TypeScript, WhatsApp API, Multi-Provider AI (OpenAI, Gemini), PostgreSQL

---

## 1. Product Vision

### 1.1 Problem Statement
Individuals (especially busy professionals and diaspora users) need help purchasing local items (e.g., groceries, wedding lists, household goods). Current solutions rely on informal human agents via WhatsApp, which do not scale and lack consistency.

### 1.2 Solution
A WhatsApp-based AI assistant that behaves like a human shopper. Users submit shopping lists via WhatsApp, receive price estimates, make payments, and have human shoppers fulfill the orders—all without leaving WhatsApp.

### 1.3 Success Metrics
- Price estimation accuracy ≥ 85% (MVP target)
- Response time < 5 seconds for chat interactions
- 90% of conversations feel human-like
- Handle 100+ concurrent users with minimal human intervention
- ≥ 70% successful order completion rate

---

## 2. User Stories

### Story 1: Submit Shopping List
**As a** busy user  
**I want to** send my shopping list via WhatsApp  
**So that** I can avoid going to the market  

**Acceptance Criteria**:
- Accept free-form text list
- Accept incremental updates (add/remove/change items)
- Conversation is natural and continuous

---

### Story 2: Get Price Estimate
**As a** customer  
**I want to** receive a price estimate before payment  
**So that** I can decide whether to proceed  

**Acceptance Criteria**:
- Estimate generated within seconds
- Includes item breakdown + service fee
- Accuracy within acceptable range (±15%)

---

### Story 3: Modify Shopping List
**As a** user  
**I want to** update my list conversationally  
**So that** I can refine my order  

**Acceptance Criteria**:
- Add/remove/update items via chat
- Changes reflected immediately in estimate
- No need to restart process

---

### Story 4: Make Payment
**As a** user  
**I want to** pay a portion upfront  
**So that** the shopper can begin purchase  

**Acceptance Criteria**:
- Payment link provided via WhatsApp
- System confirms payment before processing
- Order moves to fulfillment stage

---

### Story 5: Backend Fulfillment
**As a** shopper (operator)  
**I want to** see all customer orders in a dashboard  
**So that** I can fulfill them efficiently  

**Acceptance Criteria**:
- Orders displayed clearly
- Includes items, quantities, user info
- Status tracking (pending, in-progress, completed)

---

## 3. Core Features

### Feature 1: WhatsApp AI Chat Interface
**Priority**: P0

**Description**: AI-powered conversational interface inside WhatsApp.

**Technical Requirements**:
- WhatsApp Cloud API integration
- Webhook for incoming messages
- Context-aware conversation handling
- Memory of user session

**NestJS Implementation**:
- `WebhookController`
- `ChatService`
- Session management (in-memory or Redis optional)

---

### Feature 2: Shopping List Parsing
**Priority**: P0

**Description**: Convert unstructured chat into structured shopping data.

**Technical Requirements**:
- Extract item name, quantity, unit
- Handle ambiguous inputs
- Normalize items (e.g., "yam" vs "tubers of yam")

**NestJS Implementation**:
- `AIService` for parsing
- DTO for structured list

---

### Feature 3: Price Estimation Engine (CORE)
**Priority**: P0

**Description**: AI-driven estimation of item prices.

**Technical Requirements**:
- Fine-tuned or prompt-engineered model
- Local market price awareness
- Fee calculation logic
- Continuous improvement with real data

**NestJS Implementation**:
- `PricingService`
- AI prompt templates
- Future: model fine-tuning pipeline

---

### Feature 4: Order Management Dashboard
**Priority**: P0

**Description**: Internal dashboard for human shoppers.

**Technical Requirements**:
- View all incoming orders
- Order status updates
- Assignment system (optional MVP)

**NestJS Implementation**:
- `OrdersModule`
- REST endpoints for dashboard

---

### Feature 5: Payment Integration
**Priority**: P0

**Description**: Handle upfront payment before fulfillment.

**Technical Requirements**:
- Payment link generation
- Payment verification webhook
- Order state transition

**NestJS Implementation**:
- `PaymentService`
- Integration with payment gateway (e.g., Paystack/Flutterwave)

---

## 4. Technical Constraints

### 4.1 MVP Limitations
**Out of Scope**:
- ❌ Full automation (human still fulfills orders)
- ❌ Advanced logistics optimization
- ❌ Multi-language support
- ❌ Mobile/web app UI

**In Scope**:
- ✅ WhatsApp-only interface
- ✅ AI chat + parsing
- ✅ Price estimation
- ✅ Basic dashboard
- ✅ Payment flow

---

### 4.2 Performance Requirements
- Chat response: < 5 seconds
- Estimate generation: < 10 seconds
- System uptime: best effort

---

### 4.3 Security Requirements
- Secure webhook validation
- Payment verification
- Input sanitization
- API keys in `.env`

---

## 5. API Specification

### 5.1 WhatsApp Webhook
POST /webhook/whatsapp

### 5.2 Internal Order API
GET /orders
POST /orders
PATCH /orders/:id


---

## 6. Non-Functional Requirements

### Reliability
- Graceful fallback for AI failures
- Retry logic for webhook delivery

### Scalability
- Stateless backend
- Horizontal scaling possible
- Queue system (future)

### Maintainability
- Modular NestJS architecture
- Clean separation of services

---

## 7. Dependencies

### External Services
- WhatsApp Cloud API
- AI Providers (OpenAI, Gemini)
- Payment Gateway (Paystack/Flutterwave)

### NPM Packages
- `@nestjs/*`
- `openai`
- `class-validator`
- `axios`
- `uuid`

---

## 8. Validation Rules

| Parameter | Constraint |
|----------|-----------|
| Message | Non-empty |
| Items | Parsed into structured format |
| Quantity | Must be positive |
| Price | Must be numeric |

---

## 9. Future Enhancements

### Phase 2
- Price database (real-time updates)
- Shopper assignment system
- Redis caching

### Phase 3
- Fully automated fulfillment partnerships
- ML-based pricing model
- Voice note support

### Phase 4
- Dedicated mobile/web app
- International expansion

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Poor price estimation | Improve model + collect real data |
| WhatsApp API limits | Optimize usage + batching |
| AI hallucination | Strict prompt + validation |
| Operational bottleneck | Gradually automate |

---

## 11. Development Tasks

1. Setup NestJS project  
2. WhatsApp webhook integration  
3. AI chat + parsing  
4. Pricing engine  
5. Order system  
6. Payment integration  
7. Dashboard APIs  
8. Testing  

---

## 12. Example Flow

### User Interaction
User:  
"Buy 3 tubers of yam, 2 brooms, 1 crate of eggs"

AI:  
- Parses list  
- Estimates total cost  
- Adds service fee  
- Responds conversationally  

User:  
"Remove eggs, add rice"

AI:  
- Updates list  
- Recalculates estimate  

User:  
"Proceed"

AI:  
- Sends payment link  

---

## 13. Approval & Sign-off

**Prepared by**: Solo Developer  
**Status**: Ready for MVP Build  

---

**End of PRD**