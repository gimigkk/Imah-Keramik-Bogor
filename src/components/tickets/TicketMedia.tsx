import React from 'react';
import { getResponsiveImageProps } from '../../lib/responsiveImage';

interface TicketMediaProps {
  src?: string;
  alt: string;
  sizes: string;
  className: string;
}

export const TicketMedia: React.FC<TicketMediaProps> = ({ src, alt, sizes, className }) => {
  if (!src) return null;

  const imageProps = getResponsiveImageProps(src, sizes);

  return (
    <div data-ticket-image className={className}>
      {src.endsWith('.mp4') ? (
        <video
          src={src}
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
