import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const easeInOutQuart = (x: number): number =>
  x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;

let lenisInstance: Lenis | null = null;
type LenisScrollListener = (instance: Lenis) => void;

export const haltSmoothScrollMomentum = () => {
  lenisInstance?.scrollTo(window.scrollY, {
    immediate: true,
    force: true,
  });
};

export const pauseSmoothScroll = () => lenisInstance?.stop();
export const resumeSmoothScroll = () => lenisInstance?.start();

const scrollListeners = new Set<LenisScrollListener>();

export const subscribeToLenis = (callback: LenisScrollListener) => {
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
      autoRaf: false,
      smoothWheel: true,
      lerp: 0.08,
      stopInertiaOnNavigate: true,
    });
    lenisInstance = lenis;
    lenis.scrollTo(0, { immediate: true });

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const handleWindowFocus = () => {
      if (!document.body.style.overflow.includes('hidden')) {
        lenis.start();
      }
      lenis.resize();
    };

    window.addEventListener('focus', handleWindowFocus);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleWindowFocus();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

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
          if (href === '#main-content' && elem instanceof HTMLElement) {
            elem.focus({ preventScroll: true });
          }
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
      cancelAnimationFrame(rafId);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('click', handleAnchorClick);
      scrollListeners.forEach(cb => lenisInstance?.off('scroll', cb));
      if (lenisInstance === lenis) lenisInstance = null;
      lenis.destroy();
    };
  }, []);

  return null;
};
