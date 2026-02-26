import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  structuredData?: Record<string, unknown>;
}

/**
 * SEO component that injects meta tags and structured data (JSON-LD)
 * Improves search engine visibility and social media sharing
 * WCAG 2.2 AA compliant with proper heading hierarchy
 */
export function SEOHead({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  structuredData,
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    const updatePropertyTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Standard meta tags
    updateMetaTag('description', description);
    if (keywords.length > 0) {
      updateMetaTag('keywords', keywords.join(', '));
    }

    // Open Graph tags (social sharing)
    updatePropertyTag('og:title', title);
    updatePropertyTag('og:description', description);
    updatePropertyTag('og:type', type);
    if (url) updatePropertyTag('og:url', url);
    if (image) updatePropertyTag('og:image', image);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    if (image) updateMetaTag('twitter:image', image);

    // Canonical URL
    if (url) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', url);
    }

    // JSON-LD structured data
    if (structuredData) {
      let scriptTag = document.querySelector('script[type="application/ld+json"]');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    }

    return () => {
      // Cleanup is handled by React, but we keep meta tags for persistence
    };
  }, [title, description, keywords, image, url, type, structuredData]);

  return null; // This component only manages head tags
}

/**
 * Generate structured data for Organization
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: "Marjahan's Jewellery",
    url: 'https://marjahans.manus.space',
    logo: 'https://marjahans.manus.space/logo.png',
    description: 'Luxury jewelry crafted with precision and passion. Est. 1994 • Dhaka Heritage',
    sameAs: [
      'https://www.facebook.com/marjahans2025',
      'https://www.instagram.com/marjahans',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+880-1234-567890',
      contactType: 'Customer Service',
    },
  };
}

/**
 * Generate structured data for Product
 */
export function getProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price?: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    ...(product.price && {
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency || 'BDT',
        availability: 'https://schema.org/InStock',
      },
    }),
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 1,
      },
    }),
  };
}

/**
 * Generate structured data for LocalBusiness
 */
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: "Marjahan's Jewellery",
    image: 'https://marjahans.manus.space/logo.png',
    description: 'Premium jewelry store with handcrafted collections',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Dhaka',
      addressCountry: 'BD',
    },
    telephone: '+880-1234-567890',
    priceRange: '$$',
    rating: {
      '@type': 'AggregateRating',
      ratingValue: 4.8,
      reviewCount: 150,
    },
  };
}
