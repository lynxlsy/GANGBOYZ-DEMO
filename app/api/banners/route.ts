import { NextRequest, NextResponse } from 'next/server'
import { Banner, BannerUpdatePayload } from '@/lib/banner-types'

// Simular banco de dados em memória (em produção seria um DB real)
const bannersDB = new Map<string, Banner>()

// Inicializar banners padrão
function initializeDefaultBanners() {
  if (bannersDB.size === 0) {
    const defaultBanners: Banner[] = [
      {
        id: "hero",
        src: "/urban-streetwear-model-in-black-hoodie-against-dar.jpg",
        mime: "image/jpeg",
        naturalWidth: 1920,
        naturalHeight: 1080,
        ratio: "1920x650",
        scale: 1.0,
        tx: 0,
        ty: 0,
        version: 1,
        published: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: "hot",
        src: "/black-oversized-streetwear-jacket.jpg",
        mime: "image/jpeg",
        naturalWidth: 1920,
        naturalHeight: 1080,
        ratio: "1920x650",
        scale: 1.0,
        tx: 0,
        ty: 0,
        version: 1,
        published: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: "footer",
        src: "/placeholder.jpg",
        mime: "image/jpeg",
        naturalWidth: 1920,
        naturalHeight: 1080,
        ratio: "1920x650",
        scale: 1.0,
        tx: 0,
        ty: 0,
        version: 1,
        published: true,
        updatedAt: new Date().toISOString()
      }
    ]

    defaultBanners.forEach(banner => {
      bannersDB.set(banner.id, banner)
    })
  }
}

// GET /api/banners?ids=hero,hot
export async function GET(request: NextRequest) {
  try {
    initializeDefaultBanners()
    
    const { searchParams } = new URL(request.url)
    const idsParam = searchParams.get('ids')
    
    if (!idsParam) {
      return NextResponse.json({ error: 'Parâmetro ids é obrigatório' }, { status: 400 })
    }

    const ids = idsParam.split(',').map(id => id.trim()) as Banner['id'][]
    const banners: Banner[] = []

    for (const id of ids) {
      const banner = bannersDB.get(id)
      if (banner) {
        banners.push(banner)
      }
    }

    // Cache control para desenvolvimento
    const response = NextResponse.json(banners)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    
    return response
    
  } catch (error) {
    console.error('Erro ao buscar banners:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// PUT /api/banners/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    initializeDefaultBanners()
    
    const { id } = params
    const payload: BannerUpdatePayload = await request.json()

    // Validar ID
    if (!['hero', 'hot', 'footer'].includes(id)) {
      return NextResponse.json({ error: 'ID de banner inválido' }, { status: 400 })
    }

    // Validar payload
    if (!payload.src || !payload.mime || !payload.naturalWidth || !payload.naturalHeight) {
      return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
    }

    // Validar scale mínimo (evitar bordas vazias)
    const minScale = Math.min(1920 / payload.naturalWidth, 650 / payload.naturalHeight)
    if (payload.scale < minScale) {
      payload.scale = minScale
    }

    // Limitar tx/ty para não mostrar áreas fora da imagem
    const maxTx = Math.max(0, (payload.scale * payload.naturalWidth - 1920) / 2)
    const maxTy = Math.max(0, (payload.scale * payload.naturalHeight - 650) / 2)
    
    payload.tx = Math.max(-maxTx, Math.min(maxTx, payload.tx))
    payload.ty = Math.max(-maxTy, Math.min(maxTy, payload.ty))

    // Buscar banner atual
    const currentBanner = bannersDB.get(id)
    if (!currentBanner) {
      return NextResponse.json({ error: 'Banner não encontrado' }, { status: 404 })
    }

    // Criar nova versão
    const updatedBanner: Banner = {
      ...currentBanner,
      src: payload.src,
      mime: payload.mime,
      naturalWidth: payload.naturalWidth,
      naturalHeight: payload.naturalHeight,
      scale: payload.scale,
      tx: payload.tx,
      ty: payload.ty,
      version: currentBanner.version + 1,
      published: true,
      updatedAt: new Date().toISOString()
    }

    // Salvar no "banco"
    bannersDB.set(id, updatedBanner)

    return NextResponse.json(updatedBanner)
    
  } catch (error) {
    console.error('Erro ao atualizar banner:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
