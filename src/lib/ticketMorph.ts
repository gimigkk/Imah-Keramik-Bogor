export interface MorphController {
  cancel: () => void;
  finished: Promise<void>;
}

/**
 * Animates one ticket between its grid and modal layouts.
 *
 * The catalog owns when a morph starts and ends; this module owns the DOM
 * measurements and temporary styles required to make the transition smooth.
 */
export const morphTicket = (
  element: HTMLElement,
  from: DOMRect,
  to: DOMRect,
  fromLayout: HTMLElement,
  toLayout: HTMLElement,
  currentImageHeight?: number,
  duration = 650,
  zIndex = 60,
  trackDocumentScroll = true,
): MorphController => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (fromLayout.dataset.ticketSurface === 'grid' && toLayout.dataset.ticketSurface === 'modal') {
      const detailIndicatorContainer = element.querySelector<HTMLElement>('[data-ticket-detail-indicator-container]');
      const detailIndicator = element.querySelector<HTMLElement>('[data-ticket-detail-indicator]');
      if (detailIndicatorContainer) {
        detailIndicatorContainer.style.height = '0px';
        detailIndicatorContainer.style.marginTop = '0px';
      }
      if (detailIndicator) {
        detailIndicator.style.opacity = '0';
        detailIndicator.style.transform = 'translateY(10px) scale(0.82)';
      }
    }
    return { cancel: () => undefined, finished: Promise.resolve() };
  }

  const placeholder = element.dataset.ticketSurface === 'ghost' || element.parentElement === document.body
    ? null
    : element.parentElement;
  const placeholderMinHeight = placeholder?.style.minHeight ?? '';
  const body = element.querySelector<HTMLElement>(':scope > .ticket-notch-body');
  const animatedImage = element.querySelector<HTMLElement>('[data-ticket-image]');
  const detailIndicatorContainer = element.querySelector<HTMLElement>('[data-ticket-detail-indicator-container]');
  const detailIndicator = element.querySelector<HTMLElement>('[data-ticket-detail-indicator]');
  const fromImage = fromLayout.querySelector<HTMLElement>('[data-ticket-image]');
  const fromDetailIndicatorContainer = fromLayout.querySelector<HTMLElement>('[data-ticket-detail-indicator-container]');
  const toImage = toLayout.querySelector<HTMLElement>('[data-ticket-image]');
  const toDetailIndicatorContainer = toLayout.querySelector<HTMLElement>('[data-ticket-detail-indicator-container]');
  const fromImageHeight = currentImageHeight ?? fromImage?.getBoundingClientRect().height;
  const toImageHeight = toImage?.getBoundingClientRect().height;
  const originalBodyMinHeight = body?.style.minHeight ?? '';
  const originalBodyOverflow = body?.style.overflow ?? '';
  const originalImageHeight = animatedImage?.style.height ?? '';
  const originalImageMinHeight = animatedImage?.style.minHeight ?? '';
  const originalImageFlex = animatedImage?.style.flex ?? '';
  const originalIndicatorOpacity = detailIndicator?.style.opacity ?? '';
  const originalIndicatorTransform = detailIndicator?.style.transform ?? '';
  const originalIndicatorContainerHeight = detailIndicatorContainer?.style.height ?? '';
  const originalIndicatorContainerMarginTop = detailIndicatorContainer?.style.marginTop ?? '';
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
  if (trackDocumentScroll) window.addEventListener('scroll', syncWithDocumentScroll, { passive: true });

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
      { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` },
      { left: `${to.left}px`, top: `${to.top}px`, width: `${to.width}px`, height: `${to.height}px` },
    ],
    { duration, easing: 'cubic-bezier(.29, .25, .07, .99)', fill: 'both' },
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
    { duration, easing: 'cubic-bezier(.29, .25, .07, .99)', fill: 'both' },
  );
  blurAnimation.pause();
  blurAnimation.currentTime = 0;

  const imageAnimation = animatedImage && fromImageHeight !== undefined && toImageHeight !== undefined
    ? animatedImage.animate(
      [{ height: `${fromImageHeight}px` }, { height: `${toImageHeight}px` }],
      { duration, easing: 'cubic-bezier(.29, .25, .07, .99)', fill: 'both' },
    )
    : null;
  imageAnimation?.pause();
  if (imageAnimation) imageAnimation.currentTime = 0;

  const isOpeningTicket = fromLayout.dataset.ticketSurface === 'grid' && toLayout.dataset.ticketSurface === 'modal';
  const fromIndicatorHeight = fromDetailIndicatorContainer?.getBoundingClientRect().height ?? 0;
  const toIndicatorHeight = toDetailIndicatorContainer?.getBoundingClientRect().height ?? 0;
  const fromIndicatorMarginTop = fromDetailIndicatorContainer
    ? window.getComputedStyle(fromDetailIndicatorContainer).marginTop
    : '0px';
  const toIndicatorMarginTop = toDetailIndicatorContainer
    ? window.getComputedStyle(toDetailIndicatorContainer).marginTop
    : '0px';
  const indicatorContainerAnimation = detailIndicatorContainer
    ? detailIndicatorContainer.animate(
      [
        {
          height: `${fromIndicatorHeight}px`,
          marginTop: fromIndicatorMarginTop,
        },
        {
          height: `${isOpeningTicket ? 0 : toIndicatorHeight}px`,
          marginTop: isOpeningTicket ? '0px' : toIndicatorMarginTop,
        },
      ],
      { duration, easing: 'cubic-bezier(.29, .25, .07, .99)', fill: 'both' },
    )
    : null;
  indicatorContainerAnimation?.pause();
  if (indicatorContainerAnimation) indicatorContainerAnimation.currentTime = 0;
  const indicatorAnimation = detailIndicator
    ? detailIndicator.animate(
      isOpeningTicket
        ? [
            { opacity: 1, transform: 'translateY(0) scale(1)', offset: 0 },
            { opacity: 1, transform: 'translateY(2px) scale(1.08)', offset: 0.25 },
            { opacity: 0, transform: 'translateY(10px) scale(0.82)', offset: 1 },
          ]
        : [
            { opacity: 0, transform: 'translateY(10px) scale(0.82)', offset: 0 },
            { opacity: 1, transform: 'translateY(2px) scale(1.08)', offset: 0.75 },
            { opacity: 1, transform: 'translateY(0) scale(1)', offset: 1 },
          ],
      { duration, easing: 'cubic-bezier(.29, .25, .07, .99)', fill: 'both' },
    )
    : null;
  indicatorAnimation?.pause();
  if (indicatorAnimation) indicatorAnimation.currentTime = 0;

  Object.assign(element.style, {
    left: `${to.left}px`,
    top: `${to.top}px`,
    width: `${to.width}px`,
    height: `${to.height}px`,
  });
  if (animatedImage && toImageHeight !== undefined) animatedImage.style.height = `${toImageHeight}px`;
  animation.play();
  blurAnimation.play();
  imageAnimation?.play();
  indicatorContainerAnimation?.play();
  indicatorAnimation?.play();

  let hasSettled = false;
  let resolveFinished: () => void = () => undefined;
  const finished = new Promise<void>((resolve) => { resolveFinished = resolve; });

  const settle = () => {
    if (hasSettled) return;
    hasSettled = true;
    animation.cancel();
    blurAnimation.cancel();
    imageAnimation?.cancel();
    indicatorContainerAnimation?.cancel();
    indicatorAnimation?.cancel();
    if (trackDocumentScroll) window.removeEventListener('scroll', syncWithDocumentScroll);
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
    if (detailIndicator) {
      detailIndicator.style.opacity = isOpeningTicket ? '0' : originalIndicatorOpacity;
      detailIndicator.style.transform = isOpeningTicket ? 'translateY(10px) scale(0.82)' : originalIndicatorTransform;
    }
    if (detailIndicatorContainer) {
      detailIndicatorContainer.style.height = isOpeningTicket ? '0px' : originalIndicatorContainerHeight;
      detailIndicatorContainer.style.marginTop = isOpeningTicket ? '0px' : originalIndicatorContainerMarginTop;
    }
    resolveFinished();
  };

  void Promise.all([
    animation.finished,
    blurAnimation.finished,
    imageAnimation?.finished,
    indicatorContainerAnimation?.finished,
    indicatorAnimation?.finished,
  ]).then(settle, settle);
  return { cancel: settle, finished };
};

export const clearMorphStyles = (element: HTMLElement): void => {
  for (const property of ['position', 'left', 'top', 'width', 'height', 'margin', 'z-index', 'visibility']) {
    element.style.removeProperty(property);
  }
};

export const getInterruptedDuration = (from: DOMRect, to: DOMRect): number => {
  const distance = Math.hypot(from.left - to.left, from.top - to.top, from.width - to.width, from.height - to.height);
  return Math.min(650, Math.max(100, distance * 1.4));
};
