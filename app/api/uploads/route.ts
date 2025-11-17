import { NextRequest, NextResponse } from 'next/server'
import { UploadResponse } from '@/lib/banner-types'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo fornecido' }, { status: 400 })
    }

    // Validar tipo de arquivo
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/webm', 'video/ogg'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Formato não suportado. Use JPG, PNG, WebP, GIF, MP4, WebM ou OGG.' 
      }, { status: 400 })
    }

    // Validar tamanho
    const maxSize = file.type.startsWith('video/') ? 10 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      const maxSizeMB = file.type.startsWith('video/') ? '10MB' : '5MB'
      return NextResponse.json({ 
        error: `Arquivo muito grande. Máximo ${maxSizeMB}.` 
      }, { status: 400 })
    }

    // Converter para base64 (simulando upload para CDN)
    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`
    
    console.log('Upload debug - File type:', file.type, 'Size:', file.size, 'Data URL length:', dataUrl.length)

    // Obter dimensões da imagem
    const dimensions = await getImageDimensions(dataUrl)
    
    // Gerar hash simples baseado no conteúdo
    const hash = generateSimpleHash(file.name + file.size + file.type + Date.now())

    const response: UploadResponse = {
      url: dataUrl,
      width: dimensions.width,
      height: dimensions.height,
      mime: file.type,
      hash
    }

    console.log('Upload response:', response)
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// Função para obter dimensões da imagem (Node.js compatible)
async function getImageDimensions(dataUrl: string): Promise<{ width: number, height: number }> {
  try {
    // Para Node.js, vamos usar uma abordagem mais simples
    // Extrair dimensões do base64 se possível, senão usar fallback
    const base64Data = dataUrl.split(',')[1]
    if (base64Data) {
      // Tentar extrair dimensões do header da imagem
      const buffer = Buffer.from(base64Data, 'base64')
      
      // Para JPEG
      if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
        let i = 2
        while (i < buffer.length - 1) {
          if (buffer[i] === 0xFF && (buffer[i + 1] === 0xC0 || buffer[i + 1] === 0xC2)) {
            const height = (buffer[i + 5] << 8) | buffer[i + 6]
            const width = (buffer[i + 7] << 8) | buffer[i + 8]
            return { width, height }
          }
          i++
        }
      }
      
      // Para PNG
      if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
        const width = (buffer[16] << 24) | (buffer[17] << 16) | (buffer[18] << 8) | buffer[19]
        const height = (buffer[20] << 24) | (buffer[21] << 16) | (buffer[22] << 8) | buffer[23]
        return { width, height }
      }
    }
    
    // Fallback para dimensões padrão
    return { width: 1920, height: 1080 }
  } catch (error) {
    console.error('Erro ao obter dimensões:', error)
    return { width: 1920, height: 1080 }
  }
}

// Gerar hash simples
function generateSimpleHash(input: string): string {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}
