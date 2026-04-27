# Errand AI

> A WhatsApp-based AI shopping assistant that transforms unstructured messages into structured shopping lists with accurate price estimates and seamless order fulfillment.

## Overview

Errand AI is a conversational backend service that enables users to submit shopping lists via WhatsApp, receive realistic price estimates, make payments, and have human shoppers fulfill orders - all through natural AI-driven conversations.

### Primary Use Cases

- Diaspora users buying local goods
- Busy professionals outsourcing shopping
- Event/wedding list fulfillment
- Household bulk purchasing

## Features

- **Natural Language Processing**: Extract shopping items from conversational messages
- **Conversational Updates**: Add, remove, or modify items dynamically
- **Real-time Price Estimation**: Accurate pricing based on Nigerian market context
- **WhatsApp Integration**: Seamless communication via WhatsApp Cloud API
- **Multi-Provider AI Support**: OpenAI and Gemini integration
- **Stateful Sessions**: Persistent shopping lists across conversations
- **Payment Processing**: Integrated payment flow
- **Human Fulfillment**: Connect users with real shoppers

## Tech Stack

- **Framework**: NestJS (TypeScript)
- **AI Providers**: OpenAI (GPT-4o-mini), Google Gemini
- **Database**: PostgreSQL
- **Messaging**: WhatsApp Cloud API
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database
- WhatsApp Business Account
- OpenAI API key or Google Gemini API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd errand-ai
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables (see [Configuration](#configuration))

5. Run database migrations (when implemented):
```bash
npm run migration:run
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# WhatsApp Configuration
WHATSAPP_VERIFY_TOKEN=your_verify_token_here
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

# AI Provider Configuration
AI_PROVIDER=openai # or 'gemini'
AI_MODEL=gpt-4o-mini

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-...

# Google Gemini Configuration (if using Gemini)
GEMINI_API_KEY=your_gemini_api_key

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/errand_ai

# Payment Configuration
PAYMENT_SECRET_KEY=your_payment_secret_key
```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

The application will be available at `http://localhost:3000`

## API Documentation

Once the application is running, access the Swagger documentation at:

```
http://localhost:3000/api
```

### Available Endpoints

#### Health Check
- `GET /` - API status and info
- `GET /health` - Health check endpoint

#### WhatsApp Webhook
- `GET /webhook/whatsapp` - Webhook verification (for WhatsApp setup)
- `POST /webhook/whatsapp` - Receive WhatsApp messages and events

## Project Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts          # Root module
├── app.controller.ts      # Health check endpoints
├── dto/                   # Global DTOs
│   ├── api-status-response.dto.ts
│   └── health-check-response.dto.ts
├── webhook/               # WhatsApp webhook module
│   ├── webhook.module.ts
│   ├── webhook.controller.ts
│   └── dto/
│       ├── whatsapp-webhook.dto.ts
│       ├── incoming-message.dto.ts
│       ├── message-data.dto.ts
│       ├── message-status.dto.ts
│       └── webhook-response.dto.ts
├── chat/                  # Chat orchestration (planned)
│   ├── chat.module.ts
│   └── chat.service.ts
├── ai/                    # AI service integration (planned)
│   ├── ai.module.ts
│   └── ai.service.ts
├── pricing/               # Price estimation (planned)
│   ├── pricing.module.ts
│   └── pricing.service.ts
├── orders/                # Order management (planned)
│   ├── orders.module.ts
│   ├── orders.service.ts
│   └── orders.controller.ts
└── payments/              # Payment processing (planned)
    ├── payments.module.ts
    └── payments.service.ts
```

## WhatsApp Setup

### 1. Create WhatsApp Business Account
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app or use an existing one
3. Add the WhatsApp Business product

### 2. Configure Webhook
1. In WhatsApp settings, configure webhook URL:
   ```
   https://your-domain.com/webhook/whatsapp
   ```
2. Set verify token (same as `WHATSAPP_VERIFY_TOKEN` in `.env`)
3. Subscribe to webhook fields:
   - `messages`
   - `message_echoes` (optional)

### 3. Get Access Token
1. Generate a permanent access token from WhatsApp Business settings
2. Add to `.env` as `WHATSAPP_ACCESS_TOKEN`

### 4. Get Phone Number ID
1. From WhatsApp Business settings, copy your Phone Number ID
2. Add to `.env` as `WHATSAPP_PHONE_NUMBER_ID`

## Development

### Code Style
```bash
# Format code
npm run format

# Lint code
npm run lint
```

### Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## Architecture Flow

```
WhatsApp Message
       ↓
WebhookController (receives webhook)
       ↓
ChatService (orchestrates conversation)
       ↓
AIService (understands intent & generates response)
       ↓
PricingService (calculates costs)
       ↓
OrdersService (creates order if checkout)
       ↓
Response → WhatsApp API
```

## AI Behavior

The AI assistant is designed to:

1. **Understand Natural Language**: Parse unstructured shopping lists
2. **Maintain Context**: Remember items across messages
3. **Allow Modifications**: Handle add/remove/update requests
4. **Provide Pricing**: Give realistic estimates based on Nigerian market
5. **Sound Human**: Respond naturally, never robotic

### Example Conversation

```
User: Buy 3 tubers of yam and 2 brooms

AI: Noted! Here's your list:
• 3 tubers of yam - ₦1,500
• 2 brooms - ₦800
Total: ₦2,300 + ₦500 service fee = ₦2,800

User: Remove broom and add rice

AI: Got it! Updated list:
• 3 tubers of yam - ₦1,500
• 1 bag of rice - ₦28,000
Total: ₦29,500 + ₦500 service fee = ₦30,000

User: Proceed

AI: Great! Here's your payment link: [payment-link]
Once paid, we'll get your items delivered within 24 hours.
```

## Data Models

### Shopping Item
```typescript
{
  name: string;
  quantity: number;
  unit?: string;
  estimated_price: number;
}
```

### Order
```typescript
{
  id: string;
  user_id: string;
  items: ShoppingItem[];
  total_amount: number;
  service_fee: number;
  status: 'pending' | 'paid' | 'processing' | 'completed';
}
```

## Error Handling

The application implements comprehensive error handling:

- **AI Failures**: Fallback conversational messages
- **Pricing Errors**: Approximate estimates with manual review flag
- **Payment Failures**: Clear user notifications with retry options
- **Webhook Errors**: Always returns 200 OK to prevent WhatsApp retries


## Monitoring

Access application logs:
```bash
# Development
Check console output

# Production with PM2
pm2 logs errand-ai
```

## License

This project is licensed under the UNLICENSED License.

---

Built with NestJS and powered by AI to make shopping easier for everyone.
