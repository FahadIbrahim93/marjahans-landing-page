# Marjahan's Jewelry - Comprehensive Omnichannel Integration Roadmap

**Document Version:** 1.0  
**Last Updated:** March 8, 2026  
**Author:** Manus AI  
**Status:** Strategic Planning Phase

---

## Executive Summary

Marjahan's Jewelry has established foundational connections with Shopify and Meta Business Manager, positioning the business for significant growth through omnichannel commerce. However, products are not currently visible across Facebook and Instagram shops due to incomplete sync configuration and missing real-time inventory integration. This roadmap outlines a phased approach to achieve seamless product synchronization, unified inventory management, and omnichannel customer experiences that will drive revenue growth across all sales channels.

The global jewelry market is projected to grow from $254.13 billion in 2026 to $387.36 billion by 2034, with demand for high-end pieces increasing 12% annually. Omnichannel jewelry retailers capture 4% more in-store sales and 10% more online revenue compared to single-channel competitors. By implementing this roadmap, Marjahan's can position itself to capture significant market share in this growing segment.

---

## Current State Analysis

### Existing Infrastructure

Marjahan's has successfully established the following integrations:

| Component                  | Status             | Notes                                         |
| -------------------------- | ------------------ | --------------------------------------------- |
| Shopify Store              | ✅ Active          | E-commerce platform with product catalog      |
| Meta Business Manager      | ✅ Active          | Connected to Marjahans Facebook page          |
| Facebook Page              | ✅ Active          | Established presence with customer engagement |
| Messenger Integration      | ✅ Active          | Customer communication channel                |
| Facebook Page Access Token | ✅ Valid           | Authenticated and tested (expires in 60 days) |
| Commerce Manager           | ⚠️ Partial         | Connected but products not syncing properly   |
| Facebook Shop              | ❌ Not Visible     | Products not appearing in shop                |
| Instagram Shop             | ❌ Not Visible     | Products not appearing in shop                |
| Real-time Inventory Sync   | ❌ Not Implemented | Manual sync only (7-day cycle)                |
| Unified Product Catalog    | ❌ Not Implemented | Separate systems not connected                |
| Order Management System    | ❌ Not Implemented | No unified order dashboard                    |

### Why Products Are Not Showing

The research and testing revealed several interconnected issues preventing product visibility:

**1. Incomplete Shopify-Facebook Connection**

The Facebook & Instagram by Meta app is installed in Shopify but not fully configured. The connection requires three critical steps: app installation (completed), domain verification (likely incomplete), and checkout method selection (likely incomplete). Without these steps, Shopify cannot push products to Meta's Commerce Manager.

**2. Catalog Sync Configuration Issues**

Meta Commerce Manager requires explicit data source configuration. Products must be mapped from Shopify through the proper data source settings. If filters are applied or the data source is not properly linked to the shop, products remain invisible even if technically present in the system.

**3. Manual Sync Requirement**

Shopify syncs products to Meta automatically every 7 days on a scheduled basis. For immediate visibility, manual sync must be triggered in Meta Commerce Manager's Data Sources section. The first sync can take 24-48 hours to complete.

**4. Missing Required Product Fields**

Meta requires specific product fields for visibility: title, price, image URL, description, availability, and inventory count. If any critical fields are missing or improperly formatted in Shopify, Meta's validation system filters out the products.

**5. Shop Not Published**

Even with properly synced products, the shop itself must be published and configured in Meta Commerce Manager. Shop settings, checkout preferences, and payment methods must be configured before products become visible to customers.

---

## Phased Implementation Roadmap

### Phase 1: Immediate Fixes (Week 1-2)

**Objective:** Restore product visibility on Facebook and Instagram shops

**Tasks:**

1. **Verify Shopify-Facebook Connection**
   - Access Shopify admin → Sales channels → Facebook and Instagram
   - Confirm app is installed and authorized
   - Verify domain ownership is completed
   - Select checkout method (Shopify checkout or Facebook checkout)

2. **Configure Meta Commerce Manager**
   - Access Meta Business Manager → Commerce Manager
   - Verify catalog is linked to the correct shop
   - Check data source settings point to Shopify
   - Remove any product filters that may be hiding items
   - Verify inventory field is properly mapped

3. **Trigger Manual Product Sync**
   - Navigate to Data Sources in Commerce Manager
   - Force manual sync from Shopify data source
   - Monitor sync progress and error logs
   - Wait for 24-48 hours for initial sync completion

4. **Publish Shop**
   - Configure shop settings (name, description, policies)
   - Set up payment methods (credit card, digital wallets)
   - Configure shipping and tax settings
   - Publish shop to Facebook and Instagram

5. **Validate Product Visibility**
   - Check Facebook Shop for product listings
   - Check Instagram Shop for product listings
   - Verify product details (images, prices, descriptions)
   - Test checkout flow end-to-end

**Expected Outcome:** All products visible on Facebook and Instagram shops with functional checkout

**Timeline:** 1-2 weeks  
**Resources Needed:** Meta Business Manager access, Shopify admin access  
**Success Metrics:** 100% of Shopify products visible in Meta shops, zero checkout errors

---

### Phase 2: Real-Time Inventory Sync (Week 3-4)

**Objective:** Implement near-real-time inventory updates across all channels

**Current State:** Shopify syncs to Meta every 7 days (insufficient for fast-selling jewelry)

**Solution:** Implement Meta Catalog Batch API for inventory updates

**Technical Implementation:**

```
Shopify Inventory Change
    ↓
Webhook Trigger
    ↓
Backend Service (Node.js/Express)
    ↓
Meta Catalog Batch API
    ↓
Meta Commerce Manager Updated
    ↓
Facebook/Instagram Shops Updated (within minutes)
```

**Tasks:**

1. **Set Up Shopify Webhook**
   - Register webhook for `inventory_level/update` events
   - Configure webhook endpoint on Marjahan's backend server
   - Test webhook delivery with inventory changes

2. **Build Backend Integration Service**
   - Create API endpoint to receive Shopify webhooks
   - Implement authentication and validation
   - Build Meta Catalog Batch API client
   - Map Shopify inventory fields to Meta format

3. **Implement Meta Batch API**
   - Authenticate with Meta using app credentials
   - Create batch requests for inventory updates
   - Handle rate limiting (100 requests/second)
   - Implement retry logic for failed updates

4. **Add Error Handling & Monitoring**
   - Log all sync operations
   - Alert on sync failures
   - Create dashboard to monitor sync status
   - Implement automatic retry mechanism

5. **Test End-to-End**
   - Update inventory in Shopify
   - Verify update appears in Meta within 5 minutes
   - Test with multiple products simultaneously
   - Verify no data loss or duplication

**Expected Outcome:** Inventory updates within 5 minutes of Shopify change

**Timeline:** 2-3 weeks  
**Resources Needed:** Backend developer, Meta API documentation, Shopify API access  
**Success Metrics:** 99.9% sync success rate, <5 minute update latency, zero inventory discrepancies

---

### Phase 3: Unified Product Catalog System (Week 5-8)

**Objective:** Create master product database with intelligent sync to all channels

**Current Limitation:** Shopify is source of truth but lacks enrichment for jewelry-specific attributes

**Solution:** Build unified catalog layer with jewelry-specific fields

**Database Schema:**

```
Products Table
├── Basic Fields (from Shopify)
│   ├── ID, Title, Description, Price
│   ├── SKU, Images, Category
│   └── Inventory, Status
├── Jewelry-Specific Fields
│   ├── Material (Gold, Silver, Diamond, etc.)
│   ├── Purity (18K, 22K, 925, etc.)
│   ├── Weight (grams)
│   ├── Gemstone Type & Quality
│   ├── Design Style (Traditional, Modern, etc.)
│   └── Occasion (Wedding, Engagement, etc.)
├── Channel-Specific Fields
│   ├── Facebook Description
│   ├── Instagram Hashtags
│   ├── TikTok Shop Keywords
│   └── Google Shopping Data
└── Analytics Fields
    ├── Click-through Rate
    ├── Conversion Rate
    ├── Revenue
    └── Last Updated
```

**Tasks:**

1. **Design Unified Catalog Database**
   - Create extended product schema with jewelry fields
   - Define field mapping from Shopify to unified catalog
   - Plan data migration strategy
   - Design API for catalog access

2. **Build Data Sync Engine**
   - Create sync service for Shopify → Unified Catalog
   - Implement field enrichment logic
   - Build transformation layer for channel-specific formats
   - Create sync scheduling and monitoring

3. **Implement Channel-Specific Adapters**
   - Facebook adapter (format for Meta requirements)
   - Instagram adapter (optimize for visual platform)
   - TikTok Shop adapter (short-form video optimization)
   - Google Shopping adapter (SEO optimization)

4. **Build Admin Interface**
   - Create dashboard for catalog management
   - Add bulk edit capabilities
   - Implement field validation
   - Add sync status monitoring

5. **Migrate Existing Products**
   - Import all Shopify products to unified catalog
   - Enrich with jewelry-specific attributes
   - Validate data integrity
   - Test sync to all channels

**Expected Outcome:** Single source of truth for all product data across all channels

**Timeline:** 4 weeks  
**Resources Needed:** Full-stack developer, database architect, jewelry domain expert  
**Success Metrics:** 100% product coverage, 95% field accuracy, <1 minute sync time

---

### Phase 4: Omnichannel Inventory Management (Week 9-12)

**Objective:** Unified inventory pool across all sales channels

**Current State:** Inventory managed separately in Shopify, Facebook, Instagram

**Solution:** Centralized inventory with real-time deduction across all channels

**Architecture:**

```
Unified Inventory Pool
├── Physical Stock (Warehouse)
├── Reserved for Orders (All Channels)
├── Available for Sale
└── Channel Allocation
    ├── Shopify Available
    ├── Facebook Available
    ├── Instagram Available
    └── TikTok Available
```

**Tasks:**

1. **Design Inventory Management System**
   - Create central inventory database
   - Define inventory states (available, reserved, sold, damaged)
   - Plan allocation logic across channels
   - Design API for inventory queries

2. **Build Order Integration**
   - Integrate Shopify orders with inventory system
   - Integrate Facebook orders with inventory system
   - Integrate Instagram orders with inventory system
   - Implement real-time inventory deduction

3. **Implement Inventory Forecasting**
   - Analyze historical sales patterns
   - Predict demand by product and channel
   - Recommend reorder points
   - Alert on low stock situations

4. **Build Inventory Dashboard**
   - Real-time inventory visibility
   - Channel-by-channel breakdown
   - Historical trends and forecasts
   - Low stock alerts and recommendations

5. **Test Multi-Channel Scenarios**
   - Simulate simultaneous orders across channels
   - Verify inventory deduction accuracy
   - Test oversell prevention
   - Validate customer notifications

**Expected Outcome:** Single inventory pool with real-time visibility and automatic deduction

**Timeline:** 4 weeks  
**Resources Needed:** Backend developer, database architect, QA engineer  
**Success Metrics:** Zero overselling, 99.99% inventory accuracy, <1 second update latency

---

### Phase 5: Advanced Features & Growth (Week 13+)

**Objective:** Implement advanced features to drive customer engagement and sales growth

#### 5A. AR Virtual Try-On (Weeks 13-16)

Jewelry customers prioritize visual confidence. AR try-on technology allows customers to see how pieces look on them before purchasing.

**Implementation:**

- Integrate AR.js or similar WebAR library
- Create 3D models of jewelry pieces
- Build mobile-optimized try-on interface
- Implement for rings, necklaces, bracelets, earrings

**Expected Impact:** 25-35% increase in conversion rates for jewelry with AR try-on

#### 5B. AI-Powered Personalization (Weeks 17-20)

Use machine learning to personalize product recommendations and marketing messages.

**Implementation:**

- Build customer preference model
- Create recommendation engine
- Implement dynamic email personalization
- Build personalized product feeds

**Expected Impact:** 15-20% increase in average order value

#### 5C. WhatsApp Business Integration (Weeks 21-24)

Enable customers to shop and communicate via WhatsApp, the most popular messaging app globally.

**Implementation:**

- Set up WhatsApp Business API
- Create product catalog in WhatsApp
- Build chatbot for customer service
- Implement order notifications

**Expected Impact:** 30-40% increase in customer engagement

#### 5D. TikTok Shop Integration (Weeks 25-28)

Expand to TikTok Shop to reach younger demographics and leverage short-form video content.

**Implementation:**

- Connect TikTok Shop API
- Sync products to TikTok
- Create TikTok-optimized product content
- Build TikTok-specific marketing campaigns

**Expected Impact:** New revenue channel, 20-30% growth in customer acquisition

#### 5E. Analytics & Attribution Dashboard (Weeks 29-32)

Build comprehensive dashboard to track performance across all channels and understand customer journeys.

**Implementation:**

- Aggregate data from all channels
- Build multi-touch attribution model
- Create channel performance dashboards
- Implement cohort analysis

**Expected Impact:** 25-30% improvement in marketing ROI through better channel allocation

---

## Technical Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Customer Touchpoints                      │
├─────────────────────────────────────────────────────────────┤
│  Shopify  │  Facebook  │  Instagram  │  TikTok  │  WhatsApp │
└────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                   Integration Layer                          │
├─────────────────────────────────────────────────────────────┤
│  Shopify API  │  Meta API  │  TikTok API  │  WhatsApp API   │
└────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                   Core Services                              │
├─────────────────────────────────────────────────────────────┤
│  Product Sync  │  Inventory Mgmt  │  Order Mgmt  │  Analytics │
└────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer                                 │
├─────────────────────────────────────────────────────────────┤
│  Products  │  Inventory  │  Orders  │  Customers  │  Analytics │
└────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer             | Technology               | Purpose                              |
| ----------------- | ------------------------ | ------------------------------------ |
| **Frontend**      | React 19 + Tailwind CSS  | Admin dashboard, customer interfaces |
| **Backend**       | Node.js + Express + tRPC | API services, business logic         |
| **Database**      | MySQL/TiDB               | Product, inventory, order data       |
| **APIs**          | REST + GraphQL           | Channel integrations                 |
| **Webhooks**      | Shopify, Meta, TikTok    | Real-time event handling             |
| **Message Queue** | Redis                    | Async job processing                 |
| **Caching**       | Redis                    | Performance optimization             |
| **Monitoring**    | Datadog/New Relic        | System health, error tracking        |
| **Storage**       | S3                       | Product images, documents            |

---

## Implementation Timeline

| Phase                      | Duration      | Key Deliverables              | Investment   |
| -------------------------- | ------------- | ----------------------------- | ------------ |
| Phase 1: Quick Fixes       | 1-2 weeks     | Product visibility restored   | Low          |
| Phase 2: Real-time Sync    | 2-3 weeks     | Inventory updates <5 min      | Medium       |
| Phase 3: Unified Catalog   | 4 weeks       | Master product database       | Medium       |
| Phase 4: Inventory Mgmt    | 4 weeks       | Unified inventory pool        | Medium       |
| Phase 5: Advanced Features | 16+ weeks     | AR, AI, WhatsApp, TikTok      | High         |
| **Total**                  | **~6 months** | **Full omnichannel platform** | **$50-100K** |

---

## Expected Business Impact

### Revenue Growth Projections

| Metric               | Current | 6 Months | 12 Months |
| -------------------- | ------- | -------- | --------- |
| Monthly Revenue      | $X      | $X × 1.5 | $X × 2.5  |
| Customer Base        | Y       | Y × 1.8  | Y × 3.2   |
| Average Order Value  | $Z      | $Z × 1.2 | $Z × 1.4  |
| Customer Retention   | 40%     | 55%      | 70%       |
| Repeat Purchase Rate | 15%     | 25%      | 40%       |

### Channel Distribution (Projected)

| Channel        | Current | 6 Months | 12 Months |
| -------------- | ------- | -------- | --------- |
| Shopify        | 60%     | 45%      | 35%       |
| Facebook Shop  | 0%      | 20%      | 25%       |
| Instagram Shop | 0%      | 15%      | 20%       |
| TikTok Shop    | 0%      | 10%      | 15%       |
| WhatsApp       | 0%      | 5%       | 5%        |

---

## Risk Mitigation

| Risk                       | Probability | Impact | Mitigation                                    |
| -------------------------- | ----------- | ------ | --------------------------------------------- |
| API rate limiting          | Medium      | Medium | Implement queue system, batch requests        |
| Data sync failures         | Low         | High   | Redundant sync, error alerts, manual override |
| Inventory discrepancies    | Medium      | High   | Real-time validation, reconciliation jobs     |
| Customer experience issues | Medium      | High   | Comprehensive testing, gradual rollout        |
| Team capacity              | High        | Medium | Hire developer, use managed services          |

---

## Success Metrics & KPIs

### Phase 1 Success Metrics

- ✅ 100% of Shopify products visible in Meta shops
- ✅ Zero checkout errors
- ✅ First order from Facebook/Instagram shop

### Phase 2 Success Metrics

- ✅ 99.9% inventory sync success rate
- ✅ <5 minute inventory update latency
- ✅ Zero inventory discrepancies

### Phase 3 Success Metrics

- ✅ 100% product coverage in unified catalog
- ✅ 95% field accuracy
- ✅ <1 minute sync time to all channels

### Phase 4 Success Metrics

- ✅ Zero overselling incidents
- ✅ 99.99% inventory accuracy
- ✅ <1 second inventory query response time

### Phase 5 Success Metrics

- ✅ 25-35% conversion rate increase (AR try-on)
- ✅ 15-20% average order value increase (AI personalization)
- ✅ 30-40% engagement increase (WhatsApp)
- ✅ 20-30% customer acquisition growth (TikTok)
- ✅ 25-30% marketing ROI improvement (Analytics)

---

## Conclusion

Marjahan's Jewelry is positioned to become a leading omnichannel jewelry retailer by implementing this comprehensive integration roadmap. The phased approach ensures quick wins (Phase 1) while building toward a sophisticated, AI-powered commerce platform that drives significant revenue growth.

The jewelry market is growing at 5.41% annually, and omnichannel retailers capture 4-10% more revenue than single-channel competitors. By executing this roadmap, Marjahan's can capture significant market share and establish itself as a trusted, innovative jewelry brand.

**Recommended Next Step:** Begin Phase 1 implementation immediately to restore product visibility and capture pending sales.

---

## Appendix: Detailed Technical Specifications

### API Integration Specifications

#### Shopify API

- **Endpoint:** `https://marjahans.myshopify.com/admin/api/2024-01/`
- **Authentication:** OAuth 2.0 with API access token
- **Key Resources:** Products, InventoryLevels, Orders, Webhooks
- **Rate Limit:** 2 requests/second (40 per minute)

#### Meta Graph API

- **Endpoint:** `https://graph.instagram.com/v19.0/`
- **Authentication:** App access token
- **Key Resources:** Catalog, Product, InventoryItem, Shop
- **Rate Limit:** 100 requests/second (batch), 10 requests/second (single)

#### Shopify Webhook Events

- `products/create` - New product created
- `products/update` - Product details changed
- `products/delete` - Product deleted
- `inventory_levels/update` - Stock level changed
- `orders/create` - New order placed
- `orders/updated` - Order status changed

### Database Schema

**Products Table**

```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  shopify_id VARCHAR(255) UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  currency VARCHAR(3),
  material VARCHAR(100),
  purity VARCHAR(50),
  weight VARCHAR(50),
  gemstone_type VARCHAR(100),
  design_style VARCHAR(100),
  occasion VARCHAR(100),
  sku VARCHAR(100) UNIQUE,
  status ENUM('active', 'draft', 'archived'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  synced_to_meta BOOLEAN DEFAULT FALSE,
  synced_to_tiktok BOOLEAN DEFAULT FALSE,
  last_synced_at TIMESTAMP
);
```

**Inventory Table**

```sql
CREATE TABLE inventory (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  warehouse_stock INT DEFAULT 0,
  reserved_stock INT DEFAULT 0,
  available_stock INT GENERATED ALWAYS AS (warehouse_stock - reserved_stock),
  shopify_available INT,
  facebook_available INT,
  instagram_available INT,
  tiktok_available INT,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

---

**Document End**
