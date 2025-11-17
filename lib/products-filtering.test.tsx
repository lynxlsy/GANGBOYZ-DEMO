import { getActiveProductsByCategory } from "./products-context-simple";
import { CATEGORY_CONFIGS } from "./category-config";

// Mock product data for testing
const mockProducts = [
  {
    id: "1",
    name: "Short Praia Test",
    price: 100,
    image: "/test.jpg",
    color: "Azul",
    categories: ["Shorts/Bermudas", "Praia"],
    sizes: ["P", "M", "G"],
    description: "Test product",
    status: "ativo" as const,
    stock: 10
  },
  {
    id: "2",
    name: "Camiseta Manga Curta Test",
    price: 80,
    image: "/test2.jpg",
    color: "Preto",
    categories: ["Camisetas", "Manga Curta"],
    sizes: ["P", "M", "G"],
    description: "Test product 2",
    status: "ativo" as const,
    stock: 5
  }
];

// Mock the useProducts hook to return our test data
jest.mock("./products-context-simple", () => ({
  ...jest.requireActual("./products-context-simple"),
  useProducts: () => ({
    products: mockProducts,
    getActiveProductsByCategory: (category: string) => {
      return mockProducts.filter(product => 
        product.status === "ativo" &&
        product.categories.some(cat => 
          cat.toLowerCase() === category.toLowerCase() || 
          cat.toLowerCase().includes(category.toLowerCase()) ||
          // Also match subcategory keys directly
          cat === category ||
          // Match with the subcategory config if category is a key
          (CATEGORY_CONFIGS[category] && CATEGORY_CONFIGS[category].subcategory === cat)
        )
      )
    }
  })
}));

describe("Product Filtering", () => {
  test("should filter products by subcategory key", () => {
    // Test with the "praia" subcategory key
    const praiaProducts = getActiveProductsByCategory("praia");
    expect(praiaProducts).toHaveLength(1);
    expect(praiaProducts[0].name).toBe("Short Praia Test");
    
    // Test with the "manga-curta" subcategory key
    const mangaCurtaProducts = getActiveProductsByCategory("manga-curta");
    expect(mangaCurtaProducts).toHaveLength(1);
    expect(mangaCurtaProducts[0].name).toBe("Camiseta Manga Curta Test");
  });
  
  test("should filter products by subcategory name", () => {
    // Test with the actual subcategory name "Praia"
    const praiaProducts = getActiveProductsByCategory("Praia");
    expect(praiaProducts).toHaveLength(1);
    expect(praiaProducts[0].name).toBe("Short Praia Test");
    
    // Test with the actual subcategory name "Manga Curta"
    const mangaCurtaProducts = getActiveProductsByCategory("Manga Curta");
    expect(mangaCurtaProducts).toHaveLength(1);
    expect(mangaCurtaProducts[0].name).toBe("Camiseta Manga Curta Test");
  });
});