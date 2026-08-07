import React, { useRef, useEffect } from 'react';
import { subscribeToLenis } from './SmoothScroll';

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

      // To make it feel like a "proper" deep parallax, we need it to move much slower than the section.
      // We counter-translate it DOWN by 40% of the total scroll distance.
      // As the page scrolls UP by `totalDistance`, the background translates DOWN by `0.4 * totalDistance`.
      // Net speed is 60% of the page scroll (it lags behind smoothly).
      const parallaxOffset = (progress - 0.5) * (totalDistance * 0.4);
      bgRef.current.style.transform = `translate3d(0, ${parallaxOffset}px, 0)`;
    };

    // Initial call to set position before first scroll
    updatePosition();

    // Subscribe to Lenis directly to guarantee perfect sync with the virtual scroll engine
    const unsubscribe = subscribeToLenis(updatePosition);

    // Fallback native scroll listener just in case Lenis is permanently missing
    window.addEventListener('scroll', updatePosition, { passive: true });

    return () => {
      unsubscribe();
      window.removeEventListener('scroll', updatePosition);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        ref={bgRef}
        className="absolute inset-x-0 -inset-y-[75%] will-change-transform"
      >
        {/* Subtle Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* The Staggered Tiles */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="staggered-tiles" width="400" height="400" patternUnits="userSpaceOnUse">
                {Array.from({ length: 5 }).map((_, rowIndex) =>
                  Array.from({ length: 5 }).map((_, colIndex) => {
                    // Stagger sequence by a whole tile per row
                    const tileIndex = (colIndex + rowIndex) % TILES.length;
                    return (
                      <image
                        key={`${rowIndex}-${colIndex}`}
                        href={TILES[tileIndex]}
                        x={colIndex * 80}
                        y={rowIndex * 80}
                        width="80"
                        height="80"
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
