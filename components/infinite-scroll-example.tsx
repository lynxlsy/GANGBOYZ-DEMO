"use client"

import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';

interface Item {
  id: number;
  name: string;
}

export function InfiniteScrollExample() {
  // Sample data - in a real app this would come from props or state
  const items: Item[] = [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" },
    { id: 4, name: "Item 4" },
    { id: 5, name: "Item 5" },
    { id: 6, name: "Item 6" },
    { id: 7, name: "Item 7" },
  ];

  // Use the infinite scroll hook
  const containerRef = useInfiniteScroll(items);

  return (
    <div className="w-full overflow-hidden">
      {/* Scroll container with infinite scroll behavior */}
      <div 
        ref={containerRef}
        className="flex overflow-x-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Render items three times: duplicate + original + duplicate */}
        {[...items, ...items, ...items].map((item, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 w-40 h-40 bg-gray-200 m-2 flex items-center justify-center"
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}