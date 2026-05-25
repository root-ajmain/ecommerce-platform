# E-Commerce Platform — Build Guide

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

## 1. Clone & Install

```bash
git clone <your-repo>
cd E-Commerce
pnpm install
```

## 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your actual values
```

**Minimum required for local dev:**
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/ecommerce
DIRECT_URL=postgresql://postgres:password@localhost:5432/ecommerce
REDIS_URL=redis://localhost:6379
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_MASTER_KEY=masterkey
```

## 3. Start Infrastructure

```bash
cd docker
docker-compose up -d
# Starts: PostgreSQL, Redis, Meilisearch
```

## 4. Database Setup

```bash
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run migrations (dev)
pnpm db:seed          # Seed initial data
pnpm db:studio        # Optional: open Prisma Studio
```

## 5. Run Development Servers

```bash
pnpm dev
# Starts all apps concurrently via Turborepo:
# - apps/web    → http://localhost:3000
# - apps/admin  → http://localhost:3001
# - apps/api    → http://localhost:4000
# - API docs    → http://localhost:4000/api/docs
```

## 6. Production Build

```bash
pnpm build
```

## 7. Production Deployment

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy storefront
cd apps/web && vercel --prod

# Deploy admin
cd apps/admin && vercel --prod
```

**Vercel Environment Variables** (set in dashboard):
- All `NEXT_PUBLIC_*` vars
- `CLERK_SECRET_KEY`

### Backend (Railway / Docker)

```bash
# Build Docker image
docker build -f docker/Dockerfile.api -t ecommerce-api .

# Run
docker run -p 4000:4000 \
  --env-file .env \
  ecommerce-api
```

### Database Migrations (Production)
```bash
pnpm db:migrate:prod
```

## 8. CI/CD

Push to `main` branch triggers:
1. Typecheck + lint
2. Build all apps
3. Deploy API to Railway (Docker)
4. Deploy web + admin to Vercel

**Required GitHub Secrets:**
```
DATABASE_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_APP_URL
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_WEB_PROJECT_ID
VERCEL_ADMIN_PROJECT_ID
RAILWAY_TOKEN
RAILWAY_SERVICE_ID
DOCKER_REGISTRY
```

## 9. Payment Setup

### Stripe
1. Create account at stripe.com
2. Get keys from Dashboard → Developers → API Keys
3. Set up webhook: `POST /api/v1/payments/stripe/webhook`

### bKash
1. Register merchant at developer.bka.sh
2. Get sandbox credentials
3. Set `BKASH_IS_LIVE=false` for testing

### SSLCommerz
1. Register at sslcommerz.com
2. Get sandbox store_id/store_pass
3. Set `SSLCOMMERZ_IS_LIVE=false` for testing

## 10. Meilisearch Index

After seeding products, reindex:
```bash
curl -X POST http://localhost:4000/api/v1/search/reindex \
  -H "Authorization: Bearer <admin-token>"
```

## Architecture

```
E-Commerce/
├── apps/
│   ├── web/          # Next.js 15 storefront (port 3000)
│   ├── admin/        # Next.js 15 admin panel (port 3001)
│   └── api/          # NestJS backend (port 4000)
├── packages/
│   ├── db/           # Prisma schema + client
│   ├── types/        # Shared TypeScript types
│   └── config/       # Shared config
├── docker/           # Docker Compose + Dockerfiles
└── .github/          # CI/CD workflows
```

## Performance Targets

- Lighthouse: 95+
- First Contentful Paint: < 1.2s
- Largest Contentful Paint: < 2.5s
- API response time: < 100ms (cached), < 300ms (DB)
