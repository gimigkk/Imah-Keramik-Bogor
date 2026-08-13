import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import { X } from 'lucide-react';
import { Ticket } from '../types/ticket';
import { getTicketWhatsappMessage } from '../data/tickets';
import { ActivityDetails } from './ActivityDetails';
import { PackageCards } from './PackageCards';
import { TicketCard } from './TicketCard';
import { pauseSmoothScroll, resumeSmoothScroll } from './SmoothScroll';
import { getWhatsAppUrl } from '../data/site';

interface TicketModalProps {
  ticket: Ticket | null;
  onClose: () => void;
  isClosing: boolean;
}

export const TicketModal: React.FC<TicketModalProps> = ({ ticket, onClose, isClosing }) => {
  const [isVisible, setIsVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useLayoutEffect(() => {
    if (!ticket || isClosing) {
      setIsVisible(false);
      return;
    }

    if (rootRef.current) {
      rootRef.current.scrollTop = 0;
    }

    const frame = window.requestAnimationFrame(() => setIsVisible(true));
    return () => window.cancelAnimationFrame(frame);
  }, [ticket, isClosing]);

  useLayoutEffect(() => {
    if (!ticket || isClosing) return;

    const previousBodyOverflow = document.body.style.overflow;
    pauseSmoothScroll();
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      resumeSmoothScroll();
    };
  }, [ticket, isClosing]);

  useEffect(() => {
    if (!ticket || isClosing) return;

    const preventBackgroundScroll = (event: WheelEvent | TouchEvent) => {
      const modal = rootRef.current ?? document.querySelector<HTMLElement>('[data-ticket-modal-root]');
      if (!modal?.contains(event.target as Node)) event.preventDefault();
    };

    document.addEventListener('wheel', preventBackgroundScroll, { capture: true, passive: false });
    document.addEventListener('touchmove', preventBackgroundScroll, { capture: true, passive: false });

    return () => {
      document.removeEventListener('wheel', preventBackgroundScroll, { capture: true });
      document.removeEventListener('touchmove', preventBackgroundScroll, { capture: true });
    };
  }, [ticket, isClosing]);

  useEffect(() => {
    if (!ticket || isClosing) return;

    const focusFrame = window.requestAnimationFrame(() => {
      if (rootRef.current) {
        rootRef.current.scrollTop = 0;
      }
      dialogRef.current
        ?.querySelector<HTMLElement>('[data-modal-initial-focus]')
        ?.focus({ preventScroll: true });
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.getClientRects().length > 0);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [ticket, isClosing]);

  if (!ticket) return null;

  const isWideTicket = ticket.isHorizontal || (ticket.gridSpan?.cols ?? 1) >= 4;
  const whatsappMessage = getTicketWhatsappMessage(ticket);
  const whatsappHref = getWhatsAppUrl(whatsappMessage);

  const showPanels = isVisible && !isClosing;
  const detailMotion = `modal-reveal-panel ${showPanels ? 'modal-reveal-panel-visible reveal-delay-1' : ''
    }`;
  const packageMotion = `modal-reveal-panel ${showPanels ? 'modal-reveal-panel-visible reveal-delay-2' : ''
    }`;

  return (
    <div ref={rootRef} data-ticket-modal-root data-lenis-prevent className={`fixed inset-0 z-50 overflow-y-auto overscroll-contain px-3 pb-16 pt-14 md:px-6 md:pb-6 md:pt-20 ${isClosing ? 'pointer-events-none' : ''
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
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="activity-detail-heading"
        aria-describedby="activity-detail-description"
        data-ticket-modal-dialog
        className="relative z-40 mx-auto flex min-h-full w-full max-w-6xl items-start lg:items-center pt-2 pb-0 md:pb-6 lg:py-0"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div className={`w-full flex flex-col ${isWideTicket ? 'lg:max-h-[min(54rem,calc(100dvh-6.5rem))]' : ''}`}>
          {isWideTicket ? (
            <div className="grid gap-4 flex-1 min-h-0 lg:grid-cols-[minmax(0,1.28fr)_minmax(0,0.72fr)] lg:grid-rows-[auto_minmax(0,1fr)]">
              <div className="relative z-70 lg:col-span-2 lg:min-h-0">
                <TicketCard key={ticket.id} ticket={ticket} standalone className="relative z-20 h-full w-full" />
              </div>
              <ActivityDetails ticket={ticket} onClose={onClose} className={`${detailMotion} lg:min-h-0 lg:overflow-y-auto`} />
              <PackageCards ticket={ticket} whatsappHref={whatsappHref} className={`${packageMotion} lg:min-h-0 lg:overflow-y-auto`} />
            </div>
          ) : (
            <div className="grid items-start gap-4 lg:grid-cols-[minmax(300px,0.78fr)_minmax(0,1.22fr)]">
              <div className="relative z-70 lg:row-span-2 lg:h-full">
                <TicketCard key={ticket.id} ticket={ticket} standalone className="relative z-20 h-full" />
              </div>
              <ActivityDetails ticket={ticket} onClose={onClose} className={detailMotion} />
              <PackageCards ticket={ticket} whatsappHref={whatsappHref} className={packageMotion} />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Fixed Action Bar (Never shifts when scrolling) */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[80] transition-all duration-300 md:hidden ${showPanels ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
      >
        {/* Dark gradient backdrop with progressive blur behind buttons */}
        <div
          className="pointer-events-none absolute -bottom-2 -left-2 -right-2 h-28 bg-gradient-to-t from-black/70 via-black/30 to-transparent backdrop-blur-md"
          style={{
            maskImage: 'linear-gradient(to top, black 0%, black 70%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, black 70%, transparent 100%)',
          }}
        />

        {/* Buttons (Unmasked & Unblurred) */}
        <div className="relative z-10 flex items-stretch gap-1.5 px-3 pb-5 pt-6">
          {/* Green X Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="flex w-[46px] shrink-0 items-center justify-center rounded-lg border border-foreground/20 bg-foreground text-background shadow-2xl transition-colors hover:bg-foreground/90 active:scale-[0.97]"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          {/* WhatsApp Button */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-foreground/20 bg-primary px-4 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-primary-foreground shadow-2xl transition-colors hover:bg-foreground hover:text-background active:scale-[0.99]"
          >
            <FaWhatsapp size={18} aria-hidden="true" />
            Tanya / pesan via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
