"use client"

import { useState, useEffect } from "react"
import { useProducts } from "@/lib/products-context-simple"

interface ProductFiltersProps {
  category: string
  subcategory?: string
  onFiltersChange?: (filters: any) => void
}

export function ProductFilters({ category, subcategory, onFiltersChange }: ProductFiltersProps) {
  const { products } = useProducts()
  
  // Filter states
  const [sortOption, setSortOption] = useState("mais-vendidos")
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 })
  const [availableColors, setAvailableColors] = useState<string[]>([])
  const [availableSizes, setAvailableSizes] = useState<string[]>([])
  const [availableLabels, setAvailableLabels] = useState<string[]>([])

  // State to track if we should show all items
  const [showAllColors, setShowAllColors] = useState(false);
  const [showAllSizes, setShowAllSizes] = useState(false);
  const [showAllLabels, setShowAllLabels] = useState(false);
  
  // Limit the number of items displayed initially
  const MAX_VISIBLE_ITEMS = 5;

  // Get breadcrumb text
  const getBreadcrumb = () => {
    if (subcategory) {
      return `Início . ${category.toUpperCase()} / ${subcategory.toUpperCase()}`
    }
    return `Início . ${category.toUpperCase()}`
  }

  // Filter products by current category/subcategory
  const getFilteredProducts = () => {
    const filterCategory = subcategory || category;
    return products.filter(p => 
      p.status === "ativo" &&
      p.categories.some(cat => {
        // Normalize both values for comparison
        const normalizedCat = cat.toLowerCase().trim();
        const normalizedCategory = filterCategory.toLowerCase().trim();
        
        // Direct match
        if (normalizedCat === normalizedCategory) return true;
        
        // Partial match
        if (normalizedCat.includes(normalizedCategory)) return true;
        
        // Match by converting spaces to hyphens (display name to key)
        if (normalizedCat.replace(/\s+/g, '-') === normalizedCategory) return true;
        
        // Match by converting hyphens to spaces (key to display name)
        if (normalizedCat === normalizedCategory.replace(/-/g, ' ')) return true;
        
        // Additional fuzzy matching for common variations
        const catWithoutSpaces = normalizedCat.replace(/\s+/g, '');
        const categoryWithoutSpaces = normalizedCategory.replace(/\s+/g, '');
        if (catWithoutSpaces === categoryWithoutSpaces) return true;
        
        return false;
      })
    )
  }

  // Apply all active filters to get currently visible products
  const getVisibleProducts = () => {
    let result = getFilteredProducts()

    // Apply color filter
    if (selectedColors.length > 0) {
      result = result.filter(product => {
        // Handle both single colors and comma-separated colors
        const productColors = product.color ? product.color.split(',').map(c => c.trim().toLowerCase()) : [];
        return selectedColors.some(selectedColor => 
          productColors.includes(selectedColor.toLowerCase())
        );
      });
    }

    // Apply label filter
    if (selectedLabels.length > 0) {
      result = result.filter(product => {
        if (selectedLabels.includes("Promoção") && product.isPromotion) return true
        if (selectedLabels.includes("Esgotado") && product.stock === 0) return true
        if (selectedLabels.includes("Personalizada") && product.isNew) return true
        if (selectedLabels.includes("Sem Etiqueta") && !product.isPromotion && !product.isNew && product.stock > 0) return true
        return false
      })
    }

    // Apply price filter
    result = result.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    )

    return result
  }

  // Extract available filter options from products
  useEffect(() => {
    if (products.length > 0) {
      const filteredProducts = getFilteredProducts()

      // Get unique colors from filtered products (handling comma-separated colors)
      // Use case-insensitive deduplication while preserving original case
      const colorMap = new Map<string, string>();
      filteredProducts.forEach(p => {
        if (p.color) {
          p.color.split(',').forEach(c => {
            const trimmedColor = c.trim();
            const lowerColor = trimmedColor.toLowerCase();
            // Only add if we haven't seen this color before (case-insensitive)
            if (!colorMap.has(lowerColor)) {
              colorMap.set(lowerColor, trimmedColor);
            }
          });
        }
      });
      const colors = Array.from(colorMap.values());
      setAvailableColors(colors)

      // Get unique sizes that actually exist in filtered products
      const sizeSet = new Set<string>()
      filteredProducts.forEach(p => {
        // Only add sizes if the product has sizes array and it's not empty
        if (p.sizes && p.sizes.length > 0) {
          p.sizes.forEach(size => {
            if (size) sizeSet.add(size)
          })
        }
      })
      
      // Sort sizes in the correct order
      const sizeOrder = ["P", "M", "G", "GG", "XG", "XXG"]
      const sizes = sizeOrder.filter(size => sizeSet.has(size))
      setAvailableSizes(sizes)

      // Get available labels from filtered products
      const labels: string[] = []
      if (filteredProducts.some(p => p.isPromotion)) labels.push("Promoção")
      if (filteredProducts.some(p => p.stock === 0)) labels.push("Esgotado")
      if (filteredProducts.some(p => p.isNew)) labels.push("Personalizada")
      if (filteredProducts.some(p => !p.isPromotion && !p.isNew && p.stock > 0)) labels.push("Sem Etiqueta")
      setAvailableLabels(labels)
    }
  }, [products, category, subcategory])

  // Handle color filter change
  const handleColorChange = (color: string, checked: boolean) => {
    let newColors;
    if (checked) {
      // Check if color is already selected (case-insensitive)
      if (!selectedColors.some(c => c.toLowerCase() === color.toLowerCase())) {
        newColors = [...selectedColors, color];
      } else {
        newColors = selectedColors;
      }
    } else {
      // Remove color (case-insensitive)
      newColors = selectedColors.filter(c => c.toLowerCase() !== color.toLowerCase());
    }
    setSelectedColors(newColors);
    
    // Apply filters automatically
    if (onFiltersChange) {
      onFiltersChange({
        sortOption,
        colors: newColors,
        sizes: selectedSizes,
        labels: selectedLabels,
        priceRange
      });
    }
  }

  // Handle size filter change
  const handleSizeChange = (size: string, checked: boolean) => {
    let newSizes;
    if (checked) {
      newSizes = [...selectedSizes, size];
    } else {
      newSizes = selectedSizes.filter(s => s !== size);
    }
    setSelectedSizes(newSizes);
    
    // Apply filters automatically
    if (onFiltersChange) {
      onFiltersChange({
        sortOption,
        colors: selectedColors,
        sizes: newSizes,
        labels: selectedLabels,
        priceRange
      });
    }
  }

  // Handle label filter change
  const handleLabelChange = (label: string, checked: boolean) => {
    let newLabels;
    if (checked) {
      newLabels = [...selectedLabels, label];
    } else {
      newLabels = selectedLabels.filter(l => l !== label);
    }
    setSelectedLabels(newLabels);
    
    // Apply filters automatically
    if (onFiltersChange) {
      onFiltersChange({
        sortOption,
        colors: selectedColors,
        sizes: selectedSizes,
        labels: newLabels,
        priceRange
      });
    }
  }

  // Handle price range change
  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseFloat(value) || 0;
    const newPriceRange = {
      ...priceRange,
      [type]: numValue
    };
    setPriceRange(newPriceRange);
    
    // Apply filters automatically
    if (onFiltersChange) {
      onFiltersChange({
        sortOption,
        colors: selectedColors,
        sizes: selectedSizes,
        labels: selectedLabels,
        priceRange: newPriceRange
      });
    }
  }

  // Handle sort option change
  const handleSortChange = (value: string) => {
    setSortOption(value);
    
    // Apply filters automatically
    if (onFiltersChange) {
      onFiltersChange({
        sortOption: value,
        colors: selectedColors,
        sizes: selectedSizes,
        labels: selectedLabels,
        priceRange
      });
    }
  }

  // Count products for each color (considering all active filters except color and size)
  const getColorCount = (color: string) => {
    // Get visible products but temporarily remove both color and size filters
    let visibleProducts = getFilteredProducts()
    
    // Apply only label and price filters (not color or size)
    if (selectedLabels.length > 0) {
      visibleProducts = visibleProducts.filter(product => {
        if (selectedLabels.includes("Promoção") && product.isPromotion) return true
        if (selectedLabels.includes("Esgotado") && product.stock === 0) return true
        if (selectedLabels.includes("Personalizada") && product.isNew) return true
        if (selectedLabels.includes("Sem Etiqueta") && !product.isPromotion && !product.isNew && product.stock > 0) return true
        return false
      })
    }
    
    // Apply price filter
    visibleProducts = visibleProducts.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    )
    
    // Count products with this specific color (handling comma-separated colors)
    return visibleProducts.filter(p => {
      const productColors = p.color ? p.color.split(',').map(c => c.trim().toLowerCase()) : [];
      return productColors.includes(color.toLowerCase());
    }).length
  }

  // Count products for each size (considering all active filters except color and size)
  const getSizeCount = (size: string) => {
    // Get visible products but temporarily remove both color and size filters
    let visibleProducts = getFilteredProducts()
    
    // Apply only label and price filters (not color or size)
    if (selectedLabels.length > 0) {
      visibleProducts = visibleProducts.filter(product => {
        if (selectedLabels.includes("Promoção") && product.isPromotion) return true
        if (selectedLabels.includes("Esgotado") && product.stock === 0) return true
        if (selectedLabels.includes("Personalizada") && product.isNew) return true
        if (selectedLabels.includes("Sem Etiqueta") && !product.isPromotion && !product.isNew && product.stock > 0) return true
        return false
      })
    }
    
    // Apply price filter
    visibleProducts = visibleProducts.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    )
    
    // Count products with this specific size
    return visibleProducts.filter(p => p.sizes.includes(size)).length
  }

  // Apply filters
  const applyFilters = () => {
    // Filters are now applied automatically, so this function can be empty
    // But we keep it for compatibility with the existing UI
  }

  // Reset all filters
  const resetFilters = () => {
    setSelectedColors([])
    setSelectedSizes([])
    setSelectedLabels([])
    setPriceRange({ min: 0, max: 500 })
    setSortOption("mais-vendidos")
    
    // Apply filters automatically
    if (onFiltersChange) {
      onFiltersChange({
        sortOption: "mais-vendidos",
        colors: [],
        sizes: [],
        labels: [],
        priceRange: { min: 0, max: 500 }
      });
    }
  }

  return (
    <div className="w-full bg-black text-white min-h-screen">
      {/* Breadcrumb */}
      <div className="p-4 pb-0">
        <p className="text-xs text-gray-400 font-medium">{getBreadcrumb()}</p>
      </div>

      {/* Conteúdo da sidebar */}
      <div className="px-4 pb-6">
        {/* Título Principal */}
        <div className="mb-6 pt-2">
          <h1 className="text-2xl font-bold text-white uppercase tracking-wider">
            {subcategory || category}
          </h1>
        </div>

        {/* Ordenar por */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3 text-xs uppercase tracking-wide">Ordenar por</h3>
          <div className="relative">
            <select 
              className="w-full bg-gray-900/50 border border-gray-700 text-white px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-red-500 focus:bg-gray-800/50 rounded-lg transition-all duration-200 text-sm"
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="mais-vendidos" className="bg-gray-900">Mais Vendidos</option>
              <option value="menor-preco" className="bg-gray-900">Menor Preço</option>
              <option value="maior-preco" className="bg-gray-900">Maior Preço</option>
              <option value="mais-recentes" className="bg-gray-900">Mais Recentes</option>
              <option value="melhor-avaliados" className="bg-gray-900">Melhor Avaliados</option>
            </select>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-4"></div>

        {/* Categorias */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3 text-xs uppercase tracking-wide">Categorias</h3>
          <div className="space-y-2">
            <div className="text-white hover:text-red-400 cursor-pointer transition-colors duration-200 py-1 text-sm">Camisetas</div>
            <div className="text-white hover:text-red-400 cursor-pointer transition-colors duration-200 py-1 text-sm">Jaquetas / Moletons</div>
            <div className="text-white hover:text-red-400 cursor-pointer transition-colors duration-200 py-1 text-sm">Bermudas</div>
            <div className="text-white hover:text-red-400 cursor-pointer transition-colors duration-200 py-1 text-sm">Calças</div>
            <div className="text-white hover:text-red-400 cursor-pointer transition-colors duration-200 py-1 text-sm">Inverno</div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-4"></div>

        {/* Cor */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3 text-xs uppercase tracking-wide">Cor</h3>
          <div className="space-y-2">
            {availableColors.slice(0, showAllColors ? undefined : MAX_VISIBLE_ITEMS).map((color) => (
              <label key={color} className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 bg-gray-900 border border-gray-600 red-text focus:ring-red-500 focus:ring-2 rounded" 
                  checked={selectedColors.some(c => c.toLowerCase() === color.toLowerCase())}
                  onChange={(e) => handleColorChange(color, e.target.checked)}
                />
                <span className="text-white group-hover:text-red-400 transition-colors duration-200 text-sm">
                  {color} ({getColorCount(color)})
                </span>
                <div 
                  className="w-4 h-4 rounded-full border border-gray-400"
                  style={{ 
                    backgroundColor: color.toLowerCase() === 'preto' ? 'black' : 
                                   color.toLowerCase() === 'branco' ? 'white' : 
                                   color.toLowerCase() === 'azul' ? 'blue' : 
                                   color.toLowerCase() === 'rosa' ? 'pink' : 
                                   color.toLowerCase() === 'verde' ? 'green' : 'gray'
                  }}
                ></div>
              </label>
            ))}
            {availableColors.length > MAX_VISIBLE_ITEMS && (
              <button 
                className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors duration-200 mt-1" 
                onClick={() => setShowAllColors(!showAllColors)}
              >
                {showAllColors ? 'Ver menos' : 'Ver mais'}
              </button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-4"></div>

        {/* Tamanho */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3 text-xs uppercase tracking-wide">Tamanho</h3>
          <div className="space-y-2">
            {availableSizes.slice(0, showAllSizes ? undefined : MAX_VISIBLE_ITEMS).map((size) => (
              <label key={size} className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 bg-gray-900 border border-gray-600 red-text focus:ring-red-500 focus:ring-2 rounded" 
                  checked={selectedSizes.includes(size)}
                  onChange={(e) => handleSizeChange(size, e.target.checked)}
                />
                <span className="text-white group-hover:text-red-400 transition-colors duration-200 text-sm">
                  {size} ({getSizeCount(size)})
                </span>
              </label>
            ))}
            {availableSizes.length > MAX_VISIBLE_ITEMS && (
              <button 
                className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors duration-200 mt-1" 
                onClick={() => setShowAllSizes(!showAllSizes)}
              >
                {showAllSizes ? 'Ver menos' : 'Ver mais'}
              </button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-4"></div>

        {/* Etiquetas */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3 text-xs uppercase tracking-wide">Etiquetas</h3>
          <div className="space-y-2">
            {availableLabels.slice(0, showAllLabels ? undefined : MAX_VISIBLE_ITEMS).map((label) => {
              // Map label names to their display names and colors
              const labelInfo = {
                "Promoção": { displayName: "Promoção", color: "bg-red-500" },
                "Esgotado": { displayName: "Esgotado", color: "bg-gray-600" },
                "Personalizada": { displayName: "Personalizada", color: "bg-blue-500" },
                "Sem Etiqueta": { displayName: "Sem Etiqueta", color: "bg-gray-400" }
              }[label] || { displayName: label, color: "bg-gray-400" };
              
              return (
                <label key={label} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 bg-gray-900 border border-gray-600 red-text focus:ring-red-500 focus:ring-2 rounded" 
                    checked={selectedLabels.includes(label)}
                    onChange={(e) => handleLabelChange(label, e.target.checked)}
                  />
                  <span className="text-white group-hover:text-red-400 transition-colors duration-200 text-sm">
                    {labelInfo.displayName}
                  </span>
                  <div className={`w-3 h-3 rounded-full ${labelInfo.color}`}></div>
                </label>
              );
            })}
            {availableLabels.length > MAX_VISIBLE_ITEMS && (
              <button 
                className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors duration-200 mt-1" 
                onClick={() => setShowAllLabels(!showAllLabels)}
              >
                {showAllLabels ? 'Ver menos' : 'Ver mais'}
              </button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-4"></div>

        {/* Preço */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3 text-xs uppercase tracking-wide">Preço</h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-white text-xs mb-1 font-medium">De</label>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:border-red-500 focus:bg-gray-800/50 rounded-lg transition-all duration-200 text-sm"
                  placeholder="0"
                />
              </div>
              <div className="flex-1">
                <label className="block text-white text-xs mb-1 font-medium">Até</label>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-700 text-white px-3 py-2 focus:outline-none focus:border-red-500 focus:bg-gray-800/50 rounded-lg transition-all duration-200 text-sm"
                  placeholder="399.9"
                />
              </div>
            </div>
            <button 
              className="w-full red-bg hover:red-bg-hover text-white py-2 px-4 transition-all duration-200 font-semibold rounded-lg hover:shadow-lg red-glow text-sm"
              onClick={applyFilters}
            >
              Aplicar
            </button>
            <button 
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 transition-all duration-200 font-semibold rounded-lg text-sm"
              onClick={resetFilters}
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}