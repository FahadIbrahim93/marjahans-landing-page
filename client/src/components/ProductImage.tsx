import { useState, useEffect } from "react";

interface ProductImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

/**
 * Optimized product image component with:
 * - Lazy loading (native loading="lazy")
 * - WebP/AVIF format support via picture element
 * - Responsive srcset for different device sizes
 * - Proper aspect ratio to prevent CLS (Cumulative Layout Shift)
 * - Accessibility: descriptive alt text, title attribute
 */
export function ProductImage({
  src,
  alt,
  title,
  className = "",
  priority = false,
  width = 400,
  height = 400,
}: ProductImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate responsive image URLs (assuming CDN supports resizing)
  const generateSrcSet = (baseUrl: string): string => {
    // For CDN URLs with query parameters, append size params
    const separator = baseUrl.includes("?") ? "&" : "?";
    return [
      `${baseUrl}${separator}w=400 400w`,
      `${baseUrl}${separator}w=600 600w`,
      `${baseUrl}${separator}w=800 800w`,
      `${baseUrl}${separator}w=1200 1200w`,
    ].join(", ");
  };

  const aspectRatio = width / height;

  return (
    <div
      className={`relative overflow-hidden bg-black/10 ${className}`}
      style={{
        aspectRatio: `${aspectRatio}`,
      }}
    >
      <picture>
        {/* WebP format for modern browsers */}
        <source
          srcSet={generateSrcSet(`${src}?format=webp`)}
          type="image/webp"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* AVIF format for cutting-edge browsers */}
        <source
          srcSet={generateSrcSet(`${src}?format=avif`)}
          type="image/avif"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Fallback JPEG */}
        <img
          src={src}
          alt={alt}
          title={title || alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
          width={width}
          height={height}
        />
      </picture>

      {/* Skeleton loader while image is loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 animate-pulse" />
      )}
    </div>
  );
}
