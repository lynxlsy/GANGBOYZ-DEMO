import { Banner } from '@/lib/banner-types'

interface BannerRendererProps {
  banner: Banner
  className?: string
  children?: React.ReactNode
}

export function BannerRenderer({ banner, className = "", children }: BannerRendererProps) {
  const isVideo = banner.mime.startsWith('video/')
  const isGif = banner.mime === 'image/gif'

  // Calcular estilos de transformação
  const transformStyle = {
    transform: `translate3d(${banner.tx * 50}%, ${banner.ty * 50}%, 0) scale(${banner.scale})`,
    transformOrigin: 'center',
    willChange: 'transform',
  }

  // URL com cache busting
  const imageUrl = `${banner.src}?v=${banner.version}`

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background Media */}
      <div className="absolute inset-0 bg-black">
        {isVideo ? (
          <video
            src={imageUrl}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            style={transformStyle}
          />
        ) : (
          <img
            src={imageUrl}
            alt="Banner"
            className="w-full h-full object-cover"
            style={transformStyle}
          />
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
      </div>

      {/* Content overlay */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  )
}
