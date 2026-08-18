import React from 'react';
import type { Ticket } from '../../types/ticket';
import { TicketBadge } from './TicketBadge';
import { TicketMedia } from './TicketMedia';
import { TicketPerforation } from './TicketPerforation';
import { TicketDetailIndicator, TicketPriceFooter } from './TicketPriceFooter';
import { TicketPrice } from './TicketPrice';

interface TicketCardProps {
  ticket: Ticket;
  onClick?: (ticket: Ticket) => void;
  standalone?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

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
  const showDetailIndicator = Boolean(onClick) || standalone;
  const imageSizes = standalone
    ? '(min-width: 1024px) 460px, calc(100vw - 5rem)'
    : isFeatured || (ticket.gridSpan?.cols ?? 1) >= 2
      ? '(min-width: 1400px) 560px, (min-width: 768px) 44vw, calc(100vw - 5rem)'
      : '(min-width: 1400px) 270px, (min-width: 768px) 22vw, calc(100vw - 5rem)';
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
              <div className="flex justify-between items-start mb-2">
                <TicketBadge badge={ticket.badge} savings={ticket.savings} isAccent={isAccent} />
              </div>
            )}

            <h3 className="font-serif font-bold text-3xl md:text-4xl text-foreground mb-2 leading-tight">
              {ticket.title}
            </h3>
            <p className="text-muted-foreground font-sans text-sm mb-3 leading-relaxed text-balance">
              {ticket.description}
            </p>
          </div>

          {/* Image stays full-color with no hover effects */}
          <TicketMedia
            src={ticket.image}
            alt={ticket.title}
            sizes={imageSizes}
            priority={standalone || isFeatured}
            className="w-full flex-1 min-h-36 border border-foreground/10 overflow-hidden bg-muted relative mt-1"
          />
        </div>

        <TicketPerforation />

        {/* Shared Bottom Price Footer */}
        <TicketPriceFooter
          ticket={ticket}
          isAccent={isAccent}
          showDetailIndicator={showDetailIndicator}
        />
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
          <TicketMedia
            src={ticket.image}
            alt={ticket.title}
            sizes={imageSizes}
            priority={standalone}
            className={`order-2 md:order-1 w-full md:w-5/12 aspect-video md:aspect-auto h-auto md:h-full overflow-hidden border relative shrink-0 ${isDoubleTall ? 'min-h-50 md:min-h-65' : 'min-h-35'
              } ${isAccent ? 'border-background/20 bg-muted' : 'border-foreground/10 bg-muted'
              }`}
          />

          <div className="order-1 md:order-2 flex-1 w-full flex flex-col justify-between md:h-full">
            <div>
              {ticket.badge && (
                <div className="flex justify-between items-start mb-3">
                  <TicketBadge badge={ticket.badge} savings={ticket.savings} isAccent={isAccent} />
                </div>
              )}

              <h3 className={`font-serif font-bold text-2xl md:text-3xl mb-2 ${isAccent ? 'text-background' : 'text-foreground'}`}>
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
          className={`ticket-notch-stub relative w-full md:w-56 shrink-0 ${showDetailIndicator ? 'py-4 md:py-4' : 'py-7 md:p-6'} px-6 min-h-24 flex flex-row md:flex-col items-center justify-center text-center ${isAccent ? 'bg-[#644431]' : 'bg-[#215336]'
            }`}
        >
          <div className="flex flex-col md:items-center">
            <span className="hidden md:block font-mono text-[10px] uppercase tracking-[0.2em] mb-1 text-background/60">
              Harga Tiket
            </span>
            <TicketPrice
              price={ticket.price}
              originalPrice={ticket.originalPrice}
              className="md:text-center"
              originalPriceClassName="font-sans text-xs text-background/60 line-through decoration-background/70 tracking-tight"
              priceClassName="font-brand font-bold text-xl md:text-2xl text-background tracking-tight md:mb-1"
            />
            {ticket.unitLabel && (
              <span className={`font-sans text-xs md:text-[10px] block mt-1 md:mt-0 ${showDetailIndicator ? '' : 'md:mb-3'} text-background/60`}>
                {ticket.unitLabel}
              </span>
            )}
            {showDetailIndicator && <TicketDetailIndicator />}
          </div>
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
                <TicketBadge badge={ticket.badge} savings={ticket.savings} isAccent={isAccent} />
              </div>
            )}

            <h3 className={`font-serif font-bold text-2xl md:text-3xl mb-1.5 ${isAccent ? 'text-background' : 'text-foreground'}`}>
              {ticket.title}
            </h3>
            <p className={`font-sans text-xs md:text-sm leading-relaxed text-balance ${isAccent ? 'text-background/80' : 'text-muted-foreground'}`}>
              {ticket.description}
            </p>
          </div>

          {/* Mobile: Image bottom (order-2), Desktop: Image left (order-1) */}
          <TicketMedia
            src={ticket.image}
            alt={ticket.title}
            sizes={imageSizes}
            priority={standalone}
            className={`order-2 md:order-1 w-full md:w-5/12 h-32 md:h-auto md:min-h-36 shrink-0 overflow-hidden border relative mt-3 md:mt-0 ${
              isAccent ? 'border-background/20 bg-muted' : 'border-foreground/10 bg-muted'
            }`}
          />
        </div>

        <TicketPerforation />
        <TicketPriceFooter
          ticket={ticket}
          isAccent={isAccent}
          showDetailIndicator={showDetailIndicator}
        />
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
              <TicketBadge badge={ticket.badge} savings={ticket.savings} isAccent={isAccent} />
            </div>
          )}

          <h3 className={`font-serif font-bold text-2xl md:text-3xl mb-1.5 ${isAccent ? 'text-background' : 'text-foreground'}`}>
            {ticket.title}
          </h3>
          <p className={`font-sans text-xs md:text-sm mb-3 leading-relaxed text-balance ${isAccent ? 'text-background/80' : 'text-muted-foreground'}`}>
            {ticket.description}
          </p>
        </div>

        {/* Bottom Image Area */}
        <TicketMedia
          src={ticket.image}
          alt={ticket.title}
          sizes={imageSizes}
          priority={standalone}
          className={`w-full bg-muted overflow-hidden border relative mt-2 mb-1 ${
            standalone ? 'min-h-40 flex-1' : 'h-48 md:h-64'
          } ${isAccent ? 'border-background/20' : 'border-foreground/10'}`}
        />
      </div>

      <TicketPerforation />
      <TicketPriceFooter
        ticket={ticket}
        isAccent={isAccent}
        showDetailIndicator={showDetailIndicator}
      />
    </div>
  );
};
