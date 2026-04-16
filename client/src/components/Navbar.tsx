import { Link } from "wouter";
import { ShoppingCart, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cartStore";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const totalItems = useCartStore(state => state.getTotalItems());

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-2 h-2 bg-amber-400 rounded-full group-hover:scale-125 transition-transform" />
          <span className="text-xl font-bold text-white tracking-widest">
            MARJAHAN'S
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm text-slate-300 hover:text-amber-400 transition-colors uppercase tracking-widest"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-sm text-slate-300 hover:text-amber-400 transition-colors uppercase tracking-widest"
          >
            Collections
          </Link>
          <Link
            href="/products"
            className="text-sm text-slate-300 hover:text-amber-400 transition-colors uppercase tracking-widest"
          >
            Bespoke
          </Link>

          <div className="flex items-center gap-4 ml-4 pl-8 border-l border-white/10">
            <Link
              href="/wishlist"
              className="relative p-2 text-slate-300 hover:text-amber-400 transition-colors"
            >
              <Heart className="w-5 h-5" />
            </Link>
            <Link
              href="/cart"
              className="relative p-2 text-slate-300 hover:text-amber-400 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <Button
          variant="ghost"
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 inset-x-0 bg-background border-b border-white/5 p-6 space-y-6">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block text-lg text-white uppercase tracking-widest"
          >
            Home
          </Link>
          <Link
            href="/products"
            onClick={() => setIsOpen(false)}
            className="block text-lg text-white uppercase tracking-widest"
          >
            Collections
          </Link>
          <Link
            href="/wishlist"
            onClick={() => setIsOpen(false)}
            className="block text-lg text-white uppercase tracking-widest"
          >
            Wishlist
          </Link>
          <Link
            href="/cart"
            onClick={() => setIsOpen(false)}
            className="block text-lg text-white uppercase tracking-widest"
          >
            Cart ({totalItems})
          </Link>
        </div>
      )}
    </nav>
  );
}
