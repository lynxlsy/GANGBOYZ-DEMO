// Test file to verify infinite scroll logic
// This is a simplified version of the core infinite scroll mechanism

class InfiniteScrollTest {
  private container: HTMLElement;
  private items: any[];

  constructor(container: HTMLElement, items: any[]) {
    this.container = container;
    this.items = items;
    
    // Initialize scroll position
    this.initScrollPosition();
    
    // Bind scroll handler
    this.container.addEventListener('scroll', this.handleScroll.bind(this));
  }

  private initScrollPosition() {
    // Start at the middle set of items for infinite scroll
    const scrollWidth = this.container.scrollWidth;
    const halfScrollWidth = scrollWidth / 2;
    // Start slightly offset to avoid edge cases
    this.container.scrollLeft = halfScrollWidth / 2 + 10;
  }

  private handleScroll() {
    const scrollPosition = this.container.scrollLeft;
    const containerWidth = this.container.clientWidth;
    const scrollWidth = this.container.scrollWidth;
    const halfScrollWidth = scrollWidth / 2;
    const threshold = containerWidth * 0.5; // 50% of container width as threshold
    
    // Infinite scroll - when we reach near the end, jump to the beginning
    if (scrollPosition + containerWidth >= scrollWidth - threshold) {
      // Jump to the beginning (first set of items) with a small offset to prevent infinite loop
      this.container.scrollLeft = scrollPosition - halfScrollWidth + 2;
    } else if (scrollPosition <= threshold) {
      // Jump to the end (second set of items) with a small offset to prevent infinite loop
      this.container.scrollLeft = scrollPosition + halfScrollWidth - 2;
    }
  }
}

// Test the implementation
function testInfiniteScroll() {
  // Mock container element
  const mockContainer = {
    scrollLeft: 0,
    clientWidth: 500,
    scrollWidth: 2000,
    addEventListener: (event: string, handler: Function) => {
      // Mock event listener
    }
  } as unknown as HTMLElement;
  
  // Mock items
  const mockItems = [1, 2, 3, 4, 5];
  
  // Create instance
  const infiniteScroll = new InfiniteScrollTest(mockContainer, mockItems);
  
  console.log('Infinite scroll test initialized');
  return infiniteScroll;
}

// Run test
testInfiniteScroll();

export { InfiniteScrollTest };