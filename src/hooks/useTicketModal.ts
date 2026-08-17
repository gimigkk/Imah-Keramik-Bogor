import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import type { Ticket } from '../types/ticket';
import {
  clearMorphStyles,
  getInterruptedDuration,
  morphTicket,
} from '../lib/ticketMorph';
import type { MorphController } from '../lib/ticketMorph';

interface ClosingMorph {
  controller: MorphController;
  element: HTMLElement;
}

interface TicketModalState {
  selectedTicket: Ticket | null;
  hiddenGridTicketId: string | null;
  isClosing: boolean;
  openTicket: (ticket: Ticket) => void;
  closeTicket: () => Promise<void>;
}

type TicketSurface = 'grid' | 'modal';

const getTicketElement = (ticketId: string, surface: TicketSurface): HTMLElement | undefined =>
  Array.from(document.querySelectorAll<HTMLElement>('[data-ticket-id][data-ticket-surface]'))
    .find((element) => element.dataset.ticketId === ticketId && element.dataset.ticketSurface === surface);

/** Owns the ticket modal state, browser history entry, and grid-to-modal morph lifecycle. */
export const useTicketModal = (): TicketModalState => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [hiddenGridTicketId, setHiddenGridTicketId] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const activeMorphRef = useRef<MorphController | null>(null);
  const closingMorphsRef = useRef(new Map<string, ClosingMorph>());
  const interactionVersionRef = useRef(0);
  const pushedHistoryRef = useRef(false);

  const cancelActiveMorph = () => {
    const activeMorph = activeMorphRef.current;
    if (!activeMorph) return;
    activeMorphRef.current = null;
    activeMorph.cancel();
  };

  const openTicket = useCallback((ticket: Ticket) => {
    if (!pushedHistoryRef.current) {
      window.history.pushState({ modalOpen: true }, '', window.location.href);
      pushedHistoryRef.current = true;
    }

    interactionVersionRef.current += 1;
    const outgoingModal = selectedTicket ? getTicketElement(selectedTicket.id, 'modal') : null;
    const closingMorph = closingMorphsRef.current.get(ticket.id);
    const interruptedElement = closingMorph?.element ?? (isClosing && selectedTicket?.id === ticket.id ? outgoingModal : null);
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
      setHiddenGridTicketId(ticket.id);
      setSelectedTicket(ticket);
    });

    const modalTicket = getTicketElement(ticket.id, 'modal');
    if (!source || !sourceRect || !modalTicket) return;

    const detailIndicatorContainer = modalTicket.querySelector<HTMLElement>('[data-ticket-detail-indicator-container]');
    const detailIndicator = modalTicket.querySelector<HTMLElement>('[data-ticket-detail-indicator]');
    if (detailIndicatorContainer) {
      detailIndicatorContainer.style.height = '0px';
      detailIndicatorContainer.style.marginTop = '0px';
    }
    if (detailIndicator) {
      detailIndicator.style.opacity = '0';
      detailIndicator.style.transform = 'translateY(10px) scale(0.82)';
    }

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
  }, [isClosing, selectedTicket]);

  const closeTicket = useCallback(async () => {
    if (!selectedTicket || isClosing) return;
    if (pushedHistoryRef.current) {
      pushedHistoryRef.current = false;
      window.history.back();
    }

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
      if (interactionVersionRef.current === closeVersion) {
        flushSync(() => setHiddenGridTicketId(null));
      }
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
    closingMorphsRef.current.set(closingTicket.id, { controller: morph, element: ghostTicket });
    await morph.finished;
    const registeredMorph = closingMorphsRef.current.get(closingTicket.id);
    if (registeredMorph?.controller === morph) closingMorphsRef.current.delete(closingTicket.id);
    if (interactionVersionRef.current === closeVersion) {
      flushSync(() => setHiddenGridTicketId(null));
    }
    ghostTicket.remove();
    await waitForExit;
    if (interactionVersionRef.current !== closeVersion) return;

    flushSync(() => {
      setSelectedTicket(null);
      setIsClosing(false);
    });
  }, [isClosing, selectedTicket]);

  useEffect(() => {
    const handlePopState = () => {
      if (!pushedHistoryRef.current) return;
      pushedHistoryRef.current = false;
      void closeTicket();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [closeTicket]);

  useEffect(() => () => {
    activeMorphRef.current?.cancel();
    closingMorphsRef.current.forEach(({ controller, element }) => {
      controller.cancel();
      element.remove();
    });
  }, []);

  return { selectedTicket, hiddenGridTicketId, isClosing, openTicket, closeTicket };
};
