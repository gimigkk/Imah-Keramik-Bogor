import React from 'react';
import { ArrowDownRight, MessageCircle } from 'lucide-react';
import { Ticket } from '../types/ticket';

interface ActivityDetailsProps {
  ticket: Ticket;
  whatsappHref: string;
  className?: string;
}

const categoryLabels: Record<Ticket['category'], string> = {
  keramik: 'Kelas Keramik',
  membatik: 'Membatik Kayu',
  bundling: 'Paket Bundling',
  info_umum: 'Kunjungan & Fasilitas',
};

export const ActivityDetails: React.FC<ActivityDetailsProps> = ({ ticket, whatsappHref, className = '' }) => (
  <section
    aria-labelledby="activity-detail-heading"
    className={`flex flex-col border border-foreground/20 bg-card p-5 shadow-xl md:p-7 ${className}`}
  >
    <p className="mb-6 border-b border-foreground/15 pb-3 font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
      Detail reservasi · {ticket.code}
    </p>
    <div className="mb-7 flex items-start justify-between gap-6">
      <div>
        <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
          Tentang aktivitas
        </p>
        <h3 id="activity-detail-heading" className="font-serif text-3xl leading-none md:text-4xl">
          {ticket.title}
        </h3>
      </div>
      <ArrowDownRight className="mt-1 shrink-0 text-foreground/45" aria-hidden="true" />
    </div>

    <p className="max-w-2xl font-sans text-sm leading-7 text-foreground/75 md:text-base">
      {ticket.description}
    </p>

    <dl className="mt-7 grid grid-cols-2 gap-px border border-foreground/15 bg-foreground/15">
      <div className="bg-card p-4">
        <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Jenis</dt>
        <dd className="mt-1.5 text-sm font-semibold">{categoryLabels[ticket.category]}</dd>
      </div>
      <div className="bg-card p-4">
        <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Kode</dt>
        <dd className="mt-1.5 font-mono text-sm font-bold">{ticket.code}</dd>
      </div>
    </dl>

    <div className="mt-auto border-t border-dashed border-foreground/25 pt-5">
      <p className="mb-4 text-xs leading-5 text-muted-foreground">
        Tanyakan jadwal dan ketersediaan tempat langsung kepada tim studio.
      </p>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 bg-primary px-5 py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-foreground hover:text-background"
      >
        <MessageCircle size={15} />
        Tanya / pesan via WhatsApp
      </a>
    </div>
  </section>
);
