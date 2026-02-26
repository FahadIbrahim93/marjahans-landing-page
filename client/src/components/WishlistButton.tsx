import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface WishlistButtonProps {
  productId: string;
  productName: string;
  onToggle?: (isSaved: boolean) => void;
}

/**
 * Wishlist Button Component
 * Allows users to save items for later
 * Persists to localStorage
 */
export function WishlistButton({
  productId,
  productName,
  onToggle,
}: WishlistButtonProps) {
  const [isSaved, setIsSaved] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsSaved(wishlist.includes(productId));
  }, [productId]);

  const handleToggle = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

    if (isSaved) {
      // Remove from wishlist
      const updated = wishlist.filter((id: string) => id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      setIsSaved(false);
    } else {
      // Add to wishlist
      wishlist.push(productId);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsSaved(true);
    }

    onToggle?.(!isSaved);
  };

  return (
    <Button
      onClick={handleToggle}
      variant="outline"
      size="sm"
      className={`gap-2 transition-all ${
        isSaved
          ? 'border-red-500/60 bg-red-500/10 text-red-400 hover:bg-red-500/20'
          : 'border-slate-600 text-slate-300 hover:border-red-500/60 hover:text-red-400'
      }`}
      aria-label={isSaved ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`}
      aria-pressed={isSaved}
    >
      <Heart
        className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`}
      />
      {isSaved ? 'Saved' : 'Save'}
    </Button>
  );
}

/**
 * Wishlist Page Component
 * Displays all saved items
 */
export function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlistItems(wishlist);
  }, []);

  const handleRemove = (productId: string) => {
    const updated = wishlistItems.filter((id) => id !== productId);
    setWishlistItems(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Your wishlist is empty</h3>
        <p className="text-slate-400">
          Save your favorite jewelry to view later
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">My Wishlist ({wishlistItems.length})</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((productId) => (
          <div
            key={productId}
            className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 hover:border-amber-500/30 transition-colors"
          >
            <div className="aspect-square bg-slate-700 rounded-lg mb-4" />
            <p className="font-semibold text-white mb-2">Product {productId}</p>
            <p className="text-amber-400 font-bold mb-4">৳0</p>
            <div className="flex gap-2">
              <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-black">
                Add to Cart
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRemove(productId)}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
