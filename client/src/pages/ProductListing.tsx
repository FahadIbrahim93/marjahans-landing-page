import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, ShoppingCart, Loader2, Copy, Check } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";
import { Link } from "wouter";
import { FilterSidebar } from "@/components/FilterSidebar";
import { SortDropdown } from "@/components/SortDropdown";

export default function ProductListing() {
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  // Parse URL query parameters
  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const urlCategory = searchParams.get("category");
  const urlSearch = searchParams.get("search");
  const urlSort = searchParams.get("sort");
  const urlMaterial = searchParams.get("material");
  const urlMinPrice = searchParams.get("minPrice");
  const urlMaxPrice = searchParams.get("maxPrice");

  // Filter and sort state
  const [categoryId, setCategoryId] = useState<number | undefined>(
    urlCategory ? parseInt(urlCategory) : undefined
  );
  const [search, setSearch] = useState(urlSearch || "");
  const [sortBy, setSortBy] = useState<
    "price_asc" | "price_desc" | "newest" | "rating" | "popularity"
  >((urlSort as any) || "newest");
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(
    urlMaterial ? [urlMaterial] : []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    urlMinPrice ? parseInt(urlMinPrice) : 0,
    urlMaxPrice ? parseInt(urlMaxPrice) : 100000,
  ]);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);

  // Fetch filter data
  const { data: categories } = trpc.products.getCategories.useQuery();
  const { data: materials } = trpc.products.getMaterials.useQuery();
  const { data: priceRangeData } = trpc.products.getPriceRange.useQuery();

  // Initialize price range when data loads
  useEffect(() => {
    if (priceRangeData) {
      setPriceRange([priceRangeData.min, priceRangeData.max]);
    }
  }, [priceRangeData]);

  // Fetch products with filters
  const { data: products, isLoading } = trpc.products.getProducts.useQuery({
    categoryId,
    search,
    minPrice: priceRange[0] * 100, // Convert to paise
    maxPrice: priceRange[1] * 100,
    material: selectedMaterials.length > 0 ? selectedMaterials[0] : undefined,
    sortBy,
    limit,
    offset,
  });

  const addToCart = useCartStore(state => state.addItem);
  const { mutate: addToWishlist } = trpc.products.addToWishlist.useMutation();

  const handleAddToCart = (product: any) => {
    addToCart({
      id: `${product.id}`,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.imageUrl || "/placeholder-jewelry.jpg",
      quantity: 1,
    });
  };

  const handleAddToWishlist = (productId: number) => {
    addToWishlist({
      productId,
      visitorId: localStorage.getItem("visitorId") || undefined,
    });
  };

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (categoryId) params.set("category", categoryId.toString());
    if (search) params.set("search", search);
    if (sortBy !== "newest") params.set("sort", sortBy);
    if (selectedMaterials.length > 0)
      params.set("material", selectedMaterials[0]);
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < 100000)
      params.set("maxPrice", priceRange[1].toString());

    const queryString = params.toString();
    const newUrl = queryString ? `/products?${queryString}` : "/products";
    window.history.replaceState({}, "", newUrl);
  }, [categoryId, search, sortBy, selectedMaterials, priceRange]);

  const handleResetFilters = () => {
    setCategoryId(undefined);
    setSearch("");
    setSelectedMaterials([]);
    setSortBy("newest");
    if (priceRangeData) {
      setPriceRange([priceRangeData.min, priceRangeData.max]);
    }
    setOffset(0);
    window.history.replaceState({}, "", "/products");
  };

  const handleCopyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  };

  const handleMaterialChange = (material: string, checked: boolean) => {
    if (checked) {
      setSelectedMaterials([material]);
    } else {
      setSelectedMaterials([]);
    }
    setOffset(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Our Jewellery Collection</h1>
          <p className="text-amber-100">
            Discover exquisite pieces crafted with precision and elegance
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar
              categories={categories || []}
              materials={materials || []}
              priceRange={priceRangeData || { min: 0, max: 100000 }}
              selectedCategory={categoryId}
              selectedMaterials={selectedMaterials}
              selectedPriceRange={priceRange}
              onCategoryChange={id => {
                setCategoryId(id);
                setOffset(0);
              }}
              onMaterialChange={handleMaterialChange}
              onPriceChange={range => {
                setPriceRange(range);
                setOffset(0);
              }}
              onReset={handleResetFilters}
            />
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            {/* Search and Sort Bar */}
            <div className="bg-white border rounded-lg p-4 mb-8 sticky top-0 z-10 space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={e => {
                    setSearch(e.target.value);
                    setOffset(0);
                  }}
                  className="flex-1 border-amber-200"
                />
                <SortDropdown
                  value={sortBy}
                  onChange={value => {
                    setSortBy(value as any);
                    setOffset(0);
                  }}
                />
              </div>
              {(categoryId ||
                search ||
                selectedMaterials.length > 0 ||
                sortBy !== "newest") && (
                <button
                  onClick={handleCopyShareLink}
                  className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 transition-colors"
                >
                  {copiedToClipboard ? (
                    <>
                      <Check className="h-4 w-4" />
                      Link copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Share these results
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
              </div>
            ) : products && products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product: any) => (
                    <Link key={product.id} href={`/product/${product.slug}`}>
                      <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow cursor-pointer group">
                        {/* Product Image */}
                        <div className="relative bg-gray-100 h-64 overflow-hidden">
                          <img
                            src={
                              product.images?.[0]?.imageUrl ||
                              "/placeholder-jewelry.jpg"
                            }
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <button
                            onClick={e => {
                              e.preventDefault();
                              handleAddToWishlist(product.id);
                            }}
                            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow hover:bg-amber-50 transition-colors"
                          >
                            <Heart className="h-5 w-5 text-amber-600" />
                          </button>
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {product.name}
                          </h3>

                          {/* Rating */}
                          {product.rating && product.rating.rating > 0 && (
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex text-amber-400 text-sm">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i}>
                                    {i < Math.round(product.rating.rating || 0)
                                      ? "★"
                                      : "☆"}
                                  </span>
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">
                                ({product.rating.count || 0})
                              </span>
                            </div>
                          )}

                          {/* Price */}
                          <p className="text-2xl font-bold text-amber-600 mb-4">
                            ₹{(product.price / 100).toFixed(2)}
                          </p>

                          {/* Add to Cart Button */}
                          <button
                            onClick={e => {
                              e.preventDefault();
                              handleAddToCart(product);
                            }}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    disabled={offset === 0}
                    onClick={() => setOffset(Math.max(0, offset - limit))}
                  >
                    Previous
                  </Button>
                  <span className="text-gray-600">
                    Page {Math.floor(offset / limit) + 1}
                  </span>
                  <Button
                    variant="outline"
                    disabled={!products || products.length < limit}
                    onClick={() => setOffset(offset + limit)}
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-96">
                <p className="text-gray-500 text-lg">
                  No products found. Try adjusting your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
