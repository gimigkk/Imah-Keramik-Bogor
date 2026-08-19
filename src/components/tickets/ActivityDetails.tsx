import React from 'react';
import { X } from 'lucide-react';
import { Ticket, TicketVideo } from '../../types/ticket';

interface ActivityDetailsProps {
  ticket: Ticket;
  onClose?: () => void;
  className?: string;
}

const ActivityVideo: React.FC<{ video: TicketVideo; ticketTitle?: string }> = ({ video, ticketTitle }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoEl.play().catch(() => {});
          } else {
            videoEl.pause();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(videoEl);
    return () => observer.disconnect();
  }, [video.src]);

  if (hasError) return null;

  const label = video.title || `Video aktivitas ${ticketTitle || 'Imah Keramik Bogor'}`;

  return (
    <figure className="min-w-0 flex-1 min-h-0 overflow-hidden border border-foreground/15 bg-background rounded-sm flex flex-col">
      <video
        ref={videoRef}
        aria-label={label}
        title={label}
        loop
        muted
        playsInline
        preload="metadata"
        onError={() => setHasError(true)}
        className="w-full h-full max-h-[320px] min-h-[85px] aspect-[4/5] bg-muted object-cover opacity-100 flex-1 shrink"
      >
        <source src={video.src} type="video/mp4" />
      </video>
    </figure>
  );
};

export const ActivityDetails: React.FC<ActivityDetailsProps> = ({ ticket, onClose, className = '' }) => (
  <section
    aria-labelledby="activity-detail-heading"
    className={`relative flex flex-col min-h-0 border border-foreground/20 bg-card p-5 shadow-xl md:p-6 rounded-sm ${className}`}
  >
    {onClose && (
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup detail tiket"
        data-modal-initial-focus
        className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full border border-foreground/20 bg-transparent text-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground md:right-6 md:top-6"
      >
        <X size={16} />
      </button>
    )}
    <div className="shrink-0">
      <p className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
        Tentang aktivitas
      </p>
      <h3 id="activity-detail-heading" className="font-serif font-bold text-2xl leading-none md:text-3xl lg:text-4xl pr-8">
        {ticket.title}
      </h3>
    </div>

    <p id="activity-detail-description" className="mt-3 lg:mt-4 shrink-0 max-w-2xl font-sans text-xs leading-relaxed text-foreground/75 md:text-sm md:leading-6">
      {ticket.additionalDetails ?? ticket.description}
    </p>

    {ticket.videos && ticket.videos.length > 0 && (
      <div className="mt-4 flex-1 min-h-0 flex flex-col justify-end">
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 md:grid md:grid-cols-2 xl:grid-cols-3 md:overflow-visible md:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex-1 min-h-0">
          {ticket.videos.map((video, idx) => (
            <div key={`${video.src}-${idx}`} className="w-[85%] shrink-0 snap-start md:w-auto md:shrink flex flex-col min-h-0">
              <ActivityVideo video={video} ticketTitle={ticket.title} />
            </div>
          ))}
        </div>
      </div>
    )}
  </section>
);
