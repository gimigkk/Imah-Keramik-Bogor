import React, { useRef, useEffect } from 'react';
import { getLenis } from './SmoothScroll';

const TILES = [
  '/tile.svg',
  '/tile2.svg',
  '/tile3.svg',
  '/tile4.svg',
  '/tile5.svg',
];

export const TileBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const updatePosition = () => {
      if (!containerRef.current || !bgRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const totalDistance = windowHeight + rect.height;
      const currentScroll = windowHeight - rect.top;
      
      let progress = currentScroll / totalDistance;
      progress = Math.max(0, Math.min(1, progress)); 
      
      const percentY = -2 + (progress * 4);
      bgRef.current.style.transform = `translate3d(0, ${percentY}%, 0)`;
    };

    const lenis = getLenis();

    if (lenis) {
      lenis.on('scroll', updatePosition);
    } else {
      window.addEventListener('scroll', updatePosition, { passive: true });
    }

    // Initial call
    updatePosition();

    return () => {
      if (lenis) {
        lenis.off('scroll', updatePosition);
      } else {
        window.removeEventListener('scroll', updatePosition);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        ref={bgRef}
        className="absolute inset-x-0 -inset-y-[25%] will-change-transform" 
      >
        {/* Subtle Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* The Staggered Tiles */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="staggered-tiles" width="300" height="300" patternUnits="userSpaceOnUse">
                {Array.from({ length: 5 }).map((_, rowIndex) =>
                  Array.from({ length: 5 }).map((_, colIndex) => {
                    // Stagger sequence by a whole tile per row
                    const tileIndex = (colIndex + rowIndex) % TILES.length;
                    return (
                      <image
                        key={`${rowIndex}-${colIndex}`}
                        href={TILES[tileIndex]}
                        x={colIndex * 60}
                        y={rowIndex * 60}
                        width="60"
                        height="60"
                      />
                    );
                  })
                )}
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#staggered-tiles)" />
          </svg>
        </div>
      </div>
    </div>
  );
};
