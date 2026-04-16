/**
 * Facebook Data Extractor
 * Extracts product information from Facebook posts and messenger conversations
 * Uses LLM to intelligently parse product details, pricing, and descriptions
 */

import { ENV } from "./env";
import { invokeLLM } from "./llm";

interface FacebookPost {
  id: string;
  message: string;
  created_time: string;
  attachments?: Array<{
    type: string;
    url: string;
    media?: {
      image?: {
        height: number;
        width: number;
        src: string;
      };
      video?: {
        length: number;
        src: string;
      };
    };
  }>;
  comments?: Array<{
    message: string;
    created_time: string;
  }>;
}

interface ExtractedProduct {
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  material?: string;
  images: string[];
  videos?: string[];
  source_post_id: string;
  engagement_count: number;
}

/**
 * Fetch recent posts from your Facebook page
 */
export async function fetchFacebookPosts(
  limit: number = 50
): Promise<FacebookPost[]> {
  if (!ENV.facebookPageAccessToken || !ENV.facebookPageId) {
    throw new Error("Facebook credentials not configured");
  }

  try {
    const url = new URL(
      `https://graph.facebook.com/v18.0/${ENV.facebookPageId}/posts`
    );
    url.searchParams.append(
      "fields",
      "id,message,created_time,attachments,comments.limit(5).fields(message,created_time)"
    );
    url.searchParams.append("limit", limit.toString());
    url.searchParams.append("access_token", ENV.facebookPageAccessToken);

    const response = await fetch(url.toString());

    if (!response.ok) {
      const error = await response.json();
      console.error("[Facebook Posts] Error:", error);
      throw new Error(
        `Failed to fetch posts: ${error.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    console.log(`[Facebook Posts] Fetched ${data.data?.length || 0} posts`);
    return data.data || [];
  } catch (error) {
    console.error("[Facebook Posts] Error fetching posts:", error);
    throw error;
  }
}

/**
 * Extract product information from a post using LLM
 */
export async function extractProductFromPost(
  post: FacebookPost
): Promise<ExtractedProduct | null> {
  try {
    // Prepare post content for LLM analysis
    const postContent = `
Post Message: ${post.message || ""}
Created: ${post.created_time}
Comments: ${post.comments?.map(c => c.message).join(" | ") || ""}
`;

    // Use LLM to extract product information
    const systemPrompt =
      "You are a jewelry product catalog expert. Extract product information from Facebook posts about jewelry sales. Return JSON with name, description, price, currency, category, material, and confidence (0-1). Only extract if confidence > 0.7.";
    const userPrompt = `Extract product information from this Facebook post:\n${postContent}`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "product_extraction",
          strict: true,
          schema: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              price: { type: "number" },
              currency: { type: "string" },
              category: { type: "string" },
              material: { type: "string" },
              confidence: { type: "number" },
            },
            required: ["confidence"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== "string") return null;

    const extracted = JSON.parse(content);

    // Only return if confidence is high enough
    if (!extracted.confidence || extracted.confidence < 0.7) {
      return null;
    }

    // Extract image URLs from attachments
    const images = post.attachments
      ?.filter(att => att.type === "photo" || att.type === "image")
      .map(att => att.media?.image?.src || att.url)
      .filter(Boolean) as string[];

    const videos = post.attachments
      ?.filter(att => att.type === "video")
      .map(att => att.media?.video?.src || att.url)
      .filter(Boolean) as string[];

    // Count engagement (comments as proxy)
    const engagement_count = post.comments?.length || 0;

    return {
      ...extracted,
      images: images || [],
      videos: videos || [],
      source_post_id: post.id,
      engagement_count,
    };
  } catch (error) {
    console.error("[Product Extraction] Error processing post:", error);
    return null;
  }
}

/**
 * Extract products from multiple posts
 */
export async function extractProductsFromPosts(
  posts: FacebookPost[]
): Promise<ExtractedProduct[]> {
  const extractedProducts: ExtractedProduct[] = [];

  for (const post of posts) {
    try {
      const product = await extractProductFromPost(post);
      if (product) {
        extractedProducts.push(product);
        console.log(`[Product Extraction] Extracted: ${product.name}`);
      }
    } catch (error) {
      console.error(
        `[Product Extraction] Failed to extract from post ${post.id}:`,
        error
      );
    }
  }

  return extractedProducts;
}

/**
 * Fetch messenger conversations to extract pricing and product details
 */
export async function fetchMessengerConversations(
  limit: number = 20
): Promise<any[]> {
  if (!ENV.facebookPageAccessToken || !ENV.facebookPageId) {
    throw new Error("Facebook credentials not configured");
  }

  try {
    const url = new URL(
      `https://graph.facebook.com/v18.0/${ENV.facebookPageId}/conversations`
    );
    url.searchParams.append(
      "fields",
      "id,senders,subject,updated_time,messages.limit(10).fields(from,message,created_time)"
    );
    url.searchParams.append("limit", limit.toString());
    url.searchParams.append("access_token", ENV.facebookPageAccessToken);

    const response = await fetch(url.toString());

    if (!response.ok) {
      const error = await response.json();
      console.error("[Messenger] Error:", error);
      // Return empty array if messenger data not available
      return [];
    }

    const data = await response.json();
    console.log(`[Messenger] Fetched ${data.data?.length || 0} conversations`);
    return data.data || [];
  } catch (error) {
    console.error("[Messenger] Error fetching conversations:", error);
    return [];
  }
}

/**
 * Extract pricing information from messenger conversations
 */
export async function extractPricingFromConversations(
  conversations: any[]
): Promise<Map<string, number>> {
  const pricingMap = new Map<string, number>();

  for (const conversation of conversations) {
    try {
      const messages =
        conversation.messages?.data?.map((m: any) => m.message).join(" ") || "";

      if (!messages) continue;

      // Use LLM to extract pricing
      const pricingSystemPrompt =
        "Extract product pricing from jewelry conversations. Return JSON with product names as keys and prices as values.";
      const pricingUserPrompt = `Extract pricing from this conversation:\n${messages}`;

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: pricingSystemPrompt,
          },
          {
            role: "user",
            content: pricingUserPrompt,
          },
        ],
      });

      const content = response.choices[0]?.message?.content;
      if (content && typeof content === "string") {
        try {
          const pricing = JSON.parse(content);
          Object.entries(pricing).forEach(([product, price]) => {
            pricingMap.set(product, price as number);
          });
        } catch (e) {
          // Ignore JSON parse errors
        }
      }
    } catch (error) {
      console.error("[Pricing Extraction] Error:", error);
    }
  }

  return pricingMap;
}

/**
 * Main function to extract all product data from Facebook
 */
export async function extractAllProductsFromFacebook(): Promise<
  ExtractedProduct[]
> {
  console.log(
    "[Facebook Extraction] Starting product extraction from Facebook..."
  );

  try {
    // Fetch posts
    const posts = await fetchFacebookPosts(50);
    console.log(`[Facebook Extraction] Fetched ${posts.length} posts`);

    // Extract products from posts
    const products = await extractProductsFromPosts(posts);
    console.log(
      `[Facebook Extraction] Extracted ${products.length} products from posts`
    );

    // Fetch messenger conversations for pricing
    const conversations = await fetchMessengerConversations(20);
    const pricing = await extractPricingFromConversations(conversations);
    console.log(
      `[Facebook Extraction] Extracted pricing for ${pricing.size} products`
    );

    // Merge pricing data into products
    products.forEach(product => {
      const foundPrice = pricing.get(product.name);
      if (foundPrice) {
        product.price = foundPrice;
      }
    });

    console.log(
      `[Facebook Extraction] Total products extracted: ${products.length}`
    );
    return products;
  } catch (error) {
    console.error("[Facebook Extraction] Error:", error);
    throw error;
  }
}
