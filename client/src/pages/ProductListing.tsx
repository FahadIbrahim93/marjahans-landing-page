import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';
import { Link } from 'wouter';

export default function ProductListing() {
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);

  const { data: categories } = trpc.products.getCategories.useQuery();
  const { data: products, isLoading } = trpc.products.getProducts.useQuery({
    categoryId,
    search,
    limit,
    offset,
  });

  const addToCart = useCartStore((state) => state.addItem);
  const { mutate: addToWishlist } = trpc.products.addToWishlist.useMutation();

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.imageUrl || '/placeholder-jewelry.jpg',
      quantity: 1,
    });
  };

  const handleAddToWishlist = (productId: number) => {
    addToWishlist({
      productId,
      visitorId: localStorage.getItem('visitorId') || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Our Jewellery Collection</h1>
          <p className="text-amber-100">Discover exquisite pieces crafted with precision and elegance</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOffset(0);
              }}
              className="border-amber-200"
            />

            <Select value={categoryId?.toString() || ''} onValueChange={(val) => {
              setCategoryId(val ? parseInt(val) : undefined);
              setOffset(0);
            }}>
              <SelectTrigger className="border-amber-200">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories?.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={limit.toString()} onValueChange={(val) => {
              setLimit(parseInt(val));
              setOffset(0);
            }}>
              <SelectTrigger className="border-amber-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : products && products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                  {/* Product Image */}
                  <Link href={`/product/${product.slug}`}>
                    <div className="relative bg-gray-100 h-64 overflow-hidden cursor-pointer group">
                      <img
                        src={product.images?.[0]?.imageUrl || '/placeholder-jewelry.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                      {product.isFeatured && (
                        <div className="absolute top-2 right-2 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Featured
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-4">
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-semibold text-gray-800 hover:text-amber-600 cursor-pointer line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    {product.rating > 0 && (
                      <div className="flex items-center mt-2">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>{i < product.rating ? '★' : '☆'}</span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-2">({product.reviewCount})</span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-amber-600">₹{(product.price / 100).toFixed(2)}</p>
                        {product.originalPrice && (
                          <p className="text-sm text-gray-500 line-through">₹{(product.originalPrice / 100).toFixed(2)}</p>
                        )}
                      </div>
                    </div>

                    {/* Stock Status */}
                    <p className={`text-sm mt-2 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        onClick={() => handleAddToWishlist(product.id)}
                        variant="outline"
                        className="border-amber-600 text-amber-600 hover:bg-amber-50"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-4 mt-12">
              <Button
                onClick={() => setOffset(Math.max(0, offset - limit))}
                disabled={offset === 0}
                variant="outline"
              >
                Previous
              </Button>
              <Button
                onClick={() => setOffset(offset + limit)}
                disabled={!products || products.length < limit}
                variant="outline"
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
