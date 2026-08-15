import React from 'react';
import type { Ticket } from '../../types/ticket';
import { TicketPrice } from './TicketPrice';

interface TicketPriceFooterProps {
  ticket: Ticket;
  isAccent?: boolean;
  showDetailIndicator?: boolean;
}

export const TicketDetailIndicator: React.FC = () => (
  <span className="mt-2 inline-flex rounded-full bg-background/95 px-2.5 py-1 font-sans text-[10px] font-medium text-foreground shadow-md">
    Lihat detail ↗
  </span>
);

export const TicketPriceFooter: React.FC<TicketPriceFooterProps> = ({ ticket, isAccent, showDetailIndicator = false }) => (
  <div
    className={`ticket-notch-stub w-full shrink-0 ${showDetailIndicator ? 'py-4 md:py-5' : 'py-7 md:py-8'} px-6 md:px-8 min-h-24 flex items-center justify-center text-center ${isAccent ? 'bg-[#644431]' : 'bg-[#215336]'}`}
  >
    <div className="text-center">
      <TicketPrice
        price={ticket.price}
        originalPrice={ticket.originalPrice}
        originalPriceClassName="font-sans text-xs text-background/60 line-through decoration-background/70 tracking-tight"
        priceClassName="font-brand font-bold text-xl md:text-2xl text-background tracking-tight"
      />
      {ticket.unitLabel && (
        <span className="font-sans text-xs block mt-1 text-background/60">
          {ticket.unitLabel}
        </span>
      )}
      {showDetailIndicator && <TicketDetailIndicator />}
    </div>
  </div>
);
