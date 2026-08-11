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
    let isVisible = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          updatePosition();
        }
      },
      { rootMargin: '150px 0px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const updatePosition = () => {
      if (!isVisible || !containerRef.current || !bgRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      // Calculate parallax offset based ONLY on the section's top position relative to the viewport.
      // This completely decouples the background position from the section's height,
      // preventing the background from jumping when the section height changes (e.g., when switching tabs).
      //
      // As the page scrolls down, rect.top decreases. We counter-translate DOWN (positive offset)
      // by 40% of the scroll amount to give the background a net speed of 60%.
      const parallaxOffset = -rect.top * 0.4;
      bgRef.current.style.transform = `translate3d(0, ${parallaxOffset}px, 0)`;
    };

    // Initial call to set position before first scroll
    updatePosition();

    // Subscribe to Lenis directly to guarantee perfect sync with the virtual scroll engine
    const unsubscribe = subscribeToLenis(updatePosition);

    // Fallback native scroll listener just in case Lenis is permanently missing
    window.addEventListener('scroll', updatePosition, { passive: true });

    return () => {
      observer.disconnect();
      unsubscribe();
      window.removeEventListener('scroll', updatePosition);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        ref={bgRef}
        className="absolute inset-x-0 will-change-transform"
        style={{ top: '-50vh', bottom: '-50%' }}
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
