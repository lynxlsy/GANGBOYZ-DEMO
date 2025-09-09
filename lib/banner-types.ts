// Modelo único de Banner para DB
export interface Banner {
  id: "hero" | "hot" | "footer"
  src: string                    // URL da imagem original
  mime: string                   // MIME type (image/webp, image/jpeg, etc.)
  naturalWidth: number           // Largura original da imagem
  naturalHeight: number          // Altura original da imagem
  ratio: "1920x650"             // Viewport fixo (~2.95:1)
  scale: number                  // Zoom relativo
  tx: number                     // translateX relativo -1..1
  ty: number                     // translateY relativo -1..1
  version: number               // Incrementa a cada save
  published: boolean             // Se está publicado
  updatedAt: string              // ISO-8601 timestamp
}

// Upload response
export interface UploadResponse {
  url: string
  width: number
  height: number
  mime: string
  hash: string
}

// Banner update payload
export interface BannerUpdatePayload {
  src: string
  mime: string
  naturalWidth: number
  naturalHeight: number
  scale: number
  tx: number
  ty: number
}

// Broadcast message
export interface BannerUpdateMessage {
  id: string
  version: number
}
