import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const easeInOutQuart = (x: number): number =>
  x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;

let lenisInstance: Lenis | null = null;

export const haltSmoothScrollMomentum = () => {
  lenisInstance?.scrollTo(window.scrollY, {
    immediate: true,
    force: true,
  });
};

export const getLenis = () => lenisInstance;

const scrollListeners = new Set<(e: any) => void>();

export const subscribeToLenis = (callback: (e: any) => void) => {
  scrollListeners.add(callback);
  if (lenisInstance) {
    lenisInstance.on('scroll', callback);
  }
  return () => {
    scrollListeners.delete(callback);
    if (lenisInstance) {
      lenisInstance.off('scroll', callback);
    }
  };
};

export const SmoothScroll = () => {
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      autoRaf: true,
      autoToggle: true,
      allowNestedScroll: true,
      smoothWheel: true,
      lerp: 0.08,
      virtualScroll: () => !document.body.hasAttribute('data-scroll-locked'),
      stopInertiaOnNavigate: true,
      respectReducedMotion: false,
    });
    lenisInstance = lenis;
    lenis.scrollTo(0, { immediate: true });

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      e.preventDefault();

      if (href === '#top') {
        lenis.scrollTo(0, { duration: 1.35, easing: easeInOutQuart });
      } else {
        const elem = document.querySelector(href);
        if (elem) {
          lenis.scrollTo(elem as HTMLElement, { duration: 1.35, easing: easeInOutQuart });
        }
      }

      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Attach any listeners that subscribed before Lenis was initialized
    scrollListeners.forEach(cb => lenisInstance!.on('scroll', cb));

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      scrollListeners.forEach(cb => lenisInstance?.off('scroll', cb));
      if (lenisInstance === lenis) lenisInstance = null;
      lenis.destroy();
    };
  }, []);

  return null;
};
