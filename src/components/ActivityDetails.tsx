import React from 'react';
import { X } from 'lucide-react';
import { Ticket, TicketVideo } from '../types/ticket';

interface ActivityDetailsProps {
  ticket: Ticket;
  onClose?: () => void;
  className?: string;
}

const ActivityVideo: React.FC<{ video: TicketVideo }> = ({ video }) => {
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

  return (
    <figure className="min-w-0 overflow-hidden border border-foreground/15 bg-background">
      <video
        ref={videoRef}
        aria-label={video.title}
        loop
        muted
        playsInline
        preload="metadata"
        onError={() => setHasError(true)}
        className="aspect-video w-full bg-muted object-cover opacity-100"
      >
        <source src={video.src} type="video/mp4" />
      </video>
      <figcaption className="px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        {video.title}
      </figcaption>
    </figure>
  );
};

export const ActivityDetails: React.FC<ActivityDetailsProps> = ({ ticket, onClose, className = '' }) => (
  <section
    aria-labelledby="activity-detail-heading"
    className={`relative flex flex-col border border-foreground/20 bg-card p-5 shadow-xl md:p-7 ${className}`}
  >
    {onClose && (
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup detail tiket"
        data-modal-initial-focus
        className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full border border-foreground/20 bg-transparent text-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground md:right-7 md:top-7"
      >
        <X size={16} />
      </button>
    )}
    <div>
      <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
        Tentang aktivitas
      </p>
      <h3 id="activity-detail-heading" className="font-serif text-3xl leading-none md:text-4xl pr-8">
        {ticket.title}
      </h3>
    </div>

    <p id="activity-detail-description" className="mt-6 max-w-2xl font-sans text-sm leading-7 text-foreground/75 md:text-base">
      {ticket.description} {ticket.additionalDetails}
    </p>

    {ticket.videos && ticket.videos.length > 0 && (
      <div className="mt-7">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
          {ticket.videos.map((video, idx) => (
            <ActivityVideo key={`${video.src}-${idx}`} video={video} />
          ))}
        </div>
      </div>
    )}
  </section>
);
