import { ShoppingCart } from "@/components/ShoppingCart";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-background py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-12 tracking-widest text-center">
          Your <span className="text-amber-400">Shopping Bag</span>
        </h1>
        <ShoppingCart />
      </div>
    </div>
  );
}
