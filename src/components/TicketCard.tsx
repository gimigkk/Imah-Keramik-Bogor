import React from 'react';
import { Ticket } from '../types/ticket';

interface TicketCardProps {
  ticket: Ticket;
  onClick?: (ticket: Ticket) => void;
  standalone?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface TicketPriceFooterProps {
  ticket: Ticket;
  isAccent?: boolean;
}

interface TicketPerforationProps {
  horizontal?: boolean;
}

const NotchOutline: React.FC<{ className: string }> = ({ className }) => (
  <span
    aria-hidden="true"
    className={`pointer-events-none absolute h-6 w-6 rounded-full border border-(--ticket-edge) ${className}`}
  />
);

const TicketPerforation: React.FC<TicketPerforationProps> = ({ horizontal = false }) => (
  <div
    aria-hidden="true"
    className={horizontal ? 'relative z-10 h-0 w-full shrink-0 md:h-auto md:w-0' : 'relative z-10 h-0 w-full shrink-0'}
  >
    <NotchOutline
      className={horizontal
        ? '-left-3 -top-3 [clip-path:inset(0_0_0_50%)] md:[clip-path:inset(50%_0_0_0)]'
        : '-left-3 -top-3 [clip-path:inset(0_0_0_50%)]'}
    />
    <NotchOutline
      className={horizontal
        ? '-right-3 -top-3 [clip-path:inset(0_50%_0_0)] md:-bottom-3 md:-left-3 md:right-auto md:top-auto md:[clip-path:inset(0_0_50%_0)]'
        : '-right-3 -top-3 [clip-path:inset(0_50%_0_0)]'}
    />
  </div>
);

// Single shared Price Footer Component used by all vertical cards
const TicketPriceFooter: React.FC<TicketPriceFooterProps> = ({ ticket, isAccent }) => (
  <div
    className={`ticket-notch-stub w-full shrink-0 py-7 md:py-8 px-6 md:px-8 min-h-24 flex items-center justify-between ${isAccent ? 'bg-[#644431]' : 'bg-[#215336]'
      }`}
  >
    <div>
      <span className="font-mono font-bold block text-xl md:text-2xl text-background">
        {ticket.price}
      </span>
      {ticket.unitLabel && (
        <span className="font-sans text-xs block mt-1 text-background/60">
          {ticket.unitLabel}
        </span>
      )}
    </div>
    <span className="font-mono text-xs uppercase tracking-widest border-b text-background/80 border-background/40">
      Detail
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

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  onClick,
  standalone = false,
  className = '',
  style,
}) => {
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
          <span className="uppercase tracking-widest text-[10px] font-mono border border-foreground px-2 py-1 bg-foreground text-background font-bold">
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
  const gridPlacementClass = standalone
    ? ''
    : `${colSpanClass} ${rowSpanClass} ${colStartClass} ${rowStartClass}`;
  const containerClass = `ticket-shell group relative flex justify-between ${onClick ? 'cursor-pointer' : 'cursor-default'} ${gridPlacementClass} ${className} ${isAccent ? 'ticket-accent text-background' : 'text-foreground'
    }`;

  // 1. FEATURED VERTICAL TICKET (CAC - 2 cols x 2 rows vertical ticket, image under title/content)
  if (isFeatured) {
    return (
      <div
        onClick={onClick ? () => onClick(ticket) : undefined}
        className={`${containerClass} flex-col`}
        style={style}
        data-ticket-id={ticket.id}
        data-ticket-surface={standalone ? 'modal' : 'grid'}
      >
        {/* Top Content Area: Title & Content at top, Image expands to fill remaining space */}
        <div className="ticket-notch-body bg-background p-6 md:p-8 flex flex-col flex-1 gap-4">
          <div>
            {ticket.badge && (
              <div className="flex justify-between items-start mb-3">
                {renderBadge()}
              </div>
            )}

            <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-2 leading-tight">
              {ticket.title}
            </h3>
            <p className="text-muted-foreground font-sans text-sm max-w-md mb-3 leading-relaxed">
              {ticket.description}
            </p>

            {/* Tags / Included items chips */}
            {ticket.tags && ticket.tags.length > 0 && (
              <div className="hidden md:flex flex-wrap gap-1.5">
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
            <div
              data-ticket-image
              className="w-full flex-1 min-h-50 border border-foreground/10 overflow-hidden bg-muted relative mt-1"
            >
              <img
                src={ticket.image}
                alt={ticket.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-80"
              />
            </div>
          )}
        </div>

        <TicketPerforation />

        {/* Shared Bottom Price Footer */}
        <TicketPriceFooter ticket={ticket} isAccent={isAccent} />
      </div>
    );
  }

  // 2. HORIZONTAL TICKET BRANCH (Bundling - Image on Left, Content in Middle, Vertical Rip & Price Stub on Right)
  if (isAccent || ticket.isHorizontal) {
    const isDoubleTall = ticket.gridSpan?.rows === 2;
    return (
      <div
        onClick={onClick ? () => onClick(ticket) : undefined}
        className={`${containerClass} ticket-horizontal flex-col md:flex-row ${isDoubleTall ? 'min-h-70 md:min-h-85' : ''
          }`}
        style={style}
        data-ticket-id={ticket.id}
        data-ticket-surface={standalone ? 'modal' : 'grid'}
      >
        {/* Left Side: Image on left of title/content */}
        <div className={`ticket-notch-body flex-1 p-6 ${isDoubleTall ? 'md:p-8' : ''} flex flex-col md:flex-row gap-6 items-stretch md:items-center ${isAccent ? 'bg-[#5c3a28]' : 'bg-background'
          }`}>
          {ticket.image && (
            <div
              data-ticket-image
              className={`order-2 md:order-1 w-full md:w-5/12 aspect-video md:aspect-auto h-auto md:h-full overflow-hidden border relative shrink-0 ${isDoubleTall ? 'min-h-50 md:min-h-65' : 'min-h-35'
                } ${isAccent ? 'border-background/20 bg-muted' : 'border-foreground/10 bg-muted'
                }`}
            >
              <img
                src={ticket.image}
                alt={ticket.title}
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 w-full h-full object-cover filter grayscale opacity-80 ${isAccent ? 'mix-blend-luminosity opacity-70' : ''
                  }`}
              />
            </div>
          )}

          <div className="order-1 md:order-2 flex-1 w-full flex flex-col justify-between md:h-full">
            <div>
              {ticket.badge && (
                <div className="flex justify-between items-start mb-3">
                  {renderBadge()}
                </div>
              )}

              <h3 className={`font-serif text-2xl md:text-3xl mb-2 ${isAccent ? 'text-background' : 'text-foreground'}`}>
                {ticket.title}
              </h3>
              <p className={`font-sans text-xs md:text-sm mb-3 leading-relaxed ${isAccent ? 'text-background/80' : 'text-muted-foreground'}`}>
                {ticket.description}
              </p>
            </div>

            {ticket.tags && ticket.tags.length > 0 && (
              <div className="hidden md:flex flex-wrap gap-1.5">
                {ticket.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border rounded-sm ${isAccent
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

        <TicketPerforation horizontal />

        {/* Right Side Price Stub */}
        <div
          className={`ticket-notch-stub w-full md:w-56 shrink-0 py-7 px-6 md:p-6 min-h-24 flex flex-row md:flex-col items-center md:justify-center justify-between text-left md:text-center ${isAccent ? 'bg-[#644431]' : 'bg-[#215336]'
            }`}
        >
          <div className="flex flex-col md:items-center">
            <span className="hidden md:block font-mono text-[10px] uppercase tracking-[0.2em] mb-1 text-background/60">
              Harga Tiket
            </span>
            <span className="font-mono font-bold block text-xl md:text-2xl md:mb-1 text-background">
              {ticket.price}
            </span>
            {ticket.unitLabel && (
              <span className="font-sans text-xs md:text-[10px] block mt-1 md:mt-0 md:mb-3 text-background/60">
                {ticket.unitLabel}
              </span>
            )}
          </div>
          <span className="font-mono text-xs md:text-[10px] uppercase tracking-widest border-b text-background/80 border-background/40">
            Detail
          </span>
        </div>
      </div>
    );
  }

  // 3. REGULAR VERTICAL CARDS (Fun Clay, Glaze Coloring, Membatik, HTM, Sewa Aula, Workshop, Paket Usaha)
  return (
    <div
      onClick={onClick ? () => onClick(ticket) : undefined}
      className={`${containerClass} flex-col`}
      style={style}
      data-ticket-id={ticket.id}
      data-ticket-surface={standalone ? 'modal' : 'grid'}
    >
      <div className={`ticket-notch-body flex-1 p-6 flex flex-col justify-between ${isAccent ? 'bg-[#5c3a28]' : 'bg-background'
        }`}>
        <div>
          {ticket.badge && (
            <div className="flex justify-between items-start mb-4">
              {renderBadge()}
            </div>
          )}

          <h3 className={`font-serif text-2xl md:text-3xl mb-2 ${isAccent ? 'text-background' : 'text-foreground'}`}>
            {ticket.title}
          </h3>

          <p className={`font-sans text-xs md:text-sm mb-4 leading-relaxed ${isAccent ? 'text-background/80' : 'text-muted-foreground'}`}>
            {ticket.description}
          </p>

          {/* Render Chips/Tags */}
          {ticket.tags && ticket.tags.length > 0 && (
            <div className="hidden md:flex flex-wrap gap-1.5 mb-4">
              {ticket.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border rounded-sm ${isAccent
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
            <div className="hidden md:flex flex-wrap gap-1.5 mb-4">
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
          <div
            data-ticket-image
            className={`w-full bg-muted overflow-hidden border relative my-2 ${standalone
              ? 'min-h-40 flex-1'
              : ticket.gridSpan?.cols && ticket.gridSpan.cols >= 2
                ? 'h-36 md:h-44'
                : 'h-28 md:h-32'
              } ${isAccent ? 'border-background/20' : 'border-foreground/10'}`}
          >
            <img
              src={ticket.image}
              alt={ticket.title}
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 w-full h-full object-cover filter grayscale opacity-80 ${isAccent ? 'mix-blend-luminosity opacity-70' : ''
                }`}
            />
          </div>
        )}
      </div>

      <TicketPerforation />

      {/* Shared Price Footer Component */}
      <TicketPriceFooter ticket={ticket} isAccent={isAccent} />
    </div>
  );
};
