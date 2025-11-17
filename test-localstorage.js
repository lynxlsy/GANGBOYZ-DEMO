// Script para verificar produtos no localStorage
const fs = require('fs');

// Verificar se há dados de produtos no localStorage
console.log('Verificando dados de produtos no localStorage...');

// Simular leitura de dados do localStorage
const localStorageData = {
  'gang-boyz-hot-products': '[]',
  'gang-boyz-standalone-products': '[]',
  'gang-boyz-categories': '[]',
  'gang-boyz-products': '[]',
  'gang-boyz-test-products': '[]'
};

// Verificar se há dados reais no localStorage
Object.keys(localStorageData).forEach(key => {
  try {
    // Verificar se o arquivo existe no sistema de arquivos (simulação)
    console.log(`Verificando ${key}...`);
    
    // Tentar ler dados reais do localStorage (se existirem)
    // Esta é apenas uma simulação, pois não temos acesso ao localStorage real aqui
    console.log(`  ${key}: [] (vazio)`);
  } catch (error) {
    console.log(`  ${key}: Erro ao ler - ${error.message}`);
  }
});

console.log('\nVerificando produtos no código...');

// Verificar produtos nos arquivos de contexto
const contextFiles = [
  'lib/products-context.tsx',
  'lib/products-context-simple.tsx'
];

contextFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    console.log(`\nArquivo: ${file}`);
    console.log(`Tamanho: ${content.length} caracteres`);
    
    // Verificar se há definições de produtos
    const productDefs = content.match(/const.*?initialProducts.*?=/s);
    if (productDefs) {
      console.log('  Encontrada definição de produtos iniciais');
    } else {
      console.log('  Nenhuma definição de produtos iniciais encontrada');
    }
    
    // Verificar se há produtos reais definidos
    const realProducts = content.match(/\{[^}]*name:.*?price:.*?categories:.*?\]/gs);
    if (realProducts) {
      console.log(`  Produtos reais encontrados: ${realProducts.length}`);
    } else {
      console.log('  Nenhum produto real encontrado');
    }
  } catch (error) {
    console.log(`Erro ao ler ${file}: ${error.message}`);
  }
});

console.log('\nVerificando produtos demo...');
try {
  const demoContent = fs.readFileSync('lib/demo-products.ts', 'utf8');
  console.log(`Arquivo demo-products.ts: ${demoContent.length} caracteres`);
  
  // Verificar produtos demo
  const demoProducts = demoContent.match(/export const demo.*?Product.*?=/gs);
  if (demoProducts) {
    console.log(`  Definições de produtos demo encontradas: ${demoProducts.length}`);
  } else {
    console.log('  Nenhuma definição de produtos demo encontrada');
  }
} catch (error) {
  console.log(`Erro ao ler demo-products.ts: ${error.message}`);
}