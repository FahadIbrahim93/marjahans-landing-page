# Marjahans Jewellery Landing Page - Design Strategy

## Brand Analysis

### Facebook Page Insights

- **Bio**: "Assalamualaikum ❤️🎀 Welcome to MARJAHAN'S 💎 Where LUXURY meets AFFORDABILITY 💛"
- **Tagline**: "Where LUXURY meets AFFORDABILITY"
- **Location**: Mohammadpur, Dhaka, Bangladesh
- **Category**: Page · Entrepreneur
- **Followers**: 638
- **Content Style**: Product showcase with jewelry photography, emphasis on craftsmanship
- **Visual Aesthetic**: Gold jewelry on nature backgrounds, feminine branding with hearts and ribbons

### Existing Website (GitHub) Insights

- **Tech Stack**: Next.js 16, Tailwind CSS, GSAP, Three.js
- **Color Scheme**: Dark mode with obsidian background, amber/gold accents
- **Typography**: Serif fonts (Playfair) for headings, sans-serif (Outfit) for body
- **Design Philosophy**: "Sovereign UI" - Premium dark-mode aesthetics, luxury e-commerce
- **Key Features**: GSAP scrollytelling, cinematic hero transitions, luxury branding
- **Tagline**: "Est. 1994 • Dhaka Heritage"
- **Aesthetic**: Forensic precision, high-fidelity luxury, obsidian-grade visual fidelity

## Landing Page Design Direction

### Design Philosophy: **Luxury Heritage Minimalism**

Blend the existing website's dark, premium aesthetic with the Facebook brand's warmth and accessibility. Create a sophisticated landing page that feels like a curated gallery rather than a typical e-commerce site.

### Color Palette

- **Primary Background**: Deep obsidian (#020617 / oklch(0.13 0.028 261.692))
- **Accent Color**: Warm amber/gold (#FFC107 / oklch(0.928 0.006 264.531))
- **Text Primary**: Off-white (#E2E8F0 / oklch(0.985 0.002 247.839))
- **Text Secondary**: Slate gray (#94A3B8)
- **Card Background**: Slightly lighter obsidian (#1E293B / oklch(0.21 0.034 264.665))

### Typography System

- **Display Font**: Playfair Display (serif) - for headings, luxury feel
- **Body Font**: Outfit (sans-serif) - for readability, modern touch
- **Hierarchy**:
  - H1: Large, serif, uppercase, tight letter-spacing
  - H2: Medium, serif, uppercase
  - Body: Regular weight, sans-serif, generous line-height

### Layout Paradigm

- **Hero Section**: Full-viewport cinematic hero with GSAP scroll animations
- **Service Cards**: Irregular Bento-style grid showcasing jewelry categories
- **Social Proof**: Customer testimonials with jewelry images
- **Contact Form**: Elegant modal or footer section with minimal fields
- **Navigation**: Minimal top navigation with logo and CTA

### Signature Elements

1. **Amber Accent Bars**: Thin vertical/horizontal lines using the gold accent color
2. **Glass Morphism Cards**: Frosted glass effect with backdrop blur for service cards
3. **Serif Typography Emphasis**: Luxury brand markers using Playfair Display
4. **Jewelry Product Imagery**: High-quality product photos as background elements
5. **Scroll Animations**: GSAP-powered cinematic transitions

### Interaction Philosophy

- **Hover Effects**: Subtle color shifts, slight scale increases, smooth transitions
- **Scroll Triggers**: Staggered animations as elements enter viewport
- **Form Interactions**: Smooth focus states, clear visual feedback
- **Navigation**: Sticky header with minimal chrome, emphasis on content

### Animation Guidelines

- **Entrance**: Elements fade in and slide up on page load (0.8-1.2s)
- **Scroll**: Parallax effects on hero, scale/opacity changes on scroll
- **Hover**: 200ms transitions, subtle scale (1.02x) and color shifts
- **Form**: Input focus with amber underline, smooth label animations

### Content Structure

1. **Hero Section**: Brand story with GSAP animations
2. **Service Cards**: 4-6 jewelry categories (Rings, Necklaces, Bracelets, Earrings, Bespoke, Collections)
3. **Social Proof**: Top customer comments/testimonials with images
4. **Contact Form**: Email, phone, message with elegant styling
5. **Footer**: Links, social media, location info

## Implementation Notes

- Use existing color variables from the base website
- Leverage GSAP for scroll animations (already in dependencies)
- Create reusable component patterns for cards and sections
- Ensure mobile responsiveness with Tailwind breakpoints
- Maintain accessibility with proper contrast ratios and semantic HTML
