/**
 * Debug script to test Facebook Graph API endpoints
 * Run with: node debug-facebook-api.mjs
 */

const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

if (!token) {
  console.error('❌ FACEBOOK_PAGE_ACCESS_TOKEN not set');
  process.exit(1);
}

async function testEndpoint(url, description) {
  console.log(`\n📝 Testing: ${description}`);
  console.log(`🔗 URL: ${url.substring(0, 100)}...`);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📊 Response:`, JSON.stringify(data, null, 2).substring(0, 500));
    
    return { success: response.ok, data };
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🚀 Facebook Graph API Debug Tool');
  console.log('================================\n');

  // Test 1: Get page info
  await testEndpoint(
    `https://graph.facebook.com/v18.0/me?fields=id,name,about,picture&access_token=${token}`,
    'Get Page Info'
  );

  // Test 2: Get page catalogs
  await testEndpoint(
    `https://graph.facebook.com/v18.0/me/catalogs?access_token=${token}`,
    'Get Page Catalogs'
  );

  // Test 3: Get page shops
  await testEndpoint(
    `https://graph.facebook.com/v18.0/me/shops?access_token=${token}`,
    'Get Page Shops'
  );

  // Test 4: Get page with commerce info
  await testEndpoint(
    `https://graph.facebook.com/v18.0/me?fields=id,name,shops,catalogs&access_token=${token}`,
    'Get Page with Commerce Info'
  );

  // Test 5: Get page products directly
  await testEndpoint(
    `https://graph.facebook.com/v18.0/me/products?access_token=${token}`,
    'Get Page Products Directly'
  );

  console.log('\n✨ Debug complete!');
}

main().catch(console.error);
