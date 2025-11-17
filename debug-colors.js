// Debug script to check product colors in localStorage
console.log("=== Checking Product Colors in localStorage ===");

// Check different localStorage keys
const keys = [
  "gang-boyz-test-products",
  "gang-boyz-products",
  "gang-boyz-standalone-products",
  "gang-boyz-recommendations"
];

keys.forEach(key => {
  const data = localStorage.getItem(key);
  if (data) {
    try {
      const products = JSON.parse(data);
      console.log(`\n${key}:`);
      console.log(`  Total products: ${products.length}`);
      
      // Show color information for first few products
      const sampleProducts = products.slice(0, 3);
      sampleProducts.forEach((product, index) => {
        console.log(`  Product ${index + 1}: ${product.name || product.id}`);
        console.log(`    Color: "${product.color}"`);
        if (product.color) {
          const colors = product.color.split(',').map(c => c.trim());
          console.log(`    Parsed colors: [${colors.map(c => `"${c}"`).join(', ')}]`);
        }
      });
    } catch (error) {
      console.log(`  Error parsing ${key}:`, error.message);
    }
  } else {
    console.log(`\n${key}: Not found`);
  }
});

console.log("\n=== End of debug ===");