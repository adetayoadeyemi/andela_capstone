# Errand AI - Implementation Tasks

**Project**: WhatsApp AI Shopping Assistant
**Status**: In Development
**Last Updated**: 2026-04-22

---

## Overview

This document outlines the complete implementation roadmap for the Errand AI WhatsApp shopping assistant. Tasks are organized by module and priority.

---

## Phase 1: Foundation & WhatsApp Integration

### 1.1 Environment Setup ✅
- [x] Initialize NestJS project
- [x] Setup basic app structure
- [x] Configure validation pipes
- [x] Setup health check endpoints
- [x] Create .env.example file
- [x] Document environment variables

### 1.2 WhatsApp Webhook Module (IN PROGRESS)
**Priority**: P0
**Status**: Not Started
**Dependencies**: None

Tasks:
- [ ] Create webhook module structure
  - [ ] webhook.module.ts
  - [ ] webhook.controller.ts
  - [ ] webhook.service.ts (optional)
- [ ] Implement webhook verification (GET endpoint)
  - [ ] Verify WHATSAPP_VERIFY_TOKEN
  - [ ] Return challenge for WhatsApp validation
- [ ] Implement message receiving (POST endpoint)
  - [ ] Parse incoming webhook payload
  - [ ] Extract message content and sender
  - [ ] Validate webhook signature (optional but recommended)
- [ ] Create DTOs
  - [ ] WhatsAppWebhookDto
  - [ ] IncomingMessageDto
- [ ] Error handling for webhook
  - [ ] Handle malformed payloads
  - [ ] Return proper HTTP status codes
- [ ] Testing
  - [ ] Unit tests for webhook controller
  - [ ] Mock WhatsApp webhook requests

**Files to Create**:
- `src/webhook/webhook.module.ts`
- `src/webhook/webhook.controller.ts`
- `src/webhook/dto/whatsapp-webhook.dto.ts`
- `src/webhook/dto/incoming-message.dto.ts`

---

## Phase 2: Core Services

### 2.1 WhatsApp Client Service
**Priority**: P0
**Status**: Not Started
**Dependencies**: Webhook Module

Tasks:
- [ ] Create WhatsApp service
  - [ ] whatsapp.module.ts
  - [ ] whatsapp.service.ts
- [ ] Implement send message function
  - [ ] Use WhatsApp Cloud API
  - [ ] Format message payload
  - [ ] Handle API responses
- [ ] Error handling
  - [ ] Retry logic for failed sends
  - [ ] Fallback messages
- [ ] Testing
  - [ ] Mock WhatsApp API
  - [ ] Test message sending

**Files to Create**:
- `src/whatsapp/whatsapp.module.ts`
- `src/whatsapp/whatsapp.service.ts`

### 2.2 Session/State Management
**Priority**: P0
**Status**: Not Started
**Dependencies**: None

Tasks:
- [ ] Design session structure
  - [ ] In-memory store (MVP)
  - [ ] Session interface/type
- [ ] Create session service
  - [ ] session.module.ts
  - [ ] session.service.ts
- [ ] Implement methods
  - [ ] getOrCreateSession(userId)
  - [ ] updateSession(userId, data)
  - [ ] clearSession(userId)
- [ ] Add session expiration logic
- [ ] Testing

**Files to Create**:
- `src/session/session.module.ts`
- `src/session/session.service.ts`
- `src/session/interfaces/session.interface.ts`

### 2.3 Chat Orchestration Service
**Priority**: P0
**Status**: Not Started
**Dependencies**: WhatsApp Service, Session Service

Tasks:
- [ ] Create chat module
  - [ ] chat.module.ts
  - [ ] chat.service.ts
- [ ] Implement message processing flow
  - [ ] Receive message from webhook
  - [ ] Get/create user session
  - [ ] Call AI service
  - [ ] Call pricing service
  - [ ] Update session state
  - [ ] Send response via WhatsApp
- [ ] Intent detection logic
  - [ ] Add items intent
  - [ ] Remove items intent
  - [ ] Update quantity intent
  - [ ] Proceed to checkout intent
  - [ ] General chat intent
- [ ] Testing
  - [ ] Test full conversation flow
  - [ ] Mock dependencies

**Files to Create**:
- `src/chat/chat.module.ts`
- `src/chat/chat.service.ts`

---

## Phase 3: AI Integration

### 3.1 AI Service (OpenAI/Gemini)
**Priority**: P0
**Status**: Not Started
**Dependencies**: None

Tasks:
- [ ] Create AI module
  - [ ] ai.module.ts
  - [ ] ai.service.ts
- [ ] Configure AI provider
  - [ ] OpenAI SDK integration
  - [ ] Gemini SDK integration (optional)
  - [ ] Provider selection via env variable
- [ ] Implement core methods
  - [ ] parseShoppingList(message, currentList)
  - [ ] generateResponse(message, context)
  - [ ] extractIntent(message)
- [ ] Create prompt templates
  - [ ] System message template
  - [ ] User message template
  - [ ] Shopping list context template
- [ ] Implement structured output parsing
  - [ ] Extract items, quantities, units
  - [ ] Return typed response
- [ ] Error handling
  - [ ] Fallback for AI failures
  - [ ] Retry logic
  - [ ] Rate limit handling
- [ ] Testing
  - [ ] Mock AI responses
  - [ ] Test parsing accuracy

**Files to Create**:
- `src/ai/ai.module.ts`
- `src/ai/ai.service.ts`
- `src/ai/templates/prompts.ts`
- `src/ai/interfaces/ai-response.interface.ts`
- `src/ai/dto/parsed-list.dto.ts`

---

## Phase 4: Pricing Engine

### 4.1 Pricing Service
**Priority**: P0
**Status**: Not Started
**Dependencies**: AI Service (optional)

Tasks:
- [ ] Create pricing module
  - [ ] pricing.module.ts
  - [ ] pricing.service.ts
- [ ] Implement pricing logic
  - [ ] estimateItemPrice(item)
  - [ ] calculateTotal(items)
  - [ ] addServiceFee(total)
- [ ] Create price database (initial)
  - [ ] Static price map for common items
  - [ ] JSON config file
- [ ] AI-based price estimation (MVP)
  - [ ] Use AI to estimate unknown items
  - [ ] Validate price reasonableness
- [ ] Testing
  - [ ] Test price calculations
  - [ ] Test service fee logic

**Files to Create**:
- `src/pricing/pricing.module.ts`
- `src/pricing/pricing.service.ts`
- `src/pricing/config/price-map.json`
- `src/pricing/interfaces/pricing.interface.ts`

---

## Phase 5: Data Persistence

### 5.1 Database Setup
**Priority**: P0
**Status**: Not Started
**Dependencies**: None

Tasks:
- [ ] Choose ORM (Prisma recommended)
- [ ] Install Prisma
- [ ] Initialize Prisma
  - [ ] prisma/schema.prisma
- [ ] Define database schema
  - [ ] User model
  - [ ] Order model
  - [ ] OrderItem model
  - [ ] Session model (optional)
- [ ] Create migrations
- [ ] Seed database (optional)

**Files to Create**:
- `prisma/schema.prisma`
- `prisma/migrations/`

### 5.2 Orders Module
**Priority**: P0
**Status**: Not Started
**Dependencies**: Database Setup

Tasks:
- [ ] Create orders module
  - [ ] orders.module.ts
  - [ ] orders.service.ts
  - [ ] orders.controller.ts
- [ ] Implement CRUD operations
  - [ ] createOrder(data)
  - [ ] getOrders(filters)
  - [ ] getOrderById(id)
  - [ ] updateOrderStatus(id, status)
- [ ] Create DTOs
  - [ ] CreateOrderDto
  - [ ] UpdateOrderDto
  - [ ] OrderResponseDto
- [ ] Create entities
  - [ ] Order entity
  - [ ] OrderItem entity
- [ ] Implement REST endpoints
  - [ ] GET /orders
  - [ ] POST /orders
  - [ ] GET /orders/:id
  - [ ] PATCH /orders/:id
- [ ] Testing
  - [ ] Unit tests
  - [ ] E2E tests

**Files to Create**:
- `src/orders/orders.module.ts`
- `src/orders/orders.service.ts`
- `src/orders/orders.controller.ts`
- `src/orders/dto/create-order.dto.ts`
- `src/orders/dto/update-order.dto.ts`
- `src/orders/entities/order.entity.ts`

---

## Phase 6: Payment Integration

### 6.1 Payment Service
**Priority**: P1
**Status**: Not Started
**Dependencies**: Orders Module

Tasks:
- [ ] Choose payment provider (Paystack/Flutterwave)
- [ ] Create payments module
  - [ ] payments.module.ts
  - [ ] payments.service.ts
- [ ] Implement payment methods
  - [ ] generatePaymentLink(order)
  - [ ] verifyPayment(reference)
  - [ ] handleWebhook(payload)
- [ ] Alternative: Bank transfer details (MVP)
  - [ ] Return static bank account details
  - [ ] Manual payment verification
- [ ] Payment webhook handler
  - [ ] Verify payment signature
  - [ ] Update order status
  - [ ] Notify user
- [ ] Testing
  - [ ] Mock payment provider
  - [ ] Test webhook handling

**Files to Create**:
- `src/payments/payments.module.ts`
- `src/payments/payments.service.ts`
- `src/payments/payments.controller.ts` (webhook)
- `src/payments/dto/payment-verification.dto.ts`

---

## Phase 7: Common Utilities

### 7.1 Common Module
**Priority**: P1
**Status**: Not Started
**Dependencies**: None

Tasks:
- [ ] Create common utilities
  - [ ] Logger service
  - [ ] Validation helpers
  - [ ] Type definitions
  - [ ] Constants/enums
- [ ] Error handling
  - [ ] Custom exception filters
  - [ ] Error response format
- [ ] Decorators (optional)
  - [ ] Custom validation decorators
- [ ] Config management
  - [ ] Centralized config service

**Files to Create**:
- `src/common/enums/order-status.enum.ts`
- `src/common/constants/index.ts`
- `src/common/utils/logger.service.ts`
- `src/common/filters/http-exception.filter.ts`

---

## Phase 8: Integration & Testing

### 8.1 End-to-End Integration
**Priority**: P0
**Status**: Not Started
**Dependencies**: All modules

Tasks:
- [ ] Connect all modules
  - [ ] Update app.module.ts
  - [ ] Verify dependency injection
- [ ] Test complete flow
  - [ ] Webhook → Chat → AI → Pricing → Response
  - [ ] Order creation flow
  - [ ] Payment flow
- [ ] Error handling across modules
- [ ] Logging and monitoring

### 8.2 Testing
**Priority**: P1
**Status**: Not Started
**Dependencies**: All modules

Tasks:
- [ ] Unit tests
  - [ ] ChatService
  - [ ] AIService
  - [ ] PricingService
  - [ ] OrdersService
- [ ] Integration tests
  - [ ] Webhook flow
  - [ ] Order creation
- [ ] E2E tests
  - [ ] Simulated WhatsApp conversations
  - [ ] Full order lifecycle
- [ ] Test coverage > 70%

---

## Phase 9: Deployment Preparation

### 9.1 Environment & Config
**Priority**: P1
**Status**: Not Started
**Dependencies**: None

Tasks:
- [ ] Create .env.example
- [ ] Document all environment variables
- [ ] Setup environment validation
- [ ] Create deployment guide

### 9.2 Documentation
**Priority**: P1
**Status**: Not Started
**Dependencies**: None

Tasks:
- [ ] Update README.md
  - [ ] Setup instructions
  - [ ] Running locally
  - [ ] Testing guide
- [ ] API documentation
  - [ ] Swagger/OpenAPI (optional)
  - [ ] Endpoint documentation
- [ ] Deployment guide
  - [ ] Railway/Render/Heroku
  - [ ] Database migration guide

---

## Future Enhancements (Post-MVP)

### Phase 10: Advanced Features
- [ ] Redis for session management
- [ ] Queue system (BullMQ)
- [ ] Real-time price updates
- [ ] ML-based pricing model
- [ ] Voice note support
- [ ] Image support
- [ ] Admin dashboard UI
- [ ] Analytics and reporting
- [ ] Multi-language support

---

## Current Priority: WhatsApp Webhook (Phase 1.2)

**Next Steps**:
1. Create webhook module structure
2. Implement GET endpoint for verification
3. Implement POST endpoint for receiving messages
4. Create DTOs for validation
5. Test with WhatsApp API

---

## Notes

- **MVP Focus**: Prioritize P0 tasks for initial launch
- **Iterative Development**: Complete one phase before moving to next
- **Testing**: Write tests alongside implementation
- **Documentation**: Document as you build

---

**Last Updated**: 2026-04-22
