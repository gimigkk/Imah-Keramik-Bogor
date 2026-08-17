import React, { useEffect, useRef, useState } from 'react';
import { getResponsiveImageProps } from '../../lib/responsiveImage';

interface TicketMediaProps {
  src?: string;
  alt: string;
  sizes: string;
  className: string;
  priority?: boolean;
}

export const TicketMedia: React.FC<TicketMediaProps> = ({
  src,
  alt,
  sizes,
  className,
  priority = false,
}) => {
  const mediaRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(priority);

  // Video lazy loading observer
  useEffect(() => {
    if (!src || !src.endsWith('.mp4')) return;
    if (priority) {
      setIsNearViewport(true);
      return;
    }

    const media = mediaRef.current;
    if (!media) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(media);
    return () => observer.disconnect();
  }, [src, priority]);

  if (!src) return null;

  const imageProps = getResponsiveImageProps(src, sizes);

  return (
    <div ref={mediaRef} data-ticket-image className={className}>
      {src.endsWith('.mp4') ? (
        <video
          src={isNearViewport ? src : undefined}
          autoPlay
          loop
          muted
          playsInline
          aria-label={alt}
          className="absolute inset-0 h-full w-full object-cover opacity-100"
        />
      ) : (
        <img
          {...imageProps}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          width="720"
          height="480"
          className="absolute inset-0 h-full w-full object-cover opacity-100"
        />
      )}
    </div>
  );
};


