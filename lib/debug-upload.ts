// Teste simples para verificar se a API de upload está funcionando
export async function testUploadAPI() {
  try {
    console.log("🧪 Testando API de upload...")
    
    // Criar um arquivo de teste pequeno
    const canvas = document.createElement('canvas')
    canvas.width = 100
    canvas.height = 100
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#ff0000'
      ctx.fillRect(0, 0, 100, 100)
    }
    
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!)
      }, 'image/jpeg', 0.8)
    })
    
    const file = new File([blob], "test.jpg", { type: "image/jpeg" })
    console.log("📁 Arquivo de teste criado:", file.name, file.size, "bytes")

    const formData = new FormData()
    formData.append('file', file)
    
    console.log("📤 Enviando para API...")
    const response = await fetch('/api/uploads', {
      method: 'POST',
      body: formData,
    })

    console.log("📡 Resposta da API:", response.status, response.statusText)

    if (!response.ok) {
      const error = await response.text()
      console.error("❌ Erro na API:", error)
      return false
    }

    const result = await response.json()
    console.log("✅ Resultado do upload:", result)
    
    return true
  } catch (error) {
    console.error("❌ Erro no teste:", error)
    return false
  }
}

// Função para testar o fluxo completo
export async function testCompleteFlow() {
  console.log("🧪 Testando fluxo completo...")
  
  // Teste 1: API de upload
  console.log("\n1️⃣ Testando API de upload...")
  const uploadResult = await testUploadAPI()
  
  // Teste 2: Verificar se localStorage está funcionando
  console.log("\n2️⃣ Testando localStorage...")
  try {
    const testData = { test: "data" }
    localStorage.setItem("test", JSON.stringify(testData))
    const retrieved = localStorage.getItem("test")
    localStorage.removeItem("test")
    
    if (retrieved) {
      console.log("✅ localStorage funcionando")
    } else {
      console.log("❌ localStorage com problema")
    }
  } catch (error) {
    console.error("❌ Erro no localStorage:", error)
  }
  
  // Teste 3: Verificar se eventos estão funcionando
  console.log("\n3️⃣ Testando eventos...")
  try {
    window.dispatchEvent(new CustomEvent('test'))
    console.log("✅ Eventos funcionando")
  } catch (error) {
    console.error("❌ Erro nos eventos:", error)
  }
  
  console.log("\n📊 Resultado do teste:", uploadResult ? "✅ Sucesso" : "❌ Falha")
  return uploadResult
}

// Executar teste automaticamente no console
if (typeof window !== 'undefined') {
  console.log("🔧 Teste de upload disponível. Execute: testCompleteFlow()")
  ;(window as any).testCompleteFlow = testCompleteFlow
  ;(window as any).testUploadAPI = testUploadAPI
}
