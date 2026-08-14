import React from 'react';
import type { Ticket } from '../../types/ticket';

interface TicketPriceFooterProps {
  ticket: Ticket;
  isAccent?: boolean;
}

export const TicketPriceFooter: React.FC<TicketPriceFooterProps> = ({ ticket, isAccent }) => (
  <div
    className={`ticket-notch-stub w-full shrink-0 py-7 md:py-8 px-6 md:px-8 min-h-24 flex items-center justify-between ${isAccent ? 'bg-[#644431]' : 'bg-[#215336]'}`}
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
