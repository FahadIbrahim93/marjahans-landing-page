import { useState } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, ShoppingCart, Share2 } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { ProductZoom } from "@/components/ProductZoom";
import { ReviewCarousel } from "@/components/ReviewCarousel";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const slug = params?.slug as string;

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { data: product, isLoading } = trpc.products.getProductBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  const addToCart = useCartStore(state => state.addItem);
  const { mutate: addToWishlist } = trpc.products.addToWishlist.useMutation();
  const { mutate: removeFromWishlist } =
    trpc.products.removeFromWishlist.useMutation();

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: `${product.id}`,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.imageUrl || "/placeholder-jewelry.jpg",
      quantity,
      variantId: selectedVariant ? parseInt(selectedVariant) : undefined,
    });
  };

  const handleWishlist = () => {
    if (!product) return;

    if (isWishlisted) {
      removeFromWishlist({
        productId: product.id,
        visitorId: localStorage.getItem("visitorId") || undefined,
      });
    } else {
      addToWishlist({
        productId: product.id,
        visitorId: localStorage.getItem("visitorId") || undefined,
      });
    }

    setIsWishlisted(!isWishlisted);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-gray-500">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-gray-500 text-lg">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <p className="text-sm text-gray-600">
            Home / Products / {product.name}
          </p>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            {product.images && product.images.length > 0 ? (
              <ProductZoom
                src={product.images[0]?.imageUrl || "/placeholder-jewelry.jpg"}
                alt={product.name}
                title={product.name}
              />
            ) : (
              <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No images available</p>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating &&
              product.rating.rating &&
              product.rating.rating > 0 && (
                <div className="flex items-center mb-6">
                  <div className="flex text-amber-400 text-lg">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < Math.round(product.rating.rating || 0) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-600 ml-3">
                    ({product.rating.count || 0} reviews)
                  </span>
                </div>
              )}

            {/* Price */}
            <div className="mb-6">
              <p className="text-4xl font-bold text-amber-600">
                ₹{(product.price / 100).toFixed(2)}
              </p>
              {product.originalPrice && (
                <p className="text-lg text-gray-500 line-through">
                  ₹{(product.originalPrice / 100).toFixed(2)}
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Product Details */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                Product Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {product.material && (
                  <>
                    <p className="text-gray-600">Material:</p>
                    <p className="font-semibold">{product.material}</p>
                  </>
                )}
                {product.purity && (
                  <>
                    <p className="text-gray-600">Purity:</p>
                    <p className="font-semibold">{product.purity}</p>
                  </>
                )}
                {product.weight && (
                  <>
                    <p className="text-gray-600">Weight:</p>
                    <p className="font-semibold">{product.weight}</p>
                  </>
                )}
                <p className="text-gray-600">SKU:</p>
                <p className="font-semibold">{product.sku}</p>
              </div>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Select Variant
                </label>
                <Select
                  value={selectedVariant || ""}
                  onValueChange={val => setSelectedVariant(val)}
                >
                  <SelectTrigger className="border-amber-200">
                    <SelectValue placeholder="Choose a variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map((variant: any) => (
                      <SelectItem
                        key={variant.id}
                        value={variant.id.toString()}
                      >
                        {variant.size && `Size: ${variant.size}`}
                        {variant.color && ` - Color: ${variant.color}`}
                        {variant.price &&
                          ` - ₹${(variant.price / 100).toFixed(2)}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  variant="outline"
                  className="w-10 h-10 p-0"
                >
                  −
                </Button>
                <span className="text-xl font-semibold w-12 text-center">
                  {quantity}
                </span>
                <Button
                  onClick={() => setQuantity(quantity + 1)}
                  variant="outline"
                  className="w-10 h-10 p-0"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            <p
              className={`text-lg font-semibold mb-8 ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </p>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-lg py-6"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={handleWishlist}
                variant={isWishlisted ? "default" : "outline"}
                className={`px-6 py-6 ${isWishlisted ? "bg-red-500 text-white" : "border-amber-600 text-amber-600"}`}
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                />
              </Button>
              <Button
                variant="outline"
                className="px-6 py-6 border-amber-600 text-amber-600"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Shipping Info */}
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">
                Shipping & Returns
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Free shipping on orders above ₹5000</li>
                <li>✓ 30-day return policy</li>
                <li>✓ Authenticity guaranteed</li>
                <li>✓ Secure packaging</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-16 border-t pt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Customer Reviews
            </h2>
            <ReviewCarousel
              reviews={product.reviews.map((r: any, idx: number) => ({
                id: r.id || idx,
                author: r.customerName,
                text: r.content,
                rating: r.rating,
                date: r.createdAt,
              }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}
