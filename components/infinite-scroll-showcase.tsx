"use client"

import { useState, useEffect, useRef } from "react"

interface BannerItem {
  id: string
  title: string
  link: string
  image: string
}

export function InfiniteScrollShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [banners] = useState<BannerItem[]>([
    { id: "1", title: "Categoria 1", link: "#", image: "/placeholder-1.svg" },
    { id: "2", title: "Categoria 2", link: "#", image: "/placeholder-2.svg" },
    { id: "3", title: "Categoria 3", link: "#", image: "/placeholder-3.svg" },
    { id: "4", title: "Categoria 4", link: "#", image: "/placeholder-4.svg" },
    { id: "5", title: "Categoria 5", link: "#", image: "/placeholder-5.svg" },
    { id: "6", title: "Categoria 6", link: "#", image: "/placeholder-6.svg" },
    { id: "7", title: "Categoria 7", link: "#", image: "/placeholder-7.svg" },
  ])

  // Initialize scroll position
  useEffect(() => {
    if (containerRef.current && banners.length > 0) {
      const container = containerRef.current
      // Start at the middle set of banners for infinite scroll
      container.scrollLeft = container.scrollWidth / 4
    }
  }, [banners])

  // Handle infinite scroll
  const handleScroll = () => {
    if (containerRef.current && banners.length > 0) {
      const container = containerRef.current
      const scrollPos = container.scrollLeft
      const containerWidth = container.clientWidth
      const scrollWidth = container.scrollWidth
      const segmentWidth = scrollWidth / 4 // Each segment is 1/4 of total width (duplicate + original)

      // When scrolled to near the end, jump to the beginning
      if (scrollPos + containerWidth >= segmentWidth * 3.5) {
        container.scrollLeft = scrollPos - segmentWidth * 2
      }
      // When scrolled to near the beginning, jump to the end
      else if (scrollPos <= segmentWidth * 0.5) {
        container.scrollLeft = scrollPos + segmentWidth * 2
      }
    }
  }

  return (
    <div className="w-full overflow-hidden">
      <div 
        ref={containerRef}
        className="flex overflow-x-auto scrollbar-hide"
        onScroll={handleScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {/* Duplicate set 1 */}
        {[...banners].map((banner) => (
          <div key={`dup1-${banner.id}`} className="flex-shrink-0 w-[177px] mr-5">
            <a href={banner.link} className="block">
              <div className="text-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
                <span className="block mt-2 text-sm">{banner.title}</span>
              </div>
            </a>
          </div>
        ))}
        
        {/* Original set */}
        {[...banners].map((banner) => (
          <div key={`orig-${banner.id}`} className="flex-shrink-0 w-[177px] mr-5">
            <a href={banner.link} className="block">
              <div className="text-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
                <span className="block mt-2 text-sm">{banner.title}</span>
              </div>
            </a>
          </div>
        ))}
        
        {/* Duplicate set 2 */}
        {[...banners].map((banner) => (
          <div key={`dup2-${banner.id}`} className="flex-shrink-0 w-[177px] mr-5">
            <a href={banner.link} className="block">
              <div className="text-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
                <span className="block mt-2 text-sm">{banner.title}</span>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}