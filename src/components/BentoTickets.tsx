import React, { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Container } from './Container';
import { bundlingTickets, keramikTickets, membatikTickets, infoUmumTickets } from '../data/tickets';
import { Ticket } from '../types/ticket';
import { TicketCard } from './TicketCard';
import { TileBackground } from './TileBackground';
import { TicketModal } from './TicketModal';

interface MorphController {
  cancel: () => void;
  finished: Promise<void>;
}

interface ClosingMorph {
  controller: MorphController;
  element: HTMLElement;
}

export const BentoTickets: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'keramik' | 'membatik' | 'bundling'>('keramik');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const activeMorphRef = useRef<MorphController | null>(null);
  const closingMorphsRef = useRef(new Map<string, ClosingMorph>());
  const interactionVersionRef = useRef(0);

  useEffect(() => {
    const opts = { threshold: 0.08 };
    const sObs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSectionVisible(true); sObs.disconnect(); } }, opts);
    const iObs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInfoVisible(true); iObs.disconnect(); } }, opts);
    if (sectionRef.current) sObs.observe(sectionRef.current);
    if (infoRef.current) iObs.observe(infoRef.current);
    return () => { sObs.disconnect(); iObs.disconnect(); };
  }, []);

  const getTicketElement = (ticketId: string, surface: 'grid' | 'modal') =>
    document.querySelector<HTMLElement>(
      `[data-ticket-id="${ticketId}"][data-ticket-surface="${surface}"]`
    );

  const morphTicket = (
    element: HTMLElement,
    from: DOMRect,
    to: DOMRect,
    fromLayout: HTMLElement,
    toLayout: HTMLElement,
    currentImageHeight?: number,
    duration = 650,
    zIndex = 60,
    trackDocumentScroll = true,
  ) => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      return {
        cancel: () => undefined,
        finished: Promise.resolve(),
      };
    }

    const placeholder = element.dataset.ticketSurface === 'ghost' || element.parentElement === document.body
      ? null
      : element.parentElement;
    const placeholderMinHeight = placeholder?.style.minHeight ?? '';
    const body = element.querySelector<HTMLElement>(':scope > .ticket-notch-body');
    const animatedImage = element.querySelector<HTMLElement>('[data-ticket-image]');
    const fromImage = fromLayout.querySelector<HTMLElement>('[data-ticket-image]');
    const toImage = toLayout.querySelector<HTMLElement>('[data-ticket-image]');
    const fromImageHeight = currentImageHeight ?? fromImage?.getBoundingClientRect().height;
    const toImageHeight = toImage?.getBoundingClientRect().height;
    const originalBodyMinHeight = body?.style.minHeight ?? '';
    const originalBodyOverflow = body?.style.overflow ?? '';
    const originalImageHeight = animatedImage?.style.height ?? '';
    const originalImageMinHeight = animatedImage?.style.minHeight ?? '';
    const originalImageFlex = animatedImage?.style.flex ?? '';
    const originalTransform = element.style.transform;
    const computedFilter = window.getComputedStyle(element).filter;
    const baseFilter = computedFilter === 'none' ? '' : `${computedFilter} `;
    const travelDistance = Math.hypot(to.left - from.left, to.top - from.top);
    const peakBlur = Math.min(8, Math.max(3, travelDistance / 110));
    const initialScrollX = window.scrollX;
    const initialScrollY = window.scrollY;
    const syncWithDocumentScroll = () => {
      const offsetX = initialScrollX - window.scrollX;
      const offsetY = initialScrollY - window.scrollY;
      element.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    };

    if (placeholder) placeholder.style.minHeight = `${element.getBoundingClientRect().height}px`;
    if (trackDocumentScroll) {
      window.addEventListener('scroll', syncWithDocumentScroll, { passive: true });
    }
    if (body) {
      body.style.minHeight = '0';
      body.style.overflow = 'hidden';
    }
    const initialImageHeight = fromImageHeight ?? toImageHeight;
    if (animatedImage && initialImageHeight !== undefined) {
      Object.assign(animatedImage.style, {
        flex: '0 0 auto',
        height: `${initialImageHeight}px`,
        minHeight: '0',
      });
    }

    Object.assign(element.style, {
      position: 'fixed',
      left: `${from.left}px`,
      top: `${from.top}px`,
      width: `${from.width}px`,
      height: `${from.height}px`,
      margin: '0',
      zIndex: `${zIndex}`,
    });

    const animation = element.animate(
      [
        {
          left: `${from.left}px`,
          top: `${from.top}px`,
          width: `${from.width}px`,
          height: `${from.height}px`,
        },
        {
          left: `${to.left}px`,
          top: `${to.top}px`,
          width: `${to.width}px`,
          height: `${to.height}px`,
        },
      ],
      {
        duration,
        easing: 'cubic-bezier(0.15, 0.01, 0.16, 1.02)',
        fill: 'both',
      }
    );
    animation.pause();
    animation.currentTime = 0;

    const blurAnimation = element.animate(
      [
        { filter: `${baseFilter}blur(0px)`, offset: 0 },
        { filter: `${baseFilter}blur(${peakBlur}px)`, offset: 0.2 },
        { filter: `${baseFilter}blur(${peakBlur * 0.45}px)`, offset: 0.68 },
        { filter: `${baseFilter}blur(0px)`, offset: 1 },
      ],
      {
        duration,
        easing: 'cubic-bezier(0.15, 0.01, 0.16, 1.02)',
        fill: 'both',
      }
    );
    blurAnimation.pause();
    blurAnimation.currentTime = 0;

    const imageAnimation = animatedImage && fromImageHeight !== undefined && toImageHeight !== undefined
      ? animatedImage.animate(
        [
          { height: `${fromImageHeight}px` },
          { height: `${toImageHeight}px` },
        ],
        {
          duration,
          easing: 'cubic-bezier(0.15, 0.01, 0.16, 1.02)',
          fill: 'both',
        }
      )
      : null;
    if (imageAnimation) {
      imageAnimation.pause();
      imageAnimation.currentTime = 0;
    }

    Object.assign(element.style, {
      left: `${to.left}px`,
      top: `${to.top}px`,
      width: `${to.width}px`,
      height: `${to.height}px`,
    });
    if (animatedImage && toImageHeight !== undefined) {
      animatedImage.style.height = `${toImageHeight}px`;
    }
    animation.play();
    blurAnimation.play();
    imageAnimation?.play();

    let hasSettled = false;
    let resolveFinished: () => void = () => undefined;
    const finished = new Promise<void>((resolve) => {
      resolveFinished = resolve;
    });

    const settle = () => {
      if (hasSettled) return;
      hasSettled = true;
      animation.cancel();
      blurAnimation.cancel();
      imageAnimation?.cancel();
      if (trackDocumentScroll) {
        window.removeEventListener('scroll', syncWithDocumentScroll);
      }
      element.style.transform = originalTransform;
      if (placeholder) placeholder.style.minHeight = placeholderMinHeight;
      if (body) {
        body.style.minHeight = originalBodyMinHeight;
        body.style.overflow = originalBodyOverflow;
      }
      if (animatedImage) {
        animatedImage.style.height = originalImageHeight;
        animatedImage.style.minHeight = originalImageMinHeight;
        animatedImage.style.flex = originalImageFlex;
      }
      resolveFinished();
    };

    void Promise.all([animation.finished, blurAnimation.finished, imageAnimation?.finished]).then(settle, settle);

    return {
      cancel: settle,
      finished,
    };
  };

  const cancelActiveMorph = () => {
    const activeMorph = activeMorphRef.current;
    if (!activeMorph) return;
    activeMorphRef.current = null;
    activeMorph.cancel();
  };

  const clearMorphStyles = (element: HTMLElement) => {
    for (const property of ['position', 'left', 'top', 'width', 'height', 'margin', 'z-index', 'visibility']) {
      element.style.removeProperty(property);
    }
  };

  const getInterruptedDuration = (from: DOMRect, to: DOMRect) => {
    const distance = Math.hypot(
      from.left - to.left,
      from.top - to.top,
      from.width - to.width,
      from.height - to.height,
    );
    return Math.min(650, Math.max(100, distance * 1.4));
  };

  const openTicket = (ticket: Ticket) => {
    interactionVersionRef.current += 1;
    const outgoingModal = selectedTicket
      ? getTicketElement(selectedTicket.id, 'modal')
      : null;
    const closingMorph = closingMorphsRef.current.get(ticket.id);
    const interruptedElement = closingMorph?.element
      ?? (isClosing && selectedTicket?.id === ticket.id ? outgoingModal : null);
    const interruptedRect = interruptedElement?.getBoundingClientRect();
    const interruptedImageHeight = interruptedElement
      ?.querySelector<HTMLElement>('[data-ticket-image]')
      ?.getBoundingClientRect().height;

    if (closingMorph) {
      closingMorphsRef.current.delete(ticket.id);
      closingMorph.controller.cancel();
      closingMorph.element.remove();
    }
    cancelActiveMorph();
    if (outgoingModal) clearMorphStyles(outgoingModal);

    const source = getTicketElement(ticket.id, 'grid');
    const sourceRect = interruptedRect ?? source?.getBoundingClientRect();
    flushSync(() => {
      setIsClosing(false);
      setSelectedTicket(ticket);
    });

    const modalTicket = getTicketElement(ticket.id, 'modal');
    if (!source || !sourceRect || !modalTicket) return;

    const targetRect = modalTicket.getBoundingClientRect();
    const morph = morphTicket(
      modalTicket,
      sourceRect,
      targetRect,
      interruptedElement ?? source,
      modalTicket,
      interruptedImageHeight,
      interruptedRect ? getInterruptedDuration(sourceRect, targetRect) : 650,
      60,
      false,
    );
    activeMorphRef.current = morph;
    void morph.finished.then(() => {
      if (activeMorphRef.current !== morph) return;
      clearMorphStyles(modalTicket);
      activeMorphRef.current = null;
    });
  };

  const closeTicket = async () => {
    if (!selectedTicket || isClosing) return;

    const closingTicket = selectedTicket;
    const closeVersion = ++interactionVersionRef.current;
    const isInterrupting = activeMorphRef.current !== null;
    const modalTicket = getTicketElement(closingTicket.id, 'modal');
    const gridTicket = getTicketElement(closingTicket.id, 'grid');
    const sourceRect = modalTicket?.getBoundingClientRect();
    const currentImageHeight = modalTicket
      ?.querySelector<HTMLElement>('[data-ticket-image]')
      ?.getBoundingClientRect().height;
    const ghostTicket = modalTicket?.cloneNode(true) as HTMLElement | undefined;
    if (ghostTicket) {
      ghostTicket.dataset.ticketSurface = 'ghost';
      ghostTicket.setAttribute('aria-hidden', 'true');
      ghostTicket.style.pointerEvents = 'none';
      const modalDialog = modalTicket?.closest<HTMLElement>('[data-ticket-modal-dialog]');
      (modalDialog ?? document.body).appendChild(ghostTicket);
    }

    cancelActiveMorph();
    if (modalTicket) {
      clearMorphStyles(modalTicket);
      modalTicket.style.visibility = 'hidden';
    }
    flushSync(() => setIsClosing(true));
    const exitDuration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 400;
    const waitForExit = new Promise<void>((resolve) => window.setTimeout(resolve, exitDuration));

    if (!modalTicket || !gridTicket || !ghostTicket || !sourceRect) {
      ghostTicket?.remove();
      await waitForExit;
      if (interactionVersionRef.current === closeVersion) {
        setSelectedTicket(null);
        setIsClosing(false);
      }
      return;
    }

    const targetRect = gridTicket.getBoundingClientRect();
    const morph = morphTicket(
      ghostTicket,
      sourceRect,
      targetRect,
      ghostTicket,
      gridTicket,
      currentImageHeight,
      isInterrupting ? getInterruptedDuration(sourceRect, targetRect) : 650,
      50,
    );
    closingMorphsRef.current.set(closingTicket.id, {
      controller: morph,
      element: ghostTicket,
    });
    await morph.finished;
    const registeredMorph = closingMorphsRef.current.get(closingTicket.id);
    if (registeredMorph?.controller === morph) {
      closingMorphsRef.current.delete(closingTicket.id);
    }
    ghostTicket.remove();
    await waitForExit;
    if (interactionVersionRef.current !== closeVersion) return;

    flushSync(() => {
      setSelectedTicket(null);
      setIsClosing(false);
    });
  };

  return (
    <section ref={sectionRef} id="activities" className="py-20 md:py-24 bg-card border-b border-foreground/10 relative">
      <TileBackground />

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="mb-6 md:mb-6 flex flex-col md:flex-row justify-between items-center md:items-end gap-8 border-b border-foreground/20 pb-4">
          <div className="w-full text-center md:text-left">
            <h2 className="font-serif text-5xl md:text-8xl text-foreground uppercase tracking-tighter leading-[0.85]">
              Aktivitas Kita.
            </h2>
          </div>
          <p className="text-muted-foreground font-sans text-sm max-w-sm mt-0 text-center md:text-right text-balance">
            Pilih tiket untuk mendaftar. Tempat sangat terbatas untuk memastikan perhatian individu secara maksimal
          </p>
        </div>

        {/* Activity category tabs */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-row w-full sm:w-auto gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('keramik')}
              className={`flex-1 sm:flex-none px-2 sm:px-5 py-2 font-mono text-[9px] sm:text-xs uppercase tracking-widest font-bold border transition-colors ${activeTab === 'keramik'
                ? 'bg-foreground text-background border-foreground'
                : 'bg-transparent text-foreground/70 border-foreground/20 hover:border-foreground/50 hover:text-foreground'
                }`}
            >
              Keramik
            </button>
            <button
              onClick={() => setActiveTab('membatik')}
              className={`flex-1 sm:flex-none px-2 sm:px-5 py-2 font-mono text-[9px] sm:text-xs uppercase tracking-widest font-bold border transition-colors ${activeTab === 'membatik'
                ? 'bg-foreground text-background border-foreground'
                : 'bg-transparent text-foreground/70 border-foreground/20 hover:border-foreground/50 hover:text-foreground'
                }`}
            >
              Membatik Kayu
            </button>
            <button
              onClick={() => setActiveTab('bundling')}
              className={`flex-1 sm:flex-none px-2 sm:px-5 py-2 font-mono text-[9px] sm:text-xs uppercase tracking-widest font-bold border transition-colors ${activeTab === 'bundling'
                ? 'bg-foreground text-background border-foreground'
                : 'bg-transparent text-foreground/70 border-foreground/20 hover:border-foreground/50 hover:text-foreground'
                }`}
            >
              Bundling
            </button>
          </div>

          <span className="hidden md:inline-block font-mono text-xs text-muted-foreground uppercase tracking-widest">
            {activeTab === 'keramik' && '3 Pilihan Kelas'}
            {activeTab === 'membatik' && '4 Pilihan Paket'}
            {activeTab === 'bundling' && '2 Pilihan Bundling'}
          </span>
        </div>

        {/* TAB 1: KERAMIK (4-column Bento Grid) */}
        {activeTab === 'keramik' && (
          <div key="keramik" className="grid grid-cols-1 gap-3 md:grid-cols-4 mb-20">
            {keramikTickets.map((ticket, i) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={openTicket}
                className={sectionVisible ? 'ticket-enter-y' : ''}
                style={{ '--stagger-delay': `${i * 80}ms` } as React.CSSProperties}
              />
            ))}
          </div>
        )}

        {/* TAB 2: MEMBATIK KAYU (4-column Bento Grid) */}
        {activeTab === 'membatik' && (
          <div key="membatik" className="grid grid-cols-1 gap-3 md:grid-cols-4 mb-20">
            {membatikTickets.map((ticket, i) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={openTicket}
                className={sectionVisible ? 'ticket-enter-y' : ''}
                style={{ '--stagger-delay': `${i * 80}ms` } as React.CSSProperties}
              />
            ))}
          </div>
        )}

        {/* TAB 3: BUNDLING (Full-width combination tickets — horizontal, X-axis rotation) */}
        {activeTab === 'bundling' && (
          <div key="bundling" className="grid grid-cols-1 gap-3 md:grid-cols-4 mb-20">
            {bundlingTickets.map((ticket, i) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={openTicket}
                className={sectionVisible ? 'ticket-enter-x' : ''}
                style={{ '--stagger-delay': `${i * 80}ms` } as React.CSSProperties}
              />
            ))}
          </div>
        )}

        {/* INFO UMUM SECTION (Always visible below tabs, text-only, 2-column grid) */}
        <div ref={infoRef} className="pt-12 border-t-2 border-dashed border-foreground/20">
          <div className="mb-8 text-center md:text-left">
            <h3 className="font-serif text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">
              <span className="md:hidden">Informasi Umum</span>
              <span className="hidden md:inline">Informasi Umum & Sewa</span>
            </h3>
            <p className="font-sans text-xs md:text-sm text-muted-foreground text-balance">
              Tiket masuk studio, workshop kustom, paket usaha expert, dan penyewaan aula.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            {infoUmumTickets.map((ticket, i) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={openTicket}
                className={infoVisible ? 'ticket-enter-y' : ''}
                style={{ '--stagger-delay': `${i * 80}ms` } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      </Container>

      {/* Ticket Modal Overlay */}
      <TicketModal
        ticket={selectedTicket}
        onClose={closeTicket}
        isClosing={isClosing}
      />
    </section>
  );
};

export default BentoTickets;
