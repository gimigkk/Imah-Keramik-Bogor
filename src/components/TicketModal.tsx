import React, { useEffect, useLayoutEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Ticket } from '../types/ticket';
import { ActivityDetails } from './ActivityDetails';
import { PackageCards } from './PackageCards';
import { TicketCard } from './TicketCard';
import { haltSmoothScrollMomentum } from './SmoothScroll';

interface TicketModalProps {
  ticket: Ticket | null;
  onClose: () => void;
  isClosing: boolean;
}

export const TicketModal: React.FC<TicketModalProps> = ({ ticket, onClose, isClosing }) => {
  const [isVisible, setIsVisible] = useState(false);

  useLayoutEffect(() => {
    if (!ticket || isClosing) {
      setIsVisible(false);
      return;
    }

    const frame = window.requestAnimationFrame(() => setIsVisible(true));
    return () => window.cancelAnimationFrame(frame);
  }, [ticket, isClosing]);

  useLayoutEffect(() => {
    if (!ticket) return;

    const previousBodyOverflow = document.body.style.overflow;
    const wasScrollLocked = document.body.hasAttribute('data-scroll-locked');
    document.body.setAttribute('data-scroll-locked', '');
    haltSmoothScrollMomentum();
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      if (!wasScrollLocked) document.body.removeAttribute('data-scroll-locked');
    };
  }, [ticket]);

  useEffect(() => {
    if (!ticket) return;

    const preventBackgroundScroll = (event: WheelEvent | TouchEvent) => {
      const modal = document.querySelector<HTMLElement>('[data-ticket-modal-root]');
      if (!modal?.contains(event.target as Node)) event.preventDefault();
    };

    document.addEventListener('wheel', preventBackgroundScroll, { capture: true, passive: false });
    document.addEventListener('touchmove', preventBackgroundScroll, { capture: true, passive: false });

    return () => {
      document.removeEventListener('wheel', preventBackgroundScroll, { capture: true });
      document.removeEventListener('touchmove', preventBackgroundScroll, { capture: true });
    };
  }, [ticket]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    if (ticket) window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [ticket, onClose]);

  if (!ticket) return null;

  const isWideTicket = ticket.isHorizontal || (ticket.gridSpan?.cols ?? 1) >= 4;
  const whatsappMessage = encodeURIComponent(
    `Halo Imah Keramik Bogor, saya mau tanya / booking tiket "${ticket.title}" (${ticket.code}).`
  );
  const whatsappHref = `https://wa.me/628128145417?text=${whatsappMessage}`;
  const showPanels = isVisible && !isClosing;
  const detailMotion = `modal-reveal-panel ${
    showPanels ? 'modal-reveal-panel-visible reveal-delay-1' : ''
  }`;
  const packageMotion = `modal-reveal-panel ${
    showPanels ? 'modal-reveal-panel-visible reveal-delay-2' : ''
  }`;

  return (
    <div data-ticket-modal-root data-lenis-prevent className={`fixed inset-0 z-50 overflow-y-auto overscroll-contain p-3 md:p-6 ${
      isClosing ? 'pointer-events-none' : ''
    }`}>
      <div
        aria-hidden="true"
        className={`modal-scrim fixed inset-0 z-30 ${showPanels ? 'pointer-events-auto' : 'pointer-events-none'}`}
        onMouseDown={onClose}
      >
        <div className={`modal-scrim-blur absolute inset-0 ${showPanels ? 'modal-scrim-blur-visible' : ''}`} />
        <div className={`modal-scrim-dim absolute inset-0 bg-black/45 ${showPanels ? 'modal-scrim-dim-visible' : ''}`} />
      </div>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="activity-detail-heading"
        data-ticket-modal-dialog
        className="relative z-40 mx-auto flex min-h-full w-full max-w-6xl items-center py-12 lg:py-0"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail tiket"
          className="fixed right-4 top-4 z-80 grid h-10 w-10 place-items-center rounded-full border border-background/30 bg-card text-foreground shadow-lg transition-colors hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background md:right-6 md:top-6"
        >
          <X size={19} />
        </button>

        <div className="w-full lg:h-[min(54rem,calc(100dvh-3rem))]">
          {isWideTicket ? (
            <div className="grid gap-4 lg:h-full lg:grid-cols-[minmax(0,1.28fr)_minmax(0,0.72fr)] lg:grid-rows-[14rem_minmax(0,1fr)]">
              <div className="relative z-70 lg:col-span-2 lg:min-h-0">
                <TicketCard key={ticket.id} ticket={ticket} standalone className="relative z-20 h-full w-full" />
              </div>
              <ActivityDetails
                ticket={ticket}
                whatsappHref={whatsappHref}
                className={`${detailMotion} lg:min-h-0 lg:overflow-y-auto`}
              />
              <PackageCards
                ticket={ticket}
                className={`${packageMotion} lg:min-h-0 lg:overflow-y-auto`}
              />
            </div>
          ) : (
            <div className="grid gap-4 lg:h-full lg:grid-cols-[minmax(300px,0.78fr)_minmax(0,1.22fr)] lg:grid-rows-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div className="relative z-70 lg:row-span-2 lg:min-h-0">
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  standalone
                  className="relative z-20 h-full"
                />
              </div>
              <ActivityDetails
                ticket={ticket}
                whatsappHref={whatsappHref}
                className={`${detailMotion} lg:min-h-0 lg:overflow-y-auto`}
              />
              <PackageCards
                ticket={ticket}
                className={`${packageMotion} lg:min-h-0 lg:overflow-y-auto`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
