// Test file to verify auto-scroll logic
// This is a simplified version of the auto-scroll mechanism

class AutoScrollTest {
  private container: HTMLElement;
  private items: any[];
  private autoScrollInterval: NodeJS.Timeout | null = null;
  private isUserScrolling = false;
  private scrollEndTimer: NodeJS.Timeout | null = null;

  constructor(container: HTMLElement, items: any[]) {
    this.container = container;
    this.items = items;
    
    // Initialize auto scroll
    this.initAutoScroll();
  }

  private initAutoScroll() {
    // Start auto scroll after 1.5 seconds
    setTimeout(() => {
      this.startAutoScroll();
    }, 1500);
  }

  private startAutoScroll() {
    this.autoScrollInterval = setInterval(() => {
      this.autoScroll();
    }, 1500);
  }

  private autoScroll() {
    if (!this.isUserScrolling) {
      const scrollAmount = 300; // Width of one banner card
      this.container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  private clearAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
  }

  public handleUserScrollStart = () => {
    this.isUserScrolling = true;
    this.clearAutoScroll();
    
    // Clear existing timer
    if (this.scrollEndTimer) {
      clearTimeout(this.scrollEndTimer);
      this.scrollEndTimer = null;
    }
  };

  public handleUserScrollEnd = () => {
    // Restart auto scroll after user stops scrolling for 3 seconds
    this.scrollEndTimer = setTimeout(() => {
      this.isUserScrolling = false;
      this.startAutoScroll();
    }, 3000);
  };

  public destroy() {
    this.clearAutoScroll();
    if (this.scrollEndTimer) {
      clearTimeout(this.scrollEndTimer);
    }
  }
}

// Test the implementation
function testAutoScroll() {
  // Mock container element
  const mockContainer = {
    scrollLeft: 0,
    clientWidth: 500,
    scrollWidth: 2000,
    scrollBy: (options: { left: number; behavior: string }) => {
      // Mock scrollBy
      console.log(`Scrolling by ${options.left}px with ${options.behavior} behavior`);
    },
    addEventListener: (event: string, handler: Function) => {
      // Mock event listener
      console.log(`Added listener for ${event}`);
    },
    removeEventListener: (event: string, handler: Function) => {
      // Mock event listener removal
      console.log(`Removed listener for ${event}`);
    }
  } as unknown as HTMLElement;
  
  // Mock items
  const mockItems = [1, 2, 3, 4, 5];
  
  // Create instance
  const autoScroll = new AutoScrollTest(mockContainer, mockItems);
  
  console.log('Auto scroll test initialized');
  return autoScroll;
}

// Run test
testAutoScroll();

export { AutoScrollTest };