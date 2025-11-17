// Script para popular o Firebase com categorias de teste
// Executar no console do navegador quando logado como administrador

interface TestCategory {
  name: string;
  image: string;
  href: string;
  description: string;
  isActive: boolean;
  order: number;
}

async function populateTestCategories() {
  console.log('🌱 Populando Firebase com categorias de teste...');
  
  try {
    // Categorias de teste com imagens de placeholder
    const testCategories: TestCategory[] = [
      {
        name: "Oversized",
        image: "/placeholder-category-circle.png",
        href: "/explore/oversized",
        description: "Camisetas oversized de alta qualidade",
        isActive: true,
        order: 1
      },
      {
        name: "Estampas",
        image: "/placeholder-category-circle.png",
        href: "/explore/estampas",
        description: "Camisetas com estampas exclusivas",
        isActive: true,
        order: 2
      },
      {
        name: "Lisos",
        image: "/placeholder-category-circle.png",
        href: "/explore/lisos",
        description: "Camisetas lisas em várias cores",
        isActive: true,
        order: 3
      },
      {
        name: "Shorts",
        image: "/placeholder-category-circle.png",
        href: "/explore/shorts",
        description: "Shorts confortáveis para o verão",
        isActive: true,
        order: 4
      },
      {
        name: "Verão",
        image: "/placeholder-category-circle.png",
        href: "/explore/verao",
        description: "Coleção especial de verão",
        isActive: true,
        order: 5
      },
      {
        name: "Inverno",
        image: "/placeholder-category-circle.png",
        href: "/explore/inverno",
        description: "Roupas quentes para o inverno",
        isActive: true,
        order: 6
      }
    ];
    
    // Verificar se estamos no ambiente do navegador
    if (typeof window === 'undefined') {
      console.log('⚠️ Este script deve ser executado no navegador');
      return;
    }
    
    // Verificar se o Firebase está disponível
    // @ts-ignore
    if (typeof db === 'undefined' || db.type === 'mock-db') {
      console.log('⚠️ Firebase não está disponível. Verifique se você está logado como administrador.');
      return;
    }
    
    // Importar Firestore
    // @ts-ignore
    const { collection, addDoc, getDocs, query, where, serverTimestamp } = await import('firebase/firestore');
    
    // Adicionar categorias ao Firebase
    for (const category of testCategories) {
      try {
        // @ts-ignore
        const categoriesRef = collection(db, 'categories');
        // @ts-ignore
        const q = query(categoriesRef, where('name', '==', category.name));
        // @ts-ignore
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          // Adicionar nova categoria
          // @ts-ignore
          const docRef = await addDoc(categoriesRef, {
            ...category,
            // @ts-ignore
            createdAt: serverTimestamp(),
            // @ts-ignore
            updatedAt: serverTimestamp()
          });
          console.log(`✅ Categoria "${category.name}" adicionada com ID: ${docRef.id}`);
        } else {
          console.log(`ℹ️ Categoria "${category.name}" já existe`);
        }
      } catch (error) {
        console.error(`❌ Erro ao adicionar categoria "${category.name}":`, error);
      }
    }
    
    console.log('✅ Processo de população concluído!');
    console.log('🔄 Recarregue a página para ver as mudanças');
    
  } catch (error) {
    console.error('❌ Erro ao popular categorias:', error);
  }
}

// Executar população
populateTestCategories();

export { populateTestCategories };