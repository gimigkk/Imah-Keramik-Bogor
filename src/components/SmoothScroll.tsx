import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const easeOutExpo = (progress: number) =>
  Math.min(1, 1.001 - Math.pow(2, -10 * progress));

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
    const lenis = new Lenis({
      autoRaf: true,
      autoToggle: true,
      allowNestedScroll: true,
      smoothWheel: true,
      lerp: 0.1,
      virtualScroll: () => !document.body.hasAttribute('data-scroll-locked'),
      stopInertiaOnNavigate: true,
      respectReducedMotion: false,
      anchors: {
        duration: 0.9,
        easing: easeOutExpo,
      },
    });
    lenisInstance = lenis;

    // Attach any listeners that subscribed before Lenis was initialized
    scrollListeners.forEach(cb => lenisInstance!.on('scroll', cb));

    return () => {
      scrollListeners.forEach(cb => lenisInstance?.off('scroll', cb));
      if (lenisInstance === lenis) lenisInstance = null;
      lenis.destroy();
    };
  }, []);

  return null;
};
