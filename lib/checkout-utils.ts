import { useProducts } from "@/lib/products-context-simple"

// Function to update product stock after a purchase
export const updateProductStockAfterPurchase = (
  cartItems: { id: number; name: string; price: number; image: string; quantity: number; size?: string }[],
  products: any[]
) => {
  // For each item in the cart, update the product stock
  cartItems.forEach(item => {
    // Find the product in the products array
    const product = products.find(p => {
      // Handle both string and number ID comparisons
      const productIdStr = String(p.id)
      const itemIdStr = String(item.id)
      return productIdStr === itemIdStr
    })
    
    if (product && product.sizeStock) {
      // Update the size-specific stock
      const size = item.size || "único"
      const currentSizeStock = product.sizeStock[size] || 0
      const newSizeStock = Math.max(0, currentSizeStock - item.quantity)
      
      // Update the product's sizeStock
      product.sizeStock[size] = newSizeStock
      
      // Update the total stock
      product.stock = Math.max(0, (product.stock || 0) - item.quantity)
      
      // If stock is 0, mark as esgotado
      if (product.stock === 0) {
        product.label = "ESGOTADO"
        product.labelType = "esgotado"
      }
    }
  })
  
  // Save the updated products to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem("gang-boyz-test-products", JSON.stringify(products))
  }
  
  // Emit event to force reload products in all pages
  window.dispatchEvent(new CustomEvent('forceProductsReload'))
  window.dispatchEvent(new Event('testProductCreated'))
}