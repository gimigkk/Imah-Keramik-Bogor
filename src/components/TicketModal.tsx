import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Ticket } from '../types/ticket';
import { ActivityDetails } from './ActivityDetails';
import { PackageCards } from './PackageCards';
import { TicketCard } from './TicketCard';

interface TicketModalProps {
  ticket: Ticket | null;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ ticket, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    if (ticket) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [ticket, onClose]);

  if (!ticket) return null;

  const isWideTicket = ticket.isHorizontal || (ticket.gridSpan?.cols ?? 1) >= 4;
  const whatsappMessage = encodeURIComponent(
    `Halo Imah Keramik Bogor, saya mau tanya / booking tiket "${ticket.title}" (${ticket.code}).`
  );
  const whatsappHref = `https://wa.me/628128145417?text=${whatsappMessage}`;

  return (
    <div
      className="ticket-modal-backdrop fixed inset-0 z-50 overflow-y-auto bg-[#292a27] p-3 md:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="activity-detail-heading"
        className="relative mx-auto flex min-h-full w-full max-w-6xl items-center py-12"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail tiket"
          className="fixed right-4 top-4 z-30 grid h-10 w-10 place-items-center rounded-full border border-background/30 bg-card text-foreground shadow-lg transition-colors hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background md:right-6 md:top-6"
        >
          <X size={19} />
        </button>

        <div className="w-full">
          {isWideTicket ? (
            <div className="grid gap-4">
              <TicketCard ticket={ticket} />
              <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
                <ActivityDetails ticket={ticket} whatsappHref={whatsappHref} />
                <PackageCards ticket={ticket} />
              </div>
            </div>
          ) : (
            <div className="grid items-start gap-4 lg:grid-cols-[minmax(300px,0.78fr)_minmax(0,1.22fr)]">
              <div className="lg:row-span-2">
                <TicketCard ticket={ticket} />
              </div>
              <ActivityDetails ticket={ticket} whatsappHref={whatsappHref} />
              <PackageCards ticket={ticket} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
