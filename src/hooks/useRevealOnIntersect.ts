import { useEffect, useRef, useState } from 'react';

/**
 * Marks an element visible once it enters the viewport.
 *
 * This is used only for one-time entrance animations. It deliberately never
 * resets to `false`, so scrolling away does not replay the animation.
 */
export const useRevealOnIntersect = <T extends Element>(threshold = 0.08) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setIsVisible(true);
      observer.disconnect();
    }, { threshold });

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible] as const;
};
