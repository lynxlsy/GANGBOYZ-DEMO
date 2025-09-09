// Script para limpar localStorage e testar nova solução
export function clearLocalStorage() {
  try {
    // Limpar todos os dados de banners
    localStorage.removeItem("gang-boyz-homepage-banners")
    localStorage.removeItem("gang-boyz-footer-banner")
    
    console.log("✅ localStorage limpo com sucesso!")
    return true
  } catch (error) {
    console.error("❌ Erro ao limpar localStorage:", error)
    return false
  }
}

// Função para testar upload via API
export async function testUploadAPI() {
  try {
    // Criar um arquivo de teste pequeno
    const testData = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A"
    const response = await fetch(testData)
    const blob = await response.blob()
    const file = new File([blob], "test.jpg", { type: "image/jpeg" })

    const formData = new FormData()
    formData.append('file', file)
    
    const uploadResponse = await fetch('/api/uploads', {
      method: 'POST',
      body: formData,
    })

    if (!uploadResponse.ok) {
      throw new Error(`HTTP ${uploadResponse.status}`)
    }

    const result = await uploadResponse.json()
    console.log("✅ Upload via API funcionando:", result)
    return true
  } catch (error) {
    console.error("❌ Erro no teste de upload:", error)
    return false
  }
}

// Função para testar se localStorage não excede quota
export function testLocalStorageQuota() {
  try {
    // Criar dados de teste pequenos (apenas metadados)
    const testBanner = {
      id: "test-banner",
      name: "Test Banner",
      description: "Test Description",
      currentImage: "/test.jpg", // URL pequena
      mediaType: "image",
      dimensions: "1920x650",
      format: "JPG",
      position: "test",
      cropMetadata: {
        src: "/test.jpg",
        ratio: "1920x650",
        scale: 1.0,
        tx: 0,
        ty: 0
      }
    }

    const testData = JSON.stringify([testBanner])
    localStorage.setItem("test-banner", testData)
    
    // Verificar se foi salvo
    const retrieved = localStorage.getItem("test-banner")
    if (retrieved) {
      localStorage.removeItem("test-banner")
      console.log("✅ localStorage funcionando sem exceder quota!")
      return true
    } else {
      console.error("❌ Falha ao salvar no localStorage")
      return false
    }
  } catch (error) {
    console.error("❌ Erro no teste de localStorage:", error)
    return false
  }
}

// Executar todos os testes
export async function runStorageTests() {
  console.log("🧪 Iniciando testes de armazenamento...")
  
  // Limpar localStorage primeiro
  console.log("\n1️⃣ Limpando localStorage...")
  const clearResult = clearLocalStorage()
  
  // Testar quota do localStorage
  console.log("\n2️⃣ Testando quota do localStorage...")
  const quotaResult = testLocalStorageQuota()
  
  // Testar upload via API
  console.log("\n3️⃣ Testando upload via API...")
  const uploadResult = await testUploadAPI()
  
  console.log("\n📊 Resultados dos testes:")
  console.log(`${clearResult ? '✅' : '❌'} Limpeza do localStorage`)
  console.log(`${quotaResult ? '✅' : '❌'} Quota do localStorage`)
  console.log(`${uploadResult ? '✅' : '❌'} Upload via API`)
  
  const passed = [clearResult, quotaResult, uploadResult].filter(Boolean).length
  const total = 3
  
  console.log(`\n🎯 ${passed}/${total} testes passaram`)
  
  if (passed === total) {
    console.log("🎉 Todos os testes passaram! A solução está funcionando.")
  } else {
    console.log("⚠️ Alguns testes falharam. Verifique os erros acima.")
  }
  
  return passed === total
}
