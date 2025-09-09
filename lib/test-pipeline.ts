// Teste do pipeline completo
import { Banner } from '@/lib/banner-types'
import { uploadFile, updateBanner, useBanner } from '@/hooks/use-banners'

// Teste 1: Upload de arquivo
export async function testUpload() {
  try {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const result = await uploadFile(file)
    console.log('✅ Upload funcionando:', result)
    return true
  } catch (error) {
    console.error('❌ Erro no upload:', error)
    return false
  }
}

// Teste 2: Atualização de banner
export async function testBannerUpdate() {
  try {
    const payload = {
      src: '/test.jpg',
      mime: 'image/jpeg',
      naturalWidth: 1920,
      naturalHeight: 1080,
      scale: 1.2,
      tx: 0.1,
      ty: -0.1
    }
    
    const result = await updateBanner('hero', payload)
    console.log('✅ Atualização de banner funcionando:', result)
    return true
  } catch (error) {
    console.error('❌ Erro na atualização:', error)
    return false
  }
}

// Teste 3: Hook useBanner
export function testUseBanner() {
  try {
    const { banner, isLoading, isError } = useBanner('hero')
    console.log('✅ Hook useBanner funcionando:', { banner, isLoading, isError })
    return true
  } catch (error) {
    console.error('❌ Erro no hook:', error)
    return false
  }
}

// Executar todos os testes
export async function runAllTests() {
  console.log('🧪 Iniciando testes do pipeline...')
  
  const tests = [
    { name: 'Upload', fn: testUpload },
    { name: 'Banner Update', fn: testBannerUpdate },
    { name: 'useBanner Hook', fn: testUseBanner }
  ]
  
  const results = []
  
  for (const test of tests) {
    console.log(`\n🔍 Testando: ${test.name}`)
    const result = await test.fn()
    results.push({ name: test.name, passed: result })
  }
  
  console.log('\n📊 Resultados dos testes:')
  results.forEach(result => {
    console.log(`${result.passed ? '✅' : '❌'} ${result.name}`)
  })
  
  const passed = results.filter(r => r.passed).length
  const total = results.length
  
  console.log(`\n🎯 ${passed}/${total} testes passaram`)
  
  return passed === total
}
