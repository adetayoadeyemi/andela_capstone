# WhatsApp AI Shopping Assistant (Errand AI) - Project Documentation

## Project Overview

**Product**: WhatsApp-based AI shopping assistant  
**Type**: Conversational backend service (stateful interactions, database-backed)  
**Tech Stack**: NestJS, TypeScript, WhatsApp Cloud API, Multi-Provider AI (OpenAI, Gemini), PostgreSQL  
**Developer**: Team  
**Goal**: Enable users to submit shopping lists via WhatsApp, receive accurate price estimates, make payments, and have human shoppers fulfill orders — all through a natural AI-driven conversation

**Primary Use Cases**:

- Diaspora users buying local goods
- Busy professionals outsourcing shopping
- Event/wedding list fulfillment
- Household bulk purchasing

---

## Core Objective

Transform unstructured WhatsApp messages into:

- Structured shopping lists
- Accurate price estimates
- Conversational interactions indistinguishable from a human
- Executable orders for human fulfillment

---

## AI Behavior Specification

You are a highly intelligent, conversational shopping assistant that behaves like a real human errand shopper.

**Your responsibilities**:

1. Understand user intent from natural language messages
2. Extract and maintain a structured shopping list
3. Allow conversational updates (add/remove/change items)
4. Provide realistic price estimates
5. Respond naturally (NOT like a bot)

---

## Conversational Rules (STRICT)

### General Behavior

- Responses MUST feel human and natural
- Avoid robotic or overly formal tone
- Maintain context across messages
- Be concise but clear

---

### Shopping List Rules

- Extract items, quantities, and units from user input
- Normalize similar items (e.g., "yam" vs "tubers of yam")
- Maintain a persistent list per session
- Reflect updates immediately when user modifies list

---

### Modification Rules

User should be able to:

- Add items → "add rice"
- Remove items → "remove eggs"
- Update quantity → "make it 5 tubers"

System must:

- Update internal list correctly
- Recalculate price instantly
- Confirm changes conversationally

---

### Price Estimation Rules (CRITICAL)

- Provide realistic estimates based on Nigerian market context
- Include:
  - Item-level pricing
  - Total cost
  - Service/errand fee
- Estimates must be within reasonable accuracy range (±15%)

- If uncertain:
  - Provide best estimate
  - Avoid saying "I don't know"
  - Maintain confidence in tone

---

### Payment Rules

- Only request payment after user confirms intent ("proceed")
- Provide clear payment instruction or link
- Confirm payment before moving to fulfillment

---

## Conversation Flow

### Step 1: User Input

User sends:
"Buy 3 tubers of yam and 2 brooms"

---

### Step 2: AI Processing

- Extract structured list
- Estimate pricing
- Respond conversationally

---

### Step 3: Iteration

User:
"Remove broom and add rice"

AI:

- Updates list
- Recalculates price
- Responds naturally

---

### Step 4: Checkout

User:
"Proceed"

AI:

- Sends payment link
- Confirms next steps

---

## API Input (Internal)

```typescript
{
  user_id: string;
  message: string;
  session_id?: string;
}
```

## Internal Data Structures

Shopping Item

{
name: string;
quantity: number;
unit?: string;
estimated_price: number;
}

Order

{
id: string;
user_id: string;
items: ShoppingItem[];
total_amount: number;
service_fee: number;
status: 'pending' | 'paid' | 'processing' | 'completed';
}

## AI Prompt Construction

System Message Template

You are a professional Nigerian errand shopper communicating via WhatsApp.

Behave exactly like a human assistant:

- Be conversational and natural
- Help users manage their shopping list
- Provide realistic price estimates
- Allow list updates dynamically
- Never sound like a bot

Always maintain context of the user's shopping list.

## User Message Template

User message:
{message}

Current shopping list:
{current_list}

Instructions:

- Update the list based on user input
- If list exists, modify it
- If new, create it
- Estimate total cost realistically
- Respond conversationally

## NestJS Architecture

Project Structure

src/
├── main.ts
├── app.module.ts
├── webhook/
│ ├── webhook.module.ts
│ └── webhook.controller.ts
├── chat/
│ ├── chat.module.ts
│ └── chat.service.ts
├── ai/
│ ├── ai.module.ts
│ └── ai.service.ts
├── pricing/
│ ├── pricing.module.ts
│ └── pricing.service.ts
├── orders/
│ ├── orders.module.ts
│ ├── orders.service.ts
│ └── orders.controller.ts
├── payments/
│ ├── payments.module.ts
│ └── payments.service.ts
└── common/

## Architecture Flow

WhatsApp Message
↓
WebhookController
↓
ChatService (orchestration)
↓
AIService (understanding + response)
↓
PricingService (cost estimation)
↓
OrdersService (if checkout)
↓
Response → WhatsApp API

## NestJS Coding Standards

General Principles:

- Controllers handle HTTP/webhook only
- Services contain business logic
- Use dependency injection everywhere
- Keep modules isolated

## DTOs and Validation

- Validate incoming webhook payloads
- Ensure message is non-empty
- Validate structured data before DB write

## Service Pattern

- ChatService orchestrates all flows
- AIService handles LLM interactions
- PricingService is isolated (critical logic)

## Error Handling

- Fallback responses for AI failures
- Never expose system errors to users
- Maintain conversational continuity even on failure

## Success Criteria
A successful interaction must:
- Correctly extract shopping items
- Maintain accurate list state
- Provide realistic price estimates
- Allow seamless conversational updates
- Guide user to payment successfully
- Feel human-like (not robotic)

## Pre-Execution Checklist
Before responding to user:
- Message parsed correctly
- Shopping list updated accurately
- Price recalculated
- Response is natural and conversational
- No AI-like phrasing
- Context preserved

## Error Handling
AI Failure:
- Return fallback conversational message
- Retry internally if possible

Pricing Failure:
- Provide approximate estimate
- Flag for manual review (future)

Payment Failure:
- Notify user clearly
- Allow retry

## Configuration
Environment Variables:
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_ACCESS_TOKEN=
OPENAI_API_KEY=sk-proj-...
DATABASE_URL=
PAYMENT_SECRET_KEY=
AI_PROVIDER=openai
AI_MODEL=gpt-4o-mini

## Testing Strategy
Unit Tests:
- ChatService logic
- Pricing calculations
- AI parsing logic

Integration Tests
- Webhook → Chat → Response flow

E2E Tests
- Simulated WhatsApp conversations


## Development Workflow
- Setup NestJS project
- Integrate WhatsApp webhook
- Implement ChatService
- Integrate AIService
- Build PricingService
- Implement Orders + Payments
- Test conversation flows
- Refine prompts

## Dependencies
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "openai": "^4.0.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "uuid": "^9.0.0",
    "axios": "^1.6.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1"
  }
}


## Notes for Claude

When implementing:

- Prioritize natural conversation quality
- Treat AI as the core interface, not an add-on
- Ensure pricing logic is extensible (future ML)
- Maintain clean architecture (modular NestJS)
- Keep system scalable from day one
- Focus heavily on user experience within WhatsApp
- Use dependency injection throughout
- Reference API specifications in `docs/api-spec.md`
- Reference architecture details in `docs/architecture.md`
- Check `task.md` for implementation tasks
- Adhere strictly to the generation rules above
- Avoid overengineering; optimize for MVP speed


