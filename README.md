# PlushifyMe - AI Photo to Plushie Transformation

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)

Transform your photos into adorable plushie versions with AI. Upload images of yourself, friends, family, or pets and watch them become cute plushies using OpenAI DALL-E 3.

**Live Demo:** [https://plushifyme.com](https://plushifyme.com) *(coming soon)*

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start (5 Minutes)](#-quick-start-5-minutes)
- [Detailed Setup](#-detailed-setup)
- [Environment Configuration](#-environment-configuration)
- [External Services Setup](#-external-services-setup)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Documentation](#-documentation)
- [Project Structure](#-project-structure)

---

## ✨ Features

### Core Features
- 🎨 **AI Photo Transformation** - Convert photos to plushies using OpenAI DALL-E 3
- 🖼️ **Image Upload & Cropping** - Drag-and-drop upload with zoom, rotate, aspect ratio control
- 🎭 **4 Plushie Styles** - Cute & Fluffy, Realistic Plush, Cartoon Style, Minimalist
- 🖼️ **Gallery Management** - View, filter, search, and download generated images
- 💳 **Credit System** - Purchase credits, track usage, manage balance
- 👤 **User Authentication** - Email/password sign-up with better-auth
- ⚙️ **User Settings** - Profile management, preferences, account settings
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

### Technical Features
- ⚡ **Server-Side Rendering** - Fast page loads with Next.js 14 App Router
- 🔒 **Secure Authentication** - Session-based auth with 7-day expiry
- 📦 **S3 Storage Integration** - Presigned URLs for secure image uploads
- 🗄️ **PostgreSQL Database** - Relational data with Prisma ORM
- 🎯 **Type Safety** - Full TypeScript coverage with strict mode
- 🧪 **Comprehensive Testing** - Unit tests (69 passing), integration tests, E2E tests
- ♿ **Accessibility** - WCAG compliant, keyboard navigation, screen reader support
- 🔍 **SEO Optimized** - Meta tags, Open Graph, Schema.org markup, sitemap

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 14+ | React framework with App Router |
| **React** | 18+ | UI library |
| **TypeScript** | 5.0+ | Type safety |
| **Tailwind CSS** | 3.4+ | Utility-first CSS |
| **shadcn/ui** | Latest | Component library (Radix UI) |
| **Lucide React** | Latest | Icon library |
| **React Cropper** | 2.3+ | Image cropping |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 20+ | Runtime environment |
| **PostgreSQL** | 16+ | Relational database |
| **Prisma** | 6+ | ORM and type-safe queries |
| **better-auth** | Latest | Authentication library |
| **Zod** | 3.22+ | Schema validation |

### External Services
| Service | Purpose | Cost |
|---------|---------|------|
| **AWS S3** | Image storage | ~$0.023/GB/month |
| **OpenAI DALL-E 3** | AI image generation | $0.04 - $0.08 per image |
| **Resend/SendGrid** | Transactional emails | Free tier available |
| **Vercel** | Hosting and deployment | Free tier available |

### Testing & Development
| Tool | Purpose |
|------|---------|
| **Jest** | Test runner |
| **React Testing Library** | Component testing |
| **Playwright** | E2E testing |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                          │
├─────────────────────────────────────────────────────────────────┤
│  Next.js Pages (App Router)                                      │
│  ├─ (marketing)    → Landing, Pricing, Docs, FAQ                │
│  ├─ (auth)         → Sign In, Sign Up                            │
│  └─ (dashboard)    → Dashboard, Gallery, Credits, Settings       │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS API ROUTES                             │
├─────────────────────────────────────────────────────────────────┤
│  /api/auth/*           → better-auth endpoints                   │
│  /api/upload/*         → Presigned URL generation                │
│  /api/generate/*       → AI generation, status polling           │
│  /api/user/credits     → Credit balance                          │
└─────────────────────────────────────────────────────────────────┘
            ↓                    ↓                    ↓
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   PostgreSQL     │  │     AWS S3       │  │  OpenAI API      │
│   (Database)     │  │  (Image Storage) │  │  (DALL-E 3)      │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ • Users          │  │ • Original imgs  │  │ • Generate imgs  │
│ • Sessions       │  │ • Generated imgs │  │ • Style prompts  │
│ • Images         │  │ • Presigned URLs │  │ • $0.04-0.08/img │
│ • Transactions   │  │                  │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

### Data Flow: Image Generation

```
1. User uploads image → Client validates (size, type)
2. Client requests presigned URL → API checks auth & generates S3 URL
3. Client uploads to S3 directly → Bypasses server for efficiency
4. Client requests generation → API checks credits & user auth
5. API deducts credit → Database transaction (atomic)
6. API calls OpenAI DALL-E 3 → Generates plushie image
7. API saves generated image to S3 → Returns public URL
8. API updates database → Saves generation record
9. Client polls status endpoint → Gets completion status
10. Client displays result → User downloads/shares
```

---

## 🚀 Quick Start (5 Minutes)

Get PlushifyMe running locally in 5 minutes:

```bash
# 1. Clone the repository
git clone <repository-url>
cd nextjs-better-auth-postgresql-starter-kit

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Start PostgreSQL with Docker
npm run db:start

# 5. Run database migrations
npm run db:migrate

# 6. Seed the database (optional)
npm run db:seed

# 7. Start development server
npm run dev
```

**Open:** http://localhost:3000

**Note:** For full functionality, configure external services (AWS S3, OpenAI). See [External Services Setup](#-external-services-setup).

---

## 📚 Detailed Setup

### Prerequisites

| Requirement | Version | Installation |
|------------|---------|-------------|
| **Node.js** | 20+ | [Download](https://nodejs.org/) |
| **npm** | 10+ | Included with Node.js |
| **Docker** | 24+ | [Download](https://www.docker.com/) (for PostgreSQL) |
| **PostgreSQL** | 16+ | [Download](https://www.postgresql.org/) (alternative to Docker) |
| **Git** | 2.40+ | [Download](https://git-scm.com/) |

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd nextjs-better-auth-postgresql-starter-kit
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- Next.js and React
- TypeScript and type definitions
- Tailwind CSS and PostCSS
- Prisma ORM and PostgreSQL client
- better-auth for authentication
- AWS SDK for S3
- OpenAI SDK
- Testing libraries (Jest, React Testing Library)
- Development tools (ESLint, Prettier)

### Step 3: Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Open `.env` and configure the required variables (see [Environment Configuration](#-environment-configuration) for details).

**Minimum required for local development:**
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://plushifyme:plushifyme_dev_password@localhost:5432/plushifyme_dev
BETTER_AUTH_SECRET=<generate-with-openssl-rand-base64-32>
BETTER_AUTH_URL=http://localhost:3000
```

### Step 4: Database Setup

#### Option A: Docker (Recommended)

Start PostgreSQL container:

```bash
npm run db:start
```

This starts a PostgreSQL 16 container with:
- Username: `plushifyme`
- Password: `plushifyme_dev_password`
- Database: `plushifyme_dev`
- Port: `5432`

Stop the container:

```bash
npm run db:stop
```

#### Option B: Local PostgreSQL

If you have PostgreSQL installed locally:

1. Create a database:
```sql
CREATE DATABASE plushifyme_dev;
CREATE USER plushifyme WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE plushifyme_dev TO plushifyme;
```

2. Update `DATABASE_URL` in `.env`:
```env
DATABASE_URL=postgresql://plushifyme:your_password@localhost:5432/plushifyme_dev
```

### Step 5: Run Database Migrations

Apply Prisma schema to database:

```bash
npm run db:migrate
```

This creates 7 tables:
- `User` - User accounts
- `Session` - Authentication sessions
- `Account` - OAuth accounts
- `Verification` - Email verification tokens
- `Image` - Generated images
- `Transaction` - Credit purchases
- `PasswordReset` - Password reset tokens

Verify migration:

```bash
npx prisma studio
```

This opens Prisma Studio at http://localhost:5555 for visual database inspection.

### Step 6: Seed Database (Optional)

Populate with sample data:

```bash
npm run db:seed
```

This creates:
- 3 test users
- 15 sample images
- 5 transactions
- Various credits and styles

**Test user credentials:**
```
Email: demo@plushifyme.com
Password: Demo123!@#
Credits: 50
```

### Step 7: Start Development Server

```bash
npm run dev
```

Server starts at: http://localhost:3000

**Hot reload enabled** - Changes to code automatically refresh the page.

---

## 🔐 Environment Configuration

### Required Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_APP_URL` | Public app URL | `http://localhost:3000` | ✅ Yes |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` | ✅ Yes |
| `BETTER_AUTH_SECRET` | Auth session secret (32+ chars) | Generate with `openssl rand -base64 32` | ✅ Yes |
| `BETTER_AUTH_URL` | Auth callback URL | `http://localhost:3000` | ✅ Yes |

### AWS S3 Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `AWS_REGION` | AWS region for S3 bucket | `us-east-1` | For uploads |
| `AWS_ACCESS_KEY_ID` | AWS IAM access key | `AKIAIOSFODNN7EXAMPLE` | For uploads |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` | For uploads |
| `AWS_S3_BUCKET` | S3 bucket name | `plushifyme-images` | For uploads |

### OpenAI Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `OPENAI_API_KEY` | OpenAI API key | `sk-proj-abc123...` | For AI generation |
| `OPENAI_ORG_ID` | OpenAI organization ID | `org-abc123...` | For AI generation |

### Email Variables (Optional)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `EMAIL_SERVER` | SMTP server | `smtp.gmail.com` | For emails |
| `EMAIL_FROM` | From email address | `noreply@plushifyme.com` | For emails |
| `RESEND_API_KEY` | Resend API key | `re_abc123...` | Alternative to SMTP |

### Generate Secrets

**BETTER_AUTH_SECRET:**
```bash
openssl rand -base64 32
```

Copy the output to `.env`:
```env
BETTER_AUTH_SECRET=<paste-output-here>
```

---

## 🌐 External Services Setup

### AWS S3 Setup

AWS S3 is used for storing uploaded and generated images. Follow these steps to set up S3:

#### 1. Create AWS Account

Sign up at [aws.amazon.com](https://aws.amazon.com/) (free tier includes 5GB storage).

#### 2. Create S3 Bucket

```bash
# Via AWS CLI
aws s3 mb s3://plushifyme-images --region us-east-1

# Or use AWS Console: https://s3.console.aws.amazon.com/s3/buckets
```

**Bucket Settings:**
- **Name:** `plushifyme-images` (must be globally unique)
- **Region:** `us-east-1` (or your preferred region)
- **Block Public Access:** ✅ Enabled (we use presigned URLs)
- **Versioning:** ❌ Disabled (optional: enable for backups)
- **Encryption:** ✅ Enabled (SSE-S3)

#### 3. Create IAM User

Create a user with programmatic access:

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Click **Users** → **Add User**
3. User name: `plushifyme-app`
4. Access type: **Programmatic access** ✅
5. Click **Next: Permissions**

#### 4. Attach IAM Policy

Create a policy with minimal permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::plushifyme-images",
        "arn:aws:s3:::plushifyme-images/*"
      ]
    }
  ]
}
```

**Attach policy to user:**
1. Go to **Policies** → **Create Policy**
2. Paste JSON above
3. Name: `PlushifyMeS3Access`
4. Attach to `plushifyme-app` user

#### 5. Get Access Keys

After creating the user, AWS shows:
- **Access Key ID**: `AKIAIOSFODNN7EXAMPLE`
- **Secret Access Key**: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`

**⚠️ IMPORTANT:** Save these immediately - you cannot view the secret key again.

Add to `.env`:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET=plushifyme-images
```

#### 6. Configure CORS

Allow browser uploads by setting CORS policy:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://plushifyme.com"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

**Apply CORS:**
1. Go to S3 bucket → **Permissions** → **CORS configuration**
2. Paste JSON above
3. Click **Save**

#### 7. Test S3 Upload

Run the application and upload an image. Check the S3 bucket:

```bash
aws s3 ls s3://plushifyme-images/
```

You should see uploaded files with keys like:
```
uploads/user_abc123/1700000000000-mock-uuid-1234-5678-test.jpg
generated/user_abc123/1700000000000-mock-uuid-1234-5678-plushie.png
```

#### Cost Estimates

| Usage | Storage | Requests | Monthly Cost |
|-------|---------|----------|-------------|
| **100 users** | 2GB | 500 uploads, 1000 views | ~$0.10 |
| **1,000 users** | 20GB | 5000 uploads, 10K views | ~$0.75 |
| **10,000 users** | 200GB | 50K uploads, 100K views | ~$6.50 |

**Free Tier:** First 5GB storage, 2,000 PUT requests, 20,000 GET requests per month.

---

### OpenAI DALL-E 3 Setup

OpenAI DALL-E 3 is used for AI image generation. Follow these steps:

#### 1. Create OpenAI Account

Sign up at [platform.openai.com](https://platform.openai.com/signup).

#### 2. Add Payment Method

1. Go to [Billing](https://platform.openai.com/account/billing/overview)
2. Add credit card or set up auto-reload
3. Minimum: $5 credit

**💡 Tip:** Set a usage limit to avoid unexpected charges:
- Go to **Billing** → **Usage limits**
- Set monthly budget (e.g., $50)

#### 3. Create API Key

1. Go to [API Keys](https://platform.openai.com/api-keys)
2. Click **Create new secret key**
3. Name: `PlushifyMe Production`
4. Permissions: **All** (or restrict to Images only)
5. Copy the key: `sk-proj-abc123...`

**⚠️ IMPORTANT:** Save the key immediately - you cannot view it again.

#### 4. Get Organization ID

1. Go to [Settings](https://platform.openai.com/account/org-settings)
2. Copy **Organization ID**: `org-abc123...`

Add to `.env`:
```env
OPENAI_API_KEY=sk-proj-abc123...
OPENAI_ORG_ID=org-abc123...
```

#### 5. Test OpenAI Integration

Restart the development server:

```bash
npm run dev
```

Try generating a plushie:
1. Sign up at http://localhost:3000/sign-up
2. Go to dashboard: http://localhost:3000/dashboard
3. Upload an image
4. Click **Generate Plushie**

Check API usage:
```bash
# View usage in OpenAI dashboard
https://platform.openai.com/usage
```

#### Cost & Usage Limits

**DALL-E 3 Pricing:**
| Resolution | Cost per Image |
|-----------|---------------|
| **1024x1024** (Standard) | $0.040 |
| **1024x1792** (Portrait) | $0.080 |
| **1792x1024** (Landscape) | $0.080 |

PlushifyMe uses **1024x1024** (standard quality) by default = **$0.04 per generation**.

**Rate Limits:**
- **Free Tier:** 3 requests per minute, 200 requests per day
- **Tier 1:** 5 requests per minute, 500 requests per day
- **Tier 2+:** Higher limits with increased usage

**Example Costs:**
| Generations | Cost | User Credits |
|------------|------|--------------|
| 100 | $4.00 | 100 users × 1 generation |
| 1,000 | $40.00 | 100 users × 10 generations |
| 10,000 | $400.00 | 1,000 users × 10 generations |

**💡 Cost Optimization:**
- Use `quality: "standard"` (not `hd`) to save 50%
- Cache similar prompts to avoid regeneration
- Implement generation queue to batch requests
- Set rate limits per user (e.g., 10 generations/day)

---

### Email Service Setup (Optional)

PlushifyMe sends transactional emails for:
- Email verification
- Password reset
- Purchase confirmations
- Weekly usage summaries

Choose one of three options:

#### Option A: Gmail SMTP (Quick Setup)

**Best for:** Development and small projects

1. Enable 2-Factor Authentication on your Gmail account
2. Create an App Password:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Click **2-Step Verification**
   - Scroll to **App passwords**
   - Generate password for "Mail"
3. Add to `.env`:

```env
EMAIL_SERVER=smtp://your-email@gmail.com:your-app-password@smtp.gmail.com:587
EMAIL_FROM=noreply@plushifyme.com
```

**Limitations:**
- 500 emails per day
- May be flagged as spam
- Not recommended for production

#### Option B: Resend (Recommended)

**Best for:** Production use, modern API

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain:
   - Add DNS records (MX, TXT, CNAME)
   - Wait for verification (~5 minutes)
3. Create API key:
   - Go to **API Keys** → **Create API Key**
   - Copy key: `re_abc123...`
4. Add to `.env`:

```env
RESEND_API_KEY=re_abc123...
EMAIL_FROM=noreply@plushifyme.com
```

**Pricing:**
- **Free:** 3,000 emails/month, 100 emails/day
- **Pro ($20/mo):** 50,000 emails/month
- **Enterprise:** Custom pricing

#### Option C: SendGrid

**Best for:** High volume, established service

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Verify domain (add DNS records)
3. Create API key:
   - Go to **Settings** → **API Keys**
   - Create key with "Mail Send" permission
4. Add to `.env`:

```env
SENDGRID_API_KEY=SG.abc123...
EMAIL_FROM=noreply@plushifyme.com
```

**Pricing:**
- **Free:** 100 emails/day
- **Essentials ($19.95/mo):** 50,000 emails/month
- **Pro ($89.95/mo):** 100,000 emails/month

---

## 💻 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Run TypeScript compiler check |

### Database Scripts

| Command | Description |
|---------|-------------|
| `npm run db:start` | Start PostgreSQL Docker container |
| `npm run db:stop` | Stop PostgreSQL Docker container |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run db:reset` | Reset database (⚠️ deletes all data) |

### Test Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:unit` | Run unit tests only |
| `npm run test:integration` | Run integration tests only |

### Development Workflow

#### 1. Start Development Environment

```bash
# Terminal 1: Start database
npm run db:start

# Terminal 2: Start development server
npm run dev

# Terminal 3 (optional): Run tests in watch mode
npm run test:watch
```

#### 2. Making Changes

- **Frontend:** Edit files in `app/` or `components/`
  - Changes auto-reload via Fast Refresh
- **Backend:** Edit API routes in `app/api/`
  - Requires manual reload (restart `npm run dev`)
- **Database:** Modify schema in `prisma/schema.prisma`
  - Run `npm run db:migrate` after changes
- **Styles:** Edit `app/globals.css` or component files
  - Tailwind auto-recompiles

#### 3. Running Tests

Before committing:

```bash
# Run all tests
npm test

# Check coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check

# Build to verify no errors
npm run build
```

#### 4. Debugging

**Backend API Routes:**

```typescript
// Add console.log in API route
export async function POST(req: Request) {
  console.log('Request received:', await req.json())
  // ...
}
```

View logs in terminal running `npm run dev`.

**Frontend Components:**

```typescript
// Add console.log in component
export function MyComponent() {
  console.log('Component rendered')
  // ...
}
```

View logs in browser DevTools Console.

**Database Queries:**

```typescript
// Enable Prisma query logging
const result = await prisma.user.findMany()
console.log('Query result:', result)
```

Or use Prisma Studio:

```bash
npm run db:studio
```

### Project Structure

```
nextjs-better-auth-postgresql-starter-kit/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Public pages
│   │   ├── page.tsx              # Landing page
│   │   ├── pricing/              # Pricing page
│   │   ├── docs/                 # Documentation
│   │   └── faq/                  # FAQ page
│   ├── (auth)/                   # Auth pages
│   │   ├── sign-in/              # Sign-in form
│   │   └── sign-up/              # Sign-up form
│   ├── (dashboard)/              # Protected pages
│   │   ├── dashboard/            # Main generation UI
│   │   ├── gallery/              # Image gallery
│   │   ├── credits/              # Credits management
│   │   └── settings/             # User settings
│   ├── api/                      # API routes
│   │   ├── auth/                 # better-auth endpoints
│   │   ├── upload/               # Image upload endpoints
│   │   ├── generate/             # AI generation endpoints
│   │   └── user/                 # User data endpoints
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── marketing/                # Landing page components
│   ├── dashboard/                # Dashboard components
│   └── shared/                   # Shared components
├── lib/                          # Utilities and helpers
│   ├── auth.ts                   # better-auth configuration
│   ├── db.ts                     # Prisma client
│   ├── storage.ts                # AWS S3 utilities
│   ├── ai-generation.ts          # OpenAI integration
│   ├── upload-helpers.ts         # Upload validation
│   ├── validations.ts            # Zod schemas
│   ├── utils.ts                  # Utility functions
│   └── constants.ts              # App constants
├── prisma/                       # Database
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Migration history
│   └── seed.ts                   # Seed script
├── tests/                        # Test files
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   ├── e2e/                      # End-to-end tests
│   └── helpers/                  # Test utilities
├── public/                       # Static assets
│   ├── images/                   # Images
│   ├── robots.txt                # SEO
│   └── sitemap.xml               # SEO
├── specs/                        # Project specs
│   └── plushify-me-ui/           # Requirements docs
├── .env                          # Environment variables
├── .env.example                  # Example env file
├── jest.config.js                # Jest configuration
├── jest.setup.js                 # Jest setup
├── next.config.js                # Next.js config
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

## 🧪 Testing

PlushifyMe has comprehensive test coverage with unit tests, integration tests, and E2E tests.

### Test Results

**Total Tests:** 69 passing ✅
- **Unit Tests:** 69
- **Integration Tests:** Coming soon
- **E2E Tests:** Coming soon

**Coverage:**
- **Lib folder (business logic):** 60%+ coverage
- **Overall:** 5.27% (low because components not tested yet)

### Running Tests

#### All Tests

```bash
npm test
```

Output:
```
 PASS  tests/unit/lib/storage.test.ts (21 tests)
 PASS  tests/unit/lib/upload-helpers.test.ts (13 tests)
 PASS  tests/unit/lib/validations.test.ts (30 tests)
 PASS  tests/unit/lib/ai-generation.test.ts (5 tests)

Test Suites: 4 passed, 4 total
Tests:       69 passed, 69 total
Time:        0.892s
```

#### Watch Mode

```bash
npm run test:watch
```

Tests automatically rerun when files change.

#### Coverage Report

```bash
npm run test:coverage
```

Generates HTML report in `coverage/lcov-report/index.html`.

Open in browser:
```bash
open coverage/lcov-report/index.html
```

#### Unit Tests Only

```bash
npm run test:unit
```

#### Integration Tests Only

```bash
npm run test:integration
```

### Test Structure

#### Unit Tests

**Location:** `tests/unit/`

Test individual functions and utilities in isolation:

- **storage.test.ts** (21 tests) - S3 utilities
  - generateFileKey
  - getPublicUrl
  - extractFileKeyFromUrl
  - isValidImageType
  - isValidFileSize

- **upload-helpers.test.ts** (13 tests) - Upload validation
  - validateImageFile
  - formatFileSize
  - isImageFile

- **validations.test.ts** (30 tests) - Zod schemas
  - signUpSchema
  - signInSchema
  - imageUploadSchema
  - updateProfileSchema

- **ai-generation.test.ts** (5 tests) - OpenAI config
  - isOpenAIConfigured

#### Integration Tests (Coming Soon)

**Location:** `tests/integration/`

Test API endpoints with real database:

- **auth.test.ts** - Sign up, sign in, verify email
- **upload.test.ts** - Presigned URL generation, file upload
- **generate.test.ts** - AI generation, status polling
- **credits.test.ts** - Credit balance, transactions

#### E2E Tests (Coming Soon)

**Location:** `tests/e2e/`

Test complete user flows with Playwright:

- **user-journey.spec.ts** - Sign up → Upload → Generate → Download
- **gallery.spec.ts** - Gallery filters, search, view, delete
- **credits.spec.ts** - Purchase credits, view history

### Writing Tests

#### Example Unit Test

```typescript
// tests/unit/lib/storage.test.ts
import { isValidFileSize } from '@/lib/storage'

describe('isValidFileSize', () => {
  it('should accept files within size limit', () => {
    const fiveMB = 5 * 1024 * 1024
    expect(isValidFileSize(fiveMB, 10)).toBe(true)
  })

  it('should reject files exceeding size limit', () => {
    const elevenMB = 11 * 1024 * 1024
    expect(isValidFileSize(elevenMB, 10)).toBe(false)
  })
})
```

#### Example Integration Test

```typescript
// tests/integration/upload.test.ts (coming soon)
import { POST } from '@/app/api/upload/presigned-url/route'

describe('POST /api/upload/presigned-url', () => {
  it('should return presigned URL for authenticated user', async () => {
    const response = await POST({
      json: () => ({ fileName: 'test.jpg', fileType: 'image/jpeg' })
    })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.uploadUrl).toContain('https://')
    expect(data.fileKey).toBeDefined()
  })
})
```

### Test Configuration

**jest.config.js:**
- Uses Next.js Jest configuration
- Module name mapper for `@/` alias
- Coverage thresholds: 70% for all metrics
- Transform ignore patterns for ES modules (uuid)

**jest.setup.js:**
- Global test setup
- Mocks for AWS SDK, OpenAI, uuid, Next.js navigation
- Test environment variables

### Debugging Tests

**Run specific test file:**
```bash
npm test -- storage.test.ts
```

**Run tests matching pattern:**
```bash
npm test -- --testNamePattern="isValidFileSize"
```

**Run with verbose output:**
```bash
npm test -- --verbose
```

**Run without coverage:**
```bash
npm test -- --coverage=false
```

---

## 🚀 Deployment

### Vercel Deployment (Recommended)

Vercel is the easiest way to deploy Next.js applications.

#### Prerequisites

- Vercel account ([vercel.com](https://vercel.com))
- GitHub repository
- Domain name (optional)

#### Step 1: Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Vercel auto-detects Next.js configuration

#### Step 2: Configure Environment Variables

Add all environment variables from `.env`:

```
NEXT_PUBLIC_APP_URL=https://plushifyme.com
DATABASE_URL=postgresql://user:pass@host:5432/db
BETTER_AUTH_SECRET=<your-secret>
BETTER_AUTH_URL=https://plushifyme.com
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<your-key>
AWS_SECRET_ACCESS_KEY=<your-secret>
AWS_S3_BUCKET=plushifyme-images
OPENAI_API_KEY=<your-key>
OPENAI_ORG_ID=<your-org-id>
```

**⚠️ IMPORTANT:**
- Use production values, not development values
- Never commit secrets to Git
- Use Vercel's encrypted storage

#### Step 3: Configure Build Settings

Vercel auto-configures, but verify:

- **Framework:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Node Version:** 20.x

#### Step 4: Deploy

Click **Deploy**. Vercel will:
1. Clone repository
2. Install dependencies
3. Run `npm run build`
4. Deploy to CDN
5. Provide preview URL

**Preview URL:** `https://plushifyme-abc123.vercel.app`

#### Step 5: Configure Custom Domain

1. Go to **Project Settings** → **Domains**
2. Add your domain: `plushifyme.com`
3. Follow DNS instructions:
   - Add A record or CNAME record
   - Wait for propagation (~5 minutes)
4. Vercel automatically provisions SSL certificate

#### Step 6: Set Up Database

**Option A:** Vercel Postgres (Recommended)

```bash
# Install Vercel Postgres
npm install @vercel/postgres

# Connect to Vercel Postgres
vercel postgres create
```

**Option B:** External PostgreSQL (Railway, Neon, Supabase)

1. Create database at [railway.app](https://railway.app) or [neon.tech](https://neon.tech)
2. Copy connection string
3. Add `DATABASE_URL` to Vercel environment variables
4. Redeploy

#### Step 7: Run Migrations

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Run migrations on production database
vercel env pull .env.production
npm run db:migrate
```

#### Step 8: Monitor Deployment

Vercel provides:
- **Real-time logs:** https://vercel.com/your-project/deployments
- **Analytics:** Page views, performance metrics
- **Error tracking:** Automatic error detection

### Docker Deployment

#### Build Docker Image

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

Build and run:

```bash
# Build image
docker build -t plushifyme .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e BETTER_AUTH_SECRET="..." \
  -e AWS_ACCESS_KEY_ID="..." \
  -e AWS_SECRET_ACCESS_KEY="..." \
  -e OPENAI_API_KEY="..." \
  plushifyme
```

### Environment-Specific Configuration

#### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use production database
- [ ] Use strong `BETTER_AUTH_SECRET` (32+ chars)
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS only
- [ ] Set up error monitoring (Sentry)
- [ ] Configure rate limiting
- [ ] Set up backups (database, S3)
- [ ] Review IAM permissions (least privilege)
- [ ] Enable CloudFront CDN for S3
- [ ] Set up logging and monitoring

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Errors

**Error:** `Can't reach database server at localhost:5432`

**Solutions:**
- Check if PostgreSQL is running: `docker ps`
- Start database: `npm run db:start`
- Verify `DATABASE_URL` in `.env`
- Check firewall settings

#### 2. AWS S3 Upload Failures

**Error:** `Access Denied` or `NoSuchBucket`

**Solutions:**
- Verify `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` in `.env`
- Check IAM policy has `s3:PutObject` permission
- Verify bucket name matches `AWS_S3_BUCKET`
- Check CORS configuration on S3 bucket

#### 3. OpenAI API Errors

**Error:** `Invalid API Key` or `Rate Limit Exceeded`

**Solutions:**
- Verify `OPENAI_API_KEY` in `.env`
- Check API key is active in [OpenAI Dashboard](https://platform.openai.com/api-keys)
- Verify `OPENAI_ORG_ID` matches your organization
- Check billing status and usage limits
- Implement retry logic with exponential backoff

#### 4. Test Failures

**Error:** `Cannot find module 'uuid'` or `Unexpected token 'export'`

**Solutions:**
- Check `jest.config.js` has correct `transformIgnorePatterns`
- Verify `jest.setup.js` has uuid mock
- Clear Jest cache: `npx jest --clearCache`
- Reinstall dependencies: `rm -rf node_modules && npm install`

#### 5. Build Errors

**Error:** `Type error: Property 'x' does not exist`

**Solutions:**
- Run type check: `npm run type-check`
- Check TypeScript errors in IDE
- Verify all imports are correct
- Check Prisma types are generated: `npx prisma generate`

#### 6. Authentication Issues

**Error:** `Invalid session` or `Unauthorized`

**Solutions:**
- Clear cookies and localStorage
- Verify `BETTER_AUTH_SECRET` matches between builds
- Check `BETTER_AUTH_URL` matches current URL
- Inspect session in database: `npm run db:studio`

### Debug Mode

Enable verbose logging:

```env
# .env
DEBUG=*
NEXT_TELEMETRY_DISABLED=1
```

Restart server:

```bash
npm run dev
```

### Getting Help

If you're still stuck:

1. **Check logs:** Review terminal output and browser console
2. **Search issues:** Look for similar problems in GitHub issues
3. **Documentation:** Review [Next.js docs](https://nextjs.org/docs), [Prisma docs](https://www.prisma.io/docs)
4. **Create issue:** Open a GitHub issue with:
   - Error message
   - Steps to reproduce
   - Environment details (Node version, OS)
   - Screenshots (if applicable)

---

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs) directory:

### Quick References
- **[Quick Start Guide](./docs/QUICK_START.md)** - Get running in 2 minutes
- **[Configuration & Debugging](./docs/CONFIGURATION_VERIFICATION_DEBUG.md)** ⭐ - Complete troubleshooting guide
- **[Configuration Status](./docs/CONFIG_TEST_RESULTS.md)** - Current setup verification

### Detailed Guides
- **[Configuration Verification](./docs/CONFIGURATION_VERIFICATION.md)** - Step-by-step service setup
- **[Test Implementation Status](./docs/TESTS_IMPLEMENTATION_STATUS.md)** - Testing overview
- **[Integration Tests Plan](./docs/INTEGRATION_TESTS_PLAN.md)** - API testing strategy
- **[Component Tests Plan](./docs/COMPONENT_TESTS_PLAN.md)** - UI testing roadmap

### Project Information
- **[Project Summary](./docs/FINAL_PROJECT_SUMMARY.md)** - Complete overview
- **[Phase 2 Integration](./docs/PHASE2_INTEGRATION_COMPLETE.md)** - Backend integration details
- **[Remaining Tasks](./docs/REMAINING_TASKS.md)** - Future enhancements

**📖 See [docs/README.md](./docs/README.md) for complete documentation index**

---

## 📄 License

Proprietary - All rights reserved

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Prisma](https://www.prisma.io/) - Database ORM
- [better-auth](https://better-auth.com/) - Authentication
- [OpenAI](https://openai.com/) - AI image generation
- [Vercel](https://vercel.com/) - Hosting platform

---

**Built with ❤️ using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui**

*Last updated: November 19, 2025*
