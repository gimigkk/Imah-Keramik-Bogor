import React from 'react';
import { Ticket } from '../types/ticket';

interface TicketCardProps {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
}

interface TicketPriceFooterProps {
  ticket: Ticket;
  isAccent?: boolean;
  large?: boolean;
}

// Single shared Price Footer Component used by all cards (featured & regular)
const TicketPriceFooter: React.FC<TicketPriceFooterProps> = ({ ticket, isAccent, large }) => (
  <div className={`w-full p-4 px-6 flex items-center justify-between ${isAccent ? 'bg-background/5' : 'bg-secondary/10'}`}>
    <div>
      <span className={`font-mono font-bold block ${large ? 'text-lg md:text-xl' : 'text-base md:text-lg'} ${isAccent ? 'text-background' : 'text-foreground'}`}>
        {ticket.price}
      </span>
      {ticket.unitLabel && (
        <span className={`font-sans text-[10px] block ${isAccent ? 'text-background/60' : 'text-muted-foreground'}`}>
          {ticket.unitLabel}
        </span>
      )}
    </div>
    <span className={`font-mono text-[10px] uppercase tracking-widest border-b transition-colors ${
      isAccent
        ? 'text-background/80 border-background/40 group-hover:text-background group-hover:border-background'
        : 'text-foreground/70 border-foreground/30 group-hover:text-foreground group-hover:border-foreground'
    }`}>
      Detail →
    </span>
  </div>
);

const colStartClasses: Record<number, string> = {
  1: 'md:col-start-1',
  2: 'md:col-start-2',
  3: 'md:col-start-3',
  4: 'md:col-start-4',
};

const rowStartClasses: Record<number, string> = {
  1: 'md:row-start-1',
  2: 'md:row-start-2',
  3: 'md:row-start-3',
  4: 'md:row-start-4',
};

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
  const isAccent = ticket.isAccent;
  const isFeatured = ticket.featured;

  // Determine badge styling based on design system
  const renderBadge = () => {
    if (!ticket.badge) return null;
    switch (ticket.badge) {
      case 'favorit':
        return (
          <span className="uppercase tracking-widest text-[10px] font-mono border border-foreground px-2 py-1 bg-foreground text-background font-bold">
            favorit
          </span>
        );
      case 'hemat':
        return (
          <span className="uppercase tracking-widest text-[10px] font-mono border border-background/50 px-2 py-1 bg-background text-foreground font-bold">
            hemat
          </span>
        );
      case '4_pilihan':
        return (
          <span className="uppercase tracking-widest text-[10px] font-mono border border-foreground px-2 py-1 bg-primary text-primary-foreground font-bold">
            4 pilihan
          </span>
        );
      case 'kustom':
        return (
          <span className="uppercase tracking-widest text-[10px] font-mono border border-foreground px-2 py-1 bg-foreground/10 text-foreground font-bold">
            kustom
          </span>
        );
      case 'expert':
        return (
          <span className="uppercase tracking-widest text-[10px] font-mono border border-foreground px-2 py-1 bg-foreground text-background font-bold">
            expert
          </span>
        );
      default:
        return (
          <span className="uppercase tracking-widest text-[10px] font-mono border border-foreground px-2 py-1">
            {ticket.badge}
          </span>
        );
    }
  };

  // Build grid column & row span/start classes dynamically
  let colSpanClass = 'md:col-span-1';
  if (ticket.gridSpan?.cols === 4) {
    colSpanClass = 'md:col-span-4';
  } else if (ticket.gridSpan?.cols === 3) {
    colSpanClass = 'md:col-span-3';
  } else if (ticket.gridSpan?.cols === 2) {
    colSpanClass = 'md:col-span-2';
  }

  let rowSpanClass = '';
  if (ticket.gridSpan?.rows === 2) {
    rowSpanClass = 'md:row-span-2';
  }

  const colStartClass = ticket.gridPosition?.colStart ? colStartClasses[ticket.gridPosition.colStart] || '' : '';
  const rowStartClass = ticket.gridPosition?.rowStart ? rowStartClasses[ticket.gridPosition.rowStart] || '' : '';

  // Card container class
  const containerClass = `group relative border border-foreground/20 shadow-sm flex flex-col justify-between hover:shadow-md transition-all cursor-pointer ${colSpanClass} ${rowSpanClass} ${colStartClass} ${rowStartClass} ${
    isAccent ? 'bg-[#5c3a28] text-background' : 'bg-background text-foreground'
  }`;

  // FEATURED / HERO CAC CARD (2 cols x 2 rows)
  if (isFeatured) {
    return (
      <div onClick={() => onClick(ticket)} className={containerClass}>
        {/* Top Content Wrapper: top-aligned flex column without justify-between */}
        <div className="p-6 md:p-8 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-4">
            {renderBadge()}
            <span className="font-mono text-sm text-muted-foreground tracking-widest">{ticket.code}</span>
          </div>

          <div className="flex flex-col md:flex-row gap-6 flex-1 mt-2">
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-3 leading-tight">
                {ticket.title}
              </h3>
              <p className="text-muted-foreground font-sans text-sm max-w-md mb-4 leading-relaxed">
                {ticket.description}
              </p>

              {/* Tags / Included items chips */}
              {ticket.tags && ticket.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {ticket.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 bg-secondary/30 text-foreground border border-foreground/10 rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {ticket.image && (
              <div className="w-full md:w-5/12 aspect-video md:aspect-auto flex-1 h-full border border-foreground/10 overflow-hidden bg-muted relative min-h-[160px]">
                <img
                  src={ticket.image}
                  alt={ticket.title}
                  className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
              </div>
            )}
          </div>
        </div>

        {/* Perforated Divider */}
        <div className="relative border-t-2 sm:border-t-0 sm:border-l-2 border-dashed border-foreground/20 flex-shrink-0">
          <div className="hidden sm:block absolute top-[-1px] left-[-1px] w-6 h-6 bg-card rounded-full -translate-x-1/2 -translate-y-1/2 border-b border-foreground/20" />
          <div className="hidden sm:block absolute bottom-[-1px] left-[-1px] w-6 h-6 bg-card rounded-full -translate-x-1/2 translate-y-1/2 border-t border-foreground/20" />
          <div className="sm:hidden absolute top-[-1px] left-[-1px] w-6 h-6 bg-card rounded-full -translate-x-1/2 -translate-y-1/2 border-r border-foreground/20" />
          <div className="sm:hidden absolute top-[-1px] right-[-1px] w-6 h-6 bg-card rounded-full translate-x-1/2 -translate-y-1/2 border-l border-foreground/20" />
        </div>

        {/* Shared Price Footer Component */}
        <TicketPriceFooter ticket={ticket} isAccent={isAccent} large={true} />
      </div>
    );
  }

  // ALL OTHER CARDS (Bundling, Consolidated Membatik, Regular 1x1, Info Umum)
  return (
    <div onClick={() => onClick(ticket)} className={containerClass}>
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            {renderBadge() || <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Info</span>}
            <span className={`font-mono text-sm tracking-widest ${isAccent ? 'text-background/50' : 'text-muted-foreground'}`}>
              {ticket.code}
            </span>
          </div>

          <h3 className={`font-serif text-2xl md:text-3xl mb-2 ${isAccent ? 'text-background' : 'text-foreground'}`}>
            {ticket.title}
          </h3>

          <p className={`font-sans text-xs md:text-sm mb-4 leading-relaxed ${isAccent ? 'text-background/80' : 'text-muted-foreground'}`}>
            {ticket.description}
          </p>

          {/* Render Chips/Tags (Included items or Tier chips) */}
          {ticket.tags && ticket.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {ticket.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border rounded-sm ${
                    isAccent
                      ? 'bg-background/10 text-background/90 border-background/20'
                      : 'bg-secondary/30 text-foreground border-foreground/15'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Render Addon Chips (for Sewa Aula) */}
          {ticket.addons && ticket.addons.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {ticket.addons.map((addon, idx) => (
                <span
                  key={idx}
                  className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 bg-primary/20 text-foreground border border-foreground/20 rounded-sm font-semibold"
                >
                  {addon}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Optional Card Image slot */}
        {ticket.image && (
          <div className={`w-full bg-muted overflow-hidden border relative my-2 ${
            ticket.gridSpan?.cols && ticket.gridSpan.cols >= 2 ? 'h-36 md:h-44' : 'h-28 md:h-32'
          } ${isAccent ? 'border-background/20' : 'border-foreground/10'}`}>
            <img
              src={ticket.image}
              alt={ticket.title}
              className={`absolute inset-0 w-full h-full object-cover filter grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ${
                isAccent ? 'mix-blend-luminosity opacity-70 group-hover:opacity-95' : ''
              }`}
            />
          </div>
        )}
      </div>

      {/* Perforated Cut Notch Divider */}
      <div className={`relative border-t-2 border-dashed flex-shrink-0 w-full ${isAccent ? 'border-background/30' : 'border-foreground/20'}`}>
        <div className={`absolute top-[-1px] left-[-1px] w-6 h-6 bg-card rounded-full -translate-x-1/2 -translate-y-1/2 border-r ${isAccent ? 'border-background/20' : 'border-foreground/20'}`} />
        <div className={`absolute top-[-1px] right-[-1px] w-6 h-6 bg-card rounded-full translate-x-1/2 -translate-y-1/2 border-l ${isAccent ? 'border-background/20' : 'border-foreground/20'}`} />
      </div>

      {/* Shared Price Footer Component */}
      <TicketPriceFooter ticket={ticket} isAccent={isAccent} large={false} />
    </div>
  );
};
