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

// Single shared Price Footer Component used by all vertical cards
const TicketPriceFooter: React.FC<TicketPriceFooterProps> = ({ ticket, isAccent }) => (
  <div className={`w-full py-5 px-6 flex items-center justify-between ${
    isAccent ? 'bg-background/5' : 'bg-secondary/10'
  }`}>
    <div>
      <span className={`font-mono font-bold block text-base md:text-lg ${isAccent ? 'text-background' : 'text-foreground'}`}>
        {ticket.price}
      </span>
      {ticket.unitLabel && (
        <span className={`font-sans text-[10px] block mt-0.5 ${isAccent ? 'text-background/60' : 'text-muted-foreground'}`}>
          {ticket.unitLabel}
        </span>
      )}
    </div>
    <span className={`font-mono text-[10px] uppercase tracking-widest border-b ${
      isAccent ? 'text-background/80 border-background/40' : 'text-foreground/70 border-foreground/30'
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

  // Card container class (no hover shadow or scale transitions)
  const containerClass = `group relative border border-foreground/20 shadow-sm flex justify-between cursor-pointer ${colSpanClass} ${rowSpanClass} ${colStartClass} ${rowStartClass} ${
    isAccent ? 'bg-[#5c3a28] text-background' : 'bg-background text-foreground'
  }`;

  // 1. FEATURED VERTICAL TICKET (CAC — 2 cols x 2 rows vertical ticket, image under title/content)
  if (isFeatured) {
    return (
      <div onClick={() => onClick(ticket)} className={`${containerClass} flex-col`}>
        {/* Top Content Area: Title & Content at top, Image expands to fill remaining space */}
        <div className="p-6 md:p-8 flex flex-col flex-1 gap-4">
          <div>
            <div className="flex justify-between items-start mb-3">
              {renderBadge()}
              <span className="font-mono text-sm text-muted-foreground tracking-widest">{ticket.code}</span>
            </div>

            <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-2 leading-tight">
              {ticket.title}
            </h3>
            <p className="text-muted-foreground font-sans text-sm max-w-md mb-3 leading-relaxed">
              {ticket.description}
            </p>

            {/* Tags / Included items chips */}
            {ticket.tags && ticket.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
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

          {/* Image stays desaturated with no hover effects */}
          {ticket.image && (
            <div className="w-full flex-1 min-h-[200px] border border-foreground/10 overflow-hidden bg-muted relative mt-1">
              <img
                src={ticket.image}
                alt={ticket.title}
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-80"
              />
            </div>
          )}
        </div>

        {/* Horizontal Perforated Divider */}
        <div className="relative border-t-2 border-dashed border-foreground/20 flex-shrink-0 w-full">
          <div className="absolute top-[-1px] left-[-1px] w-6 h-6 bg-card rounded-full -translate-x-1/2 -translate-y-1/2 border-r border-foreground/20" />
          <div className="absolute top-[-1px] right-[-1px] w-6 h-6 bg-card rounded-full translate-x-1/2 -translate-y-1/2 border-l border-foreground/20" />
        </div>

        {/* Shared Bottom Price Footer */}
        <TicketPriceFooter ticket={ticket} isAccent={isAccent} />
      </div>
    );
  }

  // 2. HORIZONTAL TICKET BRANCH (Bundling & Membatik Kayu — Image on Left, Content in Middle, Vertical Rip & Price Stub on Right)
  if (isAccent || ticket.isHorizontal) {
    const isDoubleTall = ticket.gridSpan?.rows === 2;
    return (
      <div onClick={() => onClick(ticket)} className={`${containerClass} flex-col md:flex-row ${
        isDoubleTall ? 'min-h-[280px] md:min-h-[340px]' : ''
      }`}>
        {/* Left Side: Image on left of title/content */}
        <div className={`flex-1 p-6 ${isDoubleTall ? 'md:p-8' : ''} flex flex-col md:flex-row gap-6 items-center`}>
          {ticket.image && (
            <div className={`w-full md:w-5/12 aspect-video md:aspect-auto h-full overflow-hidden border relative flex-shrink-0 ${
              isDoubleTall ? 'min-h-[200px] md:min-h-[260px]' : 'min-h-[140px]'
            } ${
              isAccent ? 'border-background/20 bg-muted' : 'border-foreground/10 bg-muted'
            }`}>
              <img
                src={ticket.image}
                alt={ticket.title}
                className={`absolute inset-0 w-full h-full object-cover filter grayscale opacity-80 ${
                  isAccent ? 'mix-blend-luminosity opacity-70' : ''
                }`}
              />
            </div>
          )}

          <div className="flex-1 w-full flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-start mb-3">
                {renderBadge() || <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Info</span>}
                <span className={`font-mono text-sm tracking-widest ${isAccent ? 'text-background/50' : 'text-muted-foreground'}`}>
                  {ticket.code}
                </span>
              </div>

              <h3 className={`font-serif text-2xl md:text-3xl mb-2 ${isAccent ? 'text-background' : 'text-foreground'}`}>
                {ticket.title}
              </h3>
              <p className={`font-sans text-xs md:text-sm mb-3 leading-relaxed ${isAccent ? 'text-background/80' : 'text-muted-foreground'}`}>
                {ticket.description}
              </p>
            </div>

            {ticket.tags && ticket.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
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
          </div>
        </div>

        {/* Vertical Perforated Rip Line on the Right */}
        <div className={`relative border-t-2 md:border-t-0 md:border-l-2 border-dashed flex-shrink-0 ${
          isAccent ? 'border-background/30' : 'border-foreground/20'
        }`}>
          <div className={`hidden md:block absolute top-[-1px] left-[-1px] w-6 h-6 bg-card rounded-full -translate-x-1/2 -translate-y-1/2 border-b ${
            isAccent ? 'border-background/20' : 'border-foreground/20'
          }`} />
          <div className={`hidden md:block absolute bottom-[-1px] left-[-1px] w-6 h-6 bg-card rounded-full -translate-x-1/2 translate-y-1/2 border-t ${
            isAccent ? 'border-background/20' : 'border-foreground/20'
          }`} />
          <div className={`md:hidden absolute top-[-1px] left-[-1px] w-6 h-6 bg-card rounded-full -translate-x-1/2 -translate-y-1/2 border-r ${
            isAccent ? 'border-background/20' : 'border-foreground/20'
          }`} />
          <div className={`md:hidden absolute top-[-1px] right-[-1px] w-6 h-6 bg-card rounded-full translate-x-1/2 -translate-y-1/2 border-l ${
            isAccent ? 'border-background/20' : 'border-foreground/20'
          }`} />
        </div>

        {/* Right Side Price Stub */}
        <div className={`w-full md:w-56 p-6 flex flex-col justify-center items-center text-center flex-shrink-0 ${
          isAccent ? 'bg-background/5' : 'bg-secondary/10'
        }`}>
          <span className={`font-mono text-[10px] uppercase tracking-[0.2em] mb-1 ${
            isAccent ? 'text-background/60' : 'text-muted-foreground'
          }`}>
            Harga Tiket
          </span>
          <span className={`font-mono text-xl md:text-2xl font-bold block mb-1 ${
            isAccent ? 'text-background' : 'text-foreground'
          }`}>
            {ticket.price}
          </span>
          {ticket.unitLabel && (
            <span className={`font-sans text-[10px] block mb-3 ${
              isAccent ? 'text-background/60' : 'text-muted-foreground'
            }`}>
              {ticket.unitLabel}
            </span>
          )}
          <span className={`font-mono text-[10px] uppercase tracking-widest border-b ${
            isAccent ? 'text-background/80 border-background/40' : 'text-foreground/70 border-foreground/30'
          }`}>
            Detail →
          </span>
        </div>
      </div>
    );
  }

  // 3. REGULAR VERTICAL CARDS (Fun Clay, Glaze Coloring, Membatik, HTM, Sewa Aula, Workshop, Paket Usaha)
  return (
    <div onClick={() => onClick(ticket)} className={`${containerClass} flex-col`}>
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

          {/* Render Chips/Tags */}
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
              className={`absolute inset-0 w-full h-full object-cover filter grayscale opacity-80 ${
                isAccent ? 'mix-blend-luminosity opacity-70' : ''
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
