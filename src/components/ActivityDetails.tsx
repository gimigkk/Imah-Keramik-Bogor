import React from 'react';
import { Ticket, TicketVideo } from '../types/ticket';

interface ActivityDetailsProps {
  ticket: Ticket;
  className?: string;
}

const ActivityVideo: React.FC<{ video: TicketVideo }> = ({ video }) => (
  <figure className="min-w-0 overflow-hidden border border-foreground/15 bg-background">
    <video
      aria-label={video.title}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      className="aspect-video w-full bg-muted object-cover grayscale"
    >
      <source src={video.src} type="video/mp4" />
    </video>
    <figcaption className="px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
      {video.title}
    </figcaption>
  </figure>
);

export const ActivityDetails: React.FC<ActivityDetailsProps> = ({ ticket, className = '' }) => (
  <section
    aria-labelledby="activity-detail-heading"
    className={`flex flex-col border border-foreground/20 bg-card p-5 shadow-xl md:p-7 ${className}`}
  >
    <div>
      <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
        Tentang aktivitas
      </p>
      <h3 id="activity-detail-heading" className="font-serif text-3xl leading-none md:text-4xl">
        {ticket.title}
      </h3>
    </div>

    <p className="mt-6 max-w-2xl font-sans text-sm leading-7 text-foreground/75 md:text-base">
      {ticket.description} {ticket.additionalDetails}
    </p>

    {ticket.videos && ticket.videos.length > 0 && (
      <div className="mt-7">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
          {ticket.videos.map((video) => (
            <ActivityVideo key={video.src} video={video} />
          ))}
        </div>
      </div>
    )}
  </section>
);
