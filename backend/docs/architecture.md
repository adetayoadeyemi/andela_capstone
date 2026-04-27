# Architecture Documentation

# WhatsApp AI Shopping Assistant (Errand AI)

**Tech Stack**: NestJS, TypeScript, WhatsApp Cloud API, Multi-Provider AI (OpenAI, Gemini), PostgreSQL  
**Architecture Pattern**: Modular, Event-Driven + Layered Architecture  
**Design Philosophy**: WhatsApp-first, AI-assisted operations, scalable human-in-the-loop system

---

## Table of Contents

1. High-Level Architecture
2. Project Structure
3. Module Design
4. Data Flow
5. Component Responsibilities
6. Key Design Decisions

---

## High-Level Architecture

### System Overview

┌──────────────┐
│ User │
│ (WhatsApp) │
└──────┬───────┘
│ Incoming Message
▼
┌──────────────────────────────┐
│ WhatsApp Cloud API │
└──────┬───────────────────────┘
│ Webhook Event
▼
┌──────────────────────────────────────────┐
│ NestJS Application │
│ │
│ ┌────────────────────────────────────┐ │
│ │ WebhookController │ │
│ │ - Receives messages │ │
│ │ - Verifies webhook │ │
│ └──────────┬─────────────────────────┘ │
│ │ │
│ ▼ │
│ ┌────────────────────────────────────┐ │
│ │ ChatService │ │
│ │ - Conversation state │ │
│ │ - Message orchestration │ │
│ └──────────┬─────────────────────────┘ │
│ │ │
│ ▼ │
│ ┌────────────────────────────────────┐ │
│ │ AIService │ │
│ │ - Message understanding │ │
│ │ - List parsing │ │
│ │ - Conversational replies │ │
│ └──────────┬─────────────────────────┘ │
│ │ │
│ ▼ │
│ ┌────────────────────────────────────┐ │
│ │ PricingService │ │
│ │ - Price estimation │ │
│ │ - Fee calculation │ │
│ └──────────┬─────────────────────────┘ │
│ │ │
│ ▼ │
│ ┌────────────────────────────────────┐ │
│ │ OrdersService │ │
│ │ - Order persistence │ │
│ │ - Status management │ │
│ └──────────┬─────────────────────────┘ │
│ │ │
└─────────────┼───────────────────────────┘
│
▼
┌──────────────────────────┐
│ PostgreSQL Database │
└──────────────────────────┘

          │
          ▼

┌──────────────────────────┐
│ Human Shopper Dashboard │
└──────────────────────────┘

---

## Project Structure

errand-ai/
├── src/
│ ├── main.ts
│ ├── app.module.ts
│
│ ├── webhook/
│ │ ├── webhook.module.ts
│ │ ├── webhook.controller.ts
│
│ ├── chat/
│ │ ├── chat.module.ts
│ │ ├── chat.service.ts
│
│ ├── ai/
│ │ ├── ai.module.ts
│ │ ├── ai.service.ts
│
│ ├── pricing/
│ │ ├── pricing.module.ts
│ │ ├── pricing.service.ts
│
│ ├── orders/
│ │ ├── orders.module.ts
│ │ ├── orders.service.ts
│ │ ├── orders.controller.ts
│ │ ├── dto/
│ │ └── entities/
│
│ ├── payments/
│ │ ├── payments.module.ts
│ │ ├── payments.service.ts
│
│ ├── common/
│ │ ├── config/
│ │ ├── enums/
│ │ └── utils/
│
├── prisma/
├── test/
├── .env
├── package.json

---

## Module Design

### 1. Webhook Module

Handles incoming WhatsApp messages.

**Responsibilities**:

- Verify webhook signature
- Parse incoming message
- Forward to ChatService

---

### 2. Chat Module

Core orchestration layer.

**Responsibilities**:

- Maintain conversation context
- Determine user intent (add/remove/update/proceed)
- Call AIService + PricingService
- Return human-like responses

---

### 3. AI Module

Handles all AI interactions.

**Responsibilities**:

- Parse shopping lists
- Generate conversational responses
- Maintain tone (human-like)

---

### 4. Pricing Module (CRITICAL)

Core differentiator.

**Responsibilities**:

- Estimate item prices
- Add service fees
- Maintain pricing logic
- Interface with AI or future ML models

---

### 5. Orders Module

Manages persistence and fulfillment.

**Responsibilities**:

- Store structured orders
- Track order lifecycle
- Serve dashboard APIs

---

### 6. Payments Module

Handles financial flow.

**Responsibilities**:

- Generate payment links
- Verify transactions
- Update order status

---

## Data Flow

### End-to-End Flow

1. User sends message via WhatsApp
   "Buy 3 yams and 2 brooms"

↓

2. WhatsApp API → WebhookController

↓

3. ChatService
   Fetch session
   Forward message to AIService

↓

4. AIService
   Extract structured items
   Return parsed list

↓

5. PricingService
   Estimate cost
   Add service fee

↓

6. ChatService
   Generate conversational response

↓

7. Response sent via WhatsApp API

↓

8. If user proceeds:

Order stored in DB
Payment link sent (or bank account details that include bank number, name of bank and name on account for MVP)

↓

9. Payment confirmed

↓

10. Order visible on dashboard

---

## Component Responsibilities

### WebhookController

- Entry point for WhatsApp messages
- Verifies authenticity
- Passes payload to ChatService

---

### ChatService

- Core orchestrator
- Maintains conversation state
- Coordinates AI + pricing + orders

---

### AIService

- Natural language understanding
- List parsing
- Response generation

---

### PricingService

- Computes price estimates
- Applies markup/service fee
- Future: ML model integration

---

### OrdersService

- Creates and updates orders
- Stores structured data
- Tracks fulfillment

---

### PaymentsService

- Handles payment provider integration
- Confirms transactions
- Updates order lifecycle

---

## Key Design Decisions

### 1. WhatsApp-First Architecture

**Decision**: No separate app for MVP

**Rationale**:

- Eliminates user acquisition friction
- Leverages existing behavior

---

### 2. Human-in-the-Loop System

**Decision**: AI handles interaction, humans handle fulfillment

**Rationale**:

- Reduces complexity
- Ensures reliability

---

### 3. AI as Orchestrator (Not Just Tool)

**Decision**: AI drives conversation + parsing

**Rationale**:

- Natural UX
- Reduces rigid UI flows

---

### 4. Pricing as Core Service

**Decision**: Dedicated PricingService

**Rationale**:

- Main technical moat
- Enables defensibility

---

### 5. Stateful Conversations

**Decision**: Maintain session context

**Rationale**:

- Required for natural chat experience
- Enables incremental updates

---

### 6. Modular Architecture

**Decision**: Separate Chat, AI, Pricing, Orders

**Rationale**:

- Independent scaling
- Easier testing and iteration

---

## Error Handling Strategy

### Layers

1. **Webhook Validation Errors**
   - Return 403 if invalid signature

2. **AI Errors**
   - Fallback message to user
   - Retry logic (optional)

3. **Pricing Errors**
   - Return approximate estimate
   - Flag for manual review

4. **Payment Errors**
   - Notify user
   - Retry payment

---

## Configuration Management

### Environment Variables

WHATSAPP_VERIFY_TOKEN=
WHATSAPP_ACCESS_TOKEN=
OPENAI_API_KEY=sk-proj-...
DATABASE_URL=
PAYMENT_SECRET_KEY=
AI_PROVIDER=openai
AI_MODEL=gpt-4o-mini

---

## Scalability Considerations

### Current (MVP)

- Single instance NestJS app
- PostgreSQL database
- No queue

### Future

- Redis for session storage
- BullMQ for async jobs
- Horizontal scaling
- Real-time pricing updates

---

## Testing Strategy

### Unit Tests

- ChatService
- PricingService
- AIService

### Integration Tests

- Webhook → Chat flow

### E2E Tests

- Simulated WhatsApp messages

---

## Security Considerations

- Webhook signature validation
- Secure API key storage
- Payment verification
- Input sanitization

---

## Future Architecture Evolution

- ML-based pricing engine
- Marketplace of shoppers
- Automated logistics integration
- Voice + image input support

---

**End of Architecture Documentation**
