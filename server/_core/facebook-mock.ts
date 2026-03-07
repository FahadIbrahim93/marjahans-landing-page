/**
 * Mock Facebook Products for Testing
 * This file provides test data that mimics real Facebook Shop products
 * Use this for development and testing before connecting to live Facebook API
 */

export const MOCK_FACEBOOK_PRODUCTS = [
  {
    id: "mock_1",
    name: "Gold Bridal Necklace Set",
    description: "Exquisite 22K gold bridal necklace with matching earrings. Perfect for weddings and special occasions.",
    price: 45000,
    currency: "BDT",
    image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop",
    category: "Necklaces",
    availability: "in stock",
    material: "Gold 22K",
    stock: 5,
  },
  {
    id: "mock_2",
    name: "Diamond Engagement Ring",
    description: "Stunning diamond solitaire engagement ring in white gold. Certified diamonds with lifetime warranty.",
    price: 125000,
    currency: "BDT",
    image_url: "https://images.unsplash.com/photo-1515562141207-6811bcb33ce7?w=500&h=500&fit=crop",
    category: "Rings",
    availability: "in stock",
    material: "White Gold 18K",
    stock: 3,
  },
  {
    id: "mock_3",
    name: "Silver Oxidized Earrings",
    description: "Traditional oxidized silver earrings with intricate designs. Lightweight and comfortable for daily wear.",
    price: 8500,
    currency: "BDT",
    image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop",
    category: "Earrings",
    availability: "in stock",
    material: "Silver 925",
    stock: 12,
  },
  {
    id: "mock_4",
    name: "Pearl Bracelet",
    description: "Elegant pearl bracelet with gold accents. Freshwater pearls with adjustable clasp.",
    price: 22000,
    currency: "BDT",
    image_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop",
    category: "Bracelets",
    availability: "in stock",
    material: "Pearls & Gold",
    stock: 8,
  },
  {
    id: "mock_5",
    name: "Ruby Pendant",
    description: "Authentic Burmese ruby pendant with diamond surround. Certified gemstone with authenticity certificate.",
    price: 85000,
    currency: "BDT",
    image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop",
    category: "Pendants",
    availability: "in stock",
    material: "Gold 18K & Ruby",
    stock: 2,
  },
  {
    id: "mock_6",
    name: "Sapphire Earrings",
    description: "Deep blue sapphire earrings with diamond accents. Perfect for formal events and everyday elegance.",
    price: 65000,
    currency: "BDT",
    image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop",
    category: "Earrings",
    availability: "in stock",
    material: "Gold 18K & Sapphire",
    stock: 4,
  },
  {
    id: "mock_7",
    name: "Gold Bangles Set",
    description: "Set of 4 traditional gold bangles with intricate designs. Perfect for weddings and celebrations.",
    price: 95000,
    currency: "BDT",
    image_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop",
    category: "Bangles",
    availability: "in stock",
    material: "Gold 22K",
    stock: 6,
  },
  {
    id: "mock_8",
    name: "Emerald Ring",
    description: "Vivid green emerald ring with diamond halo. Zambian emerald with GIA certification.",
    price: 105000,
    currency: "BDT",
    image_url: "https://images.unsplash.com/photo-1515562141207-6811bcb33ce7?w=500&h=500&fit=crop",
    category: "Rings",
    availability: "in stock",
    material: "Gold 18K & Emerald",
    stock: 2,
  },
];

/**
 * Mock function to simulate Facebook product fetching
 * Returns mock products after a short delay to simulate API call
 */
export async function fetchMockFacebookProducts() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_FACEBOOK_PRODUCTS;
}

/**
 * Mock function to simulate Facebook shop info
 */
export async function fetchMockFacebookShopInfo() {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    shop_name: "Marjahans Jewellery",
    shop_description: "Exquisite handcrafted jewelry with luxury meets affordability",
    products: MOCK_FACEBOOK_PRODUCTS,
  };
}

/**
 * Toggle between mock and real Facebook API
 * Set USE_MOCK_FACEBOOK to true in .env to use mock data
 */
export const USE_MOCK_FACEBOOK = process.env.USE_MOCK_FACEBOOK === 'true';
