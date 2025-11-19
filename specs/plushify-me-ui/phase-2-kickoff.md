# Phase 2: Backend Integration Kickoff Plan

## Overview

Phase 2 transforms PlushifyMe from a UI-only demo into a fully functional SaaS application with:
- **Real user authentication** (better-auth)
- **PostgreSQL database** for persistent data
- **AI image generation** via external API
- **Payment processing** through Stripe
- **Cloud image storage** (S3/Cloudflare R2)

**Estimated Timeline:** 8-12 weeks (200-300 hours)
**Recommended Team:** 1-2 full-stack developers + 1 DevOps engineer

---

## Phase 2 Sub-Phases

### 2.1: Database Setup (Week 1-2)
### 2.2: Authentication Integration (Week 2-3)
### 2.3: Image Storage & Upload (Week 3-4)
### 2.4: AI Model Integration (Week 4-6)
### 2.5: Payment Processing (Week 6-7)
### 2.6: API Routes & Business Logic (Week 7-9)
### 2.7: Security & Validation (Week 9-10)
### 2.8: Testing & QA (Week 10-11)
### 2.9: Deployment & DevOps (Week 11-12)

---

## Database Schema Design

### Technology Choice
**Recommended:** Prisma ORM with PostgreSQL
- Type-safe database access
- Automatic migrations
- Excellent TypeScript integration
- Active community support

**Alternative:** Drizzle ORM (lighter weight, more control)

### Schema Tables

#### 1. Users Table
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  emailVerified DateTime?
  image         String?
  credits       Int       @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  accounts      Account[]
  sessions      Session[]
  images        GeneratedImage[]
  transactions  Transaction[]
  settings      UserSettings?
}
```

#### 2. Accounts Table (better-auth)
```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
```

#### 3. Sessions Table (better-auth)
```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### 4. Generated Images Table
```prisma
model GeneratedImage {
  id              String   @id @default(cuid())
  userId          String
  originalUrl     String   // S3/R2 URL
  generatedUrl    String   // S3/R2 URL
  style           String   // "cute-fluffy", "realistic-plush", etc.
  prompt          String?
  status          String   @default("pending") // "pending", "processing", "completed", "failed"
  errorMessage    String?
  processingTime  Int?     // milliseconds
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([status])
}
```

#### 5. Transactions Table
```prisma
model Transaction {
  id              String   @id @default(cuid())
  userId          String
  type            String   // "purchase", "generation"
  credits         Int      // positive for purchase, negative for usage
  amount          Decimal? @db.Decimal(10, 2) // USD amount (only for purchases)
  description     String
  stripePaymentId String?  @unique
  status          String   @default("completed") // "pending", "completed", "failed", "refunded"
  metadata        Json?    // additional data
  createdAt       DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([type])
}
```

#### 6. User Settings Table
```prisma
model UserSettings {
  id               String   @id @default(cuid())
  userId           String   @unique
  defaultStyle     String   @default("cute-fluffy")
  emailNotifications Boolean @default(true)
  marketingEmails  Boolean  @default(false)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## Environment Variables Setup

### Create `.env` with these variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/plushifyme?schema=public"

# better-auth
AUTH_SECRET="your-random-secret-key-here" # Generate with: openssl rand -base64 32
AUTH_TRUST_HOST="true"

# Email Provider (Choose one)
# Option 1: Resend
EMAIL_FROM="noreply@plushifyme.com"
RESEND_API_KEY="re_..."

# Option 2: SendGrid
SENDGRID_API_KEY="SG..."

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."

# AI Image Generation
# Option 1: Replicate
REPLICATE_API_TOKEN="r8_..."

# Option 2: Stability AI
STABILITY_API_KEY="sk-..."

# Option 3: OpenAI DALL-E
OPENAI_API_KEY="sk-..."

# Cloud Storage
# Option 1: AWS S3
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
AWS_S3_BUCKET="plushifyme-images"

# Option 2: Cloudflare R2
R2_ACCOUNT_ID="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_NAME="plushifyme-images"

# Payment Processing
STRIPE_SECRET_KEY="sk_test_..." # or sk_live_ for production
STRIPE_PUBLISHABLE_KEY="pk_test_..." # or pk_live_ for production
STRIPE_WEBHOOK_SECRET="whsec_..." # For webhook signature verification

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000" # or production URL
NODE_ENV="development"
```

### Security Notes:
- **NEVER commit `.env` to git** (already in `.gitignore`)
- Use different keys for development/staging/production
- Rotate secrets regularly
- Use environment-specific Stripe keys

---

## API Routes Planning

### Authentication Routes (`app/api/auth/[...nextauth]/route.ts`)
- `POST /api/auth/signin` - Email/password sign-in
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/reset-password` - Password reset

### Image Routes
- `POST /api/images/upload` - Upload original image to S3/R2
- `POST /api/images/generate` - Trigger AI generation (queue job)
- `GET /api/images` - Get user's gallery (paginated)
- `GET /api/images/[id]` - Get single image details
- `DELETE /api/images/[id]` - Delete image and files
- `POST /api/images/[id]/download` - Download generated image

### Credit Routes
- `GET /api/credits/balance` - Get user's credit balance
- `GET /api/credits/history` - Get transaction history (paginated)

### Payment Routes
- `POST /api/payments/create-checkout` - Create Stripe checkout session
- `POST /api/payments/webhook` - Stripe webhook handler
- `GET /api/payments/plans` - Get pricing plans

### User Routes
- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update user profile
- `GET /api/user/settings` - Get user settings
- `PATCH /api/user/settings` - Update user settings
- `DELETE /api/user/account` - Delete user account

---

## First Steps Implementation Checklist

### Step 1: Install Dependencies
```bash
# ORM & Database
npm install prisma @prisma/client
npm install -D prisma

# Authentication
npm install better-auth
npm install @better-auth/react # for client hooks

# Email
npm install resend # or @sendgrid/mail

# Cloud Storage
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
# OR
npm install @cloudflare/workers-types

# Payment Processing
npm install stripe

# AI Generation
npm install replicate
# OR
npm install openai

# Utilities
npm install zod # for validation
npm install date-fns # for date formatting
npm install bcrypt @types/bcrypt # for password hashing
```

### Step 2: Initialize Prisma
```bash
# Initialize Prisma
npx prisma init

# This creates:
# - prisma/schema.prisma
# - .env (if doesn't exist)
```

### Step 3: Set Up Database Schema
1. Copy the schema from this document to `prisma/schema.prisma`
2. Update `DATABASE_URL` in `.env`
3. Run initial migration:
```bash
npx prisma migrate dev --name init
```

### Step 4: Generate Prisma Client
```bash
npx prisma generate
```

### Step 5: Set Up better-auth
Create `lib/auth.ts`:
```typescript
import { BetterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = new BetterAuth({
  database: prismaAdapter(prisma),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
});
```

### Step 6: Set Up S3/R2 Client
Create `lib/storage.ts`:
```typescript
import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const BUCKET_NAME = process.env.AWS_S3_BUCKET!;
```

### Step 7: Set Up Stripe
Create `lib/stripe.ts`:
```typescript
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
});
```

### Step 8: Create Database Utility
Create `lib/db.ts`:
```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

### Step 9: Create Validation Schemas
Create `lib/validations.ts`:
```typescript
import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

export const imageUploadSchema = z.object({
  style: z.enum(["cute-fluffy", "realistic-plush", "cartoon-style", "minimalist"]),
  prompt: z.string().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
});
```

---

## Migration Strategy: Mock Data to Real Data

### Phase 2.1: Database (Keep Mock UI)
1. Set up database and migrations
2. Keep UI using mock data
3. Test database connections separately

### Phase 2.2: Authentication (Hybrid)
1. Implement real auth backend
2. Add auth middleware for protected routes
3. Replace sign-in/sign-up pages with real forms
4. Keep dashboard using mock data until Phase 2.3

### Phase 2.3: Gallery Integration
1. Replace `lib/mock-data.ts` gallery with database queries
2. Update Gallery page to fetch from `/api/images`
3. Add pagination and real filters

### Phase 2.4: Generation Flow
1. Replace mock generation with real AI calls
2. Implement queue system (optional: use BullMQ or Inngest)
3. Add webhook handlers for completion

### Phase 2.5: Credits & Payments
1. Replace mock credits with database balance
2. Implement Stripe checkout flow
3. Add webhook handler for payment confirmation

---

## Testing Strategy

### Unit Tests (Vitest)
```bash
npm install -D vitest @vitejs/plugin-react
```

Test coverage:
- API route handlers
- Validation schemas
- Utility functions
- Auth helpers

### Integration Tests
- Database queries (use test database)
- API endpoints with mock Stripe/AI
- File upload/download flows

### E2E Tests (Playwright)
```bash
npm install -D @playwright/test
```

Test flows:
- Sign up → verify email → sign in
- Upload image → generate plushie → download
- Purchase credits → generate image

---

## Security Checklist

### Authentication
- ✅ Use bcrypt for password hashing (min 10 rounds)
- ✅ Implement rate limiting on auth endpoints
- ✅ Require email verification for new accounts
- ✅ Use secure session tokens (better-auth handles this)
- ✅ Implement CSRF protection

### API Routes
- ✅ Validate all inputs with Zod schemas
- ✅ Check user authentication on protected routes
- ✅ Verify user owns resources (images, transactions)
- ✅ Use parameterized queries (Prisma prevents SQL injection)
- ✅ Implement proper error handling (don't leak sensitive info)

### File Uploads
- ✅ Validate file types (JPEG, PNG, WebP only)
- ✅ Validate file sizes (10MB max)
- ✅ Scan for malicious files (optional: use ClamAV)
- ✅ Generate random filenames (prevent directory traversal)
- ✅ Use signed URLs for S3 access

### Stripe Integration
- ✅ Verify webhook signatures
- ✅ Use idempotency keys for payments
- ✅ Never trust client-side amounts (always verify server-side)
- ✅ Implement proper refund handling

### Environment Variables
- ✅ Never commit `.env` to git
- ✅ Use different keys for dev/staging/production
- ✅ Validate required env vars at startup
- ✅ Use Vercel Environment Variables for production

---

## Deployment Checklist

### Vercel Deployment (Recommended)
1. Push code to GitHub
2. Connect Vercel to repository
3. Add environment variables in Vercel dashboard
4. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
5. Set up PostgreSQL database (Vercel Postgres or external)
6. Run migrations on production database
7. Test production deployment

### Database Hosting Options
- **Vercel Postgres** (easiest, $20/mo)
- **Supabase** (free tier, generous limits)
- **Railway** ($5/mo, easy setup)
- **Neon** (serverless, free tier)

### File Storage Hosting
- **Cloudflare R2** ($0.015/GB, free egress)
- **AWS S3** ($0.023/GB, pay for egress)
- **Vercel Blob** (easiest integration, $0.15/GB)

---

## Cost Estimates (Monthly)

### Minimum Viable Product (100 users/month)
- **Hosting:** Vercel Pro ($20/mo)
- **Database:** Vercel Postgres ($20/mo) or Supabase (Free)
- **Storage:** Cloudflare R2 (~$5/mo for 100GB)
- **Email:** Resend (Free tier: 3k/mo)
- **AI Generation:** Replicate (~$50-100/mo depending on volume)
- **Stripe:** 2.9% + $0.30 per transaction
- **Total:** ~$95-145/mo

### Scale (1,000 users/month)
- **Hosting:** Vercel Pro ($20/mo)
- **Database:** Railway ($20-40/mo)
- **Storage:** Cloudflare R2 (~$20/mo for 500GB)
- **Email:** Resend Pro ($20/mo)
- **AI Generation:** Replicate (~$500/mo)
- **Stripe:** 2.9% + $0.30 per transaction
- **Total:** ~$580-620/mo + transaction fees

---

## Recommended Development Order

### Week 1-2: Foundation
1. Set up PostgreSQL database
2. Run Prisma migrations
3. Test database connections
4. Set up better-auth
5. Create basic API routes

### Week 3-4: Authentication
1. Implement sign-up/sign-in pages
2. Add email verification flow
3. Create protected route middleware
4. Test authentication flow end-to-end

### Week 5-6: Storage & Upload
1. Set up S3/R2 client
2. Create image upload API route
3. Test file upload and retrieval
4. Update dashboard upload UI to use real API

### Week 7-8: AI Integration
1. Choose AI provider (Replicate recommended)
2. Create generation API route
3. Implement queue system (optional)
4. Test image generation flow
5. Add webhook handlers

### Week 9-10: Payments
1. Set up Stripe account
2. Create checkout session API
3. Implement webhook handler
4. Test credit purchase flow
5. Add transaction history page

### Week 11: Testing & QA
1. Write unit tests
2. Write integration tests
3. Run E2E tests with Playwright
4. Fix bugs and edge cases

### Week 12: Deployment
1. Set up production database
2. Configure Vercel environment
3. Deploy to production
4. Monitor errors and performance

---

## Resources & Documentation

### Official Docs
- [Prisma Docs](https://www.prisma.io/docs)
- [better-auth Docs](https://better-auth.com/docs)
- [Stripe API Docs](https://stripe.com/docs/api)
- [AWS S3 SDK Docs](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/)
- [Replicate API Docs](https://replicate.com/docs)

### Tutorials
- [Next.js + Prisma Tutorial](https://www.prisma.io/nextjs)
- [Better Auth with Next.js](https://better-auth.com/docs/integrations/next-js)
- [Stripe Checkout Integration](https://stripe.com/docs/checkout/quickstart)
- [S3 Presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)

### Community
- [Next.js Discord](https://nextjs.org/discord)
- [Prisma Discord](https://pris.ly/discord)
- [Better Auth GitHub](https://github.com/better-auth/better-auth)

---

## Success Metrics

### Phase 2 Completion Criteria
- ✅ Users can sign up and sign in with email/password
- ✅ Users can upload images (stored in S3/R2)
- ✅ Users can generate plushie images (real AI processing)
- ✅ Users can purchase credits via Stripe
- ✅ All database queries work correctly
- ✅ All API routes return proper responses
- ✅ Error handling is robust
- ✅ Security best practices implemented
- ✅ Tests pass (80%+ coverage)
- ✅ App deployed to production and stable

---

**Next Steps:** Begin with Week 1-2 tasks. Set up local PostgreSQL database and run initial Prisma migration.
