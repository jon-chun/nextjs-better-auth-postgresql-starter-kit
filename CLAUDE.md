# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PlushifyMe is an AI-powered SaaS application that transforms photos into plushie versions. The project is currently in **Phase 1: UI-Only Development** - all functionality uses mock data with no backend integration. Phase 2 will add PostgreSQL, better-auth authentication, AI model integration, and payment processing.

## Development Commands

### Essential Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production bundle (validates TypeScript and checks for errors)
- `npm run start` - Start production server (requires build first)
- `npm run lint` - Run ESLint on TypeScript/TSX files
- `npm run format` - Format all code with Prettier

### Environment Setup

1. Copy `.env.example` to `.env` (currently only needs `NEXT_PUBLIC_APP_URL`)
2. Run `npm install` to install dependencies
3. All Phase 2 environment variables (database, auth, AI, payments) are commented out

## Architecture & Code Structure

### Next.js App Router Organization

The project uses Next.js 14+ App Router with route groups for organization:

- **`app/(marketing)/`** - Public-facing pages (landing, pricing, docs, FAQ, legal)
- **`app/(auth)/`** - Authentication pages (sign-in, sign-up) - UI only, no real auth
- **`app/(dashboard)/`** - Protected dashboard pages (gallery, generation UI, settings)
- **`app/layout.tsx`** - Root layout with SEO metadata and Inter font
- **`app/globals.css`** - Tailwind directives and CSS custom properties for theming

Route groups `(marketing)`, `(auth)`, and `(dashboard)` organize routes without affecting URLs.

### Component Architecture

Components follow shadcn/ui patterns but **no shadcn components are installed yet**. The project is set up to use:

- **`components/ui/`** - Future shadcn/ui primitives (Button, Card, Input, Dialog, etc.)
- **`components/marketing/`** - Landing page specific components
- **`components/dashboard/`** - Dashboard-specific components
- **`components/shared/`** - Reusable components used across multiple sections

### Key Libraries & Utilities

**`lib/utils.ts`**:

- `cn()` - Utility to merge Tailwind classes using `clsx` and `tailwind-merge`

**`lib/constants.ts`**:

- `PRICING_PLANS` - Basic ($9.95/30 credits), Pro ($19.95/100 credits), Elite ($29.95/200 credits)
- `PLUSHIE_STYLES` - Cute & Fluffy, Realistic Plush, Cartoon Style, Minimalist
- `IMAGE_UPLOAD` - Max 10MB, accepts JPEG/PNG/WebP
- `ROUTES` - All application routes centralized
- `SITE_CONFIG` - Site metadata and URLs

### Design System

**Brand Colors** (defined in `app/globals.css`):

- Primary: Purple/Pink (`--primary: 280 80% 60%`) - Main brand color for plushie vibe
- Accent: Pink (`--accent: 330 70% 65%`) - Playful accent for CTAs
- Secondary: Light gray - Clean, modern backgrounds

**Theming**:

- Uses HSL CSS custom properties (`--primary`, `--accent`, etc.)
- Dark mode supported via `.dark` class (tailwind `darkMode: ["class"]`)
- All colors use `hsl(var(--color-name))` pattern for easy theming

**Typography**:

- Font: Inter (Google Fonts) loaded in root layout
- TypeScript strict mode enabled

### Image Handling

**Next.js Image Configuration** (`next.config.js`):

- Supports AVIF and WebP formats for optimization
- Allows remote images from any HTTPS source (configured for Phase 2)
- Static images go in `public/images/`

### TypeScript Configuration

- **Strict mode enabled** (`"strict": true`)
- Path alias: `@/*` maps to project root
- Module resolution: `bundler` (Next.js optimized)

## Phase 1 Development Context

### Current Phase Constraints

- **No backend logic** - All data is mocked
- **No database** - PostgreSQL integration deferred to Phase 2
- **No real authentication** - Auth UI only, uses mock session data
- **No AI processing** - Image generation is simulated with placeholders
- **No payments** - Stripe integration planned for Phase 2

### Mock Data Strategy

When implementing features in Phase 1:

- Create mock data functions in `lib/` directory
- Simulate async operations with `setTimeout` for realistic UX
- Use TypeScript types that match future Phase 2 schemas
- Store mock data in constants or separate mock files

### Project Specifications

Detailed requirements and implementation checklists are in:

- `specs/plushify-me-ui/requirements.md` - Comprehensive feature requirements
- `specs/plushify-me-ui/implementation-plan.md` - Phase-by-phase implementation checklist

## Development Guidelines

### Code Style

- **Prettier** configured with 2-space indentation, semicolons, double quotes
- **ESLint** uses Next.js recommended config with TypeScript rules
- Unused variables starting with `_` are allowed (common for Next.js props)

### Component Patterns

When creating new components:

1. Use TypeScript with explicit prop types
2. Follow shadcn/ui patterns (Radix UI primitives + Tailwind styling)
3. Use the `cn()` utility for conditional class merging
4. Prefer composition over prop drilling
5. Keep components in appropriate directories based on scope

### Routing & Navigation

- Use Next.js `<Link>` component for navigation
- Import route constants from `lib/constants.ts` (e.g., `ROUTES.DASHBOARD`)
- Route groups don't affect URLs: `(dashboard)/gallery/page.tsx` → `/gallery`

### Styling Approach

- Tailwind-first: Use utility classes for all styling
- Responsive: Mobile-first breakpoints (sm, md, lg, xl, 2xl)
- Accessibility: Use semantic HTML and ARIA attributes
- Animations: Use Tailwind animations or CSS custom properties

### Next.js Specific

- Use `"use client"` directive only when necessary (interactivity, hooks, browser APIs)
- Prefer Server Components for static/data-fetching components
- Use Next.js Image component for all images with proper width/height or fill
- Implement proper loading states and error boundaries

## Future Phase 2 Integration Points

When transitioning to Phase 2, the following will be added:

- **Database**: PostgreSQL with Prisma/Drizzle ORM
- **Authentication**: better-auth with email/OAuth providers
- **AI Model**: Integration with image generation API
- **Payments**: Stripe for credit purchases
- **Storage**: Cloud storage for generated images (S3/Cloudflare R2)

Code should be structured to make these integrations straightforward (e.g., separating UI from data fetching, using TypeScript interfaces that can be swapped for real schemas).
