# Architecture Documentation - Marjahans Jewellery E-Commerce Platform

## Overview

The Marjahans Jewellery e-commerce platform is built as a modern full-stack application using React, TypeScript, tRPC, and Drizzle ORM. This document describes the overall system architecture, design patterns, and technical decisions.

## System Architecture

### High-Level Architecture

The application follows a three-tier architecture pattern:

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer (React)                    │
│  - React 19 with TypeScript                                 │
│  - Tailwind CSS for styling                                 │
│  - Zustand for state management                             │
│  - tRPC client for API communication                        │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (tRPC)                          │
│  - Type-safe RPC procedures                                 │
│  - OAuth authentication                                      │
│  - Input validation with Zod                                │
│  - Error handling and logging                               │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│                  Backend Layer (Express)                     │
│  - Express.js server                                        │
│  - Drizzle ORM for database access                          │
│  - Business logic and data processing                       │
│  - External API integrations (Facebook, Stripe)             │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer (MySQL)                        │
│  - Relational database                                      │
│  - Product catalog                                          │
│  - User data and orders                                     │
│  - Chat conversations and messages                          │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI framework |
| TypeScript | 5.9 | Type safety |
| Tailwind CSS | 4 | Styling and theming |
| Zustand | Latest | State management |
| tRPC Client | 11.6 | API communication |
| Vite | 7.1 | Build tool |
| Vitest | Latest | Testing framework |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 22.13 | Runtime |
| Express | 4 | Web framework |
| tRPC Server | 11.6 | RPC framework |
| Drizzle ORM | 0.44 | Database ORM |
| Zod | Latest | Input validation |
| TypeScript | 5.9 | Type safety |

### Database

| Technology | Purpose |
|-----------|---------|
| MySQL | Relational database |
| Drizzle Kit | Schema management |
| Migrations | Version control for schema |

### External Services

| Service | Purpose |
|---------|---------|
| Facebook Graph API | Product catalog sync |
| Stripe | Payment processing |
| Manus OAuth | User authentication |
| S3 Storage | File storage |

## Directory Structure

```
marjahans-landing-page/
├── client/                          # Frontend application
│   ├── src/
│   │   ├── pages/                  # Page components
│   │   │   ├── Home.tsx           # Landing page
│   │   │   ├── ProductListing.tsx # Product catalog
│   │   │   ├── ProductDetail.tsx  # Product details
│   │   │   ├── AdminDashboard.tsx # Admin panel
│   │   │   └── NotFound.tsx       # 404 page
│   │   ├── components/             # Reusable components
│   │   │   ├── ui/               # shadcn/ui components
│   │   │   ├── Hero.tsx          # Hero section
│   │   │   ├── ProductCard.tsx   # Product card
│   │   │   ├── ShoppingCart.tsx  # Cart UI
│   │   │   ├── LiveChat.tsx      # Chat widget
│   │   │   └── ...
│   │   ├── hooks/                  # Custom React hooks
│   │   │   ├── useAuth.ts        # Authentication hook
│   │   │   ├── useProductFilters.ts
│   │   │   └── ...
│   │   ├── store/                  # Zustand stores
│   │   │   ├── cartStore.ts      # Shopping cart state
│   │   │   ├── wishlistStore.ts  # Wishlist state
│   │   │   └── ...
│   │   ├── lib/                    # Utilities
│   │   │   ├── trpc.ts           # tRPC client setup
│   │   │   ├── formatPrice.ts    # Price formatting
│   │   │   └── ...
│   │   ├── contexts/               # React contexts
│   │   ├── App.tsx                # Main app component
│   │   ├── main.tsx               # Entry point
│   │   └── index.css              # Global styles
│   ├── public/                     # Static assets
│   └── index.html                 # HTML template
│
├── server/                          # Backend application
│   ├── routers/                    # tRPC routers
│   │   ├── product-router.ts      # Product procedures
│   │   ├── chat-router.ts         # Chat procedures
│   │   ├── facebook-sync-router.ts # Facebook sync
│   │   ├── stripe.ts              # Payment procedures
│   │   └── routers.ts             # Main router
│   ├── db/                         # Database helpers
│   │   ├── product-db.ts          # Product queries
│   │   ├── chat-db.ts             # Chat queries
│   │   └── ...
│   ├── lib/                        # Server utilities
│   │   ├── facebook-api.ts        # Facebook API client
│   │   └── ...
│   ├── _core/                      # Framework code
│   │   ├── context.ts             # tRPC context
│   │   ├── trpc.ts                # tRPC setup
│   │   ├── oauth.ts               # OAuth handling
│   │   ├── env.ts                 # Environment variables
│   │   └── ...
│   └── index.ts                   # Server entry point
│
├── drizzle/                         # Database schema
│   ├── schema.ts                  # Table definitions
│   ├── relations.ts               # Table relationships
│   ├── migrations/                # Migration files
│   └── meta/                      # Migration metadata
│
├── shared/                          # Shared code
│   ├── types.ts                   # Shared types
│   ├── const.ts                   # Shared constants
│   └── errors.ts                  # Error definitions
│
├── storage/                         # S3 storage helpers
│   └── index.ts                   # Storage utilities
│
├── vitest.config.ts               # Testing configuration
├── vite.config.ts                 # Build configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies
└── README.md                      # Project overview
```

## Data Models

### Product Model

The product model represents items available for purchase in the catalog:

```typescript
interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;              // Price in cents
  categoryId: number;
  material: string;           // e.g., "Gold", "Silver"
  stock: number;
  sku: string;
  isActive: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews: Review[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Order Model

The order model represents customer purchases:

```typescript
interface Order {
  id: number;
  userId: string;
  items: OrderItem[];
  totalAmount: number;        // In cents
  status: "pending" | "completed" | "cancelled";
  paymentId: string;          // Stripe payment ID
  shippingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}
```

### Chat Model

The chat model represents customer support conversations:

```typescript
interface ChatConversation {
  id: string;
  visitorEmail: string;
  visitorName: string;
  status: "active" | "waiting" | "closed";
  cartValue: number;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatMessage {
  id: string;
  conversationId: string;
  sender: "visitor" | "agent";
  content: string;
  isAutoResponse: boolean;
  createdAt: Date;
}
```

## API Design

### tRPC Procedures

The API is built using tRPC, which provides type-safe RPC procedures. Each procedure is defined as either `publicProcedure` or `protectedProcedure`:

```typescript
// Public procedure - accessible without authentication
export const productRouter = router({
  getProducts: publicProcedure
    .input(z.object({ limit: z.number() }))
    .query(async ({ input }) => {
      // Implementation
    }),
});

// Protected procedure - requires authentication
export const orderRouter = router({
  createOrder: protectedProcedure
    .input(orderSchema)
    .mutation(async ({ ctx, input }) => {
      // Implementation
    }),
});
```

### Procedure Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| Query | Read-only operations | getProducts, getProductDetail, getCart |
| Mutation | State-changing operations | createOrder, addToCart, updateProfile |
| Subscription | Real-time updates | (Not currently used) |

## State Management

### Frontend State

The application uses multiple state management approaches:

**Zustand Stores** - For global application state:
- Shopping cart state
- Wishlist state
- User preferences
- Filter state

**React Context** - For theme and authentication:
- Theme context (light/dark mode)
- Auth context (user information)

**Component State** - For local UI state:
- Form inputs
- Modal visibility
- Loading states

### Backend State

Backend state is managed through:
- Database (persistent state)
- Session cookies (authentication state)
- Environment variables (configuration)

## Authentication & Authorization

### Authentication Flow

1. User clicks "Login" button
2. Redirected to Manus OAuth portal
3. User authenticates with credentials
4. Redirected back to app with session cookie
5. Session cookie validated on subsequent requests

### Authorization

Authorization is implemented at the procedure level:

```typescript
// Protected procedure - only authenticated users
const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx });
});

// Admin procedure - only admin users
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({ ctx });
});
```

## Database Schema

The database uses Drizzle ORM with MySQL. Key tables include:

### Products Table
- id (primary key)
- name, description, price
- categoryId (foreign key)
- material, stock, sku
- isActive, createdAt, updatedAt

### Categories Table
- id (primary key)
- name, slug, description

### ProductImages Table
- id (primary key)
- productId (foreign key)
- imageUrl, altText, isMain

### ProductVariants Table
- id (primary key)
- productId (foreign key)
- size, color, material options

### Orders Table
- id (primary key)
- userId (foreign key)
- totalAmount, status
- paymentId, shippingAddress
- createdAt, updatedAt

### ChatConversations Table
- id (primary key)
- visitorEmail, visitorName
- status, cartValue
- createdAt, updatedAt

### ChatMessages Table
- id (primary key)
- conversationId (foreign key)
- sender, content, isAutoResponse
- createdAt

## Integration Points

### Facebook Shop Integration

The application syncs products from Facebook Shop:

1. **Fetch products** - Use Facebook Graph API to fetch products
2. **Parse data** - Extract name, description, price, images
3. **Store in database** - Insert products into product catalog
4. **Update images** - Download and store product images
5. **Sync status** - Track sync progress and errors

### Stripe Payment Integration

Payment processing is handled through Stripe:

1. **Create payment intent** - Backend creates Stripe payment intent
2. **Collect payment** - Frontend collects card details
3. **Confirm payment** - Backend confirms payment with Stripe
4. **Create order** - If successful, create order in database
5. **Webhook handling** - Listen for payment events

## Performance Considerations

### Frontend Performance

- **Code splitting** - Split code at route level
- **Lazy loading** - Lazy load components and images
- **Image optimization** - Use WebP/AVIF formats
- **Memoization** - Use React.memo and useMemo wisely
- **Bundle size** - Monitor and optimize bundle size

### Backend Performance

- **Database indexing** - Index frequently queried columns
- **Query optimization** - Use efficient queries and joins
- **Caching** - Cache product catalog and category data
- **Pagination** - Paginate large result sets
- **Connection pooling** - Reuse database connections

### Monitoring

- **Core Web Vitals** - Monitor LCP, CLS, FID
- **API performance** - Track API response times
- **Database performance** - Monitor query execution times
- **Error tracking** - Log and monitor errors

## Security Architecture

### Input Validation

All user inputs are validated using Zod schemas:

```typescript
const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(5000),
  price: z.number().positive(),
  categoryId: z.number().positive(),
});
```

### Authentication & Authorization

- OAuth for user authentication
- Role-based access control (RBAC)
- Protected procedures for sensitive operations
- Session validation on each request

### Data Protection

- HTTPS for all communication
- Parameterized queries to prevent SQL injection
- Input sanitization to prevent XSS
- CSRF tokens for state-changing operations

## Testing Architecture

### Test Types

| Type | Purpose | Framework | Coverage Target |
|------|---------|-----------|-----------------|
| Unit | Test individual functions | Vitest | 100% |
| Integration | Test API procedures | Vitest | 100% |
| Component | Test React components | Vitest + RTL | 80% |
| E2E | Test complete flows | (Future) | 80% |

### Test Structure

```
server/
  ├── product-router.test.ts
  ├── chat-router.test.ts
  └── ...

client/
  ├── store/
  │   └── cartStore.test.ts
  └── components/
      └── ProductCard.test.tsx
```

## Deployment Architecture

### Development Environment

- Local development with `pnpm dev`
- Hot module replacement (HMR) for fast feedback
- Local database for testing

### Production Environment

- Deployed on Manus platform
- MySQL database in production
- S3 storage for files
- CDN for static assets
- Environment variables for configuration

## Design Patterns

### Component Patterns

**Container/Presentational Pattern** - Separate data fetching from UI:
```typescript
// Container component
function ProductListingContainer() {
  const { data } = trpc.products.getProducts.useQuery();
  return <ProductListingUI products={data} />;
}

// Presentational component
function ProductListingUI({ products }) {
  return <div>{/* UI */}</div>;
}
```

**Custom Hooks Pattern** - Extract reusable logic:
```typescript
function useProductFilters() {
  const [filters, setFilters] = useState({});
  // Logic here
  return { filters, setFilters };
}
```

### API Patterns

**Procedure Organization** - Group related procedures:
```typescript
export const productRouter = router({
  getProducts: publicProcedure.query(...),
  getProductDetail: publicProcedure.query(...),
  createProduct: adminProcedure.mutation(...),
});
```

**Error Handling** - Consistent error responses:
```typescript
if (!product) {
  throw new TRPCError({
    code: 'NOT_FOUND',
    message: 'Product not found',
  });
}
```

## Future Architecture Improvements

1. **GraphQL** - Consider GraphQL for more flexible queries
2. **Microservices** - Separate services for different domains
3. **Real-time features** - WebSocket support for live updates
4. **Caching layer** - Redis for improved performance
5. **Message queue** - Background job processing
6. **API versioning** - Support multiple API versions
7. **Rate limiting** - Protect API from abuse

---

**Last Updated:** March 7, 2026  
**Maintained by:** Manus AI Development Team  
**Repository:** https://github.com/Hopetheory99/MARJAHANS-Jewellary-E-Com
