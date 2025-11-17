import { useEffect, useRef } from 'react';

// Hook for implementing infinite horizontal scroll
// Usage: Pass a ref to the scroll container and an array of items
export function useInfiniteScroll<T>(items: T[]) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || items.length === 0) return;

    // Initialize scroll position
    const initScrollPosition = () => {
      // Start at the middle set of items for infinite scroll
      container.scrollLeft = container.scrollWidth / 4;
    };

    // Handle scroll events for infinite looping
    const handleScroll = () => {
      const scrollPos = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const scrollWidth = container.scrollWidth;
      const segmentWidth = scrollWidth / 4; // Each segment is 1/4 of total width

      // When scrolled near the end, jump to the beginning
      if (scrollPos + containerWidth >= segmentWidth * 3.5) {
        container.scrollLeft = scrollPos - segmentWidth * 2;
      }
      // When scrolled near the beginning, jump to the end
      else if (scrollPos <= segmentWidth * 0.5) {
        container.scrollLeft = scrollPos + segmentWidth * 2;
      }
    };

    // Initialize after a short delay to ensure DOM is ready
    const initTimer = setTimeout(initScrollPosition, 100);
    
    container.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(initTimer);
      container.removeEventListener('scroll', handleScroll);
    };
  }, [items]);

  return containerRef;
}