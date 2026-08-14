import { Container } from '../layout/Container';
import { getResponsiveImageProps } from '../../lib/responsiveImage';
import { useRevealOnIntersect } from '../../hooks/useRevealOnIntersect';
import { reviewColumns, ReviewData } from '../../data/reviews';

const galleryImageSizes = '(min-width: 1400px) 270px, (min-width: 1024px) 22vw, (min-width: 640px) 46vw, calc(100vw - 5rem)';

export const GalleryReviews = () => {
  const [sectionRef, visible] = useRevealOnIntersect<HTMLElement>();

  const renderCard = (review: ReviewData, delay: number, className = "") => (
    <div
      key={review.id}
      className={`modal-reveal-panel ${visible ? 'modal-reveal-panel-visible' : ''} break-inside-avoid w-full ${className}`}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      <a
        href={review.googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative bg-white text-[#111b21] rounded-md rounded-tl-none p-3 shadow-sm hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer border border-black/5 block w-full h-full"
      >
        {/* Hover Overlay with Blur */}
        <div className="absolute inset-0 z-10 rounded-md rounded-tl-none bg-white/0 group-hover:bg-white/40 backdrop-blur-none group-hover:backdrop-blur-sm transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
          <span className="bg-white/95 text-[10px] px-2 py-0.5 rounded-full font-sans font-medium text-[#111b21] shadow-md">
            Buka di Maps ↗
          </span>
        </div>

        {/* WhatsApp Top-Left White Speech Tail */}
        <svg className="absolute -top-px -left-2 text-white" width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
          <path d="M10 0C6 0 0 0 0 10V0H10Z" />
        </svg>

        {/* Author Header */}
        <div className="flex items-center gap-2 mb-2 relative z-0">
          <span className="font-sans font-bold text-xs text-foreground">
            {review.author}
          </span>
        </div>

        {/* Participant's Creation Media (Optional Image/Video) */}
        {review.image && (
          <div className={`relative overflow-hidden rounded-sm bg-black/5 mb-2 w-full ${review.image.aspectRatio} z-0`}>
            {review.image.type === 'video' ? (
              <video
                src={review.image.url}
                className="h-full w-full object-cover opacity-100"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                {...getResponsiveImageProps(review.image.url, galleryImageSizes, [240, 360, 480, 640])}
                alt={review.image.alt || 'Karya peserta'}
                className="h-full w-full object-cover opacity-100"
                loading="lazy"
                decoding="async"
                width="640"
                height="426"
              />
            )}
          </div>
        )}

        {/* Review Text */}
        <p className="font-sans text-xs text-[#111b21] leading-relaxed mb-2.5 relative z-0">
          {review.quote}
        </p>

        {/* Footer: WhatsApp Timestamp + Double Checkmark */}
        <div className="flex items-center justify-end gap-1 text-[10px] text-[#667781] mt-1 relative z-0">
          <span>{review.time}</span>
          <svg viewBox="0 0 16 11" width="12" height="9" fill="#53bdeb">
            <path d="M15.01 3.316l-6.59 6.591L4.83 6.316l.896-.896 2.7 2.7 5.69-5.69.894.896zm-4.7 0l-.895-.896-4.8 4.8-1.8-1.8-.896.896 2.7 2.7 5.69-5.69z" />
          </svg>
        </div>
      </a>
    </div>
  );

  return (
    <section ref={sectionRef} id="gallery" className="pt-12 pb-6 md:pt-16 md:pb-8 bg-background overflow-hidden">
      <Container>
        {/* Section Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-0 md:border-b border-foreground/20 pb-2 md:pb-4">
          <div>
            <h2 className="font-serif font-bold text-4xl md:text-6xl text-foreground uppercase tracking-tighter leading-none">
              Kata Mereka.
            </h2>
          </div>
          <p className="text-muted-foreground font-sans text-xs md:text-sm text-left md:text-right max-w-md leading-relaxed pb-0.5">
            Ulasan jujur dari peserta di Google Reviews.<br className="hidden md:inline" /> Klik bubble untuk buka langsung di Google Maps.
          </p>
        </div>

        {/* Mobile Layout (< 640px): 1 Column, Top Highlights Only */}
        <div className="flex sm:hidden flex-col gap-4">
          {reviewColumns.map((col, idx) => 
            renderCard(col[0], idx * 100)
          )}
        </div>

        {/* Tablet Layout (640px - 1024px): 2 Columns */}
        <div className="hidden sm:flex lg:hidden gap-4">
          <div className="flex-1 flex flex-col gap-4">
            {reviewColumns[0].map((r, i) => renderCard(r, i * 100))}
            {reviewColumns[2].map((r, i) => renderCard(r, (reviewColumns[0].length * 100) + (i * 100)))}
          </div>
          <div className="flex-1 flex flex-col gap-4">
            {reviewColumns[1].map((r, i) => renderCard(r, 50 + (i * 100)))}
            {reviewColumns[3].map((r, i) => renderCard(r, 50 + (reviewColumns[1].length * 100) + (i * 100)))}
          </div>
        </div>

        {/* Desktop Layout (> 1024px): 4 Columns */}
        <div className="hidden lg:flex gap-4">
          {reviewColumns.map((col, colIdx) => (
            <div key={`desktop-col-${colIdx}`} className="flex-1 flex flex-col gap-4">
              {col.map((review, rowIdx) => 
                renderCard(review, (colIdx * 80) + (rowIdx * 100))
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
