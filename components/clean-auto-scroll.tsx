// Clean auto-scroll implementation for reference
"use client"

import { useEffect, useRef } from 'react'

interface Banner {
  id: string
  title: string
  link: string
  image: string
}

export function useAutoScroll(banners: Banner[]) {
  const bannerContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll functionality
  useEffect(() => {
    if (!bannerContainerRef.current || banners.length === 0) return

    let autoScrollInterval: NodeJS.Timeout | null = null
    let isUserScrolling = false
    let scrollEndTimer: NodeJS.Timeout | null = null
    
    // Function to handle auto scroll
    const autoScroll = () => {
      if (!isUserScrolling && bannerContainerRef.current) {
        const container = bannerContainerRef.current
        const scrollAmount = 300 // Width of one banner card
        container.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        })
      }
    }
    
    // Start auto scroll after 1 second
    const startAutoScroll = () => {
      autoScrollInterval = setInterval(autoScroll, 1000)
    }
    
    // Clear interval
    const clearAutoScroll = () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval)
        autoScrollInterval = null
      }
    }
    
    // Handle user scroll events - DISABLE auto-scroll completely on user interaction
    const handleUserScrollStart = () => {
      isUserScrolling = true
      clearAutoScroll()
      
      // Clear existing timer
      if (scrollEndTimer) {
        clearTimeout(scrollEndTimer)
        scrollEndTimer = null
      }
    }
    
    // DON'T restart auto-scroll after user interaction - keep it disabled
    const handleUserScrollEnd = () => {
      // Keep auto-scroll disabled permanently after user interaction
      isUserScrolling = true
      clearAutoScroll()
    }
    
    // Add event listeners
    const container = bannerContainerRef.current
    container.addEventListener('scroll', handleUserScrollStart)
    
    // Check if scrollend event is supported, if not use scroll with debounce
    if ('onscrollend' in window) {
      container.addEventListener('scrollend', handleUserScrollEnd)
    } else {
      // Fallback: use scroll event with debounce
      let scrollTimer: NodeJS.Timeout
      const handleScrollFallback = () => {
        handleUserScrollStart()
        clearTimeout(scrollTimer)
        // Don't restart auto-scroll even with fallback
        scrollTimer = setTimeout(handleUserScrollEnd, 100)
      }
      container.addEventListener('scroll', handleScrollFallback)
    }
    
    // Start auto scroll initially
    const initialStartTimer = setTimeout(startAutoScroll, 1000)
    
    // Clean up
    return () => {
      clearTimeout(initialStartTimer)
      clearAutoScroll()
      if (scrollEndTimer) {
        clearTimeout(scrollEndTimer)
      }
      container.removeEventListener('scroll', handleUserScrollStart)
      container.removeEventListener('scrollend', handleUserScrollEnd)
    }
  }, [banners])

  return bannerContainerRef
}