# Contributing to Marjahans Jewellery E-Commerce Platform

Thank you for your interest in contributing to the Marjahans Jewellery e-commerce platform! This document provides guidelines and standards for all contributors, whether you are a team member, AI agent, or community contributor.

## Getting Started

Before you begin contributing, please take time to review the following documents:

- **DEVELOPMENT.md** - Development environment setup and workflow
- **.agents.yml** - Agent guidelines and responsibilities
- **CODE_OF_CONDUCT.md** - Community standards and expectations
- **TESTING.md** - Testing requirements and best practices

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please read and adhere to our Code of Conduct, which outlines our expectations for respectful and professional behavior.

## How to Contribute

### Reporting Bugs

If you discover a bug, please create a GitHub issue with the following information:

1. **Clear title** - Describe the bug concisely
2. **Reproduction steps** - Provide step-by-step instructions to reproduce the issue
3. **Expected behavior** - Describe what should happen
4. **Actual behavior** - Describe what actually happens
5. **Environment** - Include browser, OS, and Node.js version
6. **Screenshots** - Attach screenshots if the bug is visual
7. **Error messages** - Include any error messages or console logs

### Requesting Features

To request a new feature, create a GitHub issue with:

1. **Clear title** - Describe the feature request
2. **Use case** - Explain why this feature is needed
3. **Proposed solution** - Describe how you envision the feature working
4. **Alternative solutions** - Suggest any alternative approaches
5. **Additional context** - Provide any other relevant information

### Submitting Pull Requests

Follow these steps to submit a pull request:

1. **Fork the repository** and create a feature branch from `main`
2. **Implement your changes** following the coding standards below
3. **Write tests** for your implementation (see TESTING.md)
4. **Update documentation** if your changes affect user-facing features
5. **Run tests locally** and ensure they all pass
6. **Format your code** using `pnpm format`
7. **Create a pull request** with a clear description
8. **Respond to feedback** from code reviewers

## Coding Standards

### TypeScript and JavaScript

All code must be written in TypeScript with strict mode enabled. Follow these standards:

- **Type safety** - Use proper TypeScript types instead of `any`
- **No implicit `any`** - All variables and parameters must have explicit types
- **Strict null checks** - Handle null and undefined explicitly
- **Consistent naming** - Use camelCase for variables and functions, PascalCase for types and components
- **Meaningful names** - Choose descriptive names that clearly indicate purpose
- **Comments** - Add comments for complex logic and non-obvious decisions
- **JSDoc** - Document functions and types with JSDoc comments

### React Components

When building React components, follow these guidelines:

- **Functional components only** - No class components
- **Hooks for state** - Use `useState`, `useEffect`, and custom hooks
- **Accessibility** - Ensure keyboard navigation and ARIA labels
- **Props typing** - Define prop interfaces with TypeScript
- **Memoization** - Use `useMemo` and `useCallback` for performance
- **Error boundaries** - Handle errors gracefully
- **Responsive design** - Mobile-first approach with Tailwind CSS

### Styling with Tailwind CSS

- **Utility classes** - Use Tailwind utility classes for styling
- **CSS variables** - Define theme colors in `client/src/index.css`
- **Responsive** - Use responsive prefixes (sm:, md:, lg:, xl:)
- **Dark mode** - Ensure components work in dark mode
- **Accessibility** - Maintain proper color contrast ratios
- **No inline styles** - Avoid inline style attributes

### Database and Queries

When working with the database:

- **Use Drizzle ORM** - No raw SQL queries in application code
- **Type-safe queries** - Leverage Drizzle's type system
- **Proper indexing** - Add indexes for frequently queried columns
- **Query optimization** - Avoid N+1 queries and unnecessary data fetching
- **Migrations** - Use `pnpm db:push` for schema changes
- **Documentation** - Document schema changes in PR descriptions

### API Procedures (tRPC)

When creating or modifying API procedures:

- **Clear naming** - Use descriptive procedure names
- **Input validation** - Validate all inputs with Zod schemas
- **Error handling** - Throw appropriate errors with clear messages
- **Documentation** - Add JSDoc comments explaining the procedure
- **Testing** - Write comprehensive tests for all procedures
- **Authorization** - Check user permissions for protected procedures

### Git Commits

Follow the Conventional Commits format for all commits:

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

Add ability to filter products by minimum and maximum price.
Implements new getPriceRange API endpoint and FilterSidebar component.

Closes #123
```

```
fix(cart): resolve duplicate items in shopping cart

Items were being added twice due to missing deduplication logic
in the addToCart mutation. Added Set-based deduplication.

Closes #456
```

## Testing Requirements

All code changes must include appropriate tests. Test coverage requirements:

| Code Type | Coverage | Requirement |
|-----------|----------|-------------|
| API Procedures | 100% | All code paths must be tested |
| Database helpers | 100% | All query helpers must be tested |
| State management | 100% | All state mutations must be tested |
| Utilities | 100% | All utility functions must be tested |
| React components | 80% | Most component logic must be tested |
| Pages | 80% | Critical user flows must be tested |

Run tests with:
```bash
pnpm test              # Run all tests
pnpm test --watch     # Watch mode for development
pnpm test --coverage  # Generate coverage report
```

See TESTING.md for detailed testing guidelines.

## Documentation

Documentation is a critical part of the codebase. When making changes:

1. **Update README.md** if your changes affect project setup or overview
2. **Update DEVELOPMENT.md** if you change development workflow
3. **Update API documentation** if you add or modify API procedures
4. **Add code comments** for complex logic
5. **Update CHANGELOG** with significant changes
6. **Add examples** for new features

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

## Accessibility Requirements

All code must meet WCAG 2.2 AA accessibility standards:

- **Keyboard navigation** - All interactive elements must be keyboard accessible
- **ARIA labels** - Use proper ARIA labels for screen readers
- **Color contrast** - Maintain proper color contrast ratios
- **Focus management** - Visible focus indicators on all interactive elements
- **Semantic HTML** - Use semantic HTML elements appropriately
- **Alt text** - Provide alt text for all images
- **Form labels** - Associate labels with form inputs

## Security Guidelines

- **Input validation** - Validate all user inputs on both frontend and backend
- **Authentication** - Use OAuth for user authentication
- **Authorization** - Check user roles and permissions
- **HTTPS** - All communication must use HTTPS
- **Secrets** - Never commit secrets or API keys
- **SQL injection** - Use parameterized queries (Drizzle handles this)
- **XSS prevention** - Sanitize user-generated content
- **CSRF protection** - Implement CSRF tokens for state-changing operations

## Code Review Process

### For Authors

When submitting a pull request:

1. **Self-review** - Review your own code before requesting review
2. **Clear description** - Provide a detailed PR description
3. **Link issues** - Reference related GitHub issues
4. **Testing instructions** - Explain how to test your changes
5. **Screenshots** - Include screenshots for UI changes
6. **Respond promptly** - Address review feedback quickly
7. **Ask questions** - If feedback is unclear, ask for clarification

### For Reviewers

When reviewing code:

1. **Timely review** - Review within 24 hours when possible
2. **Constructive feedback** - Provide helpful, not harsh, feedback
3. **Verify tests** - Ensure tests are comprehensive
4. **Check security** - Look for potential security issues
5. **Verify performance** - Check for performance implications
6. **Approve or request changes** - Be clear about what needs to be done

## Merge Criteria

A pull request can be merged when:

1. **All tests pass** - CI/CD checks must pass
2. **Code review approved** - Main developer must approve
3. **No conflicts** - Branch must be up-to-date with main
4. **Tests comprehensive** - Coverage must meet requirements
5. **Documentation updated** - Relevant docs must be updated
6. **No breaking changes** - Or breaking changes are documented

## Deployment

### Pre-deployment Checklist

Before deploying to production:

- [ ] All tests passing (`pnpm test`)
- [ ] No TypeScript errors (`pnpm check`)
- [ ] Code formatted (`pnpm format`)
- [ ] Database migrations applied (`pnpm db:push`)
- [ ] Environment variables configured
- [ ] PR reviewed and approved
- [ ] Changelog updated
- [ ] Documentation updated

### Deployment Process

1. **Create a checkpoint** - Save the current state
2. **Merge to main** - Merge the feature branch
3. **Publish** - Click the Publish button in the Manus UI
4. **Verify** - Test the deployed application
5. **Monitor** - Watch logs for errors

## Getting Help

If you need help with anything:

1. **Check the documentation** - Review DEVELOPMENT.md and TESTING.md
2. **Search existing issues** - Your question may already be answered
3. **Create a discussion** - Use GitHub Discussions for questions
4. **Create an issue** - Report bugs or request features
5. **Contact the main developer** - For urgent matters

## Recognition

We appreciate all contributions! Contributors will be recognized in:

- **CONTRIBUTORS.md** - List of all contributors
- **Release notes** - Mentioned in release announcements
- **GitHub** - Automatically tracked in commit history

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

## Questions or Concerns?

If you have questions about contributing or concerns about the process, please reach out to the main developer or create a GitHub Discussion.

---

**Last Updated:** March 7, 2026  
**Maintained by:** Manus AI Development Team  
**Repository:** https://github.com/Hopetheory99/MARJAHANS-Jewellary-E-Com
