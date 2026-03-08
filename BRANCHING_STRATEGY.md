# Git Branching Strategy for Multi-Agent Collaboration

## Overview

This document defines the Git workflow and branching strategy for Marjahan's e-commerce platform development. It enables multiple AI agents and developers to work simultaneously on different features while maintaining code quality, preventing conflicts, and ensuring smooth integration.

---

## Branch Hierarchy

The repository follows a **modified Git Flow** model optimized for multi-agent collaboration:

```
main (production-ready)
  ├── staging (pre-production testing)
  │    └── feature/* (feature branches)
  │         ├── feature/product-catalog
  │         ├── feature/dynamic-pricing
  │         ├── feature/facebook-sync
  │         └── feature/admin-dashboard
  │
  ├── bugfix/* (bug fixes)
  │    ├── bugfix/inventory-sync
  │    └── bugfix/checkout-flow
  │
  └── experimental/* (research/POC)
       ├── experimental/ar-tryon
       └── experimental/ml-recommendations
```

---

## Branch Naming Conventions

All branches must follow strict naming conventions to enable automated tooling and clear communication:

### **Feature Branches**
Format: `feature/{feature-name}`

Examples:
- `feature/product-catalog` - Core product listing and management
- `feature/dynamic-pricing-engine` - Jewelry pricing logic
- `feature/facebook-shop-sync` - Meta integration
- `feature/whatsapp-integration` - WhatsApp Business API
- `feature/admin-dashboard` - Admin panel
- `feature/ar-product-viewer` - AR try-on feature
- `feature/inventory-management` - Stock tracking system

**Rules:**
- Use lowercase letters and hyphens only
- Maximum 50 characters
- Be descriptive but concise
- One feature per branch

### **Bugfix Branches**
Format: `bugfix/{issue-number}-{description}`

Examples:
- `bugfix/123-checkout-validation`
- `bugfix/456-inventory-sync-delay`
- `bugfix/789-payment-gateway-timeout`

**Rules:**
- Reference the GitHub issue number
- Include brief description
- Use lowercase letters and hyphens

### **Experimental/Research Branches**
Format: `experimental/{feature-name}`

Examples:
- `experimental/ar-jewelry-tryon`
- `experimental/ml-personalization`
- `experimental/voice-commerce`

**Rules:**
- Use for POCs and research
- Can be deleted after evaluation
- Do not merge to main without review

### **Hotfix Branches**
Format: `hotfix/{issue-number}-{description}`

Examples:
- `hotfix/critical-payment-bug`
- `hotfix/security-vulnerability`

**Rules:**
- Only for critical production issues
- Branch from `main`
- Merge back to both `main` and `staging`

---

## Workflow: Agent Development Process

### **Step 1: Create Feature Branch**

Each agent starts by creating a feature branch from `staging`:

```bash
# Update local staging branch
git checkout staging
git pull origin staging

# Create and switch to feature branch
git checkout -b feature/your-feature-name

# Verify you're on the correct branch
git branch -v
```

### **Step 2: Development Phase**

While developing, follow these practices:

**Commit Frequently with Clear Messages**
```bash
# Good commit messages
git commit -m "feat: add product variant selector component"
git commit -m "fix: resolve inventory calculation bug in checkout"
git commit -m "docs: update product schema documentation"

# Commit message format: {type}: {description}
# Types: feat, fix, docs, style, refactor, test, chore
```

**Keep Branch Updated**
```bash
# Regularly sync with staging to avoid conflicts
git fetch origin
git rebase origin/staging

# If conflicts occur, resolve them locally
git status  # See conflicted files
# Edit files to resolve conflicts
git add .
git rebase --continue
```

**Push Changes Regularly**
```bash
# Push to remote branch (creates backup)
git push origin feature/your-feature-name

# If rebased, force push (safe on feature branches)
git push origin feature/your-feature-name --force-with-lease
```

### **Step 3: Self-Testing**

Before creating a pull request, verify your work:

```bash
# Run tests
pnpm test

# Run linting
pnpm lint

# Run type checking
pnpm check

# Build locally
pnpm build

# Test in dev environment
pnpm dev
```

All tests must pass before proceeding to Step 4.

### **Step 4: Create Pull Request**

When ready, create a pull request to `staging`:

```bash
# Push final changes
git push origin feature/your-feature-name

# Create PR via GitHub CLI or web interface
gh pr create --base staging --title "feat: add product catalog system"
```

**PR Title Format:** `{type}({scope}): {description}`

Examples:
- `feat(products): add dynamic pricing engine`
- `fix(checkout): resolve payment validation bug`
- `docs(api): update tRPC procedure documentation`

**PR Description Template:**
```markdown
## Description
Brief explanation of what this PR does and why.

## Changes
- Change 1
- Change 2
- Change 3

## Testing
How to test these changes:
1. Step 1
2. Step 2

## Checklist
- [ ] Tests pass locally
- [ ] No linting errors
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Reviewed by lead agent
```

### **Step 5: Code Review**

The lead agent reviews the PR using the checklist in `PR_REVIEW_CHECKLIST.md`. The review process includes:

1. **Code Quality** - Does it follow standards?
2. **Functionality** - Does it work as intended?
3. **Testing** - Are tests comprehensive?
4. **Documentation** - Is it documented?
5. **Performance** - Does it impact performance?
6. **Security** - Are there security concerns?

### **Step 6: Address Feedback**

If the reviewer requests changes:

```bash
# Make requested changes
# Commit with clear messages
git commit -m "review: address feedback on pricing logic"

# Push changes
git push origin feature/your-feature-name

# The PR automatically updates
```

### **Step 7: Merge to Staging**

Once approved, the PR is merged to `staging`:

```bash
# Lead agent merges via GitHub
# Uses "Squash and merge" for cleaner history
```

### **Step 8: Merge to Main (Release)**

When ready for production, staging is merged to main:

```bash
# Create release PR from staging to main
gh pr create --base main --title "release: v1.0.0"

# After final testing, merge to main
# Uses "Create a merge commit" to preserve history
```

---

## Parallel Development Scenarios

### **Scenario 1: Two Agents on Different Features**

```
Agent A: feature/product-catalog
Agent B: feature/dynamic-pricing

Both branch from staging
Both work independently
Both create PRs to staging
PRs reviewed and merged sequentially
```

**No conflicts expected** because they're modifying different files.

### **Scenario 2: Two Agents on Related Features**

```
Agent A: feature/admin-dashboard (modifies server/routers.ts)
Agent B: feature/product-management (modifies server/routers.ts)

Both branch from staging
Both modify the same file
Potential conflicts when merging
```

**Conflict Resolution:**
1. Agent A merges first to staging
2. Agent B rebases on updated staging
3. Agent B resolves conflicts locally
4. Agent B pushes resolved branch
5. Agent B's PR merges cleanly

### **Scenario 3: Three Agents on Interdependent Features**

```
Agent A: feature/product-catalog (creates Product type)
Agent B: feature/dynamic-pricing (uses Product type)
Agent C: feature/inventory-management (uses Product type)

Dependency order: A → B, C

Execution:
1. Agent A develops and merges first
2. Agent B and C pull updated staging
3. Agent B and C develop with latest types
4. Agent B and C merge in parallel
```

**Key:** Agent A must merge before B and C start using the new types.

---

## Conflict Resolution Process

When merge conflicts occur:

### **Automatic Conflicts (Git handles)**
```bash
# Rebase to get latest staging
git fetch origin
git rebase origin/staging

# Git shows conflicted files
# Edit files to resolve conflicts
# Look for <<<<<<, ======, >>>>>> markers

# After resolving
git add .
git rebase --continue
git push origin feature/your-feature-name --force-with-lease
```

### **Logical Conflicts (Requires Discussion)**

If two agents modify the same feature differently:

1. **Identify the conflict** - What are the two approaches?
2. **Discuss with lead agent** - Which approach is better?
3. **Decide on resolution** - Implement the chosen approach
4. **Update both branches** - Ensure both agents have the resolution
5. **Merge in order** - First agent merges, second rebases and merges

---

## Branch Protection Rules

The `main` and `staging` branches have protection rules:

| Rule | Requirement |
|------|-------------|
| **Require pull request reviews** | Minimum 1 approval required |
| **Require status checks** | All CI/CD checks must pass |
| **Require branches up to date** | Must be rebased on latest main/staging |
| **Require code review from owner** | Lead agent must approve |
| **Dismiss stale reviews** | Reviews reset if new commits pushed |
| **Restrict who can push** | Only lead agent can push directly |
| **Require conversation resolution** | All review comments must be resolved |

---

## Integration Checkpoints

### **Daily Sync**
Each agent should sync their branch with staging daily:

```bash
git fetch origin
git rebase origin/staging
git push origin feature/your-feature-name --force-with-lease
```

This prevents large conflicts at merge time.

### **Weekly Integration**
Every Friday, the lead agent:

1. Reviews all open PRs
2. Prioritizes merges based on dependencies
3. Merges PRs in dependency order
4. Notifies agents of merged changes
5. Ensures all agents rebase on updated staging

### **Bi-Weekly Release**
Every two weeks:

1. Feature freeze - no new features merged
2. Bug fixes only
3. Final testing on staging
4. Merge staging to main
5. Tag release version
6. Deploy to production

---

## Commit Message Standards

All commits must follow the Conventional Commits format:

```
{type}({scope}): {description}

{optional body}

{optional footer}
```

### **Types**

| Type | Purpose | Example |
|------|---------|---------|
| `feat` | New feature | `feat(pricing): add dynamic pricing engine` |
| `fix` | Bug fix | `fix(checkout): resolve payment validation` |
| `docs` | Documentation | `docs(api): update tRPC procedures` |
| `style` | Code style | `style: format product component` |
| `refactor` | Code refactor | `refactor(db): optimize query performance` |
| `test` | Test changes | `test(pricing): add pricing formula tests` |
| `chore` | Build/config | `chore: update dependencies` |

### **Scope**

Specify the component or module affected:
- `pricing` - Pricing engine
- `products` - Product catalog
- `inventory` - Inventory management
- `checkout` - Checkout flow
- `admin` - Admin dashboard
- `api` - API/tRPC
- `db` - Database
- `ui` - User interface

### **Description**

- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period at end
- Maximum 50 characters

### **Body (Optional)**

Explain what and why, not how:

```
feat(pricing): add dynamic pricing engine

The pricing engine calculates jewelry prices based on:
- Gold weight × current market rate
- Making charges (fixed or percentage)
- GST (3%)

This enables real-time price updates when gold rates change.
```

### **Footer (Optional)**

Reference issues:

```
Closes #123
Related to #456
```

---

## Best Practices

### **Do's**

✅ Create small, focused branches (one feature per branch)

✅ Commit frequently with clear messages

✅ Sync with staging daily

✅ Write comprehensive tests

✅ Document your changes

✅ Review other agents' PRs

✅ Communicate about dependencies

✅ Use PR descriptions effectively

### **Don'ts**

❌ Don't commit directly to main or staging

❌ Don't create branches from main (always from staging)

❌ Don't merge without PR review

❌ Don't force push to main or staging

❌ Don't commit large files or secrets

❌ Don't create branches with unclear names

❌ Don't ignore failing tests

❌ Don't work on multiple features in one branch

---

## Emergency Procedures

### **Critical Bug in Production**

```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue

# Fix the bug
# Test thoroughly
# Create PR to main

# After merging to main, also merge to staging
git checkout staging
git pull origin staging
git merge main
git push origin staging
```

### **Accidental Commit to Wrong Branch**

```bash
# If you committed to main instead of feature branch
git log  # Find the commit hash
git revert {commit-hash}  # Revert on main
git push origin main

# Then create proper feature branch
git checkout -b feature/correct-branch
git cherry-pick {commit-hash}  # Apply the commit here
git push origin feature/correct-branch
```

### **Need to Undo Pushed Commits**

```bash
# Only do this if commits haven't been merged
git reset --soft HEAD~1  # Undo last commit, keep changes
git push origin feature/branch-name --force-with-lease
```

---

## Monitoring & Metrics

The lead agent tracks:

| Metric | Target | Purpose |
|--------|--------|---------|
| **Merge frequency** | 2-3 per week | Ensures regular integration |
| **PR review time** | < 24 hours | Keeps development flowing |
| **Conflict rate** | < 10% | Indicates coordination issues |
| **Test pass rate** | 100% | Ensures code quality |
| **Deployment frequency** | Bi-weekly | Regular releases |

---

## Tools & Commands Reference

### **Essential Git Commands**

```bash
# Create and switch to branch
git checkout -b feature/name

# List all branches
git branch -a

# Switch branches
git checkout feature/name

# Sync with remote
git fetch origin
git rebase origin/staging

# Push changes
git push origin feature/name

# Create pull request
gh pr create --base staging

# View PR status
gh pr view

# Merge PR
gh pr merge --squash
```

### **Useful Aliases** (Add to ~/.gitconfig)

```bash
[alias]
  co = checkout
  br = branch
  ci = commit
  st = status
  unstage = reset HEAD --
  last = log -1 HEAD
  visual = log --graph --oneline --all
```

---

## Questions & Support

For questions about the branching strategy:

1. **Consult this document** - Most scenarios are covered
2. **Check CONFLICT_RESOLUTION.md** - For merge issues
3. **Ask the lead agent** - For complex situations
4. **Review past PRs** - See examples of proper workflow

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-08 | Initial branching strategy |

---

**Last Updated:** March 8, 2026
**Maintained By:** Lead Agent (Manus AI)
