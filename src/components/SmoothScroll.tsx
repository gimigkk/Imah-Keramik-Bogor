import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const easeOutExpo = (progress: number) =>
  Math.min(1, 1.001 - Math.pow(2, -10 * progress));

export const SmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      autoToggle: true,
      allowNestedScroll: true,
      smoothWheel: true,
      lerp: 0.3,
      stopInertiaOnNavigate: true,
      respectReducedMotion: false,
      anchors: {
        duration: 0.9,
        easing: easeOutExpo,
      },
    });

    return () => lenis.destroy();
  }, []);

  return null;
};
