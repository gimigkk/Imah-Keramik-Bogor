import { useEffect, useState, useCallback, useRef } from 'react';
import { pauseSmoothScroll, resumeSmoothScroll } from '../providers/SmoothScroll';

interface IntroSplashProps {
  onComplete: () => void;
  onMorphStart?: () => void;
}

type IntroTargetRect = Pick<DOMRectReadOnly, 'top' | 'left' | 'width' | 'height'>;

const INTRO_TIMING = {
  holdDuration: 100,
  morphDuration: 800,
  dockFadeDuration: 300,
} as const;

/**
 * Fast Morph Loading Screen:
 * 1. Black clone panel starts fullscreen as a dark load screen.
 * 2. Morphs into #hero-video-container coordinates over 800ms.
 * 3. Fades out over 300ms once docked to reveal video container seamlessly.
 */
export default function IntroSplash({ onComplete, onMorphStart }: IntroSplashProps) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [phase, setPhase] = useState<'hold' | 'morph' | 'docked' | 'done'>('hold');
  const [targetRect, setTargetRect] = useState<IntroTargetRect | null>(null);
  const onCompleteRef = useRef(onComplete);
  const onMorphStartRef = useRef(onMorphStart);
  const hasCompletedRef = useRef(false);
  const hasStartedMorphRef = useRef(false);
  const targetRectRef = useRef<IntroTargetRect | null>(null);
  const holdFinishedRef = useRef(false);

  const finishIntro = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    setPhase('done');
    onCompleteRef.current();
  }, []);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onMorphStartRef.current = onMorphStart;
  }, [onComplete, onMorphStart]);

  useEffect(() => {
    if (reduceMotion) {
      onMorphStartRef.current?.();
      finishIntro();
    }
  }, [reduceMotion, finishIntro]);

  const startMorph = useCallback((rect: IntroTargetRect) => {
    if (hasStartedMorphRef.current) return;
    hasStartedMorphRef.current = true;
    setTargetRect(rect);
    setPhase('morph');
    onMorphStartRef.current?.();
  }, []);

  // Disable scrolling during intro and force scroll position to top
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    pauseSmoothScroll();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      resumeSmoothScroll();
    };
  }, []);

  // IntersectionObserver supplies a post-layout bounding rect. Reading it here
  // avoids forcing a synchronous reflow while preserving the exact morph target.
  useEffect(() => {
    const target = document.getElementById('hero-video-container');
    if (!target) return;

    if (typeof IntersectionObserver === 'undefined') {
      const frameId = window.requestAnimationFrame(() => {
        const rect = target.getBoundingClientRect();
        targetRectRef.current = rect;
        if (holdFinishedRef.current) startMorph(rect);
      });
      return () => window.cancelAnimationFrame(frameId);
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      const { top, left, width, height } = entry.boundingClientRect;
      const rect = { top, left, width, height };
      targetRectRef.current = rect;
      observer.disconnect();

      if (holdFinishedRef.current) startMorph(rect);
    });

    observer.observe(target);
    return () => observer.disconnect();
  }, [startMorph]);

  // Trigger the morph after the original brief initial hold.
  useEffect(() => {
    const tMorph = setTimeout(() => {
      holdFinishedRef.current = true;
      if (targetRectRef.current) startMorph(targetRectRef.current);
    }, INTRO_TIMING.holdDuration);

    return () => clearTimeout(tMorph);
  }, [startMorph]);

  // Wait for morph to finish, then set phase to 'docked'
  useEffect(() => {
    if (phase !== 'morph') return;

    if (!targetRect) {
      finishIntro();
      return;
    }

    const tDock = setTimeout(() => {
      setPhase('docked');
    }, INTRO_TIMING.morphDuration);

    return () => clearTimeout(tDock);
  }, [phase, targetRect, finishIntro]);

  // Fade out clone while docked, then unmount
  useEffect(() => {
    if (phase !== 'docked') return;

    const tFinish = setTimeout(() => {
      finishIntro();
    }, INTRO_TIMING.dockFadeDuration);

    return () => clearTimeout(tFinish);
  }, [phase, finishIntro]);

  if (phase === 'done') return null;

  const isMorphOrDocked = phase === 'morph' || phase === 'docked';
  const style: React.CSSProperties = isMorphOrDocked && targetRect ? {
    top: `${targetRect.top}px`,
    left: `${targetRect.left}px`,
    width: `${targetRect.width}px`,
    height: `${targetRect.height}px`,
    opacity: phase === 'docked' ? 0 : 1,
    transition: phase === 'docked'
      ? 'opacity 300ms ease-out'
      : 'top 800ms cubic-bezier(0.76, 0, 0.24, 1), left 800ms cubic-bezier(0.76, 0, 0.24, 1), width 800ms cubic-bezier(0.76, 0, 0.24, 1), height 800ms cubic-bezier(0.76, 0, 0.24, 1), opacity 300ms ease-out',
  } : {
    top: '0px',
    left: '0px',
    width: '100vw',
    height: '100vh',
    opacity: 1,
  };

  return (
    <div
      className={`intro-clone${isMorphOrDocked ? ' intro-clone--morph' : ''}${phase === 'docked' ? ' intro-clone--docked' : ''}`}
      style={style}
      aria-label="Loading screen"
    />
  );
}
