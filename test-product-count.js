// Script para testar a contagem de produtos
const fs = require('fs');

// Verificar se há produtos no localStorage
const productsContext = fs.readFileSync('lib/products-context.tsx', 'utf8');
console.log('Tamanho do arquivo de produtos:', productsContext.length);

// Verificar se há produtos no arquivo
const hasProducts = productsContext.includes('name:');
console.log('Arquivo contém definições de produtos:', hasProducts);

// Tentar extrair alguns produtos
const productMatches = productsContext.match(/name:.*?price:.*?categories:.*?\]/gs);
if (productMatches) {
  console.log('Número de produtos encontrados:', productMatches.length);
  console.log('Primeiro produto:', productMatches[0].substring(0, 200));
} else {
  console.log('Nenhum produto encontrado com o padrão esperado');
}

// Verificar o arquivo de produtos simplificado
const simpleProductsContext = fs.readFileSync('lib/products-context-simple.tsx', 'utf8');
console.log('Tamanho do arquivo de produtos simplificado:', simpleProductsContext.length);

// Verificar se há dados no localStorage
console.log('Verificando localStorage...');
try {
  // Simular leitura do localStorage
  console.log('Arquivos no diretório lib:');
  const files = fs.readdirSync('lib');
  console.log(files.filter(f => f.includes('product')));
} catch (error) {
  console.log('Erro ao ler diretório:', error.message);
}