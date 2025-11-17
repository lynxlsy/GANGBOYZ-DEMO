// Infinite Scroll Core Logic
// This implementation creates a truly infinite horizontal scroll experience
// by duplicating items and using scroll position thresholds

class InfiniteScrollHandler {
  private container: HTMLElement;
  private items: any[];
  private onScrollHandler: () => void;

  constructor(container: HTMLElement, items: any[]) {
    this.container = container;
    this.items = items;
    
    // Bind scroll handler
    this.onScrollHandler = this.handleScroll.bind(this);
    this.container.addEventListener('scroll', this.onScrollHandler);
    
    // Initialize scroll position
    this.initScrollPosition();
  }

  // Initialize scroll position to middle segment for seamless infinite scroll
  private initScrollPosition() {
    // Wait for next frame to ensure DOM is ready
    requestAnimationFrame(() => {
      if (this.container && this.items.length > 0) {
        const scrollWidth = this.container.scrollWidth;
        const segmentWidth = scrollWidth / 4; // 4 segments: [dup1][original][dup2]
        this.container.scrollLeft = segmentWidth; // Start at beginning of original set
      }
    });
  }

  // Handle scroll events for infinite looping
  private handleScroll() {
    if (this.container && this.items.length > 0) {
      const scrollPos = this.container.scrollLeft;
      const containerWidth = this.container.clientWidth;
      const scrollWidth = this.container.scrollWidth;
      const segmentWidth = scrollWidth / 4; // Each segment is 1/4 of total width

      // When scrolled near the end of the last duplicate set, jump to the beginning of the first duplicate
      if (scrollPos + containerWidth >= segmentWidth * 3.5) {
        this.container.scrollLeft = scrollPos - segmentWidth * 2;
      }
      // When scrolled near the beginning of the first duplicate set, jump to the end of the last duplicate
      else if (scrollPos <= segmentWidth * 0.5) {
        this.container.scrollLeft = scrollPos + segmentWidth * 2;
      }
    }
  }

  // Clean up event listeners
  public destroy() {
    this.container.removeEventListener('scroll', this.onScrollHandler);
  }

  // Update items and reinitialize
  public updateItems(newItems: any[]) {
    this.items = newItems;
    this.initScrollPosition();
  }
}

// Factory function to create infinite scroll handler
function createInfiniteScroll(container: HTMLElement, items: any[]) {
  return new InfiniteScrollHandler(container, items);
}

export { createInfiniteScroll, InfiniteScrollHandler };