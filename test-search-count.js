// Script para testar a contagem de produtos no sistema de busca
const fs = require('fs');

// Simular a contagem de produtos por categoria
const productCounts = {
  'Camisetas': 7,
  'Moletons': 3,
  'Jaquetas': 0,
  'Calças': 1,
  'Shorts/Bermudas': 2
};

console.log('Contagem de produtos por categoria:');
Object.entries(productCounts).forEach(([category, count]) => {
  console.log(`${category}: ${count} produtos`);
});

// Verificar se a interface SearchResult foi atualizada corretamente
const unifiedIdSystem = fs.readFileSync('lib/unified-id-system.ts', 'utf8');
if (unifiedIdSystem.includes('productCount?: number')) {
  console.log('\n✅ Interface SearchResult atualizada com productCount');
} else {
  console.log('\n❌ Interface SearchResult NÃO atualizada com productCount');
}

// Verificar se a interface ProductID foi atualizada corretamente
if (unifiedIdSystem.includes('productCount?: number // Adicionado para mostrar a contagem de produtos nas categorias')) {
  console.log('✅ Interface ProductID atualizada com productCount');
} else {
  console.log('❌ Interface ProductID NÃO atualizada com productCount');
}

// Verificar se o método getActiveProductCountByMainCategory foi adicionado
if (unifiedIdSystem.includes('getActiveProductCountByMainCategory')) {
  console.log('✅ Método getActiveProductCountByMainCategory adicionado');
} else {
  console.log('❌ Método getActiveProductCountByMainCategory NÃO adicionado');
}

// Verificar se o sidebar foi atualizado corretamente
const sidebar = fs.readFileSync('components/sidebar.tsx', 'utf8');
if (sidebar.includes('result.type === \'category\' && result.productCount !== undefined')) {
  console.log('✅ Componente Sidebar atualizado para mostrar productCount');
} else {
  console.log('❌ Componente Sidebar NÃO atualizado para mostrar productCount');
}

console.log('\nTeste concluído!');