import React, { useEffect, useMemo, useState } from 'react';
import { Container } from '../layout/Container';
import { bundlingTickets, keramikTickets, membatikTickets, infoUmumTickets } from '../../data/tickets';
import type { Ticket } from '../../types/ticket';
import { TicketCard } from '../tickets/TicketCard';
import { TileBackground } from '../effects/TileBackground';
import { TicketModal } from '../tickets/TicketModal';
import { useRevealOnIntersect } from '../../hooks/useRevealOnIntersect';
import { useTicketModal } from '../../hooks/useTicketModal';
import { preloadTicketImages } from '../../lib/responsiveImage';
import FAQ from './FAQ';

const TICKET_TABS = [
  { id: 'keramik', label: 'Keramik', summary: '3 Pilihan Kelas' },
  { id: 'membatik', label: 'Membatik Kayu', summary: '4 Pilihan Paket' },
  { id: 'bundling', label: 'Bundling', summary: '2 Pilihan Bundling' },
] as const;

type TicketTab = (typeof TICKET_TABS)[number]['id'];

export const BentoTickets: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TicketTab>('keramik');
  const [sectionRef, sectionVisible] = useRevealOnIntersect<HTMLElement>();
  const [infoRef, infoVisible] = useRevealOnIntersect<HTMLDivElement>();
  const {
    selectedTicket,
    hiddenGridTicketId,
    isClosing,
    openTicket,
    closeTicket,
  } = useTicketModal();

  useEffect(() => {
    const allSources = [
      ...keramikTickets,
      ...membatikTickets,
      ...bundlingTickets,
      ...infoUmumTickets,
    ]
      .map((t) => t.image)
      .filter(Boolean) as string[];
    preloadTicketImages(allSources);
  }, []);


  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentTab: TicketTab,
  ) => {
    const currentIndex = TICKET_TABS.findIndex((tab) => tab.id === currentTab);
    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % TICKET_TABS.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + TICKET_TABS.length) % TICKET_TABS.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = TICKET_TABS.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    const nextTab = TICKET_TABS[nextIndex];
    setActiveTab(nextTab.id);
    window.requestAnimationFrame(() => document.getElementById(`tab-${nextTab.id}`)?.focus());
  };

  const getGridTicketClassName = (ticket: Ticket, entranceClass: string) =>
    `${entranceClass} ${hiddenGridTicketId === ticket.id ? 'invisible' : ''}`;

  const activeTabTickets = activeTab === 'keramik'
    ? keramikTickets
    : activeTab === 'membatik'
      ? membatikTickets
      : bundlingTickets;
  const activeTabElements = useMemo(() => activeTabTickets.map((ticket, index) => (
    <TicketCard
      key={ticket.id}
      ticket={ticket}
      onClick={openTicket}
      className={getGridTicketClassName(ticket, sectionVisible ? activeTab === 'bundling' ? 'ticket-enter-x' : 'ticket-enter-y' : '')}
      style={{ '--stagger-delay': `${index * 80}ms` } as React.CSSProperties}
    />
  )), [activeTab, activeTabTickets, openTicket, sectionVisible, hiddenGridTicketId]);
  const infoUmumElements = useMemo(() => infoUmumTickets.map((ticket, index) => (
    <TicketCard key={ticket.id} ticket={ticket} onClick={openTicket} className={getGridTicketClassName(ticket, infoVisible ? 'ticket-enter-y' : '')} style={{ '--stagger-delay': `${index * 80}ms` } as React.CSSProperties} />
  )), [openTicket, infoVisible, hiddenGridTicketId]);

  const activeTabSummary = TICKET_TABS.find((tab) => tab.id === activeTab)?.summary;

  return (
    <section ref={sectionRef} id="activities" className="pt-12 pb-20 md:pt-16 md:pb-24 bg-card border-b border-foreground/10 relative">
      <TileBackground />
      <Container className="relative z-10">
        <div className="mb-4 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-0 md:border-b border-foreground/20 pb-0 md:pb-4">
          <div>
            <h2 className="font-serif font-bold text-4xl md:text-6xl text-foreground uppercase tracking-tighter leading-none">Katalog Aktivitas.</h2>
          </div>
          <p className="text-muted-foreground font-sans font-semibold text-xs md:text-sm text-left md:text-right max-w-md leading-relaxed pb-0.5">Berikut merupakan katalog wisata kita.<br className="hidden md:inline" /> Tempat terbatas agar perhatian individu maksimal.</p>
        </div>
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div role="tablist" aria-label="Kategori aktivitas" className="flex flex-row w-full sm:w-auto gap-1 sm:gap-2">
            {TICKET_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return <button key={tab.id} id={`tab-${tab.id}`} role="tab" aria-selected={isActive} aria-controls={`panel-${tab.id}`} tabIndex={isActive ? 0 : -1} onClick={() => setActiveTab(tab.id)} onKeyDown={(event) => handleTabKeyDown(event, tab.id)} className={`flex-1 sm:flex-none px-2 sm:px-5 py-2 font-mono text-[9px] sm:text-xs uppercase tracking-widest font-bold border transition-colors ${isActive ? 'bg-foreground text-background border-foreground' : 'bg-transparent text-foreground/70 border-foreground/20 hover:border-foreground/50 hover:text-foreground'}`}>{tab.label}</button>;
            })}
          </div>
          <span className="hidden md:inline-block font-mono text-xs text-muted-foreground uppercase tracking-widest">{activeTabSummary}</span>
        </div>
        <div id={`panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`} className="grid grid-cols-1 gap-3 md:grid-cols-4 mb-10 md:mb-12">{activeTabElements}</div>
        <div ref={infoRef} className="pt-12">
          <div className="mb-8 text-center">
            <h3 className="font-serif font-bold text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2"><span className="md:hidden">Informasi Umum</span><span className="hidden md:inline">Informasi Umum & Sewa</span></h3>
            <p className="font-sans font-semibold text-xs md:text-sm text-muted-foreground text-balance">Tiket masuk studio, workshop kustom, paket usaha expert, dan penyewaan aula.</p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">{infoUmumElements}</div>
        </div>
        <FAQ />
      </Container>
      <TicketModal ticket={selectedTicket} onClose={closeTicket} isClosing={isClosing} />
    </section>
  );
};

export default BentoTickets;
