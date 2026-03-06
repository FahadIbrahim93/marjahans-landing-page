# Testing Standards - Marjahans Jewellery E-Commerce Platform

## Overview

This document outlines the testing standards, requirements, and best practices for the Marjahans Jewellery e-commerce platform. All code changes must include appropriate tests to ensure quality, reliability, and maintainability.

## Testing Philosophy

We follow these core testing principles:

**Test Behavior, Not Implementation** - Write tests that verify what the code does from a user's perspective, not how it's implemented internally. This makes tests more resilient to refactoring.

**Comprehensive Coverage** - Aim for high test coverage (minimum 80%) to catch bugs early and prevent regressions. Focus on critical paths and edge cases.

**Clear Test Names** - Write test names that clearly describe what is being tested and what the expected outcome is. A good test name reads like documentation.

**Isolated Tests** - Each test should be independent and not rely on the state from other tests. Use setup and teardown functions to ensure clean state.

**Fast Execution** - Tests should run quickly to enable rapid feedback during development. Mock external dependencies and avoid unnecessary delays.

## Test Types and Coverage Requirements

### Unit Tests

Unit tests verify the behavior of individual functions, utilities, and components in isolation. They should test both happy paths and error cases.

**Coverage Target:** 100% for utilities, hooks, and state management

**Examples:**
- Testing utility functions like `formatPrice()` or `calculateDiscount()`
- Testing Zustand store mutations and selectors
- Testing custom React hooks with `renderHook()`

**Tools:** Vitest, React Testing Library

### Integration Tests

Integration tests verify that multiple components work together correctly. They test API procedures, database operations, and complex workflows.

**Coverage Target:** 100% for API procedures and database helpers

**Examples:**
- Testing tRPC procedures with database operations
- Testing chat router with message creation and retrieval
- Testing product sync with database updates

**Tools:** Vitest with mocked database

### Component Tests

Component tests verify that React components render correctly and respond to user interactions appropriately.

**Coverage Target:** 80% for UI components

**Examples:**
- Testing that a component renders with correct props
- Testing user interactions (clicks, form submissions)
- Testing conditional rendering based on state
- Testing accessibility features

**Tools:** Vitest + React Testing Library

### End-to-End Tests

End-to-end tests verify complete user workflows from start to finish. These are currently not implemented but should be added in the future.

**Coverage Target:** 80% for critical user flows

**Examples:**
- Complete product purchase flow
- Chat conversation from start to resolution
- User registration and login

**Tools:** Playwright or Cypress (future)

## Coverage Requirements by Code Type

| Code Type | Test Type | Coverage Target | Examples |
|-----------|-----------|-----------------|----------|
| API Procedures | Integration | 100% | product-router.test.ts |
| Database Helpers | Unit | 100% | product-db.test.ts |
| State Management | Unit | 100% | cartStore.test.ts |
| Utilities | Unit | 100% | formatPrice.test.ts |
| React Components | Component | 80% | ProductCard.test.tsx |
| Pages | Integration | 80% | ProductListing.test.tsx |
| Custom Hooks | Unit | 100% | useProductFilters.test.ts |

## Setting Up Tests

### Installation

Tests are configured with Vitest and React Testing Library. Dependencies are already installed in `package.json`.

### Configuration

The testing configuration is in `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
  },
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage report
pnpm test --coverage

# Run specific test file
pnpm test cartStore.test.ts

# Run tests matching a pattern
pnpm test --grep "cart"
```

## Writing Tests

### Test Structure

Follow this structure for all tests:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Feature Name', () => {
  // Setup
  beforeEach(() => {
    // Initialize test data
  });

  // Cleanup
  afterEach(() => {
    // Clean up after tests
  });

  // Test cases
  it('should do something specific', () => {
    // Arrange - set up test data
    const input = { /* ... */ };

    // Act - call the function being tested
    const result = functionUnderTest(input);

    // Assert - verify the result
    expect(result).toBe(expectedValue);
  });
});
```

### Naming Conventions

Write descriptive test names that clearly describe the behavior being tested:

```typescript
// ✓ Good - describes the behavior
it('should add item to cart and update total price', () => {
  // ...
});

// ✗ Bad - vague and doesn't describe behavior
it('should work correctly', () => {
  // ...
});

// ✓ Good - describes edge case
it('should throw error when price is negative', () => {
  // ...
});

// ✗ Bad - doesn't describe the scenario
it('should handle invalid input', () => {
  // ...
});
```

### Testing Utilities

#### Testing Async Functions

```typescript
it('should fetch products from API', async () => {
  const result = await fetchProducts();
  expect(result).toHaveLength(10);
});
```

#### Testing Error Cases

```typescript
it('should throw error when product not found', async () => {
  await expect(getProduct(999)).rejects.toThrow('Product not found');
});
```

#### Testing with Mocks

```typescript
import { vi } from 'vitest';

it('should call API with correct parameters', async () => {
  const mockFetch = vi.fn().mockResolvedValue({ data: [] });
  await fetchData(mockFetch);
  expect(mockFetch).toHaveBeenCalledWith('/api/data');
});
```

### Testing React Components

#### Basic Component Test

```typescript
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  it('should render product name and price', () => {
    const product = {
      id: 1,
      name: 'Gold Ring',
      price: 5000,
    };

    render(<ProductCard product={product} />);

    expect(screen.getByText('Gold Ring')).toBeInTheDocument();
    expect(screen.getByText('₹50.00')).toBeInTheDocument();
  });
});
```

#### Testing User Interactions

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('should add product to cart when button is clicked', async () => {
  const user = userEvent.setup();
  const handleAddToCart = vi.fn();

  render(<ProductCard product={product} onAddToCart={handleAddToCart} />);

  const button = screen.getByRole('button', { name: /add to cart/i });
  await user.click(button);

  expect(handleAddToCart).toHaveBeenCalledWith(product.id);
});
```

#### Testing with Props

```typescript
it('should render with different product variants', () => {
  const variants = [
    { id: 1, name: 'Size S' },
    { id: 2, name: 'Size M' },
  ];

  render(<ProductCard product={product} variants={variants} />);

  expect(screen.getByText('Size S')).toBeInTheDocument();
  expect(screen.getByText('Size M')).toBeInTheDocument();
});
```

### Testing Custom Hooks

```typescript
import { renderHook, act } from '@testing-library/react';
import { useProductFilters } from './useProductFilters';

describe('useProductFilters', () => {
  it('should initialize with default filters', () => {
    const { result } = renderHook(() => useProductFilters());

    expect(result.current.filters).toEqual({
      category: null,
      priceMin: 0,
      priceMax: 100000,
    });
  });

  it('should update filters when setFilters is called', () => {
    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.setFilters({ category: 'rings' });
    });

    expect(result.current.filters.category).toBe('rings');
  });
});
```

### Testing State Management (Zustand)

```typescript
import { renderHook, act } from '@testing-library/react';
import { useCartStore } from './cartStore';

describe('useCartStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useCartStore.setState({ items: [] });
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem({ id: 1, name: 'Ring', price: 5000 });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe(1);
  });

  it('should calculate total price correctly', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem({ id: 1, name: 'Ring', price: 5000, quantity: 2 });
      result.current.addItem({ id: 2, name: 'Necklace', price: 3000, quantity: 1 });
    });

    expect(result.current.totalPrice).toBe(13000);
  });
});
```

### Testing API Procedures (tRPC)

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { appRouter } from '../routers';

describe('productRouter', () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    caller = appRouter.createCaller({
      // Mock context
      user: null,
      db: mockDb,
    });
  });

  it('should fetch products with filters', async () => {
    const result = await caller.products.getProducts({
      category: 'rings',
      limit: 10,
    });

    expect(result).toHaveLength(10);
    expect(result[0].category).toBe('rings');
  });

  it('should throw error for invalid input', async () => {
    await expect(
      caller.products.getProducts({ limit: -1 })
    ).rejects.toThrow();
  });
});
```

## Testing Best Practices

### Do's

- **Test behavior** - Focus on what the code does, not how it does it
- **Use descriptive names** - Test names should be self-documenting
- **Test edge cases** - Include tests for error conditions and boundary cases
- **Keep tests focused** - Each test should verify one specific behavior
- **Use fixtures** - Create reusable test data
- **Mock external dependencies** - Don't test external APIs or databases directly
- **Test accessibility** - Verify that components are accessible
- **Keep tests fast** - Avoid unnecessary delays and heavy operations

### Don'ts

- **Don't test implementation details** - Focus on the public API
- **Don't have interdependent tests** - Each test should be independent
- **Don't skip error cases** - Test both success and failure paths
- **Don't use vague assertions** - Be specific about what you're testing
- **Don't test third-party libraries** - Assume they work correctly
- **Don't make tests too complex** - If a test is hard to understand, it's too complex
- **Don't ignore test failures** - Fix failing tests immediately
- **Don't commit code with failing tests** - All tests must pass before committing

## Test Data and Fixtures

### Creating Fixtures

Create reusable test data in fixture files:

```typescript
// fixtures/products.ts
export const mockProduct = {
  id: 1,
  name: 'Gold Ring',
  description: 'Beautiful gold ring',
  price: 5000,
  category: 'rings',
  material: 'Gold',
  stock: 10,
};

export const mockProducts = [
  mockProduct,
  { ...mockProduct, id: 2, name: 'Silver Ring' },
  { ...mockProduct, id: 3, name: 'Diamond Ring' },
];
```

### Using Fixtures

```typescript
import { mockProduct, mockProducts } from '../fixtures/products';

describe('ProductCard', () => {
  it('should render product', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Gold Ring')).toBeInTheDocument();
  });
});
```

## Mocking

### Mocking Functions

```typescript
import { vi } from 'vitest';

const mockFetch = vi.fn();
mockFetch.mockResolvedValue({ data: [] });

await fetchData(mockFetch);
expect(mockFetch).toHaveBeenCalled();
```

### Mocking Modules

```typescript
import { vi } from 'vitest';

vi.mock('../api', () => ({
  fetchProducts: vi.fn().mockResolvedValue([]),
}));
```

### Mocking Database

```typescript
const mockDb = {
  select: vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue([mockProduct]),
    }),
  }),
};
```

## Coverage Reports

### Generating Coverage

```bash
pnpm test --coverage
```

This generates a coverage report showing:
- Line coverage - Percentage of lines executed
- Branch coverage - Percentage of conditional branches tested
- Function coverage - Percentage of functions called
- Statement coverage - Percentage of statements executed

### Interpreting Coverage

- **80%+** - Good coverage, most code is tested
- **60-80%** - Acceptable, but should improve
- **<60%** - Poor coverage, needs significant improvement

### Coverage Goals

| Code Type | Target |
|-----------|--------|
| Critical business logic | 100% |
| API procedures | 100% |
| Database helpers | 100% |
| Utilities | 100% |
| React components | 80% |
| Pages | 80% |

## Continuous Integration

Tests are run automatically on pull requests. All tests must pass before merging:

```yaml
# Example CI configuration
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '22'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test
      - run: pnpm test --coverage
```

## Debugging Tests

### Using Console Logs

```typescript
it('should work correctly', () => {
  const result = functionUnderTest();
  console.log('Result:', result); // Will appear in test output
  expect(result).toBe(expected);
});
```

### Using Debug Function

```typescript
import { render, screen } from '@testing-library/react';

it('should render correctly', () => {
  const { debug } = render(<Component />);
  debug(); // Prints the DOM tree
});
```

### Running Single Test

```bash
# Run only one test file
pnpm test cartStore.test.ts

# Run only one test
pnpm test --grep "should add item to cart"
```

### Watch Mode

```bash
# Run tests in watch mode for rapid feedback
pnpm test --watch
```

## Common Testing Patterns

### Testing Async Operations

```typescript
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

### Testing Error Handling

```typescript
it('should handle errors gracefully', async () => {
  await expect(functionThatThrows()).rejects.toThrow('Error message');
});
```

### Testing Conditional Rendering

```typescript
it('should show loading state', () => {
  render(<Component isLoading={true} />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

it('should show content when loaded', () => {
  render(<Component isLoading={false} data={mockData} />);
  expect(screen.getByText('Content')).toBeInTheDocument();
});
```

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Tests timeout | Increase timeout: `it('...', async () => {...}, 10000)` |
| Module not found | Check import paths and mock setup |
| State not updating | Use `act()` wrapper for state updates |
| Async test fails | Add `await` and `async` keyword |
| Component not rendering | Check props and context providers |

## Resources

- [Vitest Documentation](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Jest Matchers](https://vitest.dev/api/expect.html)

---

**Last Updated:** March 7, 2026  
**Maintained by:** Manus AI Development Team  
**Repository:** https://github.com/Hopetheory99/MARJAHANS-Jewellary-E-Com
