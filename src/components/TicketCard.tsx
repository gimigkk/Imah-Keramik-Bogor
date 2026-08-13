import React from 'react';
import { Ticket } from '../types/ticket';
import { getResponsiveImageProps } from '../lib/responsiveImage';

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
  const imageSizes = standalone
    ? '(min-width: 1024px) 460px, calc(100vw - 5rem)'
    : isFeatured || (ticket.gridSpan?.cols ?? 1) >= 2
      ? '(min-width: 1400px) 560px, (min-width: 768px) 44vw, calc(100vw - 5rem)'
      : '(min-width: 1400px) 270px, (min-width: 768px) 22vw, calc(100vw - 5rem)';
  const imageProps = ticket.image
    ? getResponsiveImageProps(ticket.image, imageSizes)
    : null;
  const handleKeyDown = onClick
    ? (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick(ticket);
        }
      }
    : undefined;
  const interactiveCardProps = onClick
    ? {
        onClick: () => onClick(ticket),
        onKeyDown: handleKeyDown,
        role: 'button' as const,
        tabIndex: 0,
        'aria-label': `Lihat detail ${ticket.title}, ${ticket.price}`,
      }
    : undefined;

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
            hemat{ticket.savings ? ` ${ticket.savings}` : ''}
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
  const containerClass = `ticket-shell group relative flex justify-between ${onClick ? 'cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground' : 'cursor-default'} ${gridPlacementClass} ${className} ${isAccent ? 'ticket-accent text-background' : 'text-foreground'
    }`;

  // 1. FEATURED VERTICAL TICKET (CAC - 2 cols x 2 rows vertical ticket, image under title/content)
  if (isFeatured) {
    return (
      <div
        {...interactiveCardProps}
        className={`${containerClass} flex-col`}
        style={style}
        data-ticket-id={ticket.id}
        data-ticket-surface={standalone ? 'modal' : 'grid'}
      >
        {/* Top Content Area: Title & Content at top, Image expands to fill remaining space */}
        <div className="ticket-notch-body bg-background p-5 md:p-6 flex flex-col flex-1 gap-3">
          <div>
            {ticket.badge && (
              <div className="flex justify-between items-start mb-3">
                {renderBadge()}
              </div>
            )}

            <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-2 leading-tight">
              {ticket.title}
            </h3>
            <p className="text-muted-foreground font-sans text-sm mb-3 leading-relaxed text-balance">
              {ticket.description}
            </p>


          </div>

          {/* Image stays full-color with no hover effects */}
          {ticket.image && (
            <div
              data-ticket-image
              className="w-full flex-1 min-h-36 border border-foreground/10 overflow-hidden bg-muted relative mt-1"
            >
              {ticket.image.endsWith('.mp4') ? (
                <video
                  src={ticket.image}
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-label={ticket.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-100"
                />
              ) : (
                <img
                  {...imageProps}
                  alt={ticket.title}
                  loading="lazy"
                  decoding="async"
                  width="720"
                  height="480"
                  className="absolute inset-0 h-full w-full object-cover opacity-100"
                />
              )}
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
    const heightClass = isDoubleTall
      ? 'min-h-70 md:min-h-85'
      : ticket.category === 'bundling'
        ? 'min-h-50 md:min-h-55'
        : '';
    return (
      <div
        {...interactiveCardProps}
        className={`${containerClass} ticket-horizontal flex-col md:flex-row ${heightClass}`}
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
              {ticket.image.endsWith('.mp4') ? (
                <video
                  src={ticket.image}
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-label={ticket.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-100"
                />
              ) : (
                <img
                  {...imageProps}
                  alt={ticket.title}
                  loading="lazy"
                  decoding="async"
                  width="720"
                  height="480"
                  className="absolute inset-0 h-full w-full object-cover opacity-100"
                />
              )}
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
              <p className={`font-sans text-xs md:text-sm mb-3 leading-relaxed text-balance ${isAccent ? 'text-background/80' : 'text-muted-foreground'}`}>
                {ticket.description}
              </p>
            </div>


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

  // 3. REGULAR VERTICAL & DESKTOP SPLIT CARDS
  const isWide = !standalone && Boolean(ticket.gridSpan?.cols && ticket.gridSpan.cols >= 2 && (!ticket.gridSpan.rows || ticket.gridSpan.rows === 1));

  if (isWide) {
    return (
      <div
        {...interactiveCardProps}
        className={`${containerClass} flex-col`}
        style={style}
        data-ticket-id={ticket.id}
        data-ticket-surface={standalone ? 'modal' : 'grid'}
      >
        <div
          className={`ticket-notch-body flex-1 p-5 flex flex-col md:flex-row md:items-stretch md:gap-5 ${
            isAccent ? 'bg-[#5c3a28]' : 'bg-background'
          }`}
        >
          {/* Mobile: Text top (order-1), Desktop: Text right (order-2) */}
          <div className="order-1 md:order-2 flex-1 flex flex-col justify-start">
            {ticket.badge && (
              <div className="flex justify-between items-start mb-2">
                {renderBadge()}
              </div>
            )}
            <h3 className={`font-serif text-2xl md:text-3xl mb-1.5 ${isAccent ? 'text-background' : 'text-foreground'}`}>
              {ticket.title}
            </h3>
            <p className={`font-sans text-xs md:text-sm leading-relaxed text-balance ${isAccent ? 'text-background/80' : 'text-muted-foreground'}`}>
              {ticket.description}
            </p>
          </div>

          {/* Mobile: Image bottom (order-2), Desktop: Image left (order-1) */}
          {ticket.image && (
            <div
              data-ticket-image
              className={`order-2 md:order-1 w-full md:w-5/12 h-32 md:h-auto md:min-h-36 shrink-0 overflow-hidden border relative mt-3 md:mt-0 ${
                isAccent ? 'border-background/20 bg-muted' : 'border-foreground/10 bg-muted'
              }`}
            >
              {ticket.image.endsWith('.mp4') ? (
                <video
                  src={ticket.image}
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-label={ticket.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-100"
                />
              ) : (
                <img
                  {...imageProps}
                  alt={ticket.title}
                  loading="lazy"
                  decoding="async"
                  width="720"
                  height="480"
                  className="absolute inset-0 h-full w-full object-cover opacity-100"
                />
              )}
            </div>
          )}
        </div>

        <TicketPerforation />
        <TicketPriceFooter ticket={ticket} isAccent={isAccent} />
      </div>
    );
  }

  // Standard 1-Column Vertical Cards (Membatik Kayu 1-4, HTM, Sewa Aula)
  return (
    <div
      {...interactiveCardProps}
      className={`${containerClass} flex-col`}
      style={style}
      data-ticket-id={ticket.id}
      data-ticket-surface={standalone ? 'modal' : 'grid'}
    >
      <div
        className={`ticket-notch-body flex-1 p-5 flex flex-col justify-between ${
          isAccent ? 'bg-[#5c3a28]' : 'bg-background'
        }`}
      >
        {/* Top Text Area (Title & Description) */}
        <div>
          {ticket.badge && (
            <div className="flex justify-between items-start mb-2">
              {renderBadge()}
            </div>
          )}
          <h3 className={`font-serif text-2xl md:text-3xl mb-1.5 ${isAccent ? 'text-background' : 'text-foreground'}`}>
            {ticket.title}
          </h3>
          <p className={`font-sans text-xs md:text-sm mb-3 leading-relaxed text-balance ${isAccent ? 'text-background/80' : 'text-muted-foreground'}`}>
            {ticket.description}
          </p>
        </div>

        {/* Bottom Image Area */}
        {ticket.image && (
          <div
            data-ticket-image
            className={`w-full bg-muted overflow-hidden border relative mt-2 mb-1 ${
              standalone ? 'min-h-40 flex-1' : 'h-48 md:h-64'
            } ${isAccent ? 'border-background/20' : 'border-foreground/10'}`}
          >
            {ticket.image.endsWith('.mp4') ? (
              <video
                src={ticket.image}
                autoPlay
                loop
                muted
                playsInline
                aria-label={ticket.title}
                className="absolute inset-0 h-full w-full object-cover opacity-100"
              />
            ) : (
              <img
                {...imageProps}
                alt={ticket.title}
                loading="lazy"
                decoding="async"
                width="720"
                height="480"
                className="absolute inset-0 h-full w-full object-cover opacity-100"
              />
            )}
          </div>
        )}
      </div>

      <TicketPerforation />
      <TicketPriceFooter ticket={ticket} isAccent={isAccent} />
    </div>
  );
};
