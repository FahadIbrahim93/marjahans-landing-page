# Marjahans Jewellery - Premium Landing Page

A production-grade, luxury jewelry e-commerce landing page built with React 19, Tailwind CSS 4, Express, tRPC, and Stripe integration. Features comprehensive product showcase, AR try-on, shopping cart, and secure payment processing.

## ✨ Features

### Core Features
- **Hero Section** - Cinematic full-viewport hero with brand story and CTA
- **Product Showcase** - Service cards with high-resolution product images
- **Social Proof** - Verified customer testimonials and trust badges
- **Contact Form** - Lead capture with email notifications
- **Responsive Design** - Mobile-first, works on all devices

### Advanced Features
- **Image Optimization** - WebP/AVIF formats, lazy-loading, responsive srcset
- **Product Zoom** - 360° interactive zoom with keyboard shortcuts
- **AR Try-On** - Ring try-on placeholder with size selector (MVP)
- **Shopping Cart** - Full cart management with Zustand state
- **Wishlist** - Save items for later with localStorage persistence
- **Stripe Integration** - Secure payment processing with webhook support

### Quality & Compliance
- **WCAG 2.2 AA targeted** - Accessibility-first components and review in progress
- **Core Web Vitals monitoring** - LCP/CLS/FID metrics are tracked and optimized iteratively
- **GDPR readiness** - Cookie consent banner with granular preferences is implemented
- **SEO friendly** - Meta tags, JSON-LD structured data, and metadata support are in place
- **Security posture** - SSL/TLS support with Stripe payment integration and input validation; PCI compliance is managed by Stripe

### Testing & Monitoring
- **Vitest** - 82 tests covering cart, auth, and core backend flows
- **Performance Monitoring** - Real-time Core Web Vitals tracking is available
- **Error Handling** - Error boundaries and server-side error mapping are implemented

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 10+
- Stripe account (for payment processing)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/marjahans-landing-page.git
cd marjahans-landing-page

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local

# Run database migrations
pnpm db:push

# Start development server
pnpm dev
```

Visit `http://localhost:3000` in your browser.

## 📋 Environment Variables

```bash
# Database
DATABASE_URL=mysql://user:password@localhost:3306/marjahans

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# OAuth (Manus)
VITE_OAUTH_PORTAL_URL=https://...
OAUTH_SERVER_URL=https://...

# Analytics
VITE_ANALYTICS_WEBSITE_ID=...
VITE_ANALYTICS_ENDPOINT=...

# App
VITE_APP_TITLE=Marjahans Jewellery
VITE_APP_LOGO=https://...
```

## 📁 Project Structure

```
marjahans-landing-page/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page-level components
│   │   ├── lib/               # Utilities (cart store, Stripe)
│   │   ├── App.tsx            # Main app router
│   │   └── main.tsx           # Entry point
│   ├── public/                # Static assets
│   └── index.html
├── server/                    # Express backend
│   ├── routers.ts             # tRPC procedures
│   ├── stripe.ts              # Stripe integration
│   ├── db.ts                  # Database queries
│   └── _core/                 # Framework plumbing
├── drizzle/                   # Database schema & migrations
├── shared/                    # Shared types & constants
├── vitest.config.ts           # Test configuration
└── package.json
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run specific test file
pnpm test -- cartStore.test.ts

# Generate coverage report
pnpm test -- --coverage
```

## 🔐 Security Features

- **HTTPS/TLS** - All connections encrypted
- **Stripe payment handling** - Sensitive payment data is processed by Stripe; local code handles secure integration and validation
- **CSRF Protection** - Secure session cookies are used for auth flows
- **Input Validation** - Zod schema validation on all inputs
- **SQL Injection Prevention** - Parameterized queries via Drizzle ORM
- **XSS Protection** - React auto-escaping reduces injection risk

## 📊 Performance Metrics

| Metric | Target | Status |
|--------|--------|--------|
| LCP (Largest Contentful Paint) | <2.5s | Monitoring Enabled |
| FID (First Input Delay) | <100ms | Monitoring Enabled |
| CLS (Cumulative Layout Shift) | <0.1 | Monitoring Enabled |
| FCP (First Contentful Paint) | <1.8s | Monitoring Enabled |
| TTFB (Time to First Byte) | <600ms | Monitoring Enabled |

> Note: Core Web Vitals are tracked in-browser and performance optimizations are ongoing. Build output can emit size warnings when analytics env vars are missing.

## 🎨 Design System

### Colors
- **Primary**: Amber (#F59E0B)
- **Background**: Slate-900 (#0F172A)
- **Text**: White (#FFFFFF)
- **Accent**: Slate-700 (#334155)

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Outfit (sans-serif)

### Spacing
- Base unit: 4px (Tailwind default)
- Max width: 1280px (6xl)

## 🔄 API Endpoints

### tRPC Procedures

```typescript
// Authentication
trpc.auth.me.useQuery()
trpc.auth.logout.useMutation()

// Stripe Payments
trpc.stripe.createPaymentIntent.useMutation({
  items: CartItem[],
  customerEmail: string
})

trpc.stripe.getPaymentStatus.useQuery({
  clientSecret: string
})
```

## 📱 Mobile Optimization

- **Responsive Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-Friendly**: Minimum 44x44px tap targets
- **Fast Loading**: Image lazy-loading, code splitting
- **Offline Support**: Service worker ready (implement as needed)

## 🚀 Deployment

### Manus Platform
```bash
# Save checkpoint
pnpm webdev_save_checkpoint

# Click "Publish" in Management UI
# Site goes live at: https://marjahans.manus.space
```

### Custom Domain
1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records
4. Verify and activate

### Environment Setup for Production
```bash
NODE_ENV=production
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
DATABASE_URL=mysql://prod-user:password@prod-db:3306/marjahans
```

## 📈 Analytics & Monitoring

### Google Analytics
- Tracks page views, events, and conversions
- Custom events for product views and cart additions
- Goal tracking for contact form submissions

### Core Web Vitals Monitoring
- Real-time LCP, FID, CLS tracking
- Performance alerts in browser console
- Automatic Google Analytics integration

## 🔧 Maintenance

### Regular Tasks
- [ ] Monitor error logs weekly
- [ ] Review performance metrics
- [ ] Update dependencies monthly
- [ ] Backup database daily
- [ ] Review security patches

### Database Maintenance
```bash
# Backup database
mysqldump -u user -p marjahans > backup.sql

# Restore from backup
mysql -u user -p marjahans < backup.sql

# Run migrations
pnpm db:push
```

## 🐛 Troubleshooting

### Dev Server Won't Start
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

### Database Connection Error
```bash
# Check DATABASE_URL in .env.local
# Verify MySQL is running
# Test connection: mysql -u user -p -h localhost
```

### Stripe Integration Issues
```bash
# Verify API keys are correct
# Check webhook endpoint is registered
# Review Stripe Dashboard logs
```

## 📚 Documentation

- [Stripe Integration Guide](https://stripe.com/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Drizzle ORM](https://orm.drizzle.team/docs)
- [React 19](https://react.dev)

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review error logs in `.manus-logs/`
3. Contact Manus support at https://help.manus.im

## 📄 License

© 2026 Marjahans Jewellery. All rights reserved.

## 🙏 Credits

Built with:
- React 19 & Tailwind CSS 4
- Express & tRPC
- Stripe Payments
- Drizzle ORM
- Zustand State Management
- Vitest & Accessibility Tools

---

**Last Updated**: February 27, 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
