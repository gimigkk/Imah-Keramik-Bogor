import React, { useState } from 'react';
import { Container } from './Container';
import { keramikTickets, membatikTickets, infoUmumTickets } from '../data/tickets';
import { Ticket } from '../types/ticket';
import { TicketCard } from './TicketCard';
import { TicketModal } from './TicketModal';

export const BentoTickets: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'keramik' | 'membatik'>('keramik');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  return (
    <section id="activities" className="py-20 md:py-24 bg-card border-b border-foreground/10 relative">
      {/* Subtle Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="mb-6 md:mb-6 md:flex justify-between items-end gap-8 border-b border-foreground/20 pb-4">
          <div>
            <h2 className="font-serif text-5xl md:text-8xl text-foreground uppercase tracking-tighter leading-[0.85]">
              Pilih Wisata.
            </h2>
          </div>
          <p className="text-muted-foreground font-sans text-sm max-w-sm mt-6 md:mt-0 text-left md:text-right">
            Pilih tiket untuk mendaftar. Tempat sangat terbatas untuk memastikan perhatian individu secara maksimal.
          </p>
        </div>

        {/* Tab Switcher (Simple 2 button design) */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('keramik')}
              className={`px-5 py-2 font-mono text-xs uppercase tracking-widest font-bold border transition-colors ${
                activeTab === 'keramik'
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-transparent text-foreground/70 border-foreground/20 hover:border-foreground/50 hover:text-foreground'
              }`}
            >
              Keramik
            </button>
            <button
              onClick={() => setActiveTab('membatik')}
              className={`px-5 py-2 font-mono text-xs uppercase tracking-widest font-bold border transition-colors ${
                activeTab === 'membatik'
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-transparent text-foreground/70 border-foreground/20 hover:border-foreground/50 hover:text-foreground'
              }`}
            >
              Membatik Kayu
            </button>
          </div>

          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            {activeTab === 'keramik' ? '3 Pilihan Kelas & 1 Bundling' : '1 Paket Membatik & 1 Bundling'}
          </span>
        </div>

        {/* TAB 1: KERAMIK (4-column Bento Grid) */}
        {activeTab === 'keramik' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-20">
            {keramikTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} onClick={setSelectedTicket} />
            ))}
          </div>
        )}

        {/* TAB 2: MEMBATIK KAYU (4-column Bento Grid) */}
        {activeTab === 'membatik' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-20">
            {membatikTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} onClick={setSelectedTicket} />
            ))}
          </div>
        )}

        {/* INFO UMUM SECTION (Always visible below tabs, text-only, 2-column grid) */}
        <div className="pt-12 border-t-2 border-dashed border-foreground/20">
          <div className="mb-8">
            <h3 className="font-serif text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">
              Informasi Umum & Sewa
            </h3>
            <p className="font-sans text-xs md:text-sm text-muted-foreground">
              Tiket masuk studio, workshop kustom, paket usaha expert, dan penyewaan aula.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {infoUmumTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} onClick={setSelectedTicket} />
            ))}
          </div>
        </div>
      </Container>

      {/* Ticket Modal Overlay */}
      <TicketModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
    </section>
  );
};

export default BentoTickets;
