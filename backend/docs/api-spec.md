# API Specification

# WhatsApp AI Shopping Assistant (Errand AI)

**Version**: 1.0  
**Base URL**: `http://localhost:3000` (development)  
**Protocol**: HTTP/HTTPS (Webhook-based)  
**Format**: JSON

---

## Table of Contents

1. Endpoint Overview
2. Authentication
3. Request Specification
4. Response Specification
5. Error Handling
6. Examples
7. Rate Limits

---

## Endpoint Overview

### 1. WhatsApp Webhook (Inbound Messages)

POST /webhook/whatsapp
**Purpose**: Receive incoming WhatsApp messages from users.

---

### 2. Send Message (Outbound to WhatsApp)

POST /messages/send
**Purpose**: Send responses back to users via WhatsApp API.

---

### 3. Orders API (Internal Dashboard)

GET /orders
POST /orders
PATCH /orders/:id
**Purpose**: Manage orders for fulfillment.

---

## Authentication

### MVP

- No authentication for webhook (relies on WhatsApp verification)

### Required

- Webhook verification token
- Bearer token for WhatsApp API calls

### Future

- JWT for dashboard access
- API keys for integrations

---

## Request Specification

### 1. WhatsApp Webhook

#### Headers

Content-Type: application/json

#### Request Body (Simplified)

```typescript
interface WhatsAppWebhookRequest {
  entry: Array<{
    changes: Array<{
      value: {
        messages?: Array<{
          from: string; // User phone number
          text?: {
            body: string; // Message content
          };
        }>;
      };
    }>;
  }>;
}
```

### 2. Send Message

POST /messages/send

Request Body:
interface SendMessageRequest {
to: string;
message: string;
}

### 3. Create Order

POST /orders

```typescript
interface CreateOrderRequest {
  user_id: string;
  items: Array<{
    name: string;
    quantity: number;
    unit?: string;
    estimated_price: number;
  }>;
  total_amount: number;
  service_fee: number;
}
```

### 4. Update Order

PATCH /orders/:id

```typescript
interface UpdateOrderRequest {
  status?: 'pending' | 'paid' | 'processing' | 'completed';
}
```

## Response Specification

### Standard Success Response

```typescript
interface SuccessResponse<T> {
  status: 'true';
  message: string;
  data: T;
}
```

## 1. Webhook Response

Status Code: 200 OK

```json
{
  "status": "true",
  "message": "message received"
}
```

## 2. Send Message Response

```json
{
  "status": "true",
  "message": "message sent successfully"
}
```

## 3. Orders Response

```typescript
interface Order {
  id: string;
  user_id: string;
  items: Array<{
    name: string;
    quantity: number;
    unit?: string;
    estimated_price: number;
  }>;
  total_amount: number;
  service_fee: number;
  status: 'pending' | 'paid' | 'processing' | 'completed';
}
```

## Error Handling

### Error Response Format

```typescript
interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}
```

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Invalid request payload",
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

### 502 Bad Gateway (AI Failure)

```json
{
  "statusCode": 502,
  "message": "AI provider request failed",
  "error": "Bad Gateway"
}
```

## Examples

### Example 1: Incoming WhatsApp Message

```json
{
  "entry": [
    {
      "changes": [
        {
          "value": {
            "messages": [
              {
                "from": "2348012345678",
                "text": {
                  "body": "Buy 3 tubers of yam and 2 brooms"
                }
              }
            ]
          }
        }
      ]
    }
  ]
}
```

### Example 2: Send Message

```json
{
  "to": "2348012345678",
  "message": "Alright, I’ve added that. Your total comes to ₦12,500 including service fee."
}
```

### Example 3: Create Order

```json
{
  "user_id": "2348012345678",
  "items": [
    {
      "name": "yam",
      "quantity": 3,
      "estimated_price": 3000
    }
  ],
  "total_amount": 12000,
  "service_fee": 500
}
```

### Example 4: Update Order

```json
{
  "status": "paid"
}
```

## Rate Limits

### MVP

- No application-level rate limiting

### Constraints

- WhatsApp API rate limits apply
- AI provider rate limits apply

## Best Practices

### 1. Message Handling

- Always acknowledge webhook quickly (<2s)
- Process asynchronously where possible

### 2. AI Integration

- Cache repeated queries where possible
- Handle AI failures gracefully

### 3. Performance

- Keep responses fast (<5 seconds)
- Avoid blocking operations in webhook

## Versioning

Current Version: 1.0
/v1/webhook/whatsapp
/v1/orders

## Changelog

### Version 1.0 (MVP)

- WhatsApp webhook integration
- AI conversational processing
- Order creation and management
- Payment-ready architecture
