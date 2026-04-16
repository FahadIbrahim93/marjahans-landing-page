# Agent Collaboration Framework

## Overview

This document defines how multiple AI agents collaborate on the Marjahan's e-commerce platform. It establishes clear roles, responsibilities, communication protocols, and workflows to ensure efficient parallel development while maintaining code quality and project coherence.

---

## Agent Roles & Responsibilities

### **Lead Agent (Manus AI - Primary)**

The Lead Agent serves as the project architect, coordinator, and final decision-maker.

**Responsibilities:**

The Lead Agent owns the overall project vision and ensures all work aligns with business goals. This agent maintains the project roadmap, prioritizes features based on business impact, and makes architectural decisions. The Lead Agent reviews all pull requests before merging, ensures code quality standards are met, and resolves conflicts between different agents' approaches. Additionally, the Lead Agent coordinates dependencies between features, manages the release schedule, and communicates project status to stakeholders.

**Authority:**

The Lead Agent has final approval on all code merges to `staging` and `main` branches. This agent can override decisions made by other agents if necessary for project coherence. The Lead Agent can reassign tasks, adjust timelines, and modify the project roadmap based on business needs.

**Time Commitment:**

The Lead Agent dedicates 40-50% of time to coordination, review, and decision-making. The remaining time is spent on high-priority feature development.

**Key Activities:**

- Daily standup coordination
- PR review and approval
- Architecture decisions
- Conflict resolution
- Release management
- Stakeholder communication

---

### **Backend Agent (Feature Development)**

Backend agents focus on server-side logic, database design, API development, and business logic implementation.

**Responsibilities:**

Backend agents develop tRPC procedures, database schemas, business logic, and API integrations. These agents implement features like product catalog management, dynamic pricing engine, inventory management, and order processing. Backend agents write comprehensive tests for their code, document API contracts, and ensure database efficiency. They also handle integrations with external services like Stripe, Meta APIs, WhatsApp, and other payment/communication platforms.

**Typical Features:**

- Product catalog system
- Dynamic pricing engine
- Inventory management
- Order processing
- Payment integration
- Multi-channel sync (Facebook, Instagram, WhatsApp)
- Admin dashboard backend
- Analytics and reporting

**Collaboration Points:**

Backend agents coordinate with Frontend agents on API contracts. They communicate with the Lead Agent about database schema changes and architectural decisions. Backend agents may work with other Backend agents on interdependent features.

**Skills Required:**

- Node.js and TypeScript expertise
- Database design and optimization
- API design (tRPC, REST)
- Payment gateway integration
- Third-party API integration
- Business logic implementation

---

### **Frontend Agent (UI/UX Development)**

Frontend agents focus on user interface, user experience, and client-side logic.

**Responsibilities:**

Frontend agents build React components, implement user interfaces, handle client-side state management, and create responsive designs. These agents develop product listing pages, product detail pages, shopping cart, checkout flow, admin dashboard UI, and customer-facing features. Frontend agents ensure accessibility standards are met, implement performance optimizations, and create intuitive user experiences. They work closely with Backend agents to consume tRPC procedures and handle loading/error states.

**Typical Features:**

- Product listing and filtering
- Product detail pages with 360° viewer
- Shopping cart and wishlist
- Checkout flow
- Admin dashboard UI
- Customer profile and order history
- Live chat widget
- Search and navigation

**Collaboration Points:**

Frontend agents depend on Backend agents for API contracts. They coordinate with the Lead Agent on design decisions and UX improvements. Frontend agents may work with other Frontend agents on large features that require multiple components.

**Skills Required:**

- React and TypeScript expertise
- Tailwind CSS and component libraries
- State management (Zustand, React Query)
- Responsive design
- Accessibility (WCAG)
- Performance optimization
- UX best practices

---

### **Integration Agent (Third-Party Services)**

Integration agents specialize in connecting external services and platforms.

**Responsibilities:**

Integration agents implement connections to Meta APIs (Facebook Shop, Instagram), WhatsApp Business API, Telegram Bot API, Stripe payment processing, and other third-party services. These agents handle authentication, data mapping, error handling, and monitoring of integrations. They create adapters and middleware to abstract third-party complexity. Integration agents write integration tests and maintain integration documentation.

**Typical Features:**

- Facebook Shop sync
- Instagram Shopping integration
- WhatsApp Business API
- Telegram Bot
- Stripe payment processing
- Email service integration
- SMS service integration
- Analytics platforms

**Collaboration Points:**

Integration agents work closely with Backend agents to ensure smooth API integration. They coordinate with the Lead Agent on integration priorities and dependencies. Integration agents may need to work with Frontend agents when integrations require UI changes.

**Skills Required:**

- API integration expertise
- OAuth and authentication flows
- Webhook handling
- Data transformation and mapping
- Error handling and monitoring
- Documentation
- Testing and debugging

---

### **QA/Testing Agent (Quality Assurance)**

QA agents ensure code quality, test coverage, and system reliability.

**Responsibilities:**

QA agents write and maintain test suites, including unit tests, integration tests, and end-to-end tests. These agents verify that features work as intended, catch bugs before they reach production, and ensure performance standards are met. QA agents create test plans for new features, document test cases, and maintain test automation infrastructure. They also perform manual testing of complex scenarios and user flows.

**Typical Activities:**

- Writing unit tests (Vitest)
- Writing integration tests
- Writing end-to-end tests
- Test coverage monitoring
- Performance testing
- Security testing
- Bug reporting and verification
- Test automation

**Collaboration Points:**

QA agents work with all other agents to understand features and create appropriate tests. They report issues to the agent responsible for that feature. QA agents coordinate with the Lead Agent on testing priorities and release readiness.

**Skills Required:**

- Testing frameworks (Vitest, Playwright)
- Test automation
- Test planning and strategy
- Performance profiling
- Security testing basics
- Bug reporting
- Requirements analysis

---

### **DevOps/Infrastructure Agent (Deployment & Monitoring)**

DevOps agents manage deployment, infrastructure, monitoring, and system reliability.

**Responsibilities:**

DevOps agents set up CI/CD pipelines, manage deployments, monitor system health, and handle infrastructure scaling. These agents ensure the application runs reliably in production, set up logging and monitoring, and handle incident response. DevOps agents manage environment configurations, database migrations, and backup procedures. They also optimize performance and ensure security best practices are followed.

**Typical Activities:**

- CI/CD pipeline setup
- Deployment automation
- Environment management
- Monitoring and alerting
- Performance optimization
- Security hardening
- Backup and disaster recovery
- Incident response

**Collaboration Points:**

DevOps agents work with all other agents to understand deployment requirements. They coordinate with the Lead Agent on release schedules and infrastructure decisions. DevOps agents may need to work with Backend agents on database migrations and scaling issues.

**Skills Required:**

- CI/CD tools (GitHub Actions)
- Docker and containerization
- Monitoring tools
- Logging and observability
- Performance optimization
- Security best practices
- Infrastructure as Code

---

## Communication Protocols

### **Daily Standup**

**Time:** 9:00 AM UTC (or agreed time)

**Duration:** 15 minutes

**Attendees:** All active agents

**Format:**

Each agent briefly shares:

1. What they completed yesterday
2. What they're working on today
3. Any blockers or dependencies

**Example:**

> Backend Agent: "Yesterday I completed the dynamic pricing engine. Today I'm working on the inventory sync. I need the product schema from the Lead Agent by EOD."

### **Weekly Sync**

**Time:** Every Friday, 2:00 PM UTC

**Duration:** 30 minutes

**Attendees:** All agents + Lead Agent

**Agenda:**

1. Progress review (each agent updates on weekly progress)
2. Blockers and dependencies (identify and resolve issues)
3. Next week priorities (Lead Agent assigns next week's work)
4. Code review status (review pending PRs)
5. Release planning (if applicable)

### **Async Communication**

For non-urgent communication, agents use GitHub:

- **GitHub Issues** - For feature requests, bugs, and tasks
- **GitHub Discussions** - For questions and knowledge sharing
- **PR Comments** - For code review feedback
- **Commit Messages** - For documenting changes

**Response Time Expectations:**

- Critical issues: 2 hours
- Important issues: 24 hours
- Regular questions: 48 hours

### **Escalation Path**

If an agent encounters a blocker:

1. **Try to resolve independently** - Check documentation, search past issues
2. **Ask in GitHub** - Post question in relevant issue or discussion
3. **Notify relevant agent** - Direct message the agent who can help
4. **Escalate to Lead Agent** - If unresolved within 24 hours

---

## Workflow: How Agents Work Together

### **Feature Development Workflow**

**Phase 1: Planning (Lead Agent + Relevant Agents)**

The Lead Agent creates a GitHub issue for the new feature with:

- Feature description and business context
- Acceptance criteria
- Estimated complexity (small/medium/large)
- Dependencies on other features
- Suggested agent assignment

Example:

```markdown
## Feature: Dynamic Pricing Engine

### Description

Implement a pricing engine that calculates jewelry prices based on:

- Gold weight × current market rate
- Making charges (fixed or percentage)
- GST (3%)

### Acceptance Criteria

- [ ] Prices update when gold rates change
- [ ] Component-level discounts work correctly
- [ ] API returns pricing breakdown to frontend
- [ ] 95% test coverage

### Dependencies

- Product schema must be finalized first
- Requires database migration

### Assigned To

Backend Agent
```

**Phase 2: Design (Assigned Agent + Lead Agent)**

The assigned agent creates a design document:

```markdown
## Technical Design: Dynamic Pricing Engine

### Database Schema

[Schema details]

### API Contract

[tRPC procedure definitions]

### Algorithm

[Pricing calculation logic]

### Error Handling

[Edge cases and error scenarios]
```

The Lead Agent reviews and approves the design before development starts.

**Phase 3: Development (Assigned Agent)**

The agent creates a feature branch and develops the feature:

```bash
git checkout -b feature/dynamic-pricing-engine
# Development work
# Regular commits with clear messages
git push origin feature/dynamic-pricing-engine
```

**Phase 4: Testing (Assigned Agent + QA Agent)**

The assigned agent writes tests:

```bash
# Unit tests
pnpm test server/pricing.test.ts

# Integration tests
pnpm test server/pricing-integration.test.ts
```

The QA agent reviews test coverage and may write additional tests.

**Phase 5: Code Review (Lead Agent + Other Agents)**

The agent creates a PR to `staging`:

```bash
gh pr create --base staging --title "feat(pricing): add dynamic pricing engine"
```

The Lead Agent and other agents review:

- Code quality
- Test coverage
- Documentation
- Performance implications
- Security considerations

**Phase 6: Refinement (Assigned Agent)**

The agent addresses review feedback:

```bash
# Make requested changes
git commit -m "review: address feedback on pricing calculation"
git push origin feature/dynamic-pricing-engine
```

**Phase 7: Merge (Lead Agent)**

Once approved, the Lead Agent merges to `staging`:

```bash
gh pr merge --squash
```

**Phase 8: Integration Testing (QA Agent)**

The QA agent tests the feature on `staging`:

- Feature works as intended
- No regressions in other features
- Performance is acceptable
- UI/UX is intuitive (if applicable)

**Phase 9: Release (Lead Agent + DevOps Agent)**

When ready, the feature is merged to `main` and deployed:

```bash
# Merge to main
gh pr create --base main --title "release: v1.0.0"

# Deploy
# DevOps agent handles deployment
```

---

## Dependency Management

### **Identifying Dependencies**

When planning a feature, the Lead Agent identifies dependencies:

**Type 1: Sequential Dependencies**

Feature B depends on Feature A. Feature A must be completed first.

Example: Dynamic Pricing Engine (A) must be completed before Inventory Sync (B) can use pricing data.

**Type 2: Parallel Dependencies**

Features can be developed in parallel but must coordinate on shared interfaces.

Example: Product Listing (A) and Product Detail (B) both need the Product type definition.

**Type 3: No Dependencies**

Features can be developed independently with no coordination needed.

Example: Admin Dashboard (A) and AR Try-On (B) are independent.

### **Managing Dependencies**

**For Sequential Dependencies:**

1. Feature A agent completes and merges first
2. Feature B agent waits for Feature A to merge to `staging`
3. Feature B agent rebases on updated `staging`
4. Feature B agent develops with latest code

**For Parallel Dependencies:**

1. Lead Agent defines shared interfaces (types, API contracts)
2. Both agents implement against the shared interface
3. If interface changes, Lead Agent coordinates updates
4. Both agents rebase and update their code
5. Both agents merge in any order

**For No Dependencies:**

Agents develop independently with no coordination needed.

---

## Conflict Resolution

### **Code Conflicts**

When two agents modify the same file:

1. **Identify the conflict** - What are the two changes?
2. **Discuss with agents** - Understand the intent of each change
3. **Decide on resolution** - Which approach is better?
4. **Implement resolution** - One agent updates their code
5. **Merge in order** - First agent merges, second rebases and merges

### **Design Conflicts**

When two agents propose different approaches:

1. **Document both approaches** - Create GitHub issue with both options
2. **Discuss pros/cons** - Lead Agent facilitates discussion
3. **Lead Agent decides** - Makes final decision based on project goals
4. **Communicate decision** - Notify all affected agents
5. **Implement decision** - Agents update their work accordingly

### **Priority Conflicts**

When multiple features compete for resources:

1. **Lead Agent prioritizes** - Based on business impact
2. **Communicate priorities** - Notify all agents
3. **Adjust assignments** - Reassign agents if needed
4. **Update timeline** - Adjust delivery dates accordingly

---

## Knowledge Sharing

### **Documentation Standards**

All agents must document their work:

- **Code comments** - Explain complex logic
- **API documentation** - Document tRPC procedures
- **Database documentation** - Document schema and relationships
- **Integration documentation** - Document external service connections
- **Deployment documentation** - Document deployment procedures

### **Code Review as Learning**

Code reviews are opportunities for knowledge sharing:

- Reviewers learn how features work
- Authors explain their approach
- Team learns best practices
- Questions are encouraged

### **Weekly Knowledge Sharing**

During weekly sync, agents share:

- Interesting solutions they implemented
- Challenges they overcame
- Best practices they discovered
- Tools or techniques that helped

---

## Performance Metrics

The Lead Agent tracks these metrics for each agent:

| Metric                      | Target      | Purpose                     |
| --------------------------- | ----------- | --------------------------- |
| **Code review time**        | < 24 hours  | Keeps development flowing   |
| **PR approval rate**        | > 90%       | Indicates code quality      |
| **Test coverage**           | > 80%       | Ensures reliability         |
| **Deployment success rate** | > 95%       | Indicates stability         |
| **Bug escape rate**         | < 5%        | Measures QA effectiveness   |
| **Feature delivery rate**   | On schedule | Indicates planning accuracy |

---

## Escalation & Decision Making

### **Decision Authority**

| Decision                   | Authority    | Process                        |
| -------------------------- | ------------ | ------------------------------ |
| **Feature scope**          | Lead Agent   | Discusses with relevant agents |
| **Architecture**           | Lead Agent   | Consults with Backend agents   |
| **Design/UX**              | Lead Agent   | Consults with Frontend agents  |
| **Testing strategy**       | QA Agent     | Consults with other agents     |
| **Deployment timing**      | DevOps Agent | Coordinates with Lead Agent    |
| **Code quality standards** | Lead Agent   | Enforces via PR review         |
| **Timeline adjustments**   | Lead Agent   | Communicates to all agents     |

### **Escalation Scenarios**

**Scenario 1: Agent Disagrees with Decision**

1. Agent expresses concern in writing
2. Lead Agent explains reasoning
3. If still unresolved, Lead Agent makes final decision
4. Team moves forward with decision

**Scenario 2: Two Agents Have Conflicting Approaches**

1. Agents document both approaches
2. Lead Agent evaluates both options
3. Lead Agent decides on approach
4. Losing agent implements Lead Agent's decision

**Scenario 3: Feature Blocked by Another Agent**

1. Blocked agent notifies blocking agent
2. Blocking agent prioritizes unblocking
3. If not resolved in 24 hours, escalate to Lead Agent
4. Lead Agent reassigns work if needed

---

## Success Criteria

The collaboration framework is successful when:

- ✅ Features are delivered on schedule
- ✅ Code quality remains high (> 80% test coverage)
- ✅ Merge conflicts are rare (< 10% of PRs)
- ✅ PR review time is fast (< 24 hours)
- ✅ Agents communicate effectively
- ✅ No critical bugs escape to production
- ✅ Team morale is high
- ✅ Knowledge is shared effectively

---

## Onboarding New Agents

When a new agent joins:

1. **Provide documentation** - Share BRANCHING_STRATEGY.md, AGENT_COLLABORATION.md, etc.
2. **Assign a mentor** - Pair with experienced agent for first week
3. **Start with small tasks** - Assign low-complexity features first
4. **Review code carefully** - Extra attention to new agent's PRs
5. **Provide feedback** - Help new agent learn team standards
6. **Gradual responsibility** - Increase complexity as agent learns

---

## Version History

| Version | Date       | Changes                               |
| ------- | ---------- | ------------------------------------- |
| 1.0     | 2026-03-08 | Initial agent collaboration framework |

---

**Last Updated:** March 8, 2026
**Maintained By:** Lead Agent (Manus AI)
