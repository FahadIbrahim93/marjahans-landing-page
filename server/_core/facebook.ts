import { ENV } from "./env";

/**
 * Facebook Graph API helper for product syncing
 */

interface FacebookProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image_url: string;
  category: string;
  availability: string;
}

interface FacebookShopData {
  products: FacebookProduct[];
  shop_name: string;
  shop_description: string;
}

/**
 * Fetch products from Facebook Shop using Graph API
 */
export async function fetchFacebookProducts(): Promise<FacebookProduct[]> {
  if (!ENV.facebookPageAccessToken) {
    throw new Error("Facebook access token not configured");
  }

  try {
    // Fetch catalog from Facebook Shop
    const catalogResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/catalogs?access_token=${ENV.facebookPageAccessToken}`
    );

    if (!catalogResponse.ok) {
      throw new Error(`Facebook API error: ${catalogResponse.statusText}`);
    }

    const catalogData = await catalogResponse.json();

    if (!catalogData.data || catalogData.data.length === 0) {
      console.warn("No catalogs found on Facebook page");
      return [];
    }

    const catalogId = catalogData.data[0].id;

    // Fetch products from the catalog
    const productsResponse = await fetch(
      `https://graph.facebook.com/v18.0/${catalogId}/products?fields=id,name,description,price,currency,image_url,category,availability&access_token=${ENV.facebookPageAccessToken}`
    );

    if (!productsResponse.ok) {
      throw new Error(`Facebook API error: ${productsResponse.statusText}`);
    }

    const productsData = await productsResponse.json();
    return productsData.data || [];
  } catch (error) {
    console.error("[Facebook API] Error fetching products:", error);
    throw error;
  }
}

/**
 * Fetch shop information from Facebook
 */
export async function fetchFacebookShopInfo(): Promise<FacebookShopData> {
  if (!ENV.facebookPageAccessToken) {
    throw new Error("Facebook access token not configured");
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=name,about,picture&access_token=${ENV.facebookPageAccessToken}`
    );

    if (!response.ok) {
      throw new Error(`Facebook API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      shop_name: data.name || "Marjahans",
      shop_description: data.about || "",
      products: [],
    };
  } catch (error) {
    console.error("[Facebook API] Error fetching shop info:", error);
    throw error;
  }
}

/**
 * Validate Facebook credentials
 */
export async function validateFacebookCredentials(): Promise<boolean> {
  if (!ENV.facebookPageAccessToken) {
    console.error("[Facebook API] Missing access token");
    return false;
  }

  try {
    // Use /me endpoint with the page access token to validate
    const url = `https://graph.facebook.com/v18.0/me?access_token=${ENV.facebookPageAccessToken}`;
    const response = await fetch(url);
    const data = await response.json();

    console.log("[Facebook API] Response status:", response.status);
    console.log("[Facebook API] Response data:", data);

    if (!response.ok || data.error) {
      console.error("[Facebook API] Validation failed:", data);
      return false;
    }

    console.log("[Facebook API] Token validated successfully for:", data.name);
    return true;
  } catch (error) {
    console.error("[Facebook API] Validation error:", error);
    return false;
  }
}
