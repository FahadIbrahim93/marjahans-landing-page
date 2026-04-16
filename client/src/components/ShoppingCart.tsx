import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cartStore";

/**
 * Shopping Cart Component
 * Displays cart items with:
 * - Quantity controls
 * - Item removal
 * - Total price calculation
 * - Checkout button
 * - Empty state
 */
export function ShoppingCart() {
  const [, setLocation] = useLocation();
  const {
    items,
    removeItem,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart,
  } = useCartStore();

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          Your cart is empty
        </h3>
        <p className="text-slate-400">
          Add some beautiful jewelry to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cart items */}
      <div className="space-y-4">
        {items.map(item => (
          <div
            key={item.id}
            className="flex gap-4 bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-amber-500/30 transition-colors"
          >
            {/* Product image */}
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product details */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white truncate">{item.name}</h4>
              {item.size && (
                <p className="text-sm text-slate-400">Size: {item.size}</p>
              )}
              {item.customization && (
                <p className="text-sm text-slate-400">
                  Custom: {item.customization}
                </p>
              )}
              <p className="text-amber-400 font-semibold mt-2">
                ৳{item.price.toLocaleString()}
              </p>
            </div>

            {/* Quantity controls */}
            <div className="flex items-center gap-2 bg-slate-700 rounded-lg p-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="p-1 hover:bg-slate-600 rounded transition-colors"
                aria-label={`Decrease quantity of ${item.name}`}
              >
                <Minus className="w-4 h-4 text-slate-300" />
              </button>
              <span className="w-8 text-center text-white font-semibold">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="p-1 hover:bg-slate-600 rounded transition-colors"
                aria-label={`Increase quantity of ${item.name}`}
              >
                <Plus className="w-4 h-4 text-slate-300" />
              </button>
            </div>

            {/* Remove button */}
            <button
              onClick={() => removeItem(item.id)}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400 hover:text-red-300"
              aria-label={`Remove ${item.name} from cart`}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Cart summary */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-lg border border-amber-500/20 p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-slate-300">
            <span>Subtotal ({totalItems} items)</span>
            <span>৳{totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Shipping</span>
            <span>৳0 (Free)</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Tax (15%)</span>
            <span>৳{Math.round(totalPrice * 0.15).toLocaleString()}</span>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-4 flex justify-between items-center">
          <span className="text-lg font-bold text-white">Total</span>
          <span className="text-2xl font-bold text-amber-400">
            ৳{Math.round(totalPrice * 1.15).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        <Button
          className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-6"
          size="lg"
          onClick={() => alert("Checkout feature coming soon!")}
        >
          Proceed to Checkout
        </Button>

        <Button
          variant="outline"
          className="w-full border-amber-500/30 hover:border-amber-500/60"
          size="lg"
          onClick={() => setLocation("/products")}
        >
          Continue Shopping
        </Button>

        <Button
          variant="ghost"
          onClick={clearCart}
          className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          Clear Cart
        </Button>
      </div>

      {/* Trust info */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-sm text-green-300">
        <p className="font-semibold mb-2">✓ Secure Checkout</p>
        <p>
          Your payment is encrypted and secure. We accept all major credit cards
          and digital wallets.
        </p>
      </div>
    </div>
  );
}
