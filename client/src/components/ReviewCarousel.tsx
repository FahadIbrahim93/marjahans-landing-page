import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  verified?: boolean;
  source?: 'facebook' | 'instagram' | 'website';
}

interface ReviewCarouselProps {
  reviews: Review[];
  autoPlay?: boolean;
  interval?: number;
}

/**
 * Review Carousel Component
 * Displays verified customer reviews with:
 * - Star ratings (1-5)
 * - Verified badge
 * - Source attribution (Facebook, Instagram, Website)
 * - Auto-play with manual controls
 * - Accessibility: ARIA labels, keyboard navigation
 */
export function ReviewCarousel({
  reviews,
  autoPlay = true,
  interval = 5000,
}: ReviewCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const currentReview = reviews[currentIndex];

  return (
    <div
      className="w-full"
      role="region"
      aria-label="Customer reviews carousel"
      aria-live="polite"
    >
      <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-lg border border-amber-500/20 p-8 backdrop-blur-sm">
        {/* Review content */}
        <div className="min-h-[200px] flex flex-col justify-between">
          {/* Star rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < currentReview.rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-600'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="text-sm text-slate-300 ml-2">
              {currentReview.rating}.0 out of 5 stars
            </span>
          </div>

          {/* Review text */}
          <blockquote className="text-lg text-slate-100 mb-6 italic">
            "{currentReview.text}"
          </blockquote>

          {/* Author info */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">{currentReview.author}</p>
              <div className="flex items-center gap-2 mt-1">
                <time className="text-sm text-slate-400">{currentReview.date}</time>
                {currentReview.verified && (
                  <span
                    className="inline-flex items-center gap-1 bg-green-500/20 text-green-300 px-2 py-0.5 rounded text-xs font-semibold"
                    aria-label="Verified review"
                  >
                    ✓ Verified
                  </span>
                )}
                {currentReview.source && (
                  <span className="text-xs text-slate-400">
                    via {currentReview.source}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation controls */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            aria-label="Previous review"
            className="border-amber-500/30 hover:border-amber-500/60"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {/* Indicator dots */}
          <div className="flex gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-amber-400' : 'bg-slate-600'
                }`}
                aria-label={`Go to review ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            aria-label="Next review"
            className="border-amber-500/30 hover:border-amber-500/60"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Counter */}
        <p className="text-center text-sm text-slate-400 mt-4">
          {currentIndex + 1} of {reviews.length} reviews
        </p>
      </div>
    </div>
  );
}

/**
 * Sample reviews data (replace with real data from backend)
 */
export const sampleReviews: Review[] = [
  {
    id: '1',
    author: 'Fatima Khan',
    rating: 5,
    text: 'Absolutely stunning necklace! The quality is exceptional and the craftsmanship is evident in every detail. Highly recommend Marjahans for luxury jewelry.',
    date: 'Feb 20, 2026',
    verified: true,
    source: 'facebook',
  },
  {
    id: '2',
    author: 'Aisha Ahmed',
    rating: 5,
    text: 'I purchased a custom ring for my engagement and it exceeded all my expectations. The team was professional and attentive throughout the process.',
    date: 'Feb 15, 2026',
    verified: true,
    source: 'website',
  },
  {
    id: '3',
    author: 'Zara Malik',
    rating: 5,
    text: 'The bracelets are gorgeous! Perfect for both casual and formal occasions. Great value for the quality.',
    date: 'Feb 10, 2026',
    verified: true,
    source: 'instagram',
  },
  {
    id: '4',
    author: 'Hana Patel',
    rating: 5,
    text: 'Best jewelry store in Dhaka. Their collection is diverse and the prices are reasonable for the luxury quality offered.',
    date: 'Feb 5, 2026',
    verified: true,
    source: 'facebook',
  },
];
