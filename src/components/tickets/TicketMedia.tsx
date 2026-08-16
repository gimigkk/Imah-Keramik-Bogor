import React, { useEffect, useRef, useState } from 'react';
import { getResponsiveImageProps } from '../../lib/responsiveImage';

interface TicketMediaProps {
  src?: string;
  alt: string;
  sizes: string;
  className: string;
}

export const TicketMedia: React.FC<TicketMediaProps> = ({ src, alt, sizes, className }) => {
  const mediaRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setIsNearViewport(true);
      observer.disconnect();
    });

    observer.observe(media);
    return () => observer.disconnect();
  }, []);

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
          {...(isNearViewport ? imageProps : {})}
          alt={alt}
          loading="lazy"
          decoding="async"
          width="720"
          height="480"
          className="absolute inset-0 h-full w-full object-cover opacity-100"
        />
      )}
    </div>
  );
};
