# Development Guide - Marjahans Jewellery E-Commerce Platform

## Overview

This document outlines the development workflow, setup instructions, and best practices for contributing to the Marjahans Jewellery e-commerce platform. The project follows a structured development process with clear responsibilities, code standards, and quality gates.

## Project Structure

The project is organized as a full-stack e-commerce platform built with React, TypeScript, tRPC, and Drizzle ORM:

```
marjahans-landing-page/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── pages/                  # Page components (Home, ProductListing, AdminDashboard, etc.)
│   │   ├── components/             # Reusable UI components
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── lib/                    # Utilities and client configuration
│   │   ├── store/                  # Zustand state management
│   │   ├── contexts/               # React contexts
│   │   └── index.css               # Global styles and Tailwind configuration
│   └── public/                     # Static assets
├── server/                          # Backend Express + tRPC server
│   ├── routers/                    # tRPC procedure definitions
│   ├── db/                         # Database helpers and queries
│   ├── lib/                        # Server utilities
│   ├── _core/                      # Core framework (OAuth, context, etc.)
│   └── storage.ts                  # S3 file storage helpers
├── drizzle/                         # Database schema and migrations
│   ├── schema.ts                   # Database table definitions
│   ├── relations.ts                # Table relationships
│   └── migrations/                 # Migration files
├── shared/                          # Shared types and constants
├── vitest.config.ts                # Testing configuration
├── package.json                    # Dependencies and scripts
└── README.md                        # Project overview
```

## Development Environment Setup

### Prerequisites

- Node.js 22.13.0 or higher
- pnpm package manager
- MySQL/TiDB database access
- Git for version control

### Initial Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Hopetheory99/MARJAHANS-Jewellary-E-Com.git
   cd MARJAHANS-Jewellary-E-Com
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Configure environment variables:**
   All environment variables are managed through the Manus platform. Contact the project lead to request access to:
   - `DATABASE_URL` - MySQL connection string
   - `VITE_APP_ID` - OAuth application ID
   - `FACEBOOK_PAGE_ACCESS_TOKEN` - Facebook Shop integration token
   - Other API credentials

4. **Set up the database:**

   ```bash
   pnpm db:push
   ```

   This command generates migrations and applies them to your database.

5. **Start the development server:**
   ```bash
   pnpm dev
   ```
   The application will be available at `http://localhost:3000`

## Development Workflow

### Feature Development Process

1. **Create a feature branch** from `main`:

   ```bash
   git checkout -b feature/feature-name
   ```

   Use descriptive branch names following the pattern: `feature/`, `fix/`, `docs/`, `test/`, `chore/`

2. **Implement the feature** following the guidelines in CONTRIBUTING.md

3. **Write tests** for your implementation:
   - Unit tests for utilities and hooks
   - Component tests for UI components
   - Integration tests for API procedures
   - See TESTING.md for detailed testing guidelines

4. **Run tests locally:**

   ```bash
   pnpm test
   ```

   Ensure all tests pass before submitting a pull request.

5. **Format and lint your code:**

   ```bash
   pnpm format
   ```

6. **Create a pull request** with a clear description of changes

7. **Code review** by the main developer (project lead)

8. **Merge to main** once approved

### Database Schema Changes

When modifying the database schema:

1. **Edit `drizzle/schema.ts`** to define table changes
2. **Generate migration:**
   ```bash
   pnpm db:push
   ```
3. **Test the migration** locally
4. **Document the change** in the PR description
5. **Update related database helpers** in `server/db.ts`

### Adding New API Procedures

1. **Create or update a router** in `server/routers/`:

   ```typescript
   import { publicProcedure, protectedProcedure, router } from "./_core/trpc";

   export const featureRouter = router({
     list: publicProcedure.query(async ({ ctx }) => {
       // Implementation
     }),
     create: protectedProcedure.input(z.object({...})).mutation(async ({ ctx, input }) => {
       // Implementation
     }),
   });
   ```

2. **Add the router to `server/routers.ts`:**

   ```typescript
   export const appRouter = router({
     feature: featureRouter,
     // ... other routers
   });
   ```

3. **Write tests** for the procedures (see TESTING.md)

4. **Use in frontend** with tRPC hooks:
   ```typescript
   const { data } = trpc.feature.list.useQuery();
   const mutation = trpc.feature.create.useMutation();
   ```

### Frontend Component Development

1. **Create components** in `client/src/components/` for reusable UI
2. **Create pages** in `client/src/pages/` for route-level components
3. **Use shadcn/ui components** for consistent styling
4. **Follow accessibility guidelines** (WCAG 2.2 AA)
5. **Add Tailwind CSS classes** for styling
6. **Test components** with Vitest and React Testing Library

### File Naming Conventions

| Type             | Convention                   | Example                |
| ---------------- | ---------------------------- | ---------------------- |
| React Components | PascalCase                   | `ProductCard.tsx`      |
| Pages            | PascalCase                   | `ProductListing.tsx`   |
| Utilities        | camelCase                    | `formatPrice.ts`       |
| Hooks            | camelCase, prefix with `use` | `useProductFilters.ts` |
| Types/Interfaces | PascalCase                   | `Product.ts`           |
| Constants        | UPPER_SNAKE_CASE             | `API_ENDPOINTS.ts`     |
| Tests            | Same as source + `.test.ts`  | `cartStore.test.ts`    |

## Code Standards

### TypeScript

- **Strict mode enabled** - All files must pass TypeScript strict type checking
- **No `any` types** - Use proper typing or `unknown` with type guards
- **Export types** - Public interfaces and types should be exported for reuse
- **Document complex types** - Use JSDoc comments for complex type definitions

### React & Components

- **Functional components only** - No class components
- **Hooks for state management** - Use `useState`, `useEffect`, custom hooks
- **Zustand for global state** - Use for cart, wishlist, and app-wide state
- **Memoization** - Use `useMemo` and `useCallback` for performance optimization
- **Accessibility** - All interactive elements must be keyboard accessible with proper ARIA labels

### Styling

- **Tailwind CSS** - Use utility classes for styling
- **CSS variables** - Define theme colors in `client/src/index.css`
- **Responsive design** - Mobile-first approach with breakpoints (sm, md, lg, xl)
- **Dark theme** - All components must work in dark mode

### Database

- **Use Drizzle ORM** - No raw SQL queries in application code
- **Type-safe queries** - Leverage Drizzle's type system
- **Proper indexing** - Add indexes for frequently queried columns
- **Migration documentation** - Document schema changes in PR descriptions

### Testing

- **Minimum 80% coverage** - Aim for comprehensive test coverage
- **Test behavior, not implementation** - Write tests that verify user-facing behavior
- **Descriptive test names** - Test names should clearly describe what is being tested
- **Use fixtures** - Create reusable test data fixtures
- **Mock external APIs** - Mock Facebook API, Stripe, and other external services

## Git Workflow

### Commit Messages

Follow the Conventional Commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat` - A new feature
- `fix` - A bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, missing semicolons, etc.)
- `refactor` - Code refactoring without feature changes
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Build process, dependencies, or tooling changes

**Examples:**

```
feat(products): add product filtering by price range
fix(cart): resolve duplicate items in shopping cart
docs(admin): update admin dashboard setup instructions
test(chat): add tests for message handling
```

### Pull Request Process

1. **Branch naming** - Use descriptive names: `feature/add-wishlist`, `fix/cart-bug`
2. **PR title** - Use Conventional Commits format
3. **PR description** - Include:
   - What changes were made
   - Why the changes were necessary
   - How to test the changes
   - Any breaking changes or migrations needed
4. **Link issues** - Reference related GitHub issues with `Closes #123`
5. **Request review** - Assign to the main developer for review
6. **Address feedback** - Make requested changes and push updates
7. **Merge** - Use "Squash and merge" to keep history clean

## Testing Requirements

All code changes must include appropriate tests:

| Code Type        | Test Type         | Coverage Target |
| ---------------- | ----------------- | --------------- |
| API Procedures   | Integration tests | 100%            |
| Database helpers | Unit tests        | 100%            |
| State management | Unit tests        | 100%            |
| Utilities        | Unit tests        | 100%            |
| React components | Component tests   | 80%             |
| Pages            | Integration tests | 80%             |

Run tests with:

```bash
pnpm test                    # Run all tests
pnpm test --watch          # Watch mode
pnpm test --coverage       # Coverage report
```

## Performance Guidelines

### Frontend Performance

- **Core Web Vitals targets:**
  - LCP (Largest Contentful Paint) < 2.5s
  - CLS (Cumulative Layout Shift) < 0.1
  - FID (First Input Delay) < 100ms

- **Image optimization:**
  - Use WebP/AVIF formats with fallbacks
  - Implement lazy loading for below-the-fold images
  - Compress images before uploading

- **Bundle size:**
  - Monitor bundle size with each release
  - Code split at route level
  - Lazy load heavy components

### Database Performance

- **Query optimization:**
  - Use indexes for frequently queried columns
  - Avoid N+1 queries with proper joins
  - Paginate large result sets

- **Caching:**
  - Cache product catalog data
  - Cache category lists
  - Implement cache invalidation on updates

## Security Guidelines

- **Input validation** - Validate all user inputs on both frontend and backend
- **Authentication** - Use OAuth for user authentication via Manus
- **Authorization** - Check user roles and permissions for protected operations
- **HTTPS** - All communication must use HTTPS in production
- **Environment variables** - Never commit secrets or API keys
- **SQL injection prevention** - Use parameterized queries (Drizzle handles this)
- **XSS prevention** - Sanitize user-generated content
- **CSRF protection** - Implement CSRF tokens for state-changing operations

## Debugging

### Development Tools

- **React DevTools** - Browser extension for React debugging
- **Redux DevTools** - For Zustand state inspection
- **Network tab** - Monitor API calls and responses
- **Console logs** - Use `console.log()` for debugging (remove before committing)

### Server Logs

View server logs during development:

```bash
# Watch server output
tail -f .manus-logs/devserver.log

# View browser console logs
tail -f .manus-logs/browserConsole.log

# View network requests
tail -f .manus-logs/networkRequests.log
```

### Database Debugging

Access the database directly for debugging:

```bash
# Connect to MySQL
mysql -h <host> -u <user> -p <database>

# View products table
SELECT * FROM products LIMIT 10;

# Check product count
SELECT COUNT(*) FROM products;
```

## Deployment

### Pre-deployment Checklist

- [ ] All tests passing (`pnpm test`)
- [ ] No TypeScript errors (`pnpm check`)
- [ ] Code formatted (`pnpm format`)
- [ ] Database migrations applied (`pnpm db:push`)
- [ ] Environment variables configured
- [ ] PR reviewed and approved
- [ ] Changelog updated

### Deployment Process

1. **Create a checkpoint** - Save the current state before deploying
2. **Merge to main** - Merge the feature branch to main
3. **Publish** - Click the Publish button in the Manus UI
4. **Verify** - Test the deployed application
5. **Monitor** - Watch logs for errors and performance issues

## Troubleshooting

### Common Issues

| Issue                     | Solution                                        |
| ------------------------- | ----------------------------------------------- |
| Database connection error | Check DATABASE_URL and network connectivity     |
| TypeScript errors         | Run `pnpm check` and fix type issues            |
| Tests failing             | Run `pnpm test --watch` and debug failures      |
| Port already in use       | Kill process on port 3000 or use different port |
| Missing dependencies      | Run `pnpm install` and `pnpm db:push`           |

### Getting Help

1. Check the project README.md
2. Review existing GitHub issues
3. Check the CONTRIBUTING.md for guidelines
4. Contact the project lead for assistance

## Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [tRPC Documentation](https://trpc.io)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vitest Documentation](https://vitest.dev)

## Version History

| Version | Date       | Changes                   |
| ------- | ---------- | ------------------------- |
| 1.0.0   | 2026-03-07 | Initial development guide |

---

**Last Updated:** March 7, 2026  
**Maintained by:** Manus AI Development Team
